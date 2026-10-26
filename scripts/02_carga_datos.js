// =====================================================================
// 02_carga_datos.js  -  Datos de prueba (TODOS FICTICIOS)
// 6 pacientes, 7 hospitalizaciones. Ejecutar: mongosh --file 02_carga_datos.js
// =====================================================================
const hce = db.getSiblingDB("hce_hospitalizacion");
const D = (s) => new Date(s + "Z");   // fechas UTC ISO

// ---------- Catalogos ----------
hce.catalogo_cie10.insertMany([
  { _id: "J18.9", descripcion: "Neumonia, no especificada", capitulo: "Respiratorio" },
  { _id: "J44.1", descripcion: "EPOC con exacerbacion aguda", capitulo: "Respiratorio" },
  { _id: "E11.9", descripcion: "Diabetes mellitus tipo 2 sin complicaciones", capitulo: "Endocrino" },
  { _id: "E11.1", descripcion: "Diabetes mellitus tipo 2 con cetoacidosis", capitulo: "Endocrino" },
  { _id: "I10",   descripcion: "Hipertension esencial (primaria)", capitulo: "Circulatorio" },
  { _id: "I21.9", descripcion: "Infarto agudo de miocardio, sin otra especificacion", capitulo: "Circulatorio" },
  { _id: "A09",   descripcion: "Diarrea y gastroenteritis de presunto origen infeccioso", capitulo: "Infecciosas" },
  { _id: "N39.0", descripcion: "Infeccion de vias urinarias, sitio no especificado", capitulo: "Genitourinario" },
  { _id: "K35.8", descripcion: "Apendicitis aguda, otra y la no especificada", capitulo: "Digestivo" },
  { _id: "A90",   descripcion: "Dengue clasico", capitulo: "Infecciosas" }
]);

hce.catalogo_medicamentos.insertMany([
  { _id: "MED-001", nombre_generico: "Ceftriaxona",   atc: "J01DD04", forma: "Polvo inyectable", concentracion: "1 g" },
  { _id: "MED-002", nombre_generico: "Azitromicina",  atc: "J01FA10", forma: "Tableta",          concentracion: "500 mg" },
  { _id: "MED-003", nombre_generico: "Salbutamol",    atc: "R03AC02", forma: "Inhalador",        concentracion: "100 mcg/dosis" },
  { _id: "MED-004", nombre_generico: "Prednisolona",  atc: "H02AB06", forma: "Tableta",          concentracion: "50 mg" },
  { _id: "MED-005", nombre_generico: "Insulina cristalina", atc: "A10AB01", forma: "Solucion inyectable", concentracion: "100 UI/mL" },
  { _id: "MED-006", nombre_generico: "Enoxaparina",   atc: "B01AB05", forma: "Jeringa prellenada", concentracion: "40 mg" },
  { _id: "MED-007", nombre_generico: "Acido acetilsalicilico", atc: "B01AC06", forma: "Tableta", concentracion: "100 mg" },
  { _id: "MED-008", nombre_generico: "Losartan",      atc: "C09CA01", forma: "Tableta",          concentracion: "50 mg" },
  { _id: "MED-009", nombre_generico: "Suero oral / Lactato de Ringer", atc: "B05BB01", forma: "Solucion IV", concentracion: "1000 mL" },
  { _id: "MED-010", nombre_generico: "Acetaminofen",  atc: "N02BE01", forma: "Tableta",          concentracion: "500 mg" },
  { _id: "MED-011", nombre_generico: "Ciprofloxacino",atc: "J01MA02", forma: "Tableta",          concentracion: "500 mg" },
  { _id: "MED-012", nombre_generico: "Metformina",    atc: "A10BA02", forma: "Tableta",          concentracion: "850 mg" }
]);

// ---------- Profesionales ----------
hce.profesionales.insertMany([
  { _id: "PRO-001", nombre: "Dra. Marcela Restrepo Vélez",  rol: "MEDICO",       especialidad: "Medicina Interna", registro_medico: "RM-05-11872" },
  { _id: "PRO-002", nombre: "Dr. Andrés Giraldo Mejía",     rol: "MEDICO",       especialidad: "Medicina Interna", registro_medico: "RM-05-20931" },
  { _id: "PRO-003", nombre: "Dra. Juliana Ospina Cano",     rol: "ESPECIALISTA", especialidad: "Pediatría",        registro_medico: "RM-05-30415" },
  { _id: "PRO-004", nombre: "Dr. Camilo Zapata Ruiz",       rol: "ESPECIALISTA", especialidad: "Cirugía General",  registro_medico: "RM-05-17764" },
  { _id: "ENF-001", nombre: "Enf. Luz Dary Henao",          rol: "ENFERMERIA",   especialidad: "Enfermería",       registro_medico: "RE-05-4410" },
  { _id: "ENF-002", nombre: "Enf. Carlos Mario Quintero",   rol: "ENFERMERIA",   especialidad: "Enfermería",       registro_medico: "RE-05-5122" }
]);

