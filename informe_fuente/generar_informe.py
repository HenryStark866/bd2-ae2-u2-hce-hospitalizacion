"""Genera Grupo1_AE2_U2.pdf a partir de config.json, los scripts, resultados y capturas.
Uso:  python informe_fuente/generar_informe.py      (requiere reportlab)
Edite config.json (numero de grupo e integrantes) y vuelva a ejecutar."""
import json, os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle,
                                Preformatted, KeepTogether)
from PIL import Image as PILImage

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
cfg = json.load(open(os.path.join(BASE, "informe_fuente", "config.json"), encoding="utf-8"))
SALIDA = os.path.join(BASE, f"Grupo{cfg['grupo']}_AE2_U2.pdf")

F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Body", os.path.join(F, "arial.ttf")))
pdfmetrics.registerFont(TTFont("Body-B", os.path.join(F, "arialbd.ttf")))
pdfmetrics.registerFont(TTFont("Body-I", os.path.join(F, "ariali.ttf")))
pdfmetrics.registerFont(TTFont("Mono", os.path.join(F, "consola.ttf")))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-B", italic="Body-I", boldItalic="Body-B")

AZUL, GRIS = colors.HexColor("#1f4e8c"), colors.HexColor("#f2f4f8")
s_body = ParagraphStyle("b", fontName="Body", fontSize=10, leading=14, spaceAfter=6, alignment=4)
s_h1 = ParagraphStyle("h1", fontName="Body-B", fontSize=16, leading=20, textColor=AZUL, spaceBefore=4, spaceAfter=8)
s_h2 = ParagraphStyle("h2", fontName="Body-B", fontSize=12, leading=16, textColor=AZUL, spaceBefore=8, spaceAfter=4)
s_cap = ParagraphStyle("c", fontName="Body-I", fontSize=8.5, leading=11, textColor=colors.HexColor("#555555"), spaceAfter=8)
s_cell = ParagraphStyle("t", fontName="Body", fontSize=8.5, leading=11)
s_cellb = ParagraphStyle("tb", fontName="Body-B", fontSize=8.5, leading=11, textColor=colors.white)
s_code = ParagraphStyle("code", fontName="Mono", fontSize=7.4, leading=9.2, backColor=GRIS, borderPadding=5,
                        spaceAfter=8, leftIndent=4)
s_bul = ParagraphStyle("bul", parent=s_body, leftIndent=14, bulletIndent=2, spaceAfter=3, alignment=0)

def P(t, st=s_body): return Paragraph(t, st)
def H1(t): return Paragraph(t, s_h1)
def H2(t): return Paragraph(t, s_h2)
def B(t): return Paragraph(t, s_bul, bulletText="•")
def code(t): return Preformatted(t.strip("\n"), s_code)
def leer(*ruta): return open(os.path.join(BASE, *ruta), encoding="utf-8").read()

def img(ruta, ancho=16.5 * cm, tope=19 * cm):
    w, h = PILImage.open(ruta).size
    esc = min(ancho / w, tope / h)
    return Image(ruta, width=w * esc, height=h * esc)

def tabla(filas, anchos, cab=True):
    data = [[Paragraph(str(c), s_cellb if (cab and i == 0) else s_cell) for c in f] for i, f in enumerate(filas)]
    t = Table(data, colWidths=anchos, repeatRows=1 if cab else 0)
    est = [("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#b8c2d3")), ("VALIGN", (0, 0), (-1, -1), "TOP"),
           ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
    if cab: est += [("BACKGROUND", (0, 0), (-1, 0), AZUL)] + [("BACKGROUND", (0, i), (-1, i), GRIS) for i in range(2, len(filas), 2)]
    t.setStyle(TableStyle(est)); return t

def pie(c, d):
    c.saveState(); c.setFont("Body", 8); c.setFillColor(colors.HexColor("#666666"))
    c.drawString(2 * cm, 1.2 * cm, "Henry Taborda · AE2-U2 · Bases de Datos II · 2026-2")
    c.drawRightString(letter[0] - 2 * cm, 1.2 * cm, f"Página {d.page}"); c.restoreState()

