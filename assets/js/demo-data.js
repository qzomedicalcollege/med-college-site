export const demoQuickLinks = [
  { title: 'Абитуриентам', description: 'Правила приема, специальности и документы', icon: 'fa-user-graduate', link: 'admission.html', order: 1 },
  { title: 'Студентам', description: 'Расписание, практика и материалы', icon: 'fa-book-open-reader', link: 'students.html', order: 2 },
  { title: 'Документы', description: 'Лицензии, приказы и бланки', icon: 'fa-file-lines', link: 'documents.html', order: 3 },
  { title: 'Расписание', description: 'Актуальные файлы расписания', icon: 'fa-calendar-days', link: 'schedule.html', order: 4 },
  { title: 'Специальности', description: 'Образовательные программы', icon: 'fa-stethoscope', link: 'specialties.html', order: 5 },
  { title: 'Контакты', description: 'Адрес, телефон и email', icon: 'fa-location-dot', link: 'contacts.html', order: 6 }
];

export const demoSpecialties = [
  { title: 'Сестринское дело', description: 'Подготовка медицинских сестер.', duration: '2 г. 10 мес. / 3 г. 10 мес.', icon: 'fa-user-nurse' },
  { title: 'Лечебное дело', description: 'Подготовка фельдшеров.', duration: '3 г. 10 мес.', icon: 'fa-briefcase-medical' },
  { title: 'Акушерское дело', description: 'Подготовка акушерских специалистов.', duration: '2 г. 10 мес.', icon: 'fa-baby' },
  { title: 'Лабораторная диагностика', description: 'Клинико-диагностические лаборатории.', duration: '2 г. 10 мес.', icon: 'fa-microscope' },
  { title: 'Фармация', description: 'Фармацевтическое направление.', duration: '2 г. 10 мес.', icon: 'fa-prescription-bottle-medical' },
  { title: 'Стоматология', description: 'Стоматологический профиль.', duration: '2 г. 10 мес.', icon: 'fa-tooth' }
];

export const demoNews = [
  { title: 'Прием документов 2026', content: 'Раздел для абитуриентов готов к наполнению.', imageUrl: '', status: 'published', createdAt: Date.now() - 86400000 },
  { title: 'Учебные материалы', content: 'В разделе студентов можно размещать материалы и файлы.', imageUrl: '', status: 'published', createdAt: Date.now() - 172800000 },
  { title: 'Документы колледжа', content: 'Поддерживаются PDF, Word, Excel и PowerPoint.', imageUrl: '', status: 'published', createdAt: Date.now() - 259200000 }
];

export const demoDocuments = [
  { title: 'Лицензия колледжа', category: 'Лицензии', description: 'Файл можно загрузить через админ-панель.', file: null, createdAt: Date.now() - 100000 },
  { title: 'Расписание занятий', category: 'Расписание', description: 'PDF, DOCX или XLSX расписание.', file: null, createdAt: Date.now() - 200000 },
  { title: 'Заявление для студентов', category: 'Бланки', description: 'Шаблоны заявлений.', file: null, createdAt: Date.now() - 300000 }
];

export const demoPages = {
  about: [
    { title: 'О колледже', text: 'Информация о колледже, истории, миссии и структуре.', imageUrl: '', file: null },
    { title: 'Миссия', text: 'Подготовка компетентных медицинских специалистов.', imageUrl: '', file: null }
  ],
  admission: [
    { title: 'Абитуриентам', text: 'Правила приема, документы, сроки и гранты.', imageUrl: '', file: null },
    { title: 'Документы для поступления', text: 'Список документов добавляется через админ-панель.', imageUrl: '', file: null }
  ],
  students: [
    { title: 'Студентам', text: 'Расписание, практика, материалы и бланки.', imageUrl: '', file: null },
    { title: 'Практика', text: 'Информация о профессиональной практике.', imageUrl: '', file: null }
  ],
  schedule: [
    { title: 'Расписание занятий', text: 'Файлы расписания можно загружать из админки.', imageUrl: '', file: null }
  ],
  contacts: [
    { title: 'Приемная комиссия', text: 'Телефон: +7 7242 23-05-13. Email: kzmediccollege@mail.kz', imageUrl: '', file: null }
  ]
};
