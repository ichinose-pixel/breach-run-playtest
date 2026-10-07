export const NATIVE_KEY='bucchibi.native.v1';
export const KEYS=['bucchibi-campaign-v2','breach-run-amplify-prototype-v1','breach-run-3d-playtest-v1','bucchibi-backup-before-v2'];
export async function createStore({native,preferences,webStorage,onStatus=()=>{}}){
 if(!native)return webStorage;
 const {value}=await preferences.get({key:NATIVE_KEY});
 let cache={};
 if(value!==null){const parsed=JSON.parse(value);if(parsed.version!==1||!parsed.values||typeof parsed.values!=='object'||Array.isArray(parsed.values))throw Error('Unsupported native save');for(const [k,v] of Object.entries(parsed.values)){if(!KEYS.includes(k)||typeof v!=='string')throw Error('Invalid native save');cache[k]=v;}}
 // Never import another origin or another app. New installation starts empty.
 let committed={...cache},dirty=false,inflight=null;
 return {
  getItem(k){return cache[k]??null;},
  setItem(k,v){if(!KEYS.includes(k))throw Error('Unknown save key');cache[k]=String(v);dirty=true;onStatus('pending');},
  async flush(){
   if(inflight)await inflight;
   if(!dirty)return;
   const next={...cache};dirty=false;
   inflight=preferences.set({key:NATIVE_KEY,value:JSON.stringify({version:1,values:next})});
   try{await inflight;committed=next;onStatus('saved');}
   catch(error){cache={...committed};dirty=false;onStatus('error');throw error;}
   finally{inflight=null;}
  }
 };
}
