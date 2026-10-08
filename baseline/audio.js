'use strict';
// Procedural score plus licensed effects; source and license records are in assets/audio/manifest.json and licenses/audio.
class BattleAudio {
 constructor(){this.ctx=null;this.enabled=false;this.musicEnabled=true;this.step=0;this.next=0;this.limits={};this.playing=false;this.voices=0;this.peakVoices=0;this.dropped=0;this.warnUntil=0;this.duckUntil=0;this.section='battle';}
 init(){if(this.ctx)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=this.ctx=new A(),sum=c.createGain(),hp=c.createBiquadFilter(),lim=c.createDynamicsCompressor();hp.type='highpass';hp.frequency.value=65;lim.threshold.value=-12;lim.knee.value=9;lim.ratio.value=6;lim.attack.value=.003;lim.release.value=.14;this.fx=c.createGain();this.fx.gain.value=.75;this.alert=c.createGain();this.alert.gain.value=.82;this.music=c.createGain();this.music.gain.value=0;this.musicDuck=c.createGain();this.master=c.createGain();this.master.gain.value=.72;this.seUser=c.createGain();this.bgmUser=c.createGain();this.fx.connect(this.seUser);this.alert.connect(this.seUser);this.seUser.connect(sum);this.music.connect(this.musicDuck);this.musicDuck.connect(this.bgmUser);this.bgmUser.connect(sum);sum.connect(hp);hp.connect(lim);lim.connect(this.master);this.master.connect(c.destination);this.noise=c.createBuffer(1,Math.ceil(c.sampleRate*2.4),c.sampleRate);const data=this.noise.getChannelData(0);let seed=91357;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}}
 enable(on){this.enabled=on;if(on){try{this.init();this.ctx?.resume().catch(()=>{});}catch{this.enabled=false;}}if(this.ctx)this.master.gain.setTargetAtTime(this.enabled?.72:0,this.ctx.currentTime,.02);return this.enabled;}
 reserve(bus){const max=bus===this.alert?48:bus===this.music?28:40;if(this.voices>=max){this.dropped++;return false;}this.peakVoices=Math.max(this.peakVoices,++this.voices);return true;}
 tone(freq,duration,volume,type='triangle',when=0,end=freq,bus=this.fx,cutoff=2400){if(!this.ctx||!this.enabled||!this.reserve(bus))return;const c=this.ctx,t=Math.max(when||c.currentTime,c.currentTime),o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(35,end),t+duration);f.type='lowpass';f.frequency.setValueAtTime(cutoff,t);f.frequency.exponentialRampToValueAtTime(Math.max(180,cutoff*.48),t+duration);f.Q.value=.55;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume),t+Math.min(.012,duration*.15));g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(f);f.connect(g);g.connect(bus);o.start(t);o.stop(t+duration+.02);o.onended=()=>{this.voices--;o.disconnect();f.disconnect();g.disconnect()};}
 hiss(duration,volume,cutoff=2000,when=0,bus=this.fx,q=.65){if(!this.ctx||!this.enabled||!this.reserve(bus))return;const c=this.ctx,t=Math.max(when||c.currentTime,c.currentTime),o=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();o.buffer=this.noise;f.type='bandpass';f.frequency.value=cutoff;f.Q.value=q;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume),t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(f);f.connect(g);g.connect(bus);o.start(t,.19);o.stop(t+duration+.01);o.onended=()=>{this.voices--;o.disconnect();f.disconnect();g.disconnect()};}
 duck(seconds,warning=false){const t=this.ctx.currentTime;this.duckUntil=Math.max(this.duckUntil,t+seconds);if(warning)this.warnUntil=Math.max(this.warnUntil,t+.65);this.musicDuck.gain.setTargetAtTime(.22,t,.012);if(warning)this.fx.gain.setTargetAtTime(.27,t,.008);}
 brass(f,t,d=.25,v=.12,bus=this.fx){this.tone(f,d,v,'sawtooth',t,f,bus,1800);this.tone(f*2,d*.72,v*.38,'triangle',t+.007,f*2,bus,2600);}
 impact(t,size=1,bus=this.fx){this.hiss(.045,.30*size,2600,t,bus);this.tone(220,.19,.30*size,'triangle',t,75,bus,1700);this.hiss(.34,.22*size,720,t+.018,bus,.45);}
 effect(kind,intensity=0){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;if(t<(this.limits[kind]||0))return;this.limits[kind]=t+({shot:.085,hit:.085,'gate-tick':.105,kill:.10,boom:.20,warn:.75,join:.12,'armor-break':.25}[kind]||.12);
  if(kind==='shot'){this.hiss(.035,.16,2350);this.tone(245+intensity*8,.07,.15,'triangle',t,105);this.hiss(.055,.095,850,t+.007,this.fx,2.2);}
  else if(kind==='hit'){this.hiss(.038,.095,3300);this.tone(630,.05,.055,'triangle',t,390);}
  else if(kind==='gate-tick'){const f=570+Math.min(45,Math.max(0,intensity))*8;this.tone(f,.105,.095,'sine',t,f*.98);this.tone(f*2.37,.065,.048,'sine',t);this.hiss(.021,.10,2900);}
  else if(kind==='panel-break'){this.hiss(.065,.23,3100);[730,1170,1930].forEach((f,i)=>this.tone(f,.14-i*.025,.085/(i+1),'sine',t+i*.009,f*.74));}
  else if(kind==='gate-zero'){this.duck(.38);this.hiss(.12,.19,2400);[587.33,880,1174.66].forEach((f,i)=>this.brass(f,t+i*.055,.22,.11));}
  else if(kind==='join'||kind==='gate-cash'){const big=kind==='gate-cash'||intensity>=8;this.duck(big?.45:.18);this.impact(t,big?.65:.3);(big?[293.66,440,587.33,880]:[440,587.33]).forEach((f,i)=>this.brass(f,t+.025+i*.045,big?.34:.16,big?.12:.07));}
  else if(kind==='kill'){this.impact(t,.48);if(intensity>2)this.tone([440,523.25,587.33,880][Math.min(3,intensity-3)],.16,.07,'triangle',t+.025);}
  else if(kind==='enter'){this.duck(.75);this.hiss(.25,.17,1100);this.tone(180,.22,.18,'sawtooth',t,660);[293.66,440,587.33].forEach((f,i)=>this.brass(f,t+.22+i*.075,.55,.16));this.impact(t+.22,1);}
  else if(kind==='boss-enter'){this.duck(.9,true);[146.83,155.56,220].forEach(f=>this.brass(f,t,.7,.15,this.alert));this.hiss(.5,.23,650,t,this.alert);this.impact(t+.38,.9,this.alert);}
  else if(kind==='warn'){this.duck(.85,true);[0,.23].forEach((d,i)=>{this.tone(i?740:988,.16,.18,'sawtooth',t+d,i?740:988,this.alert,2200);this.tone(i?370:494,.17,.11,'triangle',t+d,undefined,this.alert);this.hiss(.025,.10,3100,t+d,this.alert);});}
  else if(kind==='hurt'){this.duck(.4);this.hiss(.18,.28,1600);this.tone(320,.26,.25,'sawtooth',t,95);this.tone(233,.21,.16,'triangle',t+.025,77);}
  else if(kind==='armor-break'){this.duck(.55);this.impact(t,.95);[390,670,1090,1730].forEach((f,i)=>this.tone(f,.38-i*.035,.13/(1+i*.35),'sine',t+.012*i,f*.72));this.hiss(.32,.22,3200,t+.035);}
  else if(kind==='charge'){this.duck(.6);this.tone(180,.20,.20,'sawtooth',t,750);this.hiss(.17,.14,1400);}
  else if(kind==='rupture'){this.duck(1.1);this.impact(t+.15,1.25);this.hiss(.85,.32,430,t+.18,this.fx,.45);this.tone(190,.58,.34,'triangle',t+.15,65);[0,.14,.28].forEach((d,i)=>{this.hiss(.25,.19-i*.025,1800-i*330,t+.32+d);this.tone(290-i*40,.19,.17,'triangle',t+.32+d,85);});}
  else if(kind==='boom'){this.impact(t,.85);this.tone(170,.3,.20,'triangle',t,60);}
  else if(kind==='rush'){this.duck(.35);[293.66,349.23,440,587.33].forEach((f,i)=>this.brass(f,t+i*.055,.22,.11));}
  else if(kind==='win'){this.duck(2.4);[293.66,440,587.33,523.25,587.33,880].forEach((f,i)=>this.brass(f,t+[0,.13,.26,.48,.68,.88][i],i===5?1.1:.34,.17,this.alert));[293.66,369.99,440].forEach(f=>this.brass(f,t+.88,1.2,.12,this.alert));this.hiss(.9,.12,3500,t+.88,this.alert);}
  else if(kind==='lose'){this.duck(1.5);[293.66,261.63,220,146.83].forEach((f,i)=>this.brass(f,t+i*.19,.42,.13,this.alert));}
 }
 tick(playing,rushing,boss=false){if(!this.ctx||!this.enabled)return;const c=this.ctx,t=c.currentTime,active=playing&&this.musicEnabled;this.musicDuck.gain.setTargetAtTime(t<this.duckUntil?.22:1,t,.045);this.fx.gain.setTargetAtTime(t<this.warnUntil?.27:.75,t,.045);if(active!==this.playing){this.music.gain.setTargetAtTime(active?.22:0,t,.06);this.playing=active;this.next=t+.025;if(active)this.step=0;}if(!active)return;this.section=boss?(rushing?'climax':'boss'):'battle';const beat=60/(boss?140:124)/2;let guard=0;
  while(this.next<t+.10&&guard++<3){const at=Math.max(this.next,t),i=this.step%16,bar=Math.floor(this.step/16),root=[146.83,174.61,130.81,196][bar%4],bus=this.music;
   if(i%2===0||boss){const f=root/2*[1,1,1.5,1,2,1.5,1,1.5][Math.floor(i/2)%8];this.tone(f,beat*.9,.26,'sawtooth',at,f,bus,780);this.tone(f*2,beat*.65,.095,'triangle',at,f*2,bus);}
   if(i%8===0||i===6||boss&&i===11){this.tone(180,.16,.48,'sine',at,60,bus);this.hiss(.016,.13,2200,at,bus);}
   if(i%8===4){this.hiss(.14,.30,1800,at,bus,.45);this.tone(240,.10,.20,'triangle',at,155,bus);}
   if(i%2===1||boss)this.hiss(.028,boss?.065:.045,4800,at,bus,1);
   const melody=[0,7,10,7,12,10,7,5,0,7,12,14,12,10,7,5];if(i%2===0||boss&&rushing){const f=root*2*Math.pow(2,melody[i]/12);this.brass(f,at,beat*(boss?.65:1.4),boss?.067:.052,bus);}
   if(boss&&i%4===0){this.tone(root,beat*3,.075,'sawtooth',at,root,bus,1100);this.tone(root*1.5,beat*3,.05,'triangle',at,root*1.5,bus);}this.step++;this.next=at+beat;
  }
 }
}
// CC0 recordings: see assets/audio/manifest.json and licenses/audio/.
// Representative fire bus: at most two short gun voices, independent of army size.
const RECORDED_AUDIO={gun:'0437.mp3',heavy:'0438.mp3',cock:'1987.mp3',load:'1988.mp3',hit0:'impactPunch_medium_000.wav',hit1:'impactPunch_medium_001.wav',metal:'impactMetal_light_000.wav',plate:'impactPlate_heavy_000.wav',wood:'impactWood_heavy_000.wav',glass:'impactGlass_heavy_000.wav',blast:'explosionCrunch_001.wav'};
const synthInit=BattleAudio.prototype.init,synthEffect=BattleAudio.prototype.effect;
BattleAudio.prototype.init=function(){synthInit.call(this);if(!this.ctx||this.sampleReadyPromise)return;this.recordings={};this.shotSources=new Set();this.sampleLimits={};this.sampleStats={played:0,shotPeak:0,peak:0,active:0,errors:[],loaded:0};this.sampleReadyPromise=Promise.all(Object.entries(RECORDED_AUDIO).map(async([key,file])=>{try{const response=await fetch(new URL('assets/audio/'+file,document.baseURI));if(!response.ok)throw Error(file+' HTTP '+response.status);const buffer=await this.ctx.decodeAudioData(await response.arrayBuffer()),data=buffer.getChannelData(0);let peak=0;for(const v of data)peak=Math.max(peak,Math.abs(v));const width=Math.round(buffer.sampleRate*.005),energies=[];for(let i=0;i<data.length;i+=width){let e=0;for(let j=i;j<Math.min(i+width,data.length);j++)e+=data[j]*data[j];energies.push(e);}const threshold=Math.max(...energies)*.15,onset=Math.max(0,energies.findIndex(e=>e>=threshold)*.005-.004);this.recordings[key]={buffer,peak,onset};this.sampleStats.loaded++;}catch(error){this.sampleStats.errors.push(String(error));}}));};
BattleAudio.prototype.recorded=function(key,peakLevel=.18,duration=.22,delay=0,shot=false){const sample=this.recordings?.[key];if(!sample||!this.enabled)return false;if(shot&&this.shotSources.size>=2)return true;if(!this.reserve(this.fx))return true;const c=this.ctx,t=c.currentTime+delay,source=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter(),length=Math.min(duration,sample.buffer.duration-sample.onset);source.buffer=sample.buffer;source.playbackRate.value=shot?(this.sampleStats.played%2?1.015:.985):1;filter.type='highpass';filter.frequency.value=shot?115:75;filter.Q.value=-3;const volume=peakLevel/Math.max(.05,sample.peak);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume,t+.002);gain.gain.setValueAtTime(volume,t+Math.max(.005,length-.045));gain.gain.linearRampToValueAtTime(0,t+length);source.connect(filter);filter.connect(gain);gain.connect(this.fx);if(shot)this.shotSources.add(source);this.sampleStats.played++;this.sampleStats.active++;this.sampleStats.peak=Math.max(this.sampleStats.peak,this.sampleStats.active);this.sampleStats.shotPeak=Math.max(this.sampleStats.shotPeak,this.shotSources.size);source.start(t,sample.onset);source.stop(t+length+.01);source.onended=()=>{this.voices--;this.sampleStats.active--;this.shotSources.delete(source);source.disconnect();gain.disconnect();filter.disconnect()};return true;};
BattleAudio.prototype.effect=function(kind,intensity=0){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;if(kind==='shot'&&t<(this.shotQuietUntil||0))return;const primary={shot:'gun','enemy-shot':'heavy',hit:'hit0','gate-tick':'wood','panel-break':'wood',join:'cock','gate-cash':'load','armor-break':'plate',rupture:'blast',boom:'blast'}[kind];if(!primary||!this.recordings?.[primary])return synthEffect.call(this,kind==='enemy-shot'?'shot':kind,intensity);if(t<(this.sampleLimits[kind]||0))return;this.sampleLimits[kind]=t+({shot:intensity>=4?.095:.14,'enemy-shot':.25,hit:.10,'gate-tick':.12,'panel-break':.13,join:.22,'gate-cash':.35,'armor-break':.30,rupture:.6,boom:.3}[kind]||.1);
 if(kind==='shot')this.recorded('gun',.26,.18,0,true);
 else if(kind==='enemy-shot')this.recorded('heavy',.29,.26);
 else if(kind==='hit')this.recorded(this.sampleStats.played%2?'hit0':'hit1',.095,.16);
 else if(kind==='gate-tick')this.recorded('wood',.060,.13);
 else if(kind==='panel-break'){this.recorded('wood',.20,.23);this.recorded('glass',.065,.14,.025);}
 else if(kind==='join'){this.recorded('cock',intensity>=8?.18:.12,.3);}
 else if(kind==='gate-cash'){this.duck(.45);this.recorded('load',.21,.36);this.recorded('cock',.10,.25,.1);}
 else if(kind==='armor-break'){this.duck(.5);this.recorded('plate',.32,.45);this.recorded('glass',.10,.2,.035);}
 else if(kind==='rupture'){this.shotQuietUntil=t+1.25;for(const shot of this.shotSources)try{shot.stop(t+.015)}catch{}this.duck(1.4);this.recorded('blast',.42,1.3,.12);}
 else if(kind==='boom')this.recorded('blast',.22,.5);
};

