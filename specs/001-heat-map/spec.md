# Spec 001 — Mapa de calor de constancia

## Contexto y objetivo

El Diario ya sabe calcular rachas, minutos de la semana y días del mes, pero solo devuelve números: no se ve la historia. El usuario quiere "ver" su constancia como en GitHub: un mapa donde cada día es una celda y a más minutos, más intenso el color del día.

Además, cada sesión ahora puede ser de **trabajo** o de **estudio**: el usuario lo elige al registrarla y quiere distinguir ambas cosas también en el mapa.

Objetivo: que en un vistazo se responda "¿estoy estudiando de forma regular o hace dos semanas que apago?" y que el mapa motive a no dejar huecos, ya sea en el trabajo o en el estudio.

## Usuarios

- El propio usuario del Diario (persona que registra sesiones de trabajo o estudio y quiere constancia). Sin registro ni otros roles: es una herramienta personal.

## Historias de usuario

1. Como usuario, quiero marcar si una sesión es de trabajo o de estudio al registrarla, para que el Diario sepa en qué gasto el tiempo.
2. Como usuario, quiero ver las últimas semanas pintadas por minutos para detectar huecos de un vistazo.
3. Como usuario, quiero cambiar el mapa entre "todo, trabajo o estudio", para mirar cada por separado sin perder la visión general.
4. Como usuario, quiero saber cuántos minutos hubo en un día concreto al pasar o tocar su celda, porque el color solo no me da la cifra.
5. Como usuario, quiero que el mapa y las cifras se actualicen al guardar una sesión, para ver mi constancia crecer al instante.

## Requisitos funcionales

**RF-1 — Tipo de sesión en el formulario.** El formulario incluye un conmutador de dos opciones (trabajo / estudio) con una siempre activa; no se puede guardar una sesión sin elegir tipo. El conmutador recuerda la última elección del usuario; si no hay nada guardado, empieza en "estudio".
- CA-1: DADO QUE el usuario abre el Diario, CUANDO ve el formulario, EL SISTEMA DEBE mostrar el conmutador con la última elección activa (o "estudio" la primera vez), PARA que registrar sea rápido y sin decisiones repetidas.
- CA-2: DADO QUE el usuario guarda una sesión, CUANDO se guarda, EL SISTEMA DEBE añadirle el tipo elegido, PARA que luego se pueda distinguir en el mapa.
- CA-3: SI el usuario intenta guardar sin tipo elegido (solo posible por un error del navegador), ENTONCES EL SISTEMA DEBE impedirlo y avisar en español, PARA que nunca exista una sesión sin tipo.

**RF-2 — Compatibilidad con lo ya guardado.** Las sesiones antiguas, que no tienen tipo, se tratan como de estudio.
- CA-4: DADO QUE existen sesiones registradas antes de esta funcionalidad, CUANDO se calcula cualquier cifra, EL SISTEMA DEBE considerarlas de estudio sin pedir nada al usuario, PARA que nadie pierda datos ni tenga que re-registrar nada.

**RF-3 — Cobertura temporal del mapa.** El mapa muestra las últimas 12 semanas completas más la semana en curso, en columnas de lunes a domingo (misma semana que "Minutos esta semana").
- CA-5: DADO QUE hay al menos una sesión, CUANDO el usuario abre la página, EL SISTEMA DEBE mostrar 12 o 13 columnas empezando en el lunes de la semana pasada hacia atrás, PARA que la semana en curso sea la última columna.
- CA-6: DADO QUE hoy es un día de la semana en curso, CUANDO se dibuja el mapa, EL SISTEMA DEBE pintar solo los días transcurridos de esa columna (de lunes a hoy), PARA que los días futuros no aparezcan como días sin estudiar.

**RF-4 — Intensidad por minutos.** El color de cada día representa la suma de los minutos de todas sus sesiones del tipo mostrado, en cuatro niveles: 1–29, 30–59, 60–119 y 120 o más.
- CA-7: DADO QUE un día tiene varias sesiones del tipo mostrado, CUANDO se calcula su color, EL SISTEMA DEBE sumar sus minutos (30 + 60 = nivel de 90 min), PARA que el color refleje el esfuerzo real del día.
- CA-8: DADO QUE un día tiene menos minutos que otro, CUANDO se comparan sus celdas, EL SISTEMA DEBE pintar la de menos minutos con un color menos intenso, PARA que la lectura visual sea ordenada.
- CA-9: DADO QUE un día no tiene ninguna sesión del tipo mostrado, CUANDO se dibuja, EL SISTEMA DEBE pintarlo con el color vacío de la paleta, PARA que un hueco se distinga de un día estudiado.

**RF-5 — Conmutador del mapa.** Sobre el mapa hay un conmutador de tres opciones: todo / trabajo / estudio. Filtra qué sesiones suma; por defecto está en "todo".
- CA-10: DADO QUE el usuario cambia el conmutador, CUANDO se selecciona una opción, EL SISTEMA DEBE repintar el mapa y recalcular la línea de apoyo solo con ese tipo, PARA que "todo" y "trabajo" cuenten cosas distintas.
- CA-11: DADO QUE el mapa está en "todo", CUANDO se pinta un día con sesiones de ambos tipos, EL SISTEMA DEBE sumarlas, PARA que la visión general no oculte nada.

