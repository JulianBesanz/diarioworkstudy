// ---------- Guardado en localStorage ----------
const CLAVE = "diario-sesiones";

function cargarSesiones() {
  try {
    const datos = localStorage.getItem(CLAVE);
    const lista = datos ? JSON.parse(datos) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

function guardarSesiones(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

let sesiones = cargarSesiones();

// ---------- Fechas en hora local (nunca UTC) ----------
// Devuelve "AAAA-MM-DD" usando la fecha local del usuario.
function fechaLocal(date) {
  const anio = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return anio + "-" + mes + "-" + dia;
}

function hoy() {
  return fechaLocal(new Date());
}

function ayer() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - 1);
  return fechaLocal(fecha);
}

function restarUnDia(cadenaFecha) {
  const partes = cadenaFecha.split("-");
  const fecha = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );
  fecha.setDate(fecha.getDate() - 1);
  return fechaLocal(fecha);
}

function sumarUnDia(cadenaFecha) {
  const partes = cadenaFecha.split("-");
  const fecha = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );
  fecha.setDate(fecha.getDate() + 1);
  return fechaLocal(fecha);
}

function formatearFecha(cadenaFecha) {
  const partes = cadenaFecha.split("-");
  const fecha = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ---------- Racha ----------
function calcularRacha() {
  const diasConSesion = new Set(sesiones.map((s) => s.fecha));

  // Si hoy todavía no hay sesión pero sí la de ayer, la racha sigue viva.
  let diaActual = hoy();
  if (!diasConSesion.has(diaActual)) {
    if (diasConSesion.has(ayer())) {
      diaActual = ayer();
    } else {
      return 0;
    }
  }

  let racha = 0;
  while (diasConSesion.has(diaActual)) {
    racha++;
    diaActual = restarUnDia(diaActual);
  }
  return racha;
}

// Mejor racha: mayor número de días consecutivos con sesión de todo el
// histórico. Se recálcula siempre, sin guardarlo. Las fechas futuras no suman.
function calcularMejorRacha() {
  const diasConSesion = new Set();

  sesiones.forEach((sesion) => {
    if (!sesion.fecha) return; // ignorar registros sin fecha
    if (sesion.fecha > hoy()) return; // fechas futuras no suman
    diasConSesion.add(sesion.fecha);
  });

  const diasOrdenados = Array.from(diasConSesion).sort();
  if (diasOrdenados.length === 0) return 0;

  let mejor = 1;
  let enCurso = 1;

  for (let i = 1; i < diasOrdenados.length; i++) {
    if (diasOrdenados[i] === sumarUnDia(diasOrdenados[i - 1])) {
      enCurso++;
    } else {
      enCurso = 1;
    }
    if (enCurso > mejor) {
      mejor = enCurso;
    }
  }
  return mejor;
}

// Minutos de la semana: de lunes a domingo, en fecha local.
// Se recálcula siempre, sin guardarlo. Las fechas futuras no suman.
function lunesDeEstaSemana() {
  const fecha = new Date();
  const diaSemana = fecha.getDay(); // 0 = domingo, 1 = lunes, ...
  const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
  fecha.setDate(fecha.getDate() - diasHastaLunes);
  return fechaLocal(fecha);
}

function calcularMinutosSemana() {
  const lunes = lunesDeEstaSemana();

  // Domingo = lunes + 6 días (nunca new Date("AAAA-MM-DD"): eso es UTC)
  const partes = lunes.split("-");
  const fechaDomingo = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );
  fechaDomingo.setDate(fechaDomingo.getDate() + 6);
  const domingo = fechaLocal(fechaDomingo);

  let total = 0;
  sesiones.forEach((sesion) => {
    if (!sesion.fecha) return; // ignorar registros sin fecha
    if (sesion.fecha > hoy()) return; // fechas futuras no suman
    if (sesion.fecha < lunes || sesion.fecha > domingo) return;
    if (!Number.isFinite(sesion.minutos) || sesion.minutos <= 0) return;
    total += sesion.minutos;
  });
  return { total: total, lunes: lunes, domingo: domingo };
}

