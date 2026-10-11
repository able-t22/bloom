# Verification

Verified locally on Windows with Node.js 24.21.0. The exact package versions are recorded in package.json and package-lock.json.

## Automated code checks

| Command | Result |
| --- | --- |
| npm test | Passed: 9 domain tests |
| npm run lint | Passed, exit 0 |
| npm run typecheck | Passed, exit 0 |
| npm run build | Passed, exit 0; all App Router routes generated |

Domain coverage includes malformed/version-incompatible storage, schema sanitization, duplicate recovery, deterministic nonmutating energy suggestions, one-time permanent garden growth, selective replanning across midnight/year boundaries, local date keys, and weekly aggregation.

## Runtime and layout checks

**19 browser checks passed; no captured runtime exceptions or console errors.** Detailed evidence: docs/browser-verification.json.

The production server returned HTTP 200 for /, /app/onboarding, /app/today, /app/plan, /app/focus, /app/garden, and /app/settings.

Chrome browser verification exercises landing navigation; onboarding and editable sample content; energy ordering; task creation, scheduling, editing, pinning, reprioritization, completion, reopening, and confirmed deletion; native dialog Escape handling and focus return; timer start/pause/resume/reset/completion and session persistence; garden progress and reflection saving; confirmed replanning; system/manual reduced motion; preferences across route reloads; and confirmed clearing of local data.

All seven main routes are checked for horizontal overflow at 320, 390, 768, and 1280 pixels. Desktop screenshots use 1440 pixels; a mobile dashboard screenshot uses 390 pixels. See docs/ for the reviewed screenshots.

The timer completion branch is tested by advancing the test browser's wall clock. Pause, resume, and reset are exercised before that jump. This verifies deadline handling without waiting for a real 25-minute session; background-tab throttling and a full uninterrupted 25-minute session were not separately tested.

## Environment notes

Network package installation was denied with EACCES. Compatible packages already installed locally were copied into this workspace to enable genuine lint, type checking, and production builds. An offline-generated lockfile includes cross-platform Next.js compiler metadata. No application source or data from another project was reused.

The first production attempt overlapped a development server writing the same .next directory. Stopping the development child and rebuilding resolved the manifest collision. Subsequent checks use a single production server. Browser testing also caught a form control named style shadowing HTMLFormElement.style; renaming the field resolved GSAP cleanup errors.

For an ordinary connected checkout, run npm ci, then the documented commands. Review current Next.js/security updates before public release: the verified local framework is Next.js 14.2.35, not a claim to the latest available release. Offline package installation is not an online vulnerability audit.

No Vercel deployment was executed. The app uses standard Next.js settings and requires no runtime environment variables; final Vercel-origin persistence, mobile-device behavior, and deployment checks remain to be run after publication. Data is local to each browser/origin; no cross-device sync or backup import is included. Incomplete focus sessions abandoned by navigation are not recorded.

## GSAP and interactive showcase update

- TypeScript: tsc --noEmit passed.
- Domain regression: all 9 tests passed.
- Production build: next build passed, including its lint and type checks.
- Chrome production regression: all 24 checks passed; no runtime or console errors. Includes energy demo isolation and completion, FAQ disclosure, saved and live system reduced motion, keyboard palette navigation, unfinished-task search, empty results, Escape focus restoration, and existing planner workflows.
- Responsive checks: all routes fit 320, 390, 768, and 1280 px.
- Initial homepage JavaScript: 108 kB in the new Next.js build output versus 133 kB in the retained previous build log (about 19% lower). Deferred GSAP still downloads after hydration; this comparison measures initial route JavaScript, not total bytes or frame rate. No hardware performance benchmark was performed.
- Visual evidence: .bloom-browser/landing.png, today.png, today-mobile.png, energy-1440.png, and energy-390.png.

## Expressive color and transition update

- Production build passed with lint and type validation; standalone TypeScript check also passed.
- Chrome production regression: all 26 checks passed with no runtime/console errors. The added checks confirm ribbon motion pauses outside the viewport and the four-color navigation panels actually cover more than 95% of the viewport before releasing on route arrival.
- All application routes fit 320, 390, 768, and 1280 px.
- Desktop and mobile screenshots reviewed for the hero, colorful steps, energy playground, and closing section. Transition screenshot: .bloom-browser/color-transition.png.
- Initial homepage JavaScript is 109 kB in Next.js build output, versus 108 kB before this visual update. No dependencies were added. Ambient GSAP timelines are paused outside the viewport and while the document is hidden, and cleaned up when motion preferences change or the landing page unmounts.

## Ribbon removal and advanced scroll update

- Removed the moving typography ribbon shown in image.png, including its component, looping tween, styles, and obsolete test.
- Production build, its lint/type validation, and standalone TypeScript check passed.
- All 26 planner/landing browser regression checks and all 9 advanced scroll checks passed with zero browser errors.
- Advanced checks cover all three pinned story steps, reverse scrolling, live reduced-motion restoration, mobile normal flow, repeated breakpoint changes without duplicate pins, perspective reveal, scroll-drawn SVG path, magnetic buttons, and route cleanup.
- All routes fit 320, 390, 768, and 1280 px. Desktop and mobile story screenshots were inspected: .bloom-browser/scroll-story-desktop.png and scroll-story-mobile.png.
- Initial homepage JavaScript: 110 kB (previous update: 109 kB). GSAP ScrollTrigger is deferred into a separate dynamic chunk. No dependencies were added. This is a bundle-size comparison, not a frame-rate benchmark.

## Layered zoom and interactive feature update

- Standalone TypeScript check and final production build passed, including build lint/type checks.
- Production browser verification: 26 existing regression checks, 10 scroll/zoom checks, and 9 product-tour/ritual checks passed with zero runtime or console errors. Feature checks were rerun after the final zoom-reset and keyboard-focus refinements.
- Zoom coverage includes forward/reverse layered magnification, two desktop pin scenes without duplicate spacers, live reduced-motion cleanup, and unpinned mobile flow.
- Feature coverage includes 100–150% preview zoom, preview reset, task/focus/garden demo isolation, Escape focus restoration, Flip reordering with focus retention, ordered task saving, duplicate-click protection, additive rituals, and onboarding persistence.
- All routes fit 320, 390, 768, and 1280 px. Product tour and ritual builder additionally passed at 320/390 px with 150% preview magnification.
- Reviewed screenshots: .bloom-browser/zoom-journey.png, product-tour.png, product-tour-mobile.png, ritual-builder-desktop.png, and ritual-builder-mobile.png.
- Initial homepage JavaScript is 114 kB, compared with 110 kB before these features. ScrollTrigger, Flip, and the product tour are deferred chunks; no dependencies were added. This does not constitute a frame-rate benchmark.
