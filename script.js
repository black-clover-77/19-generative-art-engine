const audio=document.getElementById('bg-audio'),at=document.getElementById('audio-toggle');
let ap=false;document.addEventListener('click',()=>{if(!ap){audio.play().catch(()=>{});ap=true;at.textContent='🔊'}},{once:true});
at.addEventListener('click',e=>{e.stopPropagation();ap?(audio.pause(),at.textContent='🔇'):(audio.play(),at.textContent='🔊');ap=!ap});
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('hidden'),800));

const c=document.getElementById('artCanvas'),ctx=c.getContext('2d');
c.width=window.innerWidth;c.height=window.innerHeight;
ctx.fillStyle='#0a0a0f';ctx.fillRect(0,0,c.width,c.height);

let mode='flow',color='#00ffcc',drawing=false,lastX=0,lastY=0,angle=0,heroFaded=false;
const noiseScale=0.005;

function simplex(x,y){return Math.sin(x*12.9898+y*78.233)*43758.5453%1}

document.querySelectorAll('.tool-btn[data-mode]').forEach(b=>{
  b.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.tool-btn[data-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode})
});
document.querySelectorAll('.color-dot').forEach(d=>{
  d.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.color-dot').forEach(x=>x.classList.remove('active'));d.classList.add('active');color=d.dataset.color})
});
document.getElementById('clearBtn').addEventListener('click',e=>{e.stopPropagation();ctx.fillStyle='#0a0a0f';ctx.fillRect(0,0,c.width,c.height)});
document.getElementById('saveBtn').addEventListener('click',e=>{e.stopPropagation();const a=document.createElement('a');a.download='art.png';a.href=c.toDataURL();a.click()});

function fadeHero(){if(!heroFaded){heroFaded=true;document.getElementById('hero-text').classList.add('fade')}}

function drawFlow(x,y){
  fadeHero();
  for(let i=0;i<15;i++){
    const a=simplex(x*noiseScale,y*noiseScale)*Math.PI*4;
    const nx=x+Math.cos(a)*3;const ny=y+Math.sin(a)*3;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);
    ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.globalAlpha=0.6;ctx.stroke();
    ctx.globalAlpha=1;x=nx;y=ny;
  }
}
function drawSplatter(x,y){
  fadeHero();
  for(let i=0;i<20;i++){
    const r=Math.random()*40;const a=Math.random()*Math.PI*2;
    const sx=x+Math.cos(a)*r;const sy=y+Math.sin(a)*r;
    ctx.beginPath();ctx.arc(sx,sy,Math.random()*4+1,0,Math.PI*2);
    ctx.fillStyle=color;ctx.globalAlpha=Math.random()*0.7+0.3;ctx.fill();ctx.globalAlpha=1;
  }
}
function drawSpiral(x,y){
  fadeHero();angle+=0.3;
  for(let i=0;i<30;i++){
    const a=angle+i*0.2;const r=i*2;
    const sx=x+Math.cos(a)*r;const sy=y+Math.sin(a)*r;
    ctx.beginPath();ctx.arc(sx,sy,2,0,Math.PI*2);
    ctx.fillStyle=color;ctx.globalAlpha=1-i/30;ctx.fill();ctx.globalAlpha=1;
  }
}
function drawTree(x,y,len,a,depth){
  if(depth<=0||len<2)return;
  const ex=x+Math.cos(a)*len;const ey=y+Math.sin(a)*len;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);
  ctx.strokeStyle=color;ctx.lineWidth=depth*0.8;ctx.globalAlpha=0.8;ctx.stroke();ctx.globalAlpha=1;
  drawTree(ex,ey,len*0.67,a-0.5,depth-1);
  drawTree(ex,ey,len*0.67,a+0.5,depth-1);
}

function handleDraw(x,y){
  if(mode==='flow')drawFlow(x,y);
  else if(mode==='splatter')drawSplatter(x,y);
  else if(mode==='spiral')drawSpiral(x,y);
  else if(mode==='tree'){drawTree(x,y,60,-Math.PI/2,8);drawing=false;}
}

c.addEventListener('mousedown',e=>{drawing=true;lastX=e.clientX;lastY=e.clientY;handleDraw(e.clientX,e.clientY)});
c.addEventListener('mousemove',e=>{if(!drawing)return;handleDraw(e.clientX,e.clientY);lastX=e.clientX;lastY=e.clientY});
c.addEventListener('mouseup',()=>drawing=false);
c.addEventListener('touchstart',e=>{e.preventDefault();drawing=true;const t=e.touches[0];handleDraw(t.clientX,t.clientY)},{passive:false});
c.addEventListener('touchmove',e=>{e.preventDefault();if(!drawing)return;const t=e.touches[0];handleDraw(t.clientX,t.clientY)},{passive:false});
c.addEventListener('touchend',()=>drawing=false);
window.addEventListener('resize',()=>{const img=ctx.getImageData(0,0,c.width,c.height);c.width=innerWidth;c.height=innerHeight;ctx.putImageData(img,0,0)});