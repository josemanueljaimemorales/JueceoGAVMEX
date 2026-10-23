# Jueceo GAV MEX

Editor de rutinas GAV para jueces (clon del editor de rutinas de la app GAV AKC: NP con Código FIG 2025-2028,
FMG N9/N10 y USAG N7/N8, libres y obligatorios, impresión, división en PDF y Excel).
La app es la carpeta `app/` (lo único que se publica, en Cloudflare Pages desde este repositorio privado).
Administrador: `admin.html` de la app.

## Qué vive dónde
| Qué | Dónde | Quién lo cambia |
|---|---|---|
| Atletas y rutinas de cada juez | En su propio equipo (memoria del navegador) | El juez |
| Código (elementos y valores), obligatorios y la app | Este repositorio (`app/datos/*.json`, `app/editor.js`…) | El administrador: al actualizar el repo, les llega a todos la próxima vez que abran la app |
| Código FIG (español) y Programa USAG | `app/docs/*.pdf`; el Código FIG en inglés enlaza al sitio oficial de la FIG (enlaces en `app/config.js`) | El administrador |
| Códigos de acceso, registro de entradas y sugerencias | Hoja de Google del administrador + Apps Script (`apps-script/Codigo.gs`) | El administrador, desde `admin.html` (o en la hoja) |

- Las rutinas **no** se suben a ningún lado. Para pasarlas a otro equipo o no perderlas: menú → **Descargar respaldo** / **Cargar respaldo**.
- La app funciona sin internet hasta **3 días** desde la última revisión de la licencia (`GRACIA_DIAS` en `Codigo.gs`).

## Acceso
1. En `admin.html` creas una licencia (juez, nota, equipos permitidos, vencimiento opcional) y le mandas el código
   (botón "Copiar mensaje para el juez").
2. El juez escribe el código; su equipo queda ligado (hasta el número de equipos permitidos, para que no lo comparta).
3. Cada vez que abre la app, y cada 30 min mientras está abierta, se revisa la licencia. **Cancelar acceso**, una fecha
   de **vencimiento** vencida o **Liberar equipos** le cierran la app. Sus rutinas se quedan en su equipo: si lo
   reactivas, vuelve a escribir su código y las tiene igual.
4. El panel muestra licencias activas, jueces que entraron hoy y en 7 días, último acceso y entradas de cada uno, y
   la lista de accesos (fecha, juez, equipo, rechazos).

Las **sugerencias** que mandan los jueces (botón "Enviar sugerencia" del inicio) llegan a la pestaña Sugerencias del
panel y a la hoja "Sugerencias" (máximo 10 al día por licencia).

La hoja también se puede editar a mano: desmarcar **Activo** = cancelar; borrar la celda **Equipos** = liberar.

## Configuración (una sola vez)
1. En Google Drive (en una carpeta **privada**, no en "Utilidades App") crea una hoja de cálculo, p. ej.
   "Jueceo GAV MEX – Licencias".
2. En la hoja: **Extensiones → Apps Script**. Borra lo que trae, pega todo `apps-script/Codigo.gs` y guarda.
3. En Apps Script, **Configuración del proyecto** (engrane):
   - Zona horaria: `(GMT-06:00) Hora de México – Ciudad de México`.
   - **Propiedades de la secuencia de comandos → Agregar**: propiedad `CLAVE_ADMIN`, valor = la contraseña del panel.
4. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: **Yo**. Quién tiene acceso:
   **Cualquier usuario**. Autoriza los permisos (Google avisa "app no verificada": Configuración avanzada → Ir).
5. Copia la URL que termina en `/exec` y ponla en `app/config.js` (o pásasela a Claude).
6. Si después cambia `Codigo.gs`: **Implementar → Administrar implementaciones → editar → Versión: nueva** (la URL no cambia).

## Publicación
Cloudflare Pages (gratis) conectado a este repositorio privado: proyecto con rama de producción `main`, sin comando de
compilación y directorio de salida `app`. Cada push a `main` se publica solo. `app/robots.txt` pide a los buscadores no
indexarla.

## Límites (para saberlo al vender)
La app se descarga al navegador para funcionar: los archivos de la app, incluido el Código (`datos/*.json`), se pueden descargar sin
licencia. El código de acceso evita que se use la app normalmente, pero alguien con conocimientos técnicos podría
copiarla. Si hiciera falta más protección, el Código tendría que servirse desde Apps Script solo con licencia.