S = []
# ------------------------------------------------------------------ Portada
S += [Spacer(1, 3 * cm),
      Paragraph("Tarea. Construyendo una base de datos NoSQL", ParagraphStyle("t", fontName="Body-B", fontSize=24, leading=30, textColor=AZUL)),
      Spacer(1, .4 * cm),
      Paragraph("Historia Clínica Electrónica Básica — Subsistema de Hospitalización<br/>Secretaría de Salud de Antioquia", ParagraphStyle("t2", fontName="Body", fontSize=14, leading=19)),
      Spacer(1, 1.2 * cm),
      tabla([["Asignatura", "Bases de Datos II (G101) — Tecnología en Desarrollo de Software"],
             ["Profesora", "Oralia Cortés Grajales"],
             ["Actividad", "AE2 · Unidad 2 · Valor 10 %"],
             ["Modalidad", "Trabajo individual"],
             ["Autor", "<br/>".join(i["nombre"] for i in cfg["integrantes"])],
             ["SGBD", "MongoDB 8.3.7 (modelo documental híbrido)"],
             ["Base de datos", "hce_hospitalizacion"],
             ["Fecha", "25 de octubre de 2026"]], [4 * cm, 13 * cm], cab=False),
      Spacer(1, 1 * cm),
      P("<b>Contenido:</b> 1. Esquema del modelo · 2. Implementación · 3. Carga de datos · 4. Consultas · "
        "5. Evidencia de IA · 6. Reflexión ética · 7. División del trabajo · Anexo: repositorio."),
      PageBreak()]

# ------------------------------------------------------------------ 1. Esquema
S += [H1("1. Esquema del modelo"),
      H2("1.1 Modelo elegido y por qué"),
      P("Se eligió el <b>modelo documental</b> (MongoDB) con una estrategia <b>híbrida</b>. Una hospitalización es una unidad "
        "clínica con estructura jerárquica y de longitud variable (decenas de signos vitales, varias notas de evolución, órdenes de "
        "medicamentos) que casi siempre se consulta completa: es el caso típico donde un documento agregado evita múltiples JOIN. "
        "Pero el paciente, el personal de salud y los catálogos se reutilizan entre muchas hospitalizaciones y deben tener una única "
        "versión verdadera, por lo que se <b>referencian</b>."),
      img(os.path.join(BASE, "capturas", "00_diagrama_esquema.png"), tope=11 * cm),
      P("Figura 1. Modelo documental híbrido: subdocumentos embebidos (amarillo) y referencias entre colecciones.", s_cap),
      H2("1.2 Decisiones de embebido vs. referenciado"),
      tabla([["Elemento", "Estrategia", "Justificación"],
             ["Diagnósticos (ingreso, principal, relacionado, egreso)", "<b>Embebido</b> (array) + REF al código CIE-10", "Nacen con el ingreso y se leen siempre con él. El código CIE-10 se referencia al catálogo; se copia la descripción para lectura rápida."],
             ["Notas de evolución (SOAP)", "<b>Embebido</b> (array)", "Crecen de forma acotada (1–3 por día), se leen en orden cronológico dentro del ingreso."],
             ["Signos vitales", "<b>Embebido</b> (array)", "Volumen acotado por ingreso (≈3 tomas/día). Si crecieran a miles (UCI con monitorización continua) se pasaría al patrón <i>bucket</i> en una colección aparte."],
             ["Notas de enfermería", "<b>Embebido</b> (array)", "Mismo ciclo de vida que la hospitalización."],
             ["Órdenes de medicamentos", "<b>Embebido</b> + REF al catálogo", "Cada orden es propia del ingreso (dosis, vía, estado); el medicamento es un dato maestro compartido."],
             ["Alta (egreso)", "<b>Embebido</b> (objeto, nulo si activa)", "Relación 1:1 con la hospitalización."],
             ["Paciente", "<b>Referenciado</b> (colección propia)", "Un paciente tiene N hospitalizaciones (ej. PAC-001 tiene dos). Evita duplicar datos de identificación sensibles y permite controlar su acceso por separado."],
             ["Profesionales", "<b>Referenciado</b>", "Se reutilizan en cientos de notas; protege el registro médico de duplicaciones inconsistentes."],
             ["Catálogos CIE-10 y medicamentos", "<b>Referenciado</b>", "Datos maestros controlados; una corrección se hace una sola vez."]],
            [4.2 * cm, 4.3 * cm, 8.5 * cm]),
      Spacer(1, 6),
      H2("1.3 Entidades núcleo cubiertas del proceso de hospitalización"),
      P("Admisión (datos de ingreso, servicio, cama, vía de ingreso), diagnóstico, evolución, signos vitales, notas de enfermería, "
        "tratamientos (órdenes de medicamentos) y alta. El esquema se hace cumplir en la base con validación <font name='Mono'>$jsonSchema</font> "
        "(tipos, enumeraciones, rangos fisiológicos de signos vitales y campos obligatorios)."),
      H2("1.4 Estructura de un documento (JSON, resumido)"),
      code('''{
  "_id": "HOSP-2026-0001",
  "paciente_id": "PAC-001",              // REF -> pacientes
  "medico_tratante_id": "PRO-001",       // REF -> profesionales
  "ips": "Hospital General de Medellín", "servicio": "MEDICINA_INTERNA", "cama": "MI-204",
  "fecha_admision": ISODate("2026-09-02T14:30:00Z"), "via_ingreso": "URGENCIAS",
  "motivo_ingreso": "Fiebre, tos productiva y disnea de 3 días", "estado": "EGRESADA",
  "diagnosticos": [ { "cie10": "J18.9", "tipo": "PRINCIPAL", "fecha": ISODate("...") }, ... ],
  "notas_evolucion": [ { "fecha": ISODate("..."), "profesional_id": "PRO-001",
                         "subjetivo": "...", "objetivo": "...", "analisis": "...", "plan": "..." } ],
  "signos_vitales": [ { "fecha": ISODate("..."), "fc": 104, "fr": 26, "ta_sistolica": 128,
                        "ta_diastolica": 76, "temperatura": 38.6, "spo2": 90 } ],
  "notas_enfermeria": [ { "fecha": ISODate("..."), "enfermera_id": "ENF-001", "turno": "TARDE", "nota": "..." } ],
  "ordenes_medicamentos": [ { "medicamento_id": "MED-001", "nombre": "Ceftriaxona", "dosis": "1 g",
                              "via": "IV", "frecuencia": "cada 12 horas", "estado": "FINALIZADA", ... } ],
  "alta": { "fecha": ISODate("..."), "condicion": "MEJORADO", "destino": "Domicilio", ... }
}'''),
      P("El código JSON completo del esquema (validadores) está en <font name='Mono'>scripts/01_crear_esquema.js</font> y los "
        "documentos reales exportados en la carpeta <font name='Mono'>datos_json/</font>."),
      PageBreak()]

