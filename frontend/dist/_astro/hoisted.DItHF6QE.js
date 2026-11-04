import"./MainLayout.astro_astro_type_script_index_0_lang.B_H427wd.js";const y=localStorage.getItem("gab_token");let w=[],r=[],i=0,u={},f=new Set,g="",b="all",c=parseInt(localStorage.getItem("gab_fontsize")||"15");async function k(){const[s,e,t]=await Promise.all([fetch("/questions.json"),fetch("/api/progress/answered",{headers:{Authorization:`Bearer ${y}`}}),fetch("/api/progress/favorites",{headers:{Authorization:`Bearer ${y}`}})]);w=await s.json();const n=await e.json(),l=await t.json();for(const a of n)u[a.question_id]=a;for(const a of l)f.add(a);E(),x()}function E(){const s=["Todas",...new Set(w.map(t=>t.disc)).values()].sort((t,n)=>t==="Todas"?-1:n==="Todas"?1:t.localeCompare(n)),e=document.getElementById("disc-chips");e.innerHTML="";for(const t of s){const n=document.createElement("button");n.className="disc-chip"+(t==="Todas"?" active":""),n.textContent=t,n.dataset.disc=t==="Todas"?"":t,n.addEventListener("click",()=>{g=n.dataset.disc||"",e.querySelectorAll(".disc-chip").forEach(l=>l.classList.remove("active")),n.classList.add("active"),i=0,x()}),e.appendChild(n)}}function x(){r=w.filter(e=>{if(g&&e.disc!==g)return!1;const t=u[e.id];return!(b==="unanswered"&&t||b==="correct"&&(!t||t.correct!==1)||b==="wrong"&&(!t||t.correct===1))}),w.filter(e=>!g||e.disc===g).length;const s=r.filter(e=>u[e.id]).length;document.getElementById("q-total-label").textContent=`${r.length} questão(ões) · ${s} respondidas`,$(),m()}function $(){const s=document.getElementById("q-counter"),e=document.getElementById("q-progress");if(r.filter(a=>u[a.id]).length,!r.length){s.textContent="0 / 0",e.style.width="0%";return}s.textContent=`${i+1} / ${r.length}`,e.style.width=`${(i+1)/r.length*100}%`;const t=document.getElementById("q-stats-inline"),n=r.slice(0,i+1).filter(a=>u[a.id]?.correct===1).length,l=r.slice(0,i+1).filter(a=>u[a.id]).length;l>0&&(t.textContent=`${n}/${l} corretas (${Math.round(n/l*100)}%)`,t.classList.remove("hidden"))}function m(){const s=document.getElementById("question-area");if($(),!r.length){s.innerHTML=`
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
      </div>`;return}const e=r[i],t=u[e.id],n=f.has(e.id),l=[e.ano?`Ano: <strong>${e.ano}</strong>`:"",e.banca?`Banca: <strong>${e.banca}</strong>`:"",e.cargo?`Cargo: <strong>${e.cargo}</strong>`:""].filter(Boolean).join('<span class="mx-2 opacity-30">·</span>'),a=e.a.map(o=>{let d="";if(t){const p=o.l===t.chosen;t.correct_answer&&o.l===t.correct_answer?d="alt-correct alt-disabled":p?d="alt-wrong alt-disabled":d="alt-disabled"}return`
      <button class="alt-opt ${d}" data-alt="${o.l}" ${t?"disabled":""}>
        <span class="alt-letter">${o.l}</span>
        <span class="alt-text">${o.t}</span>
      </button>`}).join("");let v="";t&&(!t.has_gabarito&&t.has_gabarito!==void 0?v=`<div class="mt-3 text-sm text-dark/50 bg-dark/5 rounded-lg px-4 py-2.5">
        Gabarito ainda não disponível. Resposta registrada.</div>`:t.correct===1?v=`<div class="mt-3 text-sm font-semibold bg-green text-dark rounded-lg px-4 py-2.5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        Correto!</div>`:v=`<div class="mt-3 text-sm font-semibold bg-red-100 text-red-700 rounded-lg px-4 py-2.5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        Incorreto${t.correct_answer?` — Resposta: <strong>${t.correct_answer}</strong>`:""}</div>`),s.innerHTML=`
    <div class="q-card">
      <div class="q-header">
        <span class="q-num">${i+1}</span>
        <span class="q-id">${e.id}</span>
        <span class="q-breadcrumb"><strong>${e.disc}</strong>${e.subj?` › ${e.subj}`:""}</span>
      </div>
      ${l?`<div class="q-meta"><span>${l}</span></div>`:""}
      <div class="q-body">
        <p class="q-enunciado" id="enunciado" style="font-size:${c}px">${e.e}</p>
      </div>
      <div id="alts" class="px-4 pb-3 flex flex-col gap-2">${a}</div>
      ${t?"":`
        <div class="px-4 pb-4">
          <button id="btn-responder" class="btn-primary text-sm px-5 py-2.5" disabled>Responder</button>
        </div>`}
      <div class="px-4 pb-4">${v}</div>
      <div class="q-footer">
        <button id="btn-fav" class="${n?"fav-on":""}">
          <svg class="w-3.5 h-3.5" fill="${n?"currentColor":"none"}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          ${n?"Favoritado":"Favoritar"}
        </button>
        <button id="btn-report">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
          </svg>
          Reportar erro
        </button>
      </div>
    </div>`;let h="";document.querySelectorAll("#alts .alt-opt").forEach(o=>{o.addEventListener("click",()=>{if(o.disabled)return;document.querySelectorAll("#alts .alt-opt").forEach(p=>p.classList.remove("selected")),o.classList.add("selected"),h=o.dataset.alt||"";const d=document.getElementById("btn-responder");d&&(d.disabled=!1)})}),document.getElementById("btn-responder")?.addEventListener("click",async()=>{if(!h)return;const o=document.getElementById("btn-responder");o.disabled=!0,o.textContent="Enviando…";const p=await(await fetch("/api/progress/answer",{method:"POST",headers:{Authorization:`Bearer ${y}`,"Content-Type":"application/json"},body:JSON.stringify({question_id:e.id,chosen:h})})).json();u[e.id]={chosen:h,correct:p.correct,correct_answer:p.correct_answer,has_gabarito:p.has_gabarito},m()}),document.getElementById("btn-fav")?.addEventListener("click",async()=>{const o=f.has(e.id);await fetch(`/api/progress/favorites/${e.id}`,{method:o?"DELETE":"POST",headers:{Authorization:`Bearer ${y}`}}),o?f.delete(e.id):f.add(e.id),m()})}document.getElementById("btn-fa-up")?.addEventListener("click",()=>{c<20&&(c++,localStorage.setItem("gab_fontsize",String(c)));const s=document.getElementById("enunciado");s&&(s.style.fontSize=c+"px")});document.getElementById("btn-fa-down")?.addEventListener("click",()=>{c>12&&(c--,localStorage.setItem("gab_fontsize",String(c)));const s=document.getElementById("enunciado");s&&(s.style.fontSize=c+"px")});document.querySelectorAll(".status-tab").forEach(s=>{s.addEventListener("click",()=>{b=s.dataset.status||"all",document.querySelectorAll(".status-tab").forEach(e=>e.classList.remove("active")),s.classList.add("active"),i=0,x()})});document.getElementById("btn-next")?.addEventListener("click",()=>{i<r.length-1&&(i++,m())});document.getElementById("btn-prev")?.addEventListener("click",()=>{i>0&&(i--,m())});k();
