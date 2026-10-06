const g=(d,x,v)=>({type:'gate',d,x,value:v}),p=(d,x)=>({type:'panel',d,x,hp:1,gain:1}),r=(d,x,hp,gain)=>({type:'rescue',d,x,hp,gain}),e=(d,x,hp=4,role='guard')=>({type:'enemy',d,x,hp,role}),s=(d,x)=>({type:'spikes',d,x}),a=(d,x,hp=10)=>({type:'armor',d,x,hp,gain:3});
const chain=(d,x,n)=>Array.from({length:n},(_,i)=>p(d+i*2.8,x));const wave=(d,n=4)=>Array.from({length:n},(_,i)=>e(d+(i%2)*1.5,(i-(n-1)/2)*1.15,4));
const assault=(at,n,cx=0,speed=7.4)=>Array.from({length:n},(_,i)=>({...e(0,cx+(i%4-1.5)*.76,3),spawnAt:at,spawnZ:-10-Math.floor(i/4)*1.05,approach:speed}));
const commander=(at,hp,name)=>({...e(0,0,hp,'tankBoss'),spawnAt:at,spawnZ:-17,approach:3.5,boss:true,bossName:name,mobile:true});
export const STAGES=[
{name:'前線突破',startForce:1,pressure:true,durationHint:27,tip:'増援を取り、迫る集団を押し返せ。',objects:[g(10,-1.8,3),...chain(17,-1.8,6),r(25,1.8,6,10),...assault(4.4,24,-.5),...assault(6.8,24,.6),...assault(9.2,24,-.6),r(35,-1.8,5,8),...assault(11.6,24,.6),...assault(14,24,0),...assault(15.8,16,.6),...assault(18.4,12,-.5),commander(17.3,180,'前線指揮車') ]},
{name:'追撃の回廊',startForce:3,pressure:true,durationHint:28,tip:'左右の増援をつなぎ、追撃部隊を突破。',objects:[g(10,1.8,-9),...chain(17,1.8,6),r(25,-1.8,8,10),...assault(4.2,28,.4,7.6),...assault(6.5,28,-.5,7.6),...assault(8.8,28,.5,7.6),r(36,1.8,6,8),...assault(11.1,28,-.5,7.6),...assault(13.4,28,.5,7.6),...assault(15.5,20,-.5,7.6),...assault(18.4,12,0,7.6),commander(17,220,'追撃指揮車')]},
{name:'包囲線を破れ',startForce:3,pressure:true,durationHint:29,tip:'接近する包囲部隊を掃射し、指揮車を止めろ。',objects:[g(10,-1.8,-9),...chain(17,-1.8,6),r(25,1.8,8,10),...assault(4.2,28,-.5,7.8),...assault(6.4,28,.6,7.8),...assault(8.6,28,-.6,7.8),r(36,-1.8,6,10),...assault(10.8,28,.5,7.8),...assault(13,28,-.4,7.8),...assault(15.2,20,.5,7.8),...assault(17.8,24,0,7.8),commander(16.8,250,'包囲指揮車')]},
{name:'増援か、斥候か',startForce:3,tip:'増援を取り、接近する軽装兵を止めよう。',objects:[g(18,-1.8,-10),...chain(29,-1.8,7),p(19,3.8),e(48,.7,8,'runner'),r(54,1.8,12,12),...wave(58,3),...wave(67,4),...wave(77,5),...wave(88,5)]},
{name:'遠くの赤い射線',startForce:3,tip:'赤い線が止まったら横へ。長銃の狙撃兵を先に倒そう。',objects:[g(19,1.8,-12),...chain(32,1.8,8),r(49,-1.8,16,12),e(66,.8,55,'sniper'),...wave(69,4),...wave(82,5),e(96,-1.5,65,'sniper'),...wave(103,5)]},
{name:'砲撃の輪を抜けろ',startForce:3,tip:'赤い着弾の輪から移動。砲台を壊して道を開こう。',objects:[g(19,-1.8,-12),...chain(32,-1.8,9),r(50,1.8,16,12),...wave(64,4),e(73,1.2,100,'turret'),...wave(83,5),r(89,-1.8,20,8),e(105,-1.2,115,'turret'),...wave(110,5)]},
{name:'鋼鉄の行進',startForce:3,tip:'戦車は砲撃前に狙いを固定。横へ避けて撃ち返そう。',objects:[g(20,1.8,-16),...chain(33,1.8,9),r(52,-1.8,18,12),e(68,0,150,'tank'),...wave(76,5),e(88,1.7,8,'runner'),r(94,1.8,20,10),e(111,-1,170,'tank'),...wave(115,5)]},
{name:'交差する火線',startForce:3,tip:'接近する斥候を止め、狙撃の線から離れよう。救出で立て直せる。',objects:[g(20,-1.8,-16),...chain(33,-1.8,9),r(52,1.8,18,12),e(66,-.5,8,'runner'),...wave(73,5),e(84,1.2,70,'sniper'),r(94,-1.8,22,10),...wave(104,5),e(116,-1.2,150,'turret'),...wave(121,5)]},
{name:'突破の前線',startForce:3,tip:'増援をつないで砲台、戦車の順に突破。着弾の輪を見よう。',objects:[g(20,1.8,-16),...chain(33,1.8,10),r(54,-1.8,20,12),e(72,1.2,135,'turret'),...wave(79,5),r(92,1.8,22,10),e(104,-1.2,190,'tank'),...wave(113,5),e(126,1.1,80,'sniper'),...wave(132,5)]},
{name:'大隊、帰還せよ',startForce:3,tip:'仲間と弾幕を育てて指揮戦車へ。砲撃を避け、全員で帰還しよう。',objects:[g(21,-1.8,-20),...chain(35,-1.8,10),r(57,1.8,22,14),e(72,.8,8,'runner'),...wave(79,5),e(91,-1.2,85,'sniper'),r(102,1.8,22,10),...wave(112,5),...wave(122,5),e(140,0,320,'tankBoss')]}
];

