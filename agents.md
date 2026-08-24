# ClubSheet Frontend — AGENTS.md

## 1. General Rule

You are working on the **ClubSheet** frontend.

Before making changes, understand the existing architecture and follow the project's established patterns. Do not introduce a new pattern, library, component structure, styling approach, or abstraction unless there is a clear reason.

**Prefer consistency with the existing codebase over personal preferences.**

When unsure about an implementation:

1. Inspect the surrounding code.
2. Search for an existing implementation of the same or similar pattern.
3. Check the relevant project documentation.
4. Only then introduce something new.

Do not blindly rewrite existing code just because you would structure it differently.

---

# 2. Required Context Before Coding

Before implementing a feature, read the relevant project documentation and existing code.

At minimum, understand:

* The root `AGENTS.md`.
* The frontend `AGENTS.md`.
* The project's architecture documentation, if present.
* The relevant feature/module documentation.
* Existing components that solve similar problems.
* Existing types/interfaces related to the feature.
* Existing API/service/query patterns.
* Existing authentication and authorization patterns when applicable.
* Existing design system/components before creating new UI components.

If a project-specific skill, documentation file, or instruction file exists for the technology/feature being modified, **read it before implementing the feature**.

Do not assume that a library or framework is used just because it is common.

---

# 3. Technology Rules

Follow the technologies already established by the project.

Do not replace or introduce:

* UI libraries
* CSS frameworks
* animation libraries
* state-management libraries
* data-fetching libraries
* form libraries
* icon libraries
* validation libraries

unless the change is explicitly requested or there is a strong architectural reason.

When the project already has a utility, component, hook, helper, or abstraction for something, reuse it.

Avoid adding dependencies for functionality that can reasonably be implemented using the existing stack.

---

# 4. Component Architecture

Build the UI from reusable components.

Prefer:

* small focused components
* composition
* reusable primitives
* feature-specific components
* clear separation between UI and business logic

Avoid:

* huge components
* deeply nested conditional rendering
* duplicated UI
* duplicated styling
* duplicated business logic
* components that handle unrelated responsibilities

Before creating a new component, search for an existing component that can be reused or extended.

If a component is only used by one feature, it may remain feature-local.

If a pattern is reused across multiple features, consider promoting it into the shared component system.

---

# 5. Feature Organization

Organize frontend code around **features/domains**, not random file types.

For example:

```text
src/
├── app/
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── iam/
│   ├── clubs/
│   ├── memberships/
│   ├── teams/
│   ├── players/
│   ├── coaches/
│   ├── training/
│   ├── matches/
│   ├── academy/
│   ├── kits/
│   ├── finance/
│   ├── medical/
│   └── ...
├── hooks/
├── lib/
├── services/
├── types/
└── styles/
```

Follow the actual project structure if it differs.

Do not reorganize the project simply for aesthetic reasons.

---

# 6. Styling

## 6.1 Tailwind by Default

Use **Tailwind CSS by default** for styling components and layouts.

Prefer utility classes for:

* spacing
* layout
* flex/grid
* typography
* borders
* shadows
* responsive behavior
* simple states
* simple sizing
* positioning

Do not create CSS for something Tailwind already handles cleanly.

---

## 6.2 Use CSS When Tailwind Becomes Excessive

Use regular CSS when Tailwind utilities become too long, difficult to understand, difficult to maintain, or insufficiently expressive.

Good candidates include:

* complex animations
* calculated dimensions
* complicated selectors
* pseudo-elements
* complex gradients
* advanced transitions
* custom visual effects
* scroll-driven effects
* reusable styling rules
* CSS variables
* styling that requires extensive calculations

Do not create extremely long Tailwind class strings when a small CSS class would make the code significantly clearer.

---

## 6.3 Utility Composition and Wrapper Classes

When a combination of 3 or more Tailwind utilities appears together more than 3 times across components, extract them into a reusable wrapper utility class.

This keeps components cleaner and makes design changes easier.

Examples:

```css
/* Instead of repeating this pattern 4+ times: */
/* className="flex items-center justify-center gap-2" */

.flex-center {
  @apply flex items-center justify-center;
}

/* Instead of repeating this pattern 4+ times: */
/* className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700" */

.btn-primary {
  @apply px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors;
}
```

