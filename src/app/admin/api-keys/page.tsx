'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, Plus, Trash2, Check } from 'lucide-react'

interface ApiKey {
  id: number
  name: string
  provider?: string
  status: 'active' | 'inactive' | 'expired'
  lastUsed?: string
  updatedAt: string
}

export default function ApiKeysAdminPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    secretKey: '',
    provider: '',
    notes: '',
  })
  const [showKey, setShowKey] = useState<number | null>(null)
  const [adminSecret, setAdminSecret] = useState('')

  // Fetch keys
  useEffect(() => {
    if (!adminSecret) return

    const fetchKeys = async () => {
      try {
        const res = await fetch('/api/admin/api-keys', {
          headers: { Authorization: `Bearer ${adminSecret}` },
        })
        if (res.ok) {
          const data = await res.json()
          setKeys(data.data)
        }
      } catch (error) {
        console.error('Error fetching API keys:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchKeys()
  }, [adminSecret])

  // Save key
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.key) {
      alert('Name and Key are required')
      return
    }

    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert('API key saved!')
        setFormData({ name: '', key: '', secretKey: '', provider: '', notes: '' })
        setShowForm(false)
        // Refresh list
        const refreshRes = await fetch('/api/admin/api-keys', {
          headers: { Authorization: `Bearer ${adminSecret}` },
        })
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          setKeys(data.data)
        }
      } else {
        alert('Failed to save API key')
      }
    } catch (error) {
      console.error('Error saving API key:', error)
      alert('Error saving API key')
    }
  }

  // Delete key
  const handleDelete = async (id: number) => {
    if (!confirm('Deactivate this API key?')) return

    try {
      const res = await fetch(`/api/admin/api-keys?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminSecret}` },
      })

      if (res.ok) {
        setKeys(keys.filter((k) => k.id !== id))
        alert('API key deactivated')
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
    }
  }

  // Auth check
  if (!adminSecret) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-2xl font-bold mb-4">Admin: API Keys</h1>
            <p className="text-gray-600 mb-4">Enter admin secret to access</p>
            <input
              type="password"
              placeholder="Admin Secret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={() => setAdminSecret(adminSecret)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Login
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> Add Key
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Key Name (e.g., booking)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Provider (e.g., Booking.com)"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <textarea
                placeholder="API Key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                rows={3}
                required
              />

              <textarea
                placeholder="Secret Key (optional)"
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                rows={2}
              />

              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={2}
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                >
                  Save Key
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Keys List */}
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : keys.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No API keys configured
            </div>
          ) : (
            keys.map((key) => (
              <div key={key.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {key.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          key.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {key.status}
                      </span>
                      {key.status === 'active' && <Check size={16} className="text-green-600" />}
                    </div>

                    {key.provider && (
                      <p className="text-sm text-gray-600 mb-2">Provider: {key.provider}</p>
                    )}

                    {key.lastUsed && (
                      <p className="text-sm text-gray-500">
                        Last used:{' '}
                        {new Date(key.lastUsed).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(key.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Status Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
          <p>
            <strong>ℹ️ How it works:</strong> API keys added here will be used by the application. The system falls back to environment variables if a key is not found in the database.
          </p>
        </div>
      </div>
    </main>
  )
}
