import"./hoisted.BdX8jcj7.js";const c=localStorage.getItem("gab_token"),_=["step-dashboard","step-builder","step-confirmacao","step-resolucao","step-relatorio"],j={"step-dashboard":null,"step-builder":"Nova sessão","step-confirmacao":"Confirmação","step-resolucao":"Resolução","step-relatorio":"Relatório"};function m(e){_.forEach(n=>document.getElementById(n).classList.add("hidden")),document.getElementById(e).classList.remove("hidden");const t=j[e];window.setBreadcrumb?.(t?["Gabarita","Questões",t]:["Gabarita","Questões"])}let b=null,f=[],u=0,w={},y=new Set,x=new Set,v=parseInt(localStorage.getItem("gab_fontsize")||"15"),I=0,B="",L="todas",S=10,k=null;async function q(){const e=await fetch("/api/sessoes/aberta",{headers:{Authorization:`Bearer ${c}`}}),t=e.ok?await e.json():{session:null},n=document.getElementById("card-continuar"),o=document.getElementById("card-personalizar");t.session?(n.style.display="",o.classList.remove("sm:col-span-2"),document.getElementById("card-continuar-sub").textContent=`${t.respondidas_count}/${t.total} respondidas — retome de onde parou.`,n.onclick=d=>{d.preventDefault(),C(t.session.id)}):(n.style.display="none",o.classList.add("sm:col-span-2"));const a=await fetch("/api/stats",{headers:{Authorization:`Bearer ${c}`}});if(a.ok){const{overall:d}=await a.json(),s=d?.respondidas||0,p=d?.acertos||0,r=s?Math.round(p/s*100):0;document.getElementById("db-respondidas").textContent=String(s),document.getElementById("db-pct").textContent=r+"%",document.getElementById("db-erros").textContent=String(s-p)}}document.getElementById("card-personalizar").addEventListener("click",()=>m("step-builder"));async function T(){const[e,t]=await Promise.all([fetch("/api/cursos",{headers:{Authorization:`Bearer ${c}`}}),fetch("/api/questoes/meta",{headers:{Authorization:`Bearer ${c}`}})]),n=e.ok?await e.json():[],o=t.ok?await t.json():{disciplinas:[],bancas:[]};document.getElementById("b-curso").innerHTML='<option value="">Todos os cursos</option>'+n.map(s=>`<option value="${s.id}">${s.titulo}</option>`).join(""),document.getElementById("b-disciplina").innerHTML='<option value="">Todas</option>'+o.disciplinas.map(s=>`<option value="${s}">${s}</option>`).join(""),document.getElementById("b-banca").innerHTML='<option value="">Banca: Todas</option>'+o.bancas.map(s=>`<option value="${s}">${s}</option>`).join("");const a=new Date().getFullYear();let d='<option value="">Ano: Todos</option>';for(let s=a;s>=a-9;s--)d+=`<option value="${s}">${s}</option>`;document.getElementById("b-ano").innerHTML=d}document.getElementById("btn-builder-back").addEventListener("click",()=>m("step-dashboard"));document.getElementById("b-curso").addEventListener("change",async e=>{const t=e.target.value,n=document.getElementById("b-assunto-wrap"),o=document.getElementById("b-assunto-list");if(!t){n.classList.add("opacity-40","pointer-events-none"),o.innerHTML="";return}n.classList.remove("opacity-40","pointer-events-none"),o.innerHTML='<p class="text-xs text-dark/30 p-2">Carregando…</p>';const a=await fetch(`/api/cursos/${t}`,{headers:{Authorization:`Bearer ${c}`}});if(!a.ok){o.innerHTML="";return}const s=(await a.json()).modulos||[];o.innerHTML=s.length?s.map(p=>`
    <div class="text-[10px] font-bold uppercase tracking-wide text-dark/35 px-2 pt-2 pb-1">${p.titulo}</div>
    ${(p.aulas||[]).map(r=>`
      <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-dark/5 cursor-pointer text-sm text-dark/70">
        <input type="checkbox" value="${r.id}" class="accent-dark" />
        ${r.titulo}
      </label>`).join("")}
  `).join(""):'<p class="text-xs text-dark/30 p-2">Nenhuma aula neste curso.</p>'});document.querySelectorAll("#b-status .disc-chip").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll("#b-status .disc-chip").forEach(t=>t.classList.remove("active")),e.classList.add("active"),L=e.dataset.status||"todas"})});document.querySelectorAll("#b-quantidade .qty-chip").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll("#b-quantidade .qty-chip").forEach(t=>t.classList.remove("active")),e.classList.add("active"),S=parseInt(e.dataset.qtd||"10",10)})});document.getElementById("btn-encontrar").addEventListener("click",async()=>{const e=document.getElementById("builder-error");e.classList.add("hidden");const t=document.getElementById("btn-encontrar");t.disabled=!0,t.textContent="Buscando…";const n=Array.from(document.querySelectorAll("#b-assunto-list input:checked")).map(d=>parseInt(d.value,10)),o={curso_id:document.getElementById("b-curso").value||void 0,aula_ids:n.length?n:void 0,disciplina:document.getElementById("b-disciplina").value||void 0,banca:document.getElementById("b-banca").value||void 0,dificuldade:document.getElementById("b-dificuldade").value||void 0,ano:document.getElementById("b-ano").value||void 0,origem:document.getElementById("b-origem").value||void 0,status_filtro:L,quantidade:S},a=await fetch("/api/sessoes",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${c}`},body:JSON.stringify(o)});if(t.disabled=!1,t.textContent="Encontrar questões",!a.ok){e.textContent="Erro ao buscar questões. Tente novamente.",e.classList.remove("hidden");return}z(await a.json())});function z(e){k=e.session_id,document.getElementById("conf-qtd").textContent=String(e.quantidade_encontrada),document.getElementById("conf-tempo").textContent=String(e.tempo_estimado_min);const t=document.getElementById("conf-warning");e.quantidade_encontrada<e.quantidade_solicitada?(t.textContent=`Encontramos apenas ${e.quantidade_encontrada} de ${e.quantidade_solicitada} questões com esses filtros.`,t.classList.remove("hidden")):t.classList.add("hidden");const n=document.getElementById("conf-distribuicao"),o=Object.entries(e.distribuicao||{});n.innerHTML=o.length?o.map(([a,d])=>`
        <div class="flex items-center justify-between">
          <span>${a}</span>
          <span class="font-semibold text-dark">${d} questão${d!==1?"ões":""}</span>
        </div>`).join(""):'<p class="text-dark/30">—</p>',m("step-confirmacao")}document.getElementById("btn-conf-voltar").addEventListener("click",()=>m("step-builder"));document.getElementById("btn-conf-iniciar").addEventListener("click",()=>{k!=null&&C(k)});async function C(e){const t=await fetch(`/api/sessoes/${e}`,{headers:{Authorization:`Bearer ${c}`}});if(!t.ok){m("step-dashboard");return}const n=await t.json();b=n.session,f=n.questions,w=n.respostas||{};const o=f.findIndex(a=>!w[a.id]);u=o===-1?0:o,m("step-resolucao"),g()}async function A(){const e=await fetch("/api/progress/favorites",{headers:{Authorization:`Bearer ${c}`}});e.ok&&(y=new Set(await e.json()))}async function $(e,t){const n=t?e.a.find(s=>s.l===t):null,o=e.e.length>300?e.e.slice(0,300)+"…":e.e,a=t?`Resposta: ${t}${n?" — "+n.t:""}`:"Resposta registrada";(await fetch("/api/flashcards/auto",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${c}`},body:JSON.stringify({frente:o,verso:a,source_id:e.id})})).ok&&x.add(e.id)}function M(){const e=document.getElementById("q-counter"),t=document.getElementById("q-progress"),n=document.getElementById("btn-prev"),o=document.getElementById("btn-next");if(!f.length){e.textContent="0 / 0",t.style.width="0%";return}e.textContent=`${u+1} / ${f.length}`,t.style.width=`${(u+1)/f.length*100}%`,n.disabled=u===0,o.textContent=u===f.length-1?"Finalizar sessão →":"Próxima →"}function g(){const e=document.getElementById("question-area");if(M(),I=performance.now(),B="",!f.length){e.innerHTML=`
      <div class="q-card">
        <div class="empty-state">
          <div class="empty-icon">
            <svg class="w-7 h-7 text-dark/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="font-semibold text-dark mb-1">Nenhuma questão nesta sessão</p>
          <p class="text-sm text-dark/50">Volte e ajuste os filtros.</p>
        </div>
      </div>`;return}const t=f[u],n=w[t.id],o=y.has(t.id),a=[t.ano?`Ano: <strong>${t.ano}</strong>`:"",t.banca?`Banca: <strong>${t.banca}</strong>`:""].filter(Boolean).join('<span class="mx-2 opacity-30">·</span>'),d=t.a.map(i=>{let l="";if(n){const E=i.l===n.chosen;n.correct_answer&&i.l===n.correct_answer?l="alt-correct alt-disabled":E?l="alt-wrong alt-disabled":l="alt-disabled"}return`
      <button class="alt-opt ${l}" data-alt="${i.l}" ${n?"disabled":""}>
        <span class="alt-letter">${i.l}</span>
        <span class="alt-text">${i.t}</span>
      </button>`}).join("");let s="";n&&(!n.has_gabarito&&n.has_gabarito!==void 0?s=`<div class="mt-3 text-sm text-dark/50 bg-dark/5 rounded-lg px-4 py-2.5">
        Gabarito ainda não disponível. Resposta registrada.</div>`:n.correct===1?s=`<div class="mt-3 text-sm font-semibold bg-green text-dark rounded-lg px-4 py-2.5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        Correto!</div>`:s=`<div class="mt-3 text-sm font-semibold bg-red-100 text-red-700 rounded-lg px-4 py-2.5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        Incorreto${n.correct_answer?` — Resposta: <strong>${n.correct_answer}</strong>`:""}</div>`);const p=n?"":`
    <div class="confidence-row" id="confidence-row">
      <button class="confidence-btn" data-conf="chutei">Chutei</button>
      <button class="confidence-btn" data-conf="duvida">Tenho dúvida</button>
      <button class="confidence-btn" data-conf="certeza">Tenho certeza</button>
    </div>`;e.innerHTML=`
    <div class="q-card">
      <div class="q-header">
        <span class="q-num">${u+1}</span>
        <span class="q-id">${t.id}</span>
        <span class="q-breadcrumb"><strong>${t.disc}</strong></span>
      </div>
      ${a?`<div class="q-meta"><span>${a}</span></div>`:""}
      <div class="q-body">
        <p class="q-enunciado" id="enunciado" style="font-size:${v}px">${t.e}</p>
      </div>
      <div id="alts" class="px-4 pb-3 flex flex-col gap-2">${d}</div>
      ${p}
      ${n?"":`
        <div class="px-4 pb-4 pt-3">
          <button id="btn-responder" class="btn-primary text-sm px-5 py-2.5" disabled>Responder</button>
        </div>`}
      <div class="px-4 pb-4">${s}</div>
      <div class="q-footer">
        <button id="btn-fav" class="${o?"fav-on":""}">
          <svg class="w-3.5 h-3.5" fill="${o?"currentColor":"none"}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          ${o?"Favoritado":"Favoritar"}
        </button>
        ${n?`
          <button id="btn-flashcard" class="${x.has(t.id)?"fav-on":""}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
            ${x.has(t.id)?"Flashcard criado":"Criar flashcard"}
          </button>`:""}
        <button id="btn-report">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
          </svg>
          Reportar erro
        </button>
      </div>
    </div>`;let r=n?n.chosen:"";document.querySelectorAll("#alts .alt-opt").forEach(i=>{i.addEventListener("click",()=>{if(i.disabled)return;document.querySelectorAll("#alts .alt-opt").forEach(E=>E.classList.remove("selected")),i.classList.add("selected"),r=i.dataset.alt||"";const l=document.getElementById("btn-responder");l&&(l.disabled=!1),document.getElementById("confidence-row")?.classList.add("show")})}),document.querySelectorAll(".confidence-btn").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".confidence-btn").forEach(l=>l.classList.remove("selected")),i.classList.add("selected"),B=i.dataset.conf||""})}),document.getElementById("btn-responder")?.addEventListener("click",async()=>{if(!r)return;const i=document.getElementById("btn-responder");i.disabled=!0,i.textContent="Enviando…";const l=Math.round((performance.now()-I)/1e3),h=await(await fetch("/api/progress/answer",{method:"POST",headers:{Authorization:`Bearer ${c}`,"Content-Type":"application/json"},body:JSON.stringify({question_id:t.id,chosen:r,session_id:b?.id,confidence:B||null,time_spent_s:l})})).json();w[t.id]={chosen:r,correct:h.correct,correct_answer:h.correct_answer,has_gabarito:h.has_gabarito,confidence:B},h.correct===0&&h.correct_answer&&await $(t,h.correct_answer),g()}),document.getElementById("btn-fav")?.addEventListener("click",async()=>{const i=y.has(t.id);await fetch(`/api/progress/favorites/${t.id}`,{method:i?"DELETE":"POST",headers:{Authorization:`Bearer ${c}`}}),i?y.delete(t.id):y.add(t.id),g()}),document.getElementById("btn-flashcard")?.addEventListener("click",async()=>{x.has(t.id)||(await $(t,n.correct_answer),g())})}document.getElementById("btn-fa-up")?.addEventListener("click",()=>{v<20&&(v++,localStorage.setItem("gab_fontsize",String(v)));const e=document.getElementById("enunciado");e&&(e.style.fontSize=v+"px")});document.getElementById("btn-fa-down")?.addEventListener("click",()=>{v>12&&(v--,localStorage.setItem("gab_fontsize",String(v)));const e=document.getElementById("enunciado");e&&(e.style.fontSize=v+"px")});document.getElementById("btn-next")?.addEventListener("click",async()=>{u<f.length-1?(u++,g()):await H()});document.getElementById("btn-prev")?.addEventListener("click",()=>{u>0&&(u--,g())});async function H(){if(!b)return;const e=await fetch(`/api/sessoes/${b.id}/finalizar`,{method:"POST",headers:{Authorization:`Bearer ${c}`}});e.ok&&(O(await e.json()),window.refreshSidebarStats?.())}function O(e){document.getElementById("rel-respondidas").textContent=String(e.respondidas),document.getElementById("rel-pct").textContent=e.aproveitamento+"%",document.getElementById("rel-acertos").textContent=String(e.acertos),document.getElementById("rel-erros").textContent=String(e.erros);const t=document.getElementById("rel-desempenho"),n=e.porAssunto||{},o=Object.keys(n).length?n:e.porDisciplina||{},a=Object.entries(o);t.innerHTML=a.length?a.map(([s,p])=>{const r=Math.round(p.acertos/p.total*100),i=r>=70?"#b9ff66":r>=40?"#facc15":"#ef4444";return`
      <div class="disc-row">
        <div>
          <div class="text-sm font-medium text-dark">${s}</div>
          <div class="disc-bar-wrap"><div class="disc-bar-fill" style="width:${r}%;background:${i}"></div></div>
        </div>
        <span class="text-sm font-semibold text-dark/70 tabular-nums">${r}%</span>
      </div>`}).join(""):'<p class="text-sm text-dark/30">Sem dados suficientes.</p>';const d=document.getElementById("rel-recomendacao");e.recomendacoes?.length?(document.getElementById("rel-recomendacao-text").innerHTML=e.recomendacoes.join("<br>"),d.classList.remove("hidden")):d.classList.add("hidden"),m("step-relatorio")}document.getElementById("btn-rel-inicio").addEventListener("click",()=>{b=null,m("step-dashboard"),q()});document.getElementById("btn-rel-nova").addEventListener("click",()=>{b=null,m("step-builder")});m("step-dashboard");q();T();A();
