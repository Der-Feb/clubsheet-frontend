"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, X } from "lucide-react";

export type TrainingSessionType = "Tactical" | "Technical" | "Conditioning" | "Recovery";

export interface NewTrainingSession {
  title: string;
  team: string;
  date: string;
  startTime: string;
  endTime: string;
  pitch: string;
  coach: string;
  totalAthletes: number;
  type: TrainingSessionType;
}

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (session: NewTrainingSession) => void;
}

const inputClassName =
  "h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-sm text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary";
const labelClassName = "mb-1.5 block text-xs font-semibold text-foreground";

export function ScheduleSessionModal({ isOpen, onClose, onCreate }: ScheduleSessionModalProps) {
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("Senior First Team");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:30");
  const [pitch, setPitch] = useState("");
  const [coach, setCoach] = useState("");
  const [totalAthletes, setTotalAthletes] = useState("26");
  const [type, setType] = useState<TrainingSessionType>("Tactical");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setTitle("");
    setTeam("Senior First Team");
    setDate("");
    setStartTime("18:00");
    setEndTime("19:30");
    setPitch("");
    setCoach("");
    setTotalAthletes("26");
    setType("Tactical");
    setError("");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (endTime <= startTime) {
      setError("End time must be later than start time.");
      return;
    }

    onCreate({
      title: title.trim(),
      team,
      date,
      startTime,
      endTime,
      pitch: pitch.trim(),
      coach: coach.trim(),
      totalAthletes: Number(totalAthletes),
      type,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close schedule session dialog"
        className="fixed inset-0 cursor-default bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-session-title"
        className="relative z-10 max-h-[min(90dvh,48rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6"
      >
        <header className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <CalendarPlus className="h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <h2 id="schedule-session-title" className="text-base font-bold text-foreground">
                Schedule Training Session
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                This session is added to the current mock list only.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="session-title" className={labelClassName}>Session title</label>
            <input id="session-title" required maxLength={100} autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Passing patterns and finishing" className={inputClassName} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="session-team" className={labelClassName}>Squad</label>
              <select id="session-team" value={team} onChange={(event) => setTeam(event.target.value)} className={inputClassName}>
                <option>Senior First Team</option>
                <option>Under-17 Academy</option>
                <option>Under-15 Development</option>
              </select>
            </div>
            <div>
              <label htmlFor="session-type" className={labelClassName}>Session type</label>
              <select id="session-type" value={type} onChange={(event) => setType(event.target.value as TrainingSessionType)} className={inputClassName}>
                <option>Tactical</option>
                <option>Technical</option>
                <option>Conditioning</option>
                <option>Recovery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="session-date" className={labelClassName}>Date</label>
              <input id="session-date" type="date" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} className={inputClassName} />
            </div>
            <div>
              <label htmlFor="session-start" className={labelClassName}>Starts</label>
              <input id="session-start" type="time" required value={startTime} onChange={(event) => { setStartTime(event.target.value); setError(""); }} className={inputClassName} />
            </div>
            <div>
              <label htmlFor="session-end" className={labelClassName}>Ends</label>
              <input id="session-end" type="time" required value={endTime} onChange={(event) => { setEndTime(event.target.value); setError(""); }} className={inputClassName} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="session-pitch" className={labelClassName}>Pitch / facility</label>
              <input id="session-pitch" required maxLength={100} value={pitch} onChange={(event) => setPitch(event.target.value)} placeholder="e.g. Pitch A" className={inputClassName} />
            </div>
            <div>
              <label htmlFor="session-coach" className={labelClassName}>Coach</label>
              <input id="session-coach" required maxLength={100} value={coach} onChange={(event) => setCoach(event.target.value)} placeholder="Coach name" className={inputClassName} />
            </div>
          </div>

          <div>
            <label htmlFor="session-squad-size" className={labelClassName}>Squad size</label>
            <input id="session-squad-size" type="number" min="1" max="100" required value={totalAthletes} onChange={(event) => setTotalAthletes(event.target.value)} className={`${inputClassName} sm:max-w-40`} />
          </div>

          {error && <p role="alert" className="text-xs text-danger">{error}</p>}

          <footer className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
              Schedule Session
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
