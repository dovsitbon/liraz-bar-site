// Trie les photos de Liraz (assets/raw/lirazbar_NN_<code>.jpg, une par publication Instagram dans l'ordre du profil)
// dans assets/<catégorie>/ avec des noms lisibles, puis les prépare pour le web dans public/media/<catégorie>/.
// next/image sert ensuite AVIF/WebP.   npm run media
//
// Écartés volontairement : photos personnelles et de famille (enfants, selfies), anciens coffrets cadeaux et fleurs
// séchées (2021, hors activité événementielle), visuels chargés de texte (affiches ZOOG, couvertures « Tik tok »),
// photos où des invités sont reconnaissables au premier plan, images trop petites ou floues.
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const rawFiles = await readdir(path.join(ROOT, "assets/raw"));
const R = (n) => {
  const f = rawFiles.find((x) => x.startsWith(`lirazbar_${n}_`));
  if (!f) throw new Error(`Photo ${n} introuvable`);
  return `raw/${f}`;
};

// [source (dans assets/), catégorie, nom, recadrage facultatif en fractions {left, right}]
const PICKS = [
  // Hero : le slow de la bar-mitsva d'Osher (famille Mishayev, mai 2026), étincelles froides et fumée lourde
  [R("02"), "hero", "slow-etincelles"],

  // Bar et bat-mitsva
  [R("23"), "bar-bat-mitsva", "arches-bar-mitzvah"],
  [R("13"), "bar-bat-mitsva", "bar-mitzvah-noir-or"],
  [R("63"), "bar-bat-mitsva", "bat-mitzvah-bar-rose"],
  [R("04"), "bar-bat-mitsva", "bat-mitzvah-oriya"],
  [R("12"), "bar-bat-mitsva", "bar-mitzvah-roman"],
  [R("20"), "bar-bat-mitsva", "bat-mitzvah-peleg"],
  [R("28"), "bar-bat-mitsva", "bat-mitzvah-leann"],
  [R("44"), "bar-bat-mitsva", "bat-mitzvah-carrosse"],
  [R("75"), "bar-bat-mitsva", "bar-mitzvah-eliav"],
  [R("69"), "bar-bat-mitsva", "bar-mitzvah-elad"],
  [R("146"), "bar-bat-mitsva", "bar-mitzvah-amit"],
  [R("167"), "bar-bat-mitsva", "bat-mitzvah-shay"],
  [R("142"), "bar-bat-mitsva", "bat-mitzvah-noa"],

  // Mariages : en attente de ses photos de mariage (seul visuel : mur photo doré, robe blanche)
  [R("41"), "mariages", "mur-sequins-or"],

  // Événements privés et d'entreprise
  [R("137"), "prives", "welcome-baby-girl"],
  [R("157"), "prives", "full-moon-party"],
  [R("08"), "prives", "gala-lfa"],

  // Décoration et design
  [R("66"), "decoration", "bar-sucre-roses"],
  [R("19"), "decoration", "spheres-miroir"],
  [R("25"), "decoration", "artiste-led"],
  [R("61"), "decoration", "bar-ballons-rose"],
  [R("18"), "decoration", "danseuses-bat-mitzvah"],

  // Portrait : Liraz au travail, en train de dresser un bar sucré (à confirmer, et à remplacer par un vrai portrait)
  [R("56"), "portrait", "liraz-bar-sucre"],
];

// Galerie de réserve (non publiée sur le site pour l'instant)
const RESERVE = [["10", "lettres-geantes-lfa"], ["40", "mur-disco"], ["171", "piano-miroir"], ["180", "lettres-lumineuses"], ["37", "bar-mitzvah-noir-or-2"], ["76", "bar-mitzvah-eliav-2"], ["174", "scene-dj"], ["03", "dj-kobi-bar"]];

const sizes = {};
for (const [src, cat, name, crop] of PICKS) {
  const file = path.join(ROOT, "assets", src);
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  await copyFile(file, path.join(ROOT, "assets", cat, `${name}.jpg`));
  let pipe = sharp(file).rotate();
  if (crop) {
    const { width, height } = await sharp(file).metadata();
    const left = Math.round(width * crop.left);
    pipe = pipe.extract({ left, top: 0, width: Math.round(width * crop.right) - left, height });
  }
  const info = await pipe
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
  sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
}

await mkdir(path.join(ROOT, "assets/galerie"), { recursive: true });
for (const [n, name] of RESERVE) await copyFile(path.join(ROOT, "assets", R(n)), path.join(ROOT, "assets/galerie", `${name}.jpg`));

// Emplacements prévus pour les photos et vidéos qu'elle enverra
for (const dir of ["a-recevoir/photos", "a-recevoir/videos", "a-recevoir/logo"]) await mkdir(path.join(ROOT, "assets", dir), { recursive: true });

// Image de partage (Open Graph) 1200 × 630
await sharp(path.join(ROOT, "assets", R("02")))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`${PICKS.length} images prêtes`);
