import WebSocket from 'next/dist/compiled/ws/index.js';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.BLOOM_BASE_URL||'http://127.0.0.1:3000';const debugPort=9500+Math.floor(Math.random()*500);
await mkdir('.bloom-browser',{recursive:true});
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-sandbox','--no-first-run','--no-default-browser-check','--remote-debugging-port='+debugPort,'--user-data-dir='+new URL('../.bloom-browser/profile-'+process.pid,import.meta.url).pathname.replace(/^\//,''),'about:blank'],{windowsHide:true,stdio:'ignore'});
const keepAlive=setInterval(()=>{},1000);const pause=ms=>new Promise(r=>setTimeout(r,ms));let socket;const issues=[];const checks=[];checks.push=function(...items){console.log(...items);return Array.prototype.push.apply(this,items);};
try{
 let targets;for(let i=0;i<50;i++){try{targets=await (await fetch('http://127.0.0.1:'+debugPort+'/json')).json();if(targets.length)break;}catch{}await pause(200);}
 if(!targets?.length)throw new Error('Chrome debugging endpoint unavailable');
 socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});let nextId=0;const pending=new Map();socket.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id){const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(msg.error):p.resolve(msg.result);}if(msg.method==='Runtime.exceptionThrown')issues.push(msg.params.exceptionDetails.text+' '+(msg.params.exceptionDetails.exception?.description||''));if(msg.method==='Runtime.consoleAPICalled'&&msg.params.type==='error')issues.push(msg.params.args.map(x=>x.value||x.description).join(' '));};
 socket.onclose=event=>{for(const p of pending.values())p.reject(new Error('Chrome debugging connection closed: '+event.code+' '+event.reason));pending.clear();};socket.onerror=event=>{console.error('Chrome socket error',event.message);};const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++nextId;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;};
 const wait=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await pause(100);}throw new Error('Timed out: '+expression);};
 const go=async path=>{await send('Page.navigate',{url:base+path});await wait('document.readyState==="complete"');await pause(450);};
 const click=async text=>{await evaluate('(()=>{const e=[...document.querySelectorAll("button,a")].find(e=>e.textContent.trim()==='+JSON.stringify(text)+');if(!e)throw Error("Missing control: '+text+'");e.focus();e.click();})()');await pause(250);};
 const fill=async(selector,value)=>evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');if(!e)throw Error("Missing field");Object.getOwnPropertyDescriptor(e instanceof HTMLSelectElement?HTMLSelectElement.prototype:e instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,"value").set.call(e,'+JSON.stringify(value)+');e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}));})()');
 await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await go('/');await evaluate('localStorage.clear()');await go('/');await wait('document.querySelector(".landing").dataset.scrollScenes==="ready"');

 await wait('document.documentElement.dataset.intro!=="running"');
 assert.equal(await evaluate('document.querySelectorAll(".marquee-band,[data-marquee]").length'),0);checks.push('Green scrolling text band removed');
 for(const mode of ['desktop','mobile','reduced']){
  await send('Emulation.setDeviceMetricsOverride',{width:mode==='mobile'?390:1440,height:1000,deviceScaleFactor:1,mobile:mode==='mobile'});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:mode==='reduced'?'reduce':'no-preference'}]});await pause(800);
  for(let index=0;index<8;index++){
   await evaluate('document.querySelector(".menu-toggle").click()');await wait('document.querySelector(".menu-overlay").dataset.state==="open"');await pause(mode==='reduced'?50:1500);
   const href=await evaluate('document.querySelectorAll(".menu-link")['+index+'].hash');
   await evaluate('document.querySelectorAll(".menu-link")['+index+'].click()');await wait('document.querySelector(".menu-overlay").dataset.state==="closed"');await pause(350);
   const result=await evaluate('(()=>{const target=document.querySelector('+JSON.stringify(href)+');return {hash:location.hash,top:target.getBoundingClientRect().top,focused:document.activeElement===target,overflow:document.documentElement.style.overflow,y:scrollY}})()');
   assert.equal(result.hash,href);assert.ok(Math.abs(result.top)<=35,mode+' '+href+': '+JSON.stringify(result));assert.equal(result.focused,true);assert.equal(result.overflow,'');assert.ok(result.y>0);
  }
  checks.push('All eight menu links reach and focus their sections: '+mode);
  const before=await evaluate('scrollY');await evaluate('document.querySelector(".menu-toggle").click()');await wait('document.querySelector(".menu-overlay").dataset.state==="open"');await pause(mode==='reduced'?50:1500);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('document.querySelector(".menu-overlay").dataset.state==="closed"');await pause(100);
  assert.ok(Math.abs(await evaluate('scrollY')-before)<2);assert.equal(await evaluate('document.activeElement.className'),'menu-toggle');checks.push('Escape preserves scroll and restores menu button focus: '+mode);
 }
 assert.equal(issues.length,0,JSON.stringify(issues));await writeFile('.bloom-browser/menu-report.json',JSON.stringify({checks,issues},null,2));console.log(JSON.stringify({checks,issues},null,2));
}catch(error){console.error(error);console.log(JSON.stringify({checks,issues},null,2));process.exitCode=1;}finally{clearInterval(keepAlive);socket?.close();browser.kill();}
