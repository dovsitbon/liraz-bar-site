// Génère CONTENU.md : tous les textes du site dans les 4 langues, côte à côte, pour validation.
//   node scripts/contenu.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LANGS = ["he", "en", "fr", "es"];
const NAMES = { he: "Hébreu", en: "Anglais", fr: "Français", es: "Espagnol" };
const dicts = Object.fromEntries(LANGS.map((l) => [l, JSON.parse(readFileSync(path.join(ROOT, "locales", `${l}.json`), "utf8"))]));
const data = (f) => JSON.parse(readFileSync(path.join(ROOT, "data", f), "utf8"));

const flat = (o, p = "", out = []) => {
  if (Array.isArray(o)) o.forEach((v, i) => flat(v, `${p}[${i}]`, out));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) flat(v, p ? `${p}.${k}` : k, out);
  else out.push([p, o]);
  return out;
};
const get = (o, p) => p.split(/\.|\[|\]/).filter(Boolean).reduce((a, k) => a?.[k], o);

let md = `# Liraz Bar – לירז בר : contenus du site (4 langues)

Généré par \`node scripts/contenu.mjs\` depuis \`locales/*.json\` et \`data/*.json\`. Pour modifier un texte : changer le fichier de langue, puis relancer.

`;
md += `## Titre du hero : 3 propositions

Retenue sur le site : **A**.

| | Hébreu | Anglais | Français | Espagnol |
|---|---|---|---|---|
| A | מהרעיון הראשון ועד הריקוד האחרון | From the first idea to the last dance | De la première idée à la dernière danse | De la primera idea al último baile |
| B | האירוע שלכם, בידיים בטוחות | Your celebration, in safe hands | Votre fête, entre de bonnes mains | Vuestra fiesta, en buenas manos |
| C | רגעים של אושר, מתוכננים עד הפרט האחרון | Moments of joy, planned down to the last detail | Des moments de bonheur, pensés jusqu’au moindre détail | Momentos de felicidad, pensados hasta el último detalle |

`;

const sections = Object.keys(dicts.he).filter((k) => k !== "alt");
for (const s of sections) {
  md += `## ${s}\n\n| Clé | ${LANGS.map((l) => NAMES[l]).join(" | ")} |\n|---|${LANGS.map(() => "---").join("|")}|\n`;
  for (const [k] of flat(dicts.he[s], s)) md += `| \`${k}\` | ${LANGS.map((l) => String(get(dicts[l], k) ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ")} |\n`;
  md += "\n";
}

for (const [file, title] of [["annonces.json", "Bandeau d'infos (data/annonces.json)"], ["realisations.json", "Événements réalisés (data/realisations.json)"], ["infos.json", "Régions (data/infos.json)"], ["avis.json", "Avis réels (data/avis.json)"]]) {
  const j = data(file);
  md += `## ${title}\n\n`;
  const rows = j.items ?? [j];
  for (const r of rows) {
    md += `| ${r.id ?? "infos"} | ${LANGS.map((l) => NAMES[l]).join(" | ")} |\n|---|${LANGS.map(() => "---").join("|")}|\n`;
    for (const key of ["name", "title", "text", "regionsLabel"]) if (r[key] && typeof r[key] === "object") md += `| ${key} | ${LANGS.map((l) => r[key][l]).join(" | ")} |
`;
    md += "\n";
  }
}

md += `## Textes alternatifs des images (alt)\n\n| Image | ${LANGS.map((l) => NAMES[l]).join(" | ")} |\n|---|${LANGS.map(() => "---").join("|")}|\n`;
for (const k of Object.keys(dicts.he.alt)) md += `| ${k} | ${LANGS.map((l) => dicts[l].alt[k]).join(" | ")} |\n`;

writeFileSync(path.join(ROOT, "CONTENU.md"), md);
console.log("CONTENU.md écrit");
