/**
 * AI Brief Framer — submission receiver.
 * Deploy: Apps Script → Deploy → New deployment → Web app.
 *   Execute as:     Me (goshovskyj.v.i@gmail.com)
 *   Who has access: Anyone
 * Paste the resulting /exec URL into landing.jsx → TWEAK_DEFAULTS.sheetsUrl.
 */

const SHEET_NAME = 'Submissions';
const HEADERS = ['Timestamp', 'Name', 'Company', 'Email', 'Consent', 'User Agent', 'Referrer', 'Page'];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      payload.name || '',
      payload.company || '',
      payload.email || '',
      payload.consent ? 'yes' : 'no',
      payload.userAgent || '',
      payload.referrer || '',
      payload.page || ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService
    .createTextOutput('AI Brief webhook is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
