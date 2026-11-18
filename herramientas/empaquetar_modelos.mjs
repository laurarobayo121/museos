// Genera modelos/embebidos/<pieza>.js (modelo sin Draco, en base64) a partir de modelos/*.glb.
// Uso, desde la raíz del repo:
//   npm i @gltf-transform/core@4.1.1 @gltf-transform/extensions@4.1.1 @gltf-transform/functions@4.1.1 draco3dgltf@1.5.7
//   node herramientas/empaquetar_modelos.mjs
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { quantize } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import fs from 'fs';
const PIEZAS = { pesebre: 'pesebre.glb', sagrada: 'sagrada_familia.glb', virgen: 'virgen.glb',
  rey: 'cascanueces_rey.glb', soldado: 'cascanueces_soldado.glb', tambor: 'cascanueces_tambor.glb' };
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule() });
fs.mkdirSync('modelos/embebidos', { recursive: true });
for (const [id, f] of Object.entries(PIEZAS)) {
  const doc = await io.read(`modelos/${f}`);
  for (const e of doc.getRoot().listExtensionsUsed()) if (e instanceof KHRDracoMeshCompression) e.dispose();
  await doc.transform(quantize());
  const b64 = Buffer.from(await io.writeBinary(doc)).toString('base64');
  fs.writeFileSync(`modelos/embebidos/${id}.js`,
    `/* Copia de modelos/${f} sin compresión Draco, en base64. Se genera con herramientas/empaquetar_modelos.mjs */\n` +
    `(window.MODELOS_EMBEBIDOS=window.MODELOS_EMBEBIDOS||{})[${JSON.stringify(id)}]=${JSON.stringify(b64)};\n`);
  console.log(id, 'listo');
}