BattleAudio.prototype.setLevels=function(a){if(!this.ctx)return;this.seUser.gain.setTargetAtTime(a.seMuted?0:a.se,this.ctx.currentTime,.025);this.bgmUser.gain.setTargetAtTime(a.bgmMuted?0:a.bgm,this.ctx.currentTime,.025);};
const battleAudio=new BattleAudio();
// Timeline cues are emitted by the visual director; pause/skip schedules no future sound.
const beforeDefeatEffect=BattleAudio.prototype.effect;
BattleAudio.prototype.effect=function(kind,intensity=0){
 if(kind==='kill'){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;if(t<(this.nextKillCue||0))return;this.nextKillCue=t+.085;this.recorded(intensity%2?'hit0':'hit1',.14,.12);this.tone([330,392,440,523][Math.min(3,Math.floor(intensity/3))],.09,.055,'triangle',t);return;}
 if(!kind.startsWith('finish-')&&kind!=='elite-fall'&&kind!=='body-land')return beforeDefeatEffect.call(this,kind,intensity);
 if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;
 if(kind==='body-land'){this.recorded('hit1',.22,.2);this.hiss(.22,.1,650,t);}
 if(kind==='finish-reward'){this.duck(.55);this.recorded('load',.3,.38);this.recorded('metal',.17,.28);[440,554.37,659.25].forEach(f=>this.brass(f,t,.45,.10));}
 if(kind==='finish-hit'){this.shotQuietUntil=t+2;for(const shot of this.shotSources||[])try{shot.stop(t+.015)}catch{}this.duck(2);this.recorded('metal',.30,.2);this.tone(135,.22,.19,'triangle',t,60);}
 if(kind==='finish-break'){this.recorded('plate',.34,.42);this.recorded('glass',.12,.22);}
 if(kind==='finish-blast'){this.recorded('blast',.46,1.15);this.tone(110,.7,.21,'triangle',t,42);this.hiss(.6,.16,420,t,this.fx,.5);}
 if(kind==='finish-debris'){this.recorded('metal',.13,.3);this.recorded('plate',.10,.4,.09);}
 if(kind==='elite-fall'){this.recorded('metal',.18,.25);this.tone(240,.12,.08,'triangle',t,90);}
};