// Keep each operation's specialist enemies and their HP; bring their encounter
// schedule into the close-range crowd cadence established by operations 01–03.
for(let i=3;i<STAGES.length;i++){
 const stage=STAGES[i],old=stage.objects;let panel=0,rescue=0,special=0;
 const support=old.filter(o=>o.type!=='enemy').map(o=>{
  if(o.type==='gate')return {...o,d:10};
  if(o.type==='panel')return {...o,d:17+panel++*2.4};
  if(o.type==='rescue')return {...o,d:rescue++?44:28};
  return {...o,d:o.d*.6};
 });
 const specialists=old.filter(o=>o.type==='enemy'&&o.role!=='guard').map(o=>{
  const j=special++,boss=o.role==='tankBoss';
  return {...o,d:0,spawnAt:boss?22:7.8+j*6.3,spawnZ:o.role==='runner'?-13:-19,approach:o.role==='runner'?7.6:4,...(boss?{boss:true,bossName:'最終指揮車',mobile:true}:{})};
 });
 const times=i===3?[4.4,6.8,9.2,11.6,14,16.4,18.8]:[4.4,6.8,9.2,11.6,14,16.4,18.8,21.2];
 const crowds=times.flatMap((t,j)=>assault(t,j%3===1?20:24,j%2?.65:-.65,7.6));
 if(i===3)specialists.push(commander(19.4,240,'突破阻止指揮車'));
 stage.pressure=true;stage.durationHint=i===3?29:32;
 stage.objects=[...support,...crowds,...specialists];
}

// Three representative decade-band prototypes. Other bands remain unchanged
// until the representative strategies pass review.
const squad=(at,formation,n=12,speed=6.8)=>Array.from({length:n},(_,i)=>{
 const cols=formation==='line'?8:formation==='split'?6:4,row=Math.floor(i/cols),col=i%cols;
 const x=formation==='line'?-3.5+col:formation==='split'?(col<3?-3.25+col*.65:1.95+(col-3)*.65):(col-1.5)*.8;
 return {...e(0,x,4),spawnAt:at,spawnZ:-11-row*1.15,approach:speed,...(formation==='sweep'?{sweep:true,sweepPhase:i*.2}:{} )};
});
const specialist=(at,x,hp,role,extra={})=>({...e(0,x,hp,role),spawnAt:at,spawnZ:role==='runner'?-15:-19,approach:role==='runner'?9:5.4,...extra});
const field=(name,tip,band,objects,theme)=>({name,tip,band,pressure:true,durationHint:45,startForce:3,objects,theme});
STAGES[0]=field('草原：分隊突破','紫の盾は横から。接近する斥候を先に止める。','01–10',[
 g(10,-2.2,-8),...chain(18,-2.2,4),r(28,2.3,12,8),r(49,-2.3,18,7),
 ...squad(4.8,'line',16),specialist(7,-1.2,38,'shield'),specialist(7,1.2,38,'shield'),...squad(8.1,'split',12),
 specialist(10.2,-3.3,18,'runner'),specialist(10.9,3.3,18,'runner'),...squad(12,'sweep',16),
 s(41,2.3),...squad(15.2,'line',16),specialist(16,-1.6,42,'shield'),
 specialist(19,0,170,'captain',{boss:true,bossName:'破城隊長',bossKind:'captain',shotDamage:5,stopZ:-4}),
 ...squad(22,'split',12),specialist(24,3.2,20,'runner')
],{kind:'outpost',sand:'#8da37c',road:'#829782',fog:'#b9bea9'});
STAGES[4]=field('工業地：交差砲撃','狙撃線を外し、二連迫撃砲は側面から狙う。','41–50',[
 g(10,2.3,-10),...chain(18,2.3,4),r(29,-2.4,18,9),r(53,2.4,22,8),s(43,0),s(69,-2.5),
 ...squad(4.8,'split',18),specialist(7.5,-2.6,110,'sniper',{shotDamage:5,firstDelay:.35}),
 specialist(7.0,-2.6,65,'shield'),...squad(9,'line',16),specialist(12,3.3,25,'runner'),specialist(12.7,-3.3,25,'runner'),
 ...squad(14,'sweep',16),specialist(15.4,2.6,65,'shield'),specialist(16,2.6,110,'sniper',{shotDamage:5}),
 specialist(28,0,260,'turret',{boss:true,bossName:'二連迫撃砲',bossKind:'mortar',attackPattern:'mortar',shotDamage:7,stopZ:-9}),
 ...squad(21.5,'split',18),specialist(23,1.4,58,'shield'),...squad(26,'line',16)
],{kind:'industrial',sand:'#748b92',road:'#657d88',fog:'#adbfbd'});
STAGES[9]=field('雪山要塞：攻城機','左右の砲撃予告を避け、光る側のコアを狙う。','91–100',[
 g(10,-2.3,-11),...chain(18,-2.3,5),r(28,2.4,20,10),r(51,-2.4,26,9),r(78,2.4,24,7),s(37,-2.5),s(62,0),
 ...squad(4.6,'line',24),specialist(6.8,-2.4,70,'shield'),specialist(6.8,2.4,70,'shield'),
 specialist(9,-3.4,28,'runner'),specialist(9.7,3.4,28,'runner'),specialist(11,2.7,125,'sniper',{shotDamage:6}),
 ...squad(12,'split',18),...squad(15,'sweep',20),specialist(16,-2.5,140,'turret',{shotDamage:6}),
 specialist(22,0,360,'tankBoss',{boss:true,bossName:'双核攻城機',bossKind:'siege',attackPattern:'siege',shotDamage:8,stopZ:-8.2}),
 ...squad(23,'line',16),specialist(25,-3.3,28,'runner'),specialist(25.6,3.3,28,'runner'),...squad(28,'split',18)
],{kind:'citadel',sand:'#cbd6dc',road:'#8197a2',fog:'#dce8e9'});


