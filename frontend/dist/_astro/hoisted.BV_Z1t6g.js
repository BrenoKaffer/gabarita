import"./MainLayout.astro_astro_type_script_index_0_lang.CZGAGoQd.js";const g=localStorage.getItem("gab_token");g||(location.href="/login");const d=document.getElementById("drop-zone"),c=document.getElementById("file-input"),v=document.getElementById("dz-btn"),h=document.getElementById("results");let l=[];v.addEventListener("click",()=>c.click());d.addEventListener("click",t=>{t.target!==v&&c.click()});d.addEventListener("dragover",t=>{t.preventDefault(),d.classList.add("drag-over")});d.addEventListener("dragleave",()=>d.classList.remove("drag-over"));d.addEventListener("drop",t=>{t.preventDefault(),d.classList.remove("drag-over");const s=t.dataTransfer?.files[0];s&&f(s)});c.addEventListener("change",()=>{c.files?.[0]&&f(c.files[0])});function f(t){const s=new FileReader;s.onload=n=>{try{const m=JSON.parse(n.target?.result);x(m,t.name)}catch{alert("Arquivo JSON inválido. Verifique a sintaxe.")}},s.readAsText(t)}function x(t,s){const n=Array.isArray(t)?t:t.questoes??[],m=t.disciplina||"",o=[],r=[],u=new Set;for(let a=0;a<n.length;a++){const e=n[a],i=[];if((!e.id||typeof e.id!="string"||!e.id.trim())&&i.push("id ausente ou inválido"),(!e.enunciado||!e.enunciado.trim())&&i.push("enunciado vazio"),!e.alternativas||typeof e.alternativas!="object")i.push("alternativas ausentes");else{const p=Object.keys(e.alternativas);p.length<2&&i.push("mínimo 2 alternativas"),p.includes(e.gabarito)||i.push(`gabarito "${e.gabarito}" não corresponde a nenhuma alternativa`)}if(e.gabarito||i.push("gabarito ausente"),i.length){o.push({idx:a+1,id:e.id,msg:i.join(" · ")});continue}if(u.has(e.id)){o.push({idx:a+1,id:e.id,msg:"ID duplicado neste arquivo"});continue}u.add(e.id),r.push({...e,disciplina:e.disciplina||m||"",dificuldade:e.dificuldade||"medio"})}l=r,y(n.length,r.length,o,s)}function y(t,s,n,m){h.classList.remove("hidden"),document.getElementById("dz-content").innerHTML=`
      <div class="flex items-center justify-center gap-2 text-sm text-dark/55">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="font-medium">${m}</span>
        <button id="dz-change" class="underline text-dark/40 hover:text-dark ml-2 text-xs">trocar</button>
      </div>`,document.getElementById("dz-change")?.addEventListener("click",a=>{a.stopPropagation(),c.click()}),document.getElementById("summary-row").innerHTML=`
      <div class="sum-item"><span class="sum-num">${t}</span><span class="text-dark/50">no arquivo</span></div>
      <div class="w-px h-8 bg-dark/10"></div>
      <div class="sum-item text-green-700"><span class="sum-num text-green-700">${s}</span><span class="text-dark/50">válidas</span></div>
      ${n.length?`<div class="w-px h-8 bg-dark/10"></div><div class="sum-item text-red-500"><span class="sum-num text-red-500">${n.length}</span><span class="text-dark/50">com erro</span></div>`:""}`;const o=document.getElementById("errors-section");n.length?(o.classList.remove("hidden"),document.getElementById("errors-list").innerHTML=n.map(a=>`<div class="err-item">
          <span class="shrink-0 font-semibold">#${a.idx}</span>
          ${a.id?`<code>${a.id}</code>`:""}
          <span>${a.msg}</span>
        </div>`).join("")):o.classList.add("hidden");const r=document.getElementById("preview-section");if(s>0){r.classList.remove("hidden");const a=l.slice(0,20);document.getElementById("preview-count").textContent=l.length>20?`Mostrando 20 de ${s}`:`${s} questões`,document.getElementById("preview-body").innerHTML=a.map(e=>{const i={facil:"Fácil",medio:"Médio",dificil:"Difícil"};return`<tr>
          <td class="font-mono text-xs text-dark/60">${e.id}</td>
          <td>${e.disciplina||'<span class="text-dark/30">—</span>'}</td>
          <td>${e.banca||'<span class="text-dark/30">—</span>'}</td>
          <td>${i[e.dificuldade]||e.dificuldade||"—"}</td>
          <td class="max-w-xs" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px">${e.enunciado.slice(0,90)}${e.enunciado.length>90?"…":""}</td>
          <td class="font-bold uppercase text-center">${e.gabarito}</td>
          <td><span class="badge-ok">✓ OK</span></td>
        </tr>`}).join("")}else r.classList.add("hidden");const u=document.getElementById("action-row");s>0?(u.classList.remove("hidden"),document.getElementById("btn-confirm-label").textContent=`Importar ${s} questão${s!==1?"ões":""}`):u.classList.add("hidden")}document.getElementById("btn-confirm").addEventListener("click",async()=>{if(!l.length)return;const t=document.getElementById("import-progress");t.classList.add("show"),document.getElementById("prog-label").textContent=`Enviando ${l.length} questões…`;const s=await fetch("/api/questoes/import",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`},body:JSON.stringify({questoes:l})});if(t.classList.remove("show"),s.ok){const{imported:n}=await s.json();h.innerHTML=`
        <div class="flex flex-col items-center py-16 text-center">
          <div class="w-16 h-16 bg-green rounded-2xl flex items-center justify-center mb-4 border-2 border-dark shadow-[0_4px_0_#191a23]">
            <svg class="w-8 h-8" fill="none" stroke="#191a23" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-1">${n} questão${n!==1?"ões":""} importada${n!==1?"s":""}!</h2>
          <p class="text-dark/45 text-sm mb-6">Agora disponíveis na revisão e simulado.</p>
          <div class="flex gap-3">
            <a href="/study" class="btn-primary">Ir para Revisão</a>
            <button onclick="location.reload()" class="btn-secondary">Importar mais</button>
          </div>
        </div>`}else alert("Erro ao importar. Tente novamente.")});document.getElementById("btn-reset").addEventListener("click",()=>location.reload());
