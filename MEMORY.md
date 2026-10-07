# MEMORY.md – Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- v1.2: registrar sesiones (fecha, tema, minutos), racha actual y lista de sesiones, **mejor racha** (🏆) junto a la actual y **minutos de la semana** en tarjeta propia.
- Datos en localStorage (clave `diario-sesiones`, nombres de campos en español: `fecha`, `tema`, `minutos`, `creado`).
- Reglas y arquitectura → `AGENTS.md` (fuente de verdad).
- **Git inicializado** (commit inicial con los 5 archivos del sitio + `.gitignore`). `.opencode/` está ignorada. La identidad git quedó configurada solo a nivel de este repo.

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

## Aprendizajes y errores a evitar
- `toISOString()` y `new Date("AAAA-MM-DD")` se evalúan en UTC y desplazan un día → usar `getFullYear/getMonth()+1/getDate` + `padStart`.
- Renombrar la clave de `localStorage` sin migración = perder las sesiones guardadas.
- Verificación manual en navegador + casos de racha con `node -e` (vacío, solo hoy, hoy+ayer, racha viva desde ayer, hueco).

## Próximos pasos
- Separar trabajo y estudio: tareas del día, jornadas, reuniones (pedido, aún no implementado).
- Esperar encargo explícito antes de añadir cualquier cosa (regla ⚠️ de `AGENTS.md`).
