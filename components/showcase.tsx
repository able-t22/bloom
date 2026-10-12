'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {Sunrise,CloudSun,Sun,Check,Clock,Leaf,Sprout,ShieldCheck,Feather,RotateCcw,Timer} from 'lucide-react';
import {BloomBurst} from './bloom-art';
import {useBloom} from './provider';
import {loadKit} from './gsap-kit';
import {GROWTH_PATHS,GROWTH_COLORS,GROWTH_SKIES} from './growth-shapes';

/* ------------------------------------------------------------ day gallery */
const moments=[
 {time:'8:10 am',title:'Check in with your energy',copy:'Low, balanced or high. Bloom starts from how you actually feel, not from how the day was supposed to go.',tone:'lavender',visual:'energy'},
 {time:'9:30 am',title:'Choose one thing',copy:'Pick what matters, give it a little time, and leave the rest of the list alone for now.',tone:'peach',visual:'pick'},
 {time:'11:00 am',title:'Focus, kindly',copy:'One task and a quiet timer. When it ends you can take a break or mark the task done.',tone:'sage',visual:'focus'},
 {time:'2:15 pm',title:'Replan without guilt',copy:'A meeting ran long. Move what is left to a time that works and keep going.',tone:'yellow',visual:'replan'},
 {time:'6:40 pm',title:'See what grew',copy:'Every first completion adds something to your garden, and nothing in it wilts if you take a day off.',tone:'lilac',visual:'garden'}
] as const;
function DayVisual({kind}:{kind:typeof moments[number]['visual']}){
 if(kind==='energy')return <div className="dv-energy" data-parallax><span><CloudSun size={20}/>Low</span><span className="on"><Sunrise size={20}/>Balanced</span><span><Sun size={20}/>High</span><p>A steady morning. Two focus blocks and a walk.</p></div>;
 if(kind==='pick')return <div className="dv-pick" data-parallax><div className="dv-card main"><span className="task-check"/><span>Sketch landing-page ideas<small><Clock size={11}/>25 min · creative</small></span></div><div className="dv-card"><span className="task-check"/><span>Review data structures<small><Clock size={11}/>45 min · study</small></span></div><div className="dv-card"><span className="task-check"/><span>Take a short walk<small><Clock size={11}/>20 min · health</small></span></div></div>;
 if(kind==='focus')return <div className="dv-focus" data-parallax><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="84" fill="none" stroke="#ffffff" strokeWidth="10" opacity=".7"/><circle data-draw-ring cx="100" cy="100" r="84" fill="none" stroke="#315b43" strokeWidth="10" strokeLinecap="round" transform="rotate(-90 100 100)"/></svg><div className="dv-clock">25<span>:</span>00</div><small><Timer size={13}/>One small intention</small></div>;
 if(kind==='replan')return <div className="dv-replan" data-parallax><div className="dv-slot"><b>3:00</b><span>Write the update</span></div><div className="dv-slot moved"><b>4:30</b><span>Review notes<small>moved from 2:00</small></span></div><div className="dv-slot"><b>5:30</b><span>Short walk</span></div></div>;
 return <div className="dv-garden" data-parallax><BloomBurst className="dv-flower"/><div className="dv-sprouts"><Sprout size={30}/><Leaf size={26}/><Sprout size={36}/><Leaf size={24}/></div><p>Look at you growing.</p></div>;
}
export function DayGallery(){
 return <section className="day-gallery" id="a-day-in-bloom" aria-label="A day in Bloom" style={{'--panels':moments.length} as React.CSSProperties}>
  <div className="day-gallery-sticky">
   <div className="day-gallery-head"><h2 data-kinetic data-scroll-owned>One day,<br/>five <em>gentle moments.</em></h2><div className="day-progress" aria-hidden="true"><span data-gallery-label>{moments[0].time}</span><div className="day-progress-bar"><span/></div></div></div>
   <div className="day-track" data-cursor="Drag">
    {moments.map(moment=><article className="day-panel" data-tone={moment.tone} key={moment.time}><div className="day-visual"><DayVisual kind={moment.visual}/></div><div className="day-copy"><span className="day-time">{moment.time}</span><h3>{moment.title}</h3><p>{moment.copy}</p></div></article>)}
   </div>
  </div>
 </section>;
}

