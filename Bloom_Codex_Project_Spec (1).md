# BLOOM — Codex Project Build Specification

> **Purpose:** Give this complete document to Codex and ask it to build the project described here. Treat this file as the product requirements, design brief, and implementation checklist. Do not stop after generating a plan or static mockup: implement the working application, run the available checks, fix errors, and document how to run it.

## 1. Project Overview

### Product name
**Bloom**

### Tagline
**A calmer, more human way to manage your life.**

### One-sentence description
Bloom is a beautifully designed personal life command center that helps students and young professionals plan realistic days around their priorities, available time, and self-reported energy—then celebrates progress through a living digital garden rather than punitive streaks and productivity pressure.

### Product goal
Create a polished, portfolio-ready, responsive web application for the HyperBloom October UI/UX & Web Design Hackathon. Design and usability are the primary competitive advantages. The finished project must look like a cohesive real product, not a generic dashboard template.

### Core user problem
Traditional productivity tools often present users with long lists, rigid schedules, and streaks that can make falling behind feel like failure. Bloom should help users answer three questions:

1. What matters most today?
2. What can I realistically accomplish with the time and energy I have?
3. Am I making progress toward my goals?

### Product principles
- **Human before hustle:** Do not shame users for missed tasks or broken streaks.
- **Clarity over clutter:** Show the next useful action before secondary details.
- **Real interactions:** The core interface must be usable, not just visually convincing.
- **Quiet delight:** Use motion to explain state changes and reward meaningful progress, not to distract.
- **Accessible by default:** Support keyboard navigation, readable contrast, visible focus, reduced-motion preferences, and clear labels.
- **Small but complete:** Make the primary journey excellent before adding secondary features.

## 2. Required Technical Stack

Build the project with:

- **Next.js** using the App Router.
- **React** and **TypeScript**.
- **Tailwind CSS** for styling, if it is already configured or can be added cleanly.
- **GSAP** for purposeful UI animation, including `gsap.context()` and cleanup in React effects. Use `@gsap/react` if appropriate for the installed version.
- **Lucide React** for consistent interface icons.
- **Local storage** for persistence in the first version. The application must work without a backend, API key, or account. It must also be deployable on Vercel's free Hobby plan for a personal/hackathon project, without relying on paid services or paid-only platform features.

Use the repository's existing package manager and conventions where possible. Inspect the current files before changing them. Avoid rewriting working configuration unnecessarily. If this is a blank repository, scaffold a clean Next.js App Router project structure.

Do not use Framer Motion or another animation library in place of GSAP. CSS transitions may be used for simple hover/focus states; GSAP should handle intentional entrance, reveal, garden-growth, and interaction sequences.

Do not require an LLM, paid API, Supabase project, or external credentials for the core experience. Do not put secrets in client code.

## 3. Target Deliverable

Build a responsive, interactive web application with the following core areas:

1. Marketing landing page.
2. First-run onboarding flow.
3. Daily dashboard.
4. Interactive task planner and timeline.
5. Focus mode with a working timer.
6. Progress page with the digital garden and weekly reflection.
7. Settings/preferences panel for planning and accessibility-related preferences.

The experience may be implemented as multiple routes or a cohesive app shell with internal navigation. Prefer clear, conventional routes using the Next.js App Router. A suggested route map is included below.

### Suggested routes
- `/` — Landing page.
- `/app/onboarding` — First-run preferences and energy selection.
- `/app/today` — Main daily dashboard.
- `/app/plan` — Task planning and schedule timeline.
- `/app/focus` — Focus timer.
- `/app/garden` — Progress and digital garden.
- `/app/settings` — Preferences.

If a route is unnecessary for a clean experience, integrate it into the main app shell rather than introducing redundant navigation. All main navigation links and buttons must work.

## 4. Visual Identity and Design System

### Overall visual direction
Bloom should feel warm, calm, editorial, botanical, premium, and modern. It should not resemble a generic admin dashboard or a typical neon AI product.

Avoid:
- A full black/neon visual style.
- Excessive glassmorphism.
- Unnecessary gradients on every card.
- Dense tables as the main interface.
- Too many bordered cards nested inside other cards.
- Excessively rounded controls everywhere.
- Constant decorative movement.
- Fake analytics that look precise but do not correspond to app data.

