const I=(h,t)=>`<a href="${h}" target="_blank" rel="noopener" title="${t}">`;
function profile(){const a=ME.photo?`<img src="${ME.photo}" alt="" onerror="this.remove()">`:'';
return `<div class="avatar">${a||"RP"}</div>
<p><b>Name:</b> ${ME.name}</p><p><b>Roll No:</b> ${ME.roll}</p><p><b>Department:</b> ${ME.dept}</p><p><b>Section:</b> ${ME.sec}</p><p><b>Subject:</b> ${ME.subj}</p><p><b>Faculty:</b> ${ME.fac}</p>
<div class="soc">${I(ME.website,'Website')}🌐</a>${I(ME.linkedin,'LinkedIn')}in</a>${I(ME.github,'GitHub')}GH</a>${I(ME.instagram,'Instagram')}IG</a></div>
<a class="btn" href="#/about">View More</a>`}
const NAV=[["#/student","🏠","Home"],["#/modules","📘","Modules"],["#/experiments","🧪","Experiments"],["#/tools","🛠","Tools"]];
const tiles=(a)=>`<div class="grid">${a.join('')}</div>`;
function page(){const h=(location.hash||'#/').slice(2).split('/'),r=h[0];
const crumb=(...l)=>`<div class="crumb">${l.map(x=>`<a href="${x[0]}">${x[1]}</a>`).join(' › ')}</div>`;
if(r==='student')return home();
if(r==='modules')return `<div class="card"><h2 class="pt">📘 Modules</h2>${tiles(MODS.map((m,i)=>`<a class="tile" href="#/module/${i+1}"><b>${i+1}</b>Module ${i+1}</a>`))}</div>`;
if(r==='module'){const i=+h[1]-1,m=MODS[i];return `<div class="card">${crumb(['#/modules','Modules'],['#','Module '+(i+1)])}<h2 class="pt">Module ${i+1}: ${m[0]}</h2><div class="full">${FULL[i]}</div></div>`}
if(r==='experiments')return `<div class="card"><h2 class="pt">🧪 Lab Experiments</h2>${tiles([...Array(10)].map((_,i)=>`<a class="tile" href="#/exp/${i+1}"><b>${i+1}</b>Experiment ${i+1}${EXPS[i+1]?'<br><small>'+EXPS[i+1].subs.length+' parts</small>':''}</a>`))}</div>`;
if(r==='exp'){const n=+h[1],e=EXPS[n];
if(!e)return `<div class="card">${crumb(['#/experiments','Experiments'],['#','Experiment '+n])}<h2 class="pt">Experiment ${n}</h2><p>Content for this experiment hasn't been added yet. Add it to the <code>EXPS</code> object in the page source.</p></div>`;
if(h[2]===undefined)return `<div class="card">${crumb(['#/experiments','Experiments'],['#','Experiment '+n])}<h2 class="pt">Experiment ${n}: ${e.t}</h2>${tiles(e.subs.map((s,i)=>`<a class="tile" href="#/exp/${n}/${i}"><b>${String.fromCharCode(97+i)}</b>${E(s.t.replace(/^\d+\w\.\s*/,''))}</a>`))}</div>`;
const s=e.subs[+h[2]];return `<div class="card">${crumb(['#/experiments','Experiments'],['#/exp/'+n,'Experiment '+n],['#',s.t.slice(0,2)])}<h2 class="pt">${E(s.t)}</h2>
<div class="ide"><div><h4>Code editor</h4><textarea id="code" spellcheck="false">${E(s.c)}</textarea><button class="btn" onclick="run(${n},${+h[2]})">▶ Run</button></div>
<div><h4>Output</h4><div class="out" id="out">Press Run to see the output.</div></div></div>
<p class="note">Note: output shown is the verified expected output for this program (the page cannot execute Python in the browser sandbox). To run it live, paste the code into Jupyter / Colab.</p></div>`}
if(r==='tools')return `<div class="card"><h2 class="pt">🛠 Tools for Data Science</h2>${TOOLS.map(t=>`<h3>${t[0]}</h3><p style="margin:0;color:var(--mut)">${t[1]}</p>`).join('')}</div>`;
if(r==='about')return `<div class="card abt"><div class="l"><a class="btn" href="#/" style="margin:0 0 12px">← Back</a><h2 class="pt">ABOUT ME</h2>
<dl class="info">
<dt>Name</dt><dd>Pranathi</dd>
<dt>Degree</dt><dd>B.Tech 3rd Year — CSE (Data Science)</dd>
<dt>University</dt><dd>Mohan Babu University</dd>
<dt>CGPA</dt><dd>9.04</dd>
<dt>Intermediate</dt><dd>Chaitanya Junior College — 96%</dd>
<dt>School</dt><dd>Prasanna Bharathi High School, Tirupati</dd>
<dt>Skills</dt><dd class="chips"><span>Python</span><span>Java</span><span>C</span><span>SQL</span><span>Power BI</span></dd>
<dt>Other Areas</dt><dd><ul><li>Data Science</li><li>Artificial Intelligence</li><li>Machine Learning — basic understanding</li><li>Problem Solving</li><li>Data Analysis</li></ul></dd>
<dt>Certifications / Achievements</dt><dd><ul><li>HackerRank Java Basic</li><li>HackerRank Python — 2 stars</li></ul></dd>
<dt>Projects</dt><dd><ul><li>Power BI projects such as <b>Road Analysis Dashboard</b> and <b>Blinkit Dashboard</b></li></ul></dd>
</dl>
<h3>My Resume</h3><p><a class="btn" id="resOpen" href="${resumeURL()}" target="_blank" rel="noopener">📄 Open Resume</a> <a class="btn" id="resDl" href="${resumeURL()}" download="Pranathi_Resume.pdf">⬇ Download PDF</a></p></div></div>`;
return home()}
function home(){return `<div class="card"><h2 class="pt" style="font-size:26px">Welcome to the Data Science Digital Library</h2>
<div class="big"><a class="bigc" href="#/modules"><small>📘</small>Modules</a>
<div class="bigc exp"><a href="#/experiments" style="color:#fff;text-decoration:none;display:block"><small>🧪</small>Lab Experiments</a><div class="mini">${[...Array(10)].map((_,i)=>`<a href="#/exp/${i+1}">${i+1}</a>`).join('')}</div></div>
<a class="bigc" href="#/tools"><small>🛠</small>Tools</a></div></div>`}
let _rb=null;
function resumeURL(){if(_rb)return _rb;
try{if(typeof RESUME_B64!=='undefined'){const bin=atob(RESUME_B64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return _rb=URL.createObjectURL(new Blob([u],{type:'application/pdf'}))}}catch(e){}
return ME.resume}
function idcard(){const a=ME.photo?`<img src="${ME.photo}" alt="" onerror="this.remove()">`:'';
return `<div class="ov" onclick="if(event.target===this)location.hash='#/'"><div class="idc" role="dialog" aria-label="Student ID card">
<button class="x" onclick="location.hash='#/'" aria-label="Close">✕</button>
<div class="idh"><div class="logo">🎓</div><div><b>MOHAN BABU UNIVERSITY</b><small>Tirupati, Andhra Pradesh</small></div></div>
<div class="idt">STUDENT ID CARD</div>
<div class="idb"><div class="idp">${a||'RP'}</div>
<div class="idd"><h3>${ME.name}</h3><p><span>Roll No</span>${ME.roll}</p><p><span>Department</span>${ME.dept}</p><p><span>Section</span>${ME.sec}</p><p><span>Subject</span>${ME.subj}</p><p><span>Faculty</span>${ME.fac}</p></div></div>
<div class="bar">${[...ME.roll].map((c,i)=>`<i style="width:${(c.charCodeAt(0)+i)%3+2}px"></i>`).join('')}</div>
<div class="idf">Digital Library · ${ME.subj}</div></div></div>`}
function run(n,i){const el=document.getElementById('out');const o=EXPS[n].subs[i].o;if(o.includes('<img')){el.innerHTML=o}else{el.textContent=o}}
function render(){const hs=location.hash||'#/';document.getElementById('main').innerHTML=page();
document.getElementById('nav').innerHTML=NAV.map(n=>`<a href="${n[0]}" class="${hs.startsWith(n[0])?'on':''}"><span>${n[1]}</span>${n[2]}</a>`).join('');
document.getElementById('prof').innerHTML=profile();
let ov=document.getElementById('ov');if(!ov){ov=document.createElement('div');ov.id='ov';document.body.appendChild(ov)}
ov.innerHTML=hs.startsWith('#/student')?idcard():'';document.body.style.overflow=ov.innerHTML?'hidden':'';scrollTo(0,0)}
addEventListener('keydown',e=>{if(e.key==='Escape'&&(location.hash||'').startsWith('#/student'))location.hash='#/'});
addEventListener('hashchange',render);render();
