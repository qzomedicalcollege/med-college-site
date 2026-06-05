import { collections } from './config.js';
import { getList } from './firebase-service.js';
import { demoNews } from './demo-data.js';
import { renderShell, escapeHtml, downloadButton, formatDate } from './site.js';

export async function renderNews() {
  renderShell('news');
  const news = await getList(collections.news, demoNews);
  const container = document.querySelector('[data-news-list]');
  const search = document.querySelector('[data-news-search]');
  if (!container) return;

  function draw() {
    const q = (search?.value || '').toLowerCase();
    const filtered = news
      .filter(item => item.status !== 'draft')
      .filter(item => !q || [item.title, item.content].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (!filtered.length) {
      container.innerHTML = '<div class="empty-state">Новости не найдены.</div>';
      return;
    }

    container.innerHTML = filtered.map(item => `
      <article class="news-card">
        ${item.imageUrl ? `<img class="news-image" src="${item.imageUrl}" alt="${escapeHtml(item.title || '')}">` : '<div class="news-image" style="background:linear-gradient(135deg,#dbeafe,#f8fafc)"></div>'}
        <div class="news-body">
          <div class="news-date">${formatDate(item.createdAt)}</div>
          <h3>${escapeHtml(item.title || '')}</h3>
          <p>${escapeHtml(item.content || '').replaceAll('\n', '<br>')}</p>
          ${downloadButton(item.file)}
        </div>
      </article>`).join('');
  }

  search?.addEventListener('input', draw);
  draw();
}
