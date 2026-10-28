# Unimos Costablanca — actualización de formulario seguro (ES/CAT/EN)

**IMPORTANTE: el formulario está cerrado por defecto.** Publicar estos archivos sustituye enlaces de Google Forms y mantiene visible la firma presencial; NO habilita la recepción de datos reales hasta configurar `FIRMAS_ENABLED=true` y volver a desplegar. Habilitarlo solo después de las verificaciones descritas aquí.

## Archivos

- `index.html`: landing existente preservada con nuevo formulario trilingüe y enlaces internos.
- `privacidad.html`: borrador trilingüe, **todavía tiene campos entre corchetes**. Revisar y completar ANTES de abrir el formulario; actualmente noindex.
- `functions/api/firmar.js`: validación DNI/NIE, Turnstile en servidor, cifrado AES-GCM de nombre, DNI y correo, HMAC para evitar duplicados, grabación en D1.
- `functions/api/firmas.js`: contador = **220 firmas históricas comunicadas por la iniciativa** + número de registros nuevos. NO importa ningún DNI ni garantiza que los 220 sean únicos ni válidos. Si la cifra histórica cambia antes del lanzamiento, actualizar `HISTORIC_TOTAL` solo tras conciliar registros.
- `functions/api/estado.js`: permite a la web saber si el formulario está habilitado.
- `_headers`: cabeceras básicas de seguridad para recursos estáticos.
- MP4, logo, manifiesto: assets originales conservados.

## Configuración Cloudflare Pages (producción)

1. Confirmar que la D1 `unimos-costablanca-firmas` está vinculada como **`DB`** al proyecto Pages de producción. La tabla `firmas` debe existir (se creó en la consola).
2. Confirmar secreto **`TURNSTILE_SECRET`** y widget registrado para `www.unimoscostablanca.com`. Sitekey pública en el HTML: `0x4AAAAAAFpabUekpw5zgo_B`.
3. Generar **dos secretos independientes de 32 bytes**, en equipo confiable con `openssl rand -hex 32` (cada ejecución). Guardar las dos cadenas de 64 caracteres hexadecimales como secretos Cloudflare **`DATA_ENCRYPTION_KEY`** y **`DNI_HMAC_KEY`**. **No copiar las claves al repositorio, chat, capturas ni tickets.** Guardarlas también en un almacén seguro administrado por las responsables: sin la clave AES no se podrán recuperar las firmas. La pérdida de clave HMAC impide detectar duplicados anteriores.
4. Crear variable de texto **`FIRMAS_ENABLED` = `false`**. Redeploy.
5. Actualizar `privacidad.html` (campos entre corchetes) con revisión de responsable, encargados, transferencias, plazo de conservación, contacto y borrado de datos. El texto de los consentimientos y el registro `version_privacidad` deben coincidir con esa versión publicada. No publicar ni recolectar datos reales hasta validación.
6. Probar rutas `/api/estado` (debe devolver `enabled:false`) y `/api/firmas` (debe devolver `total:220` si D1 vacía). Asegurarse de que una solicitud POST a `/api/firmar` devuelve 503 `closed` mientras está desactivado.
7. **Antes de activarlo:** auditoría funcional y de seguridad con entorno de pruebas separado (D1 y Turnstile de pruebas; nunca con datos reales), consentimientos, DNI ficticios matemáticamente válidos, duplicados, fallos de Turnstile, exportación privada, y ejercicio de derechos. Confirmar que la administración admite **adhesión por casilla sin firma manuscrita**; que exija DNI no demuestra que baste la casilla.
8. Solo tras pruebas y revisión legal, poner `FIRMAS_ENABLED=true`, redeploy. No abrir si no existe un procedimiento seguro documentado de exportación / eliminación de registros, copia de seguridad, control de accesos y gestión de incidencias.

## Riesgos y límites conocidos

- **No hay todavía herramienta de exportación/desencriptación**, panel administrativo ni borrado de datos. Por ello **NO habilitar** el formulario. Hay que desarrollar y probar esos procesos antes de admitir firmas reales.
- El contador público solo expone números. En el panel de Cloudflare D1, administradores con permisos pueden consultar filas cifradas e identificadores HMAC. Mantener cuentas separadas, MFA y mínimo privilegio.
- Las 220 firmas anteriores pueden seguir en Google Sheets: protegerlas y revisar su base jurídica. No importarlas automáticamente ni volver a contarlas en D1.
- Turnstile necesita validación server-side y no sustituye el resto de controles. Protección contra abuso adicional (rate limiting) por implementar.
- Hay que documentar autorización de la gestora técnica por Yaiza y valorar contrato de encargo del tratamiento si presta servicios profesionales.
- Cambiar las claves tras comenzar a almacenar firmas requiere una migración cuidada, ya que los registros dependen de ellas.

## Despliegue

Subir el contenido del directorio al **nivel raíz** del repositorio GitHub `main` del proyecto Pages, conservando rutas `functions/api/*.js` y recursos. No subir el ZIP entero como fichero aislado. Verificar HTTPS y tres idiomas, vídeos, Maps, página de privacidad y contador.
