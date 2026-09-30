import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const root = document.getElementById('app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x162633);
scene.fog = new THREE.Fog(0x162633, 90, 230);

const camera = new THREE.PerspectiveCamera(58, innerWidth/innerHeight, .1, 500);
const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
root.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x90b9d0, 0x263425, 1.8));
const sun = new THREE.DirectionalLight(0xffd1a6, 2.2);
sun.position.set(-45,70,20);
sun.castShadow=true;
scene.add(sun);

const mat=(c,rough=1)=>new THREE.MeshStandardMaterial({color:c,roughness:rough});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(260,240), mat(0x26352c));
ground.rotation.x=-Math.PI/2;
ground.receiveShadow=true;
scene.add(ground);

// Rajang river
const river = new THREE.Mesh(
  new THREE.PlaneGeometry(260,46),
  new THREE.MeshStandardMaterial({color:0x315669,roughness:.35,metalness:.05})
);
river.rotation.x=-Math.PI/2;
river.position.z=-82;
river.position.y=.04;
scene.add(river);

// Roads
function road(x,z,w,d,rot=0){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,.08,d),mat(0x30343a));
  m.position.set(x,.05,z);
  m.rotation.y=rot;
  m.receiveShadow=true;
  scene.add(m);
  return m;
}
road(0,0,190,17);
road(-35,0,15,155);
road(35,8,14,138);
road(78,-15,13,120);
road(-78,5,12,130);
road(5,-50,190,13);

for(let x=-85;x<90;x+=12){
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(5,.03,.22),mat(0xc9b978));
  stripe.position.set(x,.11,0);
  scene.add(stripe);
}

function building(x,z,w,d,h,color=0x9e988d){
  const g=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,.85));
  g.position.set(x,h/2,z);
  g.castShadow=true;
  g.receiveShadow=true;
  scene.add(g);
  for(let y=2;y<h-1;y+=3){
    for(let xx=-w/2+2;xx<w/2-1;xx+=3){
      const win=new THREE.Mesh(
        new THREE.PlaneGeometry(1.2,1.2),
        new THREE.MeshBasicMaterial({color:0xcbd5d8,transparent:true,opacity:.55})
      );
      win.position.set(x+xx,y,z+d/2+.01);
      scene.add(win);
    }
  }
  return g;
}

// City blocks
const blocks=[
  [-62,28,22,22,10,0xb49b86],[-17,28,20,22,17,0xa8a7a0],
  [17,29,22,21,12,0xb99878],[60,30,24,20,15,0x8f9aa3],
  [-60,-26,20,20,13,0x9b8d80],[-15,-28,18,20,10,0xbca17d],
  [18,-29,21,19,18,0x89959c],[61,-31,24,21,11,0xb3997d],
  [-92,25,13,24,9,0xa79883],[-93,-29,13,22,12,0x89959e],
  [97,24,19,22,14,0xa49382]
];
blocks.forEach(b=>building(...b));

// Wisma Sanyan-inspired tower
building(92,-7,20,20,48,0x4e5f69);

// Central Market
const market = new THREE.Group();
const marketBase = new THREE.Mesh(new THREE.BoxGeometry(35,8,19),mat(0xd3c6aa));
marketBase.position.y=4;
market.add(marketBase);
const arch = new THREE.Mesh(new THREE.CylinderGeometry(18,18,7,32,1,false,0,Math.PI),mat(0x71808a));
arch.rotation.z=Math.PI/2;
arch.rotation.y=Math.PI/2;
arch.position.y=8;
market.add(arch);
market.position.set(-28,.1,-56);
scene.add(market);

// Sibu Gateway-inspired pavilion
const gateway = new THREE.Group();
for(let i=0;i<8;i++){
  const a=i/8*Math.PI*2;
  const p=new THREE.Mesh(new THREE.CylinderGeometry(.45,.55,5,8),mat(0xe9e1d2));
  p.position.set(Math.cos(a)*7,2.5,Math.sin(a)*7);
  gateway.add(p);
}
const roof=new THREE.Mesh(new THREE.CylinderGeometry(8.2,9,1,32),mat(0xd2d2c7));
roof.position.y=5.3;
gateway.add(roof);
gateway.position.set(37,.1,55);
scene.add(gateway);

