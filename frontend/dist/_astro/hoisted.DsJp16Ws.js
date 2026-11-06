import"./hoisted.D1NfsLZe.js";const r=localStorage.getItem("gab_token"),k=new URLSearchParams(location.search).get("id");k||(location.href="/cursos");let s=null;const m=document.getElementById("dlg-overlay"),f=document.getElementById("dlg-title"),g=document.getElementById("dlg-msg"),l=document.getElementById("dlg-input"),h=document.getElementById("dlg-cancel"),i=document.getElementById("dlg-ok");function v(t,o="",a=""){return new Promise(e=>{f.textContent=t,g.classList.add("hidden"),l.classList.remove("hidden"),l.value=a,l.placeholder=o,i.textContent="OK",i.classList.remove("btn-danger"),i.classList.add("btn-primary"),m.classList.add("show"),setTimeout(()=>{l.focus(),l.select()},50);const n=()=>{m.classList.remove("show"),h.removeEventListener("click",d),i.removeEventListener("click",p),l.removeEventListener("keydown",w)},d=()=>{n(),e(null)},p=()=>{const u=l.value.trim();n(),e(u||null)},w=u=>{u.key==="Enter"&&p(),u.key==="Escape"&&d()};h.addEventListener("click",d),i.addEventListener("click",p),l.addEventListener("keydown",w)})}function y(t,o){return new Promise(a=>{f.textContent=t,g.textContent=o,g.classList.remove("hidden"),l.classList.add("hidden"),i.textContent="Excluir",i.classList.remove("btn-primary"),i.classList.add("btn-danger"),m.classList.add("show");const e=()=>{m.classList.remove("show"),h.removeEventListener("click",n),i.removeEventListener("click",d)},n=()=>{e(),a(!1)},d=()=>{e(),a(!0)};h.addEventListener("click",n),i.addEventListener("click",d)})}async function c(){const t=await fetch(`/api/cursos/${k}`,{headers:{Authorization:`Bearer ${r}`}});if(!t.ok){location.href="/cursos";return}s=await t.json(),x()}function x(){document.title=`${s.titulo} · Gabarita`,window.setBreadcrumb?.(["Gabarita",s.titulo]);let t=0,o=0;for(const e of s.modulos)t+=e.aulas.length,o+=e.aulas.filter(n=>n.concluida).length;const a=t>0?Math.round(o/t*100):0;document.getElementById("curso-header").innerHTML=`
      <div class="px-6 py-5 bg-white">
        <h1 class="text-dark text-xl font-semibold">${s.titulo}</h1>
        ${s.descricao?`<p class="text-dark/50 text-sm mt-1">${s.descricao}</p>`:""}
      </div>
      <div class="bg-white px-6 py-3 flex items-center gap-4 border-t border-dark/8">
        <div class="flex-1 h-2 rounded-full overflow-hidden" style="background:rgba(25,26,35,0.07)">
          <div class="h-full bg-green rounded-full transition-all" style="width:${a}%"></div>
        </div>
        <span class="text-sm text-dark/50 shrink-0 font-medium">${o}/${t} aulas</span>
      </div>`,document.getElementById("modulos").innerHTML=s.modulos.map(e=>`
      <div class="module-block" id="mod-${e.id}">
        <div class="mod-header" onclick="toggleMod(${e.id})">
          <svg class="chevron" id="chv-${e.id}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
          <span class="font-medium text-sm flex-1 truncate">${e.titulo}</span>
          <span class="text-xs text-dark/30 shrink-0">${e.aulas.length}a</span>
          <div class="row-actions">
            <button onclick="event.stopPropagation(); renameMod(${e.id})" class="row-act-btn" title="Renomear módulo">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
              </svg>
            </button>
            <button onclick="event.stopPropagation(); delMod(${e.id})" class="row-act-btn danger" title="Excluir módulo">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div id="aulas-${e.id}">
          ${e.aulas.map(n=>`
            <a href="/aula?id=${n.id}" class="aula-row">
              <div class="check-ring ${n.concluida?"done":""}">
                ${n.concluida?'<svg class="w-3 h-3" style="color:#191a23" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>':""}
              </div>
              <span class="text-sm flex-1">${n.titulo}</span>
              ${n.duracao_min?`<span class="text-xs text-dark/30">${n.duracao_min}min</span>`:""}
              <div class="row-actions">
                <button onclick="event.preventDefault(); event.stopPropagation(); renameAula(${n.id})" class="row-act-btn" title="Renomear aula">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
                  </svg>
                </button>
                <button onclick="event.preventDefault(); event.stopPropagation(); delAula(${n.id})" class="row-act-btn danger" title="Excluir aula">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
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
      </div>`).join(""),document.getElementById("btn-add-mod").classList.remove("hidden")}function $(t){const o=document.getElementById(`aulas-${t}`),a=document.getElementById(`chv-${t}`),e=o.style.display==="none";o.style.display=e?"":"none",a.classList.toggle("closed",!e)}async function b(t){const o=await v("Título da aula","Ex: Introdução ao tema");if(!o)return;const a=await fetch(`/api/cursos/modulos/${t}/aulas`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:o.trim()})});if(a.ok){const{id:e}=await a.json();location.href=`/aula?id=${e}`}}async function L(t){await y("Remover módulo?","O módulo e todas as suas aulas serão apagados permanentemente.")&&(await fetch(`/api/cursos/modulos/${t}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`}}),c())}async function E(t){const o=s.modulos.find(e=>e.id===t),a=await v("Renomear módulo","Título do módulo",o?.titulo||"");a&&(await fetch(`/api/cursos/modulos/${t}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:a.trim()})}),c())}async function B(t){let o="";for(const e of s.modulos){const n=e.aulas.find(d=>d.id===t);if(n){o=n.titulo;break}}const a=await v("Renomear aula","Título da aula",o);a&&(await fetch(`/api/cursos/aulas/${t}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:a.trim()})}),c())}async function M(t){await y("Excluir aula?","Esta aula e todo o seu conteúdo serão apagados permanentemente.")&&(await fetch(`/api/cursos/aulas/${t}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`}}),c())}document.getElementById("btn-add-mod").addEventListener("click",async()=>{const t=await v("Título do módulo","Ex: Módulo 1 — Introdução");t&&(await fetch(`/api/cursos/${k}/modulos`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:t.trim()})}),c())});window.toggleMod=$;window.addAula=b;window.delMod=L;window.renameMod=E;window.renameAula=B;window.delAula=M;c();
