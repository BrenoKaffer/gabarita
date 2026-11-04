import"./MainLayout.astro_astro_type_script_index_0_lang.B_H427wd.js";const f=localStorage.getItem("gab_token"),u=JSON.parse(localStorage.getItem("gab_user")||"{}");if(u.name){const d=u.name.split(" ")[0],i=u.name.split(" ").map(r=>r[0]).join("").slice(0,2).toUpperCase();document.getElementById("user-name").textContent=d;const e=document.getElementById("user-avatar-big");e.textContent=i;const n=new Date().getHours(),a=document.getElementById("welcome-sub");n<12?a.textContent="Bom dia! Hora de revisar.":n<18?a.textContent="Boa tarde! Continue firme.":a.textContent="Boa noite! Uma questão antes de dormir?"}async function p(){const d=await fetch("/api/stats",{headers:{Authorization:`Bearer ${f}`}});if(!d.ok)return;const{byDisc:i,overall:e,simulados:n}=await d.json(),a=e.respondidas?Math.round(e.acertos/e.respondidas*100):0;document.getElementById("stat-respondidas").textContent=e.respondidas||0,document.getElementById("stat-acertos").textContent=e.acertos||0,document.getElementById("stat-erros").textContent=(e.respondidas||0)-(e.acertos||0),document.getElementById("stat-pct").textContent=a+"%";const r=document.getElementById("disc-bars");if(!i.length)r.innerHTML=`
        <div class="flex flex-col items-center py-6 text-center gap-2">
          <svg class="w-8 h-8 text-dark/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="text-sm text-dark/40">Nenhuma questão respondida ainda.</p>
          <a href="/study" class="text-xs font-medium text-dark underline underline-offset-2">Começar revisão →</a>
        </div>`;else{r.innerHTML="";for(const{disc:t,total:o,acertos:c}of i){const s=o?Math.round(c/o*100):0,m=s>=70?"#b9ff66":s>=50?"#fde68a":"#fca5a5";r.insertAdjacentHTML("beforeend",`
          <div class="disc-row">
            <span class="text-xs font-medium text-dark truncate">${t}</span>
            <div class="h-2 rounded-full bg-dark/8 overflow-hidden">
              <div class="h-full rounded-full transition-all" style="width:${s}%;background:${m}"></div>
            </div>
            <span class="text-xs text-right font-semibold" style="color:${s>=70?"#166534":s>=50?"#854d0e":"#991b1b"}">${s}%</span>
          </div>`)}}const l=document.getElementById("simulados-list");if(!n.length)l.innerHTML=`
        <div class="flex flex-col items-center py-6 text-center gap-2">
          <svg class="w-8 h-8 text-dark/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm text-dark/40">Nenhum simulado realizado ainda.</p>
          <a href="/simulado" class="text-xs font-medium text-dark underline underline-offset-2">Fazer simulado →</a>
        </div>`;else{l.innerHTML="";for(const t of n.slice(0,5)){const o=t.total?Math.round(t.acertos/t.total*100):0,c=t.duration_s?`${Math.floor(t.duration_s/60)}m`:"—",s=o>=70?"background:#b9ff66;color:#166534":o>=50?"background:#fde68a;color:#854d0e":"background:#fee2e2;color:#991b1b";l.insertAdjacentHTML("beforeend",`
          <div class="flex items-center justify-between py-2.5 border-b border-dark/8 last:border-0">
            <div>
              <p class="text-sm font-medium text-dark">${t.disc||"Misto"}</p>
              <p class="text-xs text-dark/40">${new Date(t.created_at).toLocaleDateString("pt-BR")} · ${c}</p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" style="${s}">${o}%</span>
          </div>`)}}}p();
