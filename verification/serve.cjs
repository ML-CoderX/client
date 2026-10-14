const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
(async()=>{
  if(process.argv.includes('--restart')) {
    try {process.kill(Number(fs.readFileSync('verification/production-server.pid','utf8')));}catch(error){if(error.code!=='ESRCH'&&error.code!=='ENOENT')throw error;}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  try {const r=await fetch('http://localhost:3001');if(r.ok){console.log('Production preview already running at http://localhost:3001');return;}}catch{}
  const log=fs.openSync(path.join(process.cwd(),'verification','production-server.log'),'a');
  const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port','3001','--hostname','127.0.0.1'],{cwd:process.cwd(),stdio:['ignore',log,log],windowsHide:true,detached:true});
  child.unref();fs.writeFileSync('verification/production-server.pid',String(child.pid));
  console.log(`Production preview started in the background (PID ${child.pid}) at http://localhost:3001`);
})();
