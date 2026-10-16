# Plan de implementación — Mapa de calor

Este plan implementa `spec.md` sin escribir código todavía. No añade dependencias, build, servidor ni archivos runtime: la web seguirá funcionando con doble clic y los textos e identificadores nuevos estarán en español.

## 1. Archivos y responsabilidades

### `index.html` — modificar

- Añadir el selector de tipo del formulario: `Trabajo` / `Estudio`, con `Estudio` activo inicialmente. **Cubre RF-1 y RF-2.**
- Añadir la sección del mapa, su selector `Todo` / `Trabajo` / `Estudio`, encabezados de días, leyenda y resumen accesible. **Cubre RF-3, RF-5, RF-6 y RF-7.**
- Mantener los `id` existentes para no romper el formulario, las cifras ni la lista. **Cubre RF-9 y la compatibilidad de la v1.**
- Las celdas se generarán desde `app.js`, no se escribirán 13 × 7 celdas manualmente.

### `styles.css` — modificar

- Reutilizar los tokens actuales de `:root`, sin sombras, fuentes externas ni colores nuevos. **Cubre RF-6, RNF-2 y la constitución.**
- Definir la cuadrícula de 13 columnas × 7 filas, la escala de cinco estados (vacío + cuatro intensidades), el contorno de hoy y el estado futuro desactivado. **Cubre RF-3, RF-4 y RF-8.**
- Hacer que mapa y selectores quepan a 375 px sin scroll horizontal. **Cubre RNF-1.**
- Mantener foco visible, lectura por teclado y `prefers-reduced-motion`. **Cubre RF-7, RNF-5 y la constitución.**

### `app.js` — modificar

- Ampliar el objeto guardado con `tipo: "trabajo" | "estudio"`; las sesiones sin `tipo` se leen como `"estudio"` y no se reescriben automáticamente. **Cubre RF-1, RF-2 y RF-10.**
- Guardar la última elección del formulario en una preferencia separada de `localStorage`; el filtro del mapa será siempre `"todo"` al cargar y no se persistirá. **Cubre RF-1, RF-5 y RF-10.**
- Añadir las funciones puras descritas abajo. **Cubre RF-3 a RF-8.**
- Añadir referencias DOM y un renderizador del mapa; `render()` seguirá siendo el único lugar que pinta y las funciones de cálculo no tocarán el DOM. **Cubre RF-9 y el principio 3 de la constitución.**
- Actualizar `AGENTS.md` con las reglas permanentes del tipo y mapa, y `MEMORY.md` con las decisiones finales después de verificarlo. **Cubre el principio 2.**

### Tests temporales fuera del repositorio — crear durante la verificación y eliminar

- Un archivo temporal de Node para ejecutar `node --test` contra las funciones puras, sin `package.json`, `node_modules` ni dependencia instalada. No se añade un cuarto archivo permanente al proyecto. **Cubre RNF-4, criterios de finalización y principio 4.**

## 2. Funciones puras de lógica

Todas reciben `hoy` como argumento o una fecha de referencia derivada de él; no llaman a `new Date()` internamente, no leen `localStorage` y no tocan el DOM. Las fechas se manejan como `AAAA-MM-DD` local y se convierten con componentes numéricos, nunca con `new Date("AAAA-MM-DD")` ni UTC.

- `normalizarTipo(sesion)`: devuelve `"trabajo"` o `"estudio"`; la ausencia de tipo devuelve `"estudio"`; un tipo desconocido conserva un estado inválido para poder excluirlo de filtros específicos. **RF-2, RF-5.**
- `esMinutosValidos(minutos)`: acepta solo números finitos mayores que cero. **RF-4, RF-10, CA-19.**
- `obtenerLunes(hoy)`: devuelve el lunes de la semana local de `hoy`. **RF-3.**
- `restarDias(fecha, cantidad)` / `sumarDias(fecha, cantidad)`: usan `setDate(getDate() ± cantidad)` con componentes locales. **RF-3, RNF-2.**
- `crearDiasMapa(hoy)`: devuelve las 91 celdas de 13 semanas × 7 días, con fecha, si es futura, si es hoy y posición de columna/fila. **RF-3, RF-8.**
- `filtrarSesiones(sesiones, filtro)`: para `todo` incluye tipos válidos y desconocidos; para `trabajo` o `estudio` incluye solo el tipo correspondiente y trata las ausencias como estudio. **RF-2, RF-5.**
- `agruparMinutosPorDia(sesiones, hoy, filtro)`: suma minutos válidos por fecha, excluye futuras y registros inválidos, y devuelve un mapa fecha → minutos. **RF-4, RF-5.**
- `nivelIntensidad(minutos)`: devuelve `0`, `1`, `2`, `3` o `4` según `0`, `1–29`, `30–59`, `60–119`, `120+`. **RF-4, RF-6.**
- `construirDatosMapa(sesiones, hoy, filtro)`: combina las celdas, minutos, nivel, estado futuro, estado de hoy y tipo del filtro. **RF-3 a RF-8.**
- `calcularResumenMapa(celdas, filtro)`: suma minutos y cuenta días con minutos positivos del rango visible; si no hay resultados devuelve `0 minutos · 0 días`. **RF-7.**
- `formatearDetalleCelda(celda, filtro)`: devuelve el texto español de fecha, minutos y tipo; para futuras devuelve el estado desactivado. **RF-7.**

La lectura de `localStorage`, la validación del formulario y la persistencia quedan en la capa existente. `render()` pasa datos puros a la interfaz y registra eventos; no se mezclan cálculos con selectores DOM. **RF-1, RF-9, RF-10.**

## 3. Algoritmo del mapa en pseudocódigo

```text
función construirDatosMapa(sesiones, hoy, filtro):
    lunesActual = obtenerLunes(hoy)
    lunesInicial = restarDias(lunesActual, 12 * 7)
    celdas = lista vacía

    sesionesFiltradas = filtrarSesiones(sesiones, filtro)
    minutosPorDia = agruparMinutosPorDia(sesionesFiltradas, hoy, filtro)

    para columna desde 0 hasta 12:
        lunesColumna = sumarDias(lunesInicial, columna * 7)
        para fila desde 0 hasta 6:
            fecha = sumarDias(lunesColumna, fila)
            esFutura = fecha > hoy
            minutos = 0 si esFutura; si no, minutosPorDia[fecha] o 0
            celdas.agregar({
                fecha,
                columna,
                fila,
                minutos,
                nivel: "futuro" si esFutura; si no nivelIntensidad(minutos),
                esHoy: fecha == hoy,
                desactivada: esFutura
            })

    devolver celdas

función resumen(celdas):
    días = contar celdas con minutos > 0
    minutos = sumar sus minutos
    devolver "0 minutos · 0 días" si minutos == 0;
    si no, devolver minutos + " minutos · " + días + " días"
```

El rango incluye la semana actual aunque esté vacío. Las fechas futuras no se consideran huecos ni resultados. **RF-3, RF-4, RF-5, RF-7 y RF-8.**

## 4. Pintado de la interfaz

1. `render()` calcula las celdas y el resumen con filtro `todo`, conserva el selector del formulario y crea/actualiza el mapa. **RF-5, RF-9.**
2. Cada celda se pinta como un control enfocable con nombre accesible en español, `data-fecha`, nivel visual y estado `desactivada` cuando es futura. Las futuras no reciben interacción. **RF-3, RF-4, RF-7 y RF-8.**
3. La cuadrícula muestra columnas de la más antigua a la actual y filas de lunes a domingo; se incluyen etiquetas de contexto sin depender solo del color. **RF-3, RNF-1.**
4. El conmutador del mapa cambia el filtro, elimina el detalle anterior, recalcula celdas y muestra el resumen nuevo. **RF-5 y RF-7.**
5. El foco o hover de una celda no futura muestra su fecha, minutos y tipo en la línea de apoyo; al salir vuelve al resumen. El teclado tiene el mismo resultado que tocar. **RF-7.**
6. Hoy recibe un contorno independiente del nivel de intensidad. **RF-8.**
7. Guardar una sesión actualiza su `tipo`, persiste la sesión y llama al mismo `render()`; también actualiza las cifras actuales sin cambiar sus reglas existentes. **RF-1, RF-2 y RF-9.**

## 5. Decisiones técnicas y alternativas descartadas

