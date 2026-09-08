"use client";

import { useState } from "react";
import {
  Building,
  Bell,
  Palette,
  Sliders,
  AlertTriangle,
  Upload,
  Check,
} from "lucide-react";
import { KitCustomizer } from "@/components/kit-customizer.component";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "appearance" | "notifications" | "preferences";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure club workspace details, kit appearance themes, operational preferences, and notification channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Check className="h-3.5 w-3.5" />
          {savedSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Main Settings Card with internal navigation tabs */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden text-card-foreground">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border px-6 pt-4 gap-6 text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={cn(
              "pb-3 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer",
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Building className="h-4 w-4" />
            Club Profile
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("appearance")}
            className={cn(
              "pb-3 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer",
              activeTab === "appearance"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Palette className="h-4 w-4" />
            Kit & Appearance
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "pb-3 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer",
              activeTab === "notifications"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={cn(
              "pb-3 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer",
              activeTab === "preferences"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Sliders className="h-4 w-4" />
            Preferences
          </button>
        </div>

        {/* Settings Tab 1: Profile */}
        {activeTab === "profile" && (
          <div className="p-6 space-y-6">
            {/* Club Identity Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-foreground">Club Identity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Official Club Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Kigali Football Club"
                    className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Abbreviation / Short Name
                  </label>
                  <input
                    type="text"
                    defaultValue="KFC"
                    className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Club Logo / Emblem */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-foreground mb-2">
                  Club Crest / Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-xs">
                    KFC
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="h-3 w-3 text-muted-foreground" />
                      Upload new crest
                    </button>
                    <p className="text-[11px] text-muted-foreground">
                      PNG, SVG or JPEG up to 2MB. Recommended 512x512px.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Regional & Timezone */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-foreground">
                Regional & Schedule Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Primary Timezone
                  </label>
                  <select
                    defaultValue="Africa/Kigali"
                    className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Africa/Kigali">Africa/Kigali (UTC+02:00)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (UTC+03:00)</option>
                    <option value="Europe/London">Europe/London (UTC+00:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Match & Training Currency
                  </label>
                  <select
                    defaultValue="RWF"
                    className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="RWF">Rwandan Franc (RWF)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Danger Zone */}
            <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wide">
                  Danger Zone
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Transfer club workspace ownership or permanently archive Kigali FC
                records and team historical logs.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  className="rounded-lg border border-danger/30 bg-card px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10 shadow-xs transition-colors cursor-pointer"
                >
                  Archive Club Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab 2: Appearance & Kit Customization */}
        {activeTab === "appearance" && (
          <div className="p-6">
            <KitCustomizer onSave={handleSave} />
          </div>
        )}

        {/* Settings Tab 3: Notifications */}
        {activeTab === "notifications" && (
          <div className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Notification Channels</h2>
            <p className="text-xs text-muted-foreground">
              Choose which events trigger SMS alerts or match day notifications to team managers and coaches.
            </p>
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 text-xs text-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
                <span>Match Day Lineup changes &amp; substitutions</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
                <span>Training session schedule updates</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                <span>Monthly player medical &amp; fitness reports</span>
              </label>
            </div>
          </div>
        )}

        {/* Settings Tab 4: Preferences */}
        {activeTab === "preferences" && (
          <div className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground">Operational Preferences</h2>
            <p className="text-xs text-muted-foreground">
              General display formats and date formatting for fixtures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Date Format
                </label>
                <select
                  defaultValue="DD/MM/YYYY"
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 08/09/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/08/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