/* ------------------------------------------------------------ promise stack */
const promises=[
 {title:'No account to make.',copy:'Your plan lives in this browser. Open Bloom and begin. There is nothing to sign up for and nothing to sync.',Icon:ShieldCheck,tone:'sage'},
 {title:'No streak to break.',copy:'Your garden stays just as you left it when you take a day off. Come back whenever you are ready.',Icon:Sprout,tone:'lavender'},
 {title:'No pressure to finish.',copy:'Capacity is a guide, not a limit. Replan the day when life changes and let the rest wait.',Icon:Feather,tone:'peach'}
] as const;
export function PromiseStack(){
 return <section className="promise-stack" id="promises" aria-label="Three promises"><div className="promise-intro"><h2 data-kinetic data-scroll-owned>Three things Bloom<br/>will never <em>ask of you.</em></h2></div><div className="promise-cards">{promises.map((promise,index)=><article className="promise-card" data-tone={promise.tone} style={{'--i':index} as React.CSSProperties} key={promise.title}><div className="promise-copy"><span className="promise-icon"><promise.Icon size={26} strokeWidth={1.4}/></span><h3>{promise.title}</h3><p>{promise.copy}</p></div><div className="promise-art" aria-hidden="true"><BloomBurst className={'promise-flower f'+index}/></div></article>)}</div></section>;
}

/* ------------------------------------------------------- kinetic statement */
export function KineticStatement(){
 return <section className="kinetic" aria-label="Both belong here"><p data-statement>Some days you do a lot. Some days you do a little. Both belong here.</p></section>;
}

/* ------------------------------------------------------------ growth morph */
const stages=[
 {name:'Seed',copy:'Every day starts as something small and unfinished.'},
 {name:'Sprout',copy:'One small intention, done. Something starts to take root.'},
 {name:'Bud',copy:'A few steady days. Nothing forced and nothing rushed.'},
 {name:'Bloom',copy:'Progress you can see, grown at your own pace.'}
] as const;
export function GrowthStage(){
 return <section className="growth" id="growth" aria-label="From seed to bloom" style={{background:GROWTH_SKIES[3]}}>
  <div className="growth-sticky">
   <div className="growth-copy">
    <h2 data-kinetic data-scroll-owned>From seed<br/>to <em>bloom.</em></h2>
    <div className="growth-captions">{stages.map((stage,index)=><div className="growth-caption" key={stage.name} data-caption={index}><strong>{stage.name}</strong><p>{stage.copy}</p></div>)}</div>
    <div className="growth-meter" aria-hidden="true"><span>Stage <b data-growth-count>4</b> of 4</span><div className="growth-meter-bar"><span/></div></div>
   </div>
   <div className="growth-visual">
    <svg viewBox="0 0 400 400" role="img" aria-label="A shape that grows from a seed into a flower as you scroll">
     <path id="growth-orbit" data-orbit d="M200 215 m-160 0 a160 160 0 1 0 320 0 a160 160 0 1 0 -320 0" fill="none" stroke="#6a4695" strokeWidth="1.5" opacity=".35"/>
     <ellipse cx="200" cy="372" rx="120" ry="9" fill="#35452b" opacity=".12"/>
     <g data-plant><path data-morph d={GROWTH_PATHS.bloom} fill={GROWTH_COLORS.bloom}/><circle data-core cx="200" cy="215" r="34" fill="#fff8da"/></g>
     {[['#bf5036',6],['#6a4695',5],['#315b43',7]].map(([fill,r])=><circle key={String(fill)} data-spark cx="0" cy="0" r={Number(r)} fill={String(fill)}/>)}
    </svg>
   </div>
  </div>
 </section>;
}