// Remaining decade bands: recurring enemy rules in different tactical contexts.
const theme=(kind,sand,road,fog)=>({kind,sand,road,fog});
const bossAt=(at,kind,name,hp,extra={})=>specialist(at,0,hp,kind==='captain'?'captain':kind==='mortar'||kind==='minelayer'||kind==='rotor'?'turret':'tankBoss',{boss:true,bossKind:kind,bossName:name,shotDamage:6,stopZ:kind==='captain'?-4:-9,...extra});
const wandering=(at,n=12)=>squad(at,'split',n,6.4).map(o=>({...o,role:'weaver',hp:6}));
STAGES[1]=field('海岸：波打ち分隊','左右の分隊を止め、装甲車の突進線を外す。','11–20',[
 g(10,2.2,-8),...chain(18,2.2,4),r(28,-2.3,14,8),r(50,2.3,18,7),
 ...squad(4.8,'split',18),specialist(8,-3.2,22,'runner'),specialist(8.8,3.2,22,'runner'),...squad(10,'line',16),
 s(43,-2.4),...squad(14,'sweep',16),specialist(16,1.4,45,'shield'),
 bossAt(21,'rammer','どすこい装甲車',210,{shotDamage:7}),...squad(23,'split',12),...squad(26,'line',8)
],theme('coast','#c9c49f','#91a19a','#c8dcda'));
STAGES[2]=field('砂漠：ジグザグ地雷帯','交互の障害帯を抜け、散布砲の予告円を避ける。','21–30',[
 g(10,-2.2,-9),...chain(18,-2.2,4),r(29,2.3,15,8),r(53,-2.3,18,8),
 ...squad(4.8,'line',16),specialist(8,2.5,65,'shooter',{shotDamage:4}),...squad(10,'split',18),s(38,-2.5),
 ...squad(14,'sweep',12),specialist(16,-2.5,65,'shooter',{shotDamage:4}),s(57,2.5),
 bossAt(24,'minelayer','ころころ散布砲',220,{attackPattern:'mines'}),...squad(25,'split',12),s(77,0),...squad(29,'line',8)
],theme('desert','#c2a77f','#a39378','#d6c6a6'));
STAGES[3]=field('市街：ちょこまか横断隊','横移動する遊撃兵と射手を、盾の横から崩す。','31–40',[
 g(10,2.3,-9),...chain(18,2.3,4),r(30,-2.4,16,9),r(52,2.4,20,8),
 ...wandering(4.8,18),specialist(8,-1.5,50,'shield'),specialist(9,2.7,75,'shooter',{shotDamage:4}),...squad(11,'line',16),
 s(45,0),...wandering(15,12),specialist(17,-2.7,75,'shooter',{shotDamage:4}),
 bossAt(23,'captain','ちょこまか隊長',210,{mobile:true,shotDamage:5}),...wandering(25,12),...squad(28,'split',12)
],theme('city','#7b9295','#6f838e','#b4c6ca'));
STAGES[5]=field('港湾：よろよろ装甲輸送','荷台を守る盾の護衛を崩して、輸送車へ集中射撃。','51–60',[
 g(10,-2.3,-10),...chain(18,-2.3,5),r(29,2.4,18,10),r(56,-2.4,22,8),
 ...squad(4.8,'split',18),specialist(8,2.7,85,'shooter',{shotDamage:5}),...squad(10,'line',16),s(43,2.4),
 specialist(14,-3.3,25,'runner'),specialist(15,3.3,25,'runner'),...squad(17,'sweep',16),
 specialist(22,-1.6,60,'shield',{escort:true,stopZ:-3}),specialist(22,1.6,60,'shield',{escort:true,stopZ:-3}),
 bossAt(24,'convoy','よろよろ輸送車',280,{shotDamage:6}),...squad(26,'split',12),...squad(30,'line',8)
],theme('harbor','#789ca5','#718b95','#bdd8d8'));
STAGES[6]=field('雪山：遠近サンドイッチ','遠い狙撃と近い斥候を切り替え、旋回砲の空いた側へ。','61–70',[
 g(10,2.3,-10),...chain(18,2.3,5),r(29,-2.4,19,10),r(55,2.4,23,9),
 ...squad(4.6,'line',16),specialist(8,-2.6,135,'sniper',{shotDamage:6}),specialist(10,3.3,27,'runner'),
 ...squad(12,'split',18),specialist(15,-3.3,27,'runner'),s(47,2.5),specialist(18,2.6,135,'sniper',{shotDamage:6}),
 ...squad(21,'sweep',12),bossAt(27,'rotor','ぐるぐる旋回砲',280,{attackPattern:'rotor',shotDamage:7}),...squad(29,'split',12)
],theme('snow','#c9dce0','#87a2ad','#dcebee'));
STAGES[7]=field('補給市街：ほしいもの三択','救援・防御・敵処理。全部を追わず安全なルートを選ぶ。','71–80',[
 g(10,-2.3,-11),...chain(18,-2.3,4),r(29,2.4,20,9),a(40,0,18,2),r(56,-2.4,25,8),r(82,2.4,24,7),
 ...wandering(4.6,18),specialist(8,2.6,90,'shooter',{shotDamage:5}),...squad(11,'line',16),s(43,0),
 ...wandering(15,18),specialist(18,-2.6,100,'shooter',{shotDamage:5}),
 specialist(22,-1.7,65,'shield',{escort:true,stopZ:-3}),specialist(22,1.7,65,'shield',{escort:true,stopZ:-3}),
 bossAt(24,'supply','もりもり補給車',300,{shotDamage:6}),...squad(26,'split',18),...wandering(30,12)
],theme('depot','#919d91','#748786','#c0d0bc'));
STAGES[8]=field('雪原要塞：重装のすきま','重装護衛の横へ。突進車と障害帯の通れる側を見つける。','81–90',[
 g(10,2.3,-11),...chain(18,2.3,5),r(29,-2.4,21,10),r(54,2.4,24,9),
 ...squad(4.6,'line',24),specialist(7,-1.4,70,'shield'),specialist(7,1.4,70,'shield'),...squad(10,'split',18),
 s(43,-2.4),specialist(14,2.7,140,'turret',{shotDamage:6}),...squad(17,'sweep',16),s(60,2.4),
 bossAt(25,'rammer','ごつごつ突破車',310,{shotDamage:8}),specialist(27,-3.3,28,'runner'),specialist(28,3.3,28,'runner'),...squad(30,'split',12)
],theme('fortress','#bacbd0','#78919b','#d0e1e5'));


