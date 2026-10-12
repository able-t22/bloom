'use client';
import {useEffect,useRef} from 'react';
import {useBloom} from './provider';
import {loadGsap} from './motion';

// A soft ring that trails the pointer. It grows over links and buttons and shows a
// label over anything marked data-cursor. The real cursor stays visible.
export function CustomCursor(){
 const root=useRef<HTMLDivElement>(null);const {data}=useBloom();
 useEffect(()=>{
  if(data.preferences.reducedMotion)return;
  if(!window.matchMedia('(hover: hover) and (pointer: fine)').matches||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let disposed=false;let cleanup=()=>{};
  loadGsap().then(gsap=>{
   const el=root.current;if(disposed||!el)return;
   const ring=el.querySelector<HTMLElement>('.cursor-ring')!;const dot=el.querySelector<HTMLElement>('.cursor-dot')!;const label=el.querySelector<HTMLElement>('.cursor-label')!;
   const ringX=gsap.quickTo(ring,'x',{duration:.5,ease:'power3.out'});const ringY=gsap.quickTo(ring,'y',{duration:.5,ease:'power3.out'});
   const dotX=gsap.quickTo(dot,'x',{duration:.12,ease:'power2.out'});const dotY=gsap.quickTo(dot,'y',{duration:.12,ease:'power2.out'});
   let first=true;
   const move=(event:PointerEvent)=>{
    if(event.pointerType!=='mouse')return;
    if(first){first=false;gsap.set([ring,dot],{x:event.clientX,y:event.clientY});}
    el.classList.add('on');ringX(event.clientX);ringY(event.clientY);dotX(event.clientX);dotY(event.clientY);
   };
   const over=(event:PointerEvent)=>{
    const target=event.target instanceof Element?event.target:null;
    const labelled=target?.closest<HTMLElement>('[data-cursor]');
    if(labelled){label.textContent=labelled.dataset.cursor||'';el.dataset.state='label';return;}
    el.dataset.state=target?.closest('a[href],button,summary,[role="button"],input,select,textarea')?'link':'idle';
   };
   const leave=()=>el.classList.remove('on');
   const press=()=>{el.classList.add('down');};const release=()=>{el.classList.remove('down');};
   window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerover',over,{passive:true});document.documentElement.addEventListener('pointerleave',leave);
   window.addEventListener('pointerdown',press);window.addEventListener('pointerup',release);
   cleanup=()=>{window.removeEventListener('pointermove',move);document.removeEventListener('pointerover',over);document.documentElement.removeEventListener('pointerleave',leave);window.removeEventListener('pointerdown',press);window.removeEventListener('pointerup',release);el.classList.remove('on','down');};
  }).catch(()=>{});
  return()=>{disposed=true;cleanup();};
 },[data.preferences.reducedMotion]);
 return <div ref={root} className="cursor" data-state="idle" aria-hidden="true"><span className="cursor-ring"><span className="cursor-label"/></span><span className="cursor-dot"/></div>;
}
