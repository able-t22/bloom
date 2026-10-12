'use client';
import {RefObject,useEffect} from 'react';
import {loadKit,introPending} from './gsap-kit';
import {GROWTH_PATHS,GROWTH_COLORS,GROWTH_SKIES,GROWTH_SCALE} from './growth-shapes';

// Every scene below is created inside one matchMedia scope, so a resize across
// a breakpoint or switching on "Reduce motion" reverts all of it together.
export function useCinematicScenes(ref:RefObject<HTMLDivElement>,reducedMotion:boolean){
 useEffect(()=>{
  if(reducedMotion)return;
  let disposed=false;let media:ReturnType<typeof import('gsap').default.matchMedia>|undefined;
  loadKit().then(kit=>{
   if(disposed||!ref.current)return;
   const {gsap,ScrollTrigger,SplitText,Observer}=kit;
   media=gsap.matchMedia();
   media.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width: 1024px) and (min-height: 650px)',fine:'(hover: hover) and (pointer: fine)'},context=>{
    if(!context.conditions?.motion)return;
    const root=ref.current!;const desktop=Boolean(context.conditions.desktop);const fine=Boolean(context.conditions.fine);
    const cleanups:(()=>void)[]=[];const splits:{revert:()=>void}[]=[];
    const q=<T extends Element>(selector:string)=>root.querySelector<T>(selector);
    const all=<T extends Element>(selector:string)=>Array.from(root.querySelectorAll<T>(selector));
    const clamp=gsap.utils.clamp;

    /* 1 + 2. Hero headline: masked lines, letter-by-letter rise with blur and tilt. */
    const title=q<HTMLElement>('[data-hero-title]');
    if(title&&title.dataset.played==='true')title.dataset.split='true';
    else if(title){
     const split=SplitText.create(title,{type:'lines,words,chars',mask:'lines',linesClass:'kinetic-line',wordsClass:'kinetic-word',charsClass:'kinetic-char'});
     splits.push(split);
     gsap.set(split.chars,{yPercent:118,rotate:9,opacity:0,filter:'blur(10px)',transformOrigin:'0% 100%'});
     title.dataset.split='true';
     const reveal=gsap.timeline({paused:true,onComplete:()=>{split.revert();title.dataset.played='true';}}).to(split.chars,{yPercent:0,rotate:0,opacity:1,filter:'blur(0px)',duration:1.1,stagger:{each:.03},ease:'expo.out'});
     let started=false;const start=()=>{if(started)return;started=true;reveal.play();};
     if(introPending()){
      window.addEventListener('bloom:intro-complete',start,{once:true});
      const failsafe=window.setTimeout(start,8000);
      cleanups.push(()=>{window.removeEventListener('bloom:intro-complete',start);window.clearTimeout(failsafe);});
     }else gsap.delayedCall(.1,start);
    }

    /* 13. Kinetic headings: words rise out of line masks as they enter. */
    all<HTMLElement>('[data-kinetic]').forEach(heading=>{
     if(heading.dataset.revealed==='true')return;
     const split=SplitText.create(heading,{type:'lines,words',mask:'lines',linesClass:'kinetic-line',wordsClass:'kinetic-word'});
     splits.push(split);
     gsap.set(split.words,{yPercent:120,rotate:5,transformOrigin:'0% 100%'});
     ScrollTrigger.create({trigger:heading,start:'top 88%',once:true,onEnter:()=>{gsap.to(split.words,{yPercent:0,rotate:0,duration:1.05,stagger:.07,ease:'expo.out',onComplete:()=>{split.revert();heading.dataset.revealed='true';}});}});
    });

    /* 3. Layered hero depth: layers drift at different speeds on scroll and react to the pointer. */
    const hero=q<HTMLElement>('.hero');
    if(hero){
     all<HTMLElement>('[data-depth]').forEach(layer=>{
      const depth=Number(layer.dataset.depth)||0.5;
      gsap.to(layer,{yPercent:-depth*34,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.6}});
     });
     if(fine){
      const near=all<HTMLElement>('.floating-intention, .handwritten, .garden-sticker, .garden-label');
      const movers=near.map(layer=>({x:gsap.quickTo(layer,'x',{duration:.9,ease:'power3.out'}),y:gsap.quickTo(layer,'y',{duration:.9,ease:'power3.out'}),k:layer.matches('.handwritten, .garden-sticker')?26:14}));
      let frame=0;let px=0;let py=0;
      const move=(event:PointerEvent)=>{const rect=hero.getBoundingClientRect();px=(event.clientX-rect.left)/rect.width-.5;py=(event.clientY-rect.top)/rect.height-.5;if(!frame)frame=requestAnimationFrame(()=>{frame=0;movers.forEach(m=>{m.x(px*m.k);m.y(py*m.k);});});};
      const leave=()=>{cancelAnimationFrame(frame);frame=0;movers.forEach(m=>{m.x(0);m.y(0);});};
      hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',leave);
      cleanups.push(()=>{cancelAnimationFrame(frame);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);});
     }
    }

    /* 6 + 21 + 22 + 16 + 28. Horizontal gallery: scroll drives sideways travel, snaps to panels,
       shifts the background colour, opens each picture with a circular mask, and can be dragged. */
    const gallery=q<HTMLElement>('.day-gallery');
    if(gallery){
     const sticky=gallery.querySelector<HTMLElement>('.day-gallery-sticky')!;const track=gallery.querySelector<HTMLElement>('.day-track')!;
     const panels=Array.from(gallery.querySelectorAll<HTMLElement>('.day-panel'));
     const label=gallery.querySelector<HTMLElement>('[data-gallery-label]');const progressBar=gallery.querySelector<HTMLElement>('.day-progress-bar > span');
     const times=panels.map(panel=>panel.querySelector('.day-time')?.textContent||'');
     const tones=['#ece4fa','#fde0d3','#e2efcb','#fbf0c0','#ecd9f7'];
     if(desktop){
      gallery.dataset.galleryActive='true';
      const distance=()=>Math.max(0,track.scrollWidth-sticky.clientWidth);
      const size=()=>{gallery.style.height=distance()+sticky.clientHeight+'px';};
      size();ScrollTrigger.addEventListener('refreshInit',size);
      cleanups.push(()=>{ScrollTrigger.removeEventListener('refreshInit',size);gallery.style.height='';delete gallery.dataset.galleryActive;});
      let current=-1;
      const move=gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{id:'bloom-day',trigger:gallery,start:'top top',end:'bottom bottom',scrub:.6,invalidateOnRefresh:true,
       snap:{snapTo:1/(panels.length-1),directional:true,inertia:false,duration:{min:.25,max:.7},delay:.08,ease:'power2.inOut'},
       onUpdate:self=>{
        if(progressBar)gsap.set(progressBar,{scaleX:self.progress});
        const index=Math.round(self.progress*(panels.length-1));
        if(index!==current){current=index;if(label)label.textContent=times[index];gallery.dataset.current=String(index);}
       }}});
      gsap.set(sticky,{backgroundColor:tones[0]});
      const wash=gsap.timeline({scrollTrigger:{trigger:gallery,start:'top top',end:'bottom bottom',scrub:true}});
      tones.slice(1).forEach(color=>wash.to(sticky,{backgroundColor:color,duration:1,ease:'none'}));
      panels.forEach((panel,index)=>{
       const visual=panel.querySelector<HTMLElement>('.day-visual');const copy=panel.querySelectorAll('.day-copy > *');const inner=panel.querySelector<HTMLElement>('[data-parallax]');
       if(index>0&&visual)gsap.fromTo(visual,{clipPath:'circle(0% at 50% 55%)'},{clipPath:'circle(78% at 50% 55%)',ease:'none',scrollTrigger:{trigger:panel,containerAnimation:move,start:'left 96%',end:'left 38%',scrub:true}});
       if(index>0)gsap.from(copy,{y:46,opacity:0,stagger:.08,ease:'none',scrollTrigger:{trigger:panel,containerAnimation:move,start:'left 80%',end:'left 40%',scrub:true}});
       if(inner)gsap.fromTo(inner,{xPercent:18},{xPercent:-18,ease:'none',scrollTrigger:{trigger:panel,containerAnimation:move,start:'left right',end:'right left',scrub:true}});
      });
      const ring=gallery.querySelector<SVGCircleElement>('[data-draw-ring]');
      if(ring)gsap.fromTo(ring,{drawSVG:'0%'},{drawSVG:'100%',ease:'none',scrollTrigger:{trigger:ring.closest('.day-panel'),containerAnimation:move,start:'left 70%',end:'left 15%',scrub:true}});
      if(fine){
       const st=move.scrollTrigger!;
       const observer=Observer.create({target:sticky,type:'pointer',lockAxis:true,dragMinimum:6,onDrag:self=>{const ratio=(st.end-st.start)/Math.max(1,distance());window.scrollBy({top:-self.deltaX*ratio,behavior:'instant'});}});
       cleanups.push(()=>observer.kill());
      }
     }else{
      panels.forEach(panel=>{
       const visual=panel.querySelector('.day-visual');
       if(visual)gsap.fromTo(visual,{clipPath:'circle(0% at 50% 55%)'},{clipPath:'circle(78% at 50% 55%)',ease:'none',scrollTrigger:{trigger:panel,start:'top 88%',end:'top 38%',scrub:true}});
      });
     }
    }

    /* 8 + 16. Stacked promise cards: each card scales back as the next one slides over it. */
    const cards=all<HTMLElement>('.promise-card');
    cards.forEach((card,index)=>{
     const next=cards[index+1];const art=card.querySelector('.promise-art');
     if(art)gsap.fromTo(art,{clipPath:'polygon(0 0,0 0,0 100%,0 100%)'},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',ease:'none',scrollTrigger:{trigger:card,start:'top 88%',end:'top 40%',scrub:true}});
     if(next)gsap.to(card,{scale:.92,filter:'brightness(.96)',transformOrigin:'50% 0%',ease:'none',scrollTrigger:{trigger:next,start:'top 82%',end:'top 22%',scrub:true}});
    });

    /* 13 + 26. Statement: words light up as you read, and scroll speed skews them with an elastic settle. */
    const statement=q<HTMLElement>('[data-statement]');
    if(statement){
     const split=SplitText.create(statement,{type:'words',wordsClass:'kinetic-word'});splits.push(split);
     gsap.set(split.words,{opacity:.14});
     gsap.to(split.words,{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:statement,start:'top 78%',end:'bottom 48%',scrub:.5}});
     ScrollTrigger.create({trigger:statement,start:'top bottom',end:'bottom top',onUpdate:self=>{
      const skew=clamp(-7,7,self.getVelocity()/-260);
      gsap.to(statement,{skewX:skew,duration:.25,overwrite:true,onComplete:()=>{gsap.to(statement,{skewX:0,duration:1.1,ease:'elastic.out(1,.35)'});}});
     }});
    }

    /* 15 + 20 + 22 + 27 + 14. Seed to bloom: morphing shape, orbiting sparks on a motion path,
       drawn orbit line, colour-shifting sky and stage captions. */
    const growth=q<HTMLElement>('.growth');
    if(growth){
     const plant=growth.querySelector<SVGGElement>('[data-plant]')!;const shape=growth.querySelector<SVGPathElement>('[data-morph]')!;const core=growth.querySelector<SVGCircleElement>('[data-core]')!;
     const orbit=growth.querySelector<SVGPathElement>('[data-orbit]')!;const sparks=Array.from(growth.querySelectorAll<SVGCircleElement>('[data-spark]'));
     const captions=Array.from(growth.querySelectorAll<HTMLElement>('.growth-caption'));
     const count=growth.querySelector<HTMLElement>('[data-growth-count]');const meter=growth.querySelector<HTMLElement>('.growth-meter-bar > span');
     const duration=7;
     if(desktop){growth.dataset.growthActive='true';}
     const bloomPath=shape.getAttribute('d')||GROWTH_PATHS.bloom;
     gsap.set(shape,{morphSVG:GROWTH_PATHS.seed,fill:GROWTH_COLORS.seed});
     gsap.set(plant,{scale:GROWTH_SCALE[0],svgOrigin:'200 215'});
     gsap.set(core,{scale:0,svgOrigin:'200 215'});
     gsap.set(growth,{backgroundColor:GROWTH_SKIES[0]});
     gsap.set(sparks,{opacity:0});
     const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:growth,start:desktop?'top top':'top 70%',end:desktop?'bottom bottom':'bottom 40%',scrub:.7,
      onUpdate:self=>{
       const time=self.progress*duration;const stage=Math.min(3,Math.floor((time+.5)/2));
       if(count)count.textContent=String(stage+1);
       if(meter)gsap.set(meter,{scaleX:self.progress});
      }}});
     const steps:[keyof typeof GROWTH_PATHS,number][]=[['sprout',1],['bud',3],['bloom',5]];
     steps.forEach(([name,at],index)=>{
      tl.to(shape,{morphSVG:{shape:GROWTH_PATHS[name],shapeIndex:'auto'},fill:GROWTH_COLORS[name],duration:1.2,ease:'power2.inOut'},at)
        .to(plant,{scale:GROWTH_SCALE[index+1],duration:1.2,ease:'power2.inOut'},at)
        .to(growth,{backgroundColor:GROWTH_SKIES[index+1],duration:1.2},at);
     });
     tl.to(plant,{rotation:22.5,duration:1.2,ease:'back.out(1.4)'},5).to(core,{scale:1,duration:1,ease:'elastic.out(1,.5)'},5.6);
     tl.fromTo(orbit,{drawSVG:'0%'},{drawSVG:'100%',duration},0);
     tl.to(sparks,{opacity:1,duration:.6,stagger:.15},3);
     sparks.forEach((spark,index)=>tl.to(spark,{motionPath:{path:orbit,start:index/3,end:index/3+1.5},ease:'none',duration},0));
     if(desktop){
      gsap.set(captions,{autoAlpha:0,y:26});gsap.set(captions[0],{autoAlpha:1,y:0});
      [1,3,5].forEach((at,index)=>{
       tl.to(captions[index],{autoAlpha:0,y:-26,duration:.5,ease:'power2.in'},at-.1).to(captions[index+1],{autoAlpha:1,y:0,duration:.6,ease:'power3.out'},at+.4);
      });
      tl.to({},{duration:.001},duration);
     }
     cleanups.push(()=>{delete growth.dataset.growthActive;queueMicrotask(()=>shape.setAttribute('d',bloomPath));});
    }

    /* 24 + 14 + 26. Sample week: numbers count up, the line draws itself, dots pop, bars fill. */
    all<HTMLElement>('[data-count]').forEach(element=>{
     const end=Number(element.dataset.count);const minutes=element.dataset.format==='minutes';const value={v:0};
     const write=()=>{element.textContent=minutes?Math.floor(value.v/60)+'h '+String(Math.round(value.v%60)).padStart(2,'0')+'m':String(Math.round(value.v));};
     write();gsap.to(value,{v:end,duration:1.8,ease:'power2.out',onUpdate:write,scrollTrigger:{trigger:element,start:'top 90%',once:true}});
    });
    const chart=q<HTMLElement>('.win-chart');
    if(chart){
     const line=chart.querySelector<SVGPathElement>('[data-chart-line]');const area=chart.querySelector('[data-chart-area]');
     const dots=Array.from(chart.querySelectorAll('[data-chart-dot]'));const days=Array.from(chart.querySelectorAll('[data-chart-day]'));
     gsap.set(dots,{scale:0});gsap.set(days,{opacity:0});gsap.set(area,{opacity:0});
     if(line)gsap.fromTo(line,{drawSVG:'0%'},{drawSVG:'100%',ease:'none',scrollTrigger:{trigger:chart,start:'top 82%',end:'center 48%',scrub:.5}});
     ScrollTrigger.create({trigger:chart,start:'top 70%',once:true,onEnter:()=>{
      gsap.to(area,{opacity:1,duration:1.2,delay:.4});gsap.to(days,{opacity:1,duration:.6,stagger:.06});
      gsap.to(dots,{scale:1,duration:1,stagger:.1,delay:.2,ease:'elastic.out(1,.45)'});
     }});
    }
    const bars=all<HTMLElement>('[data-bar]');
    if(bars.length){gsap.set(bars,{scaleX:0,transformOrigin:'0% 50%'});ScrollTrigger.create({trigger:'.win-bars',start:'top 82%',once:true,onEnter:()=>{gsap.to(bars,{scaleX:1,duration:1.3,stagger:.12,ease:'power3.out'});}});}

    /* Anything that changes page height needs positions measured again, in page order. */
    const refreshFrame=requestAnimationFrame(()=>{ScrollTrigger.sort();ScrollTrigger.refresh();});
    return()=>{cancelAnimationFrame(refreshFrame);cleanups.forEach(fn=>fn());splits.forEach(split=>split.revert());};
   },ref);
  }).catch(()=>{});
  return()=>{disposed=true;media?.revert();};
 },[ref,reducedMotion]);
}