### Color palette
Use a restrained token-based palette. Suggested starting values may be tuned for visual harmony and accessibility:

- Warm ivory page background: `#F8F6F0`
- Clean card surface: `#FFFEFA`
- Primary botanical green: `#315B43`
- Deep text: `#222A24`
- Muted text: `#73786F`
- Sage: `#DCE8D9`
- Muted lavender: `#E9E3F5`
- Soft peach: `#F5DFD2`
- Pale yellow: `#F1E8C7`
- Borders/dividers: a low-contrast warm gray such as `#E7E4DB`
- Error/destructive: a restrained accessible red, used sparingly.

Use semantic design tokens in CSS variables rather than scattering color literals throughout components. Ensure all text and controls meet suitable contrast requirements. Do not use color alone to communicate task status.

### Typography
- Use an expressive editorial serif for large marketing headlines and selected emotional moments.
- Pair it with a clean, highly readable sans-serif for controls, labels, navigation, body copy, dates, and dashboard data.
- Use `next/font` with fonts available through that mechanism, or use a reliable system fallback if external font fetching is unavailable.
- Establish a consistent type scale and line-height system.
- Keep dashboard text compact enough to scan but never tiny.

### Layout and shape
- Desktop: generous whitespace, strong alignment, clear hierarchy, and a compact persistent sidebar or navigation rail in the app area.
- Mobile: simplified top bar, accessible menu/navigation, stacked content, full-width touch-friendly controls, and no horizontal overflow.
- Use a spacing scale and consistent radii. Cards may have softly rounded corners, but controls and surfaces should not all use the same exaggerated pill shape.
- Use subtle shadows only when they establish hierarchy; prefer surface contrast and spacing.
- Design empty states deliberately with helpful next actions.

### Iconography and illustrations
- Use Lucide icons for actions and standard navigation.
- The digital garden should use original, lightweight CSS/SVG illustrations or carefully constructed inline SVGs. Do not depend on images loaded from unreliable remote URLs.
- Build a coherent small set of plant/seed/leaf illustrations that can evolve through progress states.
- Decorative SVG elements must not interfere with screen readers; mark purely decorative artwork appropriately.

## 5. Information Architecture and Main Navigation

The core app navigation should include:
- Today
- Plan
- Focus
- Garden
- Settings

On desktop, a slim sidebar is preferred. Include the Bloom wordmark/leaf mark at the top and a calm, unobtrusive profile/preferences area at the bottom. On mobile, move navigation into a compact header and accessible menu or a simple bottom navigation when it fits the design.

Clearly indicate the current route. Every interactive navigation item must navigate correctly.

## 6. Landing Page (`/`)

### Objective
Explain Bloom's value in a few seconds, create an emotional first impression, and guide the user into the product.

### Required sections
1. **Header:** Bloom wordmark, a small set of anchor links such as How it works and Philosophy, and a primary “Plan my day” action.
2. **Hero:** Clear headline, brief subheading, primary CTA, secondary “See how it works” link, and a beautiful living-garden/product preview composition.
3. **Product preview:** Show a credible miniature view of the actual dashboard UI. Reuse real UI components or shared visual primitives rather than presenting a disconnected fake screenshot.
4. **How it works:** Three simple steps—check in, shape your day, grow at your own pace.
5. **Feature highlights:** Energy-aware planning, flexible scheduling, focus sessions, and a progress garden.
6. **Product philosophy:** Explain that missed tasks are rescheduled without shame and progress is not measured only through streaks.
7. **Closing CTA:** Invite visitors to start planning.
8. **Footer:** Small, useful footer with brand and navigation links.

### Suggested hero copy
**Headline:** “Make room for what matters.”

**Supporting copy:** “A gentler daily planner that works with your energy, adapts when plans change, and helps small steps grow into meaningful progress.”

**Primary CTA:** “Plan my day”

**Secondary CTA:** “See how Bloom works”

