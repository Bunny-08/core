import React from 'react';
import { Users, Shield, Activity, Database, Lock } from 'lucide-react';

export default function AdminView({ stats }) {
  const adminStats = [
    { label: 'System Status', value: 'Healthy', icon: <Activity className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Total Users', value: '1', icon: <Users className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Database Size', value: '12.4 MB', icon: <Database className="text-purple-500" />, color: 'bg-purple-50' },
    { label: 'Security Level', value: 'High', icon: <Shield className="text-orange-500" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <Shield size={24} />
          </div>
          <h2 className="text-3xl font-bold dark:text-white">Admin Control Panel</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Manage system-wide settings, users, and infrastructure.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <Users size={20} className="text-orange-600" />
            User Management
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Badrujama (Admin)
                  </p>
                  <p className="text-xs text-gray-500">
                    badrujama@example.in
                  </p>
                </div>
              </div>

              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                Active
              </span>
            </div>

            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-orange-500 hover:text-orange-600 transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Invite New User
            </button>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-orange-600" />
            System Logs
          </h3>

          <div className="space-y-3">
            {[
              { event: 'User Login', time: '10 mins ago', user: 'Badrujama' },
              { event: 'Task Created', time: '1 hour ago', user: 'System' },
              { event: 'Database Backup', time: '4 hours ago', user: 'Cron' },
              { event: 'Theme Updated', time: '6 hours ago', user: 'Badrujama' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">{log.event}</p>
                  <p className="text-xs text-gray-400">By {log.user}</p>
                </div>
                <span className="text-xs text-gray-400">{log.time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Plus({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
