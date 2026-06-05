import { firebaseConfig, isFirebaseConfigured } from './config.js';

let sdk = null;
let app = null;
let auth = null;
let db = null;
let storage = null;

export async function initFirebase() {
  if (!isFirebaseConfigured()) return null;
  if (sdk) return { app, auth, db, storage, ...sdk };

  const appModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
  const authModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js');
  const dbModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js');
  const storageModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js');

  app = appModule.initializeApp(firebaseConfig);
  auth = authModule.getAuth(app);
  db = dbModule.getDatabase(app);
  storage = storageModule.getStorage(app);
  sdk = { ...appModule, ...authModule, ...dbModule, ...storageModule };
  return { app, auth, db, storage, ...sdk };
}

export async function getList(path, fallback = []) {
  const fb = await initFirebase();
  if (!fb) return fallback;
  const snapshot = await fb.get(fb.ref(db, path));
  if (!snapshot.exists()) return fallback;
  const value = snapshot.val();
  if (Array.isArray(value)) return value.filter(Boolean);
  return Object.entries(value).map(([id, item]) => ({ id, ...item }));
}

export async function getObject(path, fallback = null) {
  const fb = await initFirebase();
  if (!fb) return fallback;
  const snapshot = await fb.get(fb.ref(db, path));
  return snapshot.exists() ? snapshot.val() : fallback;
}

export async function createItem(path, payload) {
  const fb = await initFirebase();
  if (!fb) throw new Error('Firebase is not configured');
  const itemRef = fb.push(fb.ref(db, path));
  await fb.set(itemRef, { ...payload, createdAt: Date.now(), updatedAt: Date.now() });
  return itemRef.key;
}

export async function updateItem(path, id, payload) {
  const fb = await initFirebase();
  if (!fb) throw new Error('Firebase is not configured');
  await fb.update(fb.ref(db, path + '/' + id), { ...payload, updatedAt: Date.now() });
}

export async function deleteItem(path, id) {
  const fb = await initFirebase();
  if (!fb) throw new Error('Firebase is not configured');
  await fb.remove(fb.ref(db, path + '/' + id));
}

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function uploadFile(file, folder = 'uploads') {
  const fb = await initFirebase();
  if (!fb) throw new Error('Firebase is not configured');
  if (!file) return null;
  const filePath = folder + '/' + Date.now() + '_' + safeFileName(file.name);
  const storageReference = fb.storageRef(storage, filePath);
  await fb.uploadBytes(storageReference, file);
  const url = await fb.getDownloadURL(storageReference);
  return { name: file.name, url, type: file.type || 'application/octet-stream', size: file.size, path: filePath };
}

export async function signInAdmin(email, password) {
  const fb = await initFirebase();
  if (!fb) throw new Error('Firebase is not configured');
  return fb.signInWithEmailAndPassword(auth, email, password);
}

export async function signOutAdmin() {
  const fb = await initFirebase();
  if (!fb) return;
  return fb.signOut(auth);
}

export async function onAuthChange(callback) {
  const fb = await initFirebase();
  if (!fb) {
    callback(null);
    return () => {};
  }
  return fb.onAuthStateChanged(auth, callback);
}