# ------------------------------------------------------------------ 2. Implementación
esq = leer("scripts", "01_crear_esquema.js")
S += [H1("2. Implementación"),
      P("<b>SGBD:</b> MongoDB Community 8.3.7, instalado localmente en Windows 11; cliente <b>mongosh</b>. "
        "La base de datos se llama <font name='Mono'>hce_hospitalizacion</font> y se crea con el script "
        "<font name='Mono'>01_crear_esquema.js</font>, que es idempotente (elimina y recrea la base)."),
      tabla([["Colección", "Rol", "Índices"],
             ["pacientes", "Referenciada", "único (tipo_documento, documento)"],
             ["profesionales", "Referenciada", "_id"],
             ["catalogo_cie10", "Catálogo", "_id (código CIE-10)"],
             ["catalogo_medicamentos", "Catálogo", "_id"],
             ["hospitalizaciones", "Núcleo (embebido)", "(paciente_id, fecha_admision↓) · diagnosticos.cie10 (multikey) · (servicio, estado) · ordenes_medicamentos.medicamento_id (multikey)"]],
            [4.2 * cm, 3.4 * cm, 9.4 * cm]),
      Spacer(1, 6),
      H2("2.1 Código de creación (extracto)"),
      code(esq[esq.index("hce.createCollection(\"pacientes\""):esq.index("// ---------- Hospitalizaciones")][:1600] + "  ...  (ver archivo completo)"),
      code(esq[esq.index("// ---------- Indices"):]),
      H2("2.2 Ejecución"),
      img(os.path.join(BASE, "capturas", "02_creacion_esquema.png"), tope=7 * cm),
      P("Figura 2. Creación de la base de datos, las cinco colecciones y los índices.", s_cap),
      img(os.path.join(BASE, "capturas", "01_entorno_mongodb.png"), tope=11 * cm),
      P("Figura 3. Versión del servidor, colecciones y estructura de un documento de hospitalización.", s_cap),
      PageBreak()]

