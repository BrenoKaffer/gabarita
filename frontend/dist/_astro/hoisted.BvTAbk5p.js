import"./MainLayout.astro_astro_type_script_index_0_lang.DL73JIFh.js";const u=localStorage.getItem("gab_token"),m=JSON.parse(localStorage.getItem("gab_user")||"{}");if(m.name){const r=m.name.split(" ")[0],e=m.name.split(" ").map(l=>l[0]).join("").slice(0,2).toUpperCase();document.getElementById("user-name").textContent=r;const t=document.getElementById("user-avatar-big");t.textContent=e;const a=new Date().getHours(),o=document.getElementById("welcome-sub");a<12?o.textContent="Bom dia! Hora de revisar.":a<18?o.textContent="Boa tarde! Continue firme.":o.textContent="Boa noite! Uma questão antes de dormir?"}async function h(){const r=await fetch("/api/stats",{headers:{Authorization:`Bearer ${u}`}});if(!r.ok)return;const{byDisc:e,overall:t,simulados:a}=await r.json(),o=t.respondidas?Math.round(t.acertos/t.respondidas*100):0;document.getElementById("stat-respondidas").textContent=t.respondidas||0,document.getElementById("stat-acertos").textContent=t.acertos||0,document.getElementById("stat-erros").textContent=(t.respondidas||0)-(t.acertos||0),document.getElementById("stat-pct").textContent=o+"%";const l=document.getElementById("disc-bars");if(!e.length)l.innerHTML=`
        <div class="flex flex-col items-center py-6 text-center gap-2">
          <svg class="w-8 h-8 text-dark/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="text-sm text-dark/40">Nenhuma questão respondida ainda.</p>
          <a href="/study" class="text-xs font-medium text-dark underline underline-offset-2">Começar revisão →</a>
        </div>`;else{l.innerHTML="";for(const{disc:s,total:n,acertos:c}of e){const d=n?Math.round(c/n*100):0,f=d>=70?"#b9ff66":d>=50?"#fde68a":"#fca5a5";l.insertAdjacentHTML("beforeend",`
          <div class="disc-row">
            <span class="text-xs font-medium text-dark truncate">${s}</span>
            <div class="h-2 rounded-full bg-dark/8 overflow-hidden">
              <div class="h-full rounded-full transition-all" style="width:${d}%;background:${f}"></div>
            </div>
            <span class="text-xs text-right font-semibold" style="color:${d>=70?"#166534":d>=50?"#854d0e":"#991b1b"}">${d}%</span>
          </div>`)}}const i=document.getElementById("simulados-list");if(!a.length)i.innerHTML=`
        <div class="flex flex-col items-center py-6 text-center gap-2">
          <svg class="w-8 h-8 text-dark/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm text-dark/40">Nenhum simulado realizado ainda.</p>
          <a href="/simulado" class="text-xs font-medium text-dark underline underline-offset-2">Fazer simulado →</a>
        </div>`;else{i.innerHTML="";for(const s of a.slice(0,5)){const n=s.total?Math.round(s.acertos/s.total*100):0,c=s.duration_s?`${Math.floor(s.duration_s/60)}m`:"—",d=n>=70?"background:#b9ff66;color:#166534":n>=50?"background:#fde68a;color:#854d0e":"background:#fee2e2;color:#991b1b";i.insertAdjacentHTML("beforeend",`
          <div class="flex items-center justify-between py-2.5 border-b border-dark/8 last:border-0">
            <div>
              <p class="text-sm font-medium text-dark">${s.disc||"Misto"}</p>
              <p class="text-xs text-dark/40">${new Date(s.created_at).toLocaleDateString("pt-BR")} · ${c}</p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" style="${d}">${n}%</span>
          </div>`)}}}async function x(){const r=await fetch("/api/plano/hoje",{headers:{Authorization:`Bearer ${u}`}});if(!r.ok)return;const e=await r.json();document.getElementById("hoje-bar").classList.remove("hidden");const t=(o,l,i,s,n)=>{document.getElementById(o).textContent=String(s),document.getElementById(l).textContent=String(n);const c=Math.min(100,n>0?Math.round(s/n*100):0);document.getElementById(i).style.width=c+"%"};if(t("hq-val","hq-meta","hq-bar",e.questoesHoje,e.metas.questoes),t("hf-val","hf-meta","hf-bar",e.flashcardsHoje,e.metas.flashcards),t("hm-val","hm-meta","hm-bar",e.minutosHoje,e.metas.minutos),e.streak.atual>0){const o=document.getElementById("streak-home");o.classList.remove("hidden"),o.classList.add("inline-flex"),document.getElementById("streak-home-n").textContent=String(e.streak.atual)}const a=[e.questoesHoje>=e.metas.questoes,e.flashcardsHoje>=e.metas.flashcards,e.minutosHoje>=e.metas.minutos].filter(Boolean).length;document.getElementById("hoje-status").textContent=a===3?"🎉 Todas as metas concluídas!":`${a}/3 metas`}h();x();
