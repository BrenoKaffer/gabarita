import"./hoisted.CXLMr9xT.js";const g=localStorage.getItem("gab_token");let y=[],r=[],i=0,p={},h=new Set,v="",w="all",u=parseInt(localStorage.getItem("gab_fontsize")||"15");async function I(){const[s,e,t,o]=await Promise.all([fetch("/questions.json"),fetch("/api/questoes",{headers:{Authorization:`Bearer ${g}`}}),fetch("/api/progress/answered",{headers:{Authorization:`Bearer ${g}`}}),fetch("/api/progress/favorites",{headers:{Authorization:`Bearer ${g}`}})]),c=await s.json(),l=e.ok?await e.json():[],f=new Set(c.map(n=>n.id));y=[...l.filter(n=>!f.has(n.id)),...c];const a=await t.json(),d=await o.json();for(const n of a)p[n.question_id]=n;for(const n of d)h.add(n);S(),x()}function S(){const s=["Todas",...new Set(y.map(t=>t.disc)).values()].sort((t,o)=>t==="Todas"?-1:o==="Todas"?1:t.localeCompare(o)),e=document.getElementById("disc-chips");e.innerHTML="";for(const t of s){const o=document.createElement("button");o.className="disc-chip"+(t==="Todas"?" active":""),o.textContent=t,o.dataset.disc=t==="Todas"?"":t,o.addEventListener("click",()=>{v=o.dataset.disc||"",e.querySelectorAll(".disc-chip").forEach(c=>c.classList.remove("active")),o.classList.add("active"),i=0,x()}),e.appendChild(o)}}function x(){r=y.filter(e=>{if(v&&e.disc!==v)return!1;const t=p[e.id];return!(w==="unanswered"&&t||w==="correct"&&(!t||t.correct!==1)||w==="wrong"&&(!t||t.correct===1))}),y.filter(e=>!v||e.disc===v).length;const s=r.filter(e=>p[e.id]).length;document.getElementById("q-total-label").textContent=`${r.length} questão(ões) · ${s} respondidas`,k(),b()}function k(){const s=document.getElementById("q-counter"),e=document.getElementById("q-progress");if(r.filter(l=>p[l.id]).length,!r.length){s.textContent="0 / 0",e.style.width="0%";return}s.textContent=`${i+1} / ${r.length}`,e.style.width=`${(i+1)/r.length*100}%`;const t=document.getElementById("q-stats-inline"),o=r.slice(0,i+1).filter(l=>p[l.id]?.correct===1).length,c=r.slice(0,i+1).filter(l=>p[l.id]).length;c>0&&(t.textContent=`${o}/${c} corretas (${Math.round(o/c*100)}%)`,t.classList.remove("hidden"))}function b(){const s=document.getElementById("question-area");if(k(),!r.length){s.innerHTML=`
      <div class="q-card">
        <div class="empty-state">
          <div class="empty-icon">
            <svg class="w-7 h-7 text-dark/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="font-semibold text-dark mb-1">Nenhuma questão encontrada</p>
          <p class="text-sm text-dark/50">Tente outro filtro ou disciplina.</p>
        </div>
      </div>`;return}const e=r[i],t=p[e.id],o=h.has(e.id),c=[e.ano?`Ano: <strong>${e.ano}</strong>`:"",e.banca?`Banca: <strong>${e.banca}</strong>`:"",e.cargo?`Cargo: <strong>${e.cargo}</strong>`:""].filter(Boolean).join('<span class="mx-2 opacity-30">·</span>'),l=e.a.map(a=>{let d="";if(t){const n=a.l===t.chosen;t.correct_answer&&a.l===t.correct_answer?d="alt-correct alt-disabled":n?d="alt-wrong alt-disabled":d="alt-disabled"}return`
      <button class="alt-opt ${d}" data-alt="${a.l}" ${t?"disabled":""}>
        <span class="alt-letter">${a.l}</span>
        <span class="alt-text">${a.t}</span>
      </button>`}).join("");let f="";t&&(!t.has_gabarito&&t.has_gabarito!==void 0?f=`<div class="mt-3 text-sm text-dark/50 bg-dark/5 rounded-lg px-4 py-2.5">
        Gabarito ainda não disponível. Resposta registrada.</div>`:t.correct===1?f=`<div class="mt-3 text-sm font-semibold bg-green text-dark rounded-lg px-4 py-2.5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        Correto!</div>`:f=`<div class="mt-3 text-sm font-semibold bg-red-100 text-red-700 rounded-lg px-4 py-2.5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        Incorreto${t.correct_answer?` — Resposta: <strong>${t.correct_answer}</strong>`:""}</div>`),s.innerHTML=`
    <div class="q-card">
      <div class="q-header">
        <span class="q-num">${i+1}</span>
        <span class="q-id">${e.id}</span>
        <span class="q-breadcrumb"><strong>${e.disc}</strong>${e.subj?` › ${e.subj}`:""}</span>
      </div>
      ${c?`<div class="q-meta"><span>${c}</span></div>`:""}
      <div class="q-body">
        <p class="q-enunciado" id="enunciado" style="font-size:${u}px">${e.e}</p>
      </div>
      <div id="alts" class="px-4 pb-3 flex flex-col gap-2">${l}</div>
      ${t?"":`
        <div class="px-4 pb-4">
          <button id="btn-responder" class="btn-primary text-sm px-5 py-2.5" disabled>Responder</button>
        </div>`}
      <div class="px-4 pb-4">${f}</div>
      <div class="q-footer">
        <button id="btn-fav" class="${o?"fav-on":""}">
          <svg class="w-3.5 h-3.5" fill="${o?"currentColor":"none"}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          ${o?"Favoritado":"Favoritar"}
        </button>
        <button id="btn-report">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
          </svg>
          Reportar erro
        </button>
      </div>
    </div>`;let m="";document.querySelectorAll("#alts .alt-opt").forEach(a=>{a.addEventListener("click",()=>{if(a.disabled)return;document.querySelectorAll("#alts .alt-opt").forEach(n=>n.classList.remove("selected")),a.classList.add("selected"),m=a.dataset.alt||"";const d=document.getElementById("btn-responder");d&&(d.disabled=!1)})}),document.getElementById("btn-responder")?.addEventListener("click",async()=>{if(!m)return;const a=document.getElementById("btn-responder");a.disabled=!0,a.textContent="Enviando…";const n=await(await fetch("/api/progress/answer",{method:"POST",headers:{Authorization:`Bearer ${g}`,"Content-Type":"application/json"},body:JSON.stringify({question_id:e.id,chosen:m})})).json();if(p[e.id]={chosen:m,correct:n.correct,correct_answer:n.correct_answer,has_gabarito:n.has_gabarito},b(),n.correct===0&&n.correct_answer){const $=e.a.find(q=>q.l===n.correct_answer),E=e.e.length>300?e.e.slice(0,300)+"…":e.e,B=`Resposta: ${n.correct_answer}${$?" — "+$.t:""}`;fetch("/api/flashcards/auto",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`},body:JSON.stringify({frente:E,verso:B,source_id:e.id})})}}),document.getElementById("btn-fav")?.addEventListener("click",async()=>{const a=h.has(e.id);await fetch(`/api/progress/favorites/${e.id}`,{method:a?"DELETE":"POST",headers:{Authorization:`Bearer ${g}`}}),a?h.delete(e.id):h.add(e.id),b()})}document.getElementById("btn-fa-up")?.addEventListener("click",()=>{u<20&&(u++,localStorage.setItem("gab_fontsize",String(u)));const s=document.getElementById("enunciado");s&&(s.style.fontSize=u+"px")});document.getElementById("btn-fa-down")?.addEventListener("click",()=>{u>12&&(u--,localStorage.setItem("gab_fontsize",String(u)));const s=document.getElementById("enunciado");s&&(s.style.fontSize=u+"px")});document.querySelectorAll(".status-tab").forEach(s=>{s.addEventListener("click",()=>{w=s.dataset.status||"all",document.querySelectorAll(".status-tab").forEach(e=>e.classList.remove("active")),s.classList.add("active"),i=0,x()})});document.getElementById("btn-next")?.addEventListener("click",()=>{i<r.length-1&&(i++,b())});document.getElementById("btn-prev")?.addEventListener("click",()=>{i>0&&(i--,b())});I();
