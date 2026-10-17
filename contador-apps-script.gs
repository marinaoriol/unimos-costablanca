// Publica solo el total desde la pestaña TOTAL APOYOS, celda A2.
function doGet() {
  const libro = SpreadsheetApp.openById('1awxoVTv2jND2eV126SGFdlzvNqhyZN_DEH3aBrCWyzA');
  const hoja = libro.getSheetByName('TOTAL APOYOS');
  if (!hoja) throw new Error('No se encuentra la pestaña TOTAL APOYOS');
  const total = Number(hoja.getRange('A2').getValue());
  if (!Number.isSafeInteger(total) || total < 0) throw new Error('Total no valido');
  return ContentService.createTextOutput(JSON.stringify({total})).setMimeType(ContentService.MimeType.JSON);
}
