import * as T from 'three';
// Original edge instrumentation and spatial debris; never changes combat state.
export function makeSpectacle(scene){
 const edge=document.createElement('div');edge.id='battleFrame';edge.innerHTML='<i class="rail left"></i><i class="rail right"></i><b class="corner c1"></b><b class="corner c2"></b><b class="corner c3"></b><b class="corner c4"></b><span class="phase">増幅起動 <small>OVERDRIVE</small></span><span class="chain"></span>';document.body.append(edge);
 const group=new T.Group();scene.add(group);const items=[],cube=new T.BoxGeometry(.25,.18,.32),smoke=new T.IcosahedronGeometry(1,1),ring=new T.RingGeometry(.86,1,48);let phaseAge=0,chainAge=0,ending=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function add(geo,color,pos,life,velocity,scale=1,opacity=1){const mat=new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide}),o=new T.Mesh(geo,mat);o.position.copy(pos);o.scale.setScalar(scale);group.add(o);const p={o,life,left:life,velocity,scale,opacity,spin:0};items.push(p);return p}
 function shock(pos,big=false,color=0x99ffff){const p=add(ring,color,pos.clone().setY(.15),big?1.1:.5,new T.Vector3(),big?.5:.22,.8);p.o.rotation.x=-Math.PI/2;p.ring=big?8:2.3;return p;}
 function enter(){edge.classList.add('amplified','entering');phaseAge=1.8;edge.querySelector('.phase').innerHTML='増幅起動 <small>OVERDRIVE</small>';}
 function kill(o,combo,final=false){const vehicle=['tank','tankBoss','turret'].includes(o.role),pos=new T.Vector3(o.x,.7,o.z);const wave=shock(pos,vehicle,vehicle?0xffd68a:0x9cecf1);wave.delay=final?.18:0;const count=reduced()?(vehicle?5:2):(vehicle?24:7);for(let i=0;i<count;i++){const angle=i*2.399,p=add(cube,vehicle?(i%2?0x967951:0xe2bf72):(i%2?0xa85841:0xebbb81),pos,vehicle?1.8:.7,new T.Vector3(Math.cos(angle)*(vehicle?4:1.9),2.5+(i%4),Math.sin(angle)*(vehicle?3:1.3)),vehicle?1.5:.7);p.spin=reduced()?0:(i%2?1:-1)*5;p.gravity=true;p.delay=final?.18:0;}
 if(vehicle){for(let i=0;i<(reduced()?4:10);i++){const a=i*2.399,p=add(smoke,i%2?0x56656a:0x969d8e,pos,2.5,new T.Vector3(Math.cos(a)*1.5,1+i%3*.25,Math.sin(a)*1.3),.4,.62);p.cloud=true;p.delay=final?.18:0;}edge.classList.add('impact');chainAge=.85;}
 else if(combo>1){edge.querySelector('.chain').textContent=`${combo} 連続撃破`;edge.classList.add('chain-hit');chainAge=.8;}
 }
 function cancel(pos){shock(pos,false,0x8fffea);for(let i=0;i<5;i++)add(cube,0x8fffea,pos,.5,new T.Vector3(Math.cos(i*1.25)*1.4,1,Math.sin(i*1.25)*1.4),.45);}
 function victory(){ending=true;edge.classList.remove('entering','chain-hit');edge.classList.add('secured');edge.querySelector('.phase').innerHTML='脅威解除 <small>SECTOR SECURED</small>';phaseAge=0;}
 function update(dt,active,amplified){edge.hidden=!active;if(!active)return;edge.classList.toggle('amplified',!!amplified&&!ending);phaseAge=Math.max(0,phaseAge-dt);chainAge=Math.max(0,chainAge-dt);edge.classList.toggle('show-phase',phaseAge>0);if(!phaseAge)edge.classList.remove('entering');if(!chainAge)edge.classList.remove('impact','chain-hit');for(let i=items.length-1;i>=0;i--){const p=items[i];if(p.delay>0){p.delay-=dt;continue;}p.left-=dt;const k=1-p.left/p.life;p.o.position.addScaledVector(p.velocity,dt);if(p.gravity)p.velocity.y-=dt*7;if(p.spin){p.o.rotation.x+=dt*p.spin;p.o.rotation.z+=dt*p.spin*.7;}if(p.ring)p.o.scale.setScalar(p.scale+k*p.ring);if(p.cloud)p.o.scale.setScalar(p.scale+k*2.4);p.o.material.opacity=p.opacity*Math.max(0,1-k);if(p.left<=0){group.remove(p.o);p.o.material.dispose();items.splice(i,1);}}}
 function reset(){for(const p of items){group.remove(p.o);p.o.material.dispose();}items.length=0;ending=false;phaseAge=chainAge=0;edge.className='';edge.hidden=true;}
 reset();return{enter,kill,cancel,victory,update,reset};
}