# ------------------------------------------------------------------ 3. Carga de datos
S += [H1("3. Carga de datos"),
      P("Los datos de prueba son <b>100 % ficticios</b> (nombres, documentos y teléfonos inventados) y se cargan con "
        "<font name='Mono'>scripts/02_carga_datos.js</font> mediante <font name='Mono'>insertMany</font>. Cada inserción pasa por el validador del "
        "esquema. Se cargaron <b>6 pacientes</b> (mínimo exigido: 5) con <b>7 hospitalizaciones</b>, cada una con evolución, signos vitales, "
        "notas de enfermería y órdenes de medicamentos."),
      tabla([["Hospitalización", "Paciente", "Diagnóstico principal", "Servicio", "Estado"],
             ["HOSP-2026-0001", "PAC-001 · Gloria I. Ramírez (68 a)", "J18.9 Neumonía", "Medicina interna", "Egresada"],
             ["HOSP-2026-0002", "PAC-002 · Jorge E. Muñoz (74 a)", "J44.1 EPOC exacerbado", "Medicina interna", "Egresada"],
             ["HOSP-2026-0003", "PAC-003 · Sara V. Cardona (14 a)", "A09 Gastroenteritis", "Pediatría", "Egresada"],
             ["HOSP-2026-0004", "PAC-004 · Luis F. Arango (57 a)", "I21.9 Infarto agudo de miocardio", "UCI", "Egresada"],
             ["HOSP-2026-0005", "PAC-005 · María C. Echeverri (30 a)", "K35.8 Apendicitis aguda", "Cirugía", "Egresada"],
             ["HOSP-2026-0006", "PAC-006 · Héctor D. Jaramillo (51 a)", "E11.1 Diabetes con cetoacidosis", "Medicina interna", "Activa"],
             ["HOSP-2026-0007", "PAC-001 · Gloria I. Ramírez (reingreso)", "I10 Hipertensión esencial", "Medicina interna", "Activa"]],
            [2.9 * cm, 5 * cm, 4.4 * cm, 2.6 * cm, 2.1 * cm]),
      Spacer(1, 6),
      P("Totales en la base: 10 códigos CIE-10, 12 medicamentos, 6 profesionales, 6 pacientes, 7 hospitalizaciones "
        "(74 tomas de signos vitales, 17 notas de evolución, 14 notas de enfermería, 21 órdenes de medicamentos y 24 diagnósticos; "
        "ver los archivos JSON exportados)."),
      img(os.path.join(BASE, "capturas", "03_carga_datos.png"), tope=5 * cm),
      P("Figura 4. Resultado de la carga de datos.", s_cap),
      H2("3.1 Extracto del script de inserción"),
      code(leer("scripts", "02_carga_datos.js")[leer("scripts", "02_carga_datos.js").index("// ---------- Hospitalizaciones ----------"):][:2300] + "\n  ... (ver archivo completo)"),
      PageBreak()]

