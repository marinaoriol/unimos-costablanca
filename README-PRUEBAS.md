PRUEBAS DE UNIMOS COSTABLANCA

1. Subir cambios a GitHub main. La misma versión funcionará en ambos proyectos; cada uno recibe su clave pública de /api/estado.
2. En proyecto REAL mantener FIRMAS_ENABLED=false y binding DB a producción.
3. En proyecto TEST comprobar DB enlaza SOLO a unimos-costablanca-test, claves propias, TURNSTILE_SITE_KEY=1x00000000000000000000AA, TURNSTILE_SECRET=1x0000000000000000000000000000000AA.
4. Solo en proyecto TEST establecer FIRMAS_ENABLED=true y desplegar de nuevo.
5. Abrir https://unimos-costablanca-test.pages.dev/api/estado: debe devolver enabled:true y siteKey de prueba.
6. Abrir web de test y probar con nombre ficticio (p.ej. Prueba), apellido ficticio (p.ej. Técnica), DNI de ejemplo de formato válido solo para test (00000000T), correo vacío y casillas marcadas. No usar DNI real.
7. Debe redirigir a gracias.html tras éxito. Repetir mismo DNI: debe rechazar.
8. En D1 TEST Console: SELECT COUNT(*) AS total FROM firmas; y SELECT substr(datos_cifrados,1,40) FROM firmas LIMIT 1; no debe verse DNI legible.
9. Reestablecer FIRMAS_ENABLED=false en TEST. No activar producción: aún faltan exportación, borrado, validación legal e historial.

ADVERTENCIA: las claves dummy solo prueban integración, no protección real anti-bots. El backend acepta datos ficticios mientras test esté activo. No compartir la URL durante pruebas.
