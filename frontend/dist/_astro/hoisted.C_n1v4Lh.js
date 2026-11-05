import"./MainLayout.astro_astro_type_script_index_0_lang.TUPaop0E.js";const g=localStorage.getItem("gab_token");g||(location.href="/login");const o=document.getElementById("drop-zone"),l=document.getElementById("file-input"),v=document.getElementById("dz-btn"),h=document.getElementById("results");let d=[];v.addEventListener("click",()=>l.click());o.addEventListener("click",t=>{t.target!==v&&l.click()});o.addEventListener("dragover",t=>{t.preventDefault(),o.classList.add("drag-over")});o.addEventListener("dragleave",()=>o.classList.remove("drag-over"));o.addEventListener("drop",t=>{t.preventDefault(),o.classList.remove("drag-over");const s=t.dataTransfer?.files[0];s&&f(s)});l.addEventListener("change",()=>{l.files?.[0]&&f(l.files[0])});function f(t){const s=new FileReader;s.onload=a=>{try{const m=JSON.parse(a.target?.result);x(m,t.name)}catch{alert("Arquivo JSON inválido. Verifique a sintaxe.")}},s.readAsText(t)}function x(t,s){const a=Array.isArray(t)?t:t.questoes??[],m=t.disciplina||"",r=[],c=[],u=new Set;for(let n=0;n<a.length;n++){const e=a[n],i=[];if((!e.id||typeof e.id!="string"||!e.id.trim())&&i.push("id ausente ou inválido"),(!e.enunciado||!e.enunciado.trim())&&i.push("enunciado vazio"),!e.alternativas||typeof e.alternativas!="object")i.push("alternativas ausentes");else{const p=Object.keys(e.alternativas);p.length<2&&i.push("mínimo 2 alternativas"),p.includes(e.gabarito)||i.push(`gabarito "${e.gabarito}" não corresponde a nenhuma alternativa`)}if(e.gabarito||i.push("gabarito ausente"),i.length){r.push({idx:n+1,id:e.id,msg:i.join(" · ")});continue}if(u.has(e.id)){r.push({idx:n+1,id:e.id,msg:"ID duplicado neste arquivo"});continue}u.add(e.id),c.push({...e,disciplina:e.disciplina||m||"",dificuldade:e.dificuldade||"medio"})}d=c,y(a.length,c.length,r,s)}function y(t,s,a,m){h.classList.remove("hidden"),document.getElementById("dz-content").innerHTML=`
      <div class="flex items-center justify-center gap-2 text-sm text-dark/55">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="font-medium">${m}</span>
        <button id="dz-change" class="underline text-dark/40 hover:text-dark ml-2 text-xs">trocar</button>
      </div>`,document.getElementById("dz-change")?.addEventListener("click",n=>{n.stopPropagation(),l.click()}),document.getElementById("summary-row").innerHTML=`
      <div class="sum-item"><span class="sum-num">${t}</span><span class="text-dark/50">no arquivo</span></div>
      <div class="w-px h-8 bg-dark/10"></div>
      <div class="sum-item text-green-700"><span class="sum-num text-green-700">${s}</span><span class="text-dark/50">válidas</span></div>
      ${a.length?`<div class="w-px h-8 bg-dark/10"></div><div class="sum-item text-red-500"><span class="sum-num text-red-500">${a.length}</span><span class="text-dark/50">com erro</span></div>`:""}`;const r=document.getElementById("errors-section");a.length?(r.classList.remove("hidden"),document.getElementById("errors-list").innerHTML=a.map(n=>`<div class="err-item">
          <span class="shrink-0 font-semibold">#${n.idx}</span>
          ${n.id?`<code>${n.id}</code>`:""}
          <span>${n.msg}</span>
        </div>`).join("")):r.classList.add("hidden");const c=document.getElementById("preview-section");if(s>0){c.classList.remove("hidden");const n=d.slice(0,20);document.getElementById("preview-count").textContent=d.length>20?`Mostrando 20 de ${s}`:`${s} questões`,document.getElementById("preview-body").innerHTML=n.map(e=>{const i={facil:"Fácil",medio:"Médio",dificil:"Difícil"};return`<tr>
          <td class="font-mono text-xs text-dark/60">${e.id}</td>
          <td>${e.disciplina||'<span class="text-dark/30">—</span>'}</td>
          <td>${e.banca||'<span class="text-dark/30">—</span>'}</td>
          <td>${i[e.dificuldade]||e.dificuldade||"—"}</td>
          <td class="max-w-xs" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px">${e.enunciado.slice(0,90)}${e.enunciado.length>90?"…":""}</td>
          <td class="font-bold uppercase text-center">${e.gabarito}</td>
          <td><span class="badge-ok">✓ OK</span></td>
        </tr>`}).join("")}else c.classList.add("hidden");const u=document.getElementById("action-row");s>0?(u.classList.remove("hidden"),document.getElementById("btn-confirm-label").textContent=`Importar ${s} ${s!==1?"questões":"questão"}`):u.classList.add("hidden")}document.getElementById("btn-confirm").addEventListener("click",async()=>{if(!d.length)return;const t=document.getElementById("import-progress");t.classList.add("show"),document.getElementById("prog-label").textContent=`Enviando ${d.length} ${d.length!==1?"questões":"questão"}…`;const s=await fetch("/api/questoes/import",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`},body:JSON.stringify({questoes:d})});if(t.classList.remove("show"),s.ok){const{imported:a}=await s.json();h.innerHTML=`
        <div class="flex flex-col items-center py-16 text-center">
          <div class="w-16 h-16 bg-green rounded-2xl flex items-center justify-center mb-4 border-2 border-dark shadow-[0_4px_0_#191a23]">
            <svg class="w-8 h-8" fill="none" stroke="#191a23" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-1">${a} ${a!==1?"questões importadas":"questão importada"}!</h2>
          <p class="text-dark/45 text-sm mb-6">Agora disponíveis na revisão e simulado.</p>
          <div class="flex gap-3">
            <a href="/study" class="btn-primary">Ir para Revisão</a>
            <button onclick="location.reload()" class="btn-secondary">Importar mais</button>
          </div>
        </div>`}else alert("Erro ao importar. Tente novamente.")});document.getElementById("btn-reset").addEventListener("click",()=>location.reload());
