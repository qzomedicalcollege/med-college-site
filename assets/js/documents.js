import { collections } from './config.js';
import { getList } from './firebase-service.js';
import { demoDocuments } from './demo-data.js';
import { renderShell, escapeHtml, downloadButton, formatDate, formatSize } from './site.js';

export async function renderDocuments() {
  renderShell('documents');
  const docs = await getList(collections.documents, demoDocuments);
  const search = document.querySelector('[data-doc-search]');
  const category = document.querySelector('[data-doc-category]');
  const list = document.querySelector('[data-documents]');
  if (!list) return;

  const categories = ['Все категории', ...new Set(docs.map(d => d.category).filter(Boolean))];
  if (category) category.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

  function draw() {
    const q = (search?.value || '').toLowerCase();
    const cat = category?.value || 'Все категории';
    const filtered = docs.filter(doc => {
      const matchesQ = !q || [doc.title, doc.description, doc.category].join(' ').toLowerCase().includes(q);
      const matchesCat = cat === 'Все категории' || doc.category === cat;
      return matchesQ && matchesCat;
    }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state">Документы не найдены.</div>';
      return;
    }

    list.innerHTML = filtered.map(doc => `
      <article class="doc-card">
        <div class="card-icon"><i class="fa-solid fa-file-lines"></i></div>
        <div class="doc-meta">${escapeHtml(doc.category || 'Документ')} · ${formatDate(doc.createdAt)}</div>
        <h3>${escapeHtml(doc.title || '')}</h3>
        <p>${escapeHtml(doc.description || '')}</p>
        ${doc.file?.size ? `<p class="item-meta">Размер: ${formatSize(doc.file.size)}</p>` : ''}
        ${doc.file?.url ? downloadButton(doc.file) : '<span class="file-link"><i class="fa-solid fa-circle-info"></i> Файл еще не загружен</span>'}
      </article>`).join('');
  }

  search?.addEventListener('input', draw);
  category?.addEventListener('change', draw);
  draw();
}