# ------------------------------------------------------------------ 4. Consultas
S += [H1("4. Consultas de validación"),
      P("Se ejecutaron tres consultas obligatorias (C1, C2, C3), dos adicionales (C4, C5) y una prueba de integridad (V1). "
        "Todas se ejecutaron sin errores contra la base real; la salida completa está en <font name='Mono'>resultados/salida_03_consultas.txt</font>."),
      H2("C1. Pacientes por diagnóstico"),
      P("Recupera las hospitalizaciones cuyo diagnóstico <i>principal</i> es neumonía (J18.9) y trae los datos del paciente con "
        "<font name='Mono'>$lookup</font>. Valida el índice multikey y la referencia a <i>pacientes</i>. C1b cuenta hospitalizaciones por diagnóstico."),
      code('''db.hospitalizaciones.aggregate([
  { $match: { diagnosticos: { $elemMatch: { cie10: "J18.9", tipo: "PRINCIPAL" } } } },
  { $lookup: { from: "pacientes", localField: "paciente_id", foreignField: "_id", as: "p" } },
  { $unwind: "$p" },
  { $project: { _id: 0, hospitalizacion: "$_id", paciente: { $concat: ["$p.nombres"," ","$p.apellidos"] },
                documento: "$p.documento", servicio: 1, fecha_admision: 1, estado: 1 } } ])'''),
      img(os.path.join(BASE, "capturas", "04_consulta_C1_pacientes_por_diagnostico.png"), tope=9 * cm),
      P("Figura 5. Resultado de C1 y C1b: el paciente con neumonía es Gloria Inés Ramírez Toro; hay una hospitalización por cada diagnóstico principal.", s_cap),
      H2("C2. Evolución cronológica de una hospitalización"),
      P("Desenrolla el arreglo embebido <font name='Mono'>notas_evolucion</font>, lo ordena por fecha y obtiene el nombre del médico desde "
        "<i>profesionales</i>."),
      code('''db.hospitalizaciones.aggregate([
  { $match: { _id: "HOSP-2026-0001" } },
  { $unwind: "$notas_evolucion" }, { $sort: { "notas_evolucion.fecha": 1 } },
  { $lookup: { from: "profesionales", localField: "notas_evolucion.profesional_id", foreignField: "_id", as: "prof" } },
  { $unwind: "$prof" },
  { $project: { _id: 0, fecha: "$notas_evolucion.fecha", medico: "$prof.nombre",
                analisis: "$notas_evolucion.analisis", plan: "$notas_evolucion.plan" } } ])'''),
      img(os.path.join(BASE, "capturas", "05_consulta_C2_evolucion_cronologica.png"), tope=8 * cm),
      P("Figura 6. Tres notas de evolución en orden cronológico, de la admisión (02-sep) al plan de egreso (06-sep).", s_cap),
      PageBreak(),
      H2("C3. Medicamentos asignados"),
      P("Lista las órdenes de un paciente enriquecidas con el código ATC del catálogo (C3) y los medicamentos activos de todas las "
        "hospitalizaciones activas, agrupados por paciente (C3b), con <font name='Mono'>$filter</font> y <font name='Mono'>$map</font>."),
      code('''db.hospitalizaciones.aggregate([
  { $match: { paciente_id: "PAC-006" } }, { $unwind: "$ordenes_medicamentos" },
  { $lookup: { from: "catalogo_medicamentos", localField: "ordenes_medicamentos.medicamento_id",
               foreignField: "_id", as: "cat" } }, { $unwind: "$cat" },
  { $project: { _id: 0, hospitalizacion: "$_id", medicamento: "$cat.nombre_generico", atc: "$cat.atc",
                dosis: "$ordenes_medicamentos.dosis", via: "$ordenes_medicamentos.via",
                frecuencia: "$ordenes_medicamentos.frecuencia", estado: "$ordenes_medicamentos.estado" } } ])'''),
      img(os.path.join(BASE, "capturas", "06_consulta_C3_medicamentos.png"), tope=12 * cm),
      P("Figura 7. Cuatro órdenes del paciente PAC-006 (dos finalizadas, dos activas) y los medicamentos activos por hospitalización activa.", s_cap),
      H2("C4 y C5 (adicionales). Alerta de hipoxemia y estancia promedio"),
      P("C4 detecta tomas con SpO₂ &lt; 92 % agrupadas por hospitalización (EPOC y neumonía, coherente con los diagnósticos). "
        "C5 calcula con <font name='Mono'>$dateDiff</font> la estancia promedio por servicio de las hospitalizaciones egresadas."),
      img(os.path.join(BASE, "capturas", "07_consulta_C4_C5_alertas_y_estancia.png"), tope=10 * cm),
      P("Figura 8. Resultados de C4 y C5.", s_cap),
      H2("V1. Prueba de integridad del esquema"),
      P("Se intenta registrar una frecuencia cardiaca de 400 lpm (fuera del rango fisiológico 20–250). La base la <b>rechaza</b> con el "
        "código 121 (<i>DocumentValidationFailure</i>), demostrando que el esquema flexible de MongoDB no implica ausencia de reglas."),
      img(os.path.join(BASE, "capturas", "08_validacion_integridad_V1.png"), tope=4 * cm),
      P("Figura 9. Rechazo de un signo vital inválido.", s_cap),
      PageBreak()]

