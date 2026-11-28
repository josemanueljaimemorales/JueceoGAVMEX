/* Elegir atleta con listas desplegables (Manu, 28-nov-2026: «listas desplegables y no scroll muy largos»).
 * Para quien ve a todos los atletas: Grupo y Nivel filtran, y la lista Atleta muestra solo los que quedan; al elegir
 * un grupo o un nivel, el módulo pinta abajo solo los de ese grupo o nivel. Aquí nunca van nombres de atletas.
 *   SELATL.config(clave, {alElegir(v), alCambiar()})   → qué hacer al elegir un atleta o cambiar un filtro
 *   SELATL.html(clave, items, {titulo, ordenGrupos})    → los desplegables; items = [{v, t, nivel, grupo}]
 *   SELATL.filtrados(clave, items)                      → los que pasan el filtro ([] si no hay grupo ni nivel elegido)
 */
(function () {
  "use strict";
  const SIN_G = "Sin grupo";
  const est = {}, cfg = {};
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function estado(clave) {
    if (!est[clave]) {
      let e = { grupo: "", nivel: "" };
      try { e = Object.assign(e, JSON.parse(localStorage.getItem("selatl-" + clave) || "{}")); } catch (_) {}
      est[clave] = e;
    }
    return est[clave];
  }
  function guardar(clave) { try { localStorage.setItem("selatl-" + clave, JSON.stringify(est[clave])); } catch (_) {} }

  const nivelClave = n => String(n ?? "").trim().toUpperCase().replace(/^NIVEL\s*/, "").replace(/^N(?=\d)/, "");
  const nivelTxt = k => /^\d+$/.test(k) ? "Nivel " + k : (k || "Sin nivel");
  let ORDEN_G = [];
  const ordG = g => { const i = ORDEN_G.indexOf(g); return i >= 0 ? i : (g === SIN_G ? 99 : 50); };
  const ordN = k => /^\d+$/.test(k) ? +k : (k === "FIG" ? 20 : k ? 30 : 99);
  const grupoDeItem = it => it.grupo || SIN_G;
  const pasa = (e, it) => (!e.grupo || grupoDeItem(it) === e.grupo) && (!e.nivel || nivelClave(it.nivel) === e.nivel);

  function filtrados(clave, items) {
    const e = estado(clave);
    return e.grupo || e.nivel ? items.filter(it => pasa(e, it)) : [];
  }

  function html(clave, items, op) {
    op = op || {};
    ORDEN_G = op.ordenGrupos || [];
    const e = estado(clave);
    const grupos = [...new Set(items.map(grupoDeItem))].sort((a, b) => ordG(a) - ordG(b) || a.localeCompare(b));
    const niveles = [...new Set(items.map(it => nivelClave(it.nivel)))].sort((a, b) => ordN(a) - ordN(b) || a.localeCompare(b));
    if (e.grupo && !grupos.includes(e.grupo)) e.grupo = "";
    if (e.nivel && !niveles.includes(e.nivel)) e.nivel = "";
    const quedan = items.filter(it => pasa(e, it));
    const opt = it => `<option value="${esc(it.v)}">${esc(it.t ?? it.v)}${!e.nivel && nivelClave(it.nivel) ? " · " + esc(nivelTxt(nivelClave(it.nivel))) : ""}</option>`;
    let lista;
    if (!e.grupo && grupos.length > 1) {
      lista = grupos.map(g => {
        const de = quedan.filter(it => grupoDeItem(it) === g);
        return de.length ? `<optgroup label="${esc(g)}">${de.map(opt).join("")}</optgroup>` : "";
      }).join("");
    } else lista = quedan.map(opt).join("");
    const sel = (f, etiqueta, ops) => `<label class="selatl-campo"><span>${etiqueta}</span><select data-selatl="${esc(clave)}" data-selatl-f="${f}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-1p-ignore="true" data-lpignore="true" data-bwignore="true" data-form-type="other">${ops}</select></label>`;
    const filtros = [];
    if (grupos.length > 1) filtros.push(sel("grupo", "Grupo", `<option value="">Todos los grupos</option>` + grupos.map(g => `<option value="${esc(g)}"${g === e.grupo ? " selected" : ""}>${esc(g)}</option>`).join("")));
    if (niveles.length > 1) filtros.push(sel("nivel", "Nivel", `<option value="">Todos los niveles</option>` + niveles.map(k => `<option value="${esc(k)}"${k === e.nivel ? " selected" : ""}>${esc(nivelTxt(k))}</option>`).join("")));
    const ayuda = e.grupo || e.nivel
      ? `${quedan.length} ${quedan.length === 1 ? "atleta" : "atletas"}${e.grupo ? " de " + esc(e.grupo) : ""}${e.nivel ? " en " + esc(nivelTxt(e.nivel)) : ""}`
      : (filtros.length ? "Elige un grupo o un nivel para ver solo a esos atletas." : "");
    return `<div class="selatl">${filtros.length ? `<div class="selatl-fila">${filtros.join("")}</div>` : ""}`
      + sel("atleta", op.titulo || "Atleta", `<option value="">Elige un atleta (${quedan.length})</option>${lista}`)
      + (ayuda ? `<div class="selatl-ayuda">${ayuda}</div>` : "") + `</div>`;
  }

  function config(clave, c) { cfg[clave] = c; }

  document.addEventListener("change", ev => {
    const s = ev.target.closest && ev.target.closest("select[data-selatl]");
    if (!s) return;
    const clave = s.dataset.selatl, c = cfg[clave] || {};
    if (s.dataset.selatlF === "atleta") { if (s.value && c.alElegir) c.alElegir(s.value); return; }
    estado(clave)[s.dataset.selatlF] = s.value;
    guardar(clave);
    if (c.alCambiar) c.alCambiar();
  });

  const css = document.createElement("style");
  css.textContent = `
.selatl{display:grid;gap:8px;margin:10px 0 14px;text-align:left}
.selatl-fila{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}
.selatl-campo{display:grid;gap:4px;min-width:0}
.selatl-campo>span{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.75}
.selatl select{width:100%;min-width:0;padding:12px;border-radius:12px;border:1px solid rgba(127,127,127,.45);background:rgba(127,127,127,.12);color:inherit;font-weight:600;font-size:16px;line-height:1.2;font-family:inherit}
.selatl select option,.selatl select optgroup{color:#111;background:#fff}
.selatl-ayuda{font-size:13px;opacity:.75}
@media print{.selatl{display:none}}`;
  document.head.appendChild(css);

  window.SELATL = { config, html, filtrados, nivelClave, nivelTxt };
})();