// v8: two representative bands first. Gaps and outer shoulders remain traversable.
const choiceRow=(d,values)=>values.map((value,i)=>({type:'gate',d,x:(i-1)*2.45,value,rowGate:true,halfWidth:.83,collectAt:5}));
for(const i of [0,4]){const stage=STAGES[i];stage.objects=stage.objects.filter(o=>!['gate','panel'].includes(o.type));stage.objects.push(...choiceRow(10,[-3,-6,-9]),...choiceRow(i===0?42:44,[-10,-16,-7]),...choiceRow(i===0?66:68,[-20,-12,-28]),...choiceRow(i===0?86:96,[-16,-30,-22]));}

// v9: apply the verified visible-contact gate rows to the remaining eight bands.
for(const i of [1,2,3,5,6,7,8,9]){const stage=STAGES[i];stage.objects=stage.objects.filter(o=>!['gate','panel'].includes(o.type));const shift=i%3*2;stage.objects.push(...choiceRow(10,[-3,-6,-9]),...choiceRow(40+shift,[-10,-16,-7]),...choiceRow(65+shift,[-20,-12,-28]),...choiceRow(89+shift,[-16,-30,-22]));}

// Growing gates retain shot value until contact; +999 is the upper boundary.
for(let i=0;i<STAGES.length;i++)for(const o of STAGES[i].objects){if(o.type==='gate'&&o.rowGate){o.growing=true;o.halfWidth=.975;delete o.collectAt;}if(o.type==='enemy'&&i<2&&!o.boss)o.approach=(o.approach||2.7)*.90;if(o.boss){o.hp=Math.round(o.hp*1.15);o.armorPhases=true;}}

