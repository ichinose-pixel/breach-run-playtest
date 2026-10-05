'use strict';
// The first three operations teach one decision at a time; later layouts combine them.
const CAMPAIGN_OPERATIONS={
 1:{chapter:'I / 初陣',name:'突破口',goal:'ゲートで増援し、前哨機を突破する',tip:'射撃は自動。下のエリアを左右にドラッグして、青いゲートを撃とう。',tools:'増援 → 合流 → 弾幕が進化',focus:'増援を育てる',fieldHint:'青いゲートの正面へ',boss:650,end:135,theme:'dawn',recommend:'volt'},
 2:{chapter:'I / 初陣',name:'照準を振り切れ',goal:'突撃と赤い砲撃予告を、横移動でかわす',tip:'オレンジの突撃兵は早めに撃破。赤い照準が固定されたら、空いた列へ。',tools:'予告 → 横へ回避 → 反撃',focus:'予告を見て移動',fieldHint:'黄黒の障害物は撃てません',boss:850,end:149,theme:'dawn',recommend:'volt'},
 3:{chapter:'I / 初陣',name:'密集突破',goal:'ワイドと榴弾で、密集部隊を一掃する',tip:'右のワイドは左右へ弾が広がる。榴弾は固まった敵をまとめて撃破。',tools:'ヴォルトの連鎖 × 密集部隊',focus:'範囲攻撃を試す',fieldHint:'右の武装で弾幕を広げよう',boss:1000,end:160,theme:'dawn',recommend:'volt'},
 4:{chapter:'II / 突破',name:'鋼鉄の列',goal:'貫通弾で、盾の後ろの隊列を撃ち抜く',tip:'右の貫通を選び、盾列に照準を合わせる。ランサーは同じ方向を狙うほど強くなる。',tools:'盾列 / 貫通・ランサーが有効',focus:'盾の奥まで貫通',fieldHint:'直線の敵には貫通弾',boss:1150,end:169,theme:'steel',recommend:'lance'},
 6:{chapter:'II / 突破',name:'迫撃回廊',goal:'左右の砲撃兵を先に止め、安全な進路を作る',tip:'装着したコイルで盾を抜き、端の砲撃兵へ照準を切り替えよう。赤い列に留まらない。',tools:'砲撃兵の優先撃破 × 横移動',focus:'砲撃源を止める',fieldHint:'端の砲撃兵を優先',boss:1250,end:172,theme:'steel',recommend:'swarm'},
 7:{chapter:'II / 突破',name:'救難航路',goal:'2機の救難機を回収し、撤収路を開く',tip:'金色の救難信号に触れると仲間が合流。反対側の武装と、どちらを取るか選ぼう。',tools:'救難機2機 / 接触で回収',focus:'救出と武装の選択',fieldHint:'金色の信号に触れて救出',rescueGoal:2,boss:1250,end:174,theme:'night',recommend:'swarm'},
 8:{chapter:'III / 帰還',name:'封鎖線の継ぎ目',goal:'2基の中継塔を狙い、盾列と砲撃を突破する',tip:'貫通で塔を止めるか、増援で生存余裕を確保するか。砲撃予告中は撃ち続けず回避。',tools:'中継塔2基 × 盾 × 砲撃',focus:'狙うか、避けるか',fieldHint:'塔の停止で要塞の副砲も停止',relayGoal:2,boss:1400,end:175,theme:'night',recommend:'lance'},
 9:{chapter:'III / 帰還',name:'撤収路の奪還',goal:'密集部隊と突撃を掃討し、1機の救難機を連れ帰る',tip:'密集にはワイド・榴弾。突撃には横移動。救難機は終盤、左の信号で回収できる。',tools:'範囲攻撃 × 回避 × 救出',focus:'武装を組み合わせる',fieldHint:'密集は範囲攻撃、突撃は回避',rescueGoal:1,boss:1450,end:176,theme:'night',recommend:'volt'}
};
Object.assign(EXPEDITIONS,CAMPAIGN_OPERATIONS);
Object.assign(EXPEDITIONS[5],{relayGoal:3,tools:'塔3基 / 貫通が有効',theme:'steel',recommend:'lance'});
Object.assign(EXPEDITIONS[10],{rescueGoal:3,tools:'救難機3機 / 回収は接触',theme:'night',recommend:'swarm'});
for(const [n,m]of Object.entries(EXPEDITIONS)){STAGES[n-1].name=m.name;STAGES[n-1].brief=m.goal;}
const representativeMakeLevel=makeLevel;
makeLevel=function(){const m=CAMPAIGN_OPERATIONS[level];if(!m)return representativeMakeLevel();objects=[];seed=level*752+4;expeditionRun={mission:level,relays:0,rescued:0,missed:0,bossClock:0,bossCycle:-1,bossPhase:'shield',bossAim:0,bossFired:false,wardReady:relicInstalled('guardian'),lastDamageAt:-10};
 const gate=(z,values=[8,12,8])=>values.forEach((v,j)=>{addGate(z,j,v);objects.at(-1).cap=24;});
 const choice=(z,a,b,rescue=false)=>objects.push({type:'pickup',kind:a,z,x:-.49,dead:false,hit:0,rescue},{type:'pickup',kind:b,z,x:.49,dead:false,hit:0});
 const wave=(z,form,n,hp)=>{for(let i=0;i<n;i++){const cols=form==='column'?2:form==='cluster'?4:5;const x=form==='column'?(i%2?-.42:.42):(i%cols-(cols-1)/2)*(form==='cluster'?.22:.29);addEnemy(z+Math.floor(i/cols)*2.3,x,hp);const o=objects.at(-1);o.form=form;if(form==='column'&&i<2)Object.assign(o,{shield:45,maxShield:45,armored:true});}};
 const mortar=(z,x)=>{addEnemy(z,x,85);Object.assign(objects.at(-1),{role:'mortar',attack:-.5,warn:false,aim:0});};
 const charge=(z,x)=>{addEnemy(z,x,52);Object.assign(objects.at(-1),{role:'charger',wind:0,aim:null,dashing:false});};
 const obstacle=(z,x)=>objects.push({type:'obstacle',z,x,dead:false,hit:0,warned:false});
 const tower=(z,x)=>{addEnemy(z,x,210);Object.assign(objects.at(-1),{role:'relay',anchor:z,shield:60,maxShield:60,armored:true});};
 gate(10);
 switch(level){
 case 1:choice(25,'reinforce','wide');wave(39,'sweep',10,9);gate(64);wave(84,'cluster',12,11);choice(103,'reinforce','wide');break;
 case 2:choice(23,'reinforce','wide');wave(35,'sweep',10,10);charge(56,.55);obstacle(70,-.66);gate(83);mortar(110,.66);wave(118,'cluster',8,12);break;
 case 3:choice(22,'reinforce','wide');wave(37,'sweep',15,12);wave(60,'cluster',16,14);gate(81);choice(98,'wide','blast');wave(117,'cluster',20,15);break;
 case 4:choice(22,'reinforce','pierce');wave(40,'column',12,16);gate(72);choice(87,'wide','pierce');wave(107,'column',14,19);obstacle(130,0);break;
 case 6:choice(22,'reinforce','pierce');mortar(43,-.66);wave(53,'column',8,16);mortar(79,.66);gate(93);choice(106,'wide','blast');mortar(127,-.66);wave(139,'sweep',10,18);obstacle(148,.66);break;
 case 7:choice(24,'reinforce','wide',true);wave(42,'sweep',15,13);charge(65,.55);gate(83);choice(103,'reinforce','pierce',true);wave(120,'column',10,17);obstacle(142,0);break;
 case 8:choice(22,'reinforce','pierce');wave(37,'column',10,17);tower(58,-.43);mortar(85,.66);gate(94);choice(106,'reinforce','pierce');tower(126,.43);wave(141,'column',10,19);obstacle(151,-.66);break;
 case 9:choice(22,'reinforce','wide');wave(39,'cluster',16,15);charge(62,-.55);charge(74,.55);gate(88);choice(101,'wide','blast');wave(117,'cluster',20,17);choice(136,'reinforce','pierce',true);obstacle(149,.66);break;
 }
 addEnemy(m.end,0,m.boss,true);objects.at(-1).fortress=true;totalEnemies=objects.filter(o=>o.type==='enemy'||o.type==='boss').length;
};
function finishCampaignOperation(){const r=expeditionRun,m=EXPEDITIONS[level],bonus=r.relays*4+r.rescued*5;arsenal.credits+=bonus;expeditionVictory={level,bonus,earned:30+Math.min(30,Math.floor(kills/5))+bonus,relays:r.relays,rescued:r.rescued};missionHud.hidden=true;coach.hidden=true;$('result').classList.add('reward-covered');$('app').classList.add('reward-beat');victorySequence.className='victory-beat';victorySequence.innerHTML='<div class="victory-signal">'+debriefScene()+'<span>OPERATION '+String(level).padStart(2,'0')+' COMPLETE</span><h2>進路、確保。</h2><p>'+m.name+' 突破</p></div><div class="reward-reveal" hidden><span class="eyebrow">'+m.chapter+' / 作戦完了</span><div class="brief-hero">'+machineSVG(runMachine.id,arsenal.installed||[])+'</div><h2 id="rewardTitle">次の戦線へ</h2><div class="earned-strip"><b>開発素材 +'+expeditionVictory.earned+'</b><span>'+(m.relayGoal?'中継塔 '+r.relays+'/'+m.relayGoal:m.rescueGoal?'救難機 '+r.rescued+'/'+m.rescueGoal:'部隊と機体を強化する素材を回収')+'</span></div><p>'+EXPEDITIONS[level+1].name+' — '+EXPEDITIONS[level+1].goal+'</p><p id="campaignSaveStatus"></p><button class="primary" id="campaignNext">作戦 '+String(level+1).padStart(2,'0')+' へ</button><button class="secondary" id="campaignHangar">格納庫で機体を選ぶ</button><button class="textbutton" id="showMissionStats">戦績を見る</button></div><button class="textbutton" id="skipRewardBeat">演出をスキップ</button>';
 const reveal=()=>{victorySequence.className='revealed';victorySequence.querySelector('.victory-signal').hidden=true;victorySequence.querySelector('.reward-reveal').hidden=false;$('skipRewardBeat').hidden=true;$('app').classList.remove('reward-beat');$('campaignSaveStatus').textContent=typeof checkpointFailed!=='undefined'&&checkpointFailed?'未保存です。画面を閉じず、保存を再試行してください。':'進行と素材を保存しました。';battleAudio.effect('upgrade');};expeditionTimers.push(setTimeout(reveal,matchMedia('(prefers-reduced-motion: reduce)').matches?0:1500));$('skipRewardBeat').onclick=reveal;$('campaignNext').onclick=()=>start(level+1,true);$('campaignHangar').onclick=()=>{clearExpeditionPresentation();openHangar();};$('showMissionStats').onclick=()=>{clearExpeditionPresentation();$('researchResult').textContent='開発素材 +'+expeditionVictory.earned;};renderHangar();
}
// Preserve the existing tutorial and its saveable state; avoid teaching two inputs at once.
const campaignBriefing=missionBriefing;
missionBriefing=function(){campaignBriefing();const m=EXPEDITIONS[level];if(m){const tools=missionBrief.querySelector('.brief-tools');tools.innerHTML='<span>'+m.tools+'</span><span>おすすめ：'+MACHINES.find(x=>x.id===m.recommend).name+'</span>';if(lesson)missionBrief.querySelector('.brief-equipped').textContent='最初に、ゲートを撃って通る練習から。';if(level>=4&&runMachine.id!==m.recommend){const button=document.createElement('button');button.id='briefMachineSwitch';button.className='textbutton';const owned=arsenal.owned.includes(m.recommend);button.textContent=MACHINES.find(x=>x.id===m.recommend).name+'に切り替える'+(owned?'':'（1戦試乗）');$('beginMission').before(button);button.onclick=()=>{chosenMachine=m.recommend;if(owned){arsenal.selected=chosenMachine;saveArsenal();}start(level,true);};}}};
const campaignBackground=background;
background=function(){campaignBackground();if(!expeditionActive())return;const theme=EXPEDITIONS[level].theme;ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=theme==='dawn'?'#753b1c20':theme==='night'?'#48255d18':'#14647713';ctx.fillRect(0,0,W,H*.65);ctx.restore();};
refreshCampaign();
