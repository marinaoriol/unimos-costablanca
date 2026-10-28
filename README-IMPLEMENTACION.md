# UNIMOS COSTABLANCA · Versión con agradecimiento y formulario

**Estado: SOLO DESPLIEGUE DE PRUEBA; NO ABRIR RECOGIDA REAL.**

## Archivo nuevos / modificados
- `index.html`: mantiene el formulario integrado en ES/CAT/EN; después de un HTTP 201 válido de `/api/firmar`, redirige a `/gracias.html?lang=...`.
- `gracias.html`: agradecimiento en los tres idiomas, botón de WhatsApp, vuelta a la web.
- `privacidad.html`: borrador legal revisado; **todavía tiene un aviso de revisión**, no declarar válido sin revisar proveedores, dirección de contacto, transferencia internacional y procedimiento administrativo.
- `functions/api/firmar.js`: la función existente comprueba Turnstile, DNI/NIE, consentimiento, HMAC, cifra con AES-GCM y guarda en D1. NO ha sido auditada mediante pruebas de extremo a extremo.
- `functions/api/firmas.js`: figura histórica manual de 220 + COUNT(*) de D1 (no evita duplicados con firmas históricas).
- `functions/api/estado.js`: estado de apertura.

## Publicación de prueba
1. Subir el contenido de esta carpeta a la raíz del repositorio, manteniendo `/functions/api/*.js`.
2. Confirmar `FIRMAS_ENABLED=false` en Production; secretos TURNSTILE_SECRET, DATA_ENCRYPTION_KEY, DNI_HMAC_KEY; binding D1 `DB`.
3. Nuevo deployment. Comprobar `/privacidad.html`, `/gracias.html?lang=ca`, `/gracias.html?lang=es`, `/gracias.html?lang=en`, `/api/estado` y `/api/firmas`.
4. NO activar el formulario hasta pruebas integrales, exportación, eliminación, revisión legal, comprobación de firmas antiguas y confirmación del formato admitido por la administración.

## Fase 5: pruebas
Crear D1 separada de staging, claves diferentes y Turnstile de pruebas (Cloudflare tiene claves de prueba); probar con identidades ficticias sintácticamente válidas únicamente en staging. Comprobar rechazo sin token, sin consentimiento, documento inválido y repetido; guardar y descifrar pruebas; revisar que logs, mensajes de error y rutas públicas no revelan datos. En producción mantener `false`. Después vaciar staging.

## Fase 6: exportación
NO existe una API pública para exportar. Antes de activar, desarrollar/probar herramienta administrativa local autenticada que lea D1 por medio de Cloudflare con credenciales individuales MFA y descifre localmente usando DATA_ENCRYPTION_KEY guardada en gestor seguro, con exportación cifrada y borrado de copias temporales. Nunca crear `/api/export` público ni exportar a GitHub. La interfaz de Cloudflare permite ejecutar consultas SQL, pero los campos `datos_cifrados` no son un CSV legible sin descifrar.

## Fase 7: derechos y supresión
Documentar solicitud en correo de Yaiza; autenticar identidad con el mínimo de datos adicionales; localizar usando HMAC normalizado de DNI; registrar decisión y eliminar con `DELETE FROM firmas WHERE id=?` desde acceso administrativo, así como exportaciones locales/copies cuando corresponda; considerar backups de D1 según plazo del proveedor. Borrado masivo posterior a resolución definitiva y fin de obligaciones de conservación, con acta.

## Fase 8: histórico de 220
El 220 es la cifra informada por la iniciativa; está fija como constante en `/api/firmas`. No representa migración ni validación por DNI. Revisar su legitimidad, documentación, duplicados y el acceso al fichero anterior. La tabla D1 solo evita duplicados entre nuevas firmas. Si un firmante antiguo vuelve a firmar, el contador actual lo contará dos veces. Antes de activar debe resolverse mediante migración controlada o validación contra identificadores HMAC de las firmas anteriores, por una persona autorizada.

## Atención
La página `gracias.html` es una respuesta de UX, no un comprobante autenticado ni demuestra por sí sola que alguien firmó: es una URL accesible directamente. La firma puede no equivaler a la firma electrónica admitida por la administración. Comprobar requisitos antes de usar.
