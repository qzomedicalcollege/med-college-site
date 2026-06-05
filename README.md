# Қызылорда жоғары медициналық колледжі — сайт

Статический сайт колледжа на HTML, CSS и JavaScript.

## Что внутри

- Главная страница с быстрым доступом, статистикой, специальностями и новостями.
- Страницы: о колледже, абитуриентам, студентам, документы, расписание, специальности, новости, контакты.
- Отдельная админ-панель `admin.html`.
- Подготовка под Firebase Authentication, Realtime Database и Storage.
- Загрузка изображений и файлов: PDF, Word, Excel, PowerPoint.
- Кнопки скачивания документов для посетителей.

## Структура

```text
index.html
about.html
admission.html
students.html
documents.html
schedule.html
specialties.html
news.html
contacts.html
admin.html
assets/
  css/
    style.css
    admin.css
  js/
    config.js
    firebase-service.js
    site.js
    page.js
    news.js
    documents.js
    admin.js
  img/
    logo.svg
```

## Как запустить локально

Можно открыть `index.html` напрямую в браузере. Для проверки модульных JS-файлов лучше запустить простой локальный сервер:

```bash
python -m http.server 8080
```

Потом открыть:

```text
http://localhost:8080
```

## Как подключить Firebase

1. Создайте проект в Firebase Console.
2. Включите Authentication → Email/Password.
3. Создайте администратора через Firebase Console.
4. Включите Realtime Database.
5. Включите Firebase Storage.
6. Откройте `assets/js/config.js`.
7. Вставьте реальные параметры Firebase вместо `PASTE_...`.

Пример структуры базы:

```text
/news
/pages/about
/pages/admission
/pages/students
/pages/schedule
/pages/contacts
/documents
/quickLinks
/banners
/specialties
```

## Firebase Security Rules

Для Realtime Database базовая логика такая: чтение всем, запись только авторизованным пользователям.

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

Для Storage:

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 25 * 1024 * 1024;
    }
  }
}
```

На реальном сайте лучше ограничить запись конкретным email администратора.

## GitHub Pages

Для публикации через GitHub Pages:

1. Repository Settings → Pages.
2. Source: Deploy from branch.
3. Branch: `main`.
4. Folder: `/root`.
5. Save.

## Важно

Пока Firebase config не заполнен, сайт показывает демо-данные. Админ-панель предупредит, что Firebase не настроен.
