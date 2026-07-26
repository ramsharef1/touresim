import { revalidatePath } from 'next/cache'
import { requireAdminAuth } from '../auth'
import { AdminNav } from '../nav'
import {
  adminListSources,
  adminUpdateSourceUrl,
  adminRefreshSource,
  adminUploadSource,
} from '../lib'

// ── Server actions ────────────────────────────────────────────────────────

async function saveUrlAction(formData: FormData) {
  'use server'
  const id = Number(formData.get('id'))
  const url = String(formData.get('sourceUrl') ?? '').trim()
  if (id && url) await adminUpdateSourceUrl(id, url)
  revalidatePath('/admin/sources')
}

async function refreshAction(formData: FormData) {
  'use server'
  const id = Number(formData.get('id'))
  if (id) await adminRefreshSource(id)
  revalidatePath('/admin/sources')
}

async function uploadAction(formData: FormData) {
  'use server'
  const id = Number(formData.get('id'))
  const file = formData.get('file') as File | null
  if (id && file && file.size > 0) {
    const raw = await file.text()
    await adminUploadSource(id, raw)
  }
  revalidatePath('/admin/sources')
}

// ── UI helpers ──────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  applied: { label: 'Applied', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  open: { label: 'Open', cls: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  blocked: { label: 'Blocked', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

function timeAgo(d: Date | null): string {
  if (!d) return 'never'
  const secs = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

export default async function SourcesPage() {
  await requireAdminAuth()
  const sources = await adminListSources()

  const counts = {
    applied: sources.filter((s) => s.status === 'applied').length,
    open: sources.filter((s) => s.status === 'open').length,
    blocked: sources.filter((s) => s.status === 'blocked').length,
  }

  return (
    <>
      <AdminNav />
      <main className="p-6 max-w-6xl mx-auto">
        <div className="mb-2 flex items-end justify-between">
          <h1 className="text-2xl font-bold">Data Sources</h1>
          <div className="flex gap-3 text-sm">
            <span className="text-emerald-400">{counts.applied} applied</span>
            <span className="text-sky-400">{counts.open} open</span>
            <span className="text-red-400">{counts.blocked} blocked</span>
          </div>
        </div>
        <p className="mb-8 text-sm text-zinc-400">
          Edit a source URL and <strong>Refresh</strong> to re-fetch & re-import open sources. For
          blocked sources, open the link, download the data, and <strong>Upload</strong> it to inject
          into the database. Sources with an importer write straight into the live tables.
        </p>

        <div className="flex flex-col gap-4">
          {sources.map((s) => {
            const badge = STATUS_BADGE[s.status] ?? STATUS_BADGE.open
            const refreshOk = s.lastRefreshStatus && !s.lastRefreshStatus.startsWith('Error')
            return (
              <div key={s.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <a
                        href={s.sourceUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="font-semibold text-amber-400 hover:underline"
                      >
                        {s.name} ↗
                      </a>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                      {s.importerKey && (
                        <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                          importer: {s.importerKey}
                        </span>
                      )}
                    </div>
                    {s.contents && <p className="mt-1 text-sm text-zinc-400">{s.contents}</p>}
                    {s.note && <p className="mt-0.5 text-xs text-zinc-500">{s.note}</p>}
                  </div>
                  <div className="text-right text-xs text-zinc-500">
                    <p>{s.format}</p>
                    {s.recordCount != null && <p className="text-zinc-400">{s.recordCount.toLocaleString()} records</p>}
                    <p>refreshed {timeAgo(s.lastRefreshedAt)}</p>
                  </div>
                </div>

                {/* Edit URL */}
                <form action={saveUrlAction} className="mt-4 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <input
                    name="sourceUrl"
                    defaultValue={s.sourceUrl}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 focus:border-amber-400 focus:outline-none"
                  />
                  <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-amber-400 hover:text-white">
                    Save URL
                  </button>
                </form>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {s.status !== 'blocked' && (
                    <form action={refreshAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-amber-300">
                        {s.importerKey ? 'Refresh & import' : 'Refresh snapshot'}
                      </button>
                    </form>
                  )}
                  <form action={uploadAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <input
                      type="file"
                      name="file"
                      className="text-xs text-zinc-400 file:mr-2 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-zinc-200 hover:file:bg-zinc-600"
                    />
                    <button className="rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:border-amber-400 hover:text-white">
                      {s.importerKey ? 'Upload & import' : 'Upload snapshot'}
                    </button>
                  </form>
                </div>

                {s.lastRefreshStatus && (
                  <p className={`mt-2 text-xs ${refreshOk ? 'text-emerald-400' : 'text-red-400'}`}>
                    {s.lastRefreshStatus}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