# ------------------------------------------------------------------ 5. IA
S += [H1("5. Evidencia del uso de IA"),
      P("Se usó <b>Claude Code</b> (Anthropic, modelo Claude Sonnet 5.5) como asistente en la terminal del autor, con acceso al sistema de "
        "archivos y a MongoDB local. La conversación completa partió del enunciado de la tarea como <i>prompt</i> y el asistente ejecutó cada "
        "script contra la base real, de modo que los resultados de este informe son salidas verificadas. El detalle está en "
        "<font name='Mono'>ia_evidencia/EVIDENCIA_IA.md</font>."),
      tabla([["Etapa", "Aporte de la IA", "Problema que resolvió"],
             ["Diseño", "Propuso el modelo documental híbrido y justificó embebido/referenciado según ciclo de vida y cardinalidad.", "Evitar duplicar al paciente en cada ingreso y leer un ingreso completo en una sola consulta."],
             ["Generación de código", "Escribió el DDL con validación <font name='Mono'>$jsonSchema</font>, la carga de datos y los pipelines de agregación.", "Redacción de ~500 líneas de mongosh."],
             ["Depuración 1", "Ante <i>Document failed validation</i> diagnosticó que mongosh guarda como Int32 los números enteros de JavaScript y el campo <i>temperatura</i> exige <i>double</i>. Corrigió con <font name='Mono'>Double()</font>.", "La carga de datos fallaba por tipos."],
             ["Depuración 2", "MongoDB no arrancaba: leyó el log (<i>WT_PANIC … No space left on device</i>, disco con 40 MB libres), pidió autorización antes de borrar y se liberaron 3,2 GB de caché regenerable.", "Sin servidor no había consultas reales."],
             ["Verificación", "Ejecutó los tres scripts, guardó las salidas y comprobó que la validación rechaza datos inválidos.", "Resultados reproducibles y no inventados."],
             ["Documentación", "Generó el diagrama del modelo, las capturas de consola desde las salidas reales, el export JSON y este informe.", "Entregable completo y reproducible."]],
            [2.8 * cm, 9.2 * cm, 5 * cm]),
      Spacer(1, 6),
      P("<b>Responsabilidad humana:</b> el autor revisó y comprendió el código, los datos son ficticios y las decisiones clínicas simuladas "
        "son ilustrativas, no una guía médica. Los criterios de diseño (embebido vs. referenciado) fueron revisados y aceptados por el autor."),
      H1("6. Reflexión ética"),
      H2("6.1 Privacidad y confidencialidad"),
      P("Los datos de historia clínica son <b>datos sensibles</b> según el artículo 5 de la Ley 1581 de 2012, y la historia clínica está "
        "sometida a reserva (Ley 23 de 1981 y Resolución 1995 de 1999). En el modelo documental, la decisión de <b>embeber</b> hace que un único "
        "documento de hospitalización concentre diagnósticos, evolución y medicamentos: quien lo lee obtiene todo el cuadro clínico. Eso es "
        "eficiente, pero eleva el impacto de una fuga o de un acceso indebido, y complica el principio de <i>mínimo privilegio</i> porque MongoDB "
        "controla permisos por colección, no por subdocumento. Mitigaciones del diseño: (i) los datos de identificación están <b>separados</b> "
        "(<i>pacientes</i> referenciada) y las hospitalizaciones solo contienen un identificador interno, lo que permite seudonimizar para analítica; "
        "(ii) se usan vistas (<i>views</i>) o proyecciones por rol (enfermería no ve lo mismo que facturación); (iii) conviene el cifrado en "
        "reposo, TLS en tránsito y cifrado a nivel de campo (<i>Client-Side Field Level Encryption</i>) para documento e identificadores."),
      H2("6.2 Consistencia e integridad"),
      P("Al referenciar paciente, profesional y catálogos, MongoDB <b>no impone claves foráneas</b>: una referencia puede quedar huérfana. "
        "Además se desnormaliza la descripción del medicamento y del diagnóstico (<i>nombre</i>, <i>descripcion</i>) para lectura rápida; si el catálogo "
        "cambia, la copia puede quedar desactualizada. En un entorno clínico esto es un riesgo para la seguridad del paciente (un medicamento mal "
        "identificado). Se mitiga con validación <font name='Mono'>$jsonSchema</font> (tipos, enumeraciones y rangos, probado en V1), con "
        "transacciones multidocumento cuando se modifican varias colecciones, y con procesos de verificación de referencias. La <b>flexibilidad del esquema</b> es "
        "un riesgo adicional: sin validadores, dos equipos podrían guardar la temperatura como texto o en distintas unidades y corromper los análisis. Por eso se "
        "decidió definir el esquema de forma explícita aunque MongoDB no lo exija."),
      H2("6.3 Gobernanza, trazabilidad y seguridad"),
      B("<b>Trazabilidad:</b> la historia clínica no debe borrarse ni sobrescribirse; el modelo conserva el historial (estados <i>FINALIZADA</i> o <i>SUSPENDIDA</i> en lugar de eliminar órdenes). Se recomienda una colección de auditoría inmutable (quién consultó o modificó qué y cuándo)."),
      B("<b>Gobernanza:</b> responsable del tratamiento definido (la IPS o la Secretaría de Salud), política de retención conforme a la Resolución 1995 de 1999 (20 años), consentimiento y finalidad según la Ley 1581 y el principio de interoperabilidad de la Ley 2015 de 2020 (historia clínica electrónica)."),
      B("<b>Seguridad:</b> autenticación y control de acceso por roles (RBAC) en MongoDB, red privada, copias de respaldo cifradas y registro de accesos. La instalación de pruebas de este trabajo <b>no tiene autenticación</b> y solo escucha en 127.0.0.1: no es apta para datos reales."),
      B("<b>Riesgo del grafo vs. documento:</b> en un modelo de grafos las relaciones paciente–diagnóstico–medicamento son más fáciles de recorrer y también de usar para <i>reidentificar</i> personas por patrones; en el documental, el riesgo se concentra en el documento agregado. Ninguno elimina la necesidad de minimizar datos."),
      B("<b>Uso de IA:</b> los datos clínicos reales no deben enviarse a herramientas de IA externas; aquí solo se usaron datos sintéticos."),
      PageBreak()]

