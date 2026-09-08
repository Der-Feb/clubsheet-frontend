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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Members
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage club executives, coaches, medical staff, and club officials.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#01562D] shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite Staff Member
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Total Staff</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">28</p>
          <p className="mt-0.5 text-xs text-zinc-500">Across 4 departments</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Technical Staff</p>
          <p className="mt-1 text-2xl font-bold text-[#005F31]">14</p>
          <p className="mt-0.5 text-xs text-zinc-500">Coaches & trainers</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Medical Staff</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">5</p>
          <p className="mt-0.5 text-xs text-zinc-500">Doctors & physios</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Pending Invitations</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">2</p>
          <p className="mt-0.5 text-xs text-zinc-500">Awaiting acceptance</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005F31]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <span>Department: All</span>
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/75 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {MEMBERS.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{member.name}</p>
                        <p className="text-[11px] text-zinc-400">Joined {member.joinedDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-zinc-800">
                    {member.role}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{member.department}</td>
                  <td className="py-3 px-4 text-zinc-500 space-y-0.5">
                    <p>{member.email}</p>
                    <p className="text-[11px] text-zinc-400">{member.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        member.status === "Active"
                          ? "bg-emerald-50 text-[#005F31]"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="rounded p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
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
