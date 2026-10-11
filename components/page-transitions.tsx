'use client';
import {ReactNode,useEffect,useRef} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {useBloom} from './provider';
import {loadGsap} from './motion';
export function PageTransitions({children}:{children:ReactNode}){
 const pathname=usePathname();const router=useRouter();const {data}=useBloom();
 const overlay=useRef<HTMLDivElement>(null);const previous=useRef(pathname);const reveal=useRef<(()=>void)|null>(null);
 useEffect(()=>{
  if(data.preferences.reducedMotion)return;
  let disposed=false;let media:ReturnType<typeof import('gsap').default.matchMedia>|undefined;
  loadGsap().then(gsap=>{
   if(disposed||!overlay.current)return;
   media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
    const element=overlay.current!;const panels=element.querySelectorAll('.transition-panel');const word=element.querySelector('.transition-word');
    let animation:gsap.core.Timeline|undefined;let fallback:ReturnType<typeof setTimeout>|undefined;let busy=false;
    const ctx=gsap.context(()=>{gsap.set(panels,{y:0,yPercent:105});},element);
    const finish=()=>{element.dataset.active='false';busy=false;clearTimeout(fallback);};
    const uncover=()=>{clearTimeout(fallback);animation?.kill();ctx.add(()=>{
     element.dataset.active='true';
     animation=gsap.timeline({onComplete:finish}).to(word,{opacity:0,y:-18,duration:.18}).to(panels,{yPercent:-105,duration:.55,stagger:.055,ease:'power3.inOut'},.04);
    });};reveal.current=uncover;
    const click=(event:MouseEvent)=>{
     if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||busy)return;
     const target=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
     if(!target||target.hasAttribute('download')||(target.target&&target.target!=='_self')||target.closest('dialog')||target.dataset.noTransition!==undefined)return;
     const url=new URL(target.href,location.href);
     if(url.origin!==location.origin||url.pathname===location.pathname)return;
     event.preventDefault();busy=true;element.dataset.active='true';animation?.kill();
     ctx.add(()=>{
      gsap.set(panels,{y:0,yPercent:105});gsap.set(word,{opacity:0,y:18});
      animation=gsap.timeline().to(panels,{yPercent:0,duration:.32,stagger:.035,ease:'power3.inOut'}).to(word,{opacity:1,y:0,duration:.2},.18).call(()=>{
       // Always release the curtain even if navigation does not commit.
       fallback=setTimeout(uncover,3000);router.push(url.pathname+url.search+url.hash);
      });
     });
    };
    document.addEventListener('click',click,true);
    return()=>{document.removeEventListener('click',click,true);clearTimeout(fallback);animation?.kill();ctx.revert();finish();reveal.current=null;};
   },overlay);
  }).catch(()=>{});
  return()=>{disposed=true;media?.revert();};
 },[data.preferences.reducedMotion,router]);
 useEffect(()=>{if(previous.current!==pathname){previous.current=pathname;reveal.current?.();}},[pathname]);
 return <>{children}<div ref={overlay} className="page-transition" data-active="false" aria-hidden="true"><div className="transition-panel"/><div className="transition-panel"/><div className="transition-panel"/><div className="transition-panel"/><div className="transition-word"><span>✳</span> bloom.</div></div></>;
}
