import { collections } from './config.js';
import { getList } from './firebase-service.js';
import { demoPages } from './demo-data.js';
import { renderShell, escapeHtml, downloadButton } from './site.js';

const pageMeta = {
  about: { active: 'about', title: 'О колледже', subtitle: 'История, миссия, структура и основные сведения о колледже.' },
  admission: { active: 'admission', title: 'Абитуриентам', subtitle: 'Правила приема, документы, специальности, гранты и приемная комиссия.' },
  students: { active: 'students', title: 'Студентам', subtitle: 'Расписание, практика, учебные материалы, заявления и бланки.' },
  schedule: { active: 'schedule', title: 'Расписание', subtitle: 'Актуальные файлы расписания занятий, звонков и учебного процесса.' },
  contacts: { active: 'contacts', title: 'Контакты', subtitle: 'Адрес, телефон, email и информация для связи с колледжем.' }
};

export async function renderPage(pageKey) {
  const meta = pageMeta[pageKey] || pageMeta.about;
  renderShell(meta.active);
  const title = document.querySelector('[data-page-title]');
  const subtitle = document.querySelector('[data-page-subtitle]');
  if (title) title.textContent = meta.title;
  if (subtitle) subtitle.textContent = meta.subtitle;

  const blocks = await getList(`${collections.pages}/${pageKey}`, demoPages[pageKey] || []);
  const container = document.querySelector('[data-page-content]');
  if (!container) return;
  if (!blocks.length) {
    container.innerHTML = '<div class="empty-state">Материалы пока не добавлены.</div>';
    return;
  }
  container.innerHTML = blocks.map(block => `
    <article class="content-block">
      <h2>${escapeHtml(block.title || '')}</h2>
      <p>${escapeHtml(block.text || '').replaceAll('\n', '<br>')}</p>
      ${block.imageUrl ? `<img src="${block.imageUrl}" alt="${escapeHtml(block.title || '')}">` : ''}
      ${downloadButton(block.file)}
    </article>
  `).join('');
}

export function renderContactsExtra() {
  const el = document.querySelector('[data-contact-extra]');
  if (!el) return;
  el.innerHTML = `
    <div class="contact-grid">
      <div class="contact-card">
        <h2>Связаться с нами</h2>
        <p><strong>Адрес:</strong> г. Кызылорда, ул. Ы. Жахаева 18</p>
        <p><strong>Телефон:</strong> <a href="tel:+77242230513">+7 7242 23-05-13</a></p>
        <p><strong>Email:</strong> <a href="mailto:kzmediccollege@mail.kz">kzmediccollege@mail.kz</a></p>
        <a class="btn btn-primary" href="mailto:kzmediccollege@mail.kz">Написать письмо</a>
      </div>
      <div class="map-box">
        <div>
          <h3>Карта</h3>
          <p>Здесь можно вставить iframe Google Maps или 2GIS.</p>
        </div>
      </div>
    </div>`;
}
