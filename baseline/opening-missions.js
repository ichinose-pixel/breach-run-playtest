// Authored opening missions. Daily/legacy and missions 006-100 retain v20 data.
const gate=(d,x,value)=>({type:'gate',d,x,value,rowGate:true,growing:true,blockShots:true,halfWidth:.975});
const rescue=(d,x,gain,hp=10)=>({type:'rescue',d,x,gain,hp});
const panels=(d,x,n=3)=>Array.from({length:n},(_,i)=>({type:'panel',d:d+i*2.6,x,hp:1,gain:1}));
const spikes=(d,x)=>({type:'spikes',d,x,hazardDamage:2});
const enemy=(spawnAt,x,role='guard',hp=4,extra={})=>({type:'enemy',d:0,x,role,hp,spawnAt,spawnZ:-18,approach:4.4,approachStyle:'lane',...extra});
const wave=(at,xs,n=12)=>Array.from({length:n},(_,i)=>enemy(at+Math.floor(i/xs.length)*.38,xs[i%xs.length],'guard',3,{spawnZ:-18-Math.floor(i/xs.length)*1.2}));
const shooter=(at,x)=>enemy(at,x,'shooter',16,{stopZ:-8,approach:3.2,shotDamage:2});
const boss=(at,hp,name)=>enemy(at,0,'captain',hp,{boss:true,bossKind:'captain',bossName:name,introBoss:true,stopZ:-5,closeAssault:true,approach:3.2,shotDamage:3,armorPhases:true});
const layouts=[
 {name:'育てる列・撃つ列',tip:'左の増援板を育てる。右の射手は空いた列から狙う。',cues:[[0,'左は増援板 · 中央は敵を直接狙える'],[4,'板の後ろへ弾は届かない · 空き列へ'],[9,'右の射手を止める · 赤い予告線は横へ'],[15,'右の増援を回収 · 左の射手を狙う']],objects:[gate(10,-2.8,5),rescue(18,2.6,7,8),...panels(15,0,2),...wave(4.8,[-.7,.7],10),shooter(7,2.8),spikes(28,0),rescue(31,-2.6,8),gate(44,2.8,10),...wave(11,[-1.7,.8,1.7],10),...wave(14,[-2.5,-1.7,0,1.7],16),shooter(19,-2.8),...wave(19,[-2.5,-1.7,0,1.7,2.5],18)]},
 {name:'増援の後ろの射手',tip:'右で増援、左から射撃。中央の障害帯を避けよう。',cues:[[0,'右の板を育てる · 左は連続＋1'],[5,'右の板が射線をふさぐ · 先に左を止める'],[11,'中央の板を回収 · 次は右へ'],[17,'盾兵の横へ回り込む']],objects:[gate(12,2.8,6),...panels(13,-2.5,4),...wave(5,[-2.5,-1.7],10),shooter(7,2.8),spikes(26,0),gate(35,0,9),rescue(39,-2.5,10,14),enemy(12,-2.5,'shield',26),...wave(13,[0,1.8,2.5],12),spikes(43,-2.5),gate(50,2.8,12),shooter(20,-2.8),...wave(20,[.7,1.5,2.5],10)]},
 {name:'小隊長の予告線',tip:'中央で増援したら横へ。赤い線を避け、隊長が盾を開いたら撃つ。',cues:[[0,'中央の増援板を育てる'],[5,'中央の障害帯が接近 · 右の救援へ'],[10,'左の射手を倒す · 板の横から狙う'],[17,'小隊長 · 赤い線を避けてから反撃']],objects:[gate(10,0,5),spikes(24,0),rescue(25,2.7,9),...panels(27,-2.6,3),shooter(8,-2.8),...wave(6,[-1.7,0,1.7],15),gate(38,-2.8,12),...wave(12,[0,.8,1.7],12),boss(19,260,'前哨小隊長')]},
 {name:'二つの射線',tip:'左右の射手を順に止める。増援中も赤い予告線を見よう。',cues:[[0,'左の板で増援 · 右は救援'],[5,'左の射手を狙う · 予告中は横へ'],[10,'次は右の射手 · 中央で増援'],[17,'左右に敵が残る · 空き列から撃つ']],objects:[gate(10,-2.8,5),rescue(18,2.7,8),...wave(5,[-.8,0,.8],12),shooter(7,-2.8),gate(30,0,8),shooter(12,2.8),spikes(38,0),...panels(38,2.7,3),rescue(42,-2.7,12,16),enemy(15,2.6,'shield',30),...wave(17,[-2.5,-1.7,.8,1.7],16),gate(52,2.8,14),shooter(22,-2.8),...wave(22,[-2.5,-1.7,0,1.7,2.5],18)]},
 {name:'小隊長への反撃',tip:'左右で大軍を作る。隊長の予告を避け、開いた盾を集中攻撃。',cues:[[0,'右は増援板 · 左は連続＋1'],[5,'中央の障害帯を避けて救援'],[11,'左で増援 · 右の射手を止める'],[18,'隊長の盾が開いたら反撃']],objects:[gate(11,2.8,6),...panels(14,-2.7,3),rescue(24,-2.7,10,12),spikes(26,0),...wave(5,[-2.5,-1.7,0],12),enemy(8,2.5,'shield',24),gate(35,-2.8,12),shooter(12,2.8),...wave(12,[-1.7,0,1.7],15),rescue(46,2.7,12,16),...panels(47,0,3),boss(21,420,'防衛小隊長')]}
];
export function openingMissions(stages){return stages.map((stage,i)=>i<layouts.length?{...stage,...structuredClone(layouts[i]),tacticalOpening:true,durationHint:i===2||i===4?35:30}:stage);}
