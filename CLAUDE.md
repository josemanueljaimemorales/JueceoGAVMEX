# Jueceo GAV MEX — guía para Claude

App web sin build que el administrador vende a jueces. Se publica la carpeta `app/` en Cloudflare Pages (rama `main`,
repositorio privado). No poner el nombre del administrador ni enlaces que lo identifiquen en la app ni en el repo. Responder en español,
claro y sin relleno. Ver README.md.

- Sin Firebase. Rutinas solo en el equipo del juez (`localStorage` `jueceo_rutinas`); nada de rutinas en la nube.
- Lo que el administrador actualiza para todos: `app/datos/elementos.json`, `app/datos/obligatorios.json` y el código de la app.
- Licencias: `apps-script/Codigo.gs` (Apps Script + hoja de Google del administrador); `app/app.js` las revisa, `app/admin.html`/`app/admin.js`
  es el panel. La contraseña del panel es `CLAVE_ADMIN` en las propiedades del script: nunca en el repo ni en mensajes.
- `app/editor.js`/`app/editor.css` vienen de `pruebanuevappakc/modulos/rutinas/editor.*`. Para traer mejoras: copiar los cambios
  del cálculo/buscador y conservar lo de aquí (sin Excel de atletas ni "Volver a cargar del Excel", sin logos ni "AKC" en
  la impresión, `iniciarEditor(cat,obl)` en lugar de `init()`, guardado solo local, sin respaldo para el juez: solo imprimir/PDF y Excel). Al cambiar
  `elementos.json`/`obligatorios.json` allá, copiarlos a `app/datos/`.
- Al cambiar JS/CSS, subir el `?v=` en `app/index.html`/`app/admin.html` y `CACHE` en `app/sw.js`.
- Sin datos de atletas de AKC. Probar pantalla y PDF/impresión (fondo blanco, sin etiquetas de prueba) y el flujo de
  licencias con un simulador de Apps Script antes de publicar.
