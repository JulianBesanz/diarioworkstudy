# Spec 001 — Mapa de calor de constancia

## Contexto y objetivo

El Diario ya sabe calcular rachas, minutos de la semana y días del mes, pero solo devuelve números: no se ve la historia. El usuario quiere "ver" su constancia como en GitHub: un mapa donde cada día es una celda y a más minutos, más intenso el color.

Objetivo: que en un vistazo se responda "¿estoy estudiando de forma regular o hace dos semanas que apago?" y que el mapa motive a no dejar huecos.

## Usuarios

- El propio usuario del Diario (persona que registra sesiones de estudio/trabajo y quiere constancia). Sin registro ni otros roles: es una herramienta personal.

## Historias de usuario

1. Como usuario, quiero ver las últimas semanas pintadas por minutos para detectar huecos de un vistazo.
2. Como usuario, quiero saber cuántos minutos hubo en un día concreto al pasar o tocar su celda, porque el color solo no me da la cifra.
3. Como usuario, quiero que el mapa se actualice al guardar una sesión, para ver mi constancia crecer al instante.

## Requisitos funcionales

**RF-1 — Cobertura temporal.** El mapa muestra las últimas 12 semanas completas más la semana en curso, en columnas de lunes a domingo (misma semana que "Minutos esta semana").
- CA-1: DADO QUE hay al menos una sesión, CUANDO el usuario abre la página, EL SISTEMA DEBE mostrar 12 o 13 columnas empezando en el lunes de la semana pasada hacia atrás, PARA que la semana en curso sea la última columna.
- CA-2: DADO QUE hoy es un día de la semana en curso, CUANDO se dibuja el mapa, EL SISTEMA DEBE pintar solo los días transcurridos de esa columna (de lunes a hoy), PARA que los días futuros no aparezcan como días sin estudiar.

**RF-2 — Intensidad por minutos.** El color de cada día representa la suma de los minutos de todas sus sesiones, en cuatro niveles: 1–29, 30–59, 60–119 y 120 o más.
- CA-3: DADO QUE un día tiene varias sesiones, CUANDO se calcula su color, EL SISTEMA DEBE sumar sus minutos (30 + 60 = nivel de 90 min), PARA que el color refleje el esfuerzo real del día.
- CA-4: DADO QUE un día tiene menos minutos que otro, CUANDO se comparan sus celdas, EL SISTEMA DEBE pintar la de menos minutos con un color menos intenso, PARA que la lectura visual sea ordenada.
- CA-5: DADO QUE un día no tiene ninguna sesión, CUANDO se dibuja, EL SISTEMA DEBE pintarlo con el color vacío de la paleta, PARA que un hueco se distinga de un día estudiado.

**RF-3 — Paleta coherente.** Los cuatro niveles usan la escala de tinta del diseño existente (más tinta, más minutos) y el color vacío es el mismo de los filetes actuales.
- CA-6: DADO QUE el Diario ya tiene una paleta propia, CUANDO se elige el color de un nivel, EL SISTEMA DEBE usar esa paleta sin introducir colores nuevos, PARA que el mapa no rompa la identidad del proyecto.

**RF-4 — Lectura del dato.** Bajo el mapa hay una línea de texto que muestra el dato: por defecto el total del rango visible; al pasar el cursor o tocar una celda, el día concreto ("14 oct · 45 min").
- CA-7: DADO QUE el usuario pasa el cursor o toca una celda, CUANDO se produce la interacción, EL SISTEMA DEBE mostrar en la línea de apoyo la fecha y los minutos de ese día, PARA que el dato exacto esté a un toque en móvil y a un hover en ordenador.
- CA-8: DADO QUE el usuario no ha interactuado con ninguna celda, CUANDO se muestra el mapa, EL SISTEMA DEBE mostrar el total de minutos y días del rango, PARA que la línea sirva de resumen cuando no se toca nada.
- CA-9: DADO QUE una celda representa un día, CUANDO se dibuja, EL SISTEMA DEBE darle un nombre accesible con su fecha y minutos, PARA que la información no dependa solo de la vista.

