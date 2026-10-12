'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {BloomBurst} from './bloom-art';
import {useBloom} from './provider';
import {loadKit} from './gsap-kit';

const items=[
 {href:'#try-bloom',label:'Try Bloom',note:'Check in and watch your day change shape.',color:'#ded0f8'},
 {href:'#a-day-in-bloom',label:'A day in Bloom',note:'Five gentle moments, from morning to evening.',color:'#ffcbb7'},
 {href:'#how-it-works',label:'How it works',note:'Three small steps to a day that fits.',color:'#d6ebbc'},
 {href:'#promises',label:'Our promises',note:'No account, no streaks, no pressure.',color:'#f8e790'},
 {href:'#growth',label:'Seed to bloom',note:'Watch one small thing grow.',color:'#ded0f8'},
 {href:'#small-wins',label:'A sample week',note:'What small steps add up to.',color:'#ffcbb7'},
 {href:'#philosophy',label:'Our philosophy',note:'A person, not a productivity score.',color:'#d6ebbc'},
 {href:'#faq',label:'Questions',note:'A few things to help you feel at home.',color:'#f8e790'}
];

// Opens a full-screen overlay: four panels drop in, labels rise out of masks, the
// preview tile wipes open. Closing plays the same timeline backwards.
export function MenuToggle(){
 const {data}=useBloom();const reduced=data.preferences.reducedMotion;
 const [mounted,setMounted]=useState(false);const [open,setOpen]=useState(false);const [active,setActive]=useState(0);
 const overlay=useRef<HTMLDivElement>(null);const toggle=useRef<HTMLButtonElement>(null);const closeButton=useRef<HTMLButtonElement>(null);
 const timeline=useRef<{play:(from?:number)=>unknown;reverse:()=>unknown;timeScale:(value:number)=>unknown;kill:()=>void}>();
 const split=useRef<{revert:()=>void}>();const pending=useRef<string|null>(null);const building=useRef<Promise<void>>();
 useEffect(()=>setMounted(true),[]);

 const finalize=useCallback(()=>{
  const el=overlay.current;if(el)el.dataset.state='closed';
  document.documentElement.style.overflow='';
  const href=pending.current;pending.current=null;
  if(!href){toggle.current?.focus({preventScroll:true});return;}
  const target=document.querySelector<HTMLElement>(href);if(!target)return;
  // Navigate after unlocking the page. A direct jump avoids gallery snapping
  // intercepting a long animated scroll; pinned sections use their layout spacer.
  const navigate=(update=()=>{})=>requestAnimationFrame(()=>{
   const anchor=target.parentElement?.classList.contains('pin-spacer')?target.parentElement:target;
   anchor.scrollIntoView({behavior:'instant',block:'start'});
   update();
   target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
  });
  window.history.pushState(window.history.state,'',href);
  loadKit().then(({ScrollTrigger})=>{ScrollTrigger.refresh();navigate(()=>ScrollTrigger.update());}).catch(()=>navigate());
 },[]);

 const build=useCallback(()=>{
  if(building.current)return building.current;
  building.current=loadKit().then(({gsap,SplitText})=>{
   const el=overlay.current;if(!el)return;
   const panels=el.querySelectorAll('.menu-panel');const labels=el.querySelectorAll('.menu-label');
   const lines=SplitText.create(labels,{type:'lines',mask:'lines',linesClass:'menu-line'});split.current=lines;
   const tl=gsap.timeline({paused:true,onReverseComplete:finalize});
   tl.fromTo(panels,{yPercent:-101},{yPercent:0,duration:.8,stagger:.08,ease:'power4.inOut'})
     .fromTo(lines.lines,{yPercent:118,rotate:4},{yPercent:0,rotate:0,duration:.9,stagger:.05,ease:'expo.out'},'-=.4')
     .fromTo(el.querySelector('.menu-preview'),{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.9,ease:'power3.inOut'},'-=.8')
     .fromTo(closeButton.current,{scale:0,rotate:-90},{scale:1,rotate:0,duration:.6,ease:'back.out(2)'},'-=.6');
   timeline.current=tl;
  }).catch(()=>{building.current=undefined;});
  return building.current;
 },[finalize]);

 useEffect(()=>{if(!mounted||reduced)return;const id=window.setTimeout(()=>{build();},1800);return()=>window.clearTimeout(id);},[mounted,reduced,build]);
 const openMenu=useCallback(()=>{
  const el=overlay.current;if(!el)return;
  document.documentElement.style.overflow='hidden';setOpen(true);
  const show=()=>{el.dataset.state='open';closeButton.current?.focus({preventScroll:true});};
  if(reduced){show();return;}
  // Build first so the panels start off-screen instead of flashing in place.
  build().then(()=>{show();if(timeline.current){timeline.current.timeScale(1);timeline.current.play(0);}});
 },[build,reduced]);
 const closeMenu=useCallback((href?:string)=>{
  pending.current=href||null;setOpen(false);
  if(reduced||!timeline.current){finalize();return;}
  timeline.current.timeScale(1.5);timeline.current.reverse();
 },[reduced,finalize]);

 // Escape closes, Tab stays inside the menu.
 useEffect(()=>{
  if(!open)return;
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();closeMenu();return;}
   if(event.key!=='Tab'||!overlay.current)return;
   const focusable=Array.from(overlay.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));if(!focusable.length)return;
   const first=focusable[0];const last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);
 },[open,closeMenu]);

 // Preview tile follows the hovered label.
 useEffect(()=>{
  const el=overlay.current;if(!el||!open||reduced)return;
  let disposed=false;
  loadKit().then(({gsap})=>{
   if(disposed)return;
   gsap.to(el.querySelector('.menu-preview'),{backgroundColor:items[active].color,duration:.6,ease:'power2.out'});
   gsap.fromTo(el.querySelector('.menu-preview-copy'),{y:14,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'});
   gsap.to(el.querySelector('.menu-flower'),{rotation:active*45,duration:1,ease:'elastic.out(1,.6)'});
  }).catch(()=>{});
  return()=>{disposed=true;};
 },[active,open,reduced]);

 useEffect(()=>()=>{timeline.current?.kill();split.current?.revert();document.documentElement.style.overflow='';},[]);

 return <>
  <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-menu" onClick={()=>open?closeMenu():openMenu()}><span className="menu-bars" aria-hidden="true"><i/><i/></span><span className="menu-text">Menu</span></button>
  {mounted&&createPortal(<div ref={overlay} id="site-menu" className="menu-overlay" data-state="closed" role="dialog" aria-modal="true" aria-label="Site menu">
   <div className="menu-panels" aria-hidden="true"><i className="menu-panel"/><i className="menu-panel"/><i className="menu-panel"/><i className="menu-panel"/></div>
   <button ref={closeButton} type="button" className="menu-close" aria-label="Close menu" onClick={()=>closeMenu()}><X size={22}/></button>
   <div className="menu-body">
    <nav aria-label="Sections"><ol>{items.map((item,index)=><li key={item.href}><a className="menu-link" href={item.href} onPointerEnter={()=>setActive(index)} onFocus={()=>setActive(index)} onClick={event=>{event.preventDefault();closeMenu(item.href);}}><span className="menu-label">{item.label}</span></a></li>)}</ol></nav>
    <aside className="menu-preview" aria-hidden="true"><BloomBurst className="menu-flower"/><div className="menu-preview-copy"><strong>{items[active].label}</strong><p>{items[active].note}</p></div></aside>
   </div>
  </div>,document.body)}
 </>;
}
