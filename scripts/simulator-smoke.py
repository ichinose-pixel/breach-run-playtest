import json,subprocess,time,pathlib
out=pathlib.Path('artifacts');out.mkdir(exist_ok=True)
def run(args,timeout=60):
 r=subprocess.run(args,capture_output=True,text=True,timeout=timeout);r.check_returncode();return r.stdout
inventory=json.loads(run(['xcrun','simctl','list','devices','available','--json']))
devices=[d for runtime,items in inventory['devices'].items() if '.iOS-' in runtime for d in items if d.get('isAvailable') and d['name'].startswith('iPhone')]
if not devices:raise RuntimeError('No installed iPhone simulator; no download or retry')
d=next((d for d in devices if d['state']=='Booted'),devices[0]);udid=d['udid'];bundle='io.github.ichinosepixel.bucchibi'
if d['state']!='Booted':run(['xcrun','simctl','boot',udid]);run(['xcrun','simctl','bootstatus',udid,'-b'],90)
run(['xcrun','simctl','install',udid,'artifacts/DerivedData/Build/Products/Debug-iphonesimulator/App.app'])
launch=run(['xcrun','simctl','launch',udid,bundle]);time.sleep(10)
run(['xcrun','simctl','io',udid,'screenshot',str(out/'launch.png')]);(out/'launch.json').write_text(json.dumps({'device':d['name'],'launch':launch,'requiresHumanImageReview':True,'attempts':1},indent=2))
run(['xcrun','simctl','terminate',udid,bundle])
