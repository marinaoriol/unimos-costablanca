# Unimos Costa Blanca — Landing Cloudflare Pages

## 1. Google Sheets → Apps Script
Abre la HOJA ORIGINAL de respuestas del formulario (no la página `/pubhtml`). Ve a **Extensiones → Apps Script** y pega el contenido de `contador-apps-script.gs`. El script busca el encabezado `TOTAL APOYOS` en H1 y devuelve el máximo entero de H2:H, que en la captura parece un contador acumulativo. Comprueba que ese campo sigue contando apoyos válidos (y no registros de prueba o duplicados).

En Apps Script: **Implementar → Nueva implementación → Aplicación web**; ejecuta **como yo** y da acceso a **cualquier persona**. Copia la URL terminada en `/exec`. Prueba la URL en una ventana privada: solo debe mostrar `{"total":NUMERO}` y ningún dato personal. Si modificas el script, crea una nueva versión de la implementación.

## 2. Subir a GitHub
Abre github.com y entra en tu cuenta. Crea un repositorio nuevo llamado `unimos-costablanca` (puede ser privado). No añadas README automático si vas a importar todos estos archivos. En el repositorio, elige **Add file → Upload files** y arrastra **el contenido descomprimido** del ZIP, de modo que `index.html` quede en la raíz, `functions/api/firmas.js` mantenga sus carpetas y los dos MP4 queden al lado del HTML. GitHub puede requerir subir la carpeta `functions` de manera separada mediante la interfaz; comprueba la estructura final. Guarda con **Commit changes**.

## 3. Cloudflare Pages → GitHub
En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**. Autoriza GitHub y selecciona el repositorio. Framework: **None**; comando de compilación: **vacío**; directorio de salida: **/** (raíz del repositorio). Despliega y comprueba la URL provisional `.pages.dev`.

Ve al proyecto en **Settings → Variables and Secrets** (o Environment variables según interfaz) y crea `APPS_SCRIPT_URL` con la URL `/exec` del paso 1. Aplícala a Production y vuelve a desplegar. No pegues la URL en el HTML. La función `/api/firmas` consultará Google y entregará solo el total. Revisa `/api/firmas` desde el navegador: debería verse `{"total":...}`. El contador de la web se actualizará cada cinco minutos sin mostrar un dato antiguo como actual. Algunas redirecciones de Google Apps Script son gestionadas por Cloudflare; si la llamada falla habrá que revisar logs de Functions.

## 4. Dominio
Antes de modificar DNS comprueba la web en `.pages.dev`, incluidos vídeos en ventana privada. En Cloudflare añade el dominio `unimoscostablanca.com` a tu cuenta y revisa los DNS existentes (en especial correo, si lo hay). Cambia los nameservers en Canva según instrucciones que proporcione Cloudflare. En el proyecto Pages: **Custom domains → Set up a domain** y añade el dominio. Comprueba `www` y sus redirecciones antes de anunciarlo.

## Notas
- Los dos archivos MP4 están dentro del proyecto; no dependen de un Mac ni de YouTube. Autoplay puede estar limitado por el navegador y por preferencias de ahorro de datos.
- El manifiesto se abre desde Google Drive con el enlace público dado por la campaña.
- Botón único de WhatsApp en el cierre. El botón usa enlace directo a WhatsApp.
- Verifica autorizaciones y anonimización de menores antes de publicar los vídeos.
- Si el repositorio es público, los MP4 también serán públicamente accesibles.
