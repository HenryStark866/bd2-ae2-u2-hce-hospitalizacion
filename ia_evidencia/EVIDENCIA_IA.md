# Evidencia del uso de IA en el proceso

**Herramienta:** Claude Code (Anthropic, modelo Claude Sonnet 5.5) ejecutándose en el equipo del estudiante (trabajo individual), con acceso a la terminal, al sistema de archivos y a MongoDB local.
**Fecha de la sesión:** 25 de octubre de 2026.

## Prompt inicial

> «hazme por favor esta tarea al pie de la letra: [enunciado completo de la Tarea AE2-U2: *Construyendo una base de datos NoSQL*, con rúbrica] y pon lo de la entrega en una carpeta nueva y lista para subirla»

## Qué hizo la IA, etapa por etapa

| Etapa | Qué pidió el autor | Aporte de la IA | Problema que resolvió |
|---|---|---|---|
| **1. Diseño** | Definir el modelo para hospitalización | Propuso un modelo **documental híbrido** en MongoDB: subdocumentos *embebidos* (diagnósticos, evolución, signos vitales, notas de enfermería, órdenes de medicamentos, alta) y *referencias* a pacientes, profesionales y catálogos CIE-10 / medicamentos. Justificó cada decisión por ciclo de vida y cardinalidad. | Evitar duplicar datos del paciente en cada ingreso y, a la vez, leer un ingreso completo con una sola consulta. |
| **2. Generación de código** | Esquema, datos y consultas | Escribió `01_crear_esquema.js` (colecciones con validación `$jsonSchema` e índices), `02_carga_datos.js` (6 pacientes, 7 hospitalizaciones, catálogos) y `03_consultas.js` (pipelines de agregación con `$lookup`, `$unwind`, `$filter`, `$dateDiff`). | Ahorró la redacción manual de ~500 líneas de JavaScript de mongosh. |
| **3. Depuración (error real 1)** | — | Al ejecutar la carga apareció `MongoBulkWriteError: Document failed validation`. La IA identificó la causa: *mongosh guarda como `Int32` los números JS de valor entero*, y el campo `temperatura` está declarado `double`, así que valores como `37` eran rechazados. Corrigió con `Double(...)` en el generador de signos vitales. | La validación de esquema funcionó como debe; el error estaba en el tipo del dato de prueba. |
| **4. Depuración de entorno (error real 2)** | Levantar MongoDB | El servicio `MongoDB` no podía iniciarse sin permisos de administrador. La IA lanzó `mongod` como proceso propio y leyó el log: `WT_PANIC … No space left on device` (el disco C: tenía **40 MB libres**). Pidió autorización al estudiante antes de borrar nada; se liberaron 3,2 GB de caché regenerable de npm y MongoDB arrancó (v8.3.7). | Sin esto no habría podido ejecutarse ninguna consulta real. |
| **5. Verificación** | Consultas que funcionen | Ejecutó los tres scripts contra la base real, guardó las salidas en `resultados/` y comprobó que la validación rechaza un signo vital fuera de rango (`código 121`). | Los resultados del informe son salidas reales, no inventadas. |
| **6. Documentación** | Informe PDF y repositorio | Generó el diagrama del modelo (`matplotlib`), las capturas de consola a partir de las salidas reales (`Pillow`), el export JSON (`pymongo`), el informe PDF (`reportlab`) y el borrador de la reflexión ética. | Entregable completo y reproducible con un solo comando por script. |

## Qué revisó el autor (responsabilidad humana)

- Los datos de pacientes son **ficticios**; ninguno corresponde a una persona real.
- El autor debe leer y entender los scripts, ajustar el texto de la reflexión ética con sus propias palabras.
- Las decisiones clínicas simuladas (diagnósticos, esquemas de medicamentos) son ilustrativas y **no** son una guía médica.

> Si el autor usó además ChatGPT, Gemini o Copilot, agregue aquí las capturas de esas conversaciones con el contexto de cada una.
