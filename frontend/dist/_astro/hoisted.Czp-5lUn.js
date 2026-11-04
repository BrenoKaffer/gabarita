import"./MainLayout.astro_astro_type_script_index_0_lang.Cr6jjJfi.js";const p=localStorage.getItem("gab_token");async function x(){const l=await fetch("/api/stats",{headers:{Authorization:`Bearer ${p}`}});if(!l.ok)return;const{byDisc:i,overall:o,simulados:c}=await l.json(),u=o.respondidas?Math.round(o.acertos/o.respondidas*100):0;document.getElementById("st-respondidas").textContent=o.respondidas||0,document.getElementById("st-acertos").textContent=o.acertos||0,document.getElementById("st-erros").textContent=(o.respondidas||0)-(o.acertos||0),document.getElementById("st-pct").textContent=u+"%";const r=document.getElementById("disc-table");if(!i.length)r.innerHTML=`
      <div class="flex flex-col items-center py-8 text-center gap-2">
        <svg class="w-8 h-8 text-dark/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-sm text-dark/40">Nenhuma questão respondida.</p>
      </div>`;else{r.innerHTML="";for(const{disc:t,total:s,acertos:n}of i){const e=s?Math.round(n/s*100):0,a=e>=70?"#b9ff66":e>=50?"#fde68a":"#fca5a5",f=e>=70?"#166534":e>=50?"#854d0e":"#991b1b",m=e>=70?"Ótimo":e>=50?"Regular":"Reforçar";r.insertAdjacentHTML("beforeend",`
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-sm font-medium text-dark">${t}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-dark/50">${n}/${s}</span>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:${a};color:${f}">${m} · ${e}%</span>
            </div>
          </div>
          <div class="h-2 rounded-full bg-dark/8 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" style="width:${e}%;background:${a}"></div>
          </div>
        </div>`)}}const d=document.getElementById("sim-table");if(!c.length)d.innerHTML=`
      <div class="flex flex-col items-center py-8 text-center gap-2">
        <svg class="w-8 h-8 text-dark/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-dark/40">Nenhum simulado realizado.</p>
        <a href="/simulado" class="text-xs font-medium text-dark underline underline-offset-2">Fazer primeiro simulado →</a>
      </div>`;else{d.innerHTML="";for(const t of c){const s=t.total?Math.round(t.acertos/t.total*100):0,n=t.duration_s?`${Math.floor(t.duration_s/60)}m${(t.duration_s%60).toString().padStart(2,"0")}s`:"—",e=s>=70?"#b9ff66":s>=50?"#fde68a":"#fee2e2",a=s>=70?"#166534":s>=50?"#854d0e":"#991b1b";d.insertAdjacentHTML("beforeend",`
        <div class="flex items-center justify-between py-2.5 border-b border-dark/8 last:border-0 gap-3">
          <div class="min-w-0">
            <p class="text-sm font-medium text-dark truncate">${t.disc||"Misto"}</p>
            <p class="text-xs text-dark/40">${new Date(t.created_at).toLocaleDateString("pt-BR")} · ${n} · ${t.total}q</p>
          </div>
          <span class="sim-badge shrink-0" style="background:${e};color:${a}">${t.acertos}/${t.total} — ${s}%</span>
        </div>`)}}}x();
