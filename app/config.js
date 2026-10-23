/* Dirección del servidor de licencias: la URL de la "Aplicación web" de Apps Script (termina en /exec).
   No es secreta (cualquiera que abra la app la ve); el panel de administrador pide además la contraseña CLAVE_ADMIN,
   que vive solo en Apps Script. Mientras diga PENDIENTE, la app muestra "La app aún no está configurada". */
window.JUECEO = {
  // Documentos del inicio. Para cambiar uno, sube el PDF nuevo a docs/ (o pon el enlace oficial) y cambia aquí.
  docs: {
    figES: "docs/Codigo-FIG-2025-2028-ES.pdf",
    figEN: "https://www.gymnastics.sport/publicdir/rules/files/en_1.1%20-%20MAG%20Code%20of%20Points%202025-2028.pdf",
    figNL: "https://www.gymnastics.sport/site/pages/newsletters-mag.php",
    usag: "docs/Programa-USAG-2025-2028.pdf"
  },
  api: "https://script.google.com/macros/s/AKfycbwsbrB3wZjbUGIfnLpvsSy5FwIZJA_9DedqcaMhNis50HbAzcx4XWIaFKmkDSP70Ynh/exec"
};
