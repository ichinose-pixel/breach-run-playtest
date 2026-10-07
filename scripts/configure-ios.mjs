import fs from 'node:fs';import{installIcon}from'./install-icon.mjs';
export function configure(root='ios'){const r=JSON.parse(fs.readFileSync('native/ios-release.json'));if(!/^[A-Z0-9]{10}$/.test(r.teamId))throw Error('Invalid team');r.buildNumber=process.env.BUCCHIBI_BUILD_NUMBER||r.buildNumber;if(!/^[1-9]\d*$/.test(r.buildNumber))throw Error('Invalid build number');
const p=root+'/App/App.xcodeproj/project.pbxproj';let text=fs.readFileSync(p,'utf8');text=text.replace(/buildSettings = \{[\s\S]*?\n\t\t\t\};/g,block=>{if(!block.includes('PRODUCT_BUNDLE_IDENTIFIER ='))return block;return block.includes('DEVELOPMENT_TEAM =')?block.replace(/DEVELOPMENT_TEAM = [^;]+;/g,'DEVELOPMENT_TEAM = '+r.teamId+';'):block.replace('buildSettings = {','buildSettings = {\n\t\t\t\tDEVELOPMENT_TEAM = '+r.teamId+';');});text=text.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g,`CURRENT_PROJECT_VERSION = ${r.buildNumber};`).replace(/MARKETING_VERSION = [^;]+;/g,`MARKETING_VERSION = ${r.marketingVersion};`);
if(!text.includes('B0CC00000000000000000001')){for(const[a,b]of[
 ['/* Begin PBXBuildFile section */','B0CC00000000000000000001 /* PrivacyInfo.xcprivacy in Resources */ = {isa = PBXBuildFile; fileRef = B0CC00000000000000000002; };'],
 ['/* Begin PBXFileReference section */','B0CC00000000000000000002 /* PrivacyInfo.xcprivacy */ = {isa = PBXFileReference; lastKnownFileType = text.xml; path = PrivacyInfo.xcprivacy; sourceTree = "<group>"; };'],
 ['504EC3061FED79650016851F /* App */ = {\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = (','B0CC00000000000000000002 /* PrivacyInfo.xcprivacy */,'],
 ['504EC3021FED79650016851F /* Resources */ = {\n\t\t\tisa = PBXResourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (','B0CC00000000000000000001 /* PrivacyInfo.xcprivacy in Resources */,']]){if(!text.includes(a))throw Error('Official template changed; inspect before configuring');text=text.replace(a,a+'\n\t\t\t\t'+b)}}fs.writeFileSync(p,text);
fs.copyFileSync('native/PrivacyInfo.xcprivacy',root+'/App/App/PrivacyInfo.xcprivacy');
const info=root+'/App/App/Info.plist';let xml=fs.readFileSync(info,'utf8');xml=xml.replace(/(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,'$1'+r.displayName+'$2');fs.writeFileSync(info,xml);
installIcon(root+'/App/App/Assets.xcassets/AppIcon.appiconset');
}