Add these wrapper utilities to:

* `global.css` for genuinely shared patterns
* component-specific CSS files for feature-specific patterns

This prevents utility class bloat while maintaining the benefits of Tailwind's utility-first approach.

---

## 6.3 Styling Calculations Belong in CSS

CSS calculations must be handled in CSS whenever the calculation is a presentation concern.

Prefer:

```css
height: calc(100vh - var(--header-height));
```

over calculating the same value in JavaScript.

Use:

* `calc()`
* `min()`
* `max()`
* `clamp()`
* CSS variables
* container queries
* media queries

where appropriate.

Do not use JavaScript for layout calculations unless the layout genuinely depends on runtime application state.

---

# 7. Colors and Design Tokens

Repeated colors must not be scattered throughout the codebase.

Put commonly used colors into:

* `global.css`
* CSS variables
* the project's Tailwind theme/configuration
* the relevant centralized design-system file

Prefer semantic tokens such as:

```css
--color-background
--color-foreground
--color-primary
--color-primary-foreground
--color-muted
--color-border
--color-success
--color-warning
--color-danger
```

Avoid repeatedly writing arbitrary color values throughout components.

Do not introduce a new color when an existing design token already represents the same purpose.

---

# 8. Typography

Typography should be centralized.

Do not randomly introduce fonts or font sizes inside individual components.

Use the project's established:

* font families
* font weights
* heading sizes
* body sizes
* line heights
* letter spacing

If a new typography scale is required, update the centralized design system instead of creating one-off values.

---

# 9. Responsive Design

Every user-facing page must work across:

* mobile
* tablet
* desktop
* large desktop screens

Do not design only for desktop and add responsive behavior afterward.

Use responsive Tailwind utilities or CSS media/container queries.

Avoid hard-coded dimensions that unnecessarily break on smaller screens.

Prefer:

* flexible layouts
* `minmax()`
* `clamp()`
* responsive grids
* fluid spacing
* container widths
* content-driven sizing

Test important layouts at multiple viewport sizes.

---

# 10. Accessibility

Accessibility is required, not optional.

Use semantic HTML whenever possible.

Examples:

* `<button>` for actions
* `<a>` for navigation
* `<nav>` for navigation
* `<main>` for main content
* `<header>` / `<footer>` where appropriate
* proper heading hierarchy
* `<label>` for form controls

Interactive elements must be keyboard accessible.

Do not create clickable `<div>` elements when a button or link is appropriate.

Provide:

* visible focus states
* accessible labels
* appropriate ARIA attributes when needed
* sufficient contrast
* meaningful error messages
* keyboard navigation

Do not use ARIA to compensate for incorrect HTML semantics.

---

# 11. Forms

Forms must have:

* clear labels
* validation
* useful error messages
* loading states
* disabled states where appropriate
* success feedback where appropriate

Do not silently swallow validation or API errors.

Use the project's existing form and validation patterns.

Do not introduce another form library without a clear reason.

---

# 12. Loading, Empty, and Error States

Every data-driven UI should consider:

1. Loading state
2. Successful state
3. Empty state
4. Error state

Do not leave users staring at a blank screen while data loads.

Use existing:

* skeletons
* spinners
* empty-state components
* error components
* toast/notification systems

when available.

---

# 13. Data Fetching and API Usage

Follow the existing frontend API/data-fetching architecture.

Do not call backend APIs directly from random components if the project already has:

* services
* API clients
* hooks
* query functions
* server actions
* repositories

Use the established abstraction.

Do not duplicate API request logic across components.

Frontend types should reflect the actual backend contracts.

Do not invent API fields, endpoints, response structures, or permissions.

If the backend contract is unclear, inspect the backend implementation/schema before assuming anything.

---

# 14. Authentication and Authorization

ClubSheet contains users, memberships, clubs, teams, and different permissions.

Never assume that:

> "The user can see the page, therefore they can perform the action."

UI visibility and backend authorization are different concerns.

The frontend should:

* hide actions the user cannot reasonably access
* correctly represent permissions
* handle unauthorized responses
* never treat frontend checks as security

