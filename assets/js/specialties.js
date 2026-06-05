import { collections } from './config.js';
import { getList } from './firebase-service.js';
import { demoSpecialties } from './demo-data.js';
import { renderShell, escapeHtml } from './site.js';

export async function renderSpecialtiesPage() {
  renderShell('about');
  const container = document.querySelector('[data-specialties]');
  if (!container) return;
  const items = await getList(collections.specialties, demoSpecialties);
  container.innerHTML = items.map(item => `
    <div class="info-card">
      <div class="card-icon"><i class="fa-solid ${item.icon || 'fa-stethoscope'}"></i></div>
      <h3>${escapeHtml(item.title || '')}</h3>
      <p>${escapeHtml(item.description || '')}</p>
      <span class="link-more">${escapeHtml(item.duration || '')}</span>
    </div>
  `).join('');
}
