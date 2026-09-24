"use client";

import { useState, useEffect } from "react";
import { X, ClipboardCheck, Check, Clock, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ScrollArea";

export interface AttendanceEntry {
  athleteId: string;
  athleteName: string;
  status: "Attended" | "Late" | "Excused" | "Absent";
}

interface TakeAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  athletes: { id: string; name: string; team: string }[];
  onSaveAttendance: (sessionDate: string, team: string, records: AttendanceEntry[]) => void;
}

const TEAMS = [
  "Senior First Team",
  "Under-17 Academy",
  "Under-15 Development",
  "Women’s Senior Team",
];

export function TakeAttendanceModal({
  isOpen,
  onClose,
  athletes,
  onSaveAttendance,
}: TakeAttendanceModalProps) {
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]);
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, "Attended" | "Late" | "Excused" | "Absent">
  >({});

  // Filter athletes by selected team
  const teamAthletes = athletes.filter(
    (a) => !selectedTeam || a.team === selectedTeam || selectedTeam === "All Teams"
  );

  useEffect(() => {
    if (isOpen) {
      setSessionDate(new Date().toISOString().split("T")[0]);
      setSelectedTeam(TEAMS[0]);
      // Default everyone to Attended
      const initialMap: Record<string, "Attended" | "Late" | "Excused" | "Absent"> = {};
      athletes.forEach((a) => {
        initialMap[a.id] = "Attended";
      });
      setAttendanceMap(initialMap);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, athletes]);

  if (!isOpen) return null;

  const handleStatusChange = (
    athleteId: string,
    status: "Attended" | "Late" | "Excused" | "Absent"
  ) => {
    setAttendanceMap((prev) => ({ ...prev, [athleteId]: status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const records: AttendanceEntry[] = teamAthletes.map((a) => ({
      athleteId: a.id,
      athleteName: a.name,
      status: attendanceMap[a.id] || "Attended",
    }));

    onSaveAttendance(sessionDate, selectedTeam, records);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <ScrollArea
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-modal-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h2 id="attendance-modal-title" className="text-base font-bold text-foreground">
              Take Roll Call & Attendance
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Squad / Team</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {TEAMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Athletes List Roll Call */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Squad Roster ({teamAthletes.length} athletes)
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const allAttended: Record<string, "Attended"> = {};
                    teamAthletes.forEach((a) => {
                      allAttended[a.id] = "Attended";
                    });
                    setAttendanceMap((prev) => ({ ...prev, ...allAttended }));
                  }}
                  className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                >
                  Mark all present
                </button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-border divide-y divide-border">
              {teamAthletes.map((athlete) => {
                const currentStatus = attendanceMap[athlete.id] || "Attended";
                return (
                  <div
                    key={athlete.id}
                    className="flex items-center justify-between p-2.5 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground">{athlete.name}</p>
                      <p className="text-[10px] text-muted-foreground">{athlete.team}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {(["Attended", "Late", "Excused", "Absent"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(athlete.id, st)}
                          className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors cursor-pointer ${
                            currentStatus === st
                              ? st === "Attended"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : st === "Late"
                                ? "bg-amber-500 text-white shadow-xs"
                                : st === "Excused"
                                ? "bg-blue-500 text-white shadow-xs"
                                : "bg-danger text-white shadow-xs"
                              : "border border-border bg-card text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              Save Attendance
            </button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}