**Backend authorization remains the source of truth.**

Never put secrets or sensitive credentials in client-side code.

---

# 15. Domain Awareness

ClubSheet is built around relationships between concepts such as:

```text
Person
  ↓
User
  ↓
Membership
  ↓
Club
```

and other domain entities such as:

* clubs
* teams
* players
* coaches
* staff
* training
* matches
* academy
* kits
* finance
* medical
* memberships
* assignments

Understand the domain relationship before building UI around it.

Do not flatten or reinterpret domain relationships merely to make frontend code easier.

If the backend schema already defines a relationship, use that relationship rather than inventing another model on the frontend.

---

# 16. Reusable UI vs Feature UI

Use shared components for genuinely reusable concepts.

Examples:

```text
Button
Input
Modal
Dialog
Dropdown
Tabs
Card
Table
Badge
Avatar
Tooltip
Pagination
DatePicker
Select
```

Feature components should remain feature-specific when their behavior or meaning is domain-specific.

Do not turn every component into a generic component.

Avoid over-engineering abstractions before there is real reuse.

---

# 17. Tables and Data-Heavy Screens

ClubSheet contains administrative and management interfaces where tables may be heavily used.

Tables should support appropriate:

* loading states
* empty states
* pagination
* sorting
* filtering
* search
* row actions
* responsive behavior

Do not force large desktop tables onto small screens without considering mobile UX.

For mobile, use an appropriate alternative such as:

* horizontal scrolling
* responsive columns
* cards
* condensed rows

depending on the context.

---

# 18. Modals and Dialogs

Use dialogs for focused actions.

Do not put an entire complicated workflow into one giant modal.

Dialogs should:

* have clear titles
* have clear actions
* support keyboard interaction
* trap focus when appropriate
* close predictably
* show loading/error states
* avoid accidental destructive actions

Destructive operations should require an appropriate confirmation.

---

# 19. Animation and Motion

Animations should improve understanding, hierarchy, or perceived quality.

Do not animate everything.

Use animation for things such as:

* page transitions
* section reveals
* hover interactions
* navigation
* expanding/collapsing content
* scroll-driven storytelling
* visual feedback

Animations must not interfere with usability.

Respect:

```css
prefers-reduced-motion
```

for significant motion.

For complex scroll-based animations, prefer CSS when possible.

Use JavaScript or an animation library only when the interaction genuinely requires runtime control.

Avoid unnecessary animation dependencies.

---

# 20. Scroll-Driven Experiences

ClubSheet may use highly visual landing-page sections and scroll-driven animations.

For these sections:

* keep animation logic separate from business logic
* avoid unnecessary React re-renders
* prefer CSS transforms and opacity for performant animation
* avoid animating layout-heavy properties when possible
* use `requestAnimationFrame` when manually handling scroll
* clean up event listeners
* account for mobile behavior
* support reduced motion
* do not make critical information accessible only through animation

Do not use scroll position as React state on every scroll event unless there is a strong reason.

---

# 21. Performance

Prefer performant rendering patterns.

Avoid:

* unnecessary re-renders
* expensive calculations during render
* large client components when server rendering is possible
* unnecessary dependencies
* loading huge libraries for small features
* excessive DOM nesting
* unnecessary API requests
* repeated computation

For images:

* use the project's image optimization system
* provide appropriate dimensions
* avoid unnecessarily huge assets
* use lazy loading where appropriate

For animations:

* prefer `transform` and `opacity`
* avoid repeatedly triggering layout
* avoid expensive scroll handlers

---

# 22. React / Next.js Rules

Follow the project's existing React/Next.js architecture.

Do not add `"use client"` unless the component actually requires client-side behavior.

Prefer server-rendered/server-side patterns where appropriate.

Keep client components as small as reasonably possible.

Do not move an entire page to the client just because one small component needs interactivity.

Avoid unnecessary effects.

Before using `useEffect`, ask:

> Does this actually need synchronization with an external system?

Do not use `useEffect` merely to derive values that can be calculated during render.

---

# 23. State Management

Keep state as close as possible to where it is used.

Prefer:

1. local component state
2. feature-level state
3. shared/global state only when genuinely required

Do not put every piece of state into global state.

Do not duplicate server state into client state unless there is a clear reason.

Follow the project's established server-state/data-fetching solution.

---

# 24. Icons

Use the project's existing icon system.

Do not mix multiple icon libraries without a clear reason.

Icons should:

* have appropriate accessible labels when meaningful
* be hidden from screen readers when purely decorative
* not replace important text unnecessarily

Avoid using emojis as UI icons unless explicitly requested by the design.

---

# 25. Images and Assets

Reuse existing assets before creating or importing new ones.

Keep assets organized according to the project's existing conventions.

Do not embed large base64 images directly inside components.

Use appropriate optimization for production assets.

Do not use placeholder images in production unless they are intentionally part of the design.

---

# 26. Naming

Use clear and predictable names.

Components:

```text
PascalCase
```

Hooks:

```text
useSomething
```

Functions/variables:

```text
camelCase
```

Constants:

Follow the existing project convention.

Avoid vague names such as:

```text
data
thing
stuff
temp
foo
component
handleIt
```

unless the scope makes the meaning genuinely obvious.

---

# 27. Avoid Magic Numbers

Do not scatter unexplained values throughout the UI.

Bad:

```tsx
<div className="mt-[37px]">
```

when the value has no design reason.

Prefer existing spacing/design tokens.

When a custom value is genuinely required, document or centralize it when appropriate.

This is especially important for:

* spacing
* breakpoints
* animation durations
* z-index values
* dimensions
* colors
* typography

---

# 28. Z-Index

Do not randomly use values such as:

```text
z-[9999]
z-[99999]
z-[999999]
```

Establish a consistent layering system.

For example:

```text
base
dropdown
sticky
overlay
modal
toast
```

Use the project's existing z-index tokens whenever available.

---

# 29. Error Handling

Errors should be intentional and user-friendly.

Do not expose:

* stack traces
* internal implementation details
* database errors
* secrets
* raw backend errors

to normal users.

Log/debug errors through the project's established mechanism.

Display meaningful messages appropriate to the action the user attempted.

---

# 30. Security

Never trust client-side validation or authorization.

Never expose:

* API secrets
* private tokens
* server credentials
* sensitive environment variables

to browser code.

Never place secret environment variables into public/client-exposed variables.

Treat all client-provided values as untrusted.

---

# 31. Code Quality

Before finishing a task:

* remove unused imports
* remove unused variables
* remove dead code
* remove debug `console.log`s
* avoid duplicated logic
* check TypeScript errors
* check lint errors
* check formatting
* check responsive behavior
* check loading/error/empty states
* check accessibility for interactive UI

Do not leave temporary hacks in the code unless explicitly documented.

---

# 32. Don't Over-Engineer

The simplest solution that fits the existing architecture is usually the correct solution.

Do not:

* create abstractions without reuse
* create unnecessary hooks
* create unnecessary context providers
* create unnecessary state
* create unnecessary files
* introduce libraries for trivial functionality
* refactor unrelated code while implementing a feature

Keep changes focused on the requested task.

---

# 33. Don't Silently Change Product Behavior

If implementing a UI feature requires making a product decision that is not specified, do not silently invent behavior that could affect the domain.

Examples:

* membership rules
* permissions
* club ownership
* team assignments
* player status
* financial calculations
* medical information
* academy relationships

If the behavior is already defined elsewhere, follow that definition.

If it is not defined, identify the ambiguity before implementing consequential behavior.

---

# 34. CSS File Rules

Use:

```text
global.css
```

for global styles, design tokens, common variables, and shared styling.

Use feature/component CSS files when the styling is:

* complex
* highly specific
* localized
* animation-heavy
* easier to understand outside Tailwind classes

Do not create CSS files for every tiny component.

Do not create duplicate CSS files containing the same variables or styles.

---

# 35. Before Creating New UI

Before creating a new component, search for:

```text
existing component
existing pattern
existing utility
existing hook
existing design token
existing CSS variable
existing API service
existing type
```

Reuse first.

Create new only when reuse would make the code worse.

---

# 36. Before Modifying Existing UI

Inspect the surrounding implementation.

Understand:

* who uses the component
* what props it receives
* what state it controls
* what styles depend on it
* whether it is shared
* whether changing it could affect other features