// Tua Pek Kong-inspired pagoda
const pagoda=new THREE.Group();
for(let i=0;i<6;i++){
  const y=i*2.5;
  const body=new THREE.Mesh(new THREE.CylinderGeometry(2.1-i*.14,2.4-i*.13,2,8),mat(0xc3533e));
  body.position.y=y+1;
  pagoda.add(body);
  const roof2=new THREE.Mesh(new THREE.CylinderGeometry(3.2-i*.2,2.7-i*.17,.55,8),mat(0xd6aa4c));
  roof2.position.y=y+2;
  pagoda.add(roof2);
}
pagoda.scale.set(.8,.8,.8);
pagoda.position.set(-63,.05,-63);
scene.add(pagoda);

// Swan marker
const swanBase=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.4,1,20),mat(0x5d696e));
swanBase.position.set(4,.5,-60);
scene.add(swanBase);
const swan=new THREE.Mesh(new THREE.TorusGeometry(1.5,.45,10,24,Math.PI*1.2),mat(0xf2f4f1));
swan.position.set(4,2.1,-60);
swan.rotation.z=.8;
scene.add(swan);

// Trees
for(let i=0;i<54;i++){
  const x=(Math.random()-.5)*210;
  const z=(Math.random()-.5)*145;
  if(Math.abs(z)<13||Math.abs(x+35)<10||Math.abs(x-35)<10||Math.abs(z+50)<9)continue;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,2.8,7),mat(0x5b4231));
  trunk.position.set(x,1.4,z);
  scene.add(trunk);
  const crown=new THREE.Mesh(new THREE.SphereGeometry(1.4,8,6),mat(0x28513c));
  crown.position.set(x,3.5,z);
  scene.add(crown);
}

// Player car
const car=new THREE.Group();
const body=new THREE.Mesh(new THREE.BoxGeometry(3.2,1.15,5.3),mat(0x7a1520,.55));
body.position.y=1;
body.castShadow=true;
car.add(body);

const cabin=new THREE.Mesh(
  new THREE.BoxGeometry(2.6,1.15,2.5),
  new THREE.MeshStandardMaterial({color:0x9eb4bd,metalness:.1,roughness:.28,transparent:true,opacity:.85})
);
cabin.position.set(0,1.85,-.25);
car.add(cabin);

for(const sx of [-1,1]){
  for(const sz of [-1.7,1.7]){
    const wh=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.42,14),mat(0x111111));
    wh.rotation.z=Math.PI/2;
    wh.position.set(sx*1.45,.55,sz);
    car.add(wh);
  }
}
car.position.set(-75,.05,42);
scene.add(car);

// Mission markers
const waypoint = new THREE.Mesh(
  new THREE.CylinderGeometry(2.4,2.4,.2,32),
  new THREE.MeshBasicMaterial({color:0xffd65a,transparent:true,opacity:.75})
);
waypoint.position.set(-28,.15,-45);
scene.add(waypoint);

const beacon = new THREE.Mesh(
  new THREE.CylinderGeometry(.05,1.4,12,20,1,true),
  new THREE.MeshBasicMaterial({color:0xffdc72,transparent:true,opacity:.16,side:THREE.DoubleSide})
);
beacon.position.set(-28,6,-45);
scene.add(beacon);

const missions=[
  {title:'Tapao kampua.',sub:'Drive to Central Market.',x:-28,z:-45,reward:5},
  {title:'Kampua secured.',sub:'Deliver it to Sibu Waterfront.',x:5,z:-57,reward:8},
  {title:'Friend waiting.',sub:'Meet them at Sibu Gateway.',x:37,z:48,reward:10},
  {title:'Free roam unlocked.',sub:'Explore Swan City. Try the riverfront.',x:-63,z:-58,reward:15},
];

let mission=0;
let cash=12;

function setMission(){
  const m=missions[mission];
  document.getElementById('missionTitle').textContent=m.title;
  document.getElementById('missionSub').textContent=m.sub;
  waypoint.position.set(m.x,.15,m.z);
  beacon.position.set(m.x,6,m.z);
}
setMission();

const keys={up:false,down:false,left:false,right:false,boost:false,brake:false};
const joystick={x:0,y:0,active:false,pointerId:null};
let cameraYaw=0;
let cameraPitch=0;
let cameraTouch=null;
let missionCooldown=0;
let freeRoamComplete=false;

addEventListener('keydown',e=>{
  if(['w','ArrowUp'].includes(e.key))keys.up=true;
  if(['s','ArrowDown'].includes(e.key))keys.down=true;
  if(['a','ArrowLeft'].includes(e.key))keys.left=true;
  if(['d','ArrowRight'].includes(e.key))keys.right=true;
  if(e.key==='Shift')keys.boost=true;
  if(e.key===' ')keys.brake=true;
  if(e.key.toLowerCase()==='r') resetCar();
});