### Landing-page behavior
- Main CTA opens onboarding for first-time visitors or the Today dashboard if the user has already completed onboarding.
- Anchor links scroll to the matching section.
- The “See how Bloom works” action should scroll to the explainer section, not be decorative.
- The dashboard preview should be responsive and avoid overwhelming the hero with tiny text.
- Use GSAP for a carefully choreographed, lightweight entrance sequence: headline, copy/CTA, then the garden/product preview. Keep the sequence short and let users reach content quickly.

## 7. First-Run Onboarding (`/app/onboarding`)

### Objective
Collect only the minimum useful preferences, show how personalization works, and get the user to their first plan quickly.

### Suggested steps
1. **Welcome:** Explain Bloom in one sentence.
2. **Goals:** Let users select one or more focus areas, such as Study, Work, Personal, Health, or Creative time.
3. **Energy check-in:** Select Low, Balanced, or High. Include text and accessible labels; do not rely on color alone.
4. **Planning style:** Optional choice between a structured timeline and a flexible priority list.
5. **Ready state:** Show a short summary and a “Build my day” action.

Keep onboarding skippable where reasonable. Do not make users fill in a long questionnaire. Show a clear step indicator and back/continue actions. Save valid preferences to local storage and route to Today when finished.

### Interaction requirements
- Selected cards have clear active states.
- Continue/back buttons function correctly.
- Refreshing should not silently discard completed onboarding.
- Users can revise preferences later in Settings.
- Avoid presenting personalization as medical advice or as an objective measurement of the user's health. Energy is a self-reported planning preference only.

## 8. Daily Dashboard (`/app/today`)

This is the primary and most important screen. Give it the most design and interaction attention.

### Overall hierarchy
1. Greeting and current date.
2. A compact energy check-in/control.
3. Main “Today” area with a clear primary task/action.
4. Top priorities.
5. Schedule/timeline or next-up list.
6. Garden/progress preview.
7. Helpful reset action if the user has overdue or unfinished tasks.

### Header example
“Good morning.”
“Small steps still move you forward.”
Show the current date in a readable format and allow energy to be updated at any time.

### Required features
- Add a task from the dashboard quickly.
- Mark a task complete/incomplete.
- Edit, delete, reprioritize, and reschedule a task.
- Display estimated duration and category when set.
- Let users pin or designate a small set of top priorities.
- Show progress derived from real task data, not hardcoded percentages.
- Include a calm empty state when no tasks exist.
- Make the next useful action visually obvious.
- Add a compassionate “Reset my day” or “Replan unfinished tasks” action when useful.

### Task entry
A task should support:
- Title (required).
- Optional details/notes.
- Category (Study, Work, Personal, Health, Creative, or Other).
- Priority (High, Medium, Low).
- Estimated duration (for example: 15, 25, 30, 45, 60, 90 minutes or a custom supported value).
- Optional scheduled start time.
- Completion status.
- Creation timestamp and stable ID.

Validate forms, prevent empty task titles, and use friendly inline errors. Do not use blocking browser `alert()` dialogs for normal flows.

## 9. Energy-Aware Planning

### Purpose
Use the user's own energy selection to help them shape a manageable day. This is a lightweight planning aid, not a clinical or scientific assessment.

### Choices
- **Low energy:** Suggest a smaller plan with fewer priority tasks and more breathing room. Make shorter or lower-friction tasks more visible.
- **Balanced energy:** Suggest a normal balanced mix of important and routine work.
- **High energy:** Allow a slightly fuller plan, while still respecting time estimates and avoiding unrealistic workload suggestions.

### Required behavior
- The user can change energy at any time.
- The UI explains why a suggested task ordering changed, when applicable.
- Suggestions must be deterministic and understandable, not a fake AI response.
- The application must never make the user's task list inaccessible simply because they selected low energy.
- Present suggestions as optional, with the user in control.
- Do not automatically delete or permanently deprioritize tasks based on energy.

### Suggested scheduling heuristic
Keep the algorithm simple and document it in code. For example:
1. Respect tasks marked completed.
2. Prefer higher-priority tasks.
3. When energy is low, gently favor short tasks and lower the suggested workload.
4. When energy is balanced, sort mainly by priority and schedule.
5. When energy is high, allow one or two more focused tasks to appear earlier.
6. Preserve explicit user scheduling when possible.
7. Never treat the heuristic as an authoritative decision; users can override it.