/* -------------------------------------------------------------- sample week */
const week=[['Mon',2],['Tue',1],['Wed',3],['Thu',0],['Fri',2],['Sat',3],['Sun',1]] as const;
const chartX=(index:number)=>40+index*80;
const chartY=(value:number)=>190-value*50;
function smoothLine(){
 let path='M'+chartX(0)+' '+chartY(week[0][1]);
 for(let index=1;index<week.length;index++){
  const x0=chartX(index-1),y0=chartY(week[index-1][1]),x1=chartX(index),y1=chartY(week[index][1]);
  path+=' C'+(x0+34)+' '+y0+' '+(x1-34)+' '+y1+' '+x1+' '+y1;
 }
 return path;
}
const linePath=smoothLine();
const areaPath=linePath+' L'+chartX(week.length-1)+' 190 L'+chartX(0)+' 190 Z';
const categories=[['Work',90],['Health',55],['Creative',50],['Personal',30]] as const;
export function SmallWins(){
 return <section className="wins" id="small-wins" aria-label="A sample week">
  <div className="wins-intro"><h2 data-kinetic data-scroll-owned>Small steps<br/>add up <em>quietly.</em></h2><p>A sample week in the garden. Yours will look different, and that is the point.</p><span className="sample-badge">Sample week</span></div>
  <div className="wins-grid">
   <div className="win-stat" data-tone="sage"><b data-count="12">12</b><span>intentions done</span></div>
   <div className="win-stat" data-tone="lavender"><b data-count="225" data-format="minutes">3h 45m</b><span>of calm focus</span></div>
   <div className="win-stat" data-tone="peach"><b data-count="6">6</b><span>days with something done</span></div>
   <figure className="win-chart"><svg viewBox="0 0 560 240" role="img" aria-label="Intentions completed each day of a sample week. Thursday was a rest day.">
    <defs><linearGradient id="wins-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8e61b9" stopOpacity=".28"/><stop offset="1" stopColor="#8e61b9" stopOpacity="0"/></linearGradient></defs>
    {[0,1,2,3].map(value=><line key={value} x1="20" x2="540" y1={chartY(value)} y2={chartY(value)} stroke="#35452b" strokeOpacity=".1"/>)}
    <path data-chart-area d={areaPath} fill="url(#wins-area)"/>
    <path data-chart-line d={linePath} fill="none" stroke="#6a4695" strokeWidth="3" strokeLinecap="round"/>
    {week.map(([day,value],index)=><g key={day}><circle data-chart-dot cx={chartX(index)} cy={chartY(value)} r="7" fill={value?'#fffdf8':'#e5d0f5'} stroke="#6a4695" strokeWidth="3"/><text data-chart-day x={chartX(index)} y="225" textAnchor="middle" fontSize="12" fill="#666e62">{day}</text></g>)}
   </svg><figcaption>Thursday was a rest day. The garden did not mind.</figcaption></figure>
   <div className="win-bars"><h3>Where the time went</h3>{categories.map(([name,minutes])=><div className="win-bar" key={name}><span>{name}</span><div className="win-bar-track"><i data-bar style={{width:(minutes/90*100)+'%'}}/></div><small>{minutes} min</small></div>)}</div>
  </div>
 </section>;
}

