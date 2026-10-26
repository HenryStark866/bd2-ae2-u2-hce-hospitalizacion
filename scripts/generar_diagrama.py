"""Diagrama del modelo hibrido (embebido + referenciado)."""
import os
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig, ax = plt.subplots(figsize=(13, 7.4)); ax.set_xlim(0, 13); ax.set_ylim(0, 7.4); ax.axis("off")

def caja(x, y, w, h, titulo, lineas, fc, ec):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.12", fc=fc, ec=ec, lw=1.6))
    ax.text(x + w / 2, y + h - 0.25, titulo, ha="center", va="center", fontsize=11, fontweight="bold", color=ec)
    for i, l in enumerate(lineas):
        ax.text(x + 0.15, y + h - 0.6 - i * 0.28, l, fontsize=8.2, va="center", family="monospace")

# Nucleo
ax.add_patch(FancyBboxPatch((4.2, 0.3), 4.7, 6.7, boxstyle="round,pad=0.02,rounding_size=0.15", fc="#eef6ff", ec="#1f5fa8", lw=2.2))
ax.text(6.55, 6.75, "hospitalizaciones  (documento raiz)", ha="center", fontsize=12, fontweight="bold", color="#1f5fa8")
raiz = ["_id  'HOSP-2026-0001'", "paciente_id  ---> pacientes", "medico_tratante_id ---> profesionales",
        "ips, servicio, cama, via_ingreso", "fecha_admision, motivo_ingreso, estado"]
for i, l in enumerate(raiz): ax.text(4.35, 6.35 - i * 0.28, l, fontsize=8.2, family="monospace")
emb = [("diagnosticos[]", "cie10 --> catalogo_cie10, tipo, fecha"),
       ("notas_evolucion[]", "fecha, profesional_id, SOAP"),
       ("signos_vitales[]", "fecha, fc, fr, TA, temp, spo2"),
       ("notas_enfermeria[]", "fecha, enfermera_id, turno, nota"),
       ("ordenes_medicamentos[]", "medicamento_id --> catalogo, dosis, via, estado"),
       ("alta {}", "fecha, condicion, destino, recomendaciones")]
for i, (t, d) in enumerate(emb):
    y = 4.55 - i * 0.7
    ax.add_patch(FancyBboxPatch((4.4, y), 4.3, 0.58, boxstyle="round,pad=0.01,rounding_size=0.08", fc="#fff8e1", ec="#c98a00", lw=1.2))
    ax.text(4.5, y + 0.38, t, fontsize=9, fontweight="bold", color="#8a5d00"); ax.text(4.5, y + 0.14, d, fontsize=7.6, family="monospace")
ax.text(6.55, 0.12, "EMBEBIDO: nace y muere con la hospitalizacion", ha="center", fontsize=8.5, style="italic", color="#8a5d00")

caja(0.2, 4.7, 3.4, 2.3, "pacientes", ["_id 'PAC-001'", "tipo_documento, documento", "nombres, apellidos", "fecha_nacimiento, sexo", "contacto{}, aseguramiento{}", "alergias[], antecedentes[]"], "#e9f7ef", "#1e8449")
caja(0.2, 2.2, 3.4, 1.9, "profesionales", ["_id 'PRO-001' / 'ENF-001'", "nombre, rol, especialidad", "registro_medico"], "#e9f7ef", "#1e8449")
caja(9.5, 4.9, 3.3, 1.7, "catalogo_cie10", ["_id 'J18.9'", "descripcion, capitulo"], "#f4ecf7", "#7d3c98")
caja(9.5, 2.6, 3.3, 1.9, "catalogo_medicamentos", ["_id 'MED-001'", "nombre_generico, atc", "forma, concentracion"], "#f4ecf7", "#7d3c98")
kw = dict(arrowprops=dict(arrowstyle="->", color="#444", lw=1.5))
ax.annotate("", xy=(3.6, 5.9), xytext=(4.2, 6.2), **kw); ax.text(3.65, 6.35, "REF 1:N", fontsize=8, color="#444")
ax.annotate("", xy=(3.6, 3.3), xytext=(4.2, 5.6), **kw); ax.text(3.55, 4.35, "REF N:1", fontsize=8, color="#444")
ax.annotate("", xy=(9.5, 5.8), xytext=(8.7, 5.0), **kw)
ax.annotate("", xy=(9.5, 3.6), xytext=(8.7, 2.0), **kw)
ax.text(0.2, 1.1, "Verde = colecciones referenciadas (entidades compartidas)\nMorado = catalogos controlados\nAmarillo = subdocumentos embebidos", fontsize=8.5)
ax.set_title("Modelo documental hibrido - HCE basica, subsistema de hospitalizacion (MongoDB)", fontsize=12.5, pad=6)
plt.savefig(os.path.join(os.path.dirname(__file__), "..", "capturas", "00_diagrama_esquema.png"), dpi=160, bbox_inches="tight")
