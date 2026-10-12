'use client';
import {useEffect,useRef,useState} from 'react';
import {useBloom} from './provider';
import {loadKit} from './gsap-kit';

// A once-per-visit intro: the leaf draws itself, the wordmark rises, a counter
// follows real page loading, then four coloured panels sweep away.
// The inline script in app/layout.tsx marks returning visits with data-intro="skip" before first paint.
export function Preloader(){
 const root=useRef<HTMLDivElement>(null);const {data,ready}=useBloom();const [gone,setGone]=useState(false);const started=useRef(false);
 useEffect(()=>{
  if(!ready||started.current)return;
  started.current=true;
  const html=document.documentElement;
  const release=()=>{html.style.overflow='';};
  const finish=(state:'done'|'skip')=>{html.dataset.intro=state;release();window.dispatchEvent(new Event('bloom:intro-complete'));try{sessionStorage.setItem('bloom-intro','1');}catch{}};
  if(html.dataset.intro==='skip'||html.dataset.intro==='done'||data.preferences.reducedMotion||window.scrollY>80){finish('skip');setGone(true);return;}
  html.dataset.intro='running';html.style.overflow='hidden';
  let disposed=false;let timeline:{kill:()=>void}|undefined;let exitTimer=0;let split:{revert:()=>void}|undefined;
  const abort=()=>{finish('done');setGone(true);};
  loadKit().then(({gsap,SplitText,DrawSVGPlugin})=>{
   const el=root.current;
   if(disposed)return;
   if(!el||!DrawSVGPlugin){abort();return;}
   const word=el.querySelector<HTMLElement>('.preloader-word')!;const leaf=el.querySelector<HTMLElement>('.preloader-leaf')!;
   const paths=el.querySelectorAll('.preloader-leaf path');const panels=el.querySelectorAll('.preloader-panels i');
   const core=el.querySelector('.preloader-core')!;const counter=el.querySelector<HTMLElement>('.preloader-count')!;
   const meter=el.querySelector('.preloader-line i')!;const note=el.querySelector('.preloader-note')!;
   const progress={v:0};const write=()=>{counter.textContent=String(Math.round(progress.v));gsap.set(meter,{scaleX:progress.v/100});};
   const lettering=SplitText.create(word,{type:'chars',charsClass:'preloader-char'});split=lettering;
   const chars=lettering.chars;
   gsap.set([word,leaf,note],{opacity:1});gsap.set(chars,{yPercent:115,opacity:0});gsap.set(paths,{drawSVG:'0%'});gsap.set(meter,{scaleX:0,transformOrigin:'0% 50%'});
   const intro=gsap.timeline();timeline=intro;
   intro.to(paths,{drawSVG:'100%',duration:1.1,stagger:.18,ease:'power2.inOut'},0)
    .to(chars,{yPercent:0,opacity:1,duration:.9,stagger:.07,ease:'expo.out'},.35)
    .fromTo(note,{y:10,opacity:0},{y:0,opacity:.8,duration:.7},.8)
    .to(progress,{v:88,duration:1.5,ease:'power1.out',onUpdate:write},0);
   const loaded=new Promise<void>(resolve=>{if(document.readyState==='complete')resolve();else window.addEventListener('load',()=>resolve(),{once:true});});
   const minimum=new Promise<void>(resolve=>{exitTimer=window.setTimeout(resolve,1700);});
   const leave=()=>{
    if(disposed)return;
    const exit=gsap.timeline({onComplete:()=>{release();setGone(true);}});timeline=exit;
    exit.to(progress,{v:100,duration:.4,ease:'power2.out',onUpdate:write})
     .to(core,{scale:.94,opacity:0,duration:.5,ease:'power2.in'},'>-.05')
     .to(panels,{yPercent:-101,duration:1,stagger:.09,ease:'power4.inOut'},'>-.2')
     .call(()=>{finish('done');},[],'-=.55');
   };
   Promise.race([Promise.all([loaded,minimum]),new Promise<void>(resolve=>window.setTimeout(resolve,5000))]).then(leave);
  }).catch(abort);
  return()=>{disposed=true;window.clearTimeout(exitTimer);timeline?.kill();split?.revert();if(html.dataset.intro==='running')finish('done');};
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[ready]);
 if(gone)return null;
 return <div ref={root} className="preloader" aria-hidden="true">
  <div className="preloader-panels"><i/><i/><i/><i/></div>
  <div className="preloader-core">
   <svg className="preloader-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
   <span className="preloader-word">bloom.</span>
   <span className="preloader-note">making a little room</span>
  </div>
  <div className="preloader-meter"><span className="preloader-count">0</span><div className="preloader-line"><i/></div></div>
 </div>;
}
