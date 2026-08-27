"use client"

import { ChevronDown, Send } from "lucide-react";
import { useState } from "react";

const perspectives = [
  {
    role: "Admin",
    desc: "Full control. Manage people, finances, documents, and access across the whole club from one dashboard.",
    points: ["Manage all members and roles", "Track finances and documents", "Set permissions for every role", "Overview of the whole club"],
  },
  {
    role: "Coach",
    desc: "Focus on your squad. Training sessions, player availability, and match prep — all in one place.",
    points: ["View and manage your squad", "Plan and track training sessions", "Access player performance data", "Communicate with your team"],
  },
  {
    role: "Player",
    desc: "Know your schedule. Upcoming training, your stats, fixtures, and club news — always up to date.",
    points: ["See your upcoming training", "Check your personal stats", "View fixtures and results", "Receive club announcements"],
  },
  {
    role: "Staff",
    desc: "Stay in the loop. Kit, medical, and operational tasks without the back-and-forth messages.",
    points: ["Manage kit and equipment", "Track medical clearances", "Handle operational tasks", "Coordinate with admin"],
  },
  {
    role: "Guardian",
    desc: "Know your child is in good hands. Stay informed about schedules, communications, and club updates.",
    points: ["See your child's training schedule", "Receive important club updates", "Sign consent forms digitally", "Stay connected with coaches"],
  },
];

const faqs = [
  { q: "Is ClubSheet free to use?",                        a: "The core platform is free to get started. Modules like Finance, Medical, and Academy are add-ons you can plug in as your club grows.", votes: 84 },
  { q: "Do I need technical knowledge to set up my club?", a: "Not at all. ClubSheet is designed for club administrators, not developers. You can have your club running in minutes.",                votes: 61 },
  { q: "Can I manage multiple teams in one club?",         a: "Yes. ClubSheet is built for multi-team organisations. Each team has its own space while everything stays connected at the club level.", votes: 53 },
  { q: "How does access control work?",                    a: "You assign roles — Admin, Coach, Player, Staff, Guardian — and each role sees only what they need. Fine-grained permissions keep sensitive data safe.", votes: 47 },
  { q: "Can players and coaches use ClubSheet on mobile?", a: "Yes. ClubSheet is fully responsive and works on any device. No app download required.",                                               votes: 39 },
  { q: "What happens to my data?",                        a: "Your club data belongs to you. We never sell it or share it with third parties. You can export or delete it at any time.",               votes: 35 },
];

export function WhoSection() {
  const [active, setActive] = useState(0);
  const current = perspectives[active];

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Who uses ClubSheet?</h2>
        <p className="text-zinc-500 text-base">Every role gets exactly what they need.</p>
      </div>

      {/* Role tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {perspectives.map((p, i) => (
          <button
            key={p.role}
            onClick={() => setActive(i)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              active === i
                ? "bg-primary text-white shadow-md"
                : "bg-quinary border border-secondary text-zinc-600 hover:border-primary hover:text-primary"
            }`}
          >
            {p.role}
          </button>
        ))}
      </div>

      {/* Active perspective card */}
      <div className="w-full bg-quinary border border-secondary rounded-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">{current.role}</span>
          <p className="text-zinc-700 text-base leading-relaxed">{current.desc}</p>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {current.points.map((pt) => (
            <li key={pt} className="flex items-center gap-2 text-sm text-zinc-600">
              <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// FAQ — collapsible + vote count + ask your own question modal 
export function FaqSection() {
  const [open, setOpen]       = useState<number | null>(null);
  const [votes, setVotes]     = useState<number[]>(faqs.map((f) => f.votes));
  const [voted, setVoted]     = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail]     = useState("");
  const [question, setQuestion] = useState("");
  const [sent, setSent]       = useState(false);

  const handleVote = (i: number) => {
    if (voted.has(i)) return;
    setVotes((v) => v.map((c, idx) => (idx === i ? c + 1 : c)));
    setVoted((s) => new Set(s).add(i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !email.trim()) return;
    window.location.href = `mailto:hello@clubsheet.io?subject=Question from ${encodeURIComponent(email)}&body=${encodeURIComponent(question)}`;
    setSent(true);
    setTimeout(() => {
      setModalOpen(false);
      setSent(false);
      setEmail("");
      setQuestion("");
    }, 2000);
  };

  return (
    <div className="w-full bg-quaternary py-24 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Questions clubs ask</h2>
          <p className="text-zinc-500 text-base">Straight answers. No fluff.</p>
        </div>

        {/* Accordion — vote and expand are separate elements, never nested buttons */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-quinary border border-secondary rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
            >
              {/* Row: not a button itself — children are the interactive elements */}
              <div className="flex items-center gap-3 px-6 py-5">
                {/* Expand toggle — takes up remaining space */}
                <button
                  className="flex-1 text-left flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-semibold text-zinc-900 text-sm flex-1">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Vote — separate button, not nested */}
                <button
                  onClick={() => handleVote(i)}
                  title={voted.has(i) ? "Already voted" : "This question helped me too"}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full border transition-all shrink-0 ${
                    voted.has(i)
                      ? "bg-quinary border-primary text-primary"
                      : "border-secondary text-zinc-400 hover:border-primary hover:text-primary"
                  }`}
                  aria-label="This question helped me"
                >
                  <svg
                    className="w-3 h-3"
                    fill={voted.has(i) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {votes[i]}
                </button>
              </div>

              {open === i && (
                <div className="px-6 pb-5 border-t border-secondary/50">
                  <p className="text-sm text-zinc-600 leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trigger to open ask modal */}
        <div className="bg-quinary border border-secondary rounded-2xl p-7 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-zinc-900 text-base">Don&apos;t see your question?</h3>
            <p className="text-sm text-zinc-500">Send it to us — we read every message.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
          >
            <Send className="w-4 h-4" />
            Ask a question
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_2rem_5rem_rgba(0,95,49,0.18)] border border-secondary p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-zinc-900 text-lg">Ask us anything</h3>
                <p className="text-sm text-zinc-500">We&apos;ll reply to your email directly.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors mt-0.5"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {sent ? (
              <div className="flex items-center gap-2 text-sm text-primary font-medium py-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Question sent. We&apos;ll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ask-email" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Your email
                  </label>
                  <input
                    id="ask-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourclub.com"
                    className="bg-quaternary border border-secondary rounded-xl px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ask-question" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Your question
                  </label>
                  <textarea
                    id="ask-question"
                    required
                    rows={4}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to know about ClubSheet?"
                    className="bg-quaternary border border-secondary rounded-xl px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Send question
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}