import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle } from 'lucide-react';

export default function SettingsView({ user, onUpdateUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState(user.theme);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateUser({ name, email, theme });
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 dark:text-white">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and application settings.</p>
        </div>
      </header>

      <div className="space-y-6">
        <SettingsSection 
          title="Profile Settings" 
          description="Update your personal information and public profile."
          icon={<User className="text-blue-500" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all text-gray-900" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all text-gray-900" 
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Notifications" 
          description="Configure how you want to receive updates and alerts."
          icon={<Bell className="text-amber-500" />}
        >
          <div className="space-y-4">
            <Toggle 
              label="Email Notifications" 
              description="Receive daily task summaries via email." 
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
            <Toggle 
              label="Push Notifications" 
              description="Get real-time alerts on your desktop." 
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
            />
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Appearance" 
          description="Customize the look and feel of your workspace."
          icon={<Palette className="text-purple-500" />}
        >
          <div className="flex gap-4">
            <div 
              onClick={() => setTheme('light')}
              className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${theme === 'light' ? 'bg-white border-orange-500 shadow-md' : 'bg-white border-transparent hover:border-gray-200'}`}
            >
              <div className="w-10 h-6 bg-gray-100 rounded mb-2 border border-gray-200" />
              <span className={`text-xs font-bold ${theme === 'light' ? 'text-orange-600' : 'text-gray-400'}`}>Light</span>
            </div>
            <div 
              onClick={() => setTheme('dark')}
              className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${theme === 'dark' ? 'bg-white border-orange-500 shadow-md' : 'bg-white border-transparent hover:border-gray-200'}`}
            >
              <div className="w-10 h-6 bg-gray-800 rounded mb-2 border border-gray-700" />
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-orange-600' : 'text-gray-500'}`}>Dark</span>
            </div>
          </div>
        </SettingsSection>

        <div className="flex items-center justify-end gap-4 pt-4">
          {showSaved && (
            <span className="text-sm font-bold text-emerald-600 animate-in fade-in slide-in-from-right-2 duration-300">
              Changes saved successfully!
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, description, icon, children }) {
  return (
    <section className="bg-white p-8 rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">{icon}</div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between group">
      <div>
        <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div 
        onClick={onChange}
        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${checked ? 'bg-orange-500' : 'bg-white-200 dark:bg-gray-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}
