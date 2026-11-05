import"./hoisted.D1NfsLZe.js";const m=localStorage.getItem("gab_token"),v=new URLSearchParams(location.search).get("id");v||(location.href="/cursos");let a=null;const c=document.getElementById("dlg-overlay"),p=document.getElementById("dlg-title"),h=document.getElementById("dlg-msg"),d=document.getElementById("dlg-input"),u=document.getElementById("dlg-cancel"),i=document.getElementById("dlg-ok");function f(t,n=""){return new Promise(s=>{p.textContent=t,h.classList.add("hidden"),d.classList.remove("hidden"),d.value="",d.placeholder=n,i.textContent="OK",c.classList.add("show"),setTimeout(()=>d.focus(),50);const e=()=>{c.classList.remove("show"),u.removeEventListener("click",o),i.removeEventListener("click",l),d.removeEventListener("keydown",k)},o=()=>{e(),s(null)},l=()=>{const r=d.value.trim();e(),s(r||null)},k=r=>{r.key==="Enter"&&l(),r.key==="Escape"&&o()};u.addEventListener("click",o),i.addEventListener("click",l),d.addEventListener("keydown",k)})}function w(t,n){return new Promise(s=>{p.textContent=t,h.textContent=n,h.classList.remove("hidden"),d.classList.add("hidden"),i.textContent="Remover",c.classList.add("show");const e=()=>{c.classList.remove("show"),u.removeEventListener("click",o),i.removeEventListener("click",l)},o=()=>{e(),s(!1)},l=()=>{e(),s(!0)};u.addEventListener("click",o),i.addEventListener("click",l)})}async function g(){const t=await fetch(`/api/cursos/${v}`,{headers:{Authorization:`Bearer ${m}`}});if(!t.ok){location.href="/cursos";return}a=await t.json(),y()}function y(){document.title=`${a.titulo} · Gabarita`,window.setBreadcrumb?.(["Gabarita",a.titulo]);let t=0,n=0;for(const e of a.modulos)t+=e.aulas.length,n+=e.aulas.filter(o=>o.concluida).length;const s=t>0?Math.round(n/t*100):0;document.getElementById("curso-header").innerHTML=`
      <div class="px-6 py-5 bg-white">
        <h1 class="text-dark text-xl font-semibold">${a.titulo}</h1>
        ${a.descricao?`<p class="text-dark/50 text-sm mt-1">${a.descricao}</p>`:""}
      </div>
      <div class="bg-white px-6 py-3 flex items-center gap-4 border-t border-dark/8">
        <div class="flex-1 h-2 rounded-full overflow-hidden" style="background:rgba(25,26,35,0.07)">
          <div class="h-full bg-green rounded-full transition-all" style="width:${s}%"></div>
        </div>
        <span class="text-sm text-dark/50 shrink-0 font-medium">${n}/${t} aulas</span>
      </div>`,document.getElementById("modulos").innerHTML=a.modulos.map(e=>`
      <div class="module-block" id="mod-${e.id}">
        <div class="mod-header" onclick="toggleMod(${e.id})">
          <svg class="chevron" id="chv-${e.id}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
          <span class="font-medium text-sm flex-1 truncate">${e.titulo}</span>
          <span class="text-xs text-dark/30 shrink-0">${e.aulas.length}a</span>
          <button onclick="event.stopPropagation(); delMod(${e.id})"
            class="ml-2 p-1 rounded text-dark/20 hover:text-red-400 hover:bg-red-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div id="aulas-${e.id}">
          ${e.aulas.map(o=>`
            <a href="/aula?id=${o.id}" class="aula-row">
              <div class="check-ring ${o.concluida?"done":""}">
                ${o.concluida?'<svg class="w-3 h-3" style="color:#191a23" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>':""}
              </div>
              <span class="text-sm flex-1">${o.titulo}</span>
              ${o.duracao_min?`<span class="text-xs text-dark/30">${o.duracao_min}min</span>`:""}
              <svg class="w-4 h-4 text-dark/20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>`).join("")}
          <button class="add-aula-btn" onclick="addAula(${e.id})">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nova aula
          </button>
        </div>
      </div>`).join(""),document.getElementById("btn-add-mod").classList.remove("hidden")}function x(t){const n=document.getElementById(`aulas-${t}`),s=document.getElementById(`chv-${t}`),e=n.style.display==="none";n.style.display=e?"":"none",s.classList.toggle("closed",!e)}async function $(t){const n=await f("Título da aula","Ex: Introdução ao tema");if(!n)return;const s=await fetch(`/api/cursos/modulos/${t}/aulas`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${m}`},body:JSON.stringify({titulo:n.trim()})});if(s.ok){const{id:e}=await s.json();location.href=`/aula?id=${e}`}}async function E(t){await w("Remover módulo?","O módulo e todas as suas aulas serão apagados permanentemente.")&&(await fetch(`/api/cursos/modulos/${t}`,{method:"DELETE",headers:{Authorization:`Bearer ${m}`}}),g())}document.getElementById("btn-add-mod").addEventListener("click",async()=>{const t=await f("Título do módulo","Ex: Módulo 1 — Introdução");t&&(await fetch(`/api/cursos/${v}/modulos`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${m}`},body:JSON.stringify({titulo:t.trim()})}),g())});window.toggleMod=x;window.addAula=$;window.delMod=E;g();
