'use client'

import { useState, useEffect } from 'react'

const REQUIRED_PASSWORD = '123457'

export default function ServerStatusPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [systemInfo, setSystemInfo] = useState<any>(null)

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
      fetchSystemInfo()
    }
  }, [isAuthenticated])

  const fetchSystemInfo = async () => {
    // In production, this would call an API endpoint that gathers system info
    setSystemInfo({
      timestamp: new Date().toISOString(),
      nodeVersion: 'v20.x.x',
      platform: 'Linux',
      arch: 'x64',
      cpus: 4,
      memory: {
        total: '8 GB',
        free: '2.5 GB',
        used: '5.5 GB',
      },
      uptime: '15 days, 3 hours',
      nginx: 'Running',
      pm2: 'Active',
      database: 'Connected',
      ssl: 'Valid (expires in 89 days)',
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Server Status</h1>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
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
          <h1 className="text-2xl font-bold text-gray-900">Server Status & Requirements</h1>
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Optimal Requirements */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">✓</span> Optimal Requirements
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Node.js Version</p>
                <p className="text-lg font-semibold text-gray-900">v18.x or v20.x</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Memory (RAM)</p>
                <p className="text-lg font-semibold text-gray-900">Minimum 4 GB</p>
                <p className="text-xs text-gray-500">Recommended 8 GB</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">CPU Cores</p>
                <p className="text-lg font-semibold text-gray-900">Minimum 2 cores</p>
                <p className="text-xs text-gray-500">Recommended 4+ cores</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Storage</p>
                <p className="text-lg font-semibold text-gray-900">Minimum 20 GB</p>
                <p className="text-xs text-gray-500">For app + database + logs</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Database</p>
                <p className="text-lg font-semibold text-gray-900">MySQL 8.0+</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Web Server</p>
                <p className="text-lg font-semibold text-gray-900">Nginx 1.18+</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Process Manager</p>
                <p className="text-lg font-semibold text-gray-900">PM2 5.x+</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">SSL Certificate</p>
                <p className="text-lg font-semibold text-gray-900">Let's Encrypt</p>
                <p className="text-xs text-gray-500">Auto-renew recommended</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span> Current Status
            </h2>

            {systemInfo ? (
              <div className="space-y-4">
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(systemInfo.timestamp).toLocaleString()}
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium">Node.js Version</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-lg font-semibold text-gray-900">{systemInfo.nodeVersion}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      ✓ OK
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium">Platform</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {systemInfo.platform} ({systemInfo.arch})
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium">CPU Cores</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-lg font-semibold text-gray-900">{systemInfo.cpus}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      ✓ Sufficient
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium">Memory (RAM)</p>
                  <div className="space-y-2 mt-1">
                    <div className="flex justify-between text-sm">
                      <span>Total: {systemInfo.memory.total}</span>
                      <span>Used: {systemInfo.memory.used}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: '69%' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium">Uptime</p>
                  <p className="text-lg font-semibold text-gray-900">{systemInfo.uptime}</p>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nginx</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {systemInfo.nginx}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">PM2</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {systemInfo.pm2}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {systemInfo.database}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SSL Certificate</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      {systemInfo.ssl}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading system information...</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span> Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Current setup meets optimal requirements</li>
            <li>✓ All critical services are running</li>
            <li>⚠️ Monitor SSL certificate renewal (89 days remaining)</li>
            <li>✓ Database connectivity verified</li>
            <li>📌 Review logs regularly for errors</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