Show a concise explanation such as “A lighter plan leaves room to breathe today.” Avoid false claims like “Your brain performs 40% better.”

## 10. Interactive Planner (`/app/plan`)

### Objective
Let users manage tasks and understand how their day fits together.

### Desktop layout
- Page heading with date and day navigation if implemented.
- An “Add task” action.
- A clear timeline column with hour markers and scheduled tasks.
- A secondary task list for unscheduled tasks.
- A compact planning summary that calculates scheduled time from task estimates.

### Mobile layout
- Use a stacked agenda/list representation instead of squeezing a desktop time grid onto a narrow screen.
- Maintain accessible controls and touch targets.
- Avoid horizontal scrolling.

### Required interaction
- Create/edit/delete tasks.
- Mark tasks complete and reopen them.
- Assign or update the scheduled start time.
- Reschedule or unschedule a task.
- If drag-and-drop is implemented, also provide keyboard-accessible or button-based ways to change schedule/order.
- Show clear feedback when a task is moved.
- Prevent overlapping visual elements and impossible layouts. If exact collision handling is too involved, display an ordered agenda with honest time labels rather than misleading overlap geometry.

### Useful details
- Use restrained labels such as “9:00 AM,” “25 min,” and category names.
- Show the sum of planned duration.
- If the plan exceeds the preferred/available day capacity, show a gentle suggestion to trim or move tasks rather than a red failure warning.
- Do not make drag-and-drop the only way to use the planner.

## 11. Focus Mode (`/app/focus`)

### Visual objective
A minimal, distraction-free screen with one task, one timer, and a clear exit path.

### Required behavior
- Let users choose a task to focus on, or start from a task card.
- Provide a working countdown timer with sensible defaults such as 25 minutes and selectable durations.
- Support start, pause, resume, and reset.
- Display elapsed/remaining time clearly.
- On completion, show a quiet success state and offer a break or another session.
- Allow leaving focus mode without losing the task.
- Persist relevant task completion state and session summary if the user chooses to complete the task.
- Clean up any intervals/timers in React effects and avoid duplicate timers after re-rendering.

### Animation
Use GSAP for a subtle entrance and a restrained completion celebration. Do not animate every timer tick. Honor `prefers-reduced-motion`.

## 12. Digital Garden and Progress (`/app/garden`)

### Purpose
Represent meaningful progress as a garden that changes based on real completed tasks. This is Bloom's signature visual identity.

### Required features
- A visually memorable garden illustration built with SVG/CSS components.
- Plant/garden states that evolve based on task completions or completed priority tasks.
- A weekly summary based on actual locally stored task/session data.
- A gentle reflection prompt, such as “What helped you make progress this week?”
- A small list of meaningful wins.
- Empty/new-user state for people who have not completed tasks yet.

### Progress rules
- Define and document transparent growth rules, such as a seedling appearing after the first meaningful completed task, new leaves after additional milestones, and more garden variety after repeated progress.
- Avoid giving exact-looking scores or analytics unless they are actually calculated from app data.
- Progress must not decay or punish the user for taking a day off.
- A missed day should not kill plants or erase progress.
- Use visual growth to reward consistency over time, not nonstop productivity.

### GSAP interactions
- Animate plant growth only when progress changes or when the user first enters the garden—not continuously.
- Use short, subtle scale/opacity/path-reveal effects where practical.
- Keep text content and the core garden state available when motion is disabled.
- Do not depend on animation to communicate a plant's current state.

## 13. Reset and Rescheduling Experience

This is an important differentiator. Make it easy for a user to recover when their day changes.

### Example flow
1. User has unfinished tasks.
2. User clicks “Replan my day” or “Reset my day.”
3. App shows a short summary of the unfinished tasks and offers sensible choices: move to later today, move to tomorrow, leave unscheduled, or keep as-is.
4. User confirms the changes.
5. App updates task data and displays a calm confirmation message.

Use supportive copy, for example:
- “Plans change. Let's make a little room.”
- “You haven't failed; the plan just needs adjusting.”
- “Choose what still matters today.”

Avoid infantilizing language, guilt, shame, or aggressive motivational slogans. Do not automatically move tasks without giving the user a clear choice.

