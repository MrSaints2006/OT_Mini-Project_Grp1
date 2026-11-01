(function(){
  var c=document.getElementById('gpu'),x=c.getContext('2d'),CW=300,CH=260,D=window.devicePixelRatio||1;
  c.width=CW*D;c.height=CH*D;x.scale(D,D);
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var cx=150,cy=170,S=104,t0=performance.now();
  function rr(X,Y,w,h,r){x.beginPath();if(x.roundRect)x.roundRect(X,Y,w,h,r);else x.rect(X,Y,w,h)}
  function rnd(n){var v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)}
  function sm(a,b,t){t=Math.min(1,Math.max(0,(t-a)/(b-a)));return t*t*(3-2*t)}
  var ring=[],n=6,i;
  for(i=0;i<n;i++)ring.push([i,0]);
  for(i=1;i<n;i++)ring.push([n-1,i]);
  for(i=n-2;i>=0;i--)ring.push([i,n-1]);
  for(i=n-2;i>0;i--)ring.push([0,i]);
  var hollow={7:1,16:1,21:1};
  function glitch(t,alpha){
    var sc=.55+.5*sm(.3,2.4,t),f=Math.floor(t*14);
    x.save();x.translate(cx,cy);x.scale(sc,sc);x.globalAlpha=alpha;
    x.shadowColor='#2fe3c0';x.shadowBlur=26;
    for(var k=0;k<34;k++){
      var r1=rnd(k*3+f),r2=rnd(k*7+f*2),r3=rnd(k*11+f),
          w=6+r1*38,h=3+r2*16,X=(rnd(k+f*5)-.5)*70-w/2,Y=(rnd(k*5+f*3)-.5)*70-h/2,
          hue=r3<.5?'60,230,200':r3<.8?'60,200,255':'120,255,160';
      x.fillStyle='rgba('+hue+','+(.12+.25*r2)+')';x.fillRect(X,Y,w,h);
      x.strokeStyle='rgba('+hue+','+(.5+.4*r1)+')';x.lineWidth=1;x.strokeRect(X+.5,Y+.5,w,h);
    }
    x.shadowBlur=0;x.strokeStyle='rgba(120,255,225,.9)';x.lineWidth=1.5;x.strokeRect(-36,-36,72,72);
    x.restore();
  }
  function chip(t,A){
    x.save();x.globalAlpha=A;
    x.shadowColor='rgba(47,227,154,.55)';x.shadowBlur=30;
    var g=x.createLinearGradient(0,cy-S/2,0,cy+S/2);g.addColorStop(0,'#10281e');g.addColorStop(1,'#060d0a');
    rr(cx-S/2,cy-S/2,S,S,20);x.fillStyle=g;x.fill();x.shadowBlur=0;
    var e=x.createLinearGradient(0,cy-S/2,0,cy+S/2);e.addColorStop(0,'rgba(70,220,140,.95)');e.addColorStop(.5,'rgba(30,120,80,.6)');e.addColorStop(1,'rgba(20,80,55,.45)');
    rr(cx-S/2+1,cy-S/2+1,S-2,S-2,19);x.strokeStyle=e;x.lineWidth=2;x.stroke();
    rr(cx-S/2+9,cy-S/2+9,S-18,S-18,13);x.fillStyle='#030705';x.fill();
    x.strokeStyle='rgba(60,170,120,.18)';x.lineWidth=1;x.stroke();
    var cs=11.5,pitch=12.4,gx=cx-(n*pitch)/2+.5,gy=cy-(n*pitch)/2+.5,L=ring.length,head=(t*7)%L;
    ring.forEach(function(p,k){
      var X=gx+p[0]*pitch,Y=gy+p[1]*pitch,d=(head-k+L)%L,
          trail=d<7?Math.pow(1-d/7,1.6):0,
          fl=Math.max(0,Math.sin(t*1.7+k*2.3))>.93?.8:0,
          a=Math.min(1,.16+.1*Math.sin(t*1.2+k)+trail+fl);
      if(hollow[k]){x.strokeStyle='rgba(80,200,140,'+(.25+.5*trail)+')';x.lineWidth=1;x.strokeRect(X+.5,Y+.5,cs-1,cs-1);return}
      if(a>.5){x.shadowColor='#37ff9a';x.shadowBlur=10*a}
      x.fillStyle='rgba('+Math.round(60+a*20)+','+Math.round(120+a*135)+','+Math.round(95+a*60)+','+(.35+a*.65)+')';
      x.beginPath();
      if(k==n-1&&x.roundRect)x.roundRect(X,Y,cs,cs,[1,6,1,1]);else x.rect(X,Y,cs,cs);x.fill();x.shadowBlur=0;
    });
    rr(cx-23,cy-23,46,46,6);x.fillStyle='rgba(4,10,8,.96)';x.fill();
    x.restore();
  }
  function beams(t,A){
    x.save();x.globalAlpha=A;var top=cy-S/2;
    [-27,-9,9,27].forEach(function(dx,k){
      var X=cx+dx+.5,g=x.createLinearGradient(0,top,0,0);g.addColorStop(0,'rgba(120,255,200,.28)');g.addColorStop(1,'rgba(120,255,200,0)');
      x.strokeStyle=g;x.lineWidth=1;x.beginPath();x.moveTo(X,top);x.lineTo(X,0);x.stroke();
      if(k==1||k==2){
        var y=top-((t*(40+k*14)+k*37)%(top+30));
        x.shadowColor='#37ff9a';x.shadowBlur=12;
        var pg=x.createLinearGradient(0,y+14,0,y-14);pg.addColorStop(0,'rgba(60,255,160,0)');pg.addColorStop(.5,'rgba(120,255,190,.95)');pg.addColorStop(1,'rgba(60,255,160,0)');
        x.strokeStyle=pg;x.lineWidth=2.4;x.beginPath();x.moveTo(X,y+14);x.lineTo(X,y-14);x.stroke();
      }
    });
    x.shadowBlur=0;x.strokeStyle='rgba(120,255,200,.12)';
    for(var j=-1;j<=1;j+=2)for(var m=0;m<3;m++){var Y=cy-10+m*8;x.beginPath();x.moveTo(cx+j*S/2,Y);x.lineTo(cx+j*(S/2+50),Y);x.stroke()}
    x.restore();
  }
  function frame(){
    var t=still?9:(performance.now()-t0)/1000;
    x.clearRect(0,0,CW,CH);x.globalCompositeOperation='lighter';
    var gl=sm(.2,.6,t)*(1-sm(2.1,3.1,t)),ch=sm(2.0,3.0,t),bm=sm(2.8,3.8,t);
    if(gl>0)glitch(t,gl);
    x.globalCompositeOperation='source-over';
    if(bm>0)beams(t,bm);
    if(ch>0)chip(t,ch);
    if(!still)requestAnimationFrame(frame);
  }
  frame();
})();

