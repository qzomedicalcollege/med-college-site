export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

export const siteConfig = {
  nameKz: "Қызылорда жоғары медициналық колледжі",
  nameRu: "Кызылординский высший медицинский колледж",
  nameEn: "Kyzylorda Medical Higher College",
  founded: "1928",
  students: "2071+",
  specialties: "8",
  clinicalBases: "33",
  accreditation: "IQAA 2021–2026",
  addressKz: "Қызылорда қ., Ы. Жахаев көш. 18",
  addressRu: "г. Кызылорда, ул. Ы. Жахаева 18",
  phone: "+7 7242 23-05-13",
  email: "kzmediccollege@mail.kz",
  instagram: "https://www.instagram.com/medcollegekzo/",
  facebook: "#",
  whatsapp: "#"
};

export function isFirebaseConfigured() {
  return !Object.values(firebaseConfig).some(value => String(value).startsWith("PASTE_"));
}

export const collections = {
  news: "news",
  documents: "documents",
  quickLinks: "quickLinks",
  specialties: "specialties",
  banners: "banners",
  pages: "pages"
};
