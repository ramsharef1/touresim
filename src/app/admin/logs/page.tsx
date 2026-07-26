'use client'

import { useState, useEffect } from 'react'

const REQUIRED_PASSWORD = '123457'

type LogLevel = 'error' | 'warning' | 'info' | 'debug'
type LogEntry = {
  timestamp: string
  level: LogLevel
  message: string
  source: string
  details?: string
}

export default function LogsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState<'all' | LogLevel>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === REQUIRED_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
      localStorage.setItem('admin_auth_' + Date.now() % 1000, 'true')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs()
      if (autoRefresh) {
        const interval = setInterval(fetchLogs, 5000)
        return () => clearInterval(interval)
      }
    }
  }, [isAuthenticated, autoRefresh])

  const fetchLogs = async () => {
    // Mock logs - in production, this would fetch from server logs
    const mockLogs: LogEntry[] = [
      {
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        level: 'info',
        message: 'User accessed /visa-checker',
        source: 'app.log',
        details: 'GET /visa-checker - 200 OK - 245ms',
      },
      {
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        level: 'info',
        message: 'Database query executed',
        source: 'db.log',
        details: 'SELECT * FROM countries - returned 132 rows in 125ms',
      },
      {
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        level: 'warning',
        message: 'High memory usage detected',
        source: 'system.log',
        details: 'Memory usage: 72% of available RAM',
      },
      {
        timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
        level: 'info',
        message: 'API request to search endpoint',
        source: 'api.log',
        details: 'POST /api/search?q=paris - returned 42 results in 98ms',
      },
      {
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        level: 'error',
        message: 'Database connection timeout',
        source: 'db.log',
        details: 'Connection attempt failed after 30s. Retrying...',
      },
      {
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        level: 'info',
        message: 'Nginx reverse proxy processing request',
        source: 'nginx.log',
        details: 'Routing request to localhost:3000',
      },
      {
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        level: 'warning',
        message: 'Slow page load detected',
        source: 'performance.log',
        details: '/france page took 2.3s to render (threshold: 2s)',
      },
      {
        timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
        level: 'info',
        message: 'SSL certificate valid',
        source: 'ssl.log',
        details: 'Certificate expires in 89 days - renewal scheduled',
      },
      {
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        level: 'debug',
        message: 'Cache hit for country data',
        source: 'cache.log',
        details: 'Served from Redis cache in 12ms',
      },
      {
        timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
        level: 'info',
        message: 'PM2 process health check',
        source: 'pm2.log',
        details: 'All processes running normally - CPU: 15%, Memory: 2.3GB',
      },
    ]

    setLogs(mockLogs)
  }

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.level === filter
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    return matchesFilter && matchesSearch
  })

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'debug':
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      case 'debug':
        return '🐛'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Logs & Diagnostics</h1>
          <p className="text-gray-600 text-sm mb-6">
            Protected Admin Area - Enter password to access
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleLogin(e as any)
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Unlock
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            ⚠️ Unauthorized access is prohibited
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Logs & Diagnostics</h1>
          <button
            onClick={() => {
              setIsAuthenticated(false)
              setPassword('')
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'error', 'warning', 'info', 'debug'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === level
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">Auto-refresh (every 5s)</span>
            </label>

            <button
              onClick={fetchLogs}
              className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Refresh Now
            </button>
          </div>

          <div className="text-xs text-gray-500">
            {filteredLogs.length} log entries
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className={`rounded-lg border p-4 ${getLevelColor(log.level)}`}
              >
                <div className="flex gap-3">
                  <span className="text-xl flex-shrink-0">{getLevelIcon(log.level)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <p className="font-semibold break-words">{log.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs font-mono bg-black/10 px-2 py-1 rounded whitespace-nowrap">
                        {log.source}
                      </span>
                    </div>

                    {log.details && (
                      <details className="mt-3 text-sm">
                        <summary className="cursor-pointer font-medium opacity-75 hover:opacity-100">
                          Details
                        </summary>
                        <div className="mt-2 bg-black/10 p-3 rounded font-mono text-xs break-all">
                          {log.details}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">No logs found matching your filters</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {logs.filter((l) => l.level === 'error').length}
            </p>
            <p className="text-sm text-red-700 mt-1">Errors</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {logs.filter((l) => l.level === 'warning').length}
            </p>
            <p className="text-sm text-yellow-700 mt-1">Warnings</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {logs.filter((l) => l.level === 'info').length}
            </p>
            <p className="text-sm text-blue-700 mt-1">Info</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-600">
              {logs.filter((l) => l.level === 'debug').length}
            </p>
            <p className="text-sm text-gray-700 mt-1">Debug</p>
          </div>
        </div>

        {/* Useful Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 What Each Log Level Means</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-semibold text-red-700">🔴 Errors</p>
              <p className="text-sm text-gray-700">Critical issues preventing normal operation</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-700">🟡 Warnings</p>
              <p className="text-sm text-gray-700">Non-critical issues worth monitoring</p>
            </div>
            <div>
              <p className="font-semibold text-blue-700">🔵 Info</p>
              <p className="text-sm text-gray-700">Normal operational events</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">⚫ Debug</p>
              <p className="text-sm text-gray-700">Detailed diagnostic information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
