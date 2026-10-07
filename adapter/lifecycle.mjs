export function lifecycleController({background,foreground}){let active=true;return next=>{if(next===active)return;active=next;return next?foreground():background();};}
