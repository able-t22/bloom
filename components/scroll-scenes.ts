'use client';
import {RefObject,useEffect} from 'react';
import {loadGsap} from './motion';

// All scroll effects have one owner; matchMedia reverts pins and styles together.
export function useScrollScenes(ref:RefObject<HTMLDivElement>,reducedMotion:boolean){
 useEffect(()=>{
  if(reducedMotion)return;
  let disposed=false;let media:ReturnType<typeof import('gsap').default.matchMedia>|undefined;
  const setup=async()=>{
   const [gsap,{ScrollTrigger}]=await Promise.all([loadGsap(),import('gsap/ScrollTrigger')]);
   if(disposed||!ref.current)return;
   gsap.registerPlugin(ScrollTrigger);media=gsap.matchMedia();
   media.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width: 1024px) and (min-height: 650px)'},context=>{
    if(!context.conditions?.motion)return;
    const root=ref.current!;const desktop=Boolean(context.conditions.desktop);
    const hero=root.querySelector('.hero');const preview=root.querySelector('.product-preview');
    if(hero){
     gsap.to(root.querySelector('.hero-decoration'),{yPercent:18,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
     gsap.to(root.querySelector('.hero-orbit'),{rotation:35,scale:1.08,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
    }
    const zoom=root.querySelector<HTMLElement>('.zoom-journey');
    if(zoom){
     const disc=zoom.querySelector('.zoom-disc');const card=zoom.querySelector('.zoom-focus-card');const notes=zoom.querySelectorAll('.zoom-note');
     if(desktop){
      zoom.classList.add('zoom-pinned');
      const zoomTimeline=gsap.timeline({scrollTrigger:{id:'bloom-zoom',trigger:zoom,pin:true,start:'top top',end:()=>'+='+Math.round(window.innerHeight*1.15),scrub:.65,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{zoom.dataset.zoomPhase=self.progress>.6?'focus':'overview';}}});
      zoomTimeline.fromTo(disc,{scale:.24,rotation:-20},{scale:1.12,rotation:16,duration:1.8,ease:'power2.inOut'},0)
       .fromTo(card,{scale:.64,rotation:-5,y:45},{scale:1.07,rotation:0,y:0,duration:1.8,ease:'power2.inOut'},0)
       .to(notes,{x:index=>index%2?170:-170,y:index=>index===2?70:-25,opacity:0,stagger:.08,duration:.85,ease:'power2.in'},.25)
       .fromTo(zoom.querySelector('.zoom-card-flower'),{rotation:-30,scale:.6},{rotation:18,scale:1,duration:1.5,ease:'power2.out'},.3)
       .to({},{duration:.25});
     }else{
      gsap.fromTo(card,{scale:.88,y:24},{scale:1,y:0,ease:'none',scrollTrigger:{trigger:zoom,start:'top 90%',end:'center 65%',scrub:.45}});
     }
    }
    if(preview)gsap.fromTo(preview,{transformPerspective:1200,rotationX:desktop?9:0,y:desktop?70:25,scale:desktop?.94:.98,transformOrigin:'50% 100%'},{rotationX:0,y:0,scale:1,ease:'none',scrollTrigger:{trigger:preview,start:'clamp(top 95%)',end:'top 28%',scrub:.65,invalidateOnRefresh:true}});
    const story=root.querySelector<HTMLElement>('.how-section');
    if(desktop&&story){
     story.classList.add('scroll-story');story.dataset.currentStep='1';
     const cards=story.querySelectorAll('.steps article');const meter=story.querySelector('.story-meter > span');
     gsap.set(cards,{rotation:0});gsap.set(Array.from(cards).slice(1),{xPercent:110,rotation:8,opacity:0,scale:.94});
     const timeline=gsap.timeline({scrollTrigger:{id:'bloom-story',trigger:story,pin:true,start:'top top',end:()=>'+='+Math.round(window.innerHeight*1.65),scrub:.55,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{story.dataset.currentStep=String(self.progress<.32?1:self.progress<.72?2:3);}}});
     timeline.to({},{duration:.3});
     for(let index=1;index<cards.length;index++){
      const at=.3+(index-1)*1.1;
      timeline.to(cards[index-1],{xPercent:-15,rotation:-7,scale:.9,opacity:0,duration:.65,ease:'power2.inOut'},at).to(cards[index],{xPercent:0,rotation:0,scale:1,opacity:1,duration:.8,ease:'power3.out'},at+.12);
     }
     timeline.to({},{duration:.4});
     timeline.fromTo(meter,{scaleX:0},{scaleX:1,duration:timeline.duration(),ease:'none'},0);
     // Class cleanup runs after GSAP restores the elements and pin spacer.
    }else if(story){
     story.querySelectorAll('article').forEach((card,index)=>gsap.from(card,{y:35,rotation:index%2?3:-3,duration:.8,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:card,start:'top 90%',once:true}}));
    }
    const art=root.querySelector('.philosophy-art');const path=root.querySelector<SVGPathElement>('.growth-trail path');
    if(art)gsap.fromTo(art,{rotation:-7,scale:.86},{rotation:0,scale:1,ease:'none',scrollTrigger:{trigger:art,start:'top 92%',end:'center 55%',scrub:.7}});
    if(path){const length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:art,start:'top 85%',end:'bottom 65%',scrub:.4}});gsap.fromTo(root.querySelector('.growth-trail-dot'),{scale:0,transformOrigin:'center'},{scale:1,ease:'back.out(2)',scrollTrigger:{trigger:art,start:'center 65%',end:'bottom 65%',scrub:.4}});}
    const flower=root.querySelector('.closing-flower');
    if(flower)gsap.to(flower,{rotation:110,ease:'none',scrollTrigger:{trigger:root.querySelector('.closing'),start:'top bottom',end:'bottom top',scrub:.8}});
    const cleanups:(()=>void)[]=[];
    if(desktop&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
     root.querySelectorAll<HTMLElement>('.button').forEach(button=>{
      const xTo=gsap.quickTo(button,'x',{duration:.45,ease:'power3.out'});const yTo=gsap.quickTo(button,'y',{duration:.45,ease:'power3.out'});let bounds:DOMRect;let frame=0;let x=0;let y=0;
      const enter=()=>{bounds=button.getBoundingClientRect();};
      const move=(event:PointerEvent)=>{if(!bounds)return;x=(event.clientX-bounds.left-bounds.width/2)*.16;y=(event.clientY-bounds.top-bounds.height/2)*.2;if(!frame)frame=requestAnimationFrame(()=>{frame=0;xTo(x);yTo(y);});};
      const reset=()=>{cancelAnimationFrame(frame);frame=0;xTo(0);yTo(0);};
      button.classList.add('magnetic-button');button.addEventListener('pointerenter',enter);button.addEventListener('pointermove',move,{passive:true});button.addEventListener('pointerleave',reset);button.addEventListener('blur',reset);
      cleanups.push(()=>{cancelAnimationFrame(frame);button.classList.remove('magnetic-button');button.removeEventListener('pointerenter',enter);button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',reset);button.removeEventListener('blur',reset);});
     });
    }
    root.dataset.scrollScenes='ready';
    const refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());
    let resizeFrame=0;const resizeObserver=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());});
    root.querySelectorAll('.ritual-builder, .energy-playground').forEach(element=>resizeObserver.observe(element));
    return()=>{cancelAnimationFrame(refreshFrame);cancelAnimationFrame(resizeFrame);resizeObserver.disconnect();cleanups.forEach(cleanup=>cleanup());zoom?.classList.remove('zoom-pinned');if(zoom)delete zoom.dataset.zoomPhase;story?.classList.remove('scroll-story');if(story)delete story.dataset.currentStep;delete root.dataset.scrollScenes;};
   },ref);
  };
  setup().catch(()=>{});
  return()=>{disposed=true;media?.revert();};
 },[ref,reducedMotion]);
}
