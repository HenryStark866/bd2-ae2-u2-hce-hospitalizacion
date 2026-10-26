"""Renderiza como imagenes (estilo consola) las salidas reales de mongosh guardadas en resultados/."""
import os, re
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.join(os.path.dirname(__file__), "..")
RES, CAP = os.path.join(BASE, "resultados"), os.path.join(BASE, "capturas")
FONT = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)
BG, FG, TIT, ACC = (30, 30, 30), (212, 212, 212), (56, 56, 56), (78, 201, 176)

def render(titulo, lineas, destino):
    lh, pad = 19, 14
    w = max(900, int(max(FONT.getlength(l) for l in lineas)) + pad * 2)
    h = 34 + pad * 2 + lh * len(lineas)
    im = Image.new("RGB", (w, h), BG); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, w, 30], fill=TIT)
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse([10 + i * 20, 9, 22 + i * 20, 21], fill=c)
    d.text((80, 7), titulo, font=FONT, fill=FG)
    y = 34 + pad
    for l in lineas:
        col = ACC if l.startswith(("mongosh>", "====")) else FG
        d.text((pad, y), l, font=FONT, fill=col); y += lh
    im.save(destino)

def leer(n): return open(os.path.join(RES, n), encoding="utf-8").read().rstrip().splitlines()

render("mongosh - entorno y estructura de un documento", leer("salida_00_entorno.txt"), os.path.join(CAP, "01_entorno_mongodb.png"))
render("mongosh --file 01_crear_esquema.js", leer("salida_01_crear_esquema.txt"), os.path.join(CAP, "02_creacion_esquema.png"))
render("mongosh --file 02_carga_datos.js", leer("salida_02_carga_datos.txt"), os.path.join(CAP, "03_carga_datos.png"))

lin = leer("salida_03_consultas.txt")
bloques, actual = [], None
for l in lin:
    if l.startswith("===================="):
        actual = [l]; bloques.append(actual)
    elif actual is not None and l.strip():
        actual.append(l)
grupos = {"04_consulta_C1_pacientes_por_diagnostico": (0, 2), "05_consulta_C2_evolucion_cronologica": (2, 3),
          "06_consulta_C3_medicamentos": (3, 5), "07_consulta_C4_C5_alertas_y_estancia": (5, 7),
          "08_validacion_integridad_V1": (7, 8)}
for nombre, (a, b) in grupos.items():
    ls = [x for bl in bloques[a:b] for x in bl]
    render("mongosh --file 03_consultas.js", ls, os.path.join(CAP, nombre + ".png"))
print(sorted(os.listdir(CAP)))
