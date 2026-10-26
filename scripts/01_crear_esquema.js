// =====================================================================
// 01_crear_esquema.js  -  HCE Basica Antioquia / Subsistema Hospitalizacion
// SGBD: MongoDB 8.x   |   Ejecutar:  mongosh --file 01_crear_esquema.js
// Modelo HIBRIDO: embebido para lo que nace y muere con la hospitalizacion,
// referenciado para entidades compartidas (paciente, profesional, catalogos).
// =====================================================================
const hce = db.getSiblingDB("hce_hospitalizacion");
hce.dropDatabase();

// ---------- Catalogos (referenciados) ----------
hce.createCollection("catalogo_cie10", {
  validator: { $jsonSchema: {
    bsonType: "object", required: ["_id", "descripcion"],
    properties: { _id: { bsonType: "string", description: "Codigo CIE-10" },
                  descripcion: { bsonType: "string" }, capitulo: { bsonType: "string" } } } }
});

hce.createCollection("catalogo_medicamentos", {
  validator: { $jsonSchema: {
    bsonType: "object", required: ["_id", "nombre_generico", "atc"],
    properties: { _id: { bsonType: "string" }, nombre_generico: { bsonType: "string" },
                  atc: { bsonType: "string" }, forma: { bsonType: "string" },
                  concentracion: { bsonType: "string" } } } }
});

hce.createCollection("profesionales", {
  validator: { $jsonSchema: {
    bsonType: "object", required: ["_id", "nombre", "rol", "registro_medico"],
    properties: { _id: { bsonType: "string" }, nombre: { bsonType: "string" },
                  rol: { enum: ["MEDICO", "ENFERMERIA", "ESPECIALISTA"] },
                  especialidad: { bsonType: "string" }, registro_medico: { bsonType: "string" } } } }
});

// ---------- Pacientes (referenciado desde hospitalizaciones) ----------
hce.createCollection("pacientes", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "tipo_documento", "documento", "nombres", "apellidos", "fecha_nacimiento", "sexo", "aseguramiento"],
    properties: {
      _id: { bsonType: "string" },
      tipo_documento: { enum: ["CC", "TI", "RC", "CE", "PA"] },
      documento: { bsonType: "string" },
      nombres: { bsonType: "string" }, apellidos: { bsonType: "string" },
      fecha_nacimiento: { bsonType: "date" },
      sexo: { enum: ["F", "M", "I"] },
      grupo_sanguineo: { enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] },
      contacto: { bsonType: "object", properties: {
        municipio: { bsonType: "string" }, telefono: { bsonType: "string" },
        acudiente: { bsonType: "object" } } },
      aseguramiento: { bsonType: "object", required: ["eps", "regimen"], properties: {
        eps: { bsonType: "string" }, regimen: { enum: ["CONTRIBUTIVO", "SUBSIDIADO", "ESPECIAL"] } } },
      alergias: { bsonType: "array", items: { bsonType: "string" } },
      antecedentes: { bsonType: "array", items: { bsonType: "string" } }
    } } }
});

