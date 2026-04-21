# AI Brief Framer — твоя частина налаштування (~10 хв)

Все, що треба зробити тобі самому **до** розмови з сисадміном. Після цих кроків у тебе буде готовий URL вебхука, який лишиться тільки вставити в один рядок коду.

---

## Крок 1. Створити Google Таблицю

1. Відкрий https://sheets.google.com (залогінь `goshovskyj.v.i@gmail.com`).
2. **Blank spreadsheet** → перейменуй на `AI Brief — Submissions`.
3. _(нічого не заповнюй вручну — заголовки додасться автоматично при першій заявці)_

## Крок 2. Вставити Apps Script

1. У тій же таблиці: **Extensions → Apps Script**.
2. Відкриється редактор, там буде порожня `function myFunction() {}` — **видали повністю**.
3. Відкрий файл `apps-script.gs` у папці цього проєкту → скопіюй весь вміст → встав у редактор.
4. **Ctrl+S** (Save). У верхньому полі назви проєкту напиши `AI Brief Webhook`.

## Крок 3. Задеплоїти як Web App

1. Праворуч угорі — **Deploy → New deployment**.
2. Натисни шестерню ⚙ біля «Select type» → вибери **Web app**.
3. Заповни:
   - **Description:** `AI Brief receiver v1`
   - **Execute as:** `Me (goshovskyj.v.i@gmail.com)`
   - **Who has access:** `Anyone` ← **критично**, інакше анонімні submit-и не пройдуть
4. **Deploy**.
5. Google запитає авторизацію:
   - «Review permissions» → вибери свій акаунт
   - екран «Google hasn't verified this app» → **Advanced** → **Go to AI Brief Webhook (unsafe)** → **Allow**
   - (це нормально — скрипт твій власний, Google просто не верифікує приватні скрипти)
6. Скопіюй **Web app URL** (виглядає як `https://script.google.com/macros/s/AKfy.../exec`).

## Крок 4. Перевірити що вебхук живий

Відкрий URL у браузері — має показати текст `AI Brief webhook is live.` Якщо так — усе ок.

## Крок 5. Вставити URL у лендинг

Відкрий `landing.jsx`, на самому початку знайди блок:

```
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "targetUrl": "https://chatgpt.com/g/g-69e0f568d5c08191a970cdd142ae123c-brief-framer-by-plusone",
  "sheetsUrl": ""
}/*EDITMODE-END*/;
```

Встав свій `/exec` URL між лапками `sheetsUrl`. Збережи.

## Крок 6. Локальний тест

(Git Bash, з папки проєкту):

```bash
python -m http.server 8000
```

Відкрий http://localhost:8000 → заповни форму → відправ → має:
1. Відбутися редірект на ChatGPT GPT.
2. У таблиці з'явитися новий рядок (оновити вкладку Sheets якщо відкрита).

Якщо рядок не з'явився — перевір що `sheetsUrl` правильно вставлено, що деплой зроблений з `Who has access: Anyone`, і що при переході на `/exec` URL бачиш `AI Brief webhook is live.`

---

## Що потім передати сисадміну

Файл `HANDOFF.md` — там уже все для нього розписано. Зібрати для нього:

- Папку з трьома файлами: `index.html`, `landing.css`, `landing.jsx` (з уже вставленим `sheetsUrl`).
- Путь на сервері куди залити: `/ai-brief/` у корені WordPress.
- Перевірочний URL: https://plusone.ua/ai-brief

## Якщо треба передати ownership потім

Google Sheet: `Share` → праворуч від `office@plusone.com.ua` три крапки → `Transfer ownership`. Apps Script: повторити той же жест у Drive (правою кнопкою на файлі скрипта в Drive → `Share` → Transfer ownership).
