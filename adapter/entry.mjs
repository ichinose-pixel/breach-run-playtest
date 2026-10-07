import {Capacitor} from '@capacitor/core';
import {App} from '@capacitor/app';
import {Preferences} from '@capacitor/preferences';
import {createStore} from './store.mjs';
import {lifecycleController} from './lifecycle.mjs';
const native=Capacitor.isNativePlatform();
function status(state){let el=document.getElementById('nativeSave');if(!el){el=document.createElement('div');el.id='nativeSave';el.role='status';document.body.append(el);}el.textContent=state==='pending'?'保存中…':state==='saved'?'':'保存できませんでした。再試行してください';el.dataset.state=state;}
try{
 window.BucchibiStorage=await createStore({native,preferences:Preferences,webStorage:native?undefined:localStorage,onStatus:status});
 const {migrate}=await import('../www/progression.js');migrate(window.BucchibiStorage);await window.BucchibiStorage.flush?.();
 let nativeActive=true;
 const transition=lifecycleController({background(){window.BucchibiInactive=true;window.BucchibiLifecycle?.background();},foreground(){window.BucchibiInactive=false;window.BucchibiLifecycle?.foreground();}});
 const reconcile=()=>transition(nativeActive&&!document.hidden);
 document.addEventListener('visibilitychange',reconcile);addEventListener('pagehide',()=>transition(false));addEventListener('pageshow',reconcile);
 if(native){await App.addListener('appStateChange',({isActive})=>{nativeActive=isActive;reconcile();});nativeActive=(await App.getState()).isActive;}
 reconcile();
 await import('../www/campaign.js');
 if(window.BucchibiInactive)window.BucchibiLifecycle.background();
}catch(error){console.error('Bucchibi initialization failed',error);const el=document.getElementById('loading')||document.getElementById('panel');el.textContent='記録またはゲームを読み込めませんでした。データは削除していません。アプリを再起動してください。';}