for(const stage of STAGES)for(const o of stage.objects)if(o.type==='gate'&&o.rowGate&&o.d===10)o.value=[3,5,-2][Math.round(o.x/2.45)+1];

// Ten-hit charging uses smaller initial debts; the displayed negative value is the actual contact loss.
for(const stage of STAGES)for(const o of stage.objects)if(o.type==='gate'&&o.rowGate&&o.d>10)o.value=-Math.max(1,Math.round(Math.abs(o.value)/5));

// Final-band existing escorts arrive during the command vehicle engagement. No added force or HP.
for(const o of STAGES[9].objects){const shift={23:24.2,25:27,25.6:31.2,28:30.6}[o.spawnAt];if(shift!==undefined&&!o.boss)o.spawnAt=shift;}

// Unpublished two-band cover experiment. Initial triple row is before enemy arrival;
// later rows always leave a full firing lane. Growth and +1 break panels are distinct.
for(const i of [0,9]){const stage=STAGES[i];stage.objects=stage.objects.filter(o=>!['gate','panel'].includes(o.type));const grow=(d,x,value)=>({type:'gate',d,x,value,rowGate:true,halfWidth:.975,growing:true,blockShots:true});stage.objects.push(...[3,5,-2].map((v,k)=>grow(10,(k-1)*2.45,v)));if(i===0)stage.objects.push(...chain(25,-2.45,4),grow(42,-2.45,-2),grow(42,2.45,3),grow(66,-2.45,-3),...chain(66,0,4));else stage.objects.push(...chain(32,-2.45,5),grow(45,-2.45,-2),grow(45,2.45,3),grow(65,0,3),...chain(69,2.45,5));const boss=stage.objects.find(o=>o.boss);boss.closeAssault=true;boss.stopZ=i===0?-1.8:-2.4;boss.approach=i===0?3.7:5.8;stage.tip='成長板を育てるか、空き列から敵を撃つか。＋1板は壊すと増援。';}

// All representative bands share three distinct panel roles, without changing enemies or HP.
for(const i of [1,2,3,4,5,6,7,8]){const stage=STAGES[i],side=i%2?1:-1,shift=(i%3)*2;stage.objects=stage.objects.filter(o=>!['gate','panel'].includes(o.type));const grow=(d,x,value)=>({type:'gate',d,x,value,rowGate:true,halfWidth:.975,growing:true,blockShots:true});stage.objects.push(...[3,5,-2].map((v,k)=>grow(10,(k-1)*2.45,v)),...chain(26+shift,side*2.45,i<3?4:5),grow(43+shift,-side*2.45,-2),grow(43+shift,side*2.45,3),grow(66+shift,0,3),...chain(70+shift,-side*2.45,5));const boss=stage.objects.find(o=>o.boss);boss.closeAssault=true;boss.stopZ=boss.bossKind==='rammer'?-9:boss.bossKind==='captain'?-1.8:-2.4;boss.approach=boss.bossKind==='captain'?3.7:5.8;stage.tip='成長板を育てるか、空き列から敵を撃つか。＋1板は壊すと増援。';}

// v16 pressure tuning; fresh runs only, no HP floors or invulnerability.
for(const i of [4,6,9])for(const o of STAGES[i].objects)if(o.boss)o.hp=Math.round(o.hp*1.2);

// v17: only band08. Always damageable; three aimed volleys and breakable side armor.
for(const o of STAGES[7].objects)if(o.boss){o.hp=650;o.attackPattern='rotor';o.plateWeakSide=1;}

// Cargo guards stay in front of the vehicle, so their protection can always be removed.
for(const o of STAGES[7].objects)if(o.escort)o.stopZ=-1.2;