const W={High:3,Medium:2,Low:1};let uid=100;
const seed=()=>({servers:[{id:1,name:'GPU-01',vram:16,cost:120,on:true},{id:2,name:'GPU-02',vram:24,cost:180,on:true},{id:3,name:'GPU-03',vram:8,cost:60,on:true}],
jobs:[['Model Training',8,30,'High',0,60],['Vision Inference',4,10,'High',0,25],['Batch Embeddings',12,25,'Medium',0,50],['Simulation Run',8,40,'Low',5,90],['Fine-tuning',16,45,'High',0,70]].map((a,i)=>({id:i+1,name:a[0],vram:a[1],rt:a[2],pri:a[3],arr:a[4],dl:a[5]}))});
let S=seed(),tab='jobs',run=null,cmp=null,obj='balanced',msg='',tH=60;
const $=h=>document.getElementById('v').innerHTML=h;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R=n=>'₹'+(Math.round(n*100)/100);

const ALG={fcfs:{n:'FCFS'},sjf:{n:'SJF'},prio:{n:'Priority + deadline'},exact:{n:'Exact search'}};
const snapshot=()=>JSON.parse(JSON.stringify(S));
async function api(path,body){let res;try{res=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}catch(e){throw new Error('cannot reach the server. Run "npm start" and open http://localhost:3000')}
const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||res.statusText);return data}
function jobsV(){return`<h2>Tasks</h2><p class="s">Times in minutes, cost in ₹. Edit cells directly; changes apply to the next run.</p>
<div class="pn"><div class="row">${[['name','Name','text',''],['vram','VRAM (GB)','number',8],['rt','Runtime (min)','number',30],['arr','Arrival','number',0],['dl','Deadline','number','']].map(f=>`<label>${f[1]}<input id="n_${f[0]}" type="${f[2]}" value="${f[3]}"></label>`).join('')}
<label>Priority<select id="n_pri"><option>High<option>Medium<option>Low</select></label><button class="b" onclick="addJob()">Add task</button></div><div class="err">${msg}</div></div>
<div class="pn sc"><table><tr><th>Name<th>VRAM<th>Runtime<th>Priority<th>Arrival<th>Deadline<th></tr>${S.jobs.length?S.jobs.map(j=>`<tr><td><input style="width:130px" value="${esc(j.name)}" onchange="ed('jobs',${j.id},'name',this.value)"><td><input type="number" value="${j.vram}" onchange="ed('jobs',${j.id},'vram',+this.value)"><td><input type="number" value="${j.rt}" onchange="ed('jobs',${j.id},'rt',+this.value)">
<td><select style="width:90px" onchange="ed('jobs',${j.id},'pri',this.value)">${Object.keys(W).map(p=>`<option${p===j.pri?' selected':''}>${p}`).join('')}</select><td><input type="number" value="${j.arr}" onchange="ed('jobs',${j.id},'arr',+this.value)"><td><input type="number" value="${j.dl??''}" onchange="ed('jobs',${j.id},'dl',this.value===''?null:+this.value)"><td><button class="d" onclick="del('jobs',${j.id})">Delete</button>`).join(''):'<tr><td colspan=7>No tasks yet. Add one above or reset the demo.'}</table></div>
<button class="b g" onclick="if(confirm('Reset to the demo workload and servers? Current data and results will be cleared.')){S=seed();run=cmp=null;msg='';go('jobs')}">Reset demo</button>`}
function srvV(){return`<h2>GPU Servers</h2><p class="s">Simulated GPUs, exclusive use (one job at a time). Runtime is the same on every compatible GPU in this demo.</p>
<div class="pn"><div class="row"><label>Name<input id="s_name" value="GPU-04"></label><label>VRAM (GB)<input id="s_vram" type="number" value="16"></label><label>Cost/hour (₹)<input id="s_cost" type="number" value="100"></label><button class="b" onclick="addSrv()">Add server</button></div><div class="err">${msg}</div></div>
<div class="pn sc"><table><tr><th>Name<th>VRAM<th>Cost/hour<th>Enabled<th></tr>${S.servers.map(s=>`<tr><td>${esc(s.name)}<td><input type="number" value="${s.vram}" onchange="ed('servers',${s.id},'vram',+this.value)"><td><input type="number" value="${s.cost}" onchange="ed('servers',${s.id},'cost',+this.value)"><td><input type="checkbox" ${s.on?'checked':''} onchange="ed('servers',${s.id},'on',this.checked)"><td><button class="d" onclick="del('servers',${s.id})">Delete</button>`).join('')}</table></div>`}
const mcards=m=>`<div class="m">${[['Scheduled',m.scheduled],['Unscheduled',m.unscheduled],['Makespan',m.makespan+' min'],['Execution cost',R(m.cost)],['Avg wait',Math.round(m.avgWait*10)/10+' min'],['Deadline misses',m.misses+' ('+m.lateMin+' min late)'],['GPU utilization',Math.round(m.util*100)+'%']].map(a=>`<div><b>${a[1]}</b><span>${a[0]}</span></div>`).join('')}</div>`;
function gantt(r){const en=r.snap.servers.filter(s=>s.on),H=Math.max(1,...r.sch.map(x=>x.fin),...r.sch.map(x=>x.dl||0));
return en.map(s=>`<div class="gl"><i>${esc(s.name)}</i><div class="gt">${r.sch.filter(x=>x.sid===s.id).map(x=>`<div class="gb${x.dl!=null&&x.fin>x.dl?' late':''}" style="left:${x.start/H*100}%;width:${(x.fin-x.start)/H*100}%" title="${esc(x.name)} ${x.start}–${x.fin}">${esc(x.name)}</div>`).join('')}</div></div>`).join('')+`<div class="gl"><i></i><div style="display:flex;justify-content:space-between;flex:1;font-size:11px;color:var(--mu)"><span>0</span><span>${Math.round(H/2)}</span><span>${H} min</span></div></div>`}
const fmt=n=>Math.round(n*10)/10;
function chart(t,items,f){if(!items.length)return'';const W=360,H=190,L=44,B=34,T=16,R=10,max=Math.max(1,...items.map(i=>i.v))*1.1,step=(W-L-R)/items.length,bw=Math.min(46,step*.6);
const grid=[0,.25,.5,.75,1].map(k=>{const y=T+(H-T-B)*(1-k);return`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" class="cg"/><text x="${L-6}" y="${y+3}" class="ct" text-anchor="end">${f(max*k)}</text>`}).join('');
const bars=items.map((it,i)=>{const bh=(H-T-B)*it.v/max,x=L+step*i+(step-bw)/2,y=H-B-bh,lb=it.l.length>7?it.l.slice(0,6)+'.':it.l;return`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" class="bar${it.bad?' bad':''}"/><text x="${x+bw/2}" y="${y-5}" class="ct" text-anchor="middle">${f(it.v)}</text><text x="${x+bw/2}" y="${H-B+14}" class="ct" text-anchor="middle">${esc(lb)}</text>`}).join('');
return`<figure class="ch"><figcaption>${t}</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t)}">${grid}${bars}</svg></figure>`}
const short=a=>({'Priority + deadline':'PRIO','Exact search':'EXACT'}[a]||a);
function anal(r){const en=r.snap.servers.filter(s=>s.on),mk=r.m.makespan||1;
return chart('Cost per task (\u20b9)',r.sch.map(x=>({l:x.name,v:x.cost,bad:x.dl!=null&&x.fin>x.dl})),fmt)+chart('GPU utilization (%)',en.map(s=>({l:s.name,v:r.sch.filter(x=>x.sid===s.id).reduce((a,x)=>a+x.fin-x.start,0)/mk*100})),n=>Math.round(n))}
function cmpAnal(c){return chart('Execution cost (\u20b9)',c.map(r=>({l:short(r.algo),v:r.m.cost})),fmt)+chart('Makespan (min)',c.map(r=>({l:short(r.algo),v:r.m.makespan})),fmt)+chart('Average wait (min)',c.map(r=>({l:short(r.algo),v:r.m.avgWait})),fmt)}
function optV(){let h=`<h2>Optimize &amp; Results</h2><div class="err">${msg}</div><p class="s">Pick a method and objective, then run. Metrics are computed from the schedule rows.</p><div class="pn"><div class="row"><label>Method<select id="alg" style="width:170px">${Object.entries(ALG).map(([k,a])=>`<option value="${k}"${k==='exact'?' selected':''}>${a.n}`).join('')}</select></label>
<label>Objective<select id="obj" style="width:170px" onchange="obj=this.value">${[['cost','Minimize execution cost'],['makespan','Minimize makespan'],['balanced','Balanced']].map(o=>`<option value="${o[0]}"${obj===o[0]?' selected':''}>${o[1]}`).join('')}</select></label><button class="b" onclick="doRun()">Run</button></div>
<p class="s" style="margin:8px 0 0">Penalties always dominate the objective: unscheduled jobs (100000×priority weight) and lateness (1000×weight per minute). Priority weights: High 3, Medium 2, Low 1.</p></div>`;
if(!run)return h+'<div class="pn">No run yet. Choose a method and press Run.</div>';
const r=run;h+=`<div class="pn"><b>${r.algo}</b> · status: ${r.status} · ${Math.round(r.ms)} ms${r.nodes?' · '+r.nodes+' assignments evaluated':''}<br><span style="color:var(--mu)">Utilization = busy minutes ÷ (enabled servers × makespan).</span></div><div class="pn">${mcards(r.m)}</div><div class="pn"><b>Analysis</b><div class="charts">${anal(r)}</div></div><div class="pn"><b>Timeline</b>${gantt(r)}<span style="font-size:12px;color:var(--mu)">Red = misses deadline</span></div>
<div class="pn sc"><table><tr><th>Job<th>Priority<th>GPU<th>Start<th>Finish<th>Wait<th>Cost<th>Deadline</tr>${r.sch.sort((a,b)=>a.start-b.start).map(x=>`<tr><td>${esc(x.name)}<td>${x.pri}<td>${x.sname}<td>${x.start}<td>${x.fin}<td>${x.wait}<td>${R(x.cost)}<td>${x.dl==null?'–':x.fin>x.dl?`<span class="bad">Missed by ${x.fin-x.dl} min (due ${x.dl})</span>`:`<span class="ok">OK (due ${x.dl})</span>`}`).join('')}</table></div>`;
if(r.uns.length)h+=`<div class="pn"><b class="warn">Unscheduled jobs</b><table>${r.uns.map(u=>`<tr><td>${esc(u.name)}<td>${esc(u.reason)}`).join('')}</table></div>`;return h}
function cmpV(){let h=`<h2>Compare All</h2><div class="err">${msg}</div><p class="s">Every method runs on one identical copy (snapshot) of the current jobs and servers.</p><button class="b" onclick="doCmp()">Run compare</button>`;if(!cmp)return h;
return h+`<div class="pn sc" style="margin-top:14px"><table><tr><th>Method<th>Scheduled<th>Unsched.<th>Makespan<th>Cost<th>Misses<th>Late min<th>Avg wait<th>Time</tr>${cmp.map(r=>`<tr><td>${r.algo}<td>${r.m.scheduled}<td>${r.m.unscheduled}<td>${r.m.makespan}<td>${R(r.m.cost)}<td>${r.m.misses}<td>${r.m.lateMin}<td>${Math.round(r.m.avgWait*10)/10}<td>${Math.round(r.ms)} ms`).join('')}</table><p class="s" style="margin:8px 0 0">Snapshot: ${cmp[0].snap.jobs.length} jobs, ${cmp[0].snap.servers.filter(s=>s.on).length} enabled servers.</p></div><div class="pn"><b>Analysis</b><div class="charts">${cmpAnal(cmp)}</div></div>`}
function trV(){let h=`<h2>VAM + MODI (educational)</h2><div class="err">${msg}</div><p class="s">Transportation-model result. Jobs are treated as <b>divisible minutes</b> shipped from GPU capacity, so this is <b>not</b> an executable whole-job schedule. Compare it with the whole-job result on the Optimize tab.</p>
<div class="pn row"><label>Capacity per GPU (min)<input id="th" type="number" value="${tH}"></label><button class="b" onclick="doTr()">Run VAM + MODI</button></div>`;
if(!tShow)return h;const t=trRes;if(!t)return h+'<div class="pn">Need at least one enabled server and one job.</div>';
return h+`<div class="pn sc"><b>Allocation (minutes) – total cost ${R(t.tot)}</b><table><tr><th><th>${t.cn.map(esc).join('<th>')}<th>Capacity</tr>${t.x.map((r,i)=>`<tr><th>${esc(t.rn[i])}<td>${r.map(v=>v||'–').join('<td>')}<td>${t.sup[i]}`).join('')}<tr><th>Demand<td>${t.dem.join('<td>')}<td></table><p class="s" style="margin:8px 0 0">Cost per minute = cost/hour ÷ 60. VRAM-incompatible pairs cost ₹10000/min (big-M).</p></div><div class="pn"><b>Iteration trace</b><pre>${esc(t.tr.join('\n'))}</pre></div>`}
let tShow=false,trRes=null;
const views={jobs:jobsV,servers:srvV,opt:optV,cmp:cmpV,tr:trV};
const PATH={jobs:'tasks',servers:'servers',opt:'optimize',cmp:'compare',tr:'vam-modi'};
function scr(el){if(!el||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const f=el.textContent,cs='01<>/\\[]{}#$%&*+=';let n=0;const id=setInterval(()=>{el.textContent=f.split('').map((c,i)=>i<n||c===' '?c:cs[Math.random()*cs.length|0]).join('');if(n++>=f.length){el.textContent=f;clearInterval(id)}},30)}
function go(t,show){tab=t;if(t==='tr')tShow=!!show;document.querySelectorAll('.wtabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$(views[t]());updC();const v=document.getElementById('v');v.dataset.path=PATH[t];scr(v.querySelector('h2'));msg=''}
document.querySelectorAll('.wtabs button').forEach(b=>b.onclick=()=>go(b.dataset.t));

function addJob(){const g=k=>document.getElementById('n_'+k).value,name=g('name').trim(),vram=+g('vram'),rt=+g('rt'),arr=+g('arr'),dl=g('dl')===''?null:+g('dl');
if(!name)msg='Name is required.';else if(!(vram>0))msg='VRAM must be greater than 0.';else if(!(rt>0))msg='Runtime must be greater than 0.';else if(!(arr>=0))msg='Arrival cannot be negative.';else if(dl!=null&&dl<arr+rt)msg='Deadline is before arrival + runtime, so the job could never meet it.';
else{S.jobs.push({id:++uid,name,vram,rt,pri:document.getElementById('n_pri').value,arr,dl});msg=''}go('jobs')}
function addSrv(){const g=k=>document.getElementById('s_'+k).value,name=g('name').trim(),vram=+g('vram'),cost=+g('cost');
if(!name)msg='Name is required.';else if(S.servers.some(s=>s.name.toLowerCase()===name.toLowerCase()))msg='A server with that name already exists.';else if(!(vram>0))msg='VRAM must be greater than 0.';else if(!(cost>=0))msg='Cost cannot be negative.';else S.servers.push({id:++uid,name,vram,cost,on:true});go('servers')}
function ed(w,id,k,v){const o=S[w].find(x=>x.id===id);if(['vram','rt'].includes(k)&&!(v>0)||k==='arr'&&!(v>=0)||k==='cost'&&!(v>=0)){alert('Invalid value – change not applied.');return go(tab)}o[k]=v}
function del(w,id){if(confirm('Delete this item?')){S[w]=S[w].filter(x=>x.id!==id);go(tab)}}
async function doRun(){const k=document.getElementById('alg').value;try{run=await api('run',{algo:k,objective:obj,snapshot:snapshot()})}catch(e){run=null;msg='Solver error: '+e.message}go('opt')}
async function doCmp(){try{cmp=await api('compare',{objective:obj,snapshot:snapshot()})}catch(e){cmp=null;msg='Solver error: '+e.message}go('cmp')}
async function doTr(){tH=+document.getElementById('th').value||60;try{trRes=await api('transport',{capacity:tH,snapshot:snapshot()})}catch(e){trRes=null;msg='Solver error: '+e.message}go('tr',1)}


const q=id=>document.getElementById(id);
function updC(){const n=S.servers.filter(s=>s.on).length;if(q('sg'))q('sg').textContent='gpus online: '+n;q('stat').textContent=S.jobs.length+' tasks queued \u00b7 '+S.servers.filter(s=>s.on).length+' GPUs online'}
function openWS(t){closeTM();document.body.classList.add('ws-open');q('ws').classList.add('open');go(t)}
function closeWS(){document.body.classList.remove('ws-open');q('ws').classList.remove('open')}
function openTM(){q('tm').classList.add('open');q('t_err').textContent='';setTimeout(()=>q('t_name').focus(),50)}
function closeTM(){q('tm').classList.remove('open')}
let tt;function toast(m){const e=q('toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2200)}
q('tf').onsubmit=e=>{e.preventDefault();const g=k=>q('t_'+k).value,name=g('name').trim(),vram=+g('vram'),rt=+g('rt'),arr=+g('arr'),dl=g('dl')===''?null:+g('dl');let er='';
if(!name)er='Name is required.';else if(!(vram>0))er='VRAM must be greater than 0.';else if(!(rt>0))er='Runtime must be greater than 0.';else if(!(arr>=0))er='Arrival cannot be negative.';else if(dl!=null&&dl<arr+rt)er='Deadline is before arrival + runtime, so it could never be met.';
if(er){q('t_err').textContent=er;return}
S.jobs.push({id:++uid,name,vram,rt,pri:g('pri'),arr,dl});q('t_name').value='';q('t_dl').value='';closeTM();toast('Task "'+name+'" added');if(q('ws').classList.contains('open')&&tab==='jobs')go('jobs');else updC()};
q('add').onclick=openTM;q('tc').onclick=closeTM;q('wx').onclick=closeWS;
q('rst').onclick=()=>{if(confirm('Reset to the demo workload and servers?')){S=seed();run=cmp=null;go(tab);toast('Demo reset')}};
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o){e.preventDefault();openWS(o.dataset.open)}else if(e.target.closest('[data-close]'))closeWS();else if(e.target===q('tm'))closeTM()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeTM();closeWS()}});
go('jobs');
const tick=()=>q('clk').textContent='time: '+new Date().toTimeString().slice(0,8);tick();setInterval(tick,1000);
