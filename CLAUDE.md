# Jueceo GAV MEX — guía para Claude

App web sin build (GitHub Pages, rama `main`) que Manu (José Manuel Jaime Morales) vende a jueces. Responder en español,
claro y sin relleno. Ver README.md.

- Sin Firebase. Rutinas solo en el equipo del juez (`localStorage` `jueceo_rutinas`); nada de rutinas en la nube.
- Lo que Manu actualiza para todos: `datos/elementos.json`, `datos/obligatorios.json` y el código de la app.
- Licencias: `apps-script/Codigo.gs` (Apps Script + hoja de Google de Manu); `app.js` las revisa, `admin.html`/`admin.js`
  es el panel. La contraseña del panel es `CLAVE_ADMIN` en las propiedades del script: nunca en el repo ni en mensajes.
- `editor.js`/`editor.css` vienen de `pruebanuevappakc/modulos/rutinas/editor.*`. Para traer mejoras: copiar los cambios
  del cálculo/buscador y conservar lo de aquí (sin Excel de atletas ni "Volver a cargar del Excel", sin logos ni "AKC" en
  la impresión, `iniciarEditor(cat,obl)` en lugar de `init()`, guardado solo local con respaldo). Al cambiar
  `elementos.json`/`obligatorios.json` allá, copiarlos a `datos/`.
- Al cambiar JS/CSS, subir el `?v=` en `index.html`/`admin.html` y `CACHE` en `sw.js`.
- Sin datos de atletas de AKC. Probar pantalla y PDF/impresión (fondo blanco, sin etiquetas de prueba) y el flujo de
  licencias con un simulador de Apps Script antes de publicar.
