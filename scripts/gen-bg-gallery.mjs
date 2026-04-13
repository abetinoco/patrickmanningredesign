import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "bg-patterns");
fs.mkdirSync(outDir, { recursive: true });

const write = (name, svg) => {
  fs.writeFileSync(path.join(outDir, name), svg.trim() + "\n", "utf8");
};

/* Geo / motif tiles: bold strokes, inset from edges to avoid clipping */
const geo = [
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="none" stroke="#4a5c56" stroke-width="2" d="M2 2h24M2 2v24"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 48 24"><path fill="none" stroke="#3d5a68" stroke-width="2" d="M2 18L12 6l10 12 10-12 10 12"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path stroke="#7a9e7e" stroke-width="2" d="M8 1v14M1 8h14"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="none" stroke="#4d7a52" stroke-width="2" d="M16 4L6 14h6l2 12 2-12h6z"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="5" cy="6" r="2" fill="#1a2620" opacity="0.35"/><circle cx="14" cy="12" r="2" fill="#1a2620" opacity="0.3"/><circle cx="9" cy="16" r="1.5" fill="#1a2620" opacity="0.28"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52"><path fill="none" stroke="#5a6b76" stroke-width="2" d="M2 18h22v16H2zm26 0h22v16H28zM12 2h20v12H12zm10 38h20v12H22z"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 20 40"><path stroke="#7a4030" stroke-width="2" d="M4 2v36M14 2v36"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="14" viewBox="0 0 40 14"><path stroke="#4a3020" stroke-width="2" d="M2 7h36"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="10" viewBox="0 0 40 10"><path stroke="#2d4a32" stroke-width="2" d="M2 5h36"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="16" viewBox="0 0 64 16"><path fill="none" stroke="#3d5a68" stroke-width="2" d="M2 10c10-5 20 5 30 0s20 5 30 0"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><rect x="2" y="3" width="10" height="9" fill="none" stroke="#6a7568" stroke-width="1.5"/><rect x="14" y="12" width="11" height="10" fill="none" stroke="#6a7568" stroke-width="1.5"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="none" stroke="#a06030" stroke-width="2" d="M18 3L33 18 18 33 3 18z"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><rect x="5" y="7" width="3" height="3" fill="#7a9ec0"/><rect x="24" y="14" width="2.5" height="2.5" fill="#e8e4dc"/><rect x="14" y="24" width="2.5" height="2.5" fill="#7a9ec0"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path stroke="#4d7a52" stroke-width="1.5" d="M1 1l10 10M11 1L1 11"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><rect x="2" y="2" width="12" height="12" fill="#1a2620" opacity="0.14"/><rect x="14" y="14" width="12" height="12" fill="#1a2620" opacity="0.14"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path stroke="#3d5940" stroke-width="1.5" d="M2 2h20M2 2v20"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88"><path fill="none" stroke="#3d5940" stroke-width="1.5" d="M12 76c22-44 44-44 66 0M22 76c18-32 36-32 54 0M32 76c14-20 28-20 42 0"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path stroke="#1a1410" stroke-width="1.5" d="M-1 13L13-1"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><path stroke="#c45a28" stroke-width="1.5" d="M14 2v36M26 2v36M2 14h36M2 26h36"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="36" viewBox="0 0 100 36"><rect y="2" width="100" height="8" fill="#d4703a" opacity="0.45"/><rect y="14" width="100" height="5" fill="#d4703a" opacity="0.28"/><rect y="24" width="100" height="4" fill="#e8e4dc" opacity="0.2"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle cx="8" cy="9" r="3.5" fill="#3d5940" opacity="0.28"/><circle cx="20" cy="7" r="3" fill="#6b4f2e" opacity="0.25"/><circle cx="15" cy="20" r="4" fill="#3d5940" opacity="0.22"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18"><circle cx="4" cy="5" r="2" fill="#1a1410" opacity="0.22"/><circle cx="11" cy="11" r="2.2" fill="#1a1410" opacity="0.2"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><circle cx="10" cy="14" r="2.5" fill="#ffdc96" opacity="0.55"/><circle cx="30" cy="24" r="2" fill="#ffdc96" opacity="0.45"/><circle cx="20" cy="34" r="2.2" fill="#ffdc96" opacity="0.4"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="12" viewBox="0 0 40 12"><rect y="1" width="40" height="4" fill="#d4c49a"/><rect y="7" width="40" height="4" fill="#e8dcb8"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="4" width="6" height="5" fill="#1a5c4a" opacity="0.35" transform="rotate(-10 6 6)"/><rect x="13" y="12" width="5" height="6" fill="#1a5c4a" opacity="0.3"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path stroke="#3d5a68" stroke-width="1.5" d="M10 2v16M2 10h16M3 3l14 14M17 3L3 17"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path stroke="#ffffff" stroke-width="1.5" d="M2 10h24M2 18h24M10 2v24M18 2v24"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="9" r="3.5" fill="#d4703a" opacity="0.4"/><circle cx="8" cy="22" r="3" fill="#d4703a" opacity="0.32"/><circle cx="24" cy="24" r="3.2" fill="#d4703a" opacity="0.34"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48"><path fill="none" stroke="#5c4020" stroke-width="1.5" d="M4 2c4 14-4 28 0 42M12 6c5 12-5 24 0 36M18 4c-3 14 3 28 0 42"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><circle cx="2.5" cy="2.5" r="1.2" fill="#1a2620" opacity="0.22"/><circle cx="7.5" cy="7.5" r="1.2" fill="#1a2620" opacity="0.22"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44"><path fill="#24302a" d="M0 44L24 16 40 28 62 8 84 24 98 12 120 30V44H0z"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="56" viewBox="0 0 32 56"><g fill="none" stroke="#1a2620" stroke-width="2"><path d="M16 2v20M2 12h28M2 28h28M2 44h28M16 56V36"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="none" stroke="#3d5940" stroke-width="1.5" d="M2 18h32M18 2v32M2 2l32 32M34 2L2 34"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="8" viewBox="0 0 40 8"><path stroke="#5a7875" stroke-width="3" d="M2 4h36"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><path fill="#1a2620" opacity="0.16" d="M2 44V22h20v22z"/><path fill="#d4703a" opacity="0.28" d="M22 2h20v20H22z"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="#d4703a" opacity="0.42" d="M14 26L2 28h24z"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="#3d5940" stroke-width="2" d="M6 18L18 6l12 12 12-12 12 12"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path stroke="#8068a0" stroke-width="1.5" d="M14 3v22M3 14h22"/><circle cx="14" cy="14" r="2" fill="#8068a0" opacity="0.35"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="32" viewBox="0 0 10 32"><path stroke="#6a5040" stroke-width="2" d="M5 2v60"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="14" cy="16" r="10" fill="#fff" opacity="0.5"/><circle cx="28" cy="24" r="9" fill="#f0ebe6" opacity="0.55"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path stroke="#ffffff" stroke-width="1.5" d="M1 9L9 1"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="10" r="4" fill="#d8a0b0" opacity="0.45"/><circle cx="10" cy="22" r="4" fill="#d8a0b0" opacity="0.4"/><circle cx="26" cy="22" r="4" fill="#d8a0b0" opacity="0.4"/><circle cx="18" cy="28" r="3.5" fill="#d8a0b0" opacity="0.38"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="20" viewBox="0 0 56 20"><path fill="none" stroke="#4a5560" stroke-width="2" d="M2 16q14-12 26 0t26 0"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" viewBox="0 0 32 16"><path fill="none" stroke="#1a2620" stroke-width="1.5" d="M2 12L8 4l6 8 6-8 6 8"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><path fill="none" stroke="#3d5940" stroke-width="2" d="M6 20V6h14M52 6h14v14M66 52v14H52M20 66H6V52"/><path fill="none" stroke="#d4703a" stroke-width="1.5" d="M36 10v10M36 52v10M10 36h10M52 36h10"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path stroke="#6b5340" stroke-width="1.5" d="M1 9L9 1"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="62" viewBox="0 0 36 62"><g fill="none" stroke="#3d6a6a" stroke-width="2"><path d="M18 2l14 8v16l-14 8-14-8V10z"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="28" viewBox="0 0 80 28"><path fill="none" stroke="#3d5940" stroke-width="1.5" d="M2 18c18-14 36 14 54 0s22 10 22 10"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="10" viewBox="0 0 44 10"><rect width="20" height="10" fill="#ede8dc"/><rect x="20" width="3" height="10" fill="#d4703a" opacity="0.55"/><rect x="23" width="18" height="10" fill="#f3ede4"/><rect x="41" width="3" height="10" fill="#1a2620" opacity="0.35"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><path fill="#b8c8d4" d="M22 22V2l20 20z"/><path fill="#c8d4c0" d="M22 22l20 20V22z"/><path fill="#d4c8b8" d="M22 22L2 42V22z"/><path fill="#e0d8d0" d="M22 22L2 2v20z"/></svg>`,
];

