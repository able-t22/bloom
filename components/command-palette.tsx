'use client';
import {useId,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Search,ArrowUpRight,Sun,CalendarDays,Timer,Sprout,Settings} from 'lucide-react';
import {Modal} from './ui';
import {useBloom} from './provider';
const destinations=[{title:'Today',detail:'Your intentions for today',href:'/app/today',Icon:Sun},{title:'My plan',detail:'Make room in your schedule',href:'/app/plan',Icon:CalendarDays},{title:'Focus',detail:'One thing at a time',href:'/app/focus',Icon:Timer},{title:'My garden',detail:'See your small steps grow',href:'/app/garden',Icon:Sprout},{title:'Settings',detail:'Make yourself at home',href:'/app/settings',Icon:Settings}];
export function CommandPalette({onClose}:{onClose:()=>void}){
 const {data}=useBloom();const router=useRouter();const [query,setQuery]=useState('');const [active,setActive]=useState(0);const id=useId();
 const items=[...destinations,...data.tasks.filter(task=>!task.completed).map(task=>({title:task.title,detail:task.estimateMinutes+' min · '+task.category+' · Start focus',href:'/app/focus?task='+encodeURIComponent(task.id),Icon:Timer}))].filter(item=>(item.title+' '+item.detail).toLowerCase().includes(query.trim().toLowerCase())).slice(0,12);
 const selected=Math.min(active,Math.max(0,items.length-1));
 function choose(href:string){onClose();router.push(href);}
 return <Modal title="Find your next step" onClose={onClose}><div className="command-search"><Search size={19}/><input aria-label="Search pages and unfinished tasks" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={id} aria-activedescendant={items.length?id+'-'+selected:undefined} value={query} onChange={event=>{setQuery(event.target.value);setActive(0);}} placeholder="Search pages or your intentions…" onKeyDown={event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setActive(items.length?(selected+(event.key==='ArrowDown'?1:-1)+items.length)%items.length:0);}if(event.key==='Enter'&&items[selected]){event.preventDefault();choose(items[selected].href);}}}/></div><div className="command-results" role="listbox" id={id} aria-label="Pages and unfinished tasks">{items.map((item,index)=><button key={item.href} id={id+'-'+index} role="option" aria-selected={selected===index} tabIndex={-1} className={selected===index?'selected':''} onMouseDown={event=>event.preventDefault()} onPointerMove={()=>setActive(index)} onClick={()=>choose(item.href)}><item.Icon size={19}/><span>{item.title}<small>{item.detail}</small></span><ArrowUpRight size={15}/></button>)}</div>{!items.length&&<p className="command-empty" role="status">No matching steps. Try another word.</p>}<div className="command-help"><span>↑ ↓ to explore · Enter to go</span><span>Esc to close</span></div></Modal>;
}
