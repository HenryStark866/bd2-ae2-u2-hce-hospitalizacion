// =====================================================================
// 03_consultas.js  -  Consultas de validacion del modelo
// Ejecutar: mongosh --file 03_consultas.js
// =====================================================================
const hce = db.getSiblingDB("hce_hospitalizacion");
const titulo = (t) => print("\n==================== " + t + " ====================");

// ---------------------------------------------------------------
// C1. Pacientes por diagnostico (CIE-10 J18.9 - Neumonia)
//     Valida: indice multikey sobre diagnosticos.cie10 + referencia a pacientes ($lookup)
// ---------------------------------------------------------------
titulo("C1. Pacientes hospitalizados con diagnostico PRINCIPAL = J18.9");
hce.hospitalizaciones.aggregate([
  { $match: { diagnosticos: { $elemMatch: { cie10: "J18.9", tipo: "PRINCIPAL" } } } },
  { $lookup: { from: "pacientes", localField: "paciente_id", foreignField: "_id", as: "p" } },
  { $unwind: "$p" },
  { $project: { _id: 0, hospitalizacion: "$_id", paciente: { $concat: ["$p.nombres", " ", "$p.apellidos"] },
                documento: "$p.documento", servicio: 1, fecha_admision: 1, estado: 1 } }
]).forEach(d => printjson(d));

titulo("C1b. Conteo de hospitalizaciones por diagnostico principal");
hce.hospitalizaciones.aggregate([
  { $unwind: "$diagnosticos" },
  { $match: { "diagnosticos.tipo": "PRINCIPAL" } },
  { $group: { _id: { cie10: "$diagnosticos.cie10", descripcion: "$diagnosticos.descripcion" }, hospitalizaciones: { $sum: 1 } } },
  { $sort: { hospitalizaciones: -1, "_id.cie10": 1 } },
  { $project: { _id: 0, cie10: "$_id.cie10", descripcion: "$_id.descripcion", hospitalizaciones: 1 } }
]).forEach(d => printjson(d));

// ---------------------------------------------------------------
// C2. Evolucion cronologica de una hospitalizacion (notas medicas + medico)
//     Valida: embebido de notas_evolucion y referencia a profesionales
// ---------------------------------------------------------------
titulo("C2. Evolucion cronologica de HOSP-2026-0001 (paciente PAC-001)");
hce.hospitalizaciones.aggregate([
  { $match: { _id: "HOSP-2026-0001" } },
  { $unwind: "$notas_evolucion" },
  { $sort: { "notas_evolucion.fecha": 1 } },
  { $lookup: { from: "profesionales", localField: "notas_evolucion.profesional_id", foreignField: "_id", as: "prof" } },
  { $unwind: "$prof" },
  { $project: { _id: 0, fecha: "$notas_evolucion.fecha", medico: "$prof.nombre",
                analisis: "$notas_evolucion.analisis", plan: "$notas_evolucion.plan" } }
]).forEach(d => printjson(d));

// ---------------------------------------------------------------
// C3. Medicamentos asignados por paciente (con catalogo ATC y estado)
//     Valida: ordenes_medicamentos embebidas + referencia a catalogo_medicamentos
// ---------------------------------------------------------------
titulo("C3. Medicamentos asignados al paciente PAC-006 (Hector Dario Jaramillo)");
hce.hospitalizaciones.aggregate([
  { $match: { paciente_id: "PAC-006" } },
  { $unwind: "$ordenes_medicamentos" },
  { $lookup: { from: "catalogo_medicamentos", localField: "ordenes_medicamentos.medicamento_id", foreignField: "_id", as: "cat" } },
  { $unwind: "$cat" },
  { $project: { _id: 0, hospitalizacion: "$_id", medicamento: "$cat.nombre_generico", atc: "$cat.atc",
                dosis: "$ordenes_medicamentos.dosis", via: "$ordenes_medicamentos.via",
                frecuencia: "$ordenes_medicamentos.frecuencia", estado: "$ordenes_medicamentos.estado" } }
]).forEach(d => printjson(d));

titulo("C3b. Medicamentos ACTIVOS en hospitalizaciones ACTIVAS (agrupado por paciente)");
hce.hospitalizaciones.aggregate([
  { $match: { estado: "ACTIVA" } },
  { $project: { paciente_id: 1, activos: { $filter: { input: "$ordenes_medicamentos", cond: { $eq: ["$$this.estado", "ACTIVA"] } } } } },
  { $lookup: { from: "pacientes", localField: "paciente_id", foreignField: "_id", as: "p" } },
  { $unwind: "$p" },
  { $project: { _id: 0, hospitalizacion: "$_id", paciente: { $concat: ["$p.nombres", " ", "$p.apellidos"] },
                medicamentos: { $map: { input: "$activos", as: "m", in: { $concat: ["$$m.nombre", " ", "$$m.dosis", " ", "$$m.via"] } } } } }
]).forEach(d => printjson(d));

// ---------------------------------------------------------------
// C4 (adicional). Alerta clinica: tomas de signos vitales con SpO2 < 92 %
// ---------------------------------------------------------------
titulo("C4. Tomas con SpO2 < 92% (alerta de hipoxemia), por hospitalizacion");
hce.hospitalizaciones.aggregate([
  { $unwind: "$signos_vitales" },
  { $match: { "signos_vitales.spo2": { $lt: 92 } } },
  { $group: { _id: "$_id", paciente: { $first: "$paciente_id" }, tomas_criticas: { $sum: 1 },
              spo2_minima: { $min: "$signos_vitales.spo2" } } },
  { $sort: { spo2_minima: 1 } }
]).forEach(d => printjson(d));

// ---------------------------------------------------------------
// C5 (adicional). Estancia promedio (dias) por servicio de hospitalizaciones egresadas
// ---------------------------------------------------------------
titulo("C5. Estancia promedio en dias por servicio (egresadas)");
hce.hospitalizaciones.aggregate([
  { $match: { estado: "EGRESADA" } },
  { $project: { servicio: 1, dias: { $dateDiff: { startDate: "$fecha_admision", endDate: "$alta.fecha", unit: "day" } } } },
  { $group: { _id: "$servicio", hospitalizaciones: { $sum: 1 }, estancia_promedio_dias: { $avg: "$dias" } } },
  { $sort: { estancia_promedio_dias: -1 } }
]).forEach(d => printjson(d));

// ---------------------------------------------------------------
// Prueba de la validacion de esquema: documento invalido debe ser rechazado
// ---------------------------------------------------------------
titulo("V1. Prueba de integridad: insertar signo vital fuera de rango debe fallar");
try {
  hce.hospitalizaciones.updateOne({ _id: "HOSP-2026-0007" },
    { $push: { signos_vitales: { fecha: new Date(), fc: NumberInt(400), fr: NumberInt(18),
        ta_sistolica: NumberInt(120), ta_diastolica: NumberInt(80), temperatura: Double(36.5), spo2: NumberInt(97) } } });
  print("ERROR: se acepto un dato invalido");
} catch (e) { print("Rechazado correctamente -> " + "codigo " + e.code + " (DocumentValidationFailure): " + e.message); }