// ---------- Pacientes ----------
hce.pacientes.insertMany([
  { _id: "PAC-001", tipo_documento: "CC", documento: "1017000001", nombres: "Gloria Inés", apellidos: "Ramírez Toro",
    fecha_nacimiento: D("1958-03-14T00:00:00"), sexo: "F", grupo_sanguineo: "O+",
    contacto: { municipio: "Medellín", telefono: "3001110001" },
    aseguramiento: { eps: "Savia Salud", regimen: "SUBSIDIADO" },
    alergias: ["Penicilina"], antecedentes: ["Hipertensión arterial", "Diabetes mellitus tipo 2"] },
  { _id: "PAC-002", tipo_documento: "CC", documento: "70050002", nombres: "Jorge Eliécer", apellidos: "Muñoz Pérez",
    fecha_nacimiento: D("1951-11-02T00:00:00"), sexo: "M", grupo_sanguineo: "A+",
    contacto: { municipio: "Bello", telefono: "3002220002" },
    aseguramiento: { eps: "Sura", regimen: "CONTRIBUTIVO" },
    alergias: [], antecedentes: ["EPOC", "Tabaquismo (40 paquetes-año)"] },
  { _id: "PAC-003", tipo_documento: "TI", documento: "1020000003", nombres: "Sara Valentina", apellidos: "Cardona Londoño",
    fecha_nacimiento: D("2012-07-21T00:00:00"), sexo: "F", grupo_sanguineo: "B+",
    contacto: { municipio: "Itagüí", telefono: "3003330003", acudiente: { nombre: "Paola Londoño", parentesco: "Madre" } },
    aseguramiento: { eps: "Savia Salud", regimen: "SUBSIDIADO" },
    alergias: [], antecedentes: [] },
  { _id: "PAC-004", tipo_documento: "CC", documento: "98040004", nombres: "Luis Fernando", apellidos: "Arango Salazar",
    fecha_nacimiento: D("1969-05-30T00:00:00"), sexo: "M", grupo_sanguineo: "O-",
    contacto: { municipio: "Envigado", telefono: "3004440004" },
    aseguramiento: { eps: "Sanitas", regimen: "CONTRIBUTIVO" },
    alergias: ["AINEs"], antecedentes: ["Dislipidemia", "Hipertensión arterial"] },
  { _id: "PAC-005", tipo_documento: "CC", documento: "43050005", nombres: "María Camila", apellidos: "Echeverri Gómez",
    fecha_nacimiento: D("1996-09-09T00:00:00"), sexo: "F", grupo_sanguineo: "A-",
    contacto: { municipio: "Rionegro", telefono: "3005550005" },
    aseguramiento: { eps: "Coosalud", regimen: "SUBSIDIADO" },
    alergias: [], antecedentes: ["Cesárea previa"] },
  { _id: "PAC-006", tipo_documento: "CC", documento: "15060006", nombres: "Héctor Darío", apellidos: "Jaramillo Builes",
    fecha_nacimiento: D("1975-01-25T00:00:00"), sexo: "M", grupo_sanguineo: "AB+",
    contacto: { municipio: "Apartadó", telefono: "3006660006" },
    aseguramiento: { eps: "Nueva EPS", regimen: "CONTRIBUTIVO" },
    alergias: ["Sulfas"], antecedentes: ["Diabetes mellitus tipo 2"] }
]);

// ---------- Helpers para signos vitales (deterministas, sin azar) ----------
// base = [fc, fr, sis, dia, temp, spo2]; deltas = ajuste por toma (cada 8 h)
function vitales(inicio, n, base, deltas, por) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = new Date(D(inicio).getTime() + i * 8 * 3600 * 1000);
    out.push({ fecha: t,
      fc: NumberInt(Math.round(base[0] + deltas[0] * i + (i % 2 ? 2 : -2))),
      fr: NumberInt(Math.round(base[1] + deltas[1] * i)),
      ta_sistolica: NumberInt(Math.round(base[2] + deltas[2] * i + (i % 3 - 1) * 3)),
      ta_diastolica: NumberInt(Math.round(base[3] + deltas[3] * i)),
      temperatura: Double(Math.round((base[4] + deltas[4] * i) * 10) / 10),
      spo2: NumberInt(Math.min(99, Math.round(base[5] + deltas[5] * i))),
      registrado_por: por });
  }
  return out;
}

