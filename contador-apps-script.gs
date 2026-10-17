/** Google Apps Script: crear DESDE la hoja ORIGINAL de respuestas.
 * Solo devuelve el máximo de la columna H «TOTAL APOYOS».
 * No devuelve nombres, direcciones de correo, DNI ni ninguna otra columna.
 * IMPORTANTE: comprobar que H contiene el contador acumulativo correcto.
 */
function doGet() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let total = null;
  for (const hoja of libro.getSheets()) {
    const titulo = String(hoja.getRange('H1').getDisplayValue()).trim().toUpperCase();
    if (titulo !== 'TOTAL APOYOS') continue;
    const ultimaFila = hoja.getLastRow();
    if (ultimaFila < 2) continue;
    const valores = hoja.getRange(2, 8, ultimaFila - 1, 1).getDisplayValues();
    for (const [dato] of valores) {
      const limpio = String(dato).trim().replace(/\s/g,'');
      if (!/^\d+$/.test(limpio)) continue;
      const numero = Number(limpio);
      if (Number.isSafeInteger(numero) && (total === null || numero > total)) total = numero;
    }
  }
  if (total === null) return ContentService.createTextOutput(JSON.stringify({error:'total_no_encontrado'})).setMimeType(ContentService.MimeType.JSON);
  return ContentService.createTextOutput(JSON.stringify({total:total})).setMimeType(ContentService.MimeType.JSON);
}