Do not make breaking changes to shared components without checking their consumers.

---

# 37. Testing

When tests exist, update or add tests for meaningful behavior changes.

Prioritize testing:

* user interactions
* forms
* permissions
* important conditional rendering
* API behavior
* domain-specific logic
* critical workflows

Do not write tests that merely reproduce implementation details when user behavior is what matters.

---

# 38. Definition of Done

A frontend task is not complete simply because the UI "looks right."

Before considering the task finished, verify:

* [ ] The implementation follows the existing architecture.
* [ ] Existing components and utilities were reused where appropriate.
* [ ] Tailwind is used for normal styling.
* [ ] Complex/custom styling is handled with CSS.
* [ ] Repeated colors and design values are centralized.
* [ ] Responsive behavior has been considered.
* [ ] Accessibility has been considered.
* [ ] Loading, empty, and error states are handled where applicable.
* [ ] Permissions are respected in the UI.
* [ ] No secrets are exposed.
* [ ] No unnecessary dependencies were introduced.
* [ ] No unrelated files were unnecessarily changed.
* [ ] TypeScript/lint/formatting checks pass.
* [ ] Debug code has been removed.
* [ ] Existing behavior has not been unintentionally broken.

---

# 39. Agent Behavior

When working on ClubSheet, agents should:

* inspect before modifying
* search before creating
* reuse before duplicating
* follow existing patterns before introducing new ones
* keep changes focused
* explain important architectural decisions
* identify ambiguity rather than silently inventing domain behavior
* prefer maintainability over cleverness
* prefer simple solutions over unnecessary abstractions

**Most importantly: do not fight the existing architecture. Improve it only when the task actually requires it.**

# 40. File Naming Convention

Frontend files must follow the project's **dot-separated naming convention**.

The general format is:

```text
(name).(action).(extension)
```

Examples:

```text
hero.section.tsx
navbar.component.tsx
player.card.tsx
club.form.tsx
membership.table.tsx
match.details.tsx
dashboard.page.tsx
use-membership.hook.ts
membership.service.ts
```

The filename should communicate:

1. **What the thing represents**
2. **What type/purpose it has**

Do not use vague filenames such as:

```text
hero.tsx
component.tsx
index.tsx
thing.tsx
helper.ts
utils.ts
```

unless the existing framework or project structure specifically requires that convention.

---

# 41. Component Naming

The component name must correspond to the filename.

For example:

```text
hero.section.tsx
```

must contain a component named:

```tsx
HeroSection
```

Likewise:

```text
player.card.tsx
```

must contain:

```tsx
PlayerCard
```

and:

```text
membership.table.tsx
```

must contain:

```tsx
MembershipTable
```

The naming transformation is:

```text
hero.section.tsx      → HeroSection
player.card.tsx       → PlayerCard
club.form.tsx         → ClubForm
match.details.tsx     → MatchDetails
dashboard.page.tsx    → DashboardPage
```

Use **PascalCase** for React component names.

Do not create mismatched names such as:

```text
hero.section.tsx → Hero
```

or:

```text
player.card.tsx → PlayerComponent
```

The file name and exported component name must clearly correspond.

---

# 42. File Type Suffixes

Use meaningful suffixes that describe the role of the file.

Common examples:

```text
.section.tsx
.component.tsx
.page.tsx
.layout.tsx
.card.tsx
.form.tsx
.modal.tsx
.dialog.tsx
.table.tsx
.list.tsx
.item.tsx
.header.tsx
.footer.tsx
.nav.tsx
.sidebar.tsx
.hook.ts
.service.ts
.schema.ts
.types.ts
.constants.ts
.utils.ts
.test.ts
.spec.ts
```

Use the suffix that most accurately describes the file.

Do not create arbitrary suffixes simply to satisfy the naming convention.

---

# 43. Pages and Routes

Pages should also follow the naming convention where the framework allows it.

For example:

```text
dashboard.page.tsx
settings.page.tsx
memberships.page.tsx
```

If Next.js requires a framework-specific filename such as:

```text
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
```

**the framework convention takes priority.**

In those cases, use the project's internal component naming convention for the actual components.

For example:

