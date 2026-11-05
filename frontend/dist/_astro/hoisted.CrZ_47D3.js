import"./MainLayout.astro_astro_type_script_index_0_lang.DL73JIFh.js";const i=localStorage.getItem("gab_token"),l=new URLSearchParams(location.search).get("id");l||(location.href="/cursos");let s=null;async function d(){const t=await fetch(`/api/cursos/${l}`,{headers:{Authorization:`Bearer ${i}`}});if(!t.ok){location.href="/cursos";return}s=await t.json(),r()}function r(){document.title=`${s.titulo} · Gabarita`;let t=0,e=0;for(const o of s.modulos)t+=o.aulas.length,e+=o.aulas.filter(n=>n.concluida).length;const a=t>0?Math.round(e/t*100):0;document.getElementById("curso-header").innerHTML=`
      <div style="background:${s.cor||"#6366f1"}" class="px-6 py-5">
        <h1 class="text-white text-xl font-semibold">${s.titulo}</h1>
        ${s.descricao?`<p class="text-white/65 text-sm mt-1">${s.descricao}</p>`:""}
      </div>
      <div class="bg-white px-6 py-3 flex items-center gap-4">
        <div class="flex-1 h-2 rounded-full overflow-hidden" style="background:rgba(25,26,35,0.07)">
          <div class="h-full bg-green rounded-full transition-all" style="width:${a}%"></div>
        </div>
        <span class="text-sm text-dark/50 shrink-0 font-medium">${e}/${t} aulas</span>
      </div>`,document.getElementById("modulos").innerHTML=s.modulos.map(o=>`
      <div class="module-block" id="mod-${o.id}">
        <div class="mod-header" onclick="toggleMod(${o.id})">
          <svg class="chevron" id="chv-${o.id}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
          <span class="font-medium text-sm flex-1 truncate">${o.titulo}</span>
          <span class="text-xs text-dark/30 shrink-0">${o.aulas.length}a</span>
          <button onclick="event.stopPropagation(); delMod(${o.id})"
            class="ml-2 p-1 rounded text-dark/20 hover:text-red-400 hover:bg-red-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div id="aulas-${o.id}">
          ${o.aulas.map(n=>`
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
          <button class="add-aula-btn" onclick="addAula(${o.id})">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nova aula
          </button>
        </div>
      </div>`).join(""),document.getElementById("btn-add-mod").classList.remove("hidden")}function c(t){const e=document.getElementById(`aulas-${t}`),a=document.getElementById(`chv-${t}`),o=e.style.display==="none";e.style.display=o?"":"none",a.classList.toggle("closed",!o)}async function u(t){const e=prompt("Título da aula:");if(!e?.trim())return;const a=await fetch(`/api/cursos/modulos/${t}/aulas`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({titulo:e.trim()})});if(a.ok){const{id:o}=await a.json();location.href=`/aula?id=${o}`}}async function h(t){confirm("Remover módulo e todas as aulas?")&&(await fetch(`/api/cursos/modulos/${t}`,{method:"DELETE",headers:{Authorization:`Bearer ${i}`}}),d())}document.getElementById("btn-add-mod").addEventListener("click",async()=>{const t=prompt("Título do módulo:");t?.trim()&&(await fetch(`/api/cursos/${l}/modulos`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({titulo:t.trim()})}),d())});window.toggleMod=c;window.addAula=u;window.delMod=h;d();