// ---------- Hospitalizaciones (nucleo, subdocumentos embebidos) ----------
hce.createCollection("hospitalizaciones", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "paciente_id", "ips", "servicio", "fecha_admision", "motivo_ingreso", "estado", "medico_tratante_id", "diagnosticos"],
    properties: {
      _id: { bsonType: "string" },
      paciente_id: { bsonType: "string", description: "REF -> pacientes._id" },
      medico_tratante_id: { bsonType: "string", description: "REF -> profesionales._id" },
      ips: { bsonType: "string" },
      servicio: { enum: ["MEDICINA_INTERNA", "PEDIATRIA", "CIRUGIA", "GINECOOBSTETRICIA", "UCI"] },
      cama: { bsonType: "string" },
      fecha_admision: { bsonType: "date" },
      via_ingreso: { enum: ["URGENCIAS", "REMISION", "CONSULTA_EXTERNA"] },
      motivo_ingreso: { bsonType: "string" },
      estado: { enum: ["ACTIVA", "EGRESADA"] },
      diagnosticos: { bsonType: "array", minItems: 1, items: { bsonType: "object",
        required: ["cie10", "tipo", "fecha"],
        properties: { cie10: { bsonType: "string", description: "REF -> catalogo_cie10._id" },
                      descripcion: { bsonType: "string" },
                      tipo: { enum: ["INGRESO", "PRINCIPAL", "RELACIONADO", "EGRESO"] },
                      fecha: { bsonType: "date" } } } },
      notas_evolucion: { bsonType: "array", items: { bsonType: "object",
        required: ["fecha", "profesional_id", "analisis", "plan"],
        properties: { fecha: { bsonType: "date" }, profesional_id: { bsonType: "string" },
                      subjetivo: { bsonType: "string" }, objetivo: { bsonType: "string" },
                      analisis: { bsonType: "string" }, plan: { bsonType: "string" } } } },
      signos_vitales: { bsonType: "array", items: { bsonType: "object",
        required: ["fecha", "fc", "fr", "ta_sistolica", "ta_diastolica", "temperatura", "spo2"],
        properties: { fecha: { bsonType: "date" },
                      fc: { bsonType: "int", minimum: 20, maximum: 250 },
                      fr: { bsonType: "int", minimum: 4, maximum: 80 },
                      ta_sistolica: { bsonType: "int", minimum: 40, maximum: 300 },
                      ta_diastolica: { bsonType: "int", minimum: 20, maximum: 200 },
                      temperatura: { bsonType: "double", minimum: 30, maximum: 45 },
                      spo2: { bsonType: "int", minimum: 50, maximum: 100 },
                      registrado_por: { bsonType: "string" } } } },
      notas_enfermeria: { bsonType: "array", items: { bsonType: "object",
        required: ["fecha", "enfermera_id", "turno", "nota"],
        properties: { fecha: { bsonType: "date" }, enfermera_id: { bsonType: "string" },
                      turno: { enum: ["MANANA", "TARDE", "NOCHE"] }, nota: { bsonType: "string" } } } },
      ordenes_medicamentos: { bsonType: "array", items: { bsonType: "object",
        required: ["medicamento_id", "dosis", "via", "frecuencia", "fecha_inicio", "prescriptor_id", "estado"],
        properties: { medicamento_id: { bsonType: "string", description: "REF -> catalogo_medicamentos._id" },
                      nombre: { bsonType: "string", description: "copia desnormalizada para lectura rapida" },
                      dosis: { bsonType: "string" }, via: { enum: ["VO", "IV", "IM", "SC", "INH", "TOPICA"] },
                      frecuencia: { bsonType: "string" },
                      fecha_inicio: { bsonType: "date" }, fecha_fin: { bsonType: ["date", "null"] },
                      prescriptor_id: { bsonType: "string" },
                      estado: { enum: ["ACTIVA", "SUSPENDIDA", "FINALIZADA"] } } } },
      alta: { bsonType: ["object", "null"], properties: {
        fecha: { bsonType: "date" }, condicion: { enum: ["MEJORADO", "ESTABLE", "REFERIDO", "FALLECIDO", "VOLUNTARIO"] },
        destino: { bsonType: "string" }, diagnostico_egreso: { bsonType: "string" },
        recomendaciones: { bsonType: "string" } } }
    } } }
});

// ---------- Indices ----------
hce.pacientes.createIndex({ tipo_documento: 1, documento: 1 }, { unique: true });
hce.hospitalizaciones.createIndex({ paciente_id: 1, fecha_admision: -1 });
hce.hospitalizaciones.createIndex({ "diagnosticos.cie10": 1 });
hce.hospitalizaciones.createIndex({ servicio: 1, estado: 1 });
hce.hospitalizaciones.createIndex({ "ordenes_medicamentos.medicamento_id": 1 });

print("Base de datos 'hce_hospitalizacion' creada. Colecciones:");
printjson(hce.getCollectionNames().sort());
print("Indices en hospitalizaciones:");
hce.hospitalizaciones.getIndexes().forEach(i => print("  - " + i.name));
