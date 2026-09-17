import type { Invitation } from "@/types/invitations.types";

export const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "inv-1",
    membershipId: "mbr-1",
    signingId: "sng-1",
    status: "ACCEPTED",
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: "2026-09-10",
  },
  {
    id: "inv-2",
    membershipId: "mbr-2",
    signingId: "sng-2",
    status: "PENDING",
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    createdAt: "2026-09-14",
  },
  {
    id: "inv-3",
    membershipId: "mbr-3",
    signingId: "sng-3",
    status: "ACCEPTED",
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: "2026-09-15",
  },
  {
    id: "inv-4",
    membershipId: "mbr-4",
    signingId: "sng-4",
    status: "ACCEPTED",
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: "2026-07-25",
  },
  {
    id: "inv-5",
    membershipId: "mbr-5",
    signingId: "sng-5",
    status: "PENDING",
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    createdAt: "2026-09-16",
  },
];