```text
app/dashboard/page.tsx
```

may contain:

```tsx
export default function DashboardPage() {
  // ...
}
```

Do not rename framework-required files simply to satisfy the project naming convention.

---

# 44. Folder and Feature Naming

Folders should describe the domain or feature they contain.

Prefer:

```text
features/
├── memberships/
├── players/
├── coaches/
├── training/
├── matches/
└── academy/
```

Avoid meaningless folders such as:

```text
stuff/
misc/
things/
components2/
new/
temp/
```

Feature folders should use the project's established casing convention consistently.

---

# 45. No Generic `index.tsx` Components

Do not use generic `index.tsx` files for components unless the framework or existing architecture specifically requires them.

Prefer:

```text
hero.section.tsx
player.card.tsx
club.header.tsx
```

over:

```text
hero/index.tsx
player/index.tsx
club/header/index.tsx
```

The filename should make the purpose of the file obvious when viewed in an editor, search result, stack trace, or import list.

---

# 46. Import and Export Naming

Component imports should use the same name as the exported component.

Example:

```tsx
import { HeroSection } from "./hero.section";
```

Avoid aliases that obscure the component's identity:

```tsx
import { HeroSection as Something } from "./hero.section";
```

unless there is a legitimate naming conflict.

Prefer named exports for reusable components when consistent with the existing project architecture.

Follow the project's established convention for page/default exports where required by the framework.

---

# 47. Validation After Every Change

**After editing code, always run the appropriate validation commands before considering the task complete.**

At minimum, run one or more of:

```bash
npm run build
```

or:

```bash
npm run lint
```

or the equivalent command defined by the project.

If the project uses another package manager:

```bash
pnpm
yarn
bun
```

use the project's existing package manager and scripts.

Do not assume that code is correct merely because it looks correct.

---

# 48. Type Checking

TypeScript errors must be checked after meaningful code changes.

If the project has a dedicated type-check script, run it:

```bash
npm run typecheck
```

or the project's equivalent.

If no dedicated type-check script exists, use the project's established build process if it performs TypeScript checking.

Do not leave known TypeScript errors unresolved unless they are unrelated to the current task and are explicitly documented.

---

# 49. Linting

Run ESLint after editing frontend code.

For example:

```bash
npm run lint
```

Fix errors introduced by the current change.

Do not disable ESLint rules merely to make the check pass unless there is a documented and legitimate reason.

Avoid:

```tsx
// eslint-disable-next-line
```

as a shortcut for fixing a problem.

If an existing lint rule conflicts with the project's architecture, investigate the rule before disabling it.

---

# 50. Build Verification

For significant changes, run the production build:

```bash
npm run build
```

A successful development server is **not** sufficient evidence that the application builds correctly.

The agent should verify:

* TypeScript compilation
* module resolution
* imports
* route generation
* server/client component boundaries
* production bundling
* build-time environment requirements

when applicable.

---

# 51. Validation Is Part of the Task

The task is **not finished** when the code has been written.

The task is finished when:

```text
Implementation
      ↓
Lint
      ↓
Type Check
      ↓
Build (when appropriate)
      ↓
Fix errors
      ↓
Final review
```

If a validation command fails because of an issue introduced by the agent, fix it before completing the task.

If it fails because of a pre-existing unrelated issue:

1. Determine that it is unrelated.
2. Do not silently modify unrelated code.
3. Report the failure clearly.
4. Include the relevant command and error in the final response.

---

# 52. Never Hide Validation Failures

Never:

* ignore build failures
* ignore TypeScript errors
* ignore ESLint errors
* remove type safety to make the build pass
* disable lint rules without justification
* modify configuration simply to hide an error
* claim that validation passed when it was not run

If validation could not be run because of an environment issue, say so explicitly.

---

# 53. Final Agent Checklist

Before completing any frontend task:

