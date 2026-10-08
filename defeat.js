import * as T from 'three';
// Presentation only: never changes HP, aim, spawns, rewards or collision state.
export function makeDefeatDirector(scene,sound){
 const root=new T.Group();scene.add(root);const pieces=[],sequences=[];
 const cube=new T.BoxGeometry(1,1,1),puff=new T.IcosahedronGeometry(1,1),ring=new T.RingGeometry(.87,1,48);
 const celebration=document.createElement('div');celebration.id='bossCelebration';celebration.hidden=true;celebration.innerHTML='<div class="crest"><div class="metal"></div><i class="rivet left"></i><i class="rivet right"></i><strong>撃破</strong><span class="sub">作戦完了</span><div class="reward"><small>獲得コイン</small><span></span></div>'+Array.from({length:8},(_,i)=>'<i class="coin" style="--i:'+i+';--x:'+((i-3.5)*30)+'"></i>').join('')+'</div>';document.body.append(celebration);let rewardHit=false,lastPresentationAge=null;
 function present(age,receipt){if(!receipt||!Number.isFinite(receipt.earned))return;celebration.hidden=age<2.3;celebration.querySelector('.reward span').textContent='+'+receipt.earned;if(lastPresentationAge===null&&age>2.7)rewardHit=true;if(age>=2.65&&!rewardHit){rewardHit=true;sound('finish-reward');}lastPresentationAge=age;}
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(255,255,255,1)');gradient.addColorStop(.3,'rgba(255,255,255,.8)');gradient.addColorStop(.7,'rgba(255,255,255,.25)');gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const soft=new T.CanvasTexture(canvas);
 function cloud(color,position,life,velocity,scale,opacity){const mesh=new T.Sprite(new T.SpriteMaterial({map:soft,color,transparent:true,opacity,depthWrite:false}));mesh.position.copy(position);mesh.scale.copy(scale);root.add(mesh);const p={mesh,life,age:0,velocity,scale:scale.clone(),opacity};pieces.push(p);return p;}
 function particle(geometry,color,position,life,velocity,scale,opacity=1){
  const mesh=new T.Mesh(geometry,new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide}));mesh.position.copy(position);mesh.scale.copy(scale);root.add(mesh);
  const p={mesh,life,age:0,velocity,scale:scale.clone(),opacity};pieces.push(p);return p;
 }
 function fracture(mesh,center,scale=1){
  if(!mesh)return;scale*=reduced()?.35:1;mesh.updateWorldMatrix(true,false);const geo=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone(),pos=geo.getAttribute('position'),normal=geo.getAttribute('normal');
  for(let sector=0;sector<3;sector++){
   const xyz=[],norm=[];for(let i=0;i<pos.count;i+=3){const x=(pos.getX(i)+pos.getX(i+1)+pos.getX(i+2))/3;const bin=x<-.16?0:x>.16?2:1;if(bin!==sector)continue;for(let j=0;j<3;j++){xyz.push(pos.getX(i+j),pos.getY(i+j),pos.getZ(i+j));if(normal)norm.push(normal.getX(i+j),normal.getY(i+j),normal.getZ(i+j));}}
   if(!xyz.length)continue;const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(xyz,3));if(norm.length)g.setAttribute('normal',new T.Float32BufferAttribute(norm,3));else g.computeVertexNormals();g.applyMatrix4(mesh.matrixWorld);g.translate(-center.x,-center.y,-center.z);
   const p=particle(g,mesh.material.color?.getHex()||0xc8a46b,center,3.8,new T.Vector3((sector-1)*3.3*scale,3.7*scale,1.1+(sector%2)*1.7),new T.Vector3(1,1,1));p.owned=true;p.gravity=true;p.spin=(sector-1.2)*2;p.rest=true;
  }geo.dispose();
 }
 function sparks(o,strong=false){for(let i=0;i<(strong?7:3);i++){const a=i*2.399,p=particle(cube,i%2?0xffbd50:0xffefa9,new T.Vector3(o.x,1.1,o.z+.35),strong?.4:.17,new T.Vector3(Math.cos(a)*3,1.5+i*.3,Math.sin(a)*2),new T.Vector3(.065,.065,strong?.4:.18));p.gravity=true;p.spin=6;}}
 function armor(o,v){fracture(v.impactArmor||(v.vehicle?.plates?.[Math.max(0,(o.brokenPlates||1)-1)]),new T.Vector3(o.x,1.1,o.z+.4),.7);sparks(o,true);}
 function blast(o){
  const origin=new T.Vector3(o.x,.55,o.z);const r=particle(ring,0xffcd70,origin.clone().setY(.09),.65,new T.Vector3(),new T.Vector3(.3,.3,.3),.8);r.mesh.rotation.x=-Math.PI/2;r.grow=8;
  for(let i=0;i<(reduced()?4:12);i++){const a=i*2.399,position=origin.clone().add(new T.Vector3(Math.cos(a)*(i%3)*.5,(i%3)*.38,Math.sin(a)*(i%3)*.5));const p=cloud(i%3===0?0xfff3c3:i%3===1?0xffb33d:0xe96926,position,.42+(i%3)*.12,new T.Vector3(Math.cos(a)*2.3,1.3,Math.sin(a)*1.8),new T.Vector3(.4,.4,.4),.92);p.grow=3.7;}
  for(let i=0;i<(reduced()?3:7);i++){const side=i%2?1:-1,p=cloud(i%2?0x37484c:0x69716a,origin.clone().add(new T.Vector3(side*(.9+i*.14),.5,-1.2)),2.3,new T.Vector3(side*.6,.75+i%3*.14,-.35),new T.Vector3(.6,.6,.6),.42);p.delay=.23+i*.025;p.grow=2.1;}
  if(!o.finaleFx||o.role!=='captain')for(let i=0;i<3;i++){const soot=particle(new T.PlaneGeometry(1,1),0x34403b,origin.clone().add(new T.Vector3((i-1)*.7,0,(i%2)*.4)).setY(.085),4,new T.Vector3(),new T.Vector3(1.8,1.1,1),.24);soot.owned=true;soot.mesh.material.map=soft;soot.mesh.rotation.x=-Math.PI/2;soot.steady=true;}
 }
 function kill(o,v,final){
  o.defeatFx=true;o.finaleFx=!!(final&&o.boss);o.deathDuration=o.finaleFx?4.8:o.boss?2.6:o.impactElite?1.15:.65;o.death=o.deathDuration;
  if(o.finaleFx){sequences.push({o,v,age:0,plate:false,blast:false,land:false});sound('finish-hit');}
  else if(o.impactElite){if(!o.finisherReady)armor(o,v);sound('elite-fall');}
 }
 function pose(o,v){if(o.live||!o.defeatFx)return;const age=o.deathDuration-o.death;
  if(v.actor){const t=Math.max(0,age-(o.finaleFx?.26:0)),fall=Math.min(1,t/(o.finaleFx?.62:.43)),side=o.id%2?1:-1,contact=o.finaleFx?.88:.43,after=Math.max(0,age-contact),bounce=after<.22?Math.sin(after/.22*Math.PI)*.095:0;v.actor.model.rotation.x=fall*.15;v.actor.model.rotation.z=side*(fall*1.45-bounce*.3);v.actor.model.position.y=0;v.actor.model.position.z=o.z-Math.min(1,t)*.8;v.actor.model.updateMatrixWorld(true);const bounds=new T.Box3();v.actor.model.traverse(m=>{if(m.isMesh&&m.material.name==='BakedCharacter'&&m.name!=='Cube276')bounds.union(new T.Box3().setFromObject(m,true));});if(bounds.isEmpty())bounds.setFromObject(v.actor.model,true);const lift=fall<1?Math.sin(fall*Math.PI)*.10:bounce;v.actor.model.position.y+=.035-bounds.min.y+lift;v.actor.model.updateMatrixWorld(true);bounds.translate(new T.Vector3(0,v.actor.model.position.y,0));const center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());v.actor.shadow.visible=false;if(!v.contactShadow){v.contactShadow=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:soft,color:0x20302b,transparent:true,opacity:.32,depthWrite:false}));v.contactShadow.rotation.x=-Math.PI/2;scene.add(v.contactShadow);v.parts.push(v.contactShadow);}v.contactShadow.visible=o.death>0;v.contactShadow.position.set(center.x,.065,center.z);v.contactShadow.scale.set(Math.max(.65,size.x)*1.04,Math.max(.55,size.z)*.78,1);v.contactShadow.material.opacity=.34-lift*.6;if(age>=contact&&!v.groundImpact){v.groundImpact=true;for(let i=0;i<5;i++){const dust=cloud(0xb8aa83,new T.Vector3(center.x,.12,center.z),.48,new T.Vector3((i-2)*.7,.12,(i%2?.5:-.5)),new T.Vector3(.3,.18,.3),.28);dust.grow=.6;}if(o.finaleFx)sound('body-land');}}
  if(v.shield){v.shield.visible=o.finaleFx&&age<.38;v.rim.visible=o.finaleFx&&age<.38;}
  if(o.finaleFx)v.sprite.visible=false;
 }
 function update(dt,active){root.visible=active;if(!active){celebration.hidden=true;return;}
  for(const s of sequences){s.age+=dt;const age=s.age;if(age>=.38&&!s.plate){s.plate=true;fracture(s.v.shield,new T.Vector3(s.o.x,1.1,s.o.z+.4));sparks(s.o,true);sound('finish-break');}if(age>=.82&&!s.blast){s.blast=true;blast(s.o);sound('finish-blast');}if(age>=1.65&&!s.land){s.land=true;sound('finish-debris');}}
  for(let i=pieces.length-1;i>=0;i--){const p=pieces[i];if(p.delay>0){p.delay-=dt;p.mesh.visible=false;continue}p.mesh.visible=true;p.age+=dt;const k=Math.min(1,p.age/p.life);p.mesh.position.addScaledVector(p.velocity,dt);if(p.gravity)p.velocity.y-=dt*8;if(p.rest&&p.mesh.position.y<.16){p.mesh.position.y=.16;p.velocity.multiplyScalar(.75);p.velocity.y=0;p.spin*=.65;}if(p.spin){p.mesh.rotation.x+=p.spin*dt;p.mesh.rotation.z+=p.spin*dt*.5;}if(p.grow)p.mesh.scale.copy(p.scale).addScalar(p.grow*Math.sin(Math.min(1,p.age/.5)*Math.PI/2));p.mesh.material.opacity=p.opacity*(p.rest||p.steady?Math.min(1,(1-k)*5):Math.pow(1-k,.7));if(k===1){root.remove(p.mesh);p.mesh.material.dispose();if(p.owned)p.mesh.geometry.dispose();pieces.splice(i,1);}}
 }
 function reset(){for(const p of pieces){root.remove(p.mesh);p.mesh.material.dispose();if(p.owned)p.mesh.geometry.dispose()}pieces.length=0;sequences.length=0;root.visible=false;celebration.hidden=true;rewardHit=false;lastPresentationAge=null;}
 return{kill,armor,pose,update,reset,present};
}
