const canvas=document.getElementById("canvas");
const viewport=document.getElementById("viewport");
const search=document.getElementById("search");
const filters=document.getElementById("filters");
let active="All", panX=0, down=false, startX=0, startPan=0, current=[];
let shuffledData=[];

function imageFor(d,i){ return d[3] || ""; }
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function clip(poly,A,B,C){
  const out=[]; if(!poly.length)return out;
  const inside=p=>A*p.x+B*p.y<=C+1e-7;
  const intersection=(p,q)=>{const dp=A*p.x+B*p.y-C,dq=A*q.x+B*q.y-C,t=dp/(dp-dq);return{x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t};};
  for(let i=0;i<poly.length;i++){
    const p=poly[i],q=poly[(i+1)%poly.length],ip=inside(p),iq=inside(q);
    if(ip&&iq)out.push(q); else if(ip&&!iq)out.push(intersection(p,q)); else if(!ip&&iq){out.push(intersection(p,q));out.push(q);}
  }
  return out;
}
function voronoiCell(sites,i,W,H){
  const s=sites[i]; let poly=[{x:0,y:0},{x:W,y:0},{x:W,y:H},{x:0,y:H}];
  for(let j=0;j<sites.length;j++){
    if(i===j)continue; const q=sites[j];
    poly=clip(poly,2*(q.x-s.x),2*(q.y-s.y),q.x*q.x+q.y*q.y-s.x*s.x-s.y*s.y);
    if(!poly.length)break;
  }
  return poly;
}
function pts(poly){return poly.map(p=>p.x.toFixed(2)+","+p.y.toFixed(2)).join(" ");}
function hash(n){const x=Math.sin(n*999.17)*43758.5453;return x-Math.floor(x);}

