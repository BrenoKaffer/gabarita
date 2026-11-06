import"./hoisted.BdX8jcj7.js";const d=localStorage.getItem("gab_token");let n=[];async function r(){const s=await fetch("/api/dominio",{headers:{Authorization:`Bearer ${d}`}});n=s.ok?await s.json():[],l()}function l(){const s=document.getElementById("revisoes-list");if(!n.length){s.innerHTML=`
      <div class="q-card">
        <div class="empty-state">
          <div class="empty-icon">
            <svg class="w-7 h-7 text-dark/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="font-semibold text-dark mb-1">Nada pra revisar ainda</p>
          <p class="text-sm text-dark/50">Resolva algumas questões em Questões pra começar a ver suas revisões aqui.</p>
        </div>
      </div>`;return}s.innerHTML='<div class="q-card">'+n.map((e,a)=>{const t=e.pct>=70?"#b9ff66":e.pct>=40?"#facc15":"#ef4444",i=a>0?"border-top:1px solid rgba(25,26,35,0.07);":"",o=e.pendentes>0?`<span class="pendentes-badge">${e.pendentes} pendente${e.pendentes!==1?"s":""}</span>`:"";return`
      <div style="padding:16px 20px;${i}" class="flex items-center justify-between gap-4 flex-wrap">
        <div class="flex-1 min-w-[180px]">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-medium text-dark">${e.chave}</span>
            ${o}
          </div>
          <div class="text-xs text-dark/40 mt-0.5">${e.total} respondida${e.total!==1?"s":""} · ${e.pct}% de domínio</div>
          <div class="disc-bar-wrap" style="max-width:220px"><div class="disc-bar-fill" style="width:${e.pct}%;background:${t}"></div></div>
        </div>
        <button class="btn-primary text-sm px-4 py-2 shrink-0" data-i="${a}" ${e.pendentes===0?'disabled style="opacity:0.35;cursor:not-allowed"':""}>
          Revisar agora
        </button>
      </div>`}).join("")+"</div>",s.querySelectorAll("button[data-i]").forEach(e=>{e.addEventListener("click",()=>c(n[parseInt(e.dataset.i,10)],e))})}async function c(s,e){e.disabled=!0,e.textContent="Criando sessão…";const a={status_filtro:"fraco",quantidade:Math.min(s.pendentes,20)||10};s.aula_id?a.aula_ids=[s.aula_id]:a.disciplina=s.chave;const t=await fetch("/api/sessoes",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify(a)});if(!t.ok){e.disabled=!1,e.textContent="Revisar agora";return}const{session_id:i}=await t.json();location.href=`/study?resume=${i}`}r();
