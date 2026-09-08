export interface MockUser {
  id: string;
  name: string;
  email: string;
  /** Initials for the avatar fallback. */
  initials: string;
  avatar?: string;
  role?: string;
}

export const MOCK_USER: MockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@kigalifc.rw",
  initials: "JD",
  role: "Administrator",
};
