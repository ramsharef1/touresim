'use client'

import { Share2, Twitter, Facebook, Linkedin, Mail, Copy } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  description?: string
  className?: string
}

export function ShareButtons({
  title,
  description = '',
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + ' ' + currentUrl)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="text-sm text-gray-600 font-medium">Share:</span>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-blue-100 text-blue-500 transition-colors"
        title="Share on Twitter"
      >
        <Twitter size={18} />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-blue-100 text-blue-700 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>

      <a
        href={shareLinks.email}
        className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
        title="Share via Email"
      >
        <Mail size={18} />
      </a>

      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-full transition-colors ${
          copied
            ? 'bg-green-100 text-green-600'
            : 'hover:bg-gray-200 text-gray-600'
        }`}
        title="Copy link"
      >
        <Copy size={18} />
      </button>

      {copied && (
        <span className="text-xs text-green-600 font-medium">
          Copied!
        </span>
      )}
    </div>
  )
}
