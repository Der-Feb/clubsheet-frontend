import {
  Building,
  Bell,
  Palette,
  Sliders,
  AlertTriangle,
  Upload,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Configure club workspace details, operational preferences, and notification channels.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#005F31] px-4 py-2 text-xs font-semibold text-white hover:bg-[#01562D] shadow-xs"
        >
          <Check className="h-3.5 w-3.5" />
          Save Changes
        </button>
      </div>

      {/* Main Settings Card with internal navigation tabs */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 px-6 pt-4 gap-6 text-xs font-medium overflow-x-auto">
          <button
            type="button"
            className="pb-3 border-b-2 border-[#005F31] text-[#005F31] font-bold flex items-center gap-2"
          >
            <Building className="h-4 w-4" />
            Club Profile
          </button>
          <button
            type="button"
            className="pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-800 flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button
            type="button"
            className="pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-800 flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Appearance
          </button>
          <button
            type="button"
            className="pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-800 flex items-center gap-2"
          >
            <Sliders className="h-4 w-4" />
            Preferences
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="p-6 space-y-6">
          {/* Club Identity Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-900">Club Identity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Official Club Name
                </label>
                <input
                  type="text"
                  defaultValue="Kigali Football Club"
                  className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#005F31]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Abbreviation / Short Name
                </label>
                <input
                  type="text"
                  defaultValue="KFC"
                  className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#005F31]"
                />
              </div>
            </div>

            {/* Club Logo / Emblem */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Club Crest / Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#005F31] text-lg font-bold text-white shadow-xs">
                  KFC
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs"
                  >
                    <Upload className="h-3 w-3 text-zinc-500" />
                    Upload new crest
                  </button>
                  <p className="text-[11px] text-zinc-400">
                    PNG, SVG or JPEG up to 2MB. Recommended 512x512px.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Regional & Timezone */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-900">
              Regional & Schedule Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Primary Timezone
                </label>
                <select
                  defaultValue="Africa/Kigali"
                  className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#005F31] bg-white"
                >
                  <option value="Africa/Kigali">Africa/Kigali (UTC+02:00)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (UTC+03:00)</option>
                  <option value="Europe/London">Europe/London (UTC+00:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Match & Training Currency
                </label>
                <select
                  defaultValue="RWF"
                  className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#005F31] bg-white"
                >
                  <option value="RWF">Rwandan Franc (RWF)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wide">
                Danger Zone
              </h3>
            </div>
            <p className="text-xs text-zinc-600">
              Transfer club workspace ownership or permanently archive Kigali FC
              records and team historical logs.
            </p>
            <div className="pt-2">
              <button
                type="button"
                className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 shadow-xs"
              >
                Archive Club Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