addEventListener('keyup',e=>{
  if(['w','ArrowUp'].includes(e.key))keys.up=false;
  if(['s','ArrowDown'].includes(e.key))keys.down=false;
  if(['a','ArrowLeft'].includes(e.key))keys.left=false;
  if(['d','ArrowRight'].includes(e.key))keys.right=false;
  if(e.key==='Shift')keys.boost=false;
  if(e.key===' ')keys.brake=false;
});

function resetCar(){
  car.position.set(-75,.05,42);
  car.rotation.y=0;
  speed=0;
  cameraYaw=0;
  cameraPitch=0;
}

const joyWrap=document.getElementById('joystickWrap');
const joyKnob=document.getElementById('joystickKnob');

function setJoy(clientX,clientY){
  const r=joyWrap.getBoundingClientRect();
  const cx=r.left+r.width/2;
  const cy=r.top+r.height/2;
  const max=r.width*.31;
  let dx=clientX-cx;
  let dy=clientY-cy;
  const d=Math.hypot(dx,dy)||1;
  if(d>max){
    dx=dx/d*max;
    dy=dy/d*max;
  }
  joystick.x=dx/max;
  joystick.y=dy/max;
  joyKnob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
}

joyWrap.addEventListener('pointerdown',e=>{
  e.preventDefault();
  joystick.active=true;
  joystick.pointerId=e.pointerId;
  joyWrap.setPointerCapture?.(e.pointerId);
  setJoy(e.clientX,e.clientY);
});

joyWrap.addEventListener('pointermove',e=>{
  if(joystick.active&&e.pointerId===joystick.pointerId){
    e.preventDefault();
    setJoy(e.clientX,e.clientY);
  }
});

function releaseJoy(e){
  if(!joystick.active || (e&&e.pointerId!==joystick.pointerId))return;
  joystick.active=false;
  joystick.pointerId=null;
  joystick.x=0;
  joystick.y=0;
  joyKnob.style.transform='translate(-50%,-50%)';
}
joyWrap.addEventListener('pointerup',releaseJoy);
joyWrap.addEventListener('pointercancel',releaseJoy);

function holdButton(el,key){
  const on=e=>{
    e.preventDefault();
    keys[key]=true;
    el.classList.add('pressed');
    el.setPointerCapture?.(e.pointerId);
  };
  const off=e=>{
    e.preventDefault();
    keys[key]=false;
    el.classList.remove('pressed');
  };
  el.addEventListener('pointerdown',on);
  el.addEventListener('pointerup',off);
  el.addEventListener('pointercancel',off);
  el.addEventListener('pointerleave',e=>{if(e.buttons===0)off(e)});
}

holdButton(document.getElementById('boostBtn'),'boost');
holdButton(document.getElementById('brakeBtn'),'brake');

document.getElementById('actionBtn').addEventListener('pointerdown',e=>{
  e.preventDefault();
  showToast('BEEP BEEP · SIBU CITY');
});

document.getElementById('cameraBtn').addEventListener('pointerdown',e=>{
  e.preventDefault();
  cameraYaw=0;
  cameraPitch=0;
  showToast('CAMERA RESET');
});

const cameraZone=document.getElementById('cameraZone');
cameraZone.addEventListener('pointerdown',e=>{
  cameraTouch={id:e.pointerId,x:e.clientX,y:e.clientY};
  cameraZone.setPointerCapture?.(e.pointerId);
});
cameraZone.addEventListener('pointermove',e=>{
  if(!cameraTouch||cameraTouch.id!==e.pointerId)return;
  const dx=e.clientX-cameraTouch.x;
  const dy=e.clientY-cameraTouch.y;
  cameraTouch.x=e.clientX;
  cameraTouch.y=e.clientY;
  cameraYaw=THREE.MathUtils.clamp(cameraYaw-dx*.007,-1.15,1.15);
  cameraPitch=THREE.MathUtils.clamp(cameraPitch+dy*.004,-.18,.38);
});
cameraZone.addEventListener('pointerup',e=>{
  if(cameraTouch?.id===e.pointerId)cameraTouch=null;
});
cameraZone.addEventListener('pointercancel',()=>cameraTouch=null);

let speed=0;
let last=performance.now();
let elapsed=0;

const toast=document.getElementById('toast');
let toastTimer=null;
function showToast(t){
  toast.textContent=t;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),1250);
}

