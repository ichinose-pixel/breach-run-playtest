const g=(d,x,v)=>({type:'gate',d,x,value:v}),p=(d,x)=>({type:'panel',d,x,hp:1,gain:1}),r=(d,x,hp,gain)=>({type:'rescue',d,x,hp,gain}),e=(d,x,hp=4,role='guard')=>({type:'enemy',d,x,hp,role}),s=(d,x)=>({type:'spikes',d,x}),a=(d,x,hp=10)=>({type:'armor',d,x,hp,gain:3});
const chain=(d,x,n)=>Array.from({length:n},(_,i)=>p(d+i*2.8,x));const wave=(d,n=4)=>Array.from({length:n},(_,i)=>e(d+(i%2)*1.5,(i-(n-1)/2)*1.15,4));
export const STAGES=[
{name:'増やして、撃ち抜け',startForce:1,tip:'ゲートを撃って＋に。青いパネルを割って増員。',objects:[g(25,-1.8,-2),...chain(36,-1.8,8),r(48,1.8,12,10),...wave(64,4),...wave(73,5),...wave(84,4)]},
{name:'連鎖する増援',startForce:3,tip:'増援をつないで、敵の列を撃ち抜こう。',objects:[g(17,1.8,-14),...chain(29,1.8,9),r(42,-1.8,14,10),...wave(58,4),...wave(69,5),...wave(83,5)]},
{name:'抜け道の部隊',startForce:3,tip:'危険床を外し、増援から敵の列へ。',objects:[g(18,-1.8,-12),...chain(31,1.8,8),s(41,-1.8),r(48,-1.8,12,10),...wave(62,4),...wave(76,5),...wave(86,4)]},
{name:'増援か、斥候か',startForce:3,tip:'増援を取り、接近する軽装兵を止めよう。',objects:[g(18,-1.8,-10),...chain(29,-1.8,7),p(19,3.8),e(48,.7,8,'runner'),r(54,1.8,12,12),...wave(58,3),...wave(67,4),...wave(77,5),...wave(88,5)]},
{name:'遠くの赤い射線',startForce:3,tip:'赤い線が止まったら横へ。長銃の狙撃兵を先に倒そう。',objects:[g(19,1.8,-12),...chain(32,1.8,8),r(49,-1.8,16,12),e(66,.8,55,'sniper'),...wave(69,4),...wave(82,5),e(96,-1.5,65,'sniper'),...wave(103,5)]},
{name:'砲撃の輪を抜けろ',startForce:3,tip:'赤い着弾の輪から移動。砲台を壊して道を開こう。',objects:[g(19,-1.8,-12),...chain(32,-1.8,9),r(50,1.8,16,12),...wave(64,4),e(73,1.2,100,'turret'),...wave(83,5),r(89,-1.8,20,8),e(105,-1.2,115,'turret'),...wave(110,5)]},
{name:'鋼鉄の行進',startForce:3,tip:'戦車は砲撃前に狙いを固定。横へ避けて撃ち返そう。',objects:[g(20,1.8,-16),...chain(33,1.8,9),r(52,-1.8,18,12),e(68,0,150,'tank'),...wave(76,5),e(88,1.7,8,'runner'),r(94,1.8,20,10),e(111,-1,170,'tank'),...wave(115,5)]},
{name:'交差する火線',startForce:3,tip:'接近する斥候を止め、狙撃の線から離れよう。救出で立て直せる。',objects:[g(20,-1.8,-16),...chain(33,-1.8,9),r(52,1.8,18,12),e(66,-.5,8,'runner'),...wave(73,5),e(84,1.2,70,'sniper'),r(94,-1.8,22,10),...wave(104,5),e(116,-1.2,150,'turret'),...wave(121,5)]},
{name:'突破の前線',startForce:3,tip:'増援をつないで砲台、戦車の順に突破。着弾の輪を見よう。',objects:[g(20,1.8,-16),...chain(33,1.8,10),r(54,-1.8,20,12),e(72,1.2,135,'turret'),...wave(79,5),r(92,1.8,22,10),e(104,-1.2,190,'tank'),...wave(113,5),e(126,1.1,80,'sniper'),...wave(132,5)]},
{name:'大隊、帰還せよ',startForce:3,tip:'仲間と弾幕を育てて指揮戦車へ。砲撃を避け、全員で帰還しよう。',objects:[g(21,-1.8,-20),...chain(35,-1.8,10),r(57,1.8,22,14),e(72,.8,8,'runner'),...wave(79,5),e(91,-1.2,85,'sniper'),r(102,1.8,22,10),...wave(112,5),...wave(122,5),e(140,0,320,'tankBoss')]}
];