* [ ] Files follow the `(name).(action).(extension)` convention where framework rules allow it.
* [ ] Component names correspond to their filenames.
* [ ] Components use PascalCase.
* [ ] Existing components and patterns were searched for and reused where appropriate.
* [ ] Tailwind is used for normal styling.
* [ ] Utility compositions of 3+ utilities appearing 3+ times are extracted into wrapper classes.
* [ ] Custom/complex styling is placed in CSS.
* [ ] Repeated colors and design tokens are centralized.
* [ ] Responsive behavior has been considered.
* [ ] Accessibility has been considered.
* [ ] Loading, empty, and error states are handled where applicable.
* [ ] No unnecessary dependencies were introduced.
* [ ] No unrelated code was changed.
* [ ] ESLint has been run.
* [ ] Type checking has been run when available.
* [ ] Build has been run for significant changes.
* [ ] All newly introduced errors have been fixed.
* [ ] Existing unrelated errors have been identified and reported.

# 54. Dependency Installation

**Do not install a new package by default.**

Before adding any dependency, first determine whether the functionality can reasonably be implemented using:

1. Existing project dependencies.
2. Existing project utilities/components.
3. Native browser APIs.
4. Native JavaScript/TypeScript.
5. CSS/Tailwind.
6. A small local utility or component.

For simple functionality, prefer implementing it manually rather than adding a dependency.

Examples of functionality that should generally **not** require a package:

* simple string manipulation
* simple array/object transformations
* basic formatting
* simple validation
* basic UI interactions
* simple debounce/throttle logic
* basic CSS animations
* simple responsive behavior
* basic modal/dropdown behavior when an existing component does not already exist
* simple calculations
* small reusable utilities

---

## Before Installing a Package

Before installing a dependency, ask:

> **Can this be implemented cleanly and maintainably without a package?**

If yes, prefer the manual implementation.

If no, evaluate:

* How complex is the functionality?
* How much code would a manual implementation require?
* Would a manual implementation be harder to maintain?
* Is the package actively maintained?
* Is the package widely used and trustworthy?
* Does it have unnecessary dependencies of its own?
* What is its bundle-size/runtime impact?
* Does the project already have a dependency that provides the same functionality?
* Will this package be used in multiple places?
* Does the package solve a genuinely complex problem?

Only introduce the dependency when it provides meaningful value.

---

## Do Not Add Packages for Trivial Problems

Avoid dependencies that exist only to replace a few lines of straightforward code.

Bad example:

```text
Need to capitalize a string
        ↓
Install a package
```

Prefer:

```ts
const result = value.charAt(0).toUpperCase() + value.slice(1);
```

when appropriate.

Likewise, do not install a library simply because it is convenient if the functionality is trivial and already available through the platform.

---

## Prefer Existing Dependencies

Before installing anything, inspect the existing:

```text
package.json
```

and project utilities.

The project may already have a dependency capable of solving the problem.

Do not install a second library that provides essentially the same functionality.

For example, do not introduce another:

* date library
* icon library
* animation library
* form library
* validation library
* state-management library
* HTTP client
* utility library

when the project already has an established solution.

---

## Complex Functionality

A package is justified when implementing the functionality manually would introduce significant complexity, maintenance burden, security concerns, or a large amount of unreliable code.

Examples may include:

* complex data visualization
* advanced rich-text editing
* sophisticated drag-and-drop
* complex date/time calculations
* advanced animation systems
* specialized file processing
* complex accessibility behavior
* cryptography
* established protocol implementations

For these cases, a well-maintained library is often preferable to reinventing the solution.

---

## Security-Critical Functionality

**Do not manually implement security-critical algorithms when a well-established, maintained library exists.**

Examples include:

* cryptography
* password hashing
* authentication protocols
* token handling
* cryptographic signing
* security-sensitive parsing

In these cases, correctness and security are more important than avoiding a dependency.

---

## Dependency Approval Rule

Before adding a package, the agent should be able to explain:

> **What problem does this package solve, why can't the existing project or platform solve it cleanly, and why is adding the dependency worth its maintenance and bundle cost?**

If the answer is essentially:

> "It saves me a few lines of code."

**Do not install it.**

---

## Keep Dependencies Minimal

Every dependency adds:

* maintenance cost
* security/update responsibility
* bundle impact
* potential compatibility problems
* another API to learn
* another potential breaking change

Therefore:

**Prefer a smaller dependency tree when functionality and maintainability remain equivalent.**

Do not install packages simply because they are popular, convenient, or commonly used in tutorials.
