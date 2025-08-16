const heads = document.querySelectorAll('.head');
heads.forEach(h => h.addEventListener('click', () => {
  const next = h.nextElementSibling;
  next.style.display = next.style.display === 'block' ? 'none' : 'block';
}));

const backdrop = document.getElementById('backdrop');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

function escapeHTML(s) {
  return String(s||'').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

function loadFiche(url){
  const candidates = [url, './'+url.replace(/^\.?\//,''), '/'+url.replace(/^\.?\//,'')];
  (async () => {
    for (const u of candidates) {
      try {
        console.info('[loadFiche] trying', u);
        const r = await fetch(u, {cache:'no-store'});
        if (!r.ok) throw new Error('HTTP '+r.status);
        const html = await r.text();
        modalBody.innerHTML = html;
        backdrop.style.display = 'flex';
        return;
      } catch (e) {
        console.warn('[loadFiche] failed', u, e);
      }
    }
    modalBody.innerHTML = `<article>
      <h2>${escapeHTML(modalTitle.textContent)}</h2>
      <p><em>(Contenu externe non chargé dans cet environnement. En live, placez la fiche dans /fiches et servez via HTTP.)</em></p>
      <p>Texte d’exemple : vous pouvez coller ici un résumé provisoire pour tester la mise en page.</p>
    </article>`;
    backdrop.style.display = 'flex';
  })();
}
function expandAll() {
  document.querySelectorAll('.children').forEach(el => el.style.display = 'block');
}
function collapseAll() {
  document.querySelectorAll('.children').forEach(el => el.style.display = 'none');
}

const searchResults = document.getElementById('searchResults');
//const searchInput = document.getElementById('searchInput');
const searchInput = document.getElementById('searchInput');

searchInput?.addEventListener('input', () => {
  const keyword = searchInput.value.trim();
  const body = document.querySelector('#modalBody article');
  if (!body) return;

  removeHighlights(body);

  if (keyword.length > 1) {
    highlightText(body, keyword);
  }
});

function highlightText(container, text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  container.innerHTML = container.innerHTML.replace(regex, '<mark>$1</mark>');
}

function removeHighlights(container) {
  container.innerHTML = container.innerHTML.replace(/<mark>(.*?)<\/mark>/gi, '$1');
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  const body = document.querySelector('#modalBody article');
  if (body) removeHighlights(body);
}

/*
************************************
searchInput?.addEventListener('input', () => {
  const keyword = searchInput.value.trim();
  const body = document.querySelector('#modalBody article');
  if (!body) return;

  removeHighlights(body);

  if (keyword.length > 1) {
    highlightText(body, keyword);
  }
});

function highlightText(container, text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  container.innerHTML = container.innerHTML.replace(regex, '<mark>$1</mark>');
}

function removeHighlights(container) {
  container.innerHTML = container.innerHTML.replace(/<mark>(.*?)<\/mark>/gi, '$1');
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  const body = document.querySelector('#modalBody article');
  if (body) removeHighlights(body);
} **********************************
*/

  // Recherche dans les fiches
  /*
  const allLinks = [...document.querySelectorAll('.point-link')];
  const matching = [];

  for (const link of allLinks) {
    const file = link.dataset.file;
    try {
      const res = await fetch(file);
      const html = await res.text();
      const lower = html.toLowerCase();
      if (lower.includes(keyword)) {
        const matchSnippet = html
          .replace(/<[^>]+>/g, '') // retire les balises HTML
          .split(/\s+/)
          .filter(w => w.includes(keyword))
          .slice(0, 30)
          .join(' ');
        matching.push({ label: link.textContent, file, snippet: matchSnippet });
      }
    } catch (e) {
      console.warn("Fiche non trouvée :", file);
    }
  }

  if (matching.length) {
    const html = matching.map(m =>
      `<div style="margin:6px 0;"><strong>${m.label}</strong><br><em>${m.snippet}...</em><br><a class="point-link" data-file="${m.file}" style="color:#0645ad;">🡺 ouvrir la fiche</a></div>`
    ).join('');
    searchResults.innerHTML = `<div style="margin-top:10px;"><strong>${matching.length} fiche(s) contiennent "${keyword}"</strong>:</div>${html}`;

    // rendre les liens actifs
    searchResults.querySelectorAll('.point-link').forEach(el =>
      el.addEventListener('click', () => {
        modalTitle.textContent = el.textContent;
        loadFiche(el.dataset.file);
      }));
  } else {
    searchResults.innerHTML = `<div style="margin-top:10px;">🔍 Aucun résultat dans les fiches pour "<strong>${keyword}</strong>"</div>`;
  }
*/
const links = document.querySelectorAll('.point-link');
links.forEach(l => l.addEventListener('click', () => {
  modalTitle.textContent = l.textContent;
  loadFiche(l.dataset.file);
}));

document.getElementById('btnClose').addEventListener('click', () => {
  backdrop.style.display = 'none';
  clearSearch(); // ← nettoie les <mark> quand on ferme
});

const printArea = document.getElementById('print-area');

document.getElementById('btnPrint').addEventListener('click', () => {
  const now = new Date().toLocaleDateString('fr-CA');
  const title = modalTitle.textContent;
  const html = `${modalBody.innerHTML}<footer class='print-footer'></footer>`; /*© Résumé d'histoire — ${now}*/
  printArea.innerHTML = html;

  printArea.style.display = 'block';
  window.print();
  
  setTimeout(() => {
    printArea.style.display = 'none';
    printArea.innerHTML = '';
  }, 300);
    

});