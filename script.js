let data=null,index=-1,busy=false;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const wait=ms=>new Promise(r=>setTimeout(r,ms));

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

  const menu=$(".menu");
  menu.innerHTML="";
  data.menu.forEach((entry,i)=>{
    const button=document.createElement("button");
    button.className="item";
    button.dataset.id=entry.id;
    button.textContent=entry.label;
    button.addEventListener("mouseenter",()=>{if(!busy&&$("#menu").classList.contains("active"))setActive(i)});
    button.addEventListener("click",e=>{
      e.preventDefault();
      if(!busy&&$("#menu").classList.contains("active")){index=i;run(entry.id)}
    });
    menu.appendChild(button);
  });
}

function setActive(n){
  const items=$$(".item");
  if(!items.length)return;
  index=(n+items.length)%items.length;
  items.forEach((x,i)=>x.classList.toggle("active",i===index));
}

async function run(id){
  if(busy)return;
  busy=true;
  const d=data.options[id];
  if(!d){busy=false;return}

  $("#menu").classList.remove("active");
  $("#consoleScreen").classList.add("active");
  $("#consoleName").textContent=d.consoleName;
  $("#log").innerHTML="";
  $("#progressWrap").style.display="none";

  for(const line of d.logs){
    await wait(180+Math.random()*280);
    const el=document.createElement("div");
    el.className="logline";
    el.textContent=line;
    $("#log").appendChild(el);
  }

  $("#progressWrap").style.display="block";
  $("#progressLabel").textContent=d.progress;
  $("#bar").style.width="0%";
  $("#percent").textContent="0%";

  for(let p=0;p<=100;p+=2){
    await wait(22+Math.random()*28);
    $("#bar").style.width=p+"%";
    $("#percent").textContent=p+"%";
  }

  await wait(350);
  $("#consoleScreen").classList.remove("active");

  $("#info").innerHTML=`
    <div class="info-head">
      <div class="info-title">${escapeHtml(d.title)}</div>
      <div class="info-code">${escapeHtml(d.code)}</div>
    </div>
    <div class="info-grid">
      ${d.boxes.map(x=>`
        <div class="info-box">
          <b>${escapeHtml(x[0])}</b>
          <p>${escapeHtml(x[1])}<br><br>${escapeHtml(x[2])}</p>
        </div>`).join("")}
    </div>
    <div class="return">[ ENTER ] RETURN TO ACCESS TERMINAL</div>`;
  $("#info").classList.add("visible");
  $("#infoScreen").classList.add("active");
  busy=false;
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function back(){
  $("#infoScreen").classList.remove("active");
  $("#info").classList.remove("visible");
  $("#consoleScreen").classList.remove("active");
  $("#menu").classList.add("active");
  $$(".item").forEach(x=>x.classList.remove("active"));
  index=-1;
}

document.addEventListener("keydown",e=>{
  if(busy)return;
  const menuOpen=$("#menu").classList.contains("active");
  const infoOpen=$("#infoScreen").classList.contains("active");
  const items=$$(".item");

  if(infoOpen){
    if(e.key==="Enter"||e.key==="Escape"){e.preventDefault();e.stopPropagation();back()}
    return;
  }

  if(menuOpen){
    if(e.key==="ArrowDown"){e.preventDefault();setActive(index<0?0:index+1)}
    if(e.key==="ArrowUp"){e.preventDefault();setActive(index<0?items.length-1:index-1)}
    if(e.key==="Enter"&&index>=0){e.preventDefault();e.stopPropagation();run(items[index].dataset.id)}
  }
});

loadData().catch(error=>{
  console.error(error);
  document.body.innerHTML='<div style="padding:40px;font-family:monospace;color:#ffd400;background:#000">DATA LOAD ERROR // RUN THROUGH A LOCAL HTTP SERVER</div>';
});
