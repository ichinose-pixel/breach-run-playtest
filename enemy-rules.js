// One movement contract for campaign, daily and restored checkpoints.
export function assignEnemyRole(o){if(o.type!=='enemy')return o;if(!o.boss&&o.role!=='weaver'){delete o.sweep;delete o.sweepPhase;}o.approachStyle=!o.boss&&o.role==='runner'?'chase':o.role==='weaver'?'weave':'lane';if(o.role==='shooter'&&!Number.isFinite(o.stopZ))o.stopZ=-8;return o;}
export function withTacticalRules(source){const s=structuredClone(source);s.enemyRulesVersion=1;if(!s.tacticalOpening){
 // One growth lane and an open +1 route; milestone set pieces retain their gates.
 if(!s.milestone){const opening=s.objects.filter(o=>o.type==='gate'&&o.d<=12).sort((a,b)=>a.x-b.x);if(opening.length>=3){const keep=opening[((s.area||0)+(s.step||1))%opening.length];keep.value=5;s.objects=s.objects.filter(o=>!opening.includes(o)||o===keep);const freeX=keep.x<0?2.45:-2.45;for(let i=0;i<3;i++)s.objects.push({type:'panel',d:15+i*2.6,x:freeX,hp:1,gain:1});}}
 // Reassign two existing guards at most. Existing flank snipers already fill the role.
 for(const side of[-1,1]){if(s.objects.some(o=>o.type==='enemy'&&!o.boss&&['shooter','sniper'].includes(o.role)&&Math.sign(o.x)===side&&Math.abs(o.x)>1.8))continue;const guard=s.objects.find(o=>o.type==='enemy'&&o.role==='guard'&&!o.boss&&!o.escort&&Number.isFinite(o.spawnAt)&&o.spawnAt>=5);if(guard)Object.assign(guard,{role:'shooter',x:side*2.8,hp:16+Math.min(6,s.area||0)*2,spawnAt:side<0?7.5:13,spawnZ:-18,approach:3.2,stopZ:-8,shotDamage:2});}
 s.tip='増援板と空いた射線を選ぶ。橙の追跡兵を誘導し、左右の射手を止める。';
 }
 s.objects.forEach(assignEnemyRole);return s;}
