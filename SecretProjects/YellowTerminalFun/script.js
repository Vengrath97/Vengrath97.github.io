let data=null,index=-1,busy=false;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* Dark procedural terminal audio — intentionally non-musical. */
let audioCtx=null,masterGain=null;
function initAudio(){
  if(!audioCtx){
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)return;
    audioCtx=new C();
    masterGain=audioCtx.createGain();
    masterGain.gain.value=.32;
    masterGain.connect(audioCtx.destination);
  }
  if(audioCtx.state==='suspended')audioCtx.resume();
}
function noise(duration=.035,gain=.018,filterFreq=1800){
  if(!audioCtx)return;
  const n=audioCtx.sampleRate*duration;
  const buffer=audioCtx.createBuffer(1,n,audioCtx.sampleRate),d=buffer.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const src=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();
  f.type='lowpass';f.frequency.value=filterFreq;g.gain.setValueAtTime(gain,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
  src.buffer=buffer;src.connect(f).connect(g).connect(masterGain);src.start();
}
function pulse(freq=120,duration=.06,gain=.018,type='sine',drop=0){
  if(!audioCtx)return;
  const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type;o.frequency.setValueAtTime(freq,t);if(drop)o.frequency.exponentialRampToValueAtTime(Math.max(25,freq-drop),t+duration);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g).connect(masterGain);o.start(t);o.stop(t+duration+.01);
}
function navSound(){noise(.018,.008,2400);pulse(92,.035,.012,'sine',18)}
function selectSound(){noise(.028,.014,1200);pulse(68,.11,.024,'sine',22);pulse(138,.055,.009,'sine',20,.025)}
function logSound(){noise(.022,.006,2600);pulse(58,.025,.006,'sine',10)}
function progressSound(p){if(p%20===0){noise(.025,.006,1500);pulse(55,.045,.008,'sine',12)}}
function successSound(){noise(.08,.018,900);pulse(72,.18,.026,'sine',18);pulse(104,.22,.014,'sine',20,.05)}
function backSound(){noise(.035,.01,1000);pulse(84,.11,.016,'sine',24)}

async function loadData(){
  const response=await fetch("data.json",{cache:"no-store"});
  if(!response.ok)throw new Error("DATA LOAD FAILED");
  data=await response.json();
  buildMenu();
}

function buildMenu(){
  const b=data.branding;
  $(".brand").textContent=b.kicker;
  $(".title").textContent=b.title;
  $(".subtitle").textContent=b.subtitle;
  $(".console-top span:last-child").textContent=b.headerRight;
  $(".hint").textContent=b.hint;
  const menu=$(".menu");menu.innerHTML="";
  data.menu.forEach((entry,i)=>{
    const button=document.createElement("button");button.className="item";button.dataset.id=entry.id;button.textContent=entry.label;
    button.addEventListener("mouseenter",()=>{if(!busy&&$("#menu").classList.contains("active")&&index!==i){initAudio();navSound();setActive(i)}});
    button.addEventListener("click",e=>{e.preventDefault();initAudio();if(!busy&&$("#menu").classList.contains("active")){index=i;selectSound();run(entry.id)}});
    menu.appendChild(button);
  });
}
function setActive(n){const items=$$(".item");if(!items.length)return;index=(n+items.length)%items.length;items.forEach((x,i)=>x.classList.toggle("active",i===index))}

async function run(id){
  if(busy)return;initAudio();busy=true;const d=data.options[id];if(!d){busy=false;return}
  $("#menu").classList.remove("active");$("#consoleScreen").classList.add("active");$("#consoleName").textContent=d.consoleName;$("#log").innerHTML="";$("#progressWrap").style.display="none";
  selectSound();
  for(const line of d.logs){await wait(180+Math.random()*280);const el=document.createElement("div");el.className="logline";el.textContent=line;$("#log").appendChild(el);logSound()}
  $("#progressWrap").style.display="block";$("#progressLabel").textContent=d.progress;$("#bar").style.width="0%";$("#percent").textContent="0%";pulse(43,.12,.012,'sine',8);
  for(let p=0;p<=100;p+=2){await wait(22+Math.random()*28);$("#bar").style.width=p+"%";$("#percent").textContent=p+"%";progressSound(p)}
  await wait(350);successSound();$("#consoleScreen").classList.remove("active");
  $("#info").innerHTML=`<div class="info-head"><div class="info-title">${escapeHtml(d.title)}</div><div class="info-code">${escapeHtml(d.code)}</div></div><div class="info-grid">${d.boxes.map(x=>`<div class="info-box"><b>${escapeHtml(x[0])}</b><p>${escapeHtml(x[1])}<br><br>${escapeHtml(x[2])}</p></div>`).join("")}</div><div class="return">[ ENTER ] RETURN TO ACCESS TERMINAL</div>`;
  $("#info").classList.add("visible");$("#infoScreen").classList.add("active");busy=false;
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function back(){initAudio();backSound();$("#infoScreen").classList.remove("active");$("#info").classList.remove("visible");$("#consoleScreen").classList.remove("active");$("#menu").classList.add("active");$$.call?null:null;$$(".item").forEach(x=>x.classList.remove("active"));index=-1}

document.addEventListener("keydown",e=>{
  if(!audioCtx&&['ArrowDown','ArrowUp','Enter','Escape'].includes(e.key))initAudio();if(busy)return;
  const menuOpen=$("#menu").classList.contains("active"),infoOpen=$("#infoScreen").classList.contains("active"),items=$$(".item");
  if(infoOpen){if(e.key==="Enter"||e.key==="Escape"){e.preventDefault();e.stopPropagation();back()}return}
  if(menuOpen){if(e.key==="ArrowDown"){e.preventDefault();setActive(index<0?0:index+1);navSound()}if(e.key==="ArrowUp"){e.preventDefault();setActive(index<0?items.length-1:index-1);navSound()}if(e.key==="Enter"&&index>=0){e.preventDefault();e.stopPropagation();selectSound();run(items[index].dataset.id)}}
});
loadData().catch(error=>{console.error(error);document.body.innerHTML='<div style="padding:40px;font-family:monospace;color:#ffd400;background:#000">DATA LOAD ERROR // RUN THROUGH A LOCAL HTTP SERVER</div>'});
