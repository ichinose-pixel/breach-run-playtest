'use strict';
const drawBeforeObstacles=drawObject;
drawObject=function(o){if(o.type!=='obstacle')return drawBeforeObstacles(o);const rel=o.z-distance;if(rel>110||rel<-.5)return;const p=project(o.x,rel),s=p.s,w=W*.235*s,h=33*s;
// Road warning markings and hazard stripes distinguish this from number gates.
ctx.save();ctx.fillStyle='#fcbe5140';ctx.beginPath();ctx.ellipse(p.x,p.y+2*s,w*.62,12*s,0,0,7);ctx.fill();round(p.x-w/2,p.y-h,w,h,3*s,'#27313c','#ffc26c');ctx.save();ctx.beginPath();ctx.rect(p.x-w/2,p.y-h,w,h);ctx.clip();for(let i=-w;i<w*2;i+=19*s){poly([[p.x-w/2+i,p.y],[p.x-w/2+i+10*s,p.y],[p.x-w/2+i+10*s+18*s,p.y-h],[p.x-w/2+i+18*s,p.y-h]],'#e7ad49');}ctx.restore();round(p.x-16*s,p.y-h-27*s,32*s,30*s,5*s,'#792e32','#ffd597');txt('!',p.x,p.y-h-12*s,Math.max(14,22*s),'#ffe7b6');for(const side of [-1,1])round(p.x+side*w*.42-3*s,p.y-5*s,6*s,13*s,2*s,'#aab6bc');ctx.restore();};