**RF-6 — Paleta coherente.** Los cuatro niveles usan la escala de tinta del diseño existente (más tinta, más minutos) y el color vacío es el mismo de los filetes actuales. El tipo no cambia el color: lo distingue el conmutador, no la paleta.
- CA-12: DADO QUE el Diario ya tiene una paleta propia, CUANDO se elige el color de un nivel, EL SISTEMA DEBE usar esa paleta sin introducir colores nuevos, PARA que el mapa no rompa la identidad del proyecto.

**RF-7 — Lectura del dato.** Bajo el mapa hay una línea de texto que muestra el dato del tipo seleccionado: por defecto el total del rango visible; al pasar el cursor o tocar una celda, el día concreto ("14 oct · 45 min").
- CA-13: DADO QUE el usuario pasa el cursor o toca una celda, CUANDO se produce la interacción, EL SISTEMA DEBE mostrar en la línea de apoyo la fecha y los minutos de ese día para el tipo seleccionado, PARA que el dato exacto esté a un toque en móvil y a un hover en ordenador.
- CA-14: DADO QUE el usuario no ha interactuado con ninguna celda, CUANDO se muestra el mapa, EL SISTEMA DEBE mostrar el total de minutos y días del rango y tipo seleccionados, PARA que la línea sirva de resumen cuando no se toca nada.
- CA-15: DADO QUE una celda representa un día, CUANDO se dibuja, EL SISTEMA DEBE darle un nombre accesible con su fecha, minutos y tipo, PARA que la información no dependa solo de la vista.

**RF-8 — Hoy visible.** La celda de hoy lleva un contorno visible.
- CA-16: DADO QUE hoy tiene sesión o no, CUANDO se dibuja el mapa, EL SISTEMA DEBE marcar la celda de hoy con un contorno, PARA que el usuario se oriente en el tiempo.

**RF-9 — Actualización en directo.** El mapa y las cifras se recalculan después de cada sesión guardada.
- CA-17: DADO QUE el usuario guarda una sesión, CUANDO termina de guardarse, EL SISTEMA DEBE repintar el mapa con el nuevo día, PARA que no haga falta recargar.

**RF-10 — Solo lectura.** El mapa no crea, modifica ni borra sesiones: se deriva siempre de las existentes. La única excepción es recordar el tipo elegido en el formulario.
- CA-18: DADO QUE el usuario usa el mapa, CUANDO haya interactuado con él, EL SISTEMA DEBE dejar las sesiones idénticas a las anteriores, PARA que la herramienta de visualización nunca ponga en riesgo lo que el usuario ha escrito.
- CA-19: SI una sesión registrada no tiene fecha válida o minutos válidos, ENTONCES EL SISTEMA DEBE ignorarla en el mapa, PARA que un dato malo no rompa la pantalla.

## Requisitos no funcionales

- **RNF-1** El mapa se ve bien a 375 px de ancho sin scroll horizontal (12 semanas + hueco por celda ≈ 200 px); ambos conmutadores se adaptan a esa anchura.
- **RNF-2** Funciona con doble clic sobre el archivo, sin servidor ni instalación, y sin peticiones a la red.
- **RNF-3** Todos los textos en español: "Trabajo", "Estudio", "Todo".
- **RNF-4** Cálculo ligero: se hace con las sesiones ya cargadas, sin guardar resultados intermedios. La única escritura nueva es el tipo elegido en el formulario.
- **RNF-5** Respeta el `prefers-reduced-motion`: no hay animación de entrada.

## Casos límite

- Día con muchas sesiones del tipo mostrado: se suma (RF-4); el cuarto nivel absorbe lo que pase de 120 min.
- Día con trabajo por la mañana y estudio por la tarde: en "todo" suma ambos; en cada filtro muestra solo su parte.
- Día futuro (fecha ya elegida en el formulario): no se pinta (CA-6).
- Semana en curso vacía: la última columna aparece con todas sus celdas vacías.
- Sesiones antiguas sin tipo: cuentan como estudio en todos los filtros (CA-4).
- Primera semana de uso (pocas sesiones): el mapa se pinta igual; los niveles son fijos, no dependen del histórico.
- Sesión registrada a las 00:30: pertenece al día local, igual que en el resto del Diario.
- Datos corruptos o ausentes: mapa vacío, sin mensajes de error ni bloqueos.

## Fuera de alcance

- Meses anteriores a las 12 semanas, navegación por histórico o desplegable de rango.
- Que racha, minutos de la semana y días del mes se separen por tipo: siguen contando todo, igual que hoy.
- Hacer clic en un día para filtrar la lista de sesiones.
- Editar o borrar el tipo de una sesión ya guardada.
- Exportar el mapa, objetivos, recordatorios o comparativas.

## Criterios de finalización

1. RF-1 a RF-10 cumplidos con sus criterios de aceptación.
2. Visible y sin scroll horizontal a 375 px; legible en ordenador.
3. Sesiones antiguas sin tipo visibles y contadas como estudio.
4. Cero peticiones de red; como escritura nueva, solo el tipo elegido en el formulario.
5. El comportamiento de rachas, semana y mes no cambia.
6. Verificado con las formas que ya usa el proyecto: navegador, DevTools y comprobaciones sueltas en Node.

## Dudas abiertas

- [NECESITA ACLARACIÓN] Umbrales exactos de los cuatro niveles (hoy 1–29 / 30–59 / 60–119 / ≥120): dependen de cuánto sueles estudiar; si sueles sesiones de 20 min, conviene bajarlos.
