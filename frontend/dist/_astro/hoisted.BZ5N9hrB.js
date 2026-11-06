import"./hoisted.BdX8jcj7.js";const B=localStorage.getItem("gab_token");let m=[],h=[],l="erros",r=[],n=0,d="";async function k(){const t=await fetch("/api/progress/errors",{headers:{Authorization:`Bearer ${B}`}}),s=t.ok?await t.json():{erros:[],chutei_acertos:[]};m=s.erros,h=s.chutei_acertos;const a=document.getElementById("err-badge"),e=document.getElementById("err-count");m.length>0&&(a.classList.remove("hidden"),a.classList.add("flex"),e.textContent=String(m.length)),document.getElementById("tab-chutei").textContent=`Acertei no chute (${h.length})`,b(),p()}function y(){return l==="erros"?m:h}function b(){const t=y(),s=[...new Set(t.map(o=>o.disc).filter(Boolean))].sort(),a=document.getElementById("disc-chips");a.innerHTML="";const e=document.createElement("button");e.className="disc-chip active",e.textContent=`Todas (${t.length})`,e.dataset.disc="",e.addEventListener("click",()=>f("",e)),a.appendChild(e);for(const o of s){const g=t.filter(c=>c.disc===o).length,i=document.createElement("button");i.className="disc-chip",i.textContent=`${o} (${g})`,i.dataset.disc=o,i.addEventListener("click",()=>f(o,i)),a.appendChild(i)}}function f(t,s){d=t,document.querySelectorAll("#disc-chips .disc-chip").forEach(a=>a.classList.remove("active")),s.classList.add("active"),n=0,p()}function p(){r=y().filter(s=>!d||s.disc===d);const t=l==="erros"?"erro":"lacuna";document.getElementById("err-label").textContent=`${r.length} ${t}${r.length!==1?"s":""} para revisar`,x()}function x(){const t=document.getElementById("question-area"),s=document.getElementById("q-counter"),a=document.getElementById("q-progress");if(!r.length){s.textContent="0 / 0",a.style.width="0%",document.getElementById("btn-prev").disabled=!0,document.getElementById("btn-next").disabled=!0;const c=l==="erros"?{title:"Nenhum erro encontrado!",sub:"Continue assim — seu aproveitamento está ótimo."}:{title:"Nenhuma lacuna encontrada!",sub:"Você não tem acertos no chute pendentes de revisão."};t.innerHTML=`
      <div class="q-card">
        <div class="empty-state">
          <div class="empty-icon">
            <svg class="w-7 h-7 text-green" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="font-semibold text-dark mb-1">${c.title}</p>
          <p class="text-sm text-dark/50">${c.sub}</p>
        </div>
      </div>`;return}document.getElementById("btn-prev").disabled=n===0,document.getElementById("btn-next").disabled=n>=r.length-1,s.textContent=`${n+1} / ${r.length}`,a.style.width=`${(n+1)/r.length*100}%`;const e=r[n],o=[e.ano?`Ano: <strong>${e.ano}</strong>`:"",e.banca?`Banca: <strong>${e.banca}</strong>`:""].filter(Boolean).join('<span class="mx-2 opacity-30">·</span>'),g=e.a.map(c=>{const $=c.l===e.chosen,E=e.correct_answer&&c.l===e.correct_answer;let u="",v="";return E?(u="alt-correct",v='<span class="alt-label text-green-700">✓ Correta</span>'):$?(u="alt-wrong",v='<span class="alt-label text-red-500">✗ Sua resposta</span>'):u="alt-neutral",`
      <div class="alt-opt ${u}">
        <span class="alt-letter">${c.l}</span>
        <span class="alt-text">${c.t}</span>
        ${v}
      </div>`}).join(""),i=l==="chutei"?`<div class="mt-3 flex items-center gap-2 text-sm font-semibold bg-amber-100 text-amber-700 rounded-lg px-4 py-2.5">
         <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h3A2.25 2.25 0 0115.75 5.25V9m-7.5 0a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 008.25 21h7.5a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0015.75 9m-7.5 0h7.5"/></svg>
         Você acertou, mas chutou — vale revisar o porquê.
       </div>`:e.correct_answer?`<div class="mt-3 flex items-center gap-2 text-sm font-semibold bg-green text-dark rounded-lg px-4 py-2.5">
         <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
         Resposta correta: ${e.correct_answer}
       </div>`:`<div class="mt-3 text-sm text-dark/50 bg-dark/5 rounded-lg px-4 py-2.5">
         Gabarito ainda não disponível para esta questão.</div>`;t.innerHTML=`
    <div class="q-card">
      <div class="q-header">
        <span class="q-num">${n+1}</span>
        <span class="q-id">${e.question_id}</span>
        <span class="q-breadcrumb"><strong>${e.disc||"—"}</strong>${e.assunto?` › ${e.assunto}`:""}</span>
        <span class="ml-auto text-xs ${l==="chutei"?"bg-amber-100 text-amber-700":"bg-red-100 text-red-600"} px-2.5 py-0.5 rounded-full font-medium">
          Respondeu: ${e.chosen||"—"}
        </span>
      </div>
      ${o?`<div class="q-meta"><span>${o}</span></div>`:""}
      <div class="q-body">
        <p class="q-enunciado">${e.e}</p>
      </div>
      <div class="px-4 pb-3 flex flex-col gap-2">${g}</div>
      <div class="px-4 pb-4">${i}</div>
    </div>`}document.getElementById("tab-erros").addEventListener("click",()=>{l="erros",document.getElementById("tab-erros").classList.add("active"),document.getElementById("tab-chutei").classList.remove("active"),d="",n=0,b(),p()});document.getElementById("tab-chutei").addEventListener("click",()=>{l="chutei",document.getElementById("tab-chutei").classList.add("active"),document.getElementById("tab-erros").classList.remove("active"),d="",n=0,b(),p()});document.getElementById("btn-next")?.addEventListener("click",()=>{n<r.length-1&&(n++,x())});document.getElementById("btn-prev")?.addEventListener("click",()=>{n>0&&(n--,x())});k();
