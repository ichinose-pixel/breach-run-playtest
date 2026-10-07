import fs from 'node:fs';import{spawnSync}from'node:child_process';
import {configure} from './configure-ios.mjs';
if(process.platform!=='darwin')throw Error('Run project preparation on a Mac after approval. This command does not compile or sign.');
const c=JSON.parse(fs.readFileSync('capacitor.config.json')),r=JSON.parse(fs.readFileSync('native/ios-release.json'));
if(c.appId!==r.bundleId||c.server?.url)throw Error('Unexpected identity or remote server');
function cap(args){const out=spawnSync(process.execPath,['node_modules/@capacitor/cli/bin/capacitor',...args],{stdio:'inherit'});if(out.status)throw Error('Capacitor failed');}
if(!fs.existsSync('ios/App/App.xcodeproj'))cap(['add','ios','--packagemanager','SPM']);cap(['sync','ios']);
configure();console.log('Official iOS project and approved RGB icon configured; no compile/sign/upload performed by this command.');