function build(){
  const q=search.value.trim().toLowerCase();
  current=shuffledData.map((d,i)=>({...d,i})).filter(d=>(active==="All"||d[1]===active)).filter(d=>!q||d[0].toLowerCase().includes(q)||d[1].toLowerCase().includes(q));
  const H=Math.max(420,viewport.clientHeight||window.innerHeight-157);
  const W=Math.max(viewport.clientWidth||window.innerWidth,1200);
  // The panorama grows with the amount of content. There is no fixed
  // maximum width: every item gets a real horizontal slot.
  const rows=5;
  // Keep the panorama substantially wider than even an ultrawide display.
  // Content is distributed across the full horizontal canvas so there is always
  // meaningful artwork to discover by scrolling, rather than an empty tail.
  const tileW=Math.max(185, Math.min(230, W/6.5));
  // Choose the number of columns from the amount of content, but never leave
  // a skinny final column with only one or two shards. For example, 31 items
  // become 7 columns of 4/4/4/4/4/4/7? Instead we distribute the items so
  // every populated column contains at least three shards.
  const n=current.length;

  // Small result sets get a deliberate fallback grid. Instead of squeezing
  // two or three search results into tiny shards, use the available viewport
  // as a large composition: 1-3 results become one row, 4-8 become balanced
  // two-row grids, and 9-12 use a compact three-row grid. The Voronoi cells
  // still give the grid its shattered look, but every result gets substantial
  // visual real estate.
  const minColsForViewport=Math.max(1,Math.ceil(W/tileW));
  // If there are not enough results to give every horizontal column a
  // healthy population, keep using the viewport-filling fallback instead of
  // producing a short panorama that occupies only part of the screen.
  const fallback=n>0 && n<minColsForViewport*3;
  let cols, gridRows, worldW;
  if(fallback){
    // For small result sets, treat the current viewport as the composition
    // itself. Choose a near-square-ish matrix based on the viewport aspect
    // ratio, then place results row-by-row so the whole view is populated
    // before we ever extend the panorama horizontally.
    const aspect=Math.max(1.15,W/Math.max(1,H));
    gridRows=Math.max(1,Math.min(5,Math.ceil(Math.sqrt(n/aspect))));
    cols=Math.max(1,Math.ceil(n/gridRows));
    // Prefer a fuller final row rather than a nearly empty one.
    while(gridRows>1 && (n-(gridRows-1)*cols)<=0) gridRows--;
    worldW=Math.max(W, viewport.clientWidth||W);
  }else{
    cols=Math.max(1,Math.ceil(n/rows));
    if(cols>1){
      const remainder=n%rows;
      if(remainder===1 || remainder===2) cols=Math.max(1,cols-1);
    }
    cols=Math.max(cols,Math.ceil(W/tileW));
    worldW=cols*tileW;
    gridRows=rows;
  }

  const sites=[];
  if(fallback){
    // Row-major placement: fill the visible composition from left to right,
    // then move to the next row. The last row may have fewer tiles, but it is
    // still spread across the full viewport instead of creating a skinny tail.
    const rows=[];
    let remaining=n;
    for(let row=0;row<gridRows;row++){
      const left=gridRows-row;
      const count=Math.ceil(remaining/left);
      rows.push(count);
      remaining-=count;
    }
    let idx=0;
    for(let row=0;row<gridRows;row++){
      const count=rows[row];
      const cellW=worldW/count;
      const cellH=H/gridRows;
      for(let col=0;col<count;col++){
        const i=idx++;
        const baseX=(col+.5)*cellW;
        const baseY=(row+.5)*cellH;
        // Small result sets should still feel genuinely shattered rather than
        // like a regular card grid. Push the Voronoi sites substantially off
        // their cell centers, with different horizontal/vertical movement per
        // shard. The cells remain mathematically gap-free, but their boundaries
        // become much more asymmetric and irregular.
        const jx=Math.min(cellW*.30,Math.max(18,cellW*.13));
        const jy=Math.min(cellH*.30,Math.max(16,cellH*.13));
        const stagger=(row%2===0?1:-1)*cellW*.055;
        const x=baseX+(hash(i+2)-.5)*jx+stagger;
        const y=baseY+(hash(i+91)-.5)*jy+(hash(i+191)-.5)*cellH*.06;
        sites.push({x:Math.max(8,Math.min(worldW-8,x)),y:Math.max(8,Math.min(H-8,y))});
      }
    }
  }else{
    const cw=tileW;
    const counts=Array(cols).fill(Math.floor(n/cols));
    for(let i=0;i<n%cols;i++) counts[i]++;
    let idx=0;
    for(let col=0;col<cols;col++){
      for(let row=0;row<counts[col];row++){
        const i=idx++;
        const baseX=(col+.5)*cw;
        const rowH=H/counts[col];
        const baseY=(row+.5)*rowH;
        sites.push({x:Math.max(25,Math.min(worldW-25,baseX+(hash(i+2)-.5)*cw*.48)),y:Math.max(25,Math.min(H-25,baseY+(hash(i+91)-.5)*rowH*.42))});
      }
    }
  }
  canvas.innerHTML="";
  if(!n){
    canvas.style.width=Math.max(viewport.clientWidth||W,1)+"px";
    canvas.style.height=H+"px";
    const empty=document.createElement("div");
    empty.style.cssText="height:100%;display:grid;place-items:center;padding:40px;text-align:center;color:#9b7897;font-weight:900;font-size:14px;";
    empty.textContent="No content matches that search.";
    canvas.appendChild(empty);
    return;
  }
  canvas.style.width=worldW+"px"; canvas.style.height=H+"px";
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("width",worldW); svg.setAttribute("height",H); svg.setAttribute("viewBox",`0 0 ${worldW} ${H}`);
  svg.setAttribute("preserveAspectRatio","none");
  svg.style.display="block"; svg.style.width=worldW+"px"; svg.style.height=H+"px"; svg.style.userSelect="none"; svg.style.webkitUserSelect="none";
  const defs=document.createElementNS("http://www.w3.org/2000/svg","defs"); svg.appendChild(defs);
  current.forEach((d,i)=>{
    const poly=voronoiCell(sites,i,worldW,H); if(poly.length<3)return;
    const id="clip"+i;
    const cp=document.createElementNS("http://www.w3.org/2000/svg","clipPath"); cp.id=id;
    const cpPoly=document.createElementNS("http://www.w3.org/2000/svg","polygon"); cpPoly.setAttribute("points",pts(poly)); cp.appendChild(cpPoly); defs.appendChild(cp);
    const g=document.createElementNS("http://www.w3.org/2000/svg","g"); g.setAttribute("clip-path",`url(#${id})`); g.style.cursor="pointer"; g.setAttribute("role","button"); g.setAttribute("tabindex","0"); g.setAttribute("aria-label",d[0]);
    const bg=document.createElementNS("http://www.w3.org/2000/svg","polygon"); bg.setAttribute("points",pts(poly)); bg.setAttribute("fill",`hsl(${(i*17)%360} 8% ${34+(i%4)*8}%)`); g.appendChild(bg);
    // Size the artwork to THIS shard's bounding box, then clip it to the shard.
    // This prevents a small shard from showing a giant, zoomed image.
    const bb=poly.reduce((a,p)=>({minX:Math.min(a.minX,p.x),maxX:Math.max(a.maxX,p.x),minY:Math.min(a.minY,p.y),maxY:Math.max(a.maxY,p.y)}),{minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity});
    const img=document.createElementNS("http://www.w3.org/2000/svg","image");
    img.setAttribute("x",bb.minX);img.setAttribute("y",bb.minY);img.setAttribute("width",Math.max(1,bb.maxX-bb.minX));img.setAttribute("height",Math.max(1,bb.maxY-bb.minY));
    img.setAttribute("preserveAspectRatio","xMidYMid slice");img.setAttribute("href",imageFor(d,d.i));img.setAttribute("opacity",".96");g.appendChild(img);
    const outline=document.createElementNS("http://www.w3.org/2000/svg","polygon"); outline.setAttribute("points",pts(poly));outline.setAttribute("fill","none");outline.setAttribute("stroke","white");outline.setAttribute("stroke-width","5");outline.setAttribute("vector-effect","non-scaling-stroke");g.appendChild(outline);
    const centroid=poly.reduce((a,p)=>({x:a.x+p.x/poly.length,y:a.y+p.y/poly.length}),{x:0,y:0});
    // Find the actual horizontal room available inside the polygon at a given y.
    function spanAt(y){
      const xs=[];
      for(let k=0;k<poly.length;k++){
        const a=poly[k],b=poly[(k+1)%poly.length];
        if((a.y<=y&&b.y>y)||(b.y<=y&&a.y>y)){
          const t=(y-a.y)/(b.y-a.y); xs.push(a.x+(b.x-a.x)*t);
        }
      }
      if(xs.length<2)return 0;
      xs.sort((a,b)=>a-b); return xs[xs.length-1]-xs[0];
    }
    const label=document.createElementNS("http://www.w3.org/2000/svg","text");
    label.setAttribute("text-anchor","middle");
    label.setAttribute("font-family","Trebuchet MS,Segoe UI,sans-serif");
    label.setAttribute("font-weight","900");
    label.setAttribute("fill","#fff");
    label.setAttribute("paint-order","stroke");
    label.setAttribute("stroke","#24142d");
    label.setAttribute("stroke-width","3.5");
    label.setAttribute("stroke-linejoin","round");
    // Build short lines, then force each line's rendered width to fit the polygon.
    const words=d[0].split(/\s+/);
    const baseSize=Math.max(10,Math.min(18,(bb.maxX-bb.minX)/16,(bb.maxY-bb.minY)/5.2));
    const maxLineChars=Math.max(7,Math.floor((bb.maxX-bb.minX)/(baseSize*.58)));
    let line="",lines=[];
    words.forEach(w=>{const test=line?line+" "+w:w;if(test.length>maxLineChars&&line){lines.push(line);line=w}else line=test});
    if(line)lines.push(line);
    // If necessary, use more lines rather than ever allowing text outside the shard.
    if(lines.length>3){
      lines=[]; line="";
      words.forEach(w=>{const test=line?line+" "+w:w;if(test.length>Math.max(5,Math.floor(maxLineChars*.78))&&line){lines.push(line);line=w}else line=test});
      if(line)lines.push(line);
    }
    lines=lines.slice(0,4);
    const lineH=baseSize*1.05;
    const totalH=lineH*lines.length;
    // Center the complete title block in the shard instead of anchoring it
    // to the bottom of the bounding box. The SVG clip-path still guarantees
    // that no glyph can escape the actual irregular shard.
    let startY=centroid.y-(totalH/2)+lineH*0.82;
    startY=Math.max(bb.minY+baseSize,startY);
    startY=Math.min(startY,bb.maxY-totalH+baseSize);
    label.setAttribute("font-size",baseSize);
    lines.forEach((ln,k)=>{
      const y=startY+k*lineH;
      const avail=Math.max(20,spanAt(y)-14);
      const t=document.createElementNS("http://www.w3.org/2000/svg","tspan");
      t.setAttribute("x",centroid.x);
      t.setAttribute("y",y);
      const natural=Math.max(1,ln.length*baseSize*.58);
      if(natural>avail){t.setAttribute("textLength",avail);t.setAttribute("lengthAdjust","spacingAndGlyphs");}
      t.textContent=ln; label.appendChild(t);
    });
    g.appendChild(label);

    // Every shard is a real, independently addressable link. The destination
    // can be replaced later with the actual subpage URL without changing the
    // tessellation or interaction code.
    const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    const tileHref=d[4] || ("subpages/"+slugify(d[0])+".html");
    const anchor=document.createElementNS("http://www.w3.org/2000/svg","a");
    anchor.setAttribute("class","shard-link");
    anchor.setAttribute("href",tileHref);
    anchor.setAttribute("aria-label","Open "+d[0]);
    anchor.setAttribute("tabindex","0");
    anchor.appendChild(g);

    // Preserve drag-to-pan: a drag should not accidentally activate the link.
    g.addEventListener("pointerdown",e=>{g._downX=e.clientX;});
    anchor.addEventListener("click",e=>{
      e.stopPropagation();
      if(Math.abs(e.clientX-(g._downX||e.clientX))>6) e.preventDefault();
    });
    svg.appendChild(anchor);
  });
  canvas.appendChild(svg);
  panX=Math.max(-Math.max(0,worldW-viewport.clientWidth),Math.min(0,panX));
  canvas.style.transform=`translate3d(${panX}px,0,0)`;
}
async function loadContent(){
  try{
    const manifestResponse=await fetch("V/index.json",{cache:"no-cache"});
    if(!manifestResponse.ok) throw new Error("V/index.json could not be loaded");
    const files=await manifestResponse.json();
    const records=[];
    for(const file of files){
      const response=await fetch("V/"+file,{cache:"no-cache"});
      if(!response.ok){ console.warn("Could not load",file); continue; }
      const lines=(await response.text()).replace(/\r/g,"").split("\n").map(x=>x.trim());
      if(lines.length<4 || !lines[0]){ console.warn("Invalid tile file",file); continue; }
      // [title, tag, tag-compatible field, graphic, destination]
      records.push([lines[0],lines[1]||"",lines[1]||"",lines[2]||"",lines[3]||"",file]);
    }
    shuffledData=records;
    build();
  }catch(err){
    console.error(err);
    canvas.innerHTML='<div class="load-error">Unable to load content from V/.</div>';
  }
}