## 14. Settings (`/app/settings`)

Implement a compact settings screen that allows users to change:
- Display name or preferred greeting, if collected.
- Default planning style.
- Default focus duration.
- Preferred day start/time range if needed.
- Reduced motion preference (the system preference must also be honored automatically).
- Clear/reset local app data, with a confirmation step and clear explanation of what will be deleted.

Persist settings locally. Do not require sign-in.

## 15. Data Model and Persistence

Use TypeScript types and a small, clear local data layer. Suggested shape:

```ts
type EnergyLevel = "low" | "balanced" | "high";
type TaskCategory = "study" | "work" | "personal" | "health" | "creative" | "other";
type TaskPriority = "high" | "medium" | "low";

type BloomTask = {
  id: string;
  title: string;
  notes?: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimateMinutes: number;
  scheduledStart?: string; // ISO datetime or a documented local-time representation
  completed: boolean;
  createdAt: string;
  completedAt?: string;
};

type BloomPreferences = {
  onboardingCompleted: boolean;
  displayName?: string;
  energyLevel: EnergyLevel;
  planningStyle: "timeline" | "priorities";
  defaultFocusMinutes: number;
  reducedMotion?: boolean;
};

type FocusSession = {
  id: string;
  taskId?: string;
  plannedMinutes: number;
  actualSeconds: number;
  completed: boolean;
  startedAt: string;
  endedAt?: string;
};
```

Adapt the schema as needed, but keep it typed, small, and documented. Be consistent about date/time handling and avoid timezone bugs by separating date keys from full timestamps where necessary.

### Persistence requirements
- Read and write local storage only on the client.
- Avoid accessing `window` or `localStorage` during server-side rendering.
- Prevent hydration mismatches. Initialize safely and show a stable loading/skeleton state if necessary.
- Version the stored shape or implement defensive parsing so old/bad data does not crash the app.
- Provide safe defaults if storage is empty or malformed.
- Centralize storage access instead of scattering raw local-storage calls across components.
- Use stable IDs for tasks and sessions.
- Keep user data local and state that clearly in the UI or privacy note.

## 16. GSAP Animation Requirements

GSAP is a core part of this brief, but product usability comes first.

### Required animation moments
1. Landing page hero entrance: staged headline, supporting text, CTAs, and garden/product preview.
2. Section reveals: subtle opacity/vertical movement as meaningful sections enter the viewport.
3. Dashboard entrance: gentle stagger of major regions, not every tiny element.
4. Task interactions: short visual confirmation when completing, adding, or moving a task.
5. Garden growth: a small, visually rewarding animation when a milestone is reached.
6. Focus session completion: one restrained celebratory animation.

### Implementation rules
- Use `gsap.context()` scoped to a component root and revert it during cleanup, or use `useGSAP` from `@gsap/react` where appropriate.
- Respect React lifecycle, Strict Mode, component unmounting, and route changes. Kill/revert active timelines and ScrollTriggers when no longer needed.
- Avoid selecting elements with broad global selectors. Scope selectors to refs or use stable refs/data attributes.
- Avoid mutating React-owned DOM structure directly with GSAP. Animate transform, opacity, and other presentation properties.
- Avoid layout-thrashing animations and unnecessary scroll listeners.
- Use ScrollTrigger only where it adds value, and clean it up correctly.
- Do not initialize the same animation multiple times on re-render.
- Honor `prefers-reduced-motion: reduce`; skip nonessential movement or use very short opacity-only transitions. Functionality must remain identical.
- Ensure content remains visible if JavaScript animations fail or are disabled. Do not leave headings invisible while waiting for a GSAP timeline.
- Avoid scroll hijacking, long intro delays, constant looping movement, and animation that blocks interaction.
- Keep touch and keyboard interactions reliable.

## 17. Interaction and Component Quality

Create reusable components where they improve consistency, such as:
- `AppShell`
- `Sidebar` / `MobileNavigation`
- `Button`
- `TaskCard`
- `TaskForm` / `TaskDialog`
- `PriorityBadge` or equivalent non-color-only indicator
- `EnergySelector`
- `EmptyState`
- `GardenIllustration`
- `FocusTimer`
- `SectionHeading`
- `ProgressSummary`
- `ConfirmDialog`
- Toast/inline feedback component

