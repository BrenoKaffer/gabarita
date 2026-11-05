import"./hoisted.CXLMr9xT.js";const d=localStorage.getItem("gab_token"),i=new URLSearchParams(location.search).get("id");i||(location.href="/flashcards");let a=null;function h(e){return!e||e===0?"#d1d5db":e>=75?"#10b981":e>=50?"#f59e0b":"#ef4444"}function g(e){if(!e)return"Novo";const n=new Date().toISOString().slice(0,10);if(e<=n)return"Hoje";const r=new Date(e+"T12:00:00"),t=new Date;return t.setHours(12,0,0,0),`em ${Math.round((r.getTime()-t.getTime())/864e5)}d`}async function l(){const e=await fetch(`/api/flashcards/decks/${i}/cards`,{headers:{Authorization:`Bearer ${d}`}});if(!e.ok){location.href="/flashcards";return}const n=await e.json();a=n.deck,document.title=`${a.titulo} · Gabarita`,new Date().toISOString().slice(0,10);const r=n.cards.filter(t=>t.due).length;document.getElementById("deck-header").innerHTML=`
      <div style="background:${a.cor}" class="px-6 py-5 flex items-center justify-between">
        <div>
          <h1 class="text-white text-xl font-semibold">${a.titulo}</h1>
          ${a.descricao?`<p class="text-white/65 text-sm mt-1">${a.descricao}</p>`:""}
        </div>
        ${r>0?`<a href="/sessao?deck=${a.id}" class="btn-primary text-sm py-2 px-4" style="background:#b9ff66;color:#191a23;border-color:#191a23">Estudar (${r})</a>`:'<span class="text-white/60 text-sm font-medium">✓ Em dia</span>'}
      </div>
      <div class="bg-white px-6 py-2.5 flex items-center gap-4 text-sm text-dark/45">
        <span>${n.cards.length} ${n.cards.length!==1?"cartões":"cartão"}</span>
        <span>·</span>
        <span>${r} para revisar hoje</span>
      </div>`,document.getElementById("card-count").textContent=`${n.cards.length} total`,document.getElementById("cards-list").innerHTML=n.cards.length===0?'<p class="p-4 text-sm text-dark/35 text-center">Nenhum cartão ainda. Adicione abaixo.</p>':n.cards.map(t=>`
          <div class="card-row" id="cr-${t.id}">
            <span class="strength-dot" style="background:${h(t.strength)}"></span>
            <span class="card-frente">${t.frente.length>70?t.frente.slice(0,70)+"…":t.frente}</span>
            <span class="card-verso">${t.verso.length>50?t.verso.slice(0,50)+"…":t.verso}</span>
            <span class="card-next">${g(t.proxima_rev)}</span>
            <button class="del-btn" onclick="delCard(${t.id})" title="Remover">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>`).join("")}document.getElementById("btn-add-card").addEventListener("click",async()=>{const e=document.getElementById("inp-frente").value.trim(),n=document.getElementById("inp-verso").value.trim();if(!e||!n)return;const r=document.getElementById("btn-add-card");r.textContent="Adicionando…",r.disabled=!0;const t=await fetch(`/api/flashcards/decks/${i}/cards`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({frente:e,verso:n})});r.textContent="Adicionar cartão",r.disabled=!1,t.ok&&(document.getElementById("inp-frente").value="",document.getElementById("inp-verso").value="",l())});async function v(e){confirm("Remover cartão?")&&(await fetch(`/api/flashcards/cards/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${d}`}}),document.getElementById(`cr-${e}`)?.remove())}const o=document.getElementById("import-zone"),s=document.getElementById("import-input");document.getElementById("import-btn").addEventListener("click",e=>{e.stopPropagation(),s.click()});o.addEventListener("click",()=>s.click());o.addEventListener("dragover",e=>{e.preventDefault(),o.style.borderColor="#191a23"});o.addEventListener("dragleave",()=>o.style.borderColor="");o.addEventListener("drop",e=>{e.preventDefault(),o.style.borderColor="",e.dataTransfer?.files[0]&&f(e.dataTransfer.files[0])});s.addEventListener("change",()=>{s.files?.[0]&&f(s.files[0])});function f(e){const n=new FileReader;n.onload=async r=>{try{const t=JSON.parse(r.target?.result),m=Array.isArray(t)?t:t.cards??[],p=await fetch(`/api/flashcards/decks/${i}/import`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({cards:m})});if(p.ok){const{imported:c}=await p.json(),u=document.getElementById("import-result");u.textContent=`✓ ${c} ${c!==1?"cartões":"cartão"} importado${c!==1?"s":""}`,u.classList.remove("hidden"),l()}}catch{alert("JSON inválido")}},n.readAsText(e)}window.delCard=v;l();
