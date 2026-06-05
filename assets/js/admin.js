import { collections, isFirebaseConfigured } from './config.js';
import { signInAdmin, signOutAdmin, onAuthChange, createItem, getList, uploadFile } from './firebase-service.js';
import { demoNews, demoDocuments, demoQuickLinks, demoSpecialties } from './demo-data.js';
import { escapeHtml, formatDate } from './site.js';

const state = { user: null, active: 'news' };

export async function initAdmin() {
  const notice = document.querySelector('[data-configured-notice]');
  if (notice && !isFirebaseConfigured()) {
    notice.innerHTML = '<div class="notice warning">Firebase пока не настроен. Заполните assets/js/config.js.</div>';
  }
  bindLogin();
  bindTabs();
  bindForms();
  await onAuthChange(async user => {
    state.user = user;
    document.querySelector('[data-login-screen]')?.classList.toggle('hidden', !!user);
    document.querySelector('[data-admin-screen]')?.classList.toggle('hidden', !user);
    const email = document.querySelector('[data-user-email]');
    if (email) email.textContent = user?.email || '';
    if (user) await renderSection(state.active);
  });
}

function bindLogin() {
  const form = document.querySelector('[data-login-form]');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      await signInAdmin(form.email.value.trim(), form.password.value);
      form.reset();
    } catch (err) {
      message('login-message', err.message, 'error');
    }
  });
  document.querySelector('[data-logout]')?.addEventListener('click', () => signOutAdmin());
}

function bindTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', async () => {
      state.active = btn.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(item => item.classList.toggle('active', item === btn));
      await renderSection(state.active);
    });
  });
}

function bindForms() {
  document.querySelector('[data-news-form]')?.addEventListener('submit', submitNews);
  document.querySelector('[data-document-form]')?.addEventListener('submit', submitDocument);
  document.querySelector('[data-page-form]')?.addEventListener('submit', submitPageBlock);
  document.querySelector('[data-quick-form]')?.addEventListener('submit', submitQuickLink);
  document.querySelector('[data-specialty-form]')?.addEventListener('submit', submitSpecialty);
}

async function submitNews(e) {
  e.preventDefault();
  const form = e.target;
  try {
    const image = form.image.files[0] ? await uploadFile(form.image.files[0], 'news-images') : null;
    const file = form.file.files[0] ? await uploadFile(form.file.files[0], 'news-files') : null;
    await createItem(collections.news, {
      title: form.title.value.trim(),
      content: form.content.value.trim(),
      status: form.status.value,
      imageUrl: image?.url || '',
      file
    });
    form.reset();
    message('admin-message', 'Новость сохранена', 'success');
    await renderSection('news');
  } catch (err) { message('admin-message', err.message, 'error'); }
}

async function submitDocument(e) {
  e.preventDefault();
  const form = e.target;
  try {
    const file = form.file.files[0] ? await uploadFile(form.file.files[0], 'documents') : null;
    await createItem(collections.documents, {
      title: form.title.value.trim(),
      category: form.category.value.trim(),
      description: form.description.value.trim(),
      file
    });
    form.reset();
    message('admin-message', 'Документ сохранен', 'success');
    await renderSection('documents');
  } catch (err) { message('admin-message', err.message, 'error'); }
}

async function submitPageBlock(e) {
  e.preventDefault();
  const form = e.target;
  try {
    const page = form.page.value;
    const image = form.image.files[0] ? await uploadFile(form.image.files[0], 'page-images') : null;
    const file = form.file.files[0] ? await uploadFile(form.file.files[0], 'page-files') : null;
    await createItem(`${collections.pages}/${page}`, {
      title: form.title.value.trim(),
      text: form.text.value.trim(),
      imageUrl: image?.url || '',
      file
    });
    form.reset();
    message('admin-message', 'Блок страницы сохранен', 'success');
  } catch (err) { message('admin-message', err.message, 'error'); }
}

async function submitQuickLink(e) {
  e.preventDefault();
  const form = e.target;
  try {
    await createItem(collections.quickLinks, {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      icon: form.icon.value.trim() || 'fa-link',
      link: form.link.value.trim(),
      order: Number(form.order.value || 99)
    });
    form.reset();
    message('admin-message', 'Кармашек сохранен', 'success');
    await renderSection('quickLinks');
  } catch (err) { message('admin-message', err.message, 'error'); }
}

async function submitSpecialty(e) {
  e.preventDefault();
  const form = e.target;
  try {
    await createItem(collections.specialties, {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      duration: form.duration.value.trim(),
      icon: form.icon.value.trim() || 'fa-stethoscope'
    });
    form.reset();
    message('admin-message', 'Специальность сохранена', 'success');
    await renderSection('specialties');
  } catch (err) { message('admin-message', err.message, 'error'); }
}

async function renderSection(section) {
  document.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('hidden', panel.dataset.panel !== section));
  if (section === 'news') await simpleList('news-table', collections.news, demoNews, 'title');
  if (section === 'documents') await simpleList('documents-table', collections.documents, demoDocuments, 'title');
  if (section === 'quickLinks') await simpleList('quick-table', collections.quickLinks, demoQuickLinks, 'title');
  if (section === 'specialties') await simpleList('specialties-table', collections.specialties, demoSpecialties, 'title');
}

async function simpleList(id, path, fallback, titleField) {
  const el = document.getElementById(id);
  if (!el) return;
  const items = await getList(path, fallback);
  el.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Название</th><th>Дата</th><th>Статус</th></tr></thead><tbody>' +
    items.map(item => `<tr><td class="item-title">${escapeHtml(item[titleField] || '')}</td><td>${formatDate(item.createdAt)}</td><td><span class="item-meta">${escapeHtml(item.status || item.category || item.duration || '—')}</span></td></tr>`).join('') +
    '</tbody></table></div>';
}

function message(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<div class="notice ${type}">${escapeHtml(text)}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 5000);
}
