import"./MainLayout.astro_astro_type_script_index_0_lang.Cr6jjJfi.js";const y=localStorage.getItem("gab_token");let l={},c=[],i=[],a=0,g="";async function q(){const[r,n]=await Promise.all([fetch("/questions.json"),fetch("/api/progress/errors",{headers:{Authorization:`Bearer ${y}`}})]),s=await r.json();c=await n.json();for(const o of s)l[o.id]=o;const e=document.getElementById("err-badge"),t=document.getElementById("err-count");c.length>0&&(e.classList.remove("hidden"),e.classList.add("flex"),t.textContent=String(c.length)),E(),f()}function E(){const r=[...new Set(c.map(e=>l[e.question_id]?.disc).filter(Boolean))].sort(),n=document.getElementById("disc-chips");n.innerHTML="";const s=document.createElement("button");s.className="disc-chip active",s.textContent=`Todas (${c.length})`,s.dataset.disc="",s.addEventListener("click",()=>b("",s)),n.appendChild(s);for(const e of r){const t=c.filter(p=>l[p.question_id]?.disc===e).length,o=document.createElement("button");o.className="disc-chip",o.textContent=`${e} (${t})`,o.dataset.disc=e,o.addEventListener("click",()=>b(e,o)),n.appendChild(o)}}function b(r,n){g=r,document.querySelectorAll("#disc-chips .disc-chip").forEach(s=>s.classList.remove("active")),n.classList.add("active"),a=0,f()}function f(){i=c.filter(r=>{const n=l[r.question_id];return!(!n||g&&n.disc!==g)}),document.getElementById("err-label").textContent=`${i.length} erro${i.length!==1?"s":""} para revisar`,v()}function v(){const r=document.getElementById("question-area"),n=document.getElementById("q-counter"),s=document.getElementById("q-progress");if(document.getElementById("btn-prev").setAttribute("disabled",i.length===0||a===0?"true":""),document.getElementById("btn-next").setAttribute("disabled",a>=i.length-1?"true":""),a===0&&(document.getElementById("btn-prev").disabled=!0),a>=i.length-1&&(document.getElementById("btn-next").disabled=!0),!i.length){n.textContent="0 / 0",s.style.width="0%",r.innerHTML=`
      <div class="q-card">
        <div class="empty-state">
          <div class="empty-icon">
            <svg class="w-7 h-7 text-green" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="font-semibold text-dark mb-1">Nenhum erro encontrado!</p>
          <p class="text-sm text-dark/50">Continue assim — seu aproveitamento está ótimo.</p>
        </div>
      </div>`;return}n.textContent=`${a+1} / ${i.length}`,s.style.width=`${(a+1)/i.length*100}%`;const e=i[a],t=l[e.question_id];if(!t){r.innerHTML='<div class="q-card"><div class="empty-state"><p class="text-dark/40">Questão não encontrada.</p></div></div>';return}const o=[t.ano?`Ano: <strong>${t.ano}</strong>`:"",t.banca?`Banca: <strong>${t.banca}</strong>`:"",t.cargo?`Cargo: <strong>${t.cargo}</strong>`:""].filter(Boolean).join('<span class="mx-2 opacity-30">·</span>'),p=t.a.map(d=>{const x=d.l===e.chosen,$=e.correct_answer&&d.l===e.correct_answer;let u="",m="";return $?(u="alt-correct",m='<span class="alt-label text-green-700">✓ Correta</span>'):x?(u="alt-wrong",m='<span class="alt-label text-red-500">✗ Sua resposta</span>'):u="alt-neutral",`
      <div class="alt-opt ${u}">
        <span class="alt-letter">${d.l}</span>
        <span class="alt-text">${d.t}</span>
        ${m}
      </div>`}).join(""),h=e.correct_answer?`<div class="mt-3 flex items-center gap-2 text-sm font-semibold bg-green text-dark rounded-lg px-4 py-2.5">
         <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
         Resposta correta: ${e.correct_answer}
       </div>`:`<div class="mt-3 text-sm text-dark/50 bg-dark/5 rounded-lg px-4 py-2.5">
         Gabarito ainda não disponível para esta questão.</div>`;r.innerHTML=`
    <div class="q-card">
      <div class="q-header">
        <span class="q-num">${a+1}</span>
        <span class="q-id">${t.id}</span>
        <span class="q-breadcrumb"><strong>${t.disc}</strong>${t.subj?` › ${t.subj}`:""}</span>
        <span class="ml-auto text-xs bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full font-medium">
          Respondeu: ${e.chosen||"—"}
        </span>
      </div>
      ${o?`<div class="q-meta"><span>${o}</span></div>`:""}
      <div class="q-body">
        <p class="q-enunciado">${t.e}</p>
      </div>
      <div class="px-4 pb-3 flex flex-col gap-2">${p}</div>
      <div class="px-4 pb-4">${h}</div>
    </div>`}document.getElementById("btn-next")?.addEventListener("click",()=>{a<i.length-1&&(a++,v())});document.getElementById("btn-prev")?.addEventListener("click",()=>{a>0&&(a--,v())});q();
