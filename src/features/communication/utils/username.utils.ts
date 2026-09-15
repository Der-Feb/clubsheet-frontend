/**
 * Username utility functions for the Communication feature.
 * All functions are pure TypeScript with no React or external dependencies.
 */

/** A normalised username — only [a-z0-9_.], no @ prefix. */
export type NormalizedUsername = string;

/**
 * Normalize a display name into a valid username candidate.
 *
 * Steps:
 * 1. Normalize Unicode to NFD and strip combining diacritics (é→e, ñ→n, etc.)
 * 2. Lowercase
 * 3. Replace any character NOT in [a-z0-9] with a dot
 * 4. Collapse consecutive dots to a single dot
 * 5. Strip leading/trailing dots
 * 6. If the result is empty, return "user" as a fallback
 */
export function normalizeDisplayName(name: string): NormalizedUsername {
  // Step 1 & 2: NFD normalize, strip combining diacritics (U+0300–U+036F), then lowercase
  const stripped = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  // Step 3: Replace any character not in [a-z0-9] with a dot
  const dotted = stripped.replace(/[^a-z0-9]/g, '.');

  // Step 4: Collapse consecutive dots
  const collapsed = dotted.replace(/\.{2,}/g, '.');

  // Step 5: Strip leading/trailing dots
  const trimmed = collapsed.replace(/^\.+|\.+$/g, '');

  // Step 6: Fallback for empty result
  return trimmed.length > 0 ? trimmed : 'user';
}

/**
 * Generate a unique username for the given display name that does not
 * conflict with any username in the provided set.
 *
 * The function is deterministic: same inputs always produce the same output.
 *
 * Algorithm:
 * 1. Compute candidate = normalizeDisplayName(displayName)
 * 2. If candidate is not in existingUsernames, return it
 * 3. Otherwise try candidate+"2", candidate+"3", … until a free slot is found
 */
export function generateUsername(
  displayName: string,
  existingUsernames: Set<string>,
): NormalizedUsername {
  const candidate = normalizeDisplayName(displayName);

  if (!existingUsernames.has(candidate)) {
    return candidate;
  }

  let suffix = 2;
  while (existingUsernames.has(`${candidate}${suffix}`)) {
    suffix++;
  }

  return `${candidate}${suffix}`;
}

/**
 * Parse a raw username string (with or without a leading @).
 *
 * - Strips a leading @ if present
 * - Validates the result against /^[a-z0-9_.]+$/
 * - Returns the normalized username, or null if invalid or empty
 */
export function parseUsername(raw: string): NormalizedUsername | null {
  const stripped = raw.startsWith('@') ? raw.slice(1) : raw;

  if (stripped.length === 0) {
    return null;
  }

  if (!/^[a-z0-9_.]+$/.test(stripped)) {
    return null;
  }

  return stripped;
}

/**
 * Format a stored username for display by prepending @.
 *
 * Example: "john.doe" → "@john.doe"
 */
export function formatMentionDisplay(username: NormalizedUsername): string {
  return `@${username}`;
}