# ------------------------------------------------------------------ 7. División del trabajo
S += [H1("7. División del trabajo"),
      P("Este trabajo se realizó de forma <b>individual</b> (sin grupo), por lo que todas las actividades estuvieron a cargo de "
        "<b>Henry Taborda</b>, con apoyo de IA documentado en la sección 5."),
      tabla([["Actividad", "Responsable", "Producto"],
             ["Revisión conceptual (documental vs. grafos)", "Henry Taborda", "Decisión del modelo documental híbrido"],
             ["Diseño del esquema", "Henry Taborda", "Diagrama y validadores $jsonSchema"],
             ["Instalación e implementación en MongoDB", "Henry Taborda", "01_crear_esquema.js"],
             ["Datos de prueba y consultas", "Henry Taborda", "02_carga_datos.js, 03_consultas.js"],
             ["Uso y evidencia de IA", "Henry Taborda", "EVIDENCIA_IA.md"],
             ["Capturas y repositorio", "Henry Taborda", "capturas/, resultados/, datos_json/"],
             ["Reflexión ética e informe", "Henry Taborda", "Informe PDF"]],
            [6.3 * cm, 4.6 * cm, 6.1 * cm]),
      Spacer(1, 12),
      H1("Anexo. Repositorio digital"),
      P("Estructura de la carpeta de entrega (se sube a GitHub, GitLab o Drive):"),
      code('''Grupo_AE2_U2_Entrega/
├─ Grupo1_AE2_U2.pdf              <- informe
├─ README.md                      <- guía de reproducción
├─ scripts/   01_crear_esquema.js  02_carga_datos.js  03_consultas.js
│             exportar_json.py  generar_capturas.py  generar_diagrama.py
├─ datos_json/                    <- colecciones exportadas (JSON)
├─ resultados/                    <- salidas reales de mongosh (.txt)
├─ capturas/                      <- capturas de consola y diagrama (.png)
├─ ia_evidencia/EVIDENCIA_IA.md
└─ informe_fuente/                <- código que genera el PDF'''),
      P("<b>Reproducir:</b> <font name='Mono'>mongosh --file scripts/01_crear_esquema.js</font> → "
        "<font name='Mono'>02_carga_datos.js</font> → <font name='Mono'>03_consultas.js</font>.")]

doc = SimpleDocTemplate(SALIDA, pagesize=letter, leftMargin=2 * cm, rightMargin=2 * cm, topMargin=1.8 * cm, bottomMargin=2 * cm,
                        title=f"Grupo{cfg['grupo']}_AE2_U2 - Construyendo una base de datos NoSQL", author="Henry Taborda")
doc.build(S, onFirstPage=pie, onLaterPages=pie)
print("PDF generado:", SALIDA)
