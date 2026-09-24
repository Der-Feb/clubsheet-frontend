"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Plus } from "lucide-react";
import {
  useMembers,
  useUpdateMemberStatus,
  useUpdateMemberRole,
  useRemoveMember,
} from "@/hooks/use-members-roles.hook";
import { ActionsMenu } from "@/features/members-roles/components/actions-menu";
import { MemberDetailDrawer } from "@/features/members-roles/components/member-detail.drawer";
import { RolePickerModal } from "@/features/members-roles/components/role-picker.modal";
import { ConfirmDialog } from "@/features/members-roles/components/confirm-dialog";
import type { Member, Department } from "@/types/members-roles.types";

function MembersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const membershipIdParam = searchParams.get("membershipId");
  const changeRoleParam = searchParams.get("changeRole");
  const removeMemberParam = searchParams.get("removeMember");

  const { data: members = [], isLoading } = useMembers();
  const updateStatusMutation = useUpdateMemberStatus();
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | "All"
  >("All");

  // Dialog / Drawer States
  const [selectedMemberForDrawer, setSelectedMemberForDrawer] =
    useState<Member | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedMemberForRolePicker, setSelectedMemberForRolePicker] =
    useState<Member | null>(null);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);

  const [selectedMemberForRemove, setSelectedMemberForRemove] =
    useState<Member | null>(null);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);

  // Sync drawer and modals with query params on load or URL change
  useEffect(() => {
    if (membershipIdParam && members.length > 0) {
      const foundMember = members.find((m) => m.id === membershipIdParam);
      if (foundMember) {
        setSelectedMemberForDrawer(foundMember);

        // Check if changeRole is active
        if (changeRoleParam === "active" || changeRoleParam === "true") {
          setSelectedMemberForRolePicker(foundMember);
          setIsRolePickerOpen(true);
        } else {
          setIsRolePickerOpen(false);
        }

        // Check if removeMember is active
        if (removeMemberParam === "active" || removeMemberParam === "true") {
          setSelectedMemberForRemove(foundMember);
          setIsRemoveConfirmOpen(true);
        } else {
          setIsRemoveConfirmOpen(false);
        }

        setIsDrawerOpen(true);
      }
    } else {
      setIsDrawerOpen(false);
      setIsRolePickerOpen(false);
      setIsRemoveConfirmOpen(false);
    }
  }, [membershipIdParam, changeRoleParam, removeMemberParam, members]);

  // Derived filtered members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All" || member.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Dynamic stats
  const totalStaff = members.length;
  const technicalStaff = members.filter(
    (m) => m.department === "Technical"
  ).length;
  const medicalStaff = members.filter(
    (m) => m.department === "Medical"
  ).length;
  const pendingInvitations = members.filter(
    (m) => m.status === "Invited"
  ).length;

  // Handlers with URL Query Params Syncing
  const handleOpenDrawer = (member: Member) => {
    setSelectedMemberForDrawer(member);
    setIsDrawerOpen(true);
    router.push(`/dashboard/members?membershipId=${member.id}`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    router.push("/dashboard/members");
  };

  const handleOpenRolePicker = (member: Member) => {
    setSelectedMemberForRolePicker(member);
    setIsRolePickerOpen(true);
    router.push(
      `/dashboard/members?membershipId=${member.id}&changeRole=active`
    );
  };

  const handleCloseRolePicker = () => {
    setIsRolePickerOpen(false);
    if (selectedMemberForDrawer) {
      router.push(`/dashboard/members?membershipId=${selectedMemberForDrawer.id}`);
    } else {
      router.push("/dashboard/members");
    }
  };

  const handleToggleStatus = (member: Member) => {
    const newStatus = member.status === "Suspended" ? "Active" : "Suspended";
    updateStatusMutation.mutate({
      memberId: member.id,
      status: newStatus,
    });
    if (selectedMemberForDrawer?.id === member.id) {
      setSelectedMemberForDrawer((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  const handleConfirmRolePick = (roleId: string) => {
    if (!selectedMemberForRolePicker) return;
    updateRoleMutation.mutate(
      {
        memberId: selectedMemberForRolePicker.id,
        roleId,
      },
      {
        onSuccess: () => {
          handleCloseRolePicker();
        },
      }
    );
  };

  const handleOpenRemoveConfirm = (member: Member) => {
    setSelectedMemberForRemove(member);
    setIsRemoveConfirmOpen(true);
    router.push(
      `/dashboard/members?membershipId=${member.id}&removeMember=active`
    );
  };

  const handleCloseRemoveConfirm = () => {
    setIsRemoveConfirmOpen(false);
    if (selectedMemberForDrawer) {
      router.push(`/dashboard/members?membershipId=${selectedMemberForDrawer.id}`);
    } else {
      router.push("/dashboard/members");
    }
  };

  const handleConfirmRemove = () => {
    if (!selectedMemberForRemove) return;
    removeMemberMutation.mutate(selectedMemberForRemove.id, {
      onSuccess: () => {
        setIsRemoveConfirmOpen(false);
        handleCloseDrawer();
      },
    });
  };

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
          onClick={() => {
            router.push("/dashboard/hires?newHire=active");
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite Staff Member
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Total Staff
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalStaff}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Across 4 departments
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Technical Staff
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {technicalStaff}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Coaches & trainers
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Medical Staff
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {medicalStaff}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Doctors & physios
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Pending Invitations
          </p>
          <p className="mt-1 text-2xl font-bold text-warning">
            {pendingInvitations}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Awaiting acceptance
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, email..."
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="relative flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) =>
                setSelectedDepartment(e.target.value as Department | "All")
              }
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Technical">Technical</option>
              <option value="Management">Management</option>
              <option value="Medical">Medical</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
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
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleOpenDrawer(member)}
                      className="flex items-center gap-3 text-left hover:underline cursor-pointer group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-xs font-bold text-foreground group-hover:border-primary/50 transition-colors">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Joined {member.joinedDate}
                        </p>
                      </div>
                    </button>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {member.role}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {member.department}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground space-y-0.5">
                    <p>{member.email}</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {member.phone}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        member.status === "Active"
                          ? "bg-primary-subtle text-primary border border-primary/20"
                          : member.status === "Invited"
                          ? "bg-warning/10 text-warning border border-warning/20"
                          : "bg-danger/10 text-danger border border-danger/20"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <ActionsMenu
                      member={member}
                      onViewProfile={() => handleOpenDrawer(member)}
                      onChangeRole={() => handleOpenRolePicker(member)}
                      onToggleStatus={() => handleToggleStatus(member)}
                      onRemove={() => handleOpenRemoveConfirm(member)}
                    />
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && !isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-xs text-muted-foreground"
                  >
                    No members match your search or department filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Detail Drawer */}
      <MemberDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        member={selectedMemberForDrawer}
        onChangeRoleClick={() => {
          if (selectedMemberForDrawer) {
            handleOpenRolePicker(selectedMemberForDrawer);
          }
        }}
        onToggleStatus={() => {
          if (selectedMemberForDrawer) {
            handleToggleStatus(selectedMemberForDrawer);
          }
        }}
      />

      {/* Role Picker Modal with ?changeRole=active */}
      <RolePickerModal
        isOpen={isRolePickerOpen}
        onClose={handleCloseRolePicker}
        member={selectedMemberForRolePicker}
        onSelectRole={handleConfirmRolePick}
        isLoading={updateRoleMutation.isPending}
      />

      {/* Remove Confirmation Dialog with ?removeMember=active */}
      <ConfirmDialog
        isOpen={isRemoveConfirmOpen}
        title={`Remove ${selectedMemberForRemove?.name} from Club?`}
        description="This action will revoke all access privileges for this staff member. You can re-invite them later if needed."
        confirmText="Remove Member"
        isDestructive
        isLoading={removeMemberMutation.isPending}
        onConfirm={handleConfirmRemove}
        onCancel={handleCloseRemoveConfirm}
      />
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading members...</div>}>
      <MembersContent />
    </Suspense>
  );
}