function formatearDiaMes(cadenaFecha) {
  const partes = cadenaFecha.split("-");
  const fecha = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

// ---------- Referencias al HTML ----------
const formulario = document.getElementById("formulario-sesion");
const campoFecha = document.getElementById("fecha");
const campoTema = document.getElementById("tema");
const campoMinutos = document.getElementById("minutos");
const mensajeError = document.getElementById("mensaje-error");
const listaElemento = document.getElementById("lista-sesiones");
const mensajeVacio = document.getElementById("mensaje-vacio");
const totalElemento = document.getElementById("total-sesiones");
const rachaElemento = document.getElementById("valor-racha");
const mensajeRacha = document.getElementById("mensaje-racha");
const mejorElemento = document.getElementById("valor-mejor");
const mensajeMejor = document.getElementById("mensaje-mejor");
const minutosSemanaElemento = document.getElementById("valor-minutos-semana");
const rangoSemanaElemento = document.getElementById("rango-semana");

// ---------- Render ----------
function render() {
  // Racha
  const racha = calcularRacha();
  rachaElemento.textContent = racha;

  if (racha > 0) {
    mensajeRacha.textContent =
      racha === 1 ? "¡Buen comienzo, sigue así!" : "¡Sigue así, no la pierdas!";
  } else {
    mensajeRacha.textContent = "Hoy puedes empezar una nueva racha";
  }

  // Mejor racha
  const mejor = calcularMejorRacha();
  mejorElemento.textContent = mejor;

  if (mejor > 0) {
    mensajeMejor.textContent =
      mejor === 1 ? "Tu mejor hasta ahora" : "¡Récord a superar!";
  } else {
    mensajeMejor.textContent = "Todavía no hay una racha guardada";
  }

  // Minutos de la semana
  const semana = calcularMinutosSemana();
  minutosSemanaElemento.textContent = semana.total;
  rangoSemanaElemento.textContent =
    "De " +
    formatearDiaMes(semana.lunes) +
    " a " +
    formatearDiaMes(semana.domingo);

  // Lista ordenada de la más reciente a la más antigua
  const ordenadas = sesiones.slice().sort((a, b) => {
    if (a.fecha === b.fecha) return b.creado - a.creado;
    return a.fecha < b.fecha ? 1 : -1;
  });

  listaElemento.innerHTML = "";
  ordenadas.forEach((sesion) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "info";

    const tema = document.createElement("div");
    tema.className = "tema";
    tema.textContent = sesion.tema;

    const fecha = document.createElement("div");
    fecha.className = "fecha";
    fecha.textContent = formatearFecha(sesion.fecha);

    info.appendChild(tema);
    info.appendChild(fecha);

    const minutos = document.createElement("span");
    minutos.className = "minutos";
    minutos.textContent = sesion.minutos + " min";

    li.appendChild(info);
    li.appendChild(minutos);
    listaElemento.appendChild(li);
  });

  // Total y mensaje vacío
  const total = sesiones.length;
  totalElemento.textContent = total === 1 ? "1 sesión" : total + " sesiones";
  mensajeVacio.hidden = total > 0;
}

// ---------- Eventos ----------
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeError.hidden = true;

  const fecha = campoFecha.value;
  const tema = campoTema.value.trim();
  const minutos = Number(campoMinutos.value);

  if (!fecha) {
    mostrarError("Selecciona una fecha.");
    return;
  }
  if (tema === "") {
    mostrarError("El tema es obligatorio.");
    return;
  }
  if (!Number.isFinite(minutos) || minutos <= 0) {
    mostrarError("Los minutos deben ser un número mayor que 0.");
    return;
  }

  sesiones.push({
    fecha: fecha,
    tema: tema,
    minutos: minutos,
    creado: Date.now(),
  });
  guardarSesiones(sesiones);

  // Reiniciar el formulario para la siguiente sesión
  campoFecha.value = hoy();
  campoTema.value = "";
  campoMinutos.value = "";

  render();
  campoTema.focus();
});

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.hidden = false;
}

// ---------- Inicio ----------
campoFecha.value = hoy();
render();
