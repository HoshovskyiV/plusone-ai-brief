# AI Brief Framer — plusone

Статичний лендинг для [plusone.ua/ai-brief](https://plusone.ua/ai-brief). Форма збирає ім'я / компанію / email у Google Sheet через Apps Script і редіректить на [AI Brief Framer GPT](https://chatgpt.com/g/g-69e0f568d5c08191a970cdd142ae123c-brief-framer-by-plusone).

## Стек

- Чистий HTML + CSS + JSX (React 18.3 через CDN, Babel Standalone для трансляції JSX у браузері — без збірки).
- Бекенд: Google Apps Script Web App → Google Sheets.
- Хостинг: статична папка у WP root (або будь-який статичний хостинг).

## Файли

| Файл | Призначення |
|---|---|
| `index.html` | Завантажує React, CSS, JSX |
| `landing.css` | Стилі лендингу |
| `landing.jsx` | React-компонент форми |
| `apps-script.gs` | Код GAS Web App (деплоїться окремо) |
| `SETUP.md` | Інструкція: як налаштувати Google Sheet + Apps Script (~10 хв) |
| `HANDOFF.md` | Інструкція для сисадміна: як залити на хостинг |

## Швидкий старт

### 1. Налаштувати бекенд

Див. [SETUP.md](SETUP.md) — створити Sheet, задеплоїти Apps Script, отримати `/exec` URL.

### 2. Вставити URL у landing.jsx

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "targetUrl": "https://chatgpt.com/g/g-69e0f568d5c08191a970cdd142ae123c-brief-framer-by-plusone",
  "sheetsUrl": "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
}/*EDITMODE-END*/;
```

### 3. Локальний тест

```bash
python -m http.server 8000
```

Відкрити http://localhost:8000 → заповнити форму → submit → має з'явитися новий рядок у Sheet (лист `Submissions`) та редірект на ChatGPT GPT.

### 4. Деплой

Див. [HANDOFF.md](HANDOFF.md) — інструкція для сисадміна: папку `/ai-brief/` у корінь WordPress.