**RF-5 — Hoy visible.** La celda de hoy lleva un contorno visible.
- CA-10: DADO QUE hoy tiene sesión o no, CUANDO se dibuja el mapa, EL SISTEMA DEBE marcar la celda de hoy con un contorno, PARA que el usuario se oriente en el tiempo.

**RF-6 — Actualización en directo.** El mapa se recalcula al mismo tiempo que el resto de cifras, es decir, después de cada sesión guardada.
- CA-11: DADO QUE el usuario guarda una sesión, CUANDO termina de guardarse, EL SISTEMA DEBE repintar el mapa con el nuevo día, PARA que no haga falta recargar.

**RF-7 — Solo lectura.** El mapa no crea, modifica ni borra datos: se deriva siempre de las sesiones existentes.
- CA-12: DADO QUE el usuario usa el mapa, CUANDO haya interactuado con él, EL SISTEMA DEBE dejar el conjunto de sesiones idéntico al anterior, PARA que la herramienta de visualización nunca ponga en riesgo lo que el usuario ha escrito.
- CA-13: SI una sesión registrada no tiene fecha válida o minutos válidos, ENTONCES EL SISTEMA DEBE ignorarla en el mapa, PARA que un dato malo no rompa la pantalla.

## Requisitos no funcionales

- **RNF-1** El mapa se ve bien a 375 px de ancho sin scroll horizontal (12 semanas + hueco por celda ≈ 200 px).
- **RNF-2** Funciona con doble clic sobre el archivo, sin servidor ni instalación, y sin peticiones a la red.
- **RNF-3** Todos los textos en español.
- **RNF-4** Cálculo ligero: se hace con las sesiones ya cargadas, sin guardar resultados intermedios.
- **RNF-5** Respeta el `prefers-reduced-motion`: no hay animación de entrada.

## Casos límite

- Día con muchas sesiones: se suma (RF-2); el cuarto nivel absorbe lo que pase de 120 min.
- Día futuro (fecha ya elegida en el formulario): no se pinta (CA-2).
- Semana en curso vacía: la última columna aparece con todas sus celdas vacías.
- Primera semana de uso (pocas sesiones): el mapa se pinta igual; los niveles son fijos, no dependen del histórico.
- Sesión registrada a las 00:30: pertenece al día local, igual que en el resto del Diario.
- Datos corruptos o ausentes: mapa vacío, sin mensajes de error ni bloqueos.

## Fuera de alcance

- Meses anteriores a las 12 semanas, navegación por histórico o desplegable de rango.
- Distinguir trabajo y estudio por color (no existen tipos de sesión).
- Hacer clic en un día para filtrar la lista de sesiones.
- Guardar preferencias, exportar imágenes o compartir el mapa.
- Comparativas ("esta semana vs la anterior"), objetivos o recordatorios.

## Criterios de finalización

1. RF-1 a RF-7 cumplidos con sus criterios de aceptación.
2. Visible y sin scroll horizontal a 375 px; legible en ordenador.
3. Cero peticiones de red y cero datos nuevos guardados.
4. El comportamiento de rachas, semana y mes no cambia.
5. Verificado con las formas que ya usa el proyecto: navegador, DevTools y comprobaciones sueltas en Node.

## Dudas abiertas

- [NECESITA ACLARACIÓN] Umbrales exactos de los cuatro niveles (hoy 1–29 / 30–59 / 60–119 / ≥120): dependen de cuánto sueles estudiar; si sueles sesiones de 20 min, conviene bajarlos.
- [NECESITA ACLARACIÓN] Si algún día se añade el tipo de sesión (trabajo/estudio), ¿el mapa debe distinguirlos por color o seguir mostrando solo el total?
