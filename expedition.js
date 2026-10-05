'use strict';
// Authored campaign, earned equipment, and a persistent hangar.
// Loaded before checkpoint.js so result rewards participate in its atomic commit.
const EXPEDITIONS={
  5:{chapter:'II / 兵装を選ぶ',name:'中継要塞',goal:'中継塔を破壊して、要塞の装甲を崩す',tip:'右の貫通弾で盾の奥へ。塔を壊すとボスの追加砲撃が止まります。',accent:'#7ce4ff',reward:'prism',machine:'lance'},
  10:{chapter:'III / 帰還への戦い',name:'最後の救難信号',goal:'救難機を回収し、中枢のコアを撃ち抜く',tip:'救難信号は左、武装は右。赤い予告から離れ、コア露出中に反撃しよう。',accent:'#ffc67d',reward:'guardian',machine:'swarm'}
};
const RELICS={prism:{name:'プリズム・コイル',short:'貫通コイル',detail:'出撃時から貫通弾 Lv.1。盾列の奥を狙える。',icon:'◈',color:'#7ce4ff'},guardian:{name:'ガーディアン・ドローン',short:'護衛ドローン',detail:'各出撃で一度、最初の被害を最大12人分防ぐ。',icon:'◇',color:'#ffd494'}};
STAGES[4].name=EXPEDITIONS[5].name;STAGES[4].brief=EXPEDITIONS[5].goal;
STAGES[9].name=EXPEDITIONS[10].name;STAGES[9].brief=EXPEDITIONS[10].goal;
let expeditionRun=null,expeditionVictory=null,expeditionTimers=[];
const commandArtCache=new Map();
const expeditionActive=()=>!!EXPEDITIONS[expeditionRun?.mission];
const relicOwned=id=>!!arsenal.relics?.[id];
let relicInstalled=id=>relicOwned(id)&&arsenal.installed?.includes(id);
function machineSVG(id,installed=[],compact=false){
 const color={volt:'#79efe0',lance:'#a8baff',swarm:'#ffcc86'}[id]||'#79efe0';
 const weapons=id==='volt'?'<path d="M29 62 L15 48 21 25 29 21 35 43 42 55 M91 62 L105 48 99 25 91 21 85 43 78 55" fill="url(#metal-'+id+')"/><path d="M24 29 L20 47 29 55 M96 29 L100 47 91 55" fill="none" stroke="'+color+'" stroke-width="3"/>':id==='lance'?'<path d="M33 70 V14 L38 5 H45 V70 M75 70 V5 H82 L87 14 V70" fill="url(#metal-'+id+')"/><path d="M39 14 V52 M81 14 V52" stroke="'+color+'" stroke-width="3"/><path d="M31 56 H47 V64 H31 Z M73 56 H89 V64 H73 Z" fill="#263e54"/>':'<path d="M12 29 L19 20 H37 L43 28 V67 H13 Z M77 28 L83 20 H101 L108 29 107 67 H77 Z" fill="url(#metal-'+id+')"/><path d="M18 28 H36 V60 H18 Z M84 28 H102 V60 H84 Z" fill="#081522"/>'+[33,43,53].map(y=>'<path d="M22 '+y+' H31 M89 '+y+' H98" stroke="'+color+'" stroke-width="4"/>').join('');
 const gear=(installed.includes('prism')?'<path class="mounted-coil" d="M16 70 L29 61 36 73 24 83 Z M104 70 L91 61 84 73 96 83 Z" fill="#7ce4ff"/>':'')+(installed.includes('guardian')?'<g class="mounted-drone"><path d="M49 8 L60 1 71 8 60 15 Z" fill="#ffd494"/><path d="M60 15 V23" stroke-dasharray="2 3"/></g>':'');
 return '<svg xmlns="http://www.w3.org/2000/svg" class="machine-art '+(compact?'compact':'')+'" viewBox="0 0 120 130" aria-hidden="true" style="--machine-color:'+color+'"><defs><linearGradient id="metal-'+id+'" x2=".8" y2="1"><stop stop-color="#91a6b7"/><stop offset=".45" stop-color="#405a70"/><stop offset="1" stop-color="#172a3d"/></linearGradient></defs><ellipse cx="60" cy="118" rx="43" ry="7" fill="#020b15"/><g fill="url(#metal-'+id+')" stroke="#112436" stroke-width="1.8" stroke-linejoin="round">'+weapons+'<path d="M37 83 L52 82 51 102 47 118 H27 L29 107 34 101 Z M68 82 L83 83 86 101 91 107 93 118 H73 L69 102 Z"/><path d="M36 99 H49 L46 108 H33 Z M71 99 H84 L87 108 H74 Z" fill="#6f879a"/><path d="M30 114 H47 M73 114 H90" stroke="'+color+'"/><path d="M34 53 L43 45 H77 L86 53 82 77 72 89 H48 L38 77 Z"/><path d="M42 47 L60 55 78 47 78 62 60 72 42 62 Z" fill="#708ba0"/><path d="M42 63 L60 73 78 63 73 83 H47 Z" fill="#20374c"/><path d="M50 82 H70 V89 H50 Z" fill="#526d81"/><path d="M45 38 L50 25 H70 L75 38 69 51 H51 Z"/><path d="M49 37 H71 L68 43 H52 Z" fill="#051923"/><path d="M52 38 H68" stroke="'+color+'" stroke-width="3"/><path d="M52 28 H68 M40 52 L49 56 M71 56 L80 52" stroke="#d3e5ef" stroke-opacity=".6"/><path d="M54 63 L60 59 66 63 V70 L60 75 54 70 Z" fill="'+color+'"/><path d="M30 60 L40 63 37 87 H26 L22 76 Z M90 60 L80 63 83 87 H94 L98 76 Z"/><path d="M27 69 H35 M85 69 H93" stroke="'+color+'" stroke-width="2"/>'+gear+'</g></svg>';
}
const missionBrief=document.createElement('section');missionBrief.id='missionBrief';missionBrief.className='overlay hidden';missionBrief.setAttribute('aria-labelledby','missionTitle');$('app').append(missionBrief);
const missionHud=document.createElement('aside');missionHud.id='missionHud';missionHud.hidden=true;missionHud.setAttribute('aria-live','polite');$('app').append(missionHud);
const victorySequence=document.createElement('section');victorySequence.id='victorySequence';victorySequence.className='hidden';victorySequence.setAttribute('aria-labelledby','rewardTitle');$('app').append(victorySequence);
function clearExpeditionPresentation(){for(const timer of expeditionTimers)clearTimeout(timer);expeditionTimers=[];victorySequence.className='hidden';missionBrief.classList.add('hidden');$('result').classList.remove('reward-covered');$('app').classList.remove('reward-beat');}
function missionBriefing(){const m=EXPEDITIONS[expeditionRun?.mission];if(!m)return;state='paused';missionBrief.innerHTML='<span class="eyebrow">'+m.chapter+'</span><h2 id="missionTitle">'+m.name+'</h2><div class="brief-hero">'+machineSVG(runMachine.id,arsenal.installed||[])+'</div><p class="brief-goal">'+m.goal+'</p><p>'+m.tip+'</p><div class="brief-tools"><span>増援ゲート 上限 +24</span><span>'+ (m.tools||(level===5?'塔3基 / 貫通が有効':'救難機3機 / 回収は接触'))+'</span></div><button class="primary" id="beginMission">出撃する</button><p class="brief-equipped">'+(relicInstalled('prism')?'装着中：貫通コイル':'装備は道中で選べます')+'</p>';missionBrief.classList.remove('hidden');$('beginMission').onclick=()=>{missionBrief.classList.add('hidden');state='playing';fieldMode();};$('beginMission').focus();}
const expeditionMakeLevel=makeLevel;
makeLevel=function(){if(!EXPEDITIONS[level])return expeditionMakeLevel();objects=[];seed=level*752+4;expeditionRun={mission:level,relays:0,rescued:0,missed:0,bossClock:0,bossCycle:-1,bossPhase:'shield',bossAim:0,bossFired:false,wardReady:false,lastDamageAt:-10};
 const gate=(z,values)=>values.forEach((v,j)=>{addGate(z,j,v);objects.at(-1).cap=24;});
 const choices=(z,a,b,rescue=false)=>{objects.push({type:'pickup',kind:a,z,x:-.49,dead:false,hit:0,rescue},{type:'pickup',kind:b,z,x:.49,dead:false,hit:0});};
 const wave=(z,form,n,hp)=>{for(let i=0;i<n;i++){let x=form==='column'?(i%2?-.42:.42):(i%5-2)*.29;addEnemy(z+Math.floor(i/(form==='column'?2:5))*2.3,x,hp);const o=objects.at(-1);o.form=form;if(form==='column'&&i<2){o.shield=55;o.maxShield=55;o.armored=true;}}};
 gate(10,[8,12,8]);
 if(level===5){
  choices(22,'reinforce','pierce');wave(36,'column',10,15);
  for(const [z,x]of [[51,-.43],[94,.43],[137,-.43]]){addEnemy(z,x,230);Object.assign(objects.at(-1),{role:'relay',anchor:z,shield:70,maxShield:70,armored:true});}
  wave(65,'sweep',10,16);gate(76,[10,8,10]);choices(85,'wide','pierce');wave(108,'column',12,20);choices(119,'reinforce','blast');wave(143,'sweep',10,20);
  for(const [z,x]of [[59,-.66],[113,0]])objects.push({type:'obstacle',z,x,dead:false,hit:0,warned:false});
  addEnemy(175,0,1500,true);objects.at(-1).fortress=true;
 }else{
  choices(24,'reinforce','wide',true);wave(36,'sweep',15,13);wave(54,'column',6,17);gate(65,[8,10,8]);
  choices(80,'reinforce','pierce',true);wave(91,'sweep',15,17);choices(121,'reinforce','blast',true);wave(134,'sweep',15,18);
  for(const [z,x]of [[47,-.66],[70,.66],[107,0],[146,-.66]])objects.push({type:'obstacle',z,x,dead:false,hit:0,warned:false});
  for(const [z,x]of [[58,.66],[106,-.66]]){addEnemy(z,x,120);Object.assign(objects.at(-1),{role:'mortar',attack:-.5,warn:false,aim:0});}
  addEnemy(177,0,1700,true);objects.at(-1).citadel=true;
 }
 totalEnemies=objects.filter(o=>o.type==='enemy'||o.type==='boss').length;
};
const expeditionThreshold=gateThreshold,expeditionPower=firepower;
gateThreshold=function(value){return expeditionActive()?(value>=24?Infinity:8+Math.max(0,value-12)*1.4):expeditionThreshold(value);};
firepower=function(){return expeditionActive()?Math.min(army,45)+Math.sqrt(Math.max(0,army-45))*1.8:expeditionPower();};
const expeditionChangeArmy=changeArmy;
changeArmy=function(n){if(n<0&&expeditionRun?.wardReady){const blocked=Math.min(12,-n);n+=blocked;expeditionRun.wardReady=false;toast('護衛ドローン / '+blocked+'人分の被害を防いだ','#ffdb91');battleAudio.effect('upgrade');}if(n===0)return;return expeditionChangeArmy(n);};
const expeditionEquip=equip;
equip=function(kind){const rescue=expeditionActive()&&objects.find(o=>o.type==='pickup'&&o.rescue&&Math.abs(o.z-distance)<2.2&&o.dead&&((o.x<0&&px<0)||(o.x>0&&px>=0)));if(rescue&&!rescue.claimed){rescue.claimed=true;expeditionRun.rescued++;changeArmy(8);battleAudio.effect('upgrade');toast('救難機 回収 '+expeditionRun.rescued+'/'+(EXPEDITIONS[level].rescueGoal||3)+' / 護衛が合流','#ffd494');return;}return expeditionEquip(kind);};
const expeditionStart=start;
start=function(n=level){clearExpeditionPresentation();expeditionVictory=null;expeditionRun=null;expeditionStart(n);if(!expeditionRun)expeditionRun={mission:0,relays:0,rescued:0,wardReady:false};if(EXPEDITIONS[level]){if(!lesson)army=maxArmy=12;if(!lesson)coach.hidden=true;$('app').classList.add('expedition');}else $('app').classList.remove('expedition');expeditionRun.wardReady=relicInstalled('guardian');if(relicInstalled('prism')){piercing=1;modules[1]=1;}updateHUD();updateMissionHud();missionBriefing();};
function restoreExpedition(saved){clearExpeditionPresentation();expeditionRun=saved||null;$('app').classList.toggle('expedition',expeditionActive());updateMissionHud();}
const expeditionHit=hitEnemy;
hitEnemy=function(o,damage,kind='rapid'){
 if(!expeditionActive())return expeditionHit(o,damage);
 if(o.role==='relay'){damage*=kind==='pierce'?2.4:kind==='lance'?1.5:kind==='volt'?1.1:.7;}
 if(o.armored&&o.role!=='relay'&&kind==='pierce')damage*=1.6;
 if(o.type==='boss'){
  if(expeditionRun.bossPhase==='shield')damage*=kind==='pierce'?.60:kind==='lance'?.50:.20;
  else damage*=1.45;
  if(EXPEDITIONS[level].relayGoal)damage*=1+expeditionRun.relays*.22;
 }
 if(o.type==='boss'&&level===10&&!expeditionRun.secondCore)damage=Math.min(damage,Math.max(0,o.hp-o.maxHp*.5));
 const wasAlive=!o.dead;expeditionHit(o,damage);
 if(o.type==='boss'&&level===10&&!expeditionRun.secondCore&&o.hp<=o.maxHp*.5){expeditionRun.secondCore=true;expeditionRun.bossClock=8;expeditionRun.bossPhase='shield';battleAudio.effect('boom');rings.push({x:o.x,z:o.z-distance,life:.6,max:.6,color:'#ffe3a1'});toast('第一コア破壊 / 交差砲火を回避','#ffe3a1');}
 if(wasAlive&&o.dead&&o.role==='relay'){expeditionRun.relays++;battleAudio.effect('boom');toast('中継塔 破壊 '+expeditionRun.relays+'/'+(EXPEDITIONS[level].relayGoal||3)+' / 要塞装甲を低下','#8de9ff');}
};
function updateMissionHud(){const active=expeditionActive()&&['playing','paused'].includes(state),target=active&&objects.filter(o=>!o.dead&&o.z-distance>0&&o.z-distance<34).find(o=>o.type==='boss'||o.role==='relay'||o.role==='prism');missionHud.hidden=!target;if(!target)return;const text=target.role==='relay'?'塔 '+expeditionRun.relays+'/'+(EXPEDITIONS[level].relayGoal||1)+(runMachine.id==='swarm'?' · 照準を固定':' · 貫通で撃破'):target.role==='prism'?'盾の青い側面を狙う':expeditionRun.bossPhase==='core'?'コア露出':'赤い射線から離れる';if(missionHud.textContent!==text)missionHud.textContent=text;}
const expeditionUpdate=update;
update=function(dt){
 if(expeditionActive()&&state==='playing'){
  const r=expeditionRun;for(const o of objects){if(o.role==='relay'&&!o.dead){o.z=o.anchor;if(o.z-distance<3){o.dead=true;r.missed++;toast('中継塔を通過 / 次の標的へ','#b7cad7');}}if(o.type==='boss'){o.attack=-100;if(!o.finalCitadel)o.warn=false;}}
  const boss=objects.find(o=>o.type==='boss'&&!o.dead);if(boss&&!boss.finalCitadel&&boss.z-distance<39){r.bossClock+=dt;const cycle=Math.floor(r.bossClock/8),t=r.bossClock%8;if(cycle!==r.bossCycle){r.bossCycle=cycle;r.bossAim=px;r.bossFired=false;battleAudio.effect('warn');}
   r.bossPhase=t<3.1?'shield':'core';boss.weakSide=cycle%2?.38:-.38;boss.x+=( (r.bossPhase==='core'?boss.weakSide:0)-boss.x)*Math.min(1,dt*2.5);
   boss.warn=t<2;boss.aim=r.bossAim;boss.aim2=level===10&&r.secondCore?(r.bossAim>0?-.55:.55):EXPEDITIONS[level].relayGoal&&r.relays<EXPEDITIONS[level].relayGoal?boss.weakSide:null;
   if(t>=2&&!r.bossFired){r.bossFired=true;objects.push({type:'hazard',x:r.bossAim,z:boss.z-2,dead:false});if(boss.aim2!==null)objects.push({type:'hazard',x:boss.aim2,z:boss.z-2,dead:false});battleAudio.effect('boom');}
  }
 }
 expeditionUpdate(dt);updateMissionHud();
};
const expeditionObject=drawObject;
drawObject=function(o){if(!expeditionActive())return expeditionObject(o);const rel=o.z-distance;if(rel>110||rel<-.5)return;const p=project(o.x,rel),s=p.s;
 if(o.role==='relay'){ctx.save();ctx.translate(p.x,p.y);ctx.scale(s,s);ctx.shadowColor='#76e0ff';ctx.shadowBlur=o.hit>0?20:4;poly([[-24,0],[24,0],[18,-64],[9,-83],[-9,-83],[-18,-64]],o.hit>0?'#e6ffff':'#254d65','#8ce8ff');round(-10,-63,20,34,3,'#103247','#7ce4ff');ctx.fillStyle='#7ce4ff';ctx.fillRect(-5,-59,10,26);ctx.shadowBlur=0;ctx.restore();if(rel<45){txt('中継塔',p.x,p.y-99*s,Math.max(12,14*s),'#adf3ff');round(p.x-28*s,p.y-88*s,56*s,4*s,1,'#081624');round(p.x-28*s,p.y-88*s,56*s*clamp((o.hp+Math.max(0,o.shield))/(o.maxHp+o.maxShield),0,1),4*s,1,'#7ce4ff');}return;}
 if(o.type==='boss'){const core=expeditionRun.bossPhase==='core';if(o.warn){threatLane(o.aim,rel,'#ff826e','照準固定');if(typeof o.aim2==='number')threatLane(o.aim2,rel,'#ff826e','交差砲火');}ctx.save();ctx.translate(p.x,p.y);ctx.scale(s,s);const amber=level===10,edge=core?'#fff0b1':amber?'#dba583':'#82d9ed';ctx.shadowColor=edge;ctx.shadowBlur=o.hit>0?18:0;for(const side of[-1,1]){poly([[side*30,-104],[side*65,-84],[side*57,-24],[side*34,-11],[side*23,-63]],'#273f50',edge);round(side*52-8,-82,16,47,3,'#152937',edge);round(side*33-11,-28,22,32,4,'#172c3e',edge);}poly([[-31,-91],[0,-114],[31,-91],[25,-30],[0,-18],[-25,-30]],o.hit>0?'#dceaff':'#304e63',edge);round(-15,-110,30,15,3,'#112a40',edge);round(-10,-106,20,4,1,'#fff2cf');if(core){ctx.shadowBlur=22;poly([[-17,-66],[0,-88],[17,-66],[0,-43]],'#ffdf85','#fff5c8');}else{poly([[-26,-74],[0,-96],[26,-74],[21,-40],[0,-29],[-21,-40]],'#235777dd','#8fdff8');}ctx.shadowBlur=0;ctx.restore();if(rel<43){txt(core?'CORE / 反撃':'BASTION / 装甲',p.x,p.y-130*s,Math.max(12,15*s),core?'#ffe7a0':'#b6e8fc');round(p.x-64*s,p.y-117*s,128*s,6*s,2,'#081927');round(p.x-64*s,p.y-117*s,128*s*clamp(o.hp/o.maxHp,0,1),6*s,2,core?'#ffde85':'#74d8f0');}return;}
 if(o.type==='gate'){expeditionObject(o);if(gateNumberVisible(o)&&rel<30)txt(o.value>=reinforcementCap()?'増援 MAX':'上限 +'+reinforcementCap(),p.x,p.y+13*s,Math.max(11,12*s),'#b5e6f3');return;}
 expeditionObject(o);
};
const expeditionRenderHangar=renderHangar;
renderHangar=function(){expeditionRenderHangar();$('hangar').classList.add('foundry');let bay=$('hangarBay');if(!bay){bay=document.createElement('section');bay.id='hangarBay';$('materialCount').before(bay);}const installed=arsenal.installed||[];const selected=MACHINES.find(m=>m.id===chosenMachine);bay.innerHTML='<div class="hangar-platform">'+machineSVG(chosenMachine,installed)+'<span>'+selected.name+' / '+selected.tag+'</span></div><div class="module-rack">'+Object.entries(RELICS).map(([id,r])=>'<div class="module-slot '+(installed.includes(id)?'installed':relicOwned(id)?'ready':'locked')+'"><div class="slot-gear">'+(typeof relicSVG==='function'?relicSVG(id):r.icon)+'</div><span>'+r.short+'</span><small>'+(installed.includes(id)?((id==='prism'?arsenal.relics[id]?.relays:arsenal.relics[id]?.rescued)===3?'完全達成 / 装着中':'装着中'):relicOwned(id)?'装着できます':id==='prism'?'作戦05で獲得':'作戦10で獲得')+'</small><i class="mastery-pips" aria-label="任務の達成数">'+[0,1,2].map(n=>'<em class="'+(n<(id==='prism'?arsenal.relics?.[id]?.relays||0:arsenal.relics?.[id]?.rescued||0)?'earned':'')+'"></em>').join('')+'</i></div>').join('')+'</div>';
 for(const card of $('machineCards').children){const id=card.querySelector('[data-equip],[data-trial],[data-unlock]')?.dataset;const key=id?.equip||id?.trial||id?.unlock;if(key)card.querySelector('.machine-symbol').innerHTML=machineSVG(key,installed,true);}
 let action=$('hangarMissionAction');if(!action){action=document.createElement('div');action.id='hangarMissionAction';$('machineCards').before(action);}const pending=Object.keys(RELICS).find(id=>relicOwned(id)&&!installed.includes(id));const v=expeditionVictory;
 action.innerHTML=pending?'<p>'+RELICS[pending].detail+'</p><button class="primary" id="installRelic">'+RELICS[pending].short+'を装着</button>':v?'<p>'+ (v.level===10?'救出した仲間と、新装備を試そう。':v.reward?'次の作戦で、装着した貫通弾を試そう。':'次の戦線に合わせて機体を選ぼう。')+'</p><button class="primary" id="deployFromHangar">'+(v.level===10?'新装備で迎撃演習':'この機体で次の作戦へ')+'</button>':'';
 if(pending)$('installRelic').onclick=()=>{arsenal.installed=[...new Set([...(arsenal.installed||[]),pending])];const preferred=pending==='prism'?'lance':'swarm';if(arsenal.owned.includes(preferred)){chosenMachine=arsenal.selected=preferred;}saveArsenal();battleAudio.effect('upgrade');renderHangar();$('hangarBay').classList.add('install-flash');showEquipmentDemo(pending);};
 if($('deployFromHangar'))$('deployFromHangar').onclick=()=>{const target=v.level===10?10:v.level+1;start(target,true);};
};
function resultMaterialEarned(base){return base+(expeditionVictory?.bonus||0);}
const expeditionFinish=finish;
finish=function(win){if(state!=='playing')return;expeditionFinish(win);if(!win||!expeditionActive())return;const r=expeditionRun,m=EXPEDITIONS[level];if(!m.reward){finishCampaignOperation();return;}const first=!relicOwned(m.reward),joined=!arsenal.owned.includes(m.machine),bonus=(level===5?r.relays*4:r.rescued*5);arsenal.credits+=bonus;arsenal.relics={...(arsenal.relics||{})};const oldRelic=arsenal.relics[m.reward];arsenal.relics[m.reward]={operation:level,score:Math.max(score,oldRelic?.score||0),rescued:Math.max(r.rescued,oldRelic?.rescued||0),relays:Math.max(r.relays,oldRelic?.relays||0)};if(!arsenal.owned.includes(m.machine))arsenal.owned.push(m.machine);expeditionVictory={level,reward:m.reward,first,joined,bonus,earned:30+Math.min(30,Math.floor(kills/5))+bonus,relays:r.relays,rescued:r.rescued};missionHud.hidden=true;coach.hidden=true;showVictorySequence();renderHangar();};
function showVictorySequence(){const v=expeditionVictory,r=RELICS[v.reward];$('result').classList.add('reward-covered');$('app').classList.add('reward-beat');victorySequence.className='victory-beat';victorySequence.innerHTML='<div class="victory-signal">'+debriefScene()+'<span>OPERATION '+String(v.level).padStart(2,'0')+' COMPLETE</span><h2>'+ (v.level===10?'全員、帰還へ。':'要塞、沈黙。')+'</h2><p>作戦報酬を回収</p></div><div class="reward-reveal" hidden><span class="eyebrow">'+(v.first?'新しい装備を獲得':'作戦報酬')+'</span><div class="reward-art">'+relicSVG(v.reward)+'</div><h2 id="rewardTitle">'+r.name+'</h2><p>'+r.detail+'</p><div class="earned-strip"><b>開発素材 +'+v.earned+'</b><span>'+(v.level===5?'中継塔 '+v.relays+'/3 基破壊':'救難機 '+v.rescued+'/3 機救出')+' / 任務加算 +'+v.bonus+'</span></div><p class="reward-save" id="rewardSave"></p><button class="primary" id="visitFoundry">格納庫で'+(relicInstalled(v.reward)?'装備を確認':'装着する')+'</button><button class="textbutton" id="showMissionStats">戦績を見る</button></div><button class="textbutton" id="skipRewardBeat">演出をスキップ</button>';
 const reveal=()=>{if(!expeditionVictory)return;victorySequence.className='revealed';victorySequence.querySelector('.victory-signal').hidden=true;victorySequence.querySelector('.reward-reveal').hidden=false;$('skipRewardBeat').hidden=true;$('app').classList.remove('reward-beat');$('rewardSave').textContent=typeof checkpointFailed!=='undefined'&&checkpointFailed?'未保存です。画面を閉じず、保存を再試行してください。':(v.joined?'機体も加入：'+MACHINES.find(m=>m.id===EXPEDITIONS[v.level].machine).name:v.first?'獲得した装備を格納庫に保管しました。':'獲得済み装備は格納庫に残っています。');battleAudio.effect('upgrade');$('visitFoundry').focus();};
 expeditionTimers.push(setTimeout(reveal,matchMedia('(prefers-reduced-motion: reduce)').matches?0:1800));$('skipRewardBeat').onclick=reveal;
 $('visitFoundry').onclick=()=>{clearExpeditionPresentation();openHangar();$('hangar').scrollTop=0;};$('showMissionStats').onclick=()=>{clearExpeditionPresentation();$('researchResult').textContent='開発素材 +'+v.earned+' / 任務加算 +'+v.bonus;};
}
const expeditionHome=home;
home=function(){clearExpeditionPresentation();missionHud.hidden=true;$('app').classList.remove('expedition');expeditionHome();};
const expeditionCampaign=refreshCampaign;
refreshCampaign=function(){expeditionCampaign();for(const [n,label]of [[1,'I / 初陣 — 基本戦術'],[4,'II / 突破 — 武装と目標'],[8,'III / 帰還 — 複合戦']]){const title=document.createElement('h3');title.className='chapter-heading';title.textContent=label;$('stageGrid').querySelector('[data-stage="'+n+'"]').before(title);}};
refreshCampaign();renderHangar();
