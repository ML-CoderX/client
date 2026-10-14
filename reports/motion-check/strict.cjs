const next=require('next');const http=require('node:http');const {spawn}=require('node:child_process');
(async()=>{const app=next({dev:true,hostname:'127.0.0.1',port:3002});let server;try{
 await app.prepare();server=http.createServer(app.getRequestHandler());await new Promise(resolve=>server.listen(3002,'127.0.0.1',resolve));
 const code=await new Promise(resolve=>{const child=spawn(process.execPath,['reports/motion-check/lifecycle.cjs'],{stdio:'inherit',windowsHide:true,env:{...process.env,MOTION_URL:'http://localhost:3002'}});child.on('exit',resolve);});process.exitCode=code||0;
}finally{setTimeout(()=>process.exit(process.exitCode||0),2000);if(server)await new Promise(resolve=>server.close(resolve));await app.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
