import"./MainLayout.astro_astro_type_script_index_0_lang.CZGAGoQd.js";const i=localStorage.getItem("gab_token");i||(location.href="/login");async function v(){const n=await fetch("/api/flashcards/decks",{headers:{Authorization:`Bearer ${i}`}});if(!n.ok)return;const t=await n.json(),s=t.reduce((e,o)=>e+o.due,0),c=document.getElementById("due-label"),l=document.getElementById("btn-estudar"),m=document.getElementById("btn-estudar-label");s>0?(c.textContent=`${s} cartão${s!==1?"ões":""} para revisar hoje`,l.classList.remove("hidden"),m.textContent=`Estudar hoje (${s})`):c.textContent=t.length?"Tudo em dia! 🎉":"Sem decks criados";const u=document.getElementById("grid"),g=document.getElementById("empty-state");if(!t.length){g.style.display="flex";return}u.innerHTML=t.map(e=>{const o=e.avg_strength>=75?"#10b981":e.avg_strength>=50?"#f59e0b":"#ef4444";return`
        <a href="/deck?id=${e.id}" class="deck-card">
          <div class="deck-top" style="background:${e.cor}">
            ${e.auto_deck?"⚡":"🃏"}
          </div>
          <div class="deck-body">
            <div class="deck-title">${e.titulo}</div>
            <div class="deck-desc">${e.descricao||"<em>Sem descrição</em>"}</div>
            <div class="deck-meta flex items-center justify-between">
              <span>${e.total} cartão${e.total!==1?"ões":""}</span>
              ${e.due>0?`<span class="due-badge">${e.due} p/ hoje</span>`:'<span class="text-green-600 font-medium text-xs">✓ Em dia</span>'}
            </div>
            <div class="strength-wrap">
              <div class="strength-fill" style="width:${e.avg_strength}%;background:${o}"></div>
            </div>
            <div class="text-[10px] text-dark/30">Memória: ${e.avg_strength}%</div>
          </div>
        </a>`}).join("")}let r="#6366f1";const d=document.getElementById("overlay"),h=document.getElementById("btn-novo"),y=document.getElementById("btn-cancel"),a=document.getElementById("btn-criar");h.addEventListener("click",()=>d.classList.remove("hidden"));y.addEventListener("click",()=>d.classList.add("hidden"));d.addEventListener("click",n=>{n.target===d&&d.classList.add("hidden")});document.getElementById("color-picker").addEventListener("click",n=>{const t=n.target.closest(".color-dot");t&&(document.querySelectorAll(".color-dot").forEach(s=>s.classList.remove("sel")),t.classList.add("sel"),r=t.dataset.c)});a.addEventListener("click",async()=>{const n=document.getElementById("inp-titulo").value.trim(),t=document.getElementById("inp-desc").value.trim();if(!n){document.getElementById("inp-titulo").focus();return}a.textContent="Criando…",a.disabled=!0;const s=await fetch("/api/flashcards/decks",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({titulo:n,descricao:t,cor:r})});if(a.textContent="Criar",a.disabled=!1,s.ok){const{id:c}=await s.json();location.href=`/deck?id=${c}`}});v();