Do not build an unnecessarily elaborate design-system framework. Components should be reusable, typed, and simple to understand.

### Interaction standards
- Every visible button/link must do something meaningful.
- Show hover, active, focus, disabled, success, and error states as appropriate.
- Use dialogs/popovers with correct focus handling if implemented.
- Avoid browser `alert()` and `confirm()` for regular product interactions.
- Give users feedback when an action succeeds or fails.
- Use sensible empty, loading, and error states.
- Do not use placeholder links such as `href="#"` for controls that are expected to work.
- Do not ship nonfunctional decorative toggles or fake interactive charts.

## 18. Accessibility Requirements

Accessibility is part of the judging brief and a functional requirement.

- Use semantic headings in logical order.
- Use landmarks such as `header`, `nav`, `main`, and `footer` appropriately.
- All inputs require visible labels or equivalent accessible names.
- All interactive elements must be keyboard accessible.
- Ensure focus styles are visible and not removed.
- Use appropriate ARIA only where native HTML is insufficient.
- Never communicate status by color alone; pair it with text, shape, or an icon.
- Use sufficient foreground/background contrast.
- Touch targets should be comfortable on mobile.
- Respect `prefers-reduced-motion` in CSS and GSAP.
- Ensure modal/dialog focus is managed and returned on close.
- Give meaningful accessible names to icon-only buttons.
- Mark decorative SVGs and icons as hidden from assistive technology.
- Ensure text zoom and narrow layouts do not break the interface.
- Do not make drag-and-drop the only available input method.

## 19. Responsive Requirements

Support at least these viewport categories:
- Small mobile: approximately 320–375 px wide.
- Typical mobile: 390–430 px wide.
- Tablet: around 768 px wide.
- Laptop: 1280 px wide.
- Large desktop: 1440 px and above.

On every route:
- No accidental horizontal overflow.
- No clipped buttons or critical text.
- The primary action remains easy to find.
- Cards reflow intentionally rather than simply shrinking.
- Navigation remains accessible.
- The planner uses a mobile-friendly agenda representation when needed.
- Dialogs/forms fit within the viewport and can scroll internally if required.

## 20. Suggested Project Structure

Adapt to the existing repository, but aim for clear separation of routes, reusable UI, domain logic, and persistence. One reasonable starting point:

```text
app/
  layout.tsx
  page.tsx
  globals.css
  app/
    layout.tsx
    onboarding/page.tsx
    today/page.tsx
    plan/page.tsx
    focus/page.tsx
    garden/page.tsx
    settings/page.tsx
components/
  layout/
  landing/
  tasks/
  garden/
  focus/
  ui/
lib/
  types.ts
  storage.ts
  tasks.ts
  planner.ts
  dates.ts
  accessibility.ts
hooks/
  use-bloom-data.ts
  use-reduced-motion.ts
public/
  icons/
```

Do not blindly copy this tree if the current repository already has a sensible structure. Keep client components limited to places where state, browser APIs, or animation require them. Prefer server components for static content when sensible, but ensure the client-side local data architecture is straightforward and hydration-safe.

## 21. Content and Microcopy

Use clear, human, concise copy. Avoid placeholder Lorem Ipsum.

Possible copy themes:
- “Make room for what matters.”
- “Small steps still move you forward.”
- “Build a day that fits you.”
- “Plans change. Let's make a little room.”
- “Progress doesn't need to be perfect.”
- “Your garden grows at your pace.”
- “A lighter plan leaves room to breathe.”

Do not overuse these lines. Keep the product voice supportive without sounding childish, sentimental, or preachy.

## 22. Demo Data and Demo Journey

The project should look useful immediately, including for a hackathon judge who opens it without setting anything up.

Implement a friendly first-run experience. Once the user finishes onboarding, either seed a small set of clearly editable example tasks or guide them through creating their first task. Prefer allowing a one-click sample plan so the judge can quickly explore the product; label it clearly as sample/demo content and allow it to be edited or cleared.