// Rain
const rainGeo=new THREE.BufferGeometry();
const rainN=650;
const rainPos=new Float32Array(rainN*3);
for(let i=0;i<rainN;i++){
  rainPos[i*3]=(Math.random()-.5)*100;
  rainPos[i*3+1]=Math.random()*45+4;
  rainPos[i*3+2]=(Math.random()-.5)*100;
}
rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));
const rain=new THREE.Points(
  rainGeo,
  new THREE.PointsMaterial({color:0xc6e8ff,size:.09,transparent:true,opacity:.72})
);
scene.add(rain);

function updateRain(dt){
  const p=rain.geometry.attributes.position.array;
  for(let i=0;i<rainN;i++){
    p[i*3+1]-=dt*22;
    if(p[i*3+1]<.2)p[i*3+1]=45;
    p[i*3]+=dt*2.5;
  }
  rain.geometry.attributes.position.needsUpdate=true;
  rain.position.x=car.position.x;
  rain.position.z=car.position.z;
}

function animate(now){
  requestAnimationFrame(animate);

  const dt=Math.min((now-last)/1000,.033);
  last=now;
  elapsed+=dt;
  missionCooldown=Math.max(0,missionCooldown-dt);

  const joyForward=joystick.active?-joystick.y:0;
  const joySteer=joystick.active?-joystick.x:0;
  const forward=(keys.up?1:0)-(keys.down?1:0)+joyForward;
  const steer=(keys.left?1:0)-(keys.right?1:0)+joySteer;
  const boost=keys.boost;
  const accel=boost?20:13;
  const max=boost?27:17;

  if(keys.brake){
    speed*=Math.pow(.015,dt);
  }else if(forward>.08){
    speed=Math.min(max,speed+accel*Math.min(1,forward)*dt);
  }else if(forward<-.08){
    speed=Math.max(-8,speed+accel*Math.max(-1,forward)*dt);
  }else{
    speed*=Math.pow(.14,dt);
  }

  if(Math.abs(speed)>.2&&Math.abs(steer)>.03){
    car.rotation.y+=steer*dt*1.62*(speed>=0?1:-1)*(0.52+Math.min(Math.abs(speed)/11,.75));
  }

  car.position.x+=Math.sin(car.rotation.y)*speed*dt;
  car.position.z+=Math.cos(car.rotation.y)*speed*dt;
  car.position.x=THREE.MathUtils.clamp(car.position.x,-112,112);
  car.position.z=THREE.MathUtils.clamp(car.position.z,-67,106);

  const followYaw=car.rotation.y+cameraYaw;
  const dist=13.5+cameraPitch*7;
  const camH=8.5+cameraPitch*10;
  const targetCam=new THREE.Vector3(
    car.position.x-Math.sin(followYaw)*dist,
    camH,
    car.position.z-Math.cos(followYaw)*dist
  );
  camera.position.lerp(targetCam,1-Math.pow(.012,dt));
  camera.lookAt(car.position.x,1.25,car.position.z);
  cameraYaw*=Math.pow(.72,dt);

  document.getElementById('speed').textContent=Math.round(Math.abs(speed)*4.15);

  const m=missions[mission];
  const wpDist=Math.hypot(car.position.x-m.x,car.position.z-m.z);
  waypoint.material.opacity=.52+.22*Math.sin(elapsed*4);
  beacon.material.opacity=.1+.07*Math.sin(elapsed*3);

  if(wpDist<5.8 && missionCooldown<=0 && !(mission===missions.length-1&&freeRoamComplete)){
    cash+=m.reward;
    document.getElementById('cash').textContent=cash;
    showToast(`MISSION COMPLETE  + RM ${m.reward}`);

    if(mission<missions.length-1){
      mission++;
      setMission();
    }else{
      freeRoamComplete=true;
      document.getElementById('missionTitle').textContent='Sibu is yours.';
      document.getElementById('missionSub').textContent='Free roam · explore the city and riverfront.';
      waypoint.visible=false;
      beacon.visible=false;
    }

    missionCooldown=2.5;
    car.position.x+=2;
  }

  updateRain(dt);

  const mins=Math.floor((18*60+42+elapsed*.7)%1440);
  document.getElementById('time').textContent=
    String(Math.floor(mins/60)).padStart(2,'0')+':'+String(mins%60).padStart(2,'0');

  renderer.render(scene,camera);
}

requestAnimationFrame(animate);

addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
