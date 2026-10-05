'use strict';
// This layer preserves the v13 combat, artwork, campaign and machine systems.
const lessonKey='breach-gate-lesson-v1';
let lessonSeen=false;try{lessonSeen=localStorage.getItem(lessonKey)==='done'}catch{}
let lesson=null,joiners=[],joinPulse=0,movedInRun=false,noticeQueue=[],noticeLeft=0;
const coach=document.createElement('aside');coach.id='fieldCoach';coach.hidden=true;coach.setAttribute('role','status');
coach.innerHTML='<b></b><span></span>';$('app').append(coach);
function teach(title,detail){coach.hidden=false;coach.firstElementChild.textContent=title;coach.lastElementChild.textContent=detail;}
function fieldMode(){const playing=state==='playing';$('app').classList.toggle('teaching',playing&&!!lesson);coach.style.visibility=playing?'visible':'hidden';}
const refinedStart=start,refinedUpdate=update,refinedChangeArmy=changeArmy,refinedDrawArmy=drawArmy,refinedHUD=updateHUD,refinedToast=toast;
toast=function(message,color){if(/^RUSH!/.test(message))return;if(state==='playing'){if(/危険|予告|照準|WARNING/.test(message)){refinedToast(message,color);noticeLeft=1.7;return;}noticeQueue.push({message,color});noticeQueue=noticeQueue.slice(-3);}else refinedToast(message,color);};
const refinedFloating=floating;floating=function(text,x,z,color){if(/COMBO/.test(text))return;refinedFloating(text,x,z,color);};
start=function(n=level){lesson=null;noticeQueue=[];noticeLeft=0;joiners=[];joinPulse=0;movedInRun=false;refinedStart(n);noticeQueue=[];
 if(level===1&&!lessonSeen){objects=[];addGate(12,1,6);objects[0].x=.42;lesson={phase:'aim',gate:objects[0],initial:6,clock:0};teach('右の青いゲートをねらおう','下のエリアを右へドラッグ。射撃は自動です。');}
 else teach('左右にドラッグして移動','青いゲートを撃つと、合流する人数が増えます。');fieldMode();};
canvas.addEventListener('pointermove',()=>{if(drag&&Math.abs(targetX)>.12)movedInRun=true;});
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key))movedInRun=true;});
changeArmy=function(n){const before=army,previousFloats=floats.length;refinedChangeArmy(n);if(n>0){floats.splice(previousFloats);joinPulse=1;const visible=Math.min(12,Math.max(3,Math.ceil(Math.sqrt(n))));for(let i=0;i<visible;i++)joiners.push({life:0,duration:.55+i*.025,side:i%2?1:-1,index:i});
 if(!lesson){noticeQueue=noticeQueue.filter(x=>!x.message.includes('人突破'));toast('増援 +'+(army-before),'#a7ffe5');if(tier>(before>=50?3:before>=25?2:before>=10?1:0))toast('部隊進化 · '+(tier+1)+'連弾へ強化','#ffe1a1');}}};
updateHUD=function(){refinedHUD();$('growth').textContent=army<10?'10人で2連弾':army<25?'25人で3連弾':army<50?'50人で4連弾':'4連弾 · 最大進化';};
update=function(dt){if(state!=='playing'){fieldMode();return;}const held=lesson?.phase==='aim',joining=lesson?.phase==='join';const prevDistance=distance;
 refinedUpdate(dt);if(held)distance=Math.min(distance,lesson.gate.z-8);if(joining)distance=prevDistance;
 for(const p of joiners)p.life+=dt;joiners=joiners.filter(p=>p.life<p.duration);joinPulse=Math.max(0,joinPulse-dt);
 if(lesson){lesson.clock+=dt;if(lesson.phase==='aim'&&lesson.gate.value>=lesson.initial+3){lesson.phase='cross';lesson.clock=0;teach('ゲートの増援が増えた！','通り抜けて、仲間を部隊に加えよう。');}
 else if(lesson.phase==='cross'&&lesson.gate.dead){if(army>1){lesson.phase='join';lesson.clock=0;teach('増援が合流！ 部隊 '+army+'人','人数で弾幕が進化。装備はこの先のパネルで獲得。');}
 else{objects=[];addGate(distance+10,1,6);objects[0].x=.42;lesson={phase:'aim',gate:objects[0],initial:6,clock:0};teach('青いゲートの正面へ移動','右へドラッグして、ゲートを撃ってみよう。');}}
 else if(lesson.phase==='join'&&lesson.clock>2.5){lesson=null;lessonSeen=true;try{localStorage.setItem(lessonKey,'done')}catch{}makeLevel();objects=objects.filter(o=>o.z>12);distance=14;coach.hidden=true;noticeQueue=[];}
 }else{if(movedInRun||elapsed>7)coach.hidden=true;if(noticeLeft<=0&&noticeQueue.length){const next=noticeQueue.shift();refinedToast(next.message,next.color);noticeLeft=1.7;}noticeLeft-=dt;}
 fieldMode();};
