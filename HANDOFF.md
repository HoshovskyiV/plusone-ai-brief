# AI Brief Framer — інструкція для сисадміна

## Що треба зробити

Розгорнути статичний лендинг за адресою **https://plusone.ua/ai-brief** — без залучення WordPress, без плагінів, без БД. Суть — одна папка зі статичними файлами в корені сайту.

## Що це таке

- 3 статичні файли: `index.html`, `landing.css`, `landing.jsx`.
- Чистий HTML + CSS + JSX (React через CDN — збірка не потрібна).
- Форма збирає email + згоду на обробку даних і шле їх у Google Sheet через Google Apps Script (URL вебхука вже зашитий у `landing.jsx`).
- Після submit — редірект на ChatGPT GPT.

## Як розгорнути

1. Отримати від Василя архів `ai-brief.zip` (вміст: `index.html`, `landing.css`, `landing.jsx`).
2. Залити в корінь сайту plusone.ua у нову папку `/ai-brief/` (поруч із `wp-content`, `wp-admin` тощо).
   - Через FTP/SSH/cPanel File Manager — як зручніше.
3. Переконатися, що права доступу на файли стандартні (644 на файли, 755 на папку).
4. Перевірити: https://plusone.ua/ai-brief має завантажити лендинг.

## Питання до тебе

Щоб максимально підстрахуватися — відповісти будь-якими з цих пунктів:

1. **Хостинг-провайдер сайту plusone.ua** — хто це (Hostinger / Ukraine.com.ua / DigitalOcean / свій VPS / інше)?
2. **Реєстратор домена plusone.ua** — хто?
3. **Який тип доступу** у тебе: FTP / SFTP / SSH / cPanel / plesk / Hostinger hPanel?
4. **Чи є у корені сайту файл `.htaccess`** з WordPress rewrite rules? (Якщо Apache.) Стандартний WP .htaccess папку `/ai-brief/` НЕ чіпає, бо там `index.html` і веб-сервер віддає його напряму — але підтвердити варто.
5. **Чи nginx чи Apache**? Якщо nginx — у конфігу має бути щось типу `try_files $uri $uri/ /index.php?$args;` — це нормально, бо фізична папка з `index.html` резолвиться раніше за fallback на `index.php`.
6. **HTTPS** — автоматично? Якщо Let's Encrypt через Certbot — нема чого додатково робити. Якщо окремий сертифікат — перевірити що покриває весь plusone.ua.

## Потенційні проблеми

- **WordPress Permalink rule** інколи намагається віддати папку як post slug. Якщо https://plusone.ua/ai-brief повертає 404 або редіректить кудись — в корінь сайту в `.htaccess` (або nginx конфіг) додати явний виняток: запити на `/ai-brief/...` не пропускати через WP.
  - Для Apache, у блок `<IfModule mod_rewrite.c>` **перед** `RewriteRule ^index\.php$ - [L]`:
    ```apacheconf
    RewriteRule ^ai-brief($|/) - [L]
    ```
  - Для nginx — у server-блок:
    ```nginx
    location ^~ /ai-brief/ { try_files $uri $uri/ =404; }
    ```
- **Cache plugin** (WP Rocket / W3 Total Cache) може віддавати 404 з кешу. Очистити кеш після заливки.
- **Cloudflare** (якщо є) може кешувати 404. Purge cache для `/ai-brief` після заливки.

## Перевірка

- Відкрити https://plusone.ua/ai-brief — має з'явитися лендинг «AI Brief Framer».
- Заповнити форму тестовими даними → submit.
- Має статися редірект на ChatGPT.
- Василь перевірить що тестовий рядок з'явився в Google Sheet.

## Контакт

Якщо будь-які складнощі — пінгуй Василя: `goshovskyj.v.i@gmail.com`.