shuffle.addEventListener("click",()=>{
  for(let i=shuffledData.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffledData[i],shuffledData[j]]=[shuffledData[j],shuffledData[i]];}
  panX=0;
  build();
});
filters.addEventListener("click",e=>{const b=e.target.closest(".filter");if(!b)return;active=b.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));panX=0;build();});
search.addEventListener("input",()=>{panX=0;build();});
viewport.addEventListener("pointerdown",e=>{if(e.button!==0)return;down=true;startX=e.clientX;startPan=panX;viewport.classList.add("dragging");viewport.setPointerCapture(e.pointerId);});
viewport.addEventListener("pointermove",e=>{if(!down)return;const max=Math.max(0,canvas.offsetWidth-viewport.clientWidth);panX=Math.max(-max,Math.min(0,startPan+e.clientX-startX));canvas.style.transform=`translate3d(${panX}px,0,0)`;});
function release(e){down=false;viewport.classList.remove("dragging");try{viewport.releasePointerCapture(e.pointerId)}catch(_){} }
viewport.addEventListener("pointerup",release);viewport.addEventListener("pointercancel",release);
viewport.addEventListener("wheel",e=>{const max=Math.max(0,canvas.offsetWidth-viewport.clientWidth);panX=Math.max(-max,Math.min(0,panX+(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)));canvas.style.transform=`translate3d(${panX}px,0,0)`;e.preventDefault();},{passive:false});
window.addEventListener("resize",()=>{panX=0;build();});
build();
loadContent();
