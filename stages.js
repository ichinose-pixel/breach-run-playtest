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
