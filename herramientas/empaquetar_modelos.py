"""Regenera modelos/modelos.js a partir de los .glb (ejecutar desde la raíz del repo:
python3 herramientas/empaquetar_modelos.py). Sirve para abrir index.html con doble clic."""
import base64, json
ids = {"pesebre": "pesebre.glb", "sagrada": "sagrada_familia.glb", "virgen": "virgen.glb",
       "rey": "cascanueces_rey.glb", "soldado": "cascanueces_soldado.glb", "tambor": "cascanueces_tambor.glb"}
out = {k: base64.b64encode(open("modelos/" + f, "rb").read()).decode() for k, f in ids.items()}
with open("modelos/modelos.js", "w") as fh:
    fh.write("/* Copia de los modelos .glb en base64 para abrir index.html con doble clic (sin servidor). Se genera con herramientas/empaquetar_modelos.py */\n")
    fh.write("window.MODELOS_EMBEBIDOS=" + json.dumps(out) + ";\n")
