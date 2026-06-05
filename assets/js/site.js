import { siteConfig, collections, isFirebaseConfigured } from './config.js';
import { getList } from './firebase-service.js';
import { demoQuickLinks, demoSpecialties, demoNews } from './demo-data.js';

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatDate(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('ru-RU');
}

export function formatSize(bytes = 0) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size = size / 1024;
    unit += 1;
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export function renderShell(active = '') {
  const topbar = document.querySelector('[data-topbar]');
  const header = document.querySelector('[data-header]');
  const footer = document.querySelector('[data-footer]');
  if (topbar) topbar.innerHTML = getTopbar();
  if (header) header.innerHTML = getHeader(active);
  if (footer) footer.innerHTML = getFooter();
  bindNav();
}

function getTopbar() {
  return `
    <div class="container topbar-inner">
      <div class="topbar-list">
        <span><i class="fa-solid fa-location-dot"></i> ${siteConfig.addressRu}</span>
        <a href="tel:${siteConfig.phone}"><i class="fa-solid fa-phone"></i> ${siteConfig.phone}</a>
        <a href="mailto:${siteConfig.email}"><i class="fa-solid fa-envelope"></i> ${siteConfig.email}</a>
      </div>
      <div class="topbar-list">
        <a href="${siteConfig.instagram}" target="_blank" rel="noopener">Instagram</a>
        <a href="admin.html">Admin</a>
        <div class="langs"><button class="lang-btn active">RU</button><button class="lang-btn">KZ</button><button class="lang-btn">EN</button></div>
      </div>
    </div>`;
}

function navItem(label, href, key, active) {
  return `<a class="nav-link ${active === key ? 'active' : ''}" href="${href}">${label}</a>`;
}

function getHeader(active) {
  return `
    <div class="container navbar">
      <a class="brand" href="index.html">
        <img src="assets/img/logo.svg" alt="Логотип">
        <span><strong>${siteConfig.nameRu}</strong><span>${siteConfig.nameKz}</span></span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Меню"><i class="fa-solid fa-bars"></i></button>
      <ul class="nav-menu">
        <li>${navItem('Главная', 'index.html', 'home', active)}</li>
        <li>
          <a class="nav-link ${active === 'about' ? 'active' : ''}" href="about.html">О колледже <i class="fa-solid fa-chevron-down"></i></a>
          <div class="dropdown">
            <a href="about.html">История и миссия</a>
            <a href="specialties.html">Специальности</a>
            <a href="contacts.html">Контакты</a>
          </div>
        </li>
        <li>${navItem('Абитуриентам', 'admission.html', 'admission', active)}</li>
        <li>
          <a class="nav-link ${active === 'students' || active === 'schedule' ? 'active' : ''}" href="students.html">Студентам <i class="fa-solid fa-chevron-down"></i></a>
          <div class="dropdown">
            <a href="students.html">Информация студентам</a>
            <a href="schedule.html">Расписание</a>
            <a href="documents.html">Бланки и документы</a>
          </div>
        </li>
        <li>${navItem('Документы', 'documents.html', 'documents', active)}</li>
        <li>${navItem('Новости', 'news.html', 'news', active)}</li>
        <li>${navItem('Контакты', 'contacts.html', 'contacts', active)}</li>
      </ul>
    </div>`;
}

function getFooter() {
  return `
    <div class="container footer-grid">
      <div>
        <h3>${siteConfig.nameRu}</h3>
        <p>${siteConfig.addressRu}</p>
        <p>${siteConfig.accreditation}</p>
      </div>
      <div><h4>Разделы</h4><a href="about.html">О колледже</a><a href="admission.html">Абитуриентам</a><a href="students.html">Студентам</a><a href="documents.html">Документы</a></div>
      <div><h4>Быстрый доступ</h4><a href="schedule.html">Расписание</a><a href="specialties.html">Специальности</a><a href="news.html">Новости</a><a href="admin.html">Админ-панель</a></div>
      <div><h4>Контакты</h4><a href="tel:${siteConfig.phone}">${siteConfig.phone}</a><a href="mailto:${siteConfig.email}">${siteConfig.email}</a><a href="${siteConfig.instagram}" target="_blank" rel="noopener">Instagram</a></div>
    </div>
    <div class="container footer-bottom">© 2026 ${siteConfig.nameKz}. Все права защищены.</div>`;
}

function bindNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) toggle.addEventListener('click', () => menu.classList.toggle('open'));
}

export function downloadButton(file) {
  if (!file || !file.url) return '';
  const meta = file.size ? ` · ${formatSize(file.size)}` : '';
  return `<a class="download-btn" href="${file.url}" target="_blank" rel="noopener" download><i class="fa-solid fa-file-arrow-down"></i> Скачать файл: ${escapeHtml(file.name || 'документ')}${meta}</a>`;
}

export async function renderHome() {
  renderShell('home');
  const configNotice = document.querySelector('[data-config-notice]');
  if (configNotice && !isFirebaseConfigured()) configNotice.innerHTML = '<div class="notice">Firebase пока не настроен. Сайт показывает демо-данные.</div>';

  const quickLinks = await getList(collections.quickLinks, demoQuickLinks);
  const specialties = await getList(collections.specialties, demoSpecialties);
  const news = await getList(collections.news, demoNews);

  renderQuickLinks(quickLinks);
  renderStats();
  renderSpecialties(specialties.slice(0, 6));
  renderLatestNews(news.filter(n => n.status !== 'draft').slice(0, 3));
}

function renderStats() {
  const el = document.querySelector('[data-stats]');
  if (!el) return;
  el.innerHTML = [
    [siteConfig.founded, 'год основания'],
    [siteConfig.students, 'студентов'],
    [siteConfig.specialties, 'специальностей'],
    [siteConfig.clinicalBases, 'клинические базы'],
    [siteConfig.accreditation, 'аккредитация']
  ].map(([num, label]) => `<div class="stat-card"><strong>${num}</strong><span>${label}</span></div>`).join('');
}

function renderQuickLinks(items) {
  const el = document.querySelector('[data-quick-links]');
  if (!el) return;
  el.innerHTML = items.sort((a, b) => (a.order || 99) - (b.order || 99)).map(item => `
    <a class="quick-card" href="${item.link || '#'}">
      <div class="card-icon"><i class="fa-solid ${item.icon || 'fa-link'}"></i></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <span class="link-more">Перейти <i class="fa-solid fa-arrow-right"></i></span>
    </a>`).join('');
}

function renderSpecialties(items) {
  const el = document.querySelector('[data-specialties]');
  if (!el) return;
  el.innerHTML = items.map(item => `
    <div class="info-card">
      <div class="card-icon"><i class="fa-solid ${item.icon || 'fa-stethoscope'}"></i></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <span class="link-more">${escapeHtml(item.duration || '')}</span>
    </div>`).join('');
}

function renderLatestNews(items) {
  const el = document.querySelector('[data-latest-news]');
  if (!el) return;
  if (!items.length) { el.innerHTML = '<div class="empty-state">Новости пока не добавлены.</div>'; return; }
  el.innerHTML = items.map(item => `
    <article class="news-card">
      <div class="news-image" style="background:linear-gradient(135deg,#dbeafe,#f8fafc)"></div>
      <div class="news-body">
        <div class="news-date">${formatDate(item.createdAt)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.content || '').slice(0, 150)}</p>
        ${downloadButton(item.file)}
        <a class="link-more" href="news.html">Все новости <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>`).join('');
}
