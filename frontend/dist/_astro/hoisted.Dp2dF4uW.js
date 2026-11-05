import"./hoisted.tRJXFLNi.js";const h=localStorage.getItem("gab_token"),v=new URLSearchParams(location.search).get("id");v||(location.href="/cursos");let s=null;const u=document.getElementById("dlg-overlay"),k=document.getElementById("dlg-title"),g=document.getElementById("dlg-msg"),r=document.getElementById("dlg-input"),m=document.getElementById("dlg-cancel"),c=document.getElementById("dlg-ok");function f(e,o=""){return new Promise(a=>{k.textContent=e,g.classList.add("hidden"),r.classList.remove("hidden"),r.value="",r.placeholder=o,c.textContent="OK",u.classList.add("show"),setTimeout(()=>r.focus(),50);const d=()=>{u.classList.remove("show"),m.removeEventListener("click",i),c.removeEventListener("click",l),r.removeEventListener("keydown",t)},i=()=>{d(),a(null)},l=()=>{const n=r.value.trim();d(),a(n||null)},t=n=>{n.key==="Enter"&&l(),n.key==="Escape"&&i()};m.addEventListener("click",i),c.addEventListener("click",l),r.addEventListener("keydown",t)})}function w(e,o){return new Promise(a=>{k.textContent=e,g.textContent=o,g.classList.remove("hidden"),r.classList.add("hidden"),c.textContent="Remover",u.classList.add("show");const d=()=>{u.classList.remove("show"),m.removeEventListener("click",i),c.removeEventListener("click",l)},i=()=>{d(),a(!1)},l=()=>{d(),a(!0)};m.addEventListener("click",i),c.addEventListener("click",l)})}async function p(){const e=await fetch(`/api/cursos/${v}`,{headers:{Authorization:`Bearer ${h}`}});if(!e.ok){location.href="/cursos";return}s=await e.json(),y()}function y(){document.title=`${s.titulo} · Gabarita`;let e=0,o=0;for(const t of s.modulos)e+=t.aulas.length,o+=t.aulas.filter(n=>n.concluida).length;const a=e>0?Math.round(o/e*100):0,d=s.capa_base64?"position:relative;overflow:hidden;min-height:120px":`background:${s.cor||"#6366f1"}`,i=s.capa_base64?`<img src="${s.capa_base64}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt="" /><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.65))"></div>`:"",l=`<div style="position:relative" class="px-6 py-5">
        <h1 class="text-white text-xl font-semibold" style="text-shadow:${s.capa_base64?"0 1px 4px rgba(0,0,0,0.5)":"none"}">${s.titulo}</h1>
        ${s.descricao?`<p style="color:rgba(255,255,255,0.75);text-shadow:${s.capa_base64?"0 1px 3px rgba(0,0,0,0.4)":"none"}" class="text-sm mt-1">${s.descricao}</p>`:""}
      </div>`;document.getElementById("curso-header").innerHTML=`
      <div style="${d}">${i}${l}</div>
      <div class="bg-white px-6 py-3 flex items-center gap-4">
        <div class="flex-1 h-2 rounded-full overflow-hidden" style="background:rgba(25,26,35,0.07)">
          <div class="h-full bg-green rounded-full transition-all" style="width:${a}%"></div>
        </div>
        <span class="text-sm text-dark/50 shrink-0 font-medium">${o}/${e} aulas</span>
      </div>`,document.getElementById("modulos").innerHTML=s.modulos.map(t=>`
      <div class="module-block" id="mod-${t.id}">
        <div class="mod-header" onclick="toggleMod(${t.id})">
          <svg class="chevron" id="chv-${t.id}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
          <span class="font-medium text-sm flex-1 truncate">${t.titulo}</span>
          <span class="text-xs text-dark/30 shrink-0">${t.aulas.length}a</span>
          <button onclick="event.stopPropagation(); delMod(${t.id})"
            class="ml-2 p-1 rounded text-dark/20 hover:text-red-400 hover:bg-red-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div id="aulas-${t.id}">
          ${t.aulas.map(n=>`
            <a href="/aula?id=${n.id}" class="aula-row">
              <div class="check-ring ${n.concluida?"done":""}">
                ${n.concluida?'<svg class="w-3 h-3" style="color:#191a23" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>':""}
              </div>
              <span class="text-sm flex-1">${n.titulo}</span>
              ${n.duracao_min?`<span class="text-xs text-dark/30">${n.duracao_min}min</span>`:""}
              <svg class="w-4 h-4 text-dark/20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>`).join("")}
          <button class="add-aula-btn" onclick="addAula(${t.id})">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nova aula
          </button>
        </div>
      </div>`).join(""),document.getElementById("btn-add-mod").classList.remove("hidden")}function x(e){const o=document.getElementById(`aulas-${e}`),a=document.getElementById(`chv-${e}`),d=o.style.display==="none";o.style.display=d?"":"none",a.classList.toggle("closed",!d)}async function $(e){const o=await f("Título da aula","Ex: Introdução ao tema");if(!o)return;const a=await fetch(`/api/cursos/modulos/${e}/aulas`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${h}`},body:JSON.stringify({titulo:o.trim()})});if(a.ok){const{id:d}=await a.json();location.href=`/aula?id=${d}`}}async function b(e){await w("Remover módulo?","O módulo e todas as suas aulas serão apagados permanentemente.")&&(await fetch(`/api/cursos/modulos/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${h}`}}),p())}document.getElementById("btn-add-mod").addEventListener("click",async()=>{const e=await f("Título do módulo","Ex: Módulo 1 — Introdução");e&&(await fetch(`/api/cursos/${v}/modulos`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${h}`},body:JSON.stringify({titulo:e.trim()})}),p())});window.toggleMod=x;window.addAula=$;window.delMod=b;p();