Suggested demo tasks:
- Review data structures — Study — High priority — 45 minutes.
- Send project update — Work — Medium priority — 15 minutes.
- Take a short walk — Health — Low priority — 20 minutes.
- Sketch landing-page ideas — Creative — Medium priority — 30 minutes.

Suggested judge demo journey:
1. Start at the landing page.
2. Click “Plan my day.”
3. Complete or skip the short onboarding flow.
4. Change energy to Low and observe the suggested task order/plan adjust.
5. Add a task and mark one complete.
6. Open the planner and schedule or reschedule a task.
7. Start and pause a focus session.
8. Visit the garden and see progress reflected in the illustration/summary.
9. Trigger the reset/replanning flow for unfinished tasks.

All demo steps must be possible without secrets or backend setup.

## 23. Performance and Code Quality

- Keep the app responsive and avoid unnecessary client bundles.
- Do not introduce heavyweight dependencies without a clear reason.
- Optimize SVG and CSS artwork; avoid relying on large remote images.
- Use stable React keys and correct effect cleanup.
- Avoid using array indexes as IDs for persistent entities.
- Keep TypeScript types meaningful; avoid `any` unless unavoidable and documented.
- Avoid deeply nested components in one enormous page file.
- Avoid hardcoding dashboard metrics that contradict current data.
- Handle empty, malformed, and unusual user input gracefully.
- Check console output for React hydration warnings and runtime errors.
- Use linting and the project's available test/type-check commands.

## 24. Testing and Verification

After implementation, run the commands supported by the repository, as appropriate:
- Install dependencies if needed using the existing package manager.
- Run lint.
- Run TypeScript/type checking.
- Run the production build.
- Run tests if any exist.

Fix implementation errors rather than simply reporting them. If a command cannot run because a dependency or environment capability is missing, state that accurately in the final report.

Manually verify or test:
- Landing CTA and internal navigation work.
- Onboarding selections, back/continue, completion, and persistence work.
- Create/edit/delete/complete task flows work.
- Energy selection updates planning suggestions.
- Planner rescheduling functions and has a keyboard-accessible alternative to drag-and-drop.
- Focus timer starts, pauses, resumes, resets, and cleans up correctly.
- Garden/progress derives from actual local data.
- Reset/replan flow requires deliberate user confirmation.
- Settings persist, and clearing local data works as explained.
- Refresh does not crash or silently corrupt stored data.
- Mobile layouts have no horizontal overflow.
- Reduced-motion preference suppresses nonessential animations.
- All actionable controls have functional behavior and visible focus states.

## 25. Definition of Done

The project is ready when all the following are true:

- [ ] The project uses Next.js, React, TypeScript, and GSAP.
- [ ] The landing page is visually polished and explains Bloom clearly.
- [ ] Onboarding is short, accessible, and functional.
- [ ] The Today dashboard is the most polished and useful app screen.
- [ ] Tasks can be created, edited, completed, reopened, reprioritized, rescheduled, and deleted.
- [ ] Energy-aware suggestions are understandable, deterministic, and optional.
- [ ] The planner is usable on both desktop and mobile.
- [ ] The focus timer works and cleans up timers correctly.
- [ ] The garden reflects actual progress and does not punish missed days.
- [ ] The replan/reset flow is clear and non-punitive.
- [ ] Preferences and task data persist locally without a backend.
- [ ] GSAP animation lifecycle and reduced-motion support are handled correctly.
- [ ] Keyboard access, labels, contrast, and focus states have been addressed.
- [ ] No visible primary buttons or navigation items are dead.
- [ ] The site is responsive and has no obvious console/runtime errors.
- [ ] Lint, type check, and production build pass where supported.
- [ ] README includes setup, scripts, main features, architecture notes, and Vercel Hobby deployment steps.
- [ ] The project builds and deploys on Vercel using the standard Next.js framework preset and default build settings, without paid-only dependencies or required secrets.

## 26. Vercel Hobby Plan Deployment Requirements

The finished project must be straightforward to deploy and run on **Vercel's free Hobby plan** for a personal/hackathon project. Check Vercel's current plan terms before deployment; do not assume the free plan is suitable for commercial use. Do not design around paid-only features.