// ---------- Hospitalizaciones ----------
hce.hospitalizaciones.insertMany([
  // H1 - Neumonia (PAC-001), egresada
  { _id: "HOSP-2026-0001", paciente_id: "PAC-001", medico_tratante_id: "PRO-001",
    ips: "Hospital General de Medellín", servicio: "MEDICINA_INTERNA", cama: "MI-204",
    fecha_admision: D("2026-09-02T14:30:00"), via_ingreso: "URGENCIAS",
    motivo_ingreso: "Fiebre, tos productiva y disnea de 3 días de evolución", estado: "EGRESADA",
    diagnosticos: [
      { cie10: "J18.9", descripcion: "Neumonía, no especificada", tipo: "INGRESO", fecha: D("2026-09-02T14:30:00") },
      { cie10: "J18.9", descripcion: "Neumonía, no especificada", tipo: "PRINCIPAL", fecha: D("2026-09-02T20:00:00") },
      { cie10: "E11.9", descripcion: "Diabetes mellitus tipo 2 sin complicaciones", tipo: "RELACIONADO", fecha: D("2026-09-02T20:00:00") },
      { cie10: "J18.9", descripcion: "Neumonía, no especificada", tipo: "EGRESO", fecha: D("2026-09-07T10:00:00") } ],
    notas_evolucion: [
      { fecha: D("2026-09-02T20:00:00"), profesional_id: "PRO-001", subjetivo: "Refiere disnea y fiebre.", objetivo: "SpO2 90% ambiente, crépitos en base derecha, Rx con consolidación LID.", analisis: "Neumonía adquirida en comunidad CURB-65 = 2.", plan: "Hospitalizar, oxígeno suplementario, ceftriaxona IV, control glucométrico." },
      { fecha: D("2026-09-04T09:00:00"), profesional_id: "PRO-001", subjetivo: "Menos disnea, persiste tos.", objetivo: "Afebril 24 h, SpO2 94% con cánula 2 L/min.", analisis: "Buena respuesta al tratamiento.", plan: "Continuar antibiótico, destete de oxígeno." },
      { fecha: D("2026-09-06T09:00:00"), profesional_id: "PRO-001", subjetivo: "Asintomática.", objetivo: "SpO2 96% ambiente, sin fiebre, glucometrías en metas.", analisis: "Resolución clínica.", plan: "Cambio a vía oral, programar egreso." } ],
    signos_vitales: vitales("2026-09-02T15:00:00", 12, [104, 26, 128, 76, 38.6, 90], [-2.3, -0.8, -0.8, 0, -0.18, 0.55], "ENF-001"),
    notas_enfermeria: [
      { fecha: D("2026-09-02T16:00:00"), enfermera_id: "ENF-001", turno: "TARDE", nota: "Ingresa consciente, orientada. Se instala cánula nasal 2 L/min y acceso venoso periférico." },
      { fecha: D("2026-09-03T06:30:00"), enfermera_id: "ENF-002", turno: "NOCHE", nota: "Pasó noche tranquila, tos esporádica. Glucometría 142 mg/dL." },
      { fecha: D("2026-09-05T14:00:00"), enfermera_id: "ENF-001", turno: "TARDE", nota: "Tolera dieta, deambula con apoyo. Sin oxígeno suplementario." } ],
    ordenes_medicamentos: [
      { medicamento_id: "MED-001", nombre: "Ceftriaxona", dosis: "1 g", via: "IV", frecuencia: "cada 12 horas", fecha_inicio: D("2026-09-02T20:00:00"), fecha_fin: D("2026-09-06T09:00:00"), prescriptor_id: "PRO-001", estado: "FINALIZADA" },
      { medicamento_id: "MED-002", nombre: "Azitromicina", dosis: "500 mg", via: "VO", frecuencia: "cada 24 horas", fecha_inicio: D("2026-09-06T09:00:00"), fecha_fin: D("2026-09-07T10:00:00"), prescriptor_id: "PRO-001", estado: "FINALIZADA" },
      { medicamento_id: "MED-010", nombre: "Acetaminofen", dosis: "500 mg", via: "VO", frecuencia: "cada 8 horas si fiebre", fecha_inicio: D("2026-09-02T20:00:00"), fecha_fin: D("2026-09-07T10:00:00"), prescriptor_id: "PRO-001", estado: "FINALIZADA" },
      { medicamento_id: "MED-005", nombre: "Insulina cristalina", dosis: "según esquema móvil", via: "SC", frecuencia: "antes de comidas", fecha_inicio: D("2026-09-02T20:00:00"), fecha_fin: D("2026-09-07T10:00:00"), prescriptor_id: "PRO-001", estado: "FINALIZADA" } ],
    alta: { fecha: D("2026-09-07T10:00:00"), condicion: "MEJORADO", destino: "Domicilio", diagnostico_egreso: "J18.9", recomendaciones: "Completar azitromicina, control en 7 días, vacunación antineumocócica." } },

  // H2 - EPOC exacerbado (PAC-002), egresada
  { _id: "HOSP-2026-0002", paciente_id: "PAC-002", medico_tratante_id: "PRO-002",
    ips: "Hospital General de Medellín", servicio: "MEDICINA_INTERNA", cama: "MI-211",
    fecha_admision: D("2026-09-10T08:15:00"), via_ingreso: "URGENCIAS",
    motivo_ingreso: "Disnea progresiva y aumento de expectoración", estado: "EGRESADA",
    diagnosticos: [
      { cie10: "J44.1", descripcion: "EPOC con exacerbación aguda", tipo: "INGRESO", fecha: D("2026-09-10T08:15:00") },
      { cie10: "J44.1", descripcion: "EPOC con exacerbación aguda", tipo: "PRINCIPAL", fecha: D("2026-09-10T12:00:00") },
      { cie10: "I10", descripcion: "Hipertensión esencial (primaria)", tipo: "RELACIONADO", fecha: D("2026-09-10T12:00:00") },
      { cie10: "J44.1", descripcion: "EPOC con exacerbación aguda", tipo: "EGRESO", fecha: D("2026-09-15T11:00:00") } ],
    notas_evolucion: [
      { fecha: D("2026-09-10T12:00:00"), profesional_id: "PRO-002", subjetivo: "Disnea de moderados esfuerzos.", objetivo: "Sibilancias difusas, SpO2 88%.", analisis: "Exacerbación de EPOC GOLD E.", plan: "Broncodilatadores, corticoide sistémico, oxígeno controlado." },
      { fecha: D("2026-09-12T09:00:00"), profesional_id: "PRO-002", subjetivo: "Mejoría parcial.", objetivo: "SpO2 92% con 2 L/min, menos sibilancias.", analisis: "Evolución favorable.", plan: "Continuar esquema, iniciar destete de oxígeno." },
      { fecha: D("2026-09-14T09:00:00"), profesional_id: "PRO-002", subjetivo: "Sin disnea en reposo.", objetivo: "SpO2 93% ambiente.", analisis: "Estable.", plan: "Egreso con inhaladores y control por neumología." } ],
    signos_vitales: vitales("2026-09-10T09:00:00", 12, [112, 28, 150, 88, 37.2, 88], [-1.6, -0.9, -2.0, -0.7, 0, 0.45], "ENF-002"),
    notas_enfermeria: [
      { fecha: D("2026-09-10T10:00:00"), enfermera_id: "ENF-002", turno: "MANANA", nota: "Ingresa con uso de musculatura accesoria. Se inicia nebulización y O2 por Venturi 28%." },
      { fecha: D("2026-09-13T22:00:00"), enfermera_id: "ENF-001", turno: "NOCHE", nota: "Duerme sin O2 suplementario, SpO2 estable 92-93%." } ],
    ordenes_medicamentos: [
      { medicamento_id: "MED-003", nombre: "Salbutamol", dosis: "4 disparos", via: "INH", frecuencia: "cada 6 horas", fecha_inicio: D("2026-09-10T12:00:00"), fecha_fin: null, prescriptor_id: "PRO-002", estado: "ACTIVA" },
      { medicamento_id: "MED-004", nombre: "Prednisolona", dosis: "50 mg", via: "VO", frecuencia: "cada 24 horas", fecha_inicio: D("2026-09-10T12:00:00"), fecha_fin: D("2026-09-15T11:00:00"), prescriptor_id: "PRO-002", estado: "FINALIZADA" },
      { medicamento_id: "MED-002", nombre: "Azitromicina", dosis: "500 mg", via: "VO", frecuencia: "cada 24 horas", fecha_inicio: D("2026-09-10T12:00:00"), fecha_fin: D("2026-09-13T12:00:00"), prescriptor_id: "PRO-002", estado: "FINALIZADA" },
      { medicamento_id: "MED-008", nombre: "Losartan", dosis: "50 mg", via: "VO", frecuencia: "cada 24 horas", fecha_inicio: D("2026-09-10T12:00:00"), fecha_fin: null, prescriptor_id: "PRO-002", estado: "ACTIVA" } ],
    alta: { fecha: D("2026-09-15T11:00:00"), condicion: "ESTABLE", destino: "Domicilio", diagnostico_egreso: "J44.1", recomendaciones: "Salbutamol de rescate, suspensión del tabaco, control con neumología en 15 días." } },

  // H3 - Gastroenteritis pediatrica (PAC-003), egresada
  { _id: "HOSP-2026-0003", paciente_id: "PAC-003", medico_tratante_id: "PRO-003",
    ips: "Hospital Infantil Concejo de Medellín", servicio: "PEDIATRIA", cama: "PE-105",
    fecha_admision: D("2026-09-15T21:00:00"), via_ingreso: "URGENCIAS",
    motivo_ingreso: "Vómito y diarrea de 2 días con deshidratación moderada", estado: "EGRESADA",
    diagnosticos: [
      { cie10: "A09", descripcion: "Gastroenteritis de presunto origen infeccioso", tipo: "INGRESO", fecha: D("2026-09-15T21:00:00") },
      { cie10: "A09", descripcion: "Gastroenteritis de presunto origen infeccioso", tipo: "PRINCIPAL", fecha: D("2026-09-16T08:00:00") },
      { cie10: "A09", descripcion: "Gastroenteritis de presunto origen infeccioso", tipo: "EGRESO", fecha: D("2026-09-18T10:00:00") } ],
    notas_evolucion: [
      { fecha: D("2026-09-16T08:00:00"), profesional_id: "PRO-003", subjetivo: "Madre refiere 6 deposiciones líquidas.", objetivo: "Mucosas secas, llenado capilar 3 s.", analisis: "Deshidratación moderada.", plan: "Rehidratación IV y luego oral, dieta astringente." },
      { fecha: D("2026-09-17T08:00:00"), profesional_id: "PRO-003", subjetivo: "Tolera vía oral, 1 deposición.", objetivo: "Hidratada, afebril.", analisis: "Mejoría.", plan: "Suspender líquidos IV, observar 24 h." } ],
    signos_vitales: vitales("2026-09-15T22:00:00", 9, [124, 28, 96, 58, 38.1, 96], [-3.2, -0.5, 1.2, 0.3, -0.12, 0.3], "ENF-002"),
    notas_enfermeria: [
      { fecha: D("2026-09-16T02:00:00"), enfermera_id: "ENF-002", turno: "NOCHE", nota: "Se canaliza vena periférica, inicia Lactato de Ringer. Madre acompaña." },
      { fecha: D("2026-09-17T15:00:00"), enfermera_id: "ENF-001", turno: "TARDE", nota: "Tolera suero oral y dieta blanda, sin vómito." } ],
    ordenes_medicamentos: [
      { medicamento_id: "MED-009", nombre: "Lactato de Ringer", dosis: "20 mL/kg en bolo, luego mantenimiento", via: "IV", frecuencia: "continuo", fecha_inicio: D("2026-09-16T00:00:00"), fecha_fin: D("2026-09-17T09:00:00"), prescriptor_id: "PRO-003", estado: "FINALIZADA" },
      { medicamento_id: "MED-010", nombre: "Acetaminofen", dosis: "500 mg", via: "VO", frecuencia: "cada 8 horas si fiebre", fecha_inicio: D("2026-09-16T00:00:00"), fecha_fin: D("2026-09-18T10:00:00"), prescriptor_id: "PRO-003", estado: "FINALIZADA" } ],
    alta: { fecha: D("2026-09-18T10:00:00"), condicion: "MEJORADO", destino: "Domicilio", diagnostico_egreso: "A09", recomendaciones: "Suero oral, signos de alarma, control pediátrico en 3 días." } },

  // H4 - Infarto agudo de miocardio (PAC-004), egresada
  { _id: "HOSP-2026-0004", paciente_id: "PAC-004", medico_tratante_id: "PRO-001",
    ips: "Clínica Cardiovascular de Antioquia", servicio: "UCI", cama: "UCI-03",
    fecha_admision: D("2026-09-20T03:40:00"), via_ingreso: "REMISION",
    motivo_ingreso: "Dolor torácico opresivo irradiado a brazo izquierdo", estado: "EGRESADA",
    diagnosticos: [
      { cie10: "I21.9", descripcion: "Infarto agudo de miocardio", tipo: "INGRESO", fecha: D("2026-09-20T03:40:00") },
      { cie10: "I21.9", descripcion: "Infarto agudo de miocardio", tipo: "PRINCIPAL", fecha: D("2026-09-20T06:00:00") },
      { cie10: "I10", descripcion: "Hipertensión esencial (primaria)", tipo: "RELACIONADO", fecha: D("2026-09-20T06:00:00") },
      { cie10: "I21.9", descripcion: "Infarto agudo de miocardio", tipo: "EGRESO", fecha: D("2026-09-26T12:00:00") } ],
    notas_evolucion: [
      { fecha: D("2026-09-20T06:00:00"), profesional_id: "PRO-001", subjetivo: "Dolor 8/10.", objetivo: "ECG con elevación ST en derivaciones inferiores, troponina elevada.", analisis: "IAMCEST inferior.", plan: "Reperfusión, doble antiagregación, anticoagulación, UCI." },
      { fecha: D("2026-09-22T09:00:00"), profesional_id: "PRO-001", subjetivo: "Sin dolor.", objetivo: "Hemodinamicamente estable, sin arritmias.", analisis: "Post-intervención sin complicaciones.", plan: "Traslado a piso, rehabilitación cardiaca." },
      { fecha: D("2026-09-25T09:00:00"), profesional_id: "PRO-002", subjetivo: "Asintomático.", objetivo: "TA 118/72, FC 68.", analisis: "Estable para egreso.", plan: "Egreso con terapia médica óptima." } ],
    signos_vitales: vitales("2026-09-20T04:00:00", 14, [98, 22, 150, 92, 36.8, 94], [-2.2, -0.4, -2.4, -1.4, 0, 0.3], "ENF-001"),
    notas_enfermeria: [
      { fecha: D("2026-09-20T05:00:00"), enfermera_id: "ENF-001", turno: "NOCHE", nota: "Monitorización continua, acceso venoso central, paciente ansioso, dolor se alivia tras nitroglicerina." },
      { fecha: D("2026-09-23T14:00:00"), enfermera_id: "ENF-002", turno: "TARDE", nota: "En piso, deambula 50 m sin dolor ni disnea." } ],
    ordenes_medicamentos: [
      { medicamento_id: "MED-007", nombre: "Acido acetilsalicilico", dosis: "100 mg", via: "VO", frecuencia: "cada 24 horas", fecha_inicio: D("2026-09-20T04:00:00"), fecha_fin: null, prescriptor_id: "PRO-001", estado: "ACTIVA" },
      { medicamento_id: "MED-006", nombre: "Enoxaparina", dosis: "40 mg", via: "SC", frecuencia: "cada 12 horas", fecha_inicio: D("2026-09-20T05:00:00"), fecha_fin: D("2026-09-24T09:00:00"), prescriptor_id: "PRO-001", estado: "FINALIZADA" },
      { medicamento_id: "MED-008", nombre: "Losartan", dosis: "50 mg", via: "VO", frecuencia: "cada 24 horas", fecha_inicio: D("2026-09-22T09:00:00"), fecha_fin: null, prescriptor_id: "PRO-001", estado: "ACTIVA" } ],
    alta: { fecha: D("2026-09-26T12:00:00"), condicion: "ESTABLE", destino: "Domicilio", diagnostico_egreso: "I21.9", recomendaciones: "Rehabilitación cardiaca, dieta hiposódica, control cardiología en 1 semana." } },

  // H5 - Apendicitis (PAC-005), egresada
  { _id: "HOSP-2026-0005", paciente_id: "PAC-005", medico_tratante_id: "PRO-004",
    ips: "Hospital San Juan de Dios Rionegro", servicio: "CIRUGIA", cama: "CI-302",
    fecha_admision: D("2026-10-01T19:20:00"), via_ingreso: "URGENCIAS",
    motivo_ingreso: "Dolor abdominal en fosa ilíaca derecha con náuseas", estado: "EGRESADA",
    diagnosticos: [
      { cie10: "K35.8", descripcion: "Apendicitis aguda", tipo: "INGRESO", fecha: D("2026-10-01T19:20:00") },
      { cie10: "K35.8", descripcion: "Apendicitis aguda", tipo: "PRINCIPAL", fecha: D("2026-10-01T22:00:00") },
      { cie10: "K35.8", descripcion: "Apendicitis aguda", tipo: "EGRESO", fecha: D("2026-10-04T10:00:00") } ],
    notas_evolucion: [
      { fecha: D("2026-10-01T22:00:00"), profesional_id: "PRO-004", subjetivo: "Dolor 7/10 en FID.", objetivo: "Signo de Blumberg positivo, leucocitosis 15.800.", analisis: "Apendicitis aguda.", plan: "Apendicectomía laparoscópica urgente." },
      { fecha: D("2026-10-02T09:00:00"), profesional_id: "PRO-004", subjetivo: "Dolor leve en heridas.", objetivo: "Heridas limpias, tolera vía oral.", analisis: "Posoperatorio inmediato sin complicaciones.", plan: "Analgesia, deambulación, egreso próximas 24-48 h." } ],
    signos_vitales: vitales("2026-10-01T20:00:00", 9, [102, 20, 122, 74, 38.2, 98], [-3.0, -0.2, -0.8, 0, -0.15, 0], "ENF-002"),
    notas_enfermeria: [
      { fecha: D("2026-10-02T01:00:00"), enfermera_id: "ENF-002", turno: "NOCHE", nota: "Retorna de quirófano, despierta, dolor 4/10, drenaje no requerido." },
      { fecha: D("2026-10-03T10:00:00"), enfermera_id: "ENF-001", turno: "MANANA", nota: "Deambula, tolera dieta normal, herida sin signos de infección." } ],
    ordenes_medicamentos: [
      { medicamento_id: "MED-001", nombre: "Ceftriaxona", dosis: "1 g", via: "IV", frecuencia: "cada 24 horas", fecha_inicio: D("2026-10-01T22:30:00"), fecha_fin: D("2026-10-03T22:30:00"), prescriptor_id: "PRO-004", estado: "FINALIZADA" },
      { medicamento_id: "MED-010", nombre: "Acetaminofen", dosis: "500 mg", via: "VO", frecuencia: "cada 6 horas", fecha_inicio: D("2026-10-02T06:00:00"), fecha_fin: D("2026-10-04T10:00:00"), prescriptor_id: "PRO-004", estado: "FINALIZADA" } ],
    alta: { fecha: D("2026-10-04T10:00:00"), condicion: "MEJORADO", destino: "Domicilio", diagnostico_egreso: "K35.8", recomendaciones: "Control de herida en 7 días, reposo relativo." } },

  // H6 - Diabetes descompensada / cetoacidosis (PAC-006), ACTIVA
  { _id: "HOSP-2026-0006", paciente_id: "PAC-006", medico_tratante_id: "PRO-002",
    ips: "Hospital General de Medellín", servicio: "MEDICINA_INTERNA", cama: "MI-218",
    fecha_admision: D("2026-10-21T10:00:00"), via_ingreso: "URGENCIAS",
    motivo_ingreso: "Poliuria, polidipsia, náuseas y malestar general", estado: "ACTIVA",
    diagnosticos: [
      { cie10: "E11.1", descripcion: "Diabetes mellitus tipo 2 con cetoacidosis", tipo: "INGRESO", fecha: D("2026-10-21T10:00:00") },
      { cie10: "E11.1", descripcion: "Diabetes mellitus tipo 2 con cetoacidosis", tipo: "PRINCIPAL", fecha: D("2026-10-21T13:00:00") },
      { cie10: "N39.0", descripcion: "Infección de vías urinarias", tipo: "RELACIONADO", fecha: D("2026-10-21T13:00:00") } ],
    notas_evolucion: [
      { fecha: D("2026-10-21T13:00:00"), profesional_id: "PRO-002", subjetivo: "Sed intensa, náuseas.", objetivo: "Glucemia 480 mg/dL, cetonuria 3+, pH 7.21.", analisis: "Cetoacidosis diabética, posible foco urinario.", plan: "Insulina en infusión, hidratación IV, antibiótico, control de electrolitos." },
      { fecha: D("2026-10-23T09:00:00"), profesional_id: "PRO-002", subjetivo: "Mejoría, sin náuseas.", objetivo: "Glucemia 190 mg/dL, pH 7.36.", analisis: "Resolución de la acidosis.", plan: "Transición a insulina SC, continuar antibiótico." } ],
    signos_vitales: vitales("2026-10-21T11:00:00", 10, [118, 24, 104, 62, 37.8, 95], [-3.5, -0.9, 2.8, 1.6, -0.1, 0.3], "ENF-001"),
    notas_enfermeria: [
      { fecha: D("2026-10-21T14:00:00"), enfermera_id: "ENF-001", turno: "TARDE", nota: "Inicia infusión de insulina, glucometrías horarias." },
      { fecha: D("2026-10-23T22:00:00"), enfermera_id: "ENF-002", turno: "NOCHE", nota: "Paciente estable, tolera dieta para diabético." } ],
    ordenes_medicamentos: [
      { medicamento_id: "MED-005", nombre: "Insulina cristalina", dosis: "0.1 UI/kg/h en infusión", via: "IV", frecuencia: "continuo", fecha_inicio: D("2026-10-21T13:30:00"), fecha_fin: D("2026-10-23T09:00:00"), prescriptor_id: "PRO-002", estado: "FINALIZADA" },
      { medicamento_id: "MED-009", nombre: "Lactato de Ringer", dosis: "1000 mL", via: "IV", frecuencia: "cada 4 horas", fecha_inicio: D("2026-10-21T13:00:00"), fecha_fin: D("2026-10-22T13:00:00"), prescriptor_id: "PRO-002", estado: "FINALIZADA" },
      { medicamento_id: "MED-011", nombre: "Ciprofloxacino", dosis: "500 mg", via: "VO", frecuencia: "cada 12 horas", fecha_inicio: D("2026-10-21T14:00:00"), fecha_fin: null, prescriptor_id: "PRO-002", estado: "ACTIVA" },
      { medicamento_id: "MED-012", nombre: "Metformina", dosis: "850 mg", via: "VO", frecuencia: "cada 12 horas", fecha_inicio: D("2026-10-23T09:00:00"), fecha_fin: null, prescriptor_id: "PRO-002", estado: "ACTIVA" } ],
    alta: null },

  // H7 - Segunda hospitalizacion de PAC-001 (reingreso por crisis hipertensiva), ACTIVA
  { _id: "HOSP-2026-0007", paciente_id: "PAC-001", medico_tratante_id: "PRO-001",
    ips: "Hospital General de Medellín", servicio: "MEDICINA_INTERNA", cama: "MI-206",
    fecha_admision: D("2026-10-22T16:45:00"), via_ingreso: "URGENCIAS",
    motivo_ingreso: "Cefalea intensa y cifras tensionales elevadas", estado: "ACTIVA",
    diagnosticos: [
      { cie10: "I10", descripcion: "Hipertensión esencial (primaria)", tipo: "INGRESO", fecha: D("2026-10-22T16:45:00") },
      { cie10: "I10", descripcion: "Hipertensión esencial (primaria)", tipo: "PRINCIPAL", fecha: D("2026-10-22T19:00:00") },
      { cie10: "E11.9", descripcion: "Diabetes mellitus tipo 2 sin complicaciones", tipo: "RELACIONADO", fecha: D("2026-10-22T19:00:00") } ],
    notas_evolucion: [
      { fecha: D("2026-10-22T19:00:00"), profesional_id: "PRO-001", subjetivo: "Cefalea occipital, sin déficit neurológico.", objetivo: "TA 192/108, examen neurológico normal.", analisis: "Urgencia hipertensiva.", plan: "Reducción gradual de TA por vía oral, vigilancia." },
      { fecha: D("2026-10-24T09:00:00"), profesional_id: "PRO-001", subjetivo: "Sin cefalea.", objetivo: "TA 138/84.", analisis: "Control tensional logrado.", plan: "Ajuste de antihipertensivo, egreso próximo." } ],
    signos_vitales: vitales("2026-10-22T17:00:00", 8, [88, 18, 192, 108, 36.6, 97], [-1.0, 0, -7.0, -3.5, 0, 0], "ENF-002"),
    notas_enfermeria: [
      { fecha: D("2026-10-22T18:00:00"), enfermera_id: "ENF-002", turno: "TARDE", nota: "Ingresa con cefalea, reposo en cama con cabecera elevada 30°, toma de TA cada 2 h." } ],
    ordenes_medicamentos: [
      { medicamento_id: "MED-008", nombre: "Losartan", dosis: "100 mg", via: "VO", frecuencia: "cada 24 horas", fecha_inicio: D("2026-10-22T19:00:00"), fecha_fin: null, prescriptor_id: "PRO-001", estado: "ACTIVA" },
      { medicamento_id: "MED-012", nombre: "Metformina", dosis: "850 mg", via: "VO", frecuencia: "cada 12 horas", fecha_inicio: D("2026-10-22T19:00:00"), fecha_fin: null, prescriptor_id: "PRO-001", estado: "ACTIVA" } ],
    alta: null }
]);

print("Carga completada:");
["catalogo_cie10", "catalogo_medicamentos", "profesionales", "pacientes", "hospitalizaciones"]
  .forEach(c => print("  " + c.padEnd(24) + hce[c].countDocuments()));
