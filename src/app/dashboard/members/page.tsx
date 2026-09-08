import {
  Search,
  Filter,
  Plus,
  MoreVertical,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: "Technical" | "Management" | "Medical" | "Operations";
  status: "Active" | "Invited";
  joinedDate: string;
}

const MEMBERS: Member[] = [
  {
    id: "m-1",
    name: "Jean Bosco Rurangwa",
    email: "president@kigalifc.rw",
    phone: "+250 788 000 111",
    role: "Club President",
    department: "Management",
    status: "Active",
    joinedDate: "Jan 2020",
  },
  {
    id: "m-2",
    name: "Emmanuel Mugisha",
    email: "e.mugisha@kigalifc.rw",
    phone: "+250 788 111 222",
    role: "Head Coach (Senior)",
    department: "Technical",
    status: "Active",
    joinedDate: "Feb 2023",
  },
  {
    id: "m-3",
    name: "Dr. Patrick Manzi",
    email: "p.manzi@kigalifc.rw",
    phone: "+250 788 222 333",
    role: "Chief Medical Officer",
    department: "Medical",
    status: "Active",
    joinedDate: "Sep 2022",
  },
  {
    id: "m-4",
    name: "Dieudonné Habimana",
    email: "d.habimana@kigalifc.rw",
    phone: "+250 788 333 444",
    role: "Academy Director",
    department: "Technical",
    status: "Active",
    joinedDate: "Jun 2021",
  },
  {
    id: "m-5",
    name: "Solange Umutoni",
    email: "s.umutoni@kigalifc.rw",
    phone: "+250 788 444 555",
    role: "Operations Coordinator",
    department: "Operations",
    status: "Active",
    joinedDate: "Jan 2024",
  },
  {
    id: "m-6",
    name: "Jean Claude Nshimiyimana",
    email: "jc.nshimiyimana@kigalifc.rw",
    phone: "+250 788 555 666",
    role: "Assistant Coach",
    department: "Technical",
    status: "Invited",
    joinedDate: "Sep 2026",
  },
];

export default function MembersPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage club executives, coaches, medical staff, and club officials.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite Staff Member
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Total Staff</p>
          <p className="mt-1 text-2xl font-bold text-foreground">28</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Across 4 departments</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Technical Staff</p>
          <p className="mt-1 text-2xl font-bold text-primary">14</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Coaches & trainers</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Medical Staff</p>
          <p className="mt-1 text-2xl font-bold text-foreground">5</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Doctors & physios</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Pending Invitations</p>
          <p className="mt-1 text-2xl font-bold text-warning">2</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Awaiting acceptance</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Department: All</span>
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-card-foreground">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {MEMBERS.map((member) => (
                <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-xs font-bold text-foreground">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{member.name}</p>
                        <p className="text-[11px] text-muted-foreground">Joined {member.joinedDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {member.role}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{member.department}</td>
                  <td className="py-3 px-4 text-muted-foreground space-y-0.5">
                    <p>{member.email}</p>
                    <p className="text-[11px] text-muted-foreground/80">{member.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        member.status === "Active"
                          ? "bg-primary-subtle text-primary border border-primary/20"
                          : "bg-warning/10 text-warning border border-warning/20"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      aria-label={`Actions for ${member.name}`}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