### Deployment constraints
- Use standard Next.js App Router conventions that Vercel detects automatically.
- Keep the main experience frontend-first. Task data, preferences, onboarding completion, garden progress, and focus settings should use browser local storage. The app must not require a database, server API, authentication provider, LLM, payment service, or external API to work.
- Do not require environment variables for the core application. Never embed secrets or private keys in client-side code. If optional integrations are added, they must be disabled by default and the app must still work without them.
- Avoid paid-only Vercel products and any feature that requires an upgraded plan. Do not introduce paid external services merely for analytics, forms, images, storage, or authentication.
- Do not add a custom `vercel.json`, custom output directory, or static-export configuration unless there is a demonstrated requirement. Prefer Vercel's automatic Next.js detection and default build settings.
- Ensure browser-only APIs such as `localStorage`, `window`, `document`, and GSAP animations are only accessed in client components and after mount/effect where appropriate, to prevent server-rendering and hydration errors.
- Confirm that the production build succeeds locally with the repository's package manager before considering the project deploy-ready.
- Ensure all routes behave correctly when opened directly, refreshed, or navigated to from the app.

### README must include a Vercel deployment guide
Document this simple Git-based path:
1. Push the project to a GitHub, GitLab, or Bitbucket repository. Make sure `.env*` secrets are not committed; provide a suitable `.gitignore`.
2. Sign in to Vercel and import the repository as a new project.
3. Set the root directory to the project root (unless the repository structure requires a subdirectory).
4. Let Vercel detect **Next.js** and use its default install/build settings. Do not set an output directory manually without a specific reason.
5. Deploy and inspect the production URL on desktop and mobile.
6. For future changes, push a commit to the connected Git repository and let Vercel create the deployment.

Also document the CLI alternative if appropriate: install/use the Vercel CLI, run `vercel` from the project root for a preview deployment, and use `vercel --prod` for a production deployment after linking the project. Do not claim the deploy is complete unless the deployment was actually executed and verified.

### Vercel deployment acceptance checks
- [ ] Standard Vercel Next.js detection works without custom configuration.
- [ ] `npm run build` (or the matching command for the repository's package manager) succeeds.
- [ ] The deployed site does not require environment variables to demonstrate the core journey.
- [ ] Local-storage persistence, direct route access, refresh, and navigation work in the deployed version.
- [ ] No secrets, local machine paths, localhost API URLs, or private tokens are shipped to production.
- [ ] README contains practical deployment steps and states that Vercel plan limits and terms can change.

## 27. Final Instructions to Codex

1. **Inspect first.** Review the current repository, package manager, Next.js version, and existing configuration before editing anything.
2. **Build, don't just advise.** Make the actual code changes. Do not respond with only a plan or snippets.
3. **Prioritize quality.** Start with the design system and landing page, then build the shared app shell and complete the core daily-planning journey. Do not add unrelated features at the expense of polish.
4. **Use GSAP correctly.** Implement the meaningful animation moments in this document with proper lifecycle cleanup and reduced-motion behavior.
5. **Keep it functional.** Connect components to real React state and local persistence. Do not use fake static controls to simulate features that should work.
6. **Check your work.** Run available lint, type-check, test, and build commands, then fix discovered issues.
7. **Document the result.** Update or create a README with installation, development, build, and usage instructions.
8. **Make it Vercel Hobby-ready.** Keep the project compatible with Vercel's free Hobby plan for personal/hackathon use. Prefer the standard Next.js deployment path and avoid paid-only services, unnecessary server functions, paid databases, or required runtime secrets. The core product must work after deployment with browser local storage. Do not introduce a `vercel.json` or custom build/output settings unless genuinely required.
9. **Document deployment.** Update the README with the exact steps to push the project to a Git provider, import it into Vercel, confirm the Next.js framework preset and root directory, use the detected/default install and build settings, deploy, and redeploy after future pushes. Explain that no environment variables should be required for the core version. Include optional Vercel CLI commands only if useful.
10. **Summarize precisely.** At the end, report what was implemented, the main routes, key interactions, commands run and their actual results, and any known limitations. Do not claim checks passed unless they were run successfully.

**The intended result is a cohesive, premium, warm, botanical productivity product with excellent usability—not a generic dashboard template.**
