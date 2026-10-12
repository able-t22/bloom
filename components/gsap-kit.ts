'use client';
// One lazy loader for every GSAP plugin the landing page uses.
// GSAP 3.13+ ships all plugins free in the main package.
export type Kit = {
 gsap: typeof import('gsap').default;
 ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
 SplitText: typeof import('gsap/SplitText').SplitText;
 DrawSVGPlugin: typeof import('gsap/DrawSVGPlugin').DrawSVGPlugin;
 MorphSVGPlugin: typeof import('gsap/MorphSVGPlugin').MorphSVGPlugin;
 MotionPathPlugin: typeof import('gsap/MotionPathPlugin').MotionPathPlugin;
 Draggable: typeof import('gsap/Draggable').Draggable;
 InertiaPlugin: typeof import('gsap/InertiaPlugin').InertiaPlugin;
 Observer: typeof import('gsap/Observer').Observer;
 ScrollToPlugin: typeof import('gsap/ScrollToPlugin').ScrollToPlugin;
};
let cached: Promise<Kit> | undefined;
export function loadKit(): Promise<Kit> {
 if (!cached) {
  cached = Promise.all([
   import('gsap'),
   import('gsap/ScrollTrigger'),
   import('gsap/SplitText'),
   import('gsap/DrawSVGPlugin'),
   import('gsap/MorphSVGPlugin'),
   import('gsap/MotionPathPlugin'),
   import('gsap/Draggable'),
   import('gsap/InertiaPlugin'),
   import('gsap/Observer'),
   import('gsap/ScrollToPlugin')
  ]).then(([g, st, split, draw, morph, path, drag, inertia, observer, scrollTo]) => {
   const gsap = g.default;
   gsap.registerPlugin(st.ScrollTrigger, split.SplitText, draw.DrawSVGPlugin, morph.MorphSVGPlugin, path.MotionPathPlugin, drag.Draggable, inertia.InertiaPlugin, observer.Observer, scrollTo.ScrollToPlugin);
   return {
    gsap,
    ScrollTrigger: st.ScrollTrigger,
    SplitText: split.SplitText,
    DrawSVGPlugin: draw.DrawSVGPlugin,
    MorphSVGPlugin: morph.MorphSVGPlugin,
    MotionPathPlugin: path.MotionPathPlugin,
    Draggable: drag.Draggable,
    InertiaPlugin: inertia.InertiaPlugin,
    Observer: observer.Observer,
    ScrollToPlugin: scrollTo.ScrollToPlugin
   };
  });
  cached.catch(() => { cached = undefined; });
 }
 return cached;
}

// Is the preloader still covering the page? Hero choreography waits for it.
export function introPending() {
 if (typeof document === 'undefined') return false;
 const state = document.documentElement.dataset.intro;
 if (state === 'skip' || state === 'done') return false;
 return state === 'running' || Boolean(document.querySelector('.preloader'));
}
