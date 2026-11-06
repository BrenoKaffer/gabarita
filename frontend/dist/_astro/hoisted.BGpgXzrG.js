import"./hoisted.BdX8jcj7.js";const r=localStorage.getItem("gab_token"),p=new URLSearchParams(location.search).get("id");p||(location.href="/cursos");let i=null;const w=document.getElementById("dlg-overlay"),I=document.getElementById("dlg-title"),L=document.getElementById("dlg-msg"),l=document.getElementById("dlg-input"),f=document.getElementById("dlg-cancel"),d=document.getElementById("dlg-ok");function E(e,t="",n=""){return new Promise(o=>{I.textContent=e,L.classList.add("hidden"),l.classList.remove("hidden"),l.value=n,l.placeholder=t,d.textContent="OK",d.classList.remove("btn-danger"),d.classList.add("btn-primary"),w.classList.add("show"),setTimeout(()=>{l.focus(),l.select()},50);const a=()=>{w.classList.remove("show"),f.removeEventListener("click",s),d.removeEventListener("click",c),l.removeEventListener("keydown",u)},s=()=>{a(),o(null)},c=()=>{const h=l.value.trim();a(),o(h||null)},u=h=>{h.key==="Enter"&&c(),h.key==="Escape"&&s()};f.addEventListener("click",s),d.addEventListener("click",c),l.addEventListener("keydown",u)})}function B(e,t){return new Promise(n=>{I.textContent=e,L.textContent=t,L.classList.remove("hidden"),l.classList.add("hidden"),d.textContent="Excluir",d.classList.remove("btn-primary"),d.classList.add("btn-danger"),w.classList.add("show");const o=()=>{w.classList.remove("show"),f.removeEventListener("click",a),d.removeEventListener("click",s)},a=()=>{o(),n(!1)},s=()=>{o(),n(!0)};f.addEventListener("click",a),d.addEventListener("click",s)})}async function g(){const e=await fetch(`/api/cursos/${p}`,{headers:{Authorization:`Bearer ${r}`}});if(!e.ok){location.href="/cursos";return}i=await e.json(),C()}function C(){document.title=`${i.titulo} · Gabarita`,window.setBreadcrumb?.(["Gabarita",i.titulo]);let e=0,t=0;for(const o of i.modulos)e+=o.aulas.length,t+=o.aulas.filter(a=>a.concluida).length;const n=e>0?Math.round(t/e*100):0;document.getElementById("curso-header").innerHTML=`
      <div class="px-6 py-5 bg-white">
        <h1 class="text-dark text-xl font-semibold pr-8">${i.titulo}</h1>
        ${i.descricao?`<p class="text-dark/50 text-sm mt-1">${i.descricao}</p>`:""}
      </div>
      <div class="bg-white px-6 py-3 flex items-center gap-4 border-t border-dark/8">
        <div class="flex-1 h-2 rounded-full overflow-hidden" style="background:rgba(25,26,35,0.07)">
          <div class="h-full bg-green rounded-full transition-all" style="width:${n}%"></div>
        </div>
        <span class="text-sm text-dark/50 shrink-0 font-medium">${t}/${e} aulas</span>
      </div>`,document.getElementById("modulos").innerHTML=i.modulos.map(o=>`
      <div class="module-block" id="mod-${o.id}">
        <div class="mod-header" onclick="toggleMod(${o.id})">
          <svg class="chevron" id="chv-${o.id}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
          <span class="font-medium text-sm flex-1 truncate">${o.titulo}</span>
          <span class="text-xs text-dark/30 shrink-0">${o.aulas.length}a</span>
          <div class="row-actions">
            <button onclick="event.stopPropagation(); renameMod(${o.id})" class="row-act-btn" title="Renomear módulo">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
              </svg>
            </button>
            <button onclick="event.stopPropagation(); delMod(${o.id})" class="row-act-btn danger" title="Excluir módulo">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div id="aulas-${o.id}">
          ${o.aulas.map(a=>`
            <a href="/aula?id=${a.id}" class="aula-row">
              <div class="check-ring ${a.concluida?"done":""}">
                ${a.concluida?'<svg class="w-3 h-3" style="color:#191a23" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>':""}
              </div>
              <span class="text-sm flex-1">${a.titulo}</span>
              ${a.duracao_min?`<span class="text-xs text-dark/30">${a.duracao_min}min</span>`:""}
              <div class="row-actions">
                <button onclick="event.preventDefault(); event.stopPropagation(); renameAula(${a.id})" class="row-act-btn" title="Renomear aula">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
                  </svg>
                </button>
                <button onclick="event.preventDefault(); event.stopPropagation(); delAula(${a.id})" class="row-act-btn danger" title="Excluir aula">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <svg class="w-4 h-4 text-dark/20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>`).join("")}
          <button class="add-aula-btn" onclick="addAula(${o.id})">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nova aula
          </button>
        </div>
      </div>`).join(""),document.getElementById("btn-add-mod").classList.remove("hidden")}function M(e){const t=document.getElementById(`aulas-${e}`),n=document.getElementById(`chv-${e}`),o=t.style.display==="none";t.style.display=o?"":"none",n.classList.toggle("closed",!o)}async function A(e){const t=await E("Título da aula","Ex: Introdução ao tema");if(!t)return;const n=await fetch(`/api/cursos/modulos/${e}/aulas`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:t.trim()})});if(n.ok){const{id:o}=await n.json();location.href=`/aula?id=${o}`}}async function T(e){await B("Remover módulo?","O módulo e todas as suas aulas serão apagados permanentemente.")&&(await fetch(`/api/cursos/modulos/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`}}),g())}async function j(e){const t=i.modulos.find(o=>o.id===e),n=await E("Renomear módulo","Título do módulo",t?.titulo||"");n&&(await fetch(`/api/cursos/modulos/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:n.trim()})}),g())}async function O(e){let t="";for(const o of i.modulos){const a=o.aulas.find(s=>s.id===e);if(a){t=a.titulo;break}}const n=await E("Renomear aula","Título da aula",t);n&&(await fetch(`/api/cursos/aulas/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:n.trim()})}),g())}async function P(e){await B("Excluir aula?","Esta aula e todo o seu conteúdo serão apagados permanentemente.")&&(await fetch(`/api/cursos/aulas/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`}}),g())}document.getElementById("btn-add-mod").addEventListener("click",async()=>{const e=await E("Título do módulo","Ex: Módulo 1 — Introdução");e&&(await fetch(`/api/cursos/${p}/modulos`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:e.trim()})}),g())});window.toggleMod=M;window.addAula=A;window.delMod=T;window.renameMod=j;window.renameAula=O;window.delAula=P;function S(e){e.stopPropagation(),document.getElementById("curso-menu")?.classList.toggle("show")}document.addEventListener("click",e=>{const t=document.getElementById("curso-menu");t&&t.classList.contains("show")&&!e.target.closest(".hdr-menu-wrap")&&t.classList.remove("show")});async function z(){document.getElementById("curso-menu")?.classList.remove("show"),await B("Excluir curso?","O curso, seus módulos e aulas serão apagados permanentemente.")&&(await fetch(`/api/cursos/${p}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`}}),location.href="/cursos")}function R(){document.getElementById("curso-menu")?.classList.remove("show"),location.href=`/importar?curso_id=${p}`}let k="#6366f1",v=null;const y=document.getElementById("edit-overlay");function U(e){return new Promise(t=>{const n=new Image,o=URL.createObjectURL(e);n.onload=()=>{let{width:s,height:c}=n;s>800&&(c=Math.round(c*800/s),s=800);const u=document.createElement("canvas");u.width=s,u.height=c,u.getContext("2d").drawImage(n,0,0,s,c),URL.revokeObjectURL(o),t(u.toDataURL("image/jpeg",.7))},n.src=o})}async function $(e){const t=await U(e);v=t,document.getElementById("edit-capa-img").src=t,document.getElementById("edit-capa-preview").style.display="block",document.getElementById("edit-upload-label").textContent=e.name}const b=document.getElementById("edit-inp-capa"),m=document.getElementById("edit-upload-zone");m.addEventListener("click",()=>b.click());m.addEventListener("dragover",e=>{e.preventDefault(),m.classList.add("drag")});m.addEventListener("dragleave",()=>m.classList.remove("drag"));m.addEventListener("drop",async e=>{e.preventDefault(),m.classList.remove("drag");const t=e.dataTransfer?.files[0];t&&await $(t)});b.addEventListener("change",async()=>{const e=b.files?.[0];e&&await $(e)});document.getElementById("edit-color-picker").addEventListener("click",e=>{const t=e.target.closest(".color-dot");t&&(document.querySelectorAll("#edit-color-picker .color-dot").forEach(n=>n.classList.remove("sel")),t.classList.add("sel"),k=t.dataset.c)});function D(){document.getElementById("curso-menu")?.classList.remove("show"),k=i.cor||"#6366f1",v=i.capa_base64||null,document.getElementById("edit-inp-titulo").value=i.titulo||"",document.getElementById("edit-inp-desc").value=i.descricao||"",document.querySelectorAll("#edit-color-picker .color-dot").forEach(e=>e.classList.toggle("sel",e.dataset.c===k)),v?(document.getElementById("edit-capa-img").src=v,document.getElementById("edit-capa-preview").style.display="block",document.getElementById("edit-upload-label").textContent="Capa atual (clique para trocar)"):(document.getElementById("edit-capa-preview").style.display="none",document.getElementById("edit-upload-label").textContent="Clique ou arraste uma imagem"),y.classList.add("show")}function x(){y.classList.remove("show")}y.addEventListener("click",e=>{e.target===y&&x()});document.getElementById("edit-btn-cancel").addEventListener("click",x);document.getElementById("edit-btn-salvar").addEventListener("click",async()=>{const e=document.getElementById("edit-inp-titulo").value.trim(),t=document.getElementById("edit-inp-desc").value.trim();if(!e){document.getElementById("edit-inp-titulo").focus();return}const n=document.getElementById("edit-btn-salvar");n.textContent="Salvando…",n.disabled=!0;const o=await fetch(`/api/cursos/${p}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({titulo:e,descricao:t,cor:k,capa_base64:v})});n.textContent="Salvar",n.disabled=!1,o.ok&&(x(),g())});window.toggleCursoMenu=S;window.openEditCursoModal=D;window.excluirCurso=z;window.irParaImportar=R;g();