const realty = [
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><g fill="none" stroke="#1a2620" stroke-width="2.5" stroke-linejoin="round"><path fill="#d4703a" fill-opacity="0.15" d="M12 72L40 38L68 72V78H12z"/><rect x="44" y="54" width="14" height="24" fill="#1a2620" fill-opacity="0.08"/><path d="M40 38h56"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="100" viewBox="0 0 120 100"><g fill="none" stroke="#1a2620" stroke-width="2.5"><path fill="#3d5940" fill-opacity="0.12" d="M20 85V45h28v40H20zm52 0V32h28v53H72z"/><path d="M34 45v-8l-8 8M86 32v-10l-10 10"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="95" viewBox="0 0 130 95"><g fill="none" stroke="#1a2620" stroke-width="2.5"><path fill="#c4a574" fill-opacity="0.2" d="M8 78L42 40L76 78z"/><rect x="30" y="58" width="24" height="20"/><rect x="88" y="35" width="18" height="43" fill="#8a9eaa" fill-opacity="0.35" stroke="#1a2620"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="88" viewBox="0 0 128 88"><g fill="none" stroke="#1a2620" stroke-width="2"><path fill="#e8e0d4" fill-opacity="0.5" d="M4 78h36V48h36v30h36V38h12v40H4z"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><g fill="none" stroke="#1a2620" stroke-width="2.5"><circle cx="38" cy="42" r="14"/><path d="M48 52L68 72"/><circle cx="72" cy="68" r="6"/><path d="M72 62v-16l6 4-6 4"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="90" viewBox="0 0 110 90"><g stroke="#1a2620" stroke-width="2"><rect x="25" y="38" width="60" height="45" fill="none"/><path d="M25 38V28h60v10"/><path d="M40 38v45M55 38v45M70 38v45M25 50h60M25 65h60"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><g fill="none" stroke="#1a2620" stroke-width="2.5"><path d="M30 78V48h40v30"/><path d="M20 48h60"/><circle cx="50" cy="38" r="3" fill="#d4703a"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="100" viewBox="0 0 120 100"><g fill="none" stroke="#1a2620" stroke-width="2.5"><path fill="#d4703a" fill-opacity="0.18" d="M60 15L15 70h90z"/><rect x="48" y="52" width="24" height="18"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><g fill="none" stroke="#1a2620" stroke-width="2"><path fill="#e8e4dc" fill-opacity="0.4" d="M10 72h100V42H10z"/><rect x="22" y="52" width="10" height="10"/><rect x="40" y="52" width="10" height="10"/><rect x="58" y="52" width="10" height="10"/><rect x="76" y="52" width="10" height="10"/><rect x="94" y="52" width="10" height="10"/><path d="M10 42L60 22l50 20"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="85" viewBox="0 0 120 85"><g fill="none" stroke="#1a2620" stroke-width="2"><rect x="12" y="40" width="96" height="38" fill="#2a2a2a" fill-opacity="0.12"/><path d="M12 52h96M12 64h96"/><path d="M20 40V32h80v8"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="95" viewBox="0 0 120 95"><g fill="none" stroke="#1a2620" stroke-width="2.5"><rect x="28" y="48" width="64" height="38" fill="#d8dce0" fill-opacity="0.35"/><path d="M28 48h64"/><path d="M60 30L38 48h44z"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><g fill="none" stroke="#1a2620" stroke-width="2"><path fill="#c8d4c8" fill-opacity="0.25" d="M8 72h48V42h24v30h32V52h8v20H8z"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="100" viewBox="0 0 110 100"><g fill="none" stroke="#1a2620" stroke-width="2"><path d="M20 78V48h32v30H20zm38 0V38h32v40H58z"/><path d="M36 48v-12l-8 12M74 38v-14l-10 14"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="95" viewBox="0 0 120 95"><g fill="none" stroke="#1a2620" stroke-width="2"><circle cx="28" cy="62" r="10" fill="#3d5940" fill-opacity="0.2"/><path d="M48 72h52V45H48z"/><path d="M48 45L74 28l26 17"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><g fill="none" stroke="#1a2620" stroke-width="2"><path d="M10 72h100"/><path d="M14 72V48M26 72V52M38 72V50M50 72V52M62 72V50M74 72V52M86 72V50M98 72V52M110 72V48"/><path fill="#e8e4dc" fill-opacity="0.35" d="M35 48L60 28l25 20v44H35z"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="95" viewBox="0 0 110 95"><g fill="none" stroke="#1a2620" stroke-width="2"><rect x="38" y="22" width="34" height="8" fill="#d4703a" fill-opacity="0.35"/><path d="M42 30v42"/><rect x="32" y="52" width="46" height="26" fill="#f3ede4" fill-opacity="0.5"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="#d4703a" stroke="#1a2620" stroke-width="2" d="M50 18L28 38h12v38h20V38h12z"/><circle cx="50" cy="62" r="4" fill="none" stroke="#1a2620" stroke-width="2"/></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><g fill="none" stroke="#1a2620" stroke-width="2"><path d="M8 65h18M8 55h18M8 45h18"/><rect x="32" y="35" width="76" height="38" fill="#e8e0d4" fill-opacity="0.4"/><path d="M32 35L70 12l38 23"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><g fill="none" stroke="#1a2620" stroke-width="2"><rect x="25" y="38" width="70" height="40"/><circle cx="60" cy="22" r="6"/><path d="M54 22h12M60 16v12"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="85" viewBox="0 0 120 85"><g fill="none" stroke="#1a2620" stroke-width="2"><path fill="#d8dcd8" fill-opacity="0.4" d="M15 70h90L60 25z"/><rect x="48" y="48" width="24" height="22"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><g fill="none" stroke="#1a2620" stroke-width="1.8"><path d="M10 72h100"/><path d="M20 72V55h12v17M40 72V50h12v22M60 72V58h12v14M80 72V45h12v27M100 72V52h12v20"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="95" viewBox="0 0 120 95"><g fill="none" stroke="#1a2620" stroke-width="2"><path fill="#e8e4dc" fill-opacity="0.45" d="M20 75V48h18l8-10 8 10h46v27z"/><rect x="52" y="58" width="16" height="17"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><g fill="none" stroke="#1a2620" stroke-width="2.5"><path d="M25 45h14v30H25zm28 0h14v30H53zm28 0h14v30H81z"/><path d="M18 45h84"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="88" viewBox="0 0 120 88"><g fill="none" stroke="#1a2620" stroke-width="2"><rect x="20" y="48" width="80" height="32" fill="#c8d0d8" fill-opacity="0.35"/><path d="M20 48h80"/><path d="M35 48V38h50v10"/></g></svg>`,
  () => `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="92" viewBox="0 0 120 92"><g fill="none" stroke="#1a2620" stroke-width="2"><path fill="#b85830" fill-opacity="0.2" d="M8 70h40V45h24v25h40V52h-8V38H84L60 22 36 38H16v14h-8z"/></g></svg>`,
];

if (geo.length !== 50) throw new Error(`geo: expected 50, got ${geo.length}`);
if (realty.length !== 25) throw new Error(`realty: expected 25, got ${realty.length}`);

geo.forEach((fn, i) => write(`p${String(i + 1).padStart(2, "0")}.svg`, fn()));
realty.forEach((fn, i) => write(`p${String(i + 51).padStart(2, "0")}.svg`, fn()));

const titlesGeo = [
  "Smoky cross grid",
  "Blue Ridge chevron",
  "Deep forest plus weave",
  "Canopy crest tile",
  "Valley dot veil",
  "Cumberland flagstone",
  "Barn plank seams",
  "Barrel stave lines",
  "Bluegrass furrows",
  "River ripple",
  "Limestone chip frames",
  "Horse-country diamond",
  "Night star chips",
  "Pine crosshatch",
  "Crossroads checker",
  "Windowpane grid",
  "Topo contour bands",
  "Tin roof diagonals",
  "Quilt grid lines",
  "Sunrise band stack",
  "Moss stone blobs",
  "Creek pebble pairs",
  "Firefly glow dots",
  "Wheat banding",
  "Copper patina chips",
  "Ice crystal mesh",
  "Charcoal basket weave",
  "Terracotta blooms",
  "Sycamore waves",
  "Fog halftone",
  "Smoky ridge silhouette",
  "Honeycomb lattice",
  "Argyle cross",
  "Dock board seams",
  "Brand diagonal tiles",
  "Ember corner wedge",
  "Wind rose burst",
  "Twilight crosshair",
  "Saddle cord ribs",
  "Cotton puff clouds",
  "Coal seam diagonals",
  "Dogwood quatrefoil",
  "Thunder scallops",
  "Zig rail fence",
  "Editorial brackets",
  "Map hachure",
  "Hex frost",
  "Rolling hill waves",
  "State line bars",
  "Pinwheel quarters",
];

const titlesRealty = [
  "Cottage & gable roof",
  "Two-story pair",
  "Farmhouse & silo",
  "Townhouse row",
  "Skeleton key",
  "Window mullion grid",
  "Arched entry",
  "A-frame cabin",
  "Colonial façade",
  "Garage panel doors",
  "Dormer & chimney",
  "Duplex side-by-side",
  "Townhome stacks",
  "Yard tree & house",
  "Picket fence & home",
  "Open-house sign",
  "Map-pin home",
  "Key & ring",
  "Shingle roof lines",
  "Chimney & roof",
  "Bay window front",
  "Hip roof cottage",
  "Triple gable street",
  "Flat modern row",
  "Barn & gambrel",
];

const lightsGeo = [
  true, true, false, false, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, false, true, true, false, true, true, true, false, true, true, true, false, true, true, true, true, false, true, false, true, true, false, true, true, true, true, true, true, true, true, true,
];

const lightsRealty = lightsGeo.slice(0, 25).map(() => true);

const bgsGeo = [
  "#e8e6e1", "#dce6e4", "#141c18", "#1a2620", "#f7f6f2", "#dcdfe0", "#ede4dc", "#d8c4a8", "#e2eadc", "#c8d8d6", "#e8e9e6", "#f2e8d8", "#12161a", "#182018", "#f3ede4", "#ebe6de", "#f0ebe3", "#e8e4dc", "#f5f0e8", "#1a2620", "#e3e6e2", "#ddd9d2", "#121a16", "#f2ead8", "#ddd4c8", "#eef2f4", "#1e2220", "#f5efe6", "#ebe6df", "#eef0ed", "#1a2620", "#f2efe8", "#f0ebe4", "#b8c8c8", "#f7f4ed", "#1a2620", "#f5f2ec", "#1a1820", "#d4c4b0", "#faf9f7", "#0c0e0d", "#faf4f4", "#d0d6dc", "#f0ebe4", "#f5f2ec", "#ede4d4", "#dceaea", "#e4ebe6", "#f7f4ed", "#e8e4dc",
];

const bgsRealty = Array(25).fill("#f7f4ed");

const sizesGeo = [
  "28px 28px", "48px 24px", "16px 16px", "32px 32px", "20px 20px", "52px 52px", "20px 40px", "40px 14px", "40px 10px", "64px 16px", "28px 28px", "36px 36px", "36px 36px", "12px 12px", "28px 28px", "24px 24px", "88px 88px", "12px 12px", "40px 40px", "100% 36px", "30px 30px", "16px 18px", "44px 44px", "40px 12px", "24px 24px", "20px 20px", "28px 28px", "34px 34px", "24px 48px", "10px 10px", "120px 44px", "32px 56px", "36px 36px", "40px 8px", "44px 44px", "28px 28px", "48px 48px", "28px 28px", "10px 32px", "40px 40px", "10px 10px", "36px 36px", "56px 20px", "32px 16px", "72px 72px", "10px 10px", "36px 62px", "80px 28px", "44px 10px", "44px 44px",
];

const sizesRealty = Array(25).fill("120px 100px");

const manifest = [];
for (let i = 0; i < 50; i++) {
  manifest.push({
    t: titlesGeo[i],
    light: lightsGeo[i],
    bg: bgsGeo[i],
    src: `bg-patterns/p${String(i + 1).padStart(2, "0")}.svg`,
    size: sizesGeo[i],
  });
}
for (let i = 0; i < 25; i++) {
  manifest.push({
    t: titlesRealty[i],
    light: lightsRealty[i],
    bg: bgsRealty[i],
    src: `bg-patterns/p${String(i + 51).padStart(2, "0")}.svg`,
    size: sizesRealty[i],
  });
}

const pub = path.join(root, "public");
fs.writeFileSync(path.join(pub, "bg-gallery-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
fs.writeFileSync(path.join(pub, "bg-gallery-manifest.js"), `window.BG_GALLERY=${JSON.stringify(manifest)};`, "utf8");

console.log(`Wrote ${geo.length + realty.length} SVGs to ${outDir}, manifest.json, and manifest.js.`);
