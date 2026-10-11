export type Energy = 'low' | 'balanced' | 'high';
export const categories = ['study','work','personal','health','creative','other'] as const;
export type Category = typeof categories[number];
export type Task = { id:string; title:string; notes:string; category:Category; priority:'high'|'medium'|'low'; estimateMinutes:number; date:string; time:string; pinned:boolean; completed:boolean; createdAt:string; completedAt?:string };
export type Preferences = { onboardingCompleted:boolean; displayName:string; energy:Energy; goals:string[]; planningStyle:'timeline'|'priorities'; focusMinutes:number; dayStart:string; capacity:number; reducedMotion:boolean };
export type Session = { id:string; taskId?:string; plannedMinutes:number; actualSeconds:number; completed:boolean; startedAt:string; endedAt:string };
export type Growth = { id:string; taskId:string; title:string; at:string };
export type Data = { version:1; tasks:Task[]; preferences:Preferences; sessions:Session[]; growth:Growth[]; reflections:Record<string,string>; sample:boolean };
export const defaults:Preferences = { onboardingCompleted:false, displayName:'',energy:'balanced',goals:[],planningStyle:'timeline',focusMinutes:25,dayStart:'09:00',capacity:240,reducedMotion:false };
export const emptyData = ():Data => ({version:1,tasks:[],preferences:{...defaults},sessions:[],growth:[],reflections:{},sample:false});
// Local date keys avoid UTC conversion changing the user's intended day.
export function dateKey(date=new Date()):string { return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'); }
export function shiftDate(key:string,days:number):string { const d=new Date(key+'T12:00:00');d.setDate(d.getDate()+days);return dateKey(d); }
export const uid=()=>crypto.randomUUID();
export function sampleTasks():Task[] {return [ ['Review data structures','study','high',45,'09:00'],['Send project update','work','medium',15,'10:00'],['Take a short walk','health','low',20,'12:30'],['Sketch landing-page ideas','creative','medium',30,''] ].map((a,i)=>({id:uid(),title:String(a[0]),notes:'An editable sample task. Make it your own.',category:a[1] as Category,priority:a[2] as Task['priority'],estimateMinutes:Number(a[3]),date:dateKey(),time:String(a[4]),pinned:i===0,completed:false,createdAt:new Date().toISOString()})); }
const ranks={high:0,medium:1,low:2};
// Suggestions never mutate the underlying tasks or override explicit schedules.
// Low energy favors shorter work; other modes favor priority. All tasks remain accessible.
export function suggest(tasks:Task[],energy:Energy):Task[] { return [...tasks].filter(t=>!t.completed).sort((a,b)=>(energy==='low'?a.estimateMinutes-b.estimateMinutes:0)||Number(b.pinned)-Number(a.pinned)||ranks[a.priority]-ranks[b.priority]||(energy==='high'?b.estimateMinutes-a.estimateMinutes:0)||a.createdAt.localeCompare(b.createdAt)); }
export function toggleTask(data:Data,id:string,now=new Date().toISOString()):Data {const original=data.tasks.find(t=>t.id===id);if(!original)return data;const completed=!original.completed;return {...data,tasks:data.tasks.map(t=>t.id===id?{...t,completed,completedAt:completed?now:undefined}:t),growth:completed&&!data.growth.some(g=>g.taskId===id)?[...data.growth,{id:uid(),taskId:id,title:original.title,at:now}]:data.growth};}
export function replan(tasks:Task[],ids:string[],choice:string,today=dateKey(),start='14:00'):Task[]{let cursor=Number(start.slice(0,2))*60+Number(start.slice(3));return tasks.map(t=>{if(!ids.includes(t.id)||t.completed)return t;if(choice==='tomorrow')return {...t,date:shiftDate(today,1),time:''};if(choice==='unscheduled')return {...t,date:today,time:''};if(choice==='later'){const dayOffset=Math.floor(cursor/1440);const minutes=cursor%1440;cursor+=t.estimateMinutes+10;return {...t,date:shiftDate(today,dayOffset),time:String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0')};}return t;});}
export function weeklyData(data:Data,today=dateKey()){const start=shiftDate(today,-6);return {wins:data.growth.filter(g=>dateKey(new Date(g.at))>=start&&dateKey(new Date(g.at))<=today),sessions:data.sessions.filter(s=>dateKey(new Date(s.startedAt))>=start&&dateKey(new Date(s.startedAt))<=today)};}
