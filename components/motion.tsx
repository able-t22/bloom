'use client';
import {useEffect,useRef,ReactNode} from 'react';
import {useBloom} from './provider';
import {introPending} from './gsap-kit';
export const loadGsap = () => import('gsap').then(module => module.default);
export function Motion({children,className='',trigger=0}:{children:ReactNode;className?:string;trigger?:number|string}){
 const ref=useRef<HTMLDivElement>(null);const {data}=useBloom();
 useEffect(()=>{
  if(data.preferences.reducedMotion)return;
  let disposed=false;let media:ReturnType<typeof import('gsap').default.matchMedia>|undefined;
  loadGsap().then(gsap=>{
   if(disposed||!ref.current)return;
   media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
    const root=ref.current!;
    const own=(selector:string)=>Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(el=>el.closest('[data-motion-root]')===root);
    // The hero waits behind the preloader and starts when the panels begin to lift.
    const pending=root.classList.contains('hero')&&introPending();
    const enter=gsap.from(own('[data-enter]'),{y:22,opacity:0,duration:.75,stagger:.075,ease:'power3.out',clearProps:'transform,opacity',paused:pending});
    let release:(()=>void)|undefined;
    if(pending){const go=()=>{enter.play();};window.addEventListener('bloom:intro-complete',go,{once:true});release=()=>window.removeEventListener('bloom:intro-complete',go);}
    const plants=own('[data-grow]');
    if(plants.length){
     let ctx:gsap.Context|undefined;
     const observer=new IntersectionObserver(entries=>{
      if(!entries.some(e=>e.isIntersecting))return;
      ctx=gsap.context(()=>{gsap.from(plants,{scaleY:.2,opacity:0,transformOrigin:'50% 100%',duration:.85,stagger:.055,ease:'back.out(1.3)',clearProps:'transform,opacity'});},root);observer.disconnect();
     },{threshold:.2});observer.observe(root);return()=>{release?.();observer.disconnect();ctx?.revert();};
    }
    return release;
   },ref);
  }).catch(()=>{});
  return()=>{disposed=true;media?.revert();};
 },[trigger,data.preferences.reducedMotion]);
 return <div ref={ref} data-motion-root className={className}>{children}</div>;
}
export function Reveal({children}:{children:ReactNode}){
 const ref=useRef<HTMLElement>(null);const {data}=useBloom();
 useEffect(()=>{
  if(data.preferences.reducedMotion)return;
  let disposed=false;let media:ReturnType<typeof import('gsap').default.matchMedia>|undefined;
  loadGsap().then(gsap=>{
   if(disposed||!ref.current)return;
   media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
    let ctx:gsap.Context|undefined;
    const observer=new IntersectionObserver(entries=>{
     if(!entries.some(e=>e.isIntersecting))return;
     const root=ref.current!;
     const items=Array.from(root.querySelectorAll('.section-intro > *, .center-intro > *, .steps > article, .features-grid > div, .philosophy > div, .closing > *, .energy-playground > *, .faq-section > *')).filter(element=>!element.hasAttribute('data-scroll-owned')&&!element.matches('.closing-flower'));
     ctx=gsap.context(()=>{
      gsap.from(items.length?items:root,{y:28,opacity:0,duration:.8,stagger:.08,ease:'power3.out',clearProps:'transform,opacity'});
      const icons=root.querySelectorAll('.step-icon, .features-grid > div > svg');
      if(icons.length)gsap.from(icons,{scale:.5,rotation:-25,duration:.75,stagger:.12,ease:'back.out(1.8)',clearProps:'transform'});
      const accents=root.querySelectorAll('h2:not([data-scroll-owned]) em');
      if(accents.length)gsap.from(accents,{y:20,rotation:3,duration:.85,delay:.12,ease:'power3.out',clearProps:'transform'});
      
     },root);observer.disconnect();
    },{threshold:.08});observer.observe(ref.current!);return()=>{observer.disconnect();ctx?.revert();};
   },ref);
  }).catch(()=>{});
  return()=>{disposed=true;media?.revert();};
 },[data.preferences.reducedMotion]);
 return <section ref={ref}>{children}</section>;
}