drawArmy=function(){if(!['playing','paused'].includes(state))return refinedDrawArmy();if(army<=0)return;const visible=Math.min(army,30),cols=army<10?Math.ceil(Math.sqrt(visible)):army<25?5:army<50?6:army<100?7:8,scale=clamp(W/420,.75,1.2),spread=army>=100?22:army>=50?21:19;
 const center=clamp(W/2+px*W*.43,cols*spread*scale/2+9,W-cols*spread*scale/2-9),base=H*.74;
 ctx.save();ctx.strokeStyle=army>=100?'#ffe1a188':'#70daf26b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(center,base+18*scale,Math.min(98,(cols*spread/2+9))*scale,(army>=50?40:30)*scale,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 for(let i=0;i<visible;i++){let row=Math.floor(i/cols),col=i%cols,cnt=Math.min(cols,visible-row*cols);unit(center+(col-(cnt-1)/2)*spread*scale+(row%2?3:0),base+row*12*scale,scale*1.18,'#399feb',i*.7);}
 if(support>0){round(center-15,base-26,30,20,5,'#947343','#ffe0a0');round(center-5,base-42,10,28,3,'#d9bd8b');}
 for(const p of joiners){const t=p.life/p.duration,e=1-Math.pow(1-t,3);let x=center+p.side*(W*.45*(1-e)+(p.index%4)*9),y=base+45*(1-e)+(p.index%3)*12;ctx.save();ctx.globalAlpha=Math.min(1,t*5)*(1-t*.35);unit(x,y,scale,'#399feb',p.index);ctx.restore();}
};
const refinedHome=home;home=function(){lesson=null;coach.hidden=true;noticeQueue=[];refinedHome();fieldMode();};
// Existing handlers that captured function values are rebound to the refined flow.
$('home').onclick=home;$('pauseHome').onclick=home;
// Only the nearest, legible gate row gets numbers. Distant objects stay silhouettes.
const refinedObject=drawObject;
function gateNumberVisible(o){return o.z-distance<=42&&W*.255*project(o.x,o.z-distance).s>=44&&!objects.some(other=>other.type==='gate'&&!other.dead&&other.z<o.z-.5&&other.z-distance>-.5);}
drawObject=function(o){const rel=o.z-distance;if(rel>110||rel<-.5)return;const p=project(o.x,rel),s=p.s;
 if(o.type==='gate'&&!gateNumberVisible(o)){round(p.x-W*.255*s/2,p.y-48*s,W*.255*s,48*s,3*s,o.value>=0?'#164966':'#71334a',o.value>=0?'#52d8fa':'#ff637d');return;}
 if(o.type==='crate'&&rel>30){atlas(3,p.x,p.y+4*s,64*s,64*s);return;}
 if(o.type==='boss'&&rel>40){atlas(2,p.x,p.y+6*s,165*s,165*s);return;}
 if(o.type!=='pickup')return refinedObject(o);
 if(rel>34){const color=o.kind==='reinforce'?'#91f5df':runMachine.color,w=Math.max(12,22*s),h=Math.max(10,17*s);round(p.x-w/2,p.y-h,w,h,3,'#102c43',color);txt(o.kind==='reinforce'?'+':'◆',p.x,p.y-h/2,Math.max(10,12*s),color);}
};
// Choice previews and detail plates are owned by decisions.js.
