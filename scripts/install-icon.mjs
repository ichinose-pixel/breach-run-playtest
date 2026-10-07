import fs from 'node:fs';import path from 'node:path';import{createHash}from'node:crypto';
export function installIcon(destination='ios/App/App/Assets.xcassets/AppIcon.appiconset'){
 const source='native/Assets.xcassets/AppIcon.appiconset',p=path.join(source,'AppIcon-1024.png'),b=fs.readFileSync(p),m=JSON.parse(fs.readFileSync('native/icon-manifest.json'));
 if(b.toString('hex',0,8)!=='89504e470d0a1a0a'||b.readUInt32BE(16)!==1024||b.readUInt32BE(20)!==1024||b[25]!==2)throw Error('Icon must be RGB 1024 PNG without alpha');
 if(createHash('sha256').update(b).digest('hex')!==m.sha256)throw Error('Approved icon bytes changed');
 fs.mkdirSync(destination,{recursive:true});for(const f of ['AppIcon-1024.png','Contents.json'])fs.copyFileSync(path.join(source,f),path.join(destination,f));
}
