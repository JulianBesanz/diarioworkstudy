# MEMORY.md – Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- v1.3: registrar sesiones (fecha, tema, minutos), racha actual y lista de sesiones, **mejor racha** (🏆), **minutos de la semana** y **días estudiados este mes** (📅) en tarjeta propia bajo la racha.
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

## Aprendizajes y errores a evitar
- `toISOString()` y `new Date("AAAA-MM-DD")` se evalúan en UTC y desplazan un día → usar `getFullYear/getMonth()+1/getDate` + `padStart`.
- Renombrar la clave de `localStorage` sin migración = perder las sesiones guardadas.
- Verificación manual en navegador + casos de racha con `node -e` (vacío, solo hoy, hoy+ayer, racha viva desde ayer, hueco).

## Próximos pasos
- Separar trabajo y estudio: tareas del día, jornadas, reuniones (pedido, aún no implementado).
- Esperar encargo explícito antes de añadir cualquier cosa (regla ⚠️ de `AGENTS.md`).
