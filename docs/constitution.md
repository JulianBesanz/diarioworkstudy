# Constitución del Diario de Estudio

1. **Stack mínimo**: solo `index.html`, `styles.css` y `app.js`. Sin dependencias ni build. *Se comprueba*: no existen `package.json` ni `node_modules`, y doble clic abre la web.
2. **La spec lo es el código**: `AGENTS.md` describe lo que el código hace hoy. Si discrepan, manda el código y se corrige el documento. *Se comprueba*: cada regla de `AGENTS.md` tiene su función en `app.js`.
3. **Lógica separada de la interfaz**: las funciones `calcular*` y las de fechas no tocan el DOM; `render()` es lo único que pinta. *Se comprueba*: `getElementById` solo aparece en la sección "Referencias al HTML".
4. **Tests sin instalar nada**: se comprueban con lo que ya está en la máquina: `node --test` (runner incluido en Node), `node -e`, navegador y DevTools. Prohibido npm, Jest y cualquier paquete. *Se comprueba*: no existe `package.json` ni `node_modules`.
5. **Los datos son del usuario**: viven solo en `localStorage` (clave `diario-sesiones`), nunca salen a la red, y todo cambio de formato conserva lo ya guardado. *Se comprueba*: cero peticiones de red y migraciones al cambiar el esquema.
6. **Español en todo**: textos de interfaz, identificadores y comentarios. *Se comprueba*: búsqueda de términos en inglés tipo `streak`, `date` o `session`.