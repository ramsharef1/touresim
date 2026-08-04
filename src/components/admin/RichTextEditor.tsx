'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef } from 'react'

interface Props {
  name: string
  defaultValue?: string
  placeholder?: string
}

export default function RichTextEditor({ name, defaultValue = '', placeholder = 'Start writing…' }: Props) {
  const hiddenRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      if (hiddenRef.current) hiddenRef.current.value = editor.getHTML()
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[320px] px-4 py-3 focus:outline-none',
      },
    },
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#b19566]/40">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-gray-100 px-2 py-1.5 bg-gray-50">
        {[
          { label: 'B', title: 'Bold', cmd: () => editor?.chain().focus().toggleBold().run(), active: () => editor?.isActive('bold') },
          { label: 'I', title: 'Italic', cmd: () => editor?.chain().focus().toggleItalic().run(), active: () => editor?.isActive('italic') },
          { label: 'H2', title: 'Heading 2', cmd: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: () => editor?.isActive('heading', { level: 2 }) },
          { label: 'H3', title: 'Heading 3', cmd: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: () => editor?.isActive('heading', { level: 3 }) },
          { label: '• List', title: 'Bullet list', cmd: () => editor?.chain().focus().toggleBulletList().run(), active: () => editor?.isActive('bulletList') },
          { label: '1. List', title: 'Ordered list', cmd: () => editor?.chain().focus().toggleOrderedList().run(), active: () => editor?.isActive('orderedList') },
          { label: '""', title: 'Blockquote', cmd: () => editor?.chain().focus().toggleBlockquote().run(), active: () => editor?.isActive('blockquote') },
          { label: '↩', title: 'Undo', cmd: () => editor?.chain().focus().undo().run(), active: () => false },
          { label: '↪', title: 'Redo', cmd: () => editor?.chain().focus().redo().run(), active: () => false },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onClick={btn.cmd}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              btn.active?.() ? 'bg-[#0a1628] text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} />
    </div>
  )
}
