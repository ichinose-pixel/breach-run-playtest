import * as T from 'three';
const signalLabels=new WeakMap();
const roles={shooter:'重装射手',sniper:'狙撃兵',shield:'装甲盾兵',turret:'固定砲台',tank:'装甲戦車',tankBoss:'指揮戦車',captain:'小隊長'};
export function paintBattleTag(ctx,top,bottom,hp,color,o){
 const w=ctx.canvas.width,h=ctx.canvas.height;ctx.save();ctx.scale(w/512,h/320);ctx.clearRect(0,0,512,320);
 const gate=o.type==='gate',positive=o.value>=0,zero=o.value===0,heavy=o.value>=30,collect=!o.live&&o.gateOutcome==='collected';
 if(gate){
  const tier=o.value>=100?3:o.value>=30?2:o.value>=10?1:0;
  const face=positive?['#c5ffff','#ffeab1','#ffd369','#ffae38'][tier]:'#ffadba';
  // Almost the whole sign is the numeral. Small feet retain the lane marker.
  ctx.fillStyle=positive?'#19798d':'#9d3e46';ctx.fillRect(24,65,464,197);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  let size=228;ctx.font='900 '+size+'px "Arial Black",Impact,sans-serif';
  const width=ctx.measureText(top).width;if(width>450){size*=450/width;ctx.font='900 '+size+'px "Arial Black",Impact,sans-serif';}
  ctx.strokeStyle='#07191f';ctx.lineWidth=29;ctx.strokeText(top,256,162);
  ctx.fillStyle='#07191f';ctx.fillText(top,256,168);
  ctx.strokeStyle=positive&&tier>=2?'#895026':'#15383e';ctx.lineWidth=13;ctx.strokeText(top,256,157);
  const shine=ctx.createLinearGradient(0,65,0,238);shine.addColorStop(0,'#fffbe8');shine.addColorStop(.38,face);shine.addColorStop(.46,positive&&tier>=2?'#d48d26':positive?'#80d7e3':'#cd5970');shine.addColorStop(1,face);ctx.fillStyle=shine;ctx.fillText(top,256,151);
  ctx.fillStyle=positive?face:'#ff879e';for(const x of[18,468])ctx.fillRect(x,248,26,12);
  ctx.font='900 26px system-ui';ctx.fillStyle='#fff5d1';ctx.fillText(collect?'部隊合流':zero?'転換':positive?(tier>=2?'増援 集結':'増援'):'減員',256,280);
  if(o.live){const n=Math.min(10,Math.round((o.shotFraction||0)*10));for(let i=0;i<10;i++){ctx.fillStyle=i<n?face:'#29434b';ctx.fillRect(78+i*36,302,29,9)}}
  ctx.restore();return;
 }
 const metal=gate?(positive?'#f3ca73':'#b8cad5'):o.boss?'#f3ca73':o.role==='shield'?'#c6a1ec':'#edab69';
 const back=gate?(positive?'#19798d':'#9d3e46'):color;
 ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(22,40);ctx.lineTo(118,40);ctx.lineTo(143,16);ctx.lineTo(369,16);ctx.lineTo(394,40);ctx.lineTo(490,40);ctx.lineTo(475,136);ctx.lineTo(494,239);ctx.lineTo(373,239);ctx.lineTo(352,272);ctx.lineTo(160,272);ctx.lineTo(139,239);ctx.lineTo(18,239);ctx.lineTo(37,136);ctx.closePath();ctx.fillStyle='#172e37';ctx.fill();ctx.strokeStyle=metal;ctx.lineWidth=9;ctx.stroke();
 ctx.fillStyle=back;ctx.beginPath();ctx.moveTo(48,56);ctx.lineTo(464,56);ctx.lineTo(449,210);ctx.lineTo(63,210);ctx.closePath();ctx.fill();
 for(const x of[45,467]){ctx.fillStyle=metal;ctx.beginPath();ctx.arc(x,44,7,0,7);ctx.fill();}
 const title=gate?(collect?'部隊合流':zero?'転換':positive?'増援':'減員'):bottom||'脅威';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='950 29px system-ui';ctx.fillStyle=metal;ctx.fillText(title,256,38);
 let size=gate?(String(top).length>=4?122:164):(String(top).length>5?57:73);ctx.font='1000 '+size+'px system-ui';const width=ctx.measureText(top).width;if(width>397){size*=397/width;ctx.font='1000 '+size+'px system-ui';}
 ctx.lineWidth=18;ctx.strokeStyle='#142731';ctx.strokeText(top,256,137);ctx.lineWidth=8;ctx.strokeStyle=metal;ctx.strokeText(top,256,133);ctx.fillStyle='#754625';ctx.fillText(top,256,143);const face=ctx.createLinearGradient(0,76,0,190);face.addColorStop(0,'#fffceb');face.addColorStop(.45,'#fff3bf');face.addColorStop(.52,gate&&!positive?'#e4bbc0':'#edc365');face.addColorStop(1,'#fff3b7');ctx.fillStyle=face;ctx.fillText(top,256,132);
 const legend=gate?(collect?'獲得した人数':o.growing?'+1 / 10 HIT':'通過で合流'):signalLabels.get(o)||'';ctx.font='900 27px system-ui';ctx.fillStyle='#fff5d1';ctx.fillText(legend,256,241);
 if(gate&&o.live){const n=Math.min(10,Math.round((o.shotFraction||0)*10));for(let i=0;i<10;i++){ctx.fillStyle=i<n?'#fff0aa':'#263f49';ctx.fillRect(78+i*36,282,29,13)}if(heavy)for(const x of[12,486]){ctx.fillStyle='#ffce62';ctx.fillRect(x,70,13,136);}}
 else if(o.live){ctx.fillStyle='#0d252e';ctx.fillRect(65,284,382,14);ctx.fillStyle=metal;ctx.fillRect(65,284,382*Math.max(0,hp),14)}
 ctx.restore();
}
export function makeBattleSignals(scene,sound){
 const seen=new Set();let lastIntro=-10,lastGain=-10,bannerUntil=0,firstFrame=true;const banner=document.createElement('aside');banner.className='battle-intro';banner.hidden=true;banner.innerHTML='<i aria-hidden="true">✦</i><div><small></small><strong></strong></div>';document.body.append(banner);function announce(name,label,t){banner.querySelector('small').textContent=label;banner.querySelector('strong').textContent=name;banner.hidden=false;banner.classList.remove('arrive');void banner.offsetWidth;banner.classList.add('arrive');bannerUntil=t+1.15;}const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function draw(o,v,dt,run,camera){if(firstFrame){firstFrame=false;if(run.t>1)for(const enemy of run.objects.filter(x=>x.type==='enemy'&&x.active!==false&&x.z>-30))seen.add(enemy.boss?'boss-'+enemy.bossKind:enemy.role);}if(run.t>bannerUntil||!document.querySelector('#bossHUD').hidden)banner.hidden=true;
  if(o.type==='gate'){
   if(v.displayValue!==o.value){if(v.displayValue!==undefined){const tier=o.value>=100?3:o.value>=30?2:o.value>=10?1:0,step=o.value>=0&&v.displayValue<0||tier>(v.digitTier||0);v.digitKick=step?.34:.15;if(o.value>0&&tier>(v.digitTier||0))sound('panel-tier',tier);v.digitTier=tier;}v.displayValue=o.value;}
   v.digitKick=Math.max(0,(v.digitKick||0)-dt);const h=2*camera.position.distanceTo(v.sprite.position)*Math.tan(21*Math.PI/180)/innerHeight;
   if(o.live){const tier=o.value>=100?3:o.value>=30?2:o.value>=10?1:0,size=Math.min(2.05,Math.max(1.5,h*(42+tier*3)));v.sprite.scale.set(size*1.65,size,1);v.sprite.position.y=1.55;v.sprite.position.z=o.z+.45;v.sprite.material.depthTest=false;if(!reduced())v.sprite.scale.multiplyScalar(1+v.digitKick*.5);v.sprite.material.rotation=0;}
   v.sprite.renderOrder=7;v.sprite.userData.signalType='panel';return;
  }
  if(o.type!=='enemy'||!o.live||o.active===false||o.z<=-30||!roles[o.role])return;
  // One imminent attack owns the large world label. Known enemies keep their model/beam.
  const imminent=run.objects.filter(e=>e.type==='enemy'&&e.live&&e.active!==false&&e.z>-26&&roles[e.role]&&(e.pending>0||e.warn>0&&e.warn<.85)).sort((a,b)=>(a.pending>0?a.pending:a.warn+.6)-(b.pending>0?b.pending:b.warn+.6)||b.z-a.z)[0];
  v.sprite.userData.signalType='threat';const bossOn=!document.querySelector('#bossHUD').hidden;const role=o.boss?'boss-'+o.bossKind:o.role,key=o.id+':'+Math.ceil(o.hp/o.maxHp*20);let intro=false;
  if(dt>0&&!imminent&&(!bossOn||o.boss)&&!seen.has(role)&&run.t-lastIntro>1.2){seen.add(role);lastIntro=run.t;v.introUntil=run.t+1.1;sound('enemy-title',o.boss?1:0);if(o.boss){const hud=document.querySelector('#bossHUD');hud?.classList.remove('boss-arrive');void hud?.offsetWidth;hud?.classList.add('boss-arrive');}else announce(roles[o.role],'敵影 確認',run.t);}
  intro=run.t<(v.introUntil||0);const danger=o.warn>0||o.pending>0,name=o.bossName||roles[o.role];
  if(o!==imminent||bossOn){v.sprite.visible=false;return;}
  banner.hidden=true;
  const signalText=o.pending>0?'発射 → 着弾':o.warn>0?'攻撃予告':intro?'接近':'残存装甲';
  signalLabels.set(o,signalText);const title=danger?(o.pending>0?'着弾注意':'攻撃予告'):name,color=danger?'#99462d':o.boss?'#75603c':o.role==='shield'?'#67528b':'#875039';
  // Keep persistent names narrow; only the first role encounter expands briefly.
  const px=52,h=px*2*camera.position.distanceTo(v.sprite.position)*Math.tan(21*Math.PI/180)/innerHeight;
  v.sprite.visible=true;v.sprite.scale.set(h*1.6,h,1);v.sprite.position.set(o.x,o.boss?3.6:3.25,o.z-.2);v.sprite.material.rotation=0;v.sprite.renderOrder=4;if(run.objects.some(g=>g.type==='gate'&&g.live&&Math.abs(g.x-o.x)<1.3&&Math.abs(g.z-o.z)<5))v.sprite.position.y+=1.3;
  if(intro&&!reduced())v.sprite.position.x-=Math.max(0,(v.introUntil-run.t)-.75)*2.5;
  const sig=key+title+signalText;if(v.signalKey!==sig){v.set(title,danger?name:intro?'敵影確認':'',o.hp/o.maxHp,color);v.signalKey=sig;}
  if(v.beam&&danger)v.beam.material.opacity=o.pending>0?.36:.20+.10*(1-o.warn/(o.warningDuration||1.85));
 }
 function gain(n,type,run){if(type==='連続パネル')return;const el=document.querySelector('#force');el?.classList.remove('force-arrival');if(el){void el.offsetWidth;el.classList.add('force-arrival');}if(run.t-lastGain>.35&&n>=3)sound('panel-capture',Math.min(3,Math.floor(n/15)));lastGain=run.t;}
 function reset(){seen.clear();lastIntro=lastGain=-10;banner.hidden=true;bannerUntil=0;firstFrame=true;document.querySelector('#bossHUD')?.classList.remove('boss-arrive');document.querySelector('#force')?.classList.remove('force-arrival');}
 return{draw,gain,reset};
}
