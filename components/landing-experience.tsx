'use client';
import {ReactNode,useEffect,useRef} from 'react';
import {ArrowUp,Pause,Play} from 'lucide-react';
import {useBloom} from './provider';
import {loadGsap} from './motion';
import {useScrollScenes} from './scroll-scenes';
export function LandingExperience({children}:{children:ReactNode}){
 const ref=useRef<HTMLDivElement>(null);const bar=useRef<HTMLDivElement>(null);const {data,setData}=useBloom();useScrollScenes(ref,data.preferences.reducedMotion);
 useEffect(()=>{
  if(data.preferences.reducedMotion)return;
  let disposed=false;let media:ReturnType<typeof import('gsap').default.matchMedia>|undefined;
  loadGsap().then(gsap=>{
   if(disposed||!ref.current)return;
   media=gsap.matchMedia();
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    const setProgress=gsap.quickSetter(bar.current,'scaleX');let frame=0;
    const update=()=>{frame=0;const distance=document.documentElement.scrollHeight-window.innerHeight;setProgress(distance>0?Math.min(1,Math.max(0,window.scrollY/distance)):0);};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
    return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
   });
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    const root=ref.current!;const animations=new Map<Element,gsap.core.Animation>();const visible=new Set<Element>();
    const hero=root.querySelector('.hero');
    if(hero){const floating=gsap.timeline({repeat:-1,yoyo:true,paused:true}).to(root.querySelectorAll('.color-orb'),{y:index=>index%2?-26:30,x:index=>index%2?18:-16,rotation:12,duration:7,stagger:.4,ease:'sine.inOut'},0).to(root.querySelector('.hero-flower'),{rotation:35,y:-12,duration:7,ease:'sine.inOut'},0);animations.set(hero,floating);}
    const sync=()=>animations.forEach((animation,element)=>{if(visible.has(element)&&!document.hidden)animation.play();else animation.pause();});
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);});sync();});
    animations.forEach((_,element)=>observer.observe(element));document.addEventListener('visibilitychange',sync);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);animations.forEach(animation=>animation.kill());};
   },ref);
   media.add('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
    const cleanup:(()=>void)[]=[];
    ref.current!.querySelectorAll<HTMLElement>('.hero-visual, .features-grid > div').forEach(card=>{
     const tilt=card.matches('.hero-visual');
     const toX=gsap.quickTo(card,'rotationY',{duration:.55,ease:'power3.out'});
     const toY=gsap.quickTo(card,tilt?'rotationX':'y',{duration:.55,ease:'power3.out'});
     let rect:DOMRect;let frame=0;let x=0;let y=0;
     const enter=()=>{rect=card.getBoundingClientRect();if(!tilt)toY(-5);};
     const move=(event:PointerEvent)=>{if(!tilt||!rect)return;x=event.clientX;y=event.clientY;if(!frame)frame=requestAnimationFrame(()=>{frame=0;toX(((x-rect.left)/rect.width-.5)*5);toY(((y-rect.top)/rect.height-.5)*-5);});};
     const leave=()=>{cancelAnimationFrame(frame);frame=0;toX(0);toY(0);};
     card.addEventListener('pointerenter',enter);card.addEventListener('pointermove',move,{passive:true});card.addEventListener('pointerleave',leave);card.addEventListener('focusout',leave);
     cleanup.push(()=>{cancelAnimationFrame(frame);card.removeEventListener('pointerenter',enter);card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);card.removeEventListener('focusout',leave);});
    });
    ref.current!.querySelectorAll<HTMLElement>('.button, .text-link').forEach(button=>{
     const icon=button.querySelector('svg');if(!icon)return;
     const toX=gsap.quickTo(icon,'x',{duration:.3,ease:'power2.out'});
     const enter=()=>toX(3);const leave=()=>toX(0);
     button.addEventListener('pointerenter',enter);button.addEventListener('pointerleave',leave);button.addEventListener('focus',enter);button.addEventListener('blur',leave);
     cleanup.push(()=>{button.removeEventListener('pointerenter',enter);button.removeEventListener('pointerleave',leave);button.removeEventListener('focus',enter);button.removeEventListener('blur',leave);});
    });return()=>cleanup.forEach(fn=>fn());
   },ref);
  }).catch(()=>{});
  return()=>{disposed=true;media?.revert();};
 },[data.preferences.reducedMotion]);
 return <div ref={ref} className="landing" id="top"><div ref={bar} className="reading-progress" aria-hidden="true"/>{children}<div className="experience-controls"><button aria-pressed={data.preferences.reducedMotion} onClick={()=>setData(d=>({...d,preferences:{...d.preferences,reducedMotion:!d.preferences.reducedMotion}}))}>{data.preferences.reducedMotion?<Play size={14}/>:<Pause size={14}/>}<span>{data.preferences.reducedMotion?'Motion off':'Reduce motion'}</span></button><a href="#top" aria-label="Back to top"><ArrowUp size={16}/></a></div></div>;
}
