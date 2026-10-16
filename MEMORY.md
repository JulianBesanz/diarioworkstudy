# MEMORY.md – Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- **`docs/constitution.md`** creado (6 principios innegociables, verificables) y referenciado en `AGENTS.md` › Reglas. `AGENTS.md` › Comandos manda `node --test` (runner de Node, sin paquetes).
- **`specs/001-heat-map/spec.md`** revisado como QA y decisiones cerradas: 13 columnas, futuros desactivados, niveles fijos, tipos de sesión y compatibilidad con sesiones antiguas. 10 RF con criterios EARS, sin dudas abiertas; pendiente de aprobación y plan, aún sin código.
- **`specs/001-heat-map/plan.md`** creado sin código: responsabilidades por archivo, funciones puras con `hoy`, algoritmo, UI, decisiones técnicas y tests con `node --test`; cubre RF-1 a RF-10.
- v1.3: registrar sesiones (fecha, tema, minutos), racha actual y lista de sesiones, **mejor racha** (🏆), **minutos de la semana** y **días estudiados este mes** (📅) en tarjeta propia bajo la racha.
- **Rediseño completo** (skill `frontend-design`): estilo bitácora de cuaderno — panel oscuro único para la racha, filetes en vez de tarjetas flotantes, cifras en Georgia, ámbar solo sobre oscuro, cero sombras.
- Datos en localStorage (clave `diario-sesiones`, nombres de campos en español: `fecha`, `tema`, `minutos`, `creado`).
- Reglas y arquitectura → `AGENTS.md` (fuente de verdad).
- **Git inicializado** (commit inicial con los 5 archivos del sitio + `.gitignore`). `.opencode/` está ignorada. La identidad git quedó configurada solo a nivel de este repo.
- Remoto `origin` = `https://github.com/JulianBesanz/diarioworkstudy.git`, rama `main` (en push se renombró de `master`).

## Decisiones (y por qué)
- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic.
- Fecha editable en el formulario: permite registrar días pasados y ver la racha crecer.
- Validación propia con mensajes en `#mensaje-error` en español, en vez de las burbujas nativas.
- `creado` (`Date.now()`) no se muestra: solo desempata el orden de la lista.
- Se descartó renombrar datos a `diario-estudio-sesiones` / `date, topic, minutes`; se mantiene el español.
- El `AGENTS.md` usa el texto del usuario + datos verificados contra el código.
- Mejor racha calculada al vuelo en cada `render()`, sin clave nueva en localStorage → sin migración ni riesgo de perder datos; si algún día hay que editar/borrar sesiones sin que el récord baje, ahí sí habría que persistirla.
- Las fechas futuras tampoco suman para la mejor racha (misma regla que la racha actual).
- Minutos de la semana: tarjeta propia (no en la de racha, para no estrecharla en móvil), semana **lunes–domingo**, solo minutos (`245 min`) por consistencia con la lista, etiqueta genérica "Minutos esta semana" (aún no distingue trabajo/estudio) y futuras fuera.
- Nunca `new Date("AAAA-MM-DD")` ni `toISOString()`: para el domingo se parte del lunes con `new Date(año, mes-1, día)` y `setDate(+6)`.
- Días del mes en la 2ª columna de la tarjeta de semana (no una cuarta tarjeta, para no alargar la interfaz); etiqueta literal "Días estudiados este mes" y mes natural local que se reinicia el día 1. Último día = `new Date(año, mes+1, 0)` (ojo: `new Date(año, mes, 0)` es el último del mes ANTERIOR).
- La skill `local-dates` vive en `.agents/skills/` y se carga con la herramienta `skill` antes de tocar fechas.
- Rediseño: los tokens del diseño (`--papel`, `--tinta`, `--ascua`, `--serif`…) están en `:root`; cualquier pantalla nueva debe reutilizarlos y meter su boldness en un solo sitio. Solo la racha va sobre fondo oscuro.
- Se añadió `<meta name="description">` (único fallo de Lighthouse SEO); los emojis van envueltos en `<span class="icono" aria-hidden="true">` para poder dimensionarlos sin tocar los `id` que usa el JS.

## Aprendizajes y errores a evitar
- `toISOString()` y `new Date("AAAA-MM-DD")` se evalúan en UTC y desplazan un día → usar `getFullYear/getMonth()+1/getDate` + `padStart`.
- Renombrar la clave de `localStorage` sin migración = perder las sesiones guardadas.
- Verificación manual en navegador + casos de racha con `node -e` (vacío, solo hoy, hoy+ayer, racha viva desde ayer, hueco).
- Para revisar el diseño sin servidor del proyecto: `browser.screenshot` exige ventana de escritorio visible (aquí no funcionó); en su lugar servir con un Node temporal y medir con `browser.evaluate` + un **iframe de 375 px** (las media queries responden al iframe, no a la ventana).
- `browser.evaluate` comparte el scope global con `app.js`: un `const hoy` en el script de prueba choca con la función `hoy()` → envolver siempre en IIFE.

## Próximos pasos
- Separar trabajo y estudio: tareas del día, jornadas, reuniones (pedido, aún no implementado).
- Esperar encargo explícito antes de añadir cualquier cosa (regla ⚠️ de `AGENTS.md`).
