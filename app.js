/* Jueceo GAV MEX – acceso con código de licencia.
   Cada equipo tiene un identificador propio (guardado en este navegador). La primera vez el juez escribe su código y el
   servidor de licencias (Google Apps Script, ver apps-script/Codigo.gs) liga el equipo a su licencia. Cada vez que se abre
   la app, y cada 30 minutos mientras está abierta, se vuelve a revisar: si el administrador la canceló, venció o liberó
   este equipo, el editor se cierra. Sin internet funciona hasta GRACIA días desde la última revisión correcta.
   Las rutinas se quedan en el equipo (editor.js); aquí no se tocan. */
(function(){
const gate=document.getElementById('gate'), ed=document.getElementById('ed');
const API=(window.JUECEO||{}).api||'';
const LS_EQ='jueceo_equipo', LS_LIC='jueceo_licencia', LS_COD='jueceo_codigo';
const DIA=86400000, CADA=30*60000;
const limpio=v=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const bonito=c=>c.replace(/(.{5})(?=.)/g,'$1-');
const escA=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const leer=k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}};
const poner=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
let abierto=false, ultimaRevision=0, timer=null;

function equipo(){
  let id=leer(LS_EQ);
  if(!id){id=(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));poner(LS_EQ,id);}
  return id;
}
const MSG={no:'Ese código no existe. Revisa que esté bien escrito.',
  cancelada:'Esta licencia fue cancelada. Para seguir usando la app, contacta al administrador.',
  vencida:'Esta licencia venció. Para renovarla, contacta al administrador.',
  liberado:'Este equipo ya no está autorizado en la licencia. Escribe tu código otra vez.',
  lleno:'Este código ya se usa en el máximo de equipos permitido. Pide al administrador que libere uno.',
  red:'No se pudo conectar. Revisa tu internet e inténtalo de nuevo.',
  offline:'Hace varios días que no se revisa tu licencia. Conéctate a internet y vuelve a abrir la app.'};
const TITULO='<h1>Jueceo GAV MEX</h1>';

// Llama al servidor de licencias. Devuelve su respuesta, o null si no hubo conexión.
async function api(p){
  const ctl=new AbortController(), t=setTimeout(()=>ctl.abort(),15000);
  try{const r=await fetch(API,{method:'POST',body:JSON.stringify(p),headers:{'Content-Type':'text/plain;charset=utf-8'},signal:ctl.signal});
    if(!r.ok)return null;return await r.json();}
  catch(e){return null;}finally{clearTimeout(t);}
}
const pedir=(codigo,extra)=>api({accion:'validar',codigo,equipo:equipo(),ua:navigator.userAgent,...extra});

function pantallaCodigo(aviso,clase){
  gate.hidden=false; ed.hidden=true;
  gate.innerHTML=`${TITULO}<p>Editor de rutinas para jueces. Escribe el código de licencia que te dio el administrador.</p>
    <form id="fcod" autocomplete="off"><label>Código de licencia<input id="codigo" inputmode="text" autocapitalize="characters" autocorrect="off" spellcheck="false" data-1p-ignore="true" data-lpignore="true" data-form-type="other" placeholder="XXXXX-XXXXX" maxlength="24"></label>
    <button class="btn full" type="submit">Entrar</button><div class="msg ${clase||''}" id="msg">${escA(aviso||'')}</div></form>
    <div class="lic-pie">El código se liga a este equipo. Uso personal: no lo compartas.<br>Tus rutinas se guardan solo en este equipo.</div>`;
  const f=document.getElementById('fcod'), inp=document.getElementById('codigo');
  const c0=leer(LS_COD);if(c0)inp.value=bonito(c0);
  inp.focus();
  f.onsubmit=async e=>{e.preventDefault();const c=limpio(inp.value),m=document.getElementById('msg'),b=f.querySelector('button');
    if(c.length<6){m.className='msg bad';m.textContent='Escribe el código completo.';return;}
    b.disabled=true;m.className='msg';m.textContent='Revisando…';
    const r=await pedir(c,{activar:true,entrada:true});
    if(!r||!('ok' in r)){m.className='msg bad';m.textContent=MSG.red;b.disabled=false;return;}
    if(!r.ok){m.className='msg bad';m.textContent=MSG[r.motivo]||r.error||MSG.red;b.disabled=false;return;}
    poner(LS_COD,c);aceptar(c,r);abrir();
  };
}

function aceptar(c,r){ultimaRevision=Date.now();poner(LS_LIC,{codigo:c,nombre:r.nombre||'',vence:r.vence||null,okHasta:Date.now()+(r.gracia||3)*DIA});}

function bloquear(motivo){
  clearInterval(timer);timer=null;
  if(abierto){abierto=false;ed.innerHTML='';}   // el editor se borra de la pantalla; las rutinas siguen guardadas en el equipo
  if(motivo==='offline'){gate.hidden=false;ed.hidden=true;   // la licencia se conserva: al volver el internet se revisa sola
    gate.innerHTML=`${TITULO}<div class="box"><div class="msg bad">${MSG.offline}</div><button class="btn full" onclick="location.reload()">Reintentar</button></div>`;return;}
  poner(LS_LIC,null);
  pantallaCodigo(MSG[motivo]||MSG.red,'bad');
}

// Revisa la licencia guardada. entrada = se acaba de abrir la app (queda en el registro de accesos).
async function revisar(entrada){
  const lic=leer(LS_LIC);
  if(!lic)return bloquear('liberado');
  if(lic.vence&&Date.parse(lic.vence)<=Date.now())return bloquear('vencida');
  const r=await pedir(lic.codigo,{entrada});
  if(r&&r.ok===true){aceptar(lic.codigo,r);return true;}
  if(r&&r.ok===false&&r.motivo)return bloquear(r.motivo);
  // Sin conexión: se permite mientras no pase el plazo de gracia.
  if(Date.now()<(lic.okHasta||0))return true;
  return bloquear('offline');
}

async function abrir(){
  gate.hidden=false;gate.innerHTML='<p class="loading">Abriendo el editor…</p>';
  try{
    const get=u=>fetch(u,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('No se pudo cargar '+u);return r.json();});
    const [cat,obl]=await Promise.all([get('datos/elementos.json'),get('datos/obligatorios.json')]);
    if(!leer(LS_LIC))return;   // se bloqueó mientras cargaba
    gate.hidden=true;ed.hidden=false;abierto=true;
    iniciarEditor(cat,obl);
  }catch(err){console.error(err);
    gate.innerHTML=`${TITULO}<div class="box"><div class="msg bad">${escA(err.message||MSG.red)}</div><button class="btn full" onclick="location.reload()">Reintentar</button></div>`;return;}
  clearInterval(timer);timer=setInterval(()=>revisar(false),CADA);
}

document.addEventListener('visibilitychange',()=>{if(abierto&&document.visibilityState==='visible'&&Date.now()-ultimaRevision>5*60000)revisar(false);});

async function arranque(){
  if(!API||/PENDIENTE/.test(API)){gate.innerHTML=`${TITULO}<p>La app aún no está configurada.</p>`;return;}
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
  if(!leer(LS_LIC))return pantallaCodigo();
  gate.innerHTML='<p class="loading">Revisando licencia…</p>';
  if(await revisar(true)===true)abrir();
}
arranque();
})();
