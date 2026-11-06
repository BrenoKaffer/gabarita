import"./hoisted.BdX8jcj7.js";const o=localStorage.getItem("gab_token");async function i(){const t=await fetch("/api/dominio",{headers:{Authorization:`Bearer ${o}`}}),a=t.ok?await t.json():[];n(a)}function n(t){const a=document.getElementById("dominio-list");if(!t.length){a.innerHTML=`
      <div class="q-card">
        <div class="empty-state">
          <div class="empty-icon">
            <svg class="w-7 h-7 text-dark/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>
            </svg>
          </div>
          <p class="font-semibold text-dark mb-1">Ainda sem dados suficientes</p>
          <p class="text-sm text-dark/50">Responda pelo menos 2 questões de um assunto pra ver seu domínio aqui.</p>
        </div>
      </div>`;return}a.innerHTML='<div class="q-card">'+t.map((s,e)=>{const d=s.pct>=70?"#b9ff66":s.pct>=40?"#facc15":"#ef4444";return`
      <div class="disc-row" style="padding:16px 20px;${e>0?"border-top:1px solid rgba(25,26,35,0.07);":""}">
        <div>
          <div class="text-sm font-medium text-dark">${s.chave}</div>
          <div class="text-xs text-dark/40 mt-0.5">${s.total} respondida${s.total!==1?"s":""}</div>
          <div class="disc-bar-wrap"><div class="disc-bar-fill" style="width:${s.pct}%;background:${d}"></div></div>
        </div>
        <span class="text-base font-semibold text-dark/70 tabular-nums">${s.pct}%</span>
      </div>`}).join("")+"</div>"}i();