/* --------------------------------------------------------- draggable board */
const notes=[
 {id:'reply',text:'Reply to Sam',tone:'lavender',x:5,y:8,r:-4},
 {id:'dentist',text:'Book the dentist',tone:'peach',x:47,y:5,r:3},
 {id:'sketch',text:'Sketch landing-page ideas',tone:'sage',x:9,y:38,r:2},
 {id:'plants',text:'Water the plants',tone:'yellow',x:52,y:36,r:-3},
 {id:'read',text:'Read ten pages',tone:'lavender',x:16,y:68,r:4},
 {id:'walk',text:'Take a short walk',tone:'peach',x:55,y:67,r:-2}
] as const;
const CAPACITY=3;
export function ThoughtToss(){
 const {data}=useBloom();const reduced=data.preferences.reducedMotion;
 const stage=useRef<HTMLDivElement>(null);const zone=useRef<HTMLDivElement>(null);const list=useRef<HTMLOListElement>(null);
 const [placed,setPlaced]=useState<string[]>([]);const [message,setMessage]=useState('Pick a few things. Today only has room for three.');
 const placedRef=useRef<string[]>([]);const moved=useRef(false);
 useEffect(()=>{placedRef.current=placed;},[placed]);
 const add=useCallback((id:string)=>{
  const note=notes.find(item=>item.id===id);if(!note)return false;
  if(placedRef.current.includes(id))return false;
  if(placedRef.current.length>=CAPACITY){setMessage('Today has room for three. Bloom keeps it gentle, so the rest can wait.');return false;}
  setPlaced(current=>[...current,id]);setMessage('Added “'+note.text+'”. '+(placedRef.current.length+1)+' of '+CAPACITY+' on today’s list.');return true;
 },[]);
 // Entrance for the newest list item.
 useEffect(()=>{
  if(reduced||!placed.length)return;
  let disposed=false;
  loadKit().then(({gsap})=>{const last=list.current?.querySelector('li.filled:last-of-type');if(disposed||!last)return;gsap.fromTo(last,{scale:.7,y:-16,opacity:0},{scale:1,y:0,opacity:1,duration:.9,ease:'elastic.out(1,.5)',clearProps:'transform,opacity'});}).catch(()=>{});
  return()=>{disposed=true;};
 },[placed.length,reduced]);
 // Drag, throw and drop. Keyboard and click users get the same result from the note buttons.
 useEffect(()=>{
  if(reduced)return;
  let disposed=false;let instances:{kill:()=>void}[]=[];
  loadKit().then(({gsap,Draggable})=>{
   if(disposed||!stage.current||!zone.current)return;
   const zoneEl=zone.current;const pending=new Map<Element,boolean>();
   const els=gsap.utils.toArray<HTMLElement>('.toss-note',stage.current);
   const decide=(drag:InstanceType<typeof Draggable>)=>{
    const el=drag.target as HTMLElement;if(!pending.get(el))return;pending.set(el,false);
    zoneEl.classList.remove('is-over','is-targeting');
    if(!drag.hitTest(zoneEl,'40%'))return;
    if(placedRef.current.length>=CAPACITY){
     setMessage('Today has room for three. Bloom keeps it gentle, so the rest can wait.');
     gsap.to(el,{x:0,y:0,duration:1.1,ease:'elastic.out(1,.45)',onUpdate:()=>drag.update()});
     return;
    }
    gsap.to(el,{scale:.5,opacity:0,duration:.22,ease:'power2.in',onComplete:()=>{add(el.dataset.id||'');}});
   };
   instances=Draggable.create(els,{
    type:'x,y',bounds:stage.current,inertia:true,edgeResistance:.8,zIndexBoost:true,
    onPress(){pending.set(this.target as Element,true);moved.current=false;gsap.to(this.target,{scale:1.08,rotation:0,duration:.2,ease:'power2.out'});},
    onDragStart(){moved.current=true;zoneEl.classList.add('is-targeting');},
    onDrag(){zoneEl.classList.toggle('is-over',this.hitTest(zoneEl,'40%'));},
    onRelease(){gsap.to(this.target,{scale:1,duration:.5,ease:'elastic.out(1,.5)'});},
    onDragEnd(){const drag=this as unknown as InstanceType<typeof Draggable>;setTimeout(()=>{moved.current=false;},80);gsap.delayedCall(.05,()=>{if(!drag.isThrowing)decide(drag);});},
    onThrowComplete(){decide(this as unknown as InstanceType<typeof Draggable>);}
   });
  }).catch(()=>{});
  return()=>{disposed=true;instances.forEach(instance=>instance.kill());};
 },[placed,reduced,add]);
 const reset=()=>{
  setPlaced([]);setMessage('Pick a few things. Today only has room for three.');
  if(stage.current)loadKit().then(({gsap})=>{if(stage.current)gsap.set(stage.current.querySelectorAll('.toss-note'),{clearProps:'transform,opacity'});}).catch(()=>{});
 };
 const board=notes.filter(note=>!placed.includes(note.id));
 return <section className="toss" id="toss" aria-label="Try a sample day">
  <div className="toss-intro"><h2 data-kinetic data-scroll-owned>Toss in what’s on<br/>your <em>mind.</em></h2><p>Drag a thought onto today, or flick it and let it glide. Prefer a keyboard? Press any note to add it.</p></div>
  <div className="toss-stage" ref={stage}>
   <div className="toss-board"><span className="toss-label">On your mind</span>{board.map(note=><button type="button" key={note.id} data-id={note.id} data-tone={note.tone} data-cursor="Drag" className="toss-note" aria-label={'Add “'+note.text+'” to today'} style={{left:note.x+'%',top:note.y+'%',transform:'rotate('+note.r+'deg)'}} onClick={()=>{if(moved.current){moved.current=false;return;}add(note.id);}}>{note.text}</button>)}{!board.length&&<p className="toss-clear">A clear head. That felt good.</p>}</div>
   <div className="toss-today" ref={zone}><span className="toss-label">Today · {placed.length} of {CAPACITY}</span><ol ref={list}>{Array.from({length:CAPACITY},(_,index)=>{const note=notes.find(item=>item.id===placed[index]);return note?<li key={note.id} className="filled"><span className="round-check"><Check size={13}/></span>{note.text}</li>:<li key={'slot'+index} className="slot" aria-hidden="true">A little room</li>;})}</ol><button type="button" className="text-button toss-reset" onClick={reset} disabled={!placed.length}><RotateCcw size={14}/>Start over</button></div>
  </div>
  <p className="toss-message" role="status" aria-live="polite">{message}</p>
 </section>;
}
