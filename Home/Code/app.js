(()=>{"use strict";
const viewport=document.getElementById("viewport"),board=document.getElementById("board"),filters=document.getElementById("filters"),search=document.getElementById("search"),shuffleBtn=document.getElementById("shuffle");
let records=[],shuffled=[],activeTag="Wszystko",drag={active:false,startX:0,lastX:0,lastTime:0,velocity:0,moved:false},momentum=0;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const FILTERS=[["Wszystko","Wszystko"],["Kampanie","Kampania"],["Sesje","Sesje"],["Blog","Blog"],["Grafika","Grafika"],["Narzędzia","Narzędzia"],["Archiwum","Archiwum"]];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function path(poly){return poly.map((p,i)=>(i?"L":"M")+p.x.toFixed(2)+" "+p.y.toFixed(2)).join(" ")+" Z"}
function cell(site,sites,b){let p=[{x:b.x0,y:b.y0},{x:b.x1,y:b.y0},{x:b.x1,y:b.y1},{x:b.x0,y:b.y1}];for(const o of sites){if(o===site)continue;const nx=o.x-site.x,ny=o.y-site.y,mid=nx*(o.x+site.x)/2+ny*(o.y+site.y)/2,n=[];for(let i=0;i<p.length;i++){const a=p[i],z=p[(i+1)%p.length],da=nx*a.x+ny*a.y-mid,dz=nx*z.x+ny*z.y-mid,ia=da<=0,iz=dz<=0;if(ia)n.push(a);if(ia!==iz){const t=da/(da-dz);n.push({x:a.x+(z.x-a.x)*t,y:a.y+(z.y-a.y)*t})}}p=n;if(!p.length)break}return p}
function centroid(poly){let x=0,y=0;for(const p of poly){x+=p.x;y+=p.y}return {x:x/poly.length,y:y/poly.length}}
function shape(poly,i,W,H){const c=centroid(poly),seed=(i+1)*97;return poly.map((p,k)=>{const dx=c.x-p.x,dy=c.y-p.y,dist=Math.hypot(dx,dy)||1;let q={x:p.x+dx/dist*7,y:p.y+dy/dist*7};const n1=Math.sin(seed+k*19.17),n2=Math.cos(seed*1.7+k*13.41);if(q.y<14)q.y+=8+Math.abs(n1)*13;if(q.y>H-14)q.y-=8+Math.abs(n2)*13;if(q.x<14)q.x+=6+Math.abs(n2)*10;if(q.x>W-14)q.x-=6+Math.abs(n1)*10;return q})}
function current(){const q=search.value.trim().toLocaleLowerCase("pl");return shuffled.filter(d=>activeTag==="Wszystko"||d.tag===activeTag).filter(d=>!q||d.title.toLocaleLowerCase("pl").includes(q)||d.tag.toLocaleLowerCase("pl").includes(q))}
function titleLines(title,max=18){const words=title.split(/\s+/),lines=[];let line="";for(const w of words){if((line+" "+w).trim().length>max&&line){lines.push(line);line=w}else line=(line+" "+w).trim()}if(line)lines.push(line);return lines.slice(0,3)}
function addText(g,s,poly){const c=centroid(poly),lines=titleLines(s.data.title,Math.max(14,Math.round((Math.sqrt(poly.reduce((a,p)=>a+(p.x-c.x)**2+(p.y-c.y)**2,0)/poly.length)||100)/13)));const title=document.createElementNS("http://www.w3.org/2000/svg","text");title.classList.add("shard-title");title.setAttribute("x",c.x);title.setAttribute("y",c.y-(lines.length-1)*9);lines.forEach((line,j)=>{const t=document.createElementNS("http://www.w3.org/2000/svg","tspan");t.setAttribute("x",c.x);t.setAttribute("dy",j===0?0:22);t.textContent=line;title.appendChild(t)});g.appendChild(title);const tag=document.createElementNS("http://www.w3.org/2000/svg","text");tag.classList.add("shard-tag");tag.setAttribute("x",c.x);tag.setAttribute("y",c.y+((lines.length-1)*11)+28);tag.textContent=s.data.tag;g.appendChild(tag)}
function build(){const H=Math.max(420,viewport.clientHeight||innerHeight-186),W=Math.max(viewport.clientWidth||innerWidth,1200),cur=current(),rows=5,tileW=Math.max(185,Math.min(230,W/6.5)),minCols=Math.max(1,Math.ceil(W/tileW)),fallback=cur.length>0&&cur.length<minCols*3;let worldW=W,sites=[];
if(fallback){const cols=Math.max(1,Math.ceil(Math.sqrt(cur.length*1.8))),cw=W/cols,rh=H/Math.max(1,Math.ceil(cur.length/cols));cur.forEach((d,i)=>{const c=i%cols,r=Math.floor(i/cols);sites.push({data:d,x:(c+.5)*cw+(Math.random()-.5)*cw*.3,y:(r+.5)*rh+(Math.random()-.5)*rh*.28})})}
else{let cols=Math.max(minCols,Math.ceil(cur.length/rows));if(cols>1&&(cur.length%rows===1||cur.length%rows===2))cols=Math.max(minCols,cols-1);worldW=Math.max(W,cols*tileW);const counts=Array(cols).fill(Math.floor(cur.length/cols));for(let i=0;i<cur.length%cols;i++)counts[i]++;let k=0;for(let c=0;c<cols;c++){const rh=H/Math.max(1,counts[c]);for(let r=0;r<counts[c];r++){const d=cur[k++];sites.push({data:d,x:(c+.5)*tileW+(Math.random()-.5)*tileW*.42,y:(r+.5)*rh+(Math.random()-.5)*rh*.34})}}}
board.style.width=worldW+"px";board.style.height=H+"px";board.innerHTML="";if(!cur.length)return;
const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("width",worldW);svg.setAttribute("height",H);svg.setAttribute("viewBox",`0 0 ${worldW} ${H}`);svg.classList.add("shatter");const defs=document.createElementNS("http://www.w3.org/2000/svg","defs");svg.appendChild(defs);
sites.forEach((s,i)=>{const raw=cell(s,sites,{x0:0,y0:0,x1:worldW,y1:H});if(raw.length<3)return;const poly=shape(raw,i,worldW,H);const cp=document.createElementNS("http://www.w3.org/2000/svg","clipPath"),id="clip"+i;cp.id=id;const cpPath=document.createElementNS("http://www.w3.org/2000/svg","path");cpPath.setAttribute("d",path(poly));cp.appendChild(cpPath);defs.appendChild(cp);const a=document.createElementNS("http://www.w3.org/2000/svg","a");a.classList.add("shard");a.setAttribute("href",s.data.link);a.setAttribute("tabindex","0");a.setAttribute("aria-label",s.data.title);const xs=poly.map(p=>p.x),ys=poly.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);const im=document.createElementNS("http://www.w3.org/2000/svg","image");im.setAttribute("x",minX);im.setAttribute("y",minY);im.setAttribute("width",maxX-minX);im.setAttribute("height",maxY-minY);im.setAttribute("preserveAspectRatio","xMidYMid slice");im.setAttribute("clip-path",`url(#${id})`);im.dataset.src=s.data.graphic;im.classList.add("shard-image");a.appendChild(im);const tint=document.createElementNS("http://www.w3.org/2000/svg","path");tint.setAttribute("d",path(poly));tint.classList.add("shard-tint");a.appendChild(tint);const g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("clip-path",`url(#${id})`);addText(g,s,poly);a.appendChild(g);svg.appendChild(a)});board.appendChild(svg);lazyLoadImages()}
function lazyLoadImages(){const imgs=board.querySelectorAll("image[data-src]");if(!imgs.length)return;const loadImage=im=>{const src=im.dataset.src;if(!src)return;im.setAttribute("href",src);delete im.dataset.src};if(!("IntersectionObserver" in window)){imgs.forEach(loadImage);return}const io=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){loadImage(entry.target);io.unobserve(entry.target)}}},{root:viewport,rootMargin:"500px 900px"});imgs.forEach(im=>io.observe(im))}
async function discoverCardFiles(){
  const dir="../Cards/";
  // Local HTTP servers (including Python's http.server) expose directory listings.
  try{
    const r=await fetch(dir,{cache:"no-store"});
    if(r.ok){
      const html=await r.text();
      const doc=new DOMParser().parseFromString(html,"text/html");
      const files=[...doc.querySelectorAll("a[href]")]
        .map(a=>decodeURIComponent(a.getAttribute("href")))
        .filter(h=>/\.txt$/i.test(h) && !h.includes("/"))
        .sort((a,b)=>a.localeCompare(b,"en",{numeric:true,sensitivity:"base"}));
      if(files.length)return files;
    }
  }catch(_){}

  // GitHub Pages does not generate directory listings. Discover the same folder
  // through the public GitHub Contents API, without hard-coding card filenames.
  const host=location.hostname;
  const path=location.pathname.split("/").filter(Boolean);
  let owner=null,repo=null,base=[];
  if(host.endsWith(".github.io")){
    owner=host.slice(0,-".github.io".length);
    if(path.length && path[0].toLowerCase()!==owner.toLowerCase()){
      repo=path[0]; base=path.slice(1);
    }else{ repo=owner; base=path; }
  }
  if(owner&&repo){
    const apiPath=[...base,"Home","Cards"].join("/");
    for(const branch of ["main","master"]){
      try{
        const u=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${apiPath}?ref=${branch}`;
        const r=await fetch(u,{headers:{Accept:"application/vnd.github+json"},cache:"no-store"});
        if(!r.ok)continue;
        const items=await r.json();
        const files=items.filter(x=>x.type==="file"&&/\.txt$/i.test(x.name)).map(x=>x.name).sort((a,b)=>a.localeCompare(b,"en",{numeric:true,sensitivity:"base"}));
        if(files.length)return files;
      }catch(_){}
    }
  }
  throw Error("Nie znaleziono plików TXT w Home/Cards/. Na GitHub Pages sprawdź, czy repozytorium jest publiczne.");
}

async function load(){
  const files=await discoverCardFiles();
  const parsed=await Promise.all(files.map(async file=>{
    const r=await fetch("../Cards/"+encodeURIComponent(file),{cache:"no-cache"});
    if(!r.ok)throw Error("Home/Cards/"+file+" ("+r.status+")");
    const lines=(await r.text()).replace(/^\uFEFF/,"").split(/\r?\n/).map(x=>x.trim());
    if(lines.length<4)throw Error("Nieprawidłowy plik: "+file);
    const [title,tag,graphic,link]=lines;
    return {title,tag,graphic,link};
  }));
  records=parsed;
  shuffled=shuffle([...records]);
  build();
}
function setup(){filters.innerHTML="";FILTERS.forEach(([label,tag],i)=>{const b=document.createElement("button");b.className="filter"+(i===0?" active":"");b.dataset.tag=tag;b.textContent=label;filters.appendChild(b)});filters.onclick=e=>{const b=e.target.closest(".filter");if(!b)return;activeTag=b.dataset.tag;filters.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));build()};search.addEventListener("input",build);shuffleBtn.addEventListener("click",()=>{shuffled=shuffle([...records]);build()})}
viewport.addEventListener("wheel",e=>{const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(d){e.preventDefault();viewport.scrollLeft+=d*2.5}},{passive:false});
viewport.addEventListener("pointerdown",e=>{if(e.button!==0)return;cancelAnimationFrame(momentum);drag={active:true,startX:e.clientX,lastX:e.clientX,lastTime:performance.now(),velocity:0,moved:false};viewport.style.cursor="grabbing";viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener("pointermove",e=>{if(!drag.active)return;const now=performance.now(),dx=e.clientX-drag.lastX,dt=Math.max(1,now-drag.lastTime);viewport.scrollLeft-=dx;drag.velocity=(-dx/dt)*16;if(Math.abs(e.clientX-drag.startX)>8)drag.moved=true;drag.lastX=e.clientX;drag.lastTime=now});
function release(e){if(!drag.active)return;drag.active=false;viewport.style.cursor="grab";try{viewport.releasePointerCapture(e.pointerId)}catch(_){}let v=drag.velocity;const tick=()=>{viewport.scrollLeft+=v;v*=.94;if(Math.abs(v)>.15)momentum=requestAnimationFrame(tick)};if(Math.abs(v)>.15)momentum=requestAnimationFrame(tick);setTimeout(()=>drag.moved=false,100)}
viewport.addEventListener("pointerup",release);viewport.addEventListener("pointercancel",release);addEventListener("resize",build);setup();load().catch(e=>{console.error(e);board.innerHTML='<div class="load-error">Nie udało się wczytać kart. Sprawdź, czy pliki TXT znajdują się w Home/Cards/.</div>'});
})();