- **13 columnas fijas:** permite comparar siempre el mismo periodo y evita controles adicionales. Se descarta un rango configurable porque añade estado, persistencia y complejidad innecesaria. **RF-3, RNF-1.**
- **Un color por intensidad y filtro por tipo:** mantiene la paleta y la legibilidad móvil. Se descartan dos paletas simultáneas o celdas partidas porque confunden el volumen y rompen la escala visual. **RF-5, RF-6.**
- **Compatibilidad por lectura, sin reescritura masiva:** las sesiones antiguas sin tipo se interpretan como estudio al calcularse. Se descarta migrar todo al abrir porque modifica datos del usuario sin necesidad. **RF-2, RF-10, principio 5.**
- **Preferencia del formulario separada del filtro del mapa:** registrar rápido y analizar no deben compartir estado accidentalmente. Se descarta persistir el filtro del mapa porque no es dato del usuario y la spec exige iniciar en Todo. **RF-1, RF-5.**
- **Lógica pura con `hoy` explícito:** permite probar cambios de mes, año, DST y fechas futuras de forma determinista. Se descarta que cada función llame a `new Date()` porque haría las pruebas frágiles y puede mezclar zonas horarias. **RF-3, principio 3 y skill `local-dates`.**
- **Controles DOM generados en `render()`:** evita duplicar 91 celdas en HTML. Se descarta insertar HTML con datos sin escapar; los textos derivados se asignarán como texto, no como HTML interpretado. **RF-7, RF-10.**
- **Sin servidor ni red:** mantiene el doble clic y protege los datos. Se descarta cualquier CDN, fuente externa, API o recurso remoto. **RNF-2 y principio 5.**

## 6. Estrategia de tests con `node --test`

El test temporal se ejecutará con el runner incluido en Node, sin instalar nada. Las funciones puras se probarán con un `hoy` fijo; no se probará la interfaz mediante una copia de la lógica.

### Casos de lógica

- Genera exactamente 13 columnas, 91 celdas, lunes como primera fila y domingo como última; la semana actual queda a la derecha. **RF-3.**
- Prueba lunes, domingo, cambio de mes, cambio de año, febrero bisiesto y ambos cambios de hora con `hoy` explícito. **RF-3, RNF-2.**
- Excluye los días futuros, los marca desactivados y no los cuenta en resumen. **RF-3, RF-7.**
- Suma varias sesiones del mismo día y verifica los cinco estados: 0, 1, 29, 30, 59, 60, 119 y 120 minutos. **RF-4.**
- Filtra `todo`, `trabajo` y `estudio`; prueba un día con ambos tipos. **RF-5.**
- Interpreta ausencia de tipo como estudio y excluye tipos desconocidos de filtros específicos. **RF-2, RF-5.**
- Ignora fechas inválidas, minutos cero, negativos, infinitos, `NaN`, texto y registros incompletos sin lanzar errores. **RF-4, RF-10.**
- Devuelve resumen `0 minutos · 0 días` sin resultados y el resumen correcto con resultados. **RF-7.**
- Marca solo hoy con `esHoy`, conserva el nivel de intensidad y no lo confunde con futuro. **RF-8.**

### Verificación manual posterior

- Abrir `index.html` con doble clic, registrar una sesión de trabajo y otra de estudio, cambiar ambos conmutadores y comprobar el mapa y el resumen. **RF-1, RF-5, RF-9.**
- Recargar y comprobar que sesiones, tipos y preferencia del formulario se conservan; comprobar que el filtro del mapa vuelve a Todo. **RF-1, RF-2, RF-5.**
- Navegar el mapa con teclado, tocar una celda en móvil y pasar el cursor en ordenador; comprobar nombres accesibles y futuros desactivados. **RF-7.**
- Comprobar 375 px sin scroll horizontal, consola sin errores y cero peticiones de red. **RNF-1, RNF-2.**

## 7. Cobertura de requisitos

- `index.html`: RF-1, RF-3, RF-5, RF-7.
- `styles.css`: RF-3, RF-4, RF-6, RF-7, RF-8, RNF-1, RNF-5.
- `app.js`: RF-1, RF-2, RF-3, RF-4, RF-5, RF-7, RF-8, RF-9, RF-10.
- Funciones puras y tests temporales: RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-10.
- Verificación manual: RF-1, RF-2, RF-5, RF-7, RF-9, RNF-1 y RNF-2.
