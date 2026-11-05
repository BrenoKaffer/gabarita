import"./MainLayout.astro_astro_type_script_index_0_lang.TUPaop0E.js";const d=localStorage.getItem("gab_token"),l=new URLSearchParams(location.search).get("id");l||(location.href="/cursos");let o=null;async function r(){const t=await fetch(`/api/cursos/${l}`,{headers:{Authorization:`Bearer ${d}`}});if(!t.ok){location.href="/cursos";return}o=await t.json(),h()}function h(){document.title=`${o.titulo} · Gabarita`;let t=0,a=0;for(const e of o.modulos)t+=e.aulas.length,a+=e.aulas.filter(s=>s.concluida).length;const n=t>0?Math.round(a/t*100):0,i=o.capa_base64?"position:relative;overflow:hidden;min-height:120px":`background:${o.cor||"#6366f1"}`,c=o.capa_base64?`<img src="${o.capa_base64}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt="" /><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.65))"></div>`:"",u=`<div style="position:relative" class="px-6 py-5">
        <h1 class="text-white text-xl font-semibold" style="text-shadow:${o.capa_base64?"0 1px 4px rgba(0,0,0,0.5)":"none"}">${o.titulo}</h1>
        ${o.descricao?`<p style="color:rgba(255,255,255,0.75);text-shadow:${o.capa_base64?"0 1px 3px rgba(0,0,0,0.4)":"none"}" class="text-sm mt-1">${o.descricao}</p>`:""}
      </div>`;document.getElementById("curso-header").innerHTML=`
      <div style="${i}">${c}${u}</div>
      <div class="bg-white px-6 py-3 flex items-center gap-4">
        <div class="flex-1 h-2 rounded-full overflow-hidden" style="background:rgba(25,26,35,0.07)">
          <div class="h-full bg-green rounded-full transition-all" style="width:${n}%"></div>
        </div>
        <span class="text-sm text-dark/50 shrink-0 font-medium">${a}/${t} aulas</span>
      </div>`,document.getElementById("modulos").innerHTML=o.modulos.map(e=>`
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
          ${e.aulas.map(s=>`
            <a href="/aula?id=${s.id}" class="aula-row">
              <div class="check-ring ${s.concluida?"done":""}">
                ${s.concluida?'<svg class="w-3 h-3" style="color:#191a23" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>':""}
              </div>
              <span class="text-sm flex-1">${s.titulo}</span>
              ${s.duracao_min?`<span class="text-xs text-dark/30">${s.duracao_min}min</span>`:""}
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
      </div>`).join(""),document.getElementById("btn-add-mod").classList.remove("hidden")}function p(t){const a=document.getElementById(`aulas-${t}`),n=document.getElementById(`chv-${t}`),i=a.style.display==="none";a.style.display=i?"":"none",n.classList.toggle("closed",!i)}async function g(t){const a=prompt("Título da aula:");if(!a?.trim())return;const n=await fetch(`/api/cursos/modulos/${t}/aulas`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({titulo:a.trim()})});if(n.ok){const{id:i}=await n.json();location.href=`/aula?id=${i}`}}async function m(t){confirm("Remover módulo e todas as aulas?")&&(await fetch(`/api/cursos/modulos/${t}`,{method:"DELETE",headers:{Authorization:`Bearer ${d}`}}),r())}document.getElementById("btn-add-mod").addEventListener("click",async()=>{const t=prompt("Título do módulo:");t?.trim()&&(await fetch(`/api/cursos/${l}/modulos`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({titulo:t.trim()})}),r())});window.toggleMod=p;window.addAula=g;window.delMod=m;r();
