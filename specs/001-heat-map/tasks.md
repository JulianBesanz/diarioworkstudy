# Tareas de implementación — Mapa de calor

> Ejecutar en orden. Cada tarea está pensada para durar como máximo 20–30 minutos.
> Escribir los tests antes del código de la tarea y ejecutar `node --test` tras cada bloque de lógica.

- [ ] **T1 — Preparar pruebas y normalización de datos**
  - Crear el archivo temporal de tests para `node --test` y cubrir `normalizarTipo()` y `esMinutosValidos()`.
  - Definir la compatibilidad: ausencia de `tipo` = `estudio`; `trabajo` y `estudio` son válidos; tipos desconocidos no son válidos para filtros específicos.
  - Implementar las funciones puras sin tocar el DOM ni `localStorage`.
  - **RF cubiertos:** RF-2, RF-4, RF-10.
  - **Hecho cuando:** `node --test` pasa los casos de tipos ausentes, válidos, desconocidos y minutos cero, negativos, infinitos, `NaN`, texto y positivos.

- [ ] **T2 — Añadir el tipo al formulario y guardar la preferencia**
  - Escribir primero tests manuales o automatizados para la elección inicial y la última elección.
  - Añadir el conmutador `Trabajo` / `Estudio` al formulario; iniciar en `Estudio` y guardar la preferencia en una clave separada.
  - Guardar `tipo` junto con cada sesión sin reescribir sesiones antiguas.
  - **RF cubiertos:** RF-1, RF-2, RF-10.
  - **Hecho cuando:** una sesión nueva guarda `tipo`, una sesión antigua sin tipo sigue cargando como estudio y la preferencia reaparece al recargar.

- [ ] **T3 — Crear utilidades puras de calendario**
  - Escribir tests con una fecha `hoy` fija para lunes, domingo, cambios de mes/año, febrero bisiesto y cambios de hora.
  - Implementar `obtenerLunes()`, `sumarDias()` y `restarDias()` usando fechas locales y `setDate()`.
  - **RF cubiertos:** RF-3.
  - **Hecho cuando:** `node --test` confirma fechas correctas sin `toISOString()`, `new Date("AAAA-MM-DD")` ni milisegundos de 24 horas.

- [ ] **T4 — Generar las 91 celdas del periodo**
  - Escribir tests para 13 columnas × 7 filas, orden antiguo → actual y semana actual a la derecha.
  - Implementar `crearDiasMapa(hoy)` con fecha, columna, fila, `esHoy`, `esFutura` y `desactivada`.
  - **RF cubiertos:** RF-3, RF-8.
  - **Hecho cuando:** `node --test` obtiene exactamente 91 celdas; la primera es lunes de hace 12 semanas y la última es domingo de la semana actual.

- [ ] **T5 — Filtrar sesiones y sumar minutos por día**
  - Escribir tests para `todo`, `trabajo` y `estudio`, incluyendo un día con ambos tipos y sesiones antiguas sin tipo.
  - Implementar `filtrarSesiones()` y `agruparMinutosPorDia()`; excluir fechas futuras, fechas inválidas y minutos inválidos.
  - **RF cubiertos:** RF-2, RF-4, RF-5, RF-10.
  - **Hecho cuando:** `node --test` demuestra que `todo` suma ambos tipos, cada filtro específico solo suma el suyo y los datos inválidos no rompen el cálculo.

- [ ] **T6 — Calcular niveles y datos completos del mapa**
  - Escribir tests para los límites exactos: 0, 1, 29, 30, 59, 60, 119 y 120 minutos.
  - Implementar `nivelIntensidad()` y `construirDatosMapa()` combinando celdas, minutos, niveles, futuro y hoy.
  - **RF cubiertos:** RF-3, RF-4, RF-5, RF-6, RF-8.
  - **Hecho cuando:** cada límite devuelve el nivel esperado y los futuros quedan desactivados con cero minutos.

- [ ] **T7 — Calcular resumen y detalle accesible**
  - Escribir tests para resumen vacío, resumen con minutos/días y detalle de una celda normal o futura.
  - Implementar `calcularResumenMapa()` y `formatearDetalleCelda()` en español.
  - **RF cubiertos:** RF-7.
  - **Hecho cuando:** el resumen vacío devuelve `0 minutos · 0 días` y cada detalle incluye fecha, minutos y tipo; las futuras indican que están desactivadas.

- [ ] **T8 — Añadir la estructura HTML del mapa**
  - Añadir la sección del mapa, el conmutador `Todo` / `Trabajo` / `Estudio`, encabezados de días, leyenda y línea de resumen.
  - Mantener todos los `id` existentes del formulario, cifras y lista.
  - **RF cubiertos:** RF-3, RF-5, RF-6, RF-7.
  - **Hecho cuando:** el documento contiene los controles en español y el formulario/lista actuales siguen teniendo sus referencias originales.

- [ ] **T9 — Pintar el mapa desde `render()`**
  - Generar las celdas desde `app.js` con nodos y `textContent`, nunca con HTML derivado de datos.
  - Aplicar clases de nivel, estado futuro y contorno de hoy; pintar el resumen inicial con `todo`.
  - **RF cubiertos:** RF-3, RF-4, RF-6, RF-7, RF-8, RF-9.
  - **Hecho cuando:** al abrir la página se ven 13 columnas, 7 filas por columna, niveles correctos, hoy marcado y futuros desactivados.

- [ ] **T10 — Conectar interacción, filtros y actualización**
  - Conectar el conmutador del mapa para repintar y resetear el detalle al cambiar de filtro.
  - Añadir foco, hover y toque para mostrar el detalle; al salir, restaurar el resumen.
  - Integrar el render del mapa después de guardar una sesión.
  - **RF cubiertos:** RF-5, RF-7, RF-9, RF-10.
  - **Hecho cuando:** cambiar de filtro, enfocar/tocar una celda y guardar una sesión actualizan el mapa sin modificar sesiones existentes.

- [ ] **T11 — Estilos, accesibilidad y responsive**
  - Reutilizar los tokens existentes, sin sombras, colores externos ni fuentes externas.
  - Estilizar cuadrícula, cinco estados, futuro, hoy, foco visible, leyenda y ambos conmutadores.
  - Adaptar todo a 375 px y respetar `prefers-reduced-motion`.
  - **RF cubiertos:** RF-6, RF-7, RF-8; **RNF cubiertos:** RNF-1, RNF-2, RNF-3, RNF-5.
  - **Hecho cuando:** a 375 px no existe scroll horizontal, el mapa es legible y se puede usar con teclado sin depender del color.

- [ ] **T12 — Verificación final y documentación**
  - Ejecutar `node --test`, abrir `index.html` con doble clic y revisar consola, red y DevTools.
  - Comprobar persistencia, sesiones antiguas sin tipo, filtros, teclado, toque, futuras y cambios de fecha.
  - Actualizar `AGENTS.md` con las reglas permanentes y `MEMORY.md` con decisiones y pruebas realizadas; eliminar el test temporal si no forma parte del repositorio.
  - **RF cubiertos:** RF-1 a RF-10; **RNF cubiertos:** RNF-1 a RNF-5.
  - **Hecho cuando:** todos los tests pasan, la verificación manual no encuentra errores, la constitución se respeta y todas las tareas anteriores están marcadas.
