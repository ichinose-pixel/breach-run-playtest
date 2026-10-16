// New runs only. The saved stage spec keeps existing checkpoints on their original rules.
export function withChallenge(source,index){
 if(index===0)return source;
 const s=structuredClone(source);s.challengeVersion=1;
 const area=s.area||0;
 // Late rescue rewards remain intact; cages need a deliberate firing window.
 for(const o of s.objects)if(o.lateRescue)o.hp=Math.max(o.hp,180+area*12);
 // Late mortar arenas rotate the open lane; their existing two impact rings stay authoritative.
 if(s.milestone&&area>=4)for(const o of s.objects)if(o.boss&&o.attackPattern==='mortar')o.attackPattern='rotor';for(const o of s.objects)if(o.type==='gate')o.focusPickup=true;s.tip='増援は部隊の中央で回収。赤い予告を避け、空いた側から敵を倒す。';
 // A late fire team survives behind its shield until the player opens a firing angle.
 // Fixed authored values: no rubber-banding against army size or player performance.
 if(!s.objects.some(o=>o.boss)){
  const lastGate=Math.max(38,...s.objects.filter(o=>o.type==='gate').map(o=>o.d));
  const at=Math.max(19,lastGate/2.7+1.8);
  const side=(s.step||index)%2?1:-1;
  s.objects.push(index<5?{type:'enemy',role:'captain',boss:true,bossKind:'captain',bossName:'封鎖小隊長',introBoss:true,closeAssault:true,armorPhases:true,d:0,x:0,hp:2200,spawnAt:at,spawnZ:-18,approach:3.2,stopZ:-5,shotDamage:3}:{type:'enemy',role:'turret',boss:true,bossKind:'mortar',bossName:'封鎖迫撃砲',closeAssault:true,armorPhases:true,attackPattern:['mortar','mines','rotor'][area%3],d:0,x:0,hp:1600+area*100,spawnAt:at,spawnZ:-18,approach:3.2,stopZ:-3,warningDuration:1.85,firstWarningDelay:.5,shotDamage:3});
  s.objects.push({type:'enemy',role:'shooter',d:0,x:side*2.7,hp:48+area*6,spawnAt:at-1.5,spawnZ:-20,approach:3.2,stopZ:-8,warningDuration:1.85,firstWarningDelay:1.4,shotDamage:2});
  s.durationHint=at+18;
 }
 // Keep each obstacle separated in time: visible road geometry, never a full-width wall.
 if(index>=5&&!s.milestone){
  const d=35+(s.step||1)*1.2,x=((s.step||1)%2?1:-1)*2.65;
  if(!s.objects.some(o=>o.type==='spikes'&&Math.abs(o.d-d)<7))s.objects.push({type:'spikes',d,x,hazardDamage:4});
 }
 return s;
}
