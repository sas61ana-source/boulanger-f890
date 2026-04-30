import { useState, useEffect, useRef, useMemo } from "react";
import {
  RotateCcw,
  Send,
  LogOut,
  Bell,
  BellOff,
  User,
  Lock,
  MessageCircle,
  Users,
  Shield,
  Settings,
  Target,
  Award,
  Trophy,
  Plus,
  Trash2,
  X,
  Unlock,
  AlertCircle,
  PartyPopper,
  TrendingUp,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  MapPin,
  Hand,
  Euro,
  Zap,
  Check,
  History,
  Clock,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Gift,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  FileImage,
  Minus,
  Package,
  PackageCheck,
  Pin,
  AtSign,
  UserCheck,
  Maximize2,
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneForwarded,
  MessageCircle,
  Home,
  LayoutGrid,
  Edit2,
  Wrench,
  Truck,
  Download,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Briefcase,
  BarChart,
  UserPlus,
  Copy,
  Wifi,
  Video,
} from "lucide-react";

// ========================================================================
// CONFIG
// ========================================================================
const ADMIN_FC = "FC1309";
// Hash pré-calculé du mot de passe admin — le mot de passe en clair
// n'apparaît jamais dans le code source ni dans l'interface.
const ADMIN_PASSWORD_HASH = "1r4g0bl:6";
const ADMIN_DEFAULT_PRENOM = "Admin";

const DEFAULT_INTERACTIONS = [
  // INFINITY (gros électroménager / équipement)
  { id: "infinity_uno", label: "Infinity Uno", emoji: "1️⃣", points: 7, type: "count" },
  { id: "infinity_duo", label: "Infinity Duo", emoji: "2️⃣", points: 10, type: "count" },
  { id: "infinity_trio", label: "Infinity Trio", emoji: "3️⃣", points: 15, type: "count" },
  // INFINITY SMARTPHONE
  { id: "infinity_solo", label: "Infinity Solo", emoji: "📱", points: 7, type: "count" },
  { id: "infinity_famille", label: "Infinity Famille", emoji: "👪", points: 15, type: "count" },
  // PO (montant HT)
  { id: "po", label: "PO", emoji: "🛡️", points: 0, type: "amount", unit: "€ HT" },
  // Club+
  { id: "clubplus", label: "Club+", emoji: "⭐", points: 5, type: "count" },
  // Crédit Oney / B+
  { id: "oney", label: "Crédit Oney / B+", emoji: "💳", points: 7, type: "count" },
  // Canal+
  { id: "canalplus", label: "Canal+", emoji: "📺", points: 5, type: "count" },
  // Garantie (montant € du CA garantie)
  { id: "garantie", label: "Garantie", emoji: "✅", points: 0, type: "amount", unit: "€ HT" },
];

const DEFAULT_ZONES = [
  { id: "gam", label: "GAM", emoji: "🏠" },
  { id: "pam_aspi", label: "PAM Aspirateur", emoji: "🧹" },
  { id: "pam_cuiseur", label: "PAM Robot cuiseur", emoji: "🍳" },
  { id: "pc", label: "PC portable", emoji: "💻" },
  { id: "tv", label: "TV", emoji: "📺" },
  { id: "son", label: "Son / Casques", emoji: "🎧" },
  { id: "audit", label: "Auditorium", emoji: "🎬" },
  { id: "caisse", label: "Caisse", emoji: "💶" },
  { id: "credit", label: "Crédit", emoji: "💳" },
  { id: "zagg", label: "Zagg", emoji: "📱" },
  { id: "aide_retrait", label: "Aide retrait", emoji: "📦" },
];

// Paliers de récompenses annuels (admin peut éditer)
// Les 7 grades commerciaux — seuils en cumul de points
// Seuil = nombre de points à dépasser pour PASSER au grade suivant
const GRADES = [
  {
    id: "debutant",
    label: "Débutant",
    short: "Déb.",
    emoji: "🌱",
    nextAt: 2000, // Débutant → Confirmé
    color: "#22c55e",
    gradientFrom: "from-green-400",
    gradientTo: "to-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
  {
    id: "confirme",
    label: "Confirmé",
    short: "Conf.",
    emoji: "⭐",
    nextAt: 4500, // Confirmé → Expert (seuil ABSOLU)
    color: "#3b82f6",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  {
    id: "expert",
    label: "Expert",
    short: "Exp.",
    emoji: "🏆",
    nextAt: 7000,
    color: "#8b5cf6",
    gradientFrom: "from-purple-500",
    gradientTo: "to-violet-600",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-300",
  },
  {
    id: "coord",
    label: "Coordinateur commerce",
    short: "Coord. Co.",
    emoji: "🎯",
    nextAt: 10000,
    color: "#ec4899",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-600",
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-300",
  },
  {
    id: "resp_univ",
    label: "Responsable univers",
    short: "Resp. Univ.",
    emoji: "🌟",
    nextAt: 14000,
    color: "#f59e0b",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  {
    id: "chef_ventes",
    label: "Chef des ventes",
    short: "Chef V.",
    emoji: "👑",
    nextAt: 20000,
    color: "#ef4444",
    gradientFrom: "from-red-500",
    gradientTo: "to-rose-700",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-300",
  },
  {
    id: "rcp",
    label: "Responsable de centre de profit",
    short: "RCP",
    emoji: "💎",
    nextAt: null, // grade final
    color: "#0f172a",
    gradientFrom: "from-slate-800",
    gradientTo: "to-black",
    bg: "bg-slate-100",
    text: "text-slate-900",
    border: "border-slate-400",
  },
];

// ========================================================================
// MOTEUR DE CALCUL DE COMMISSION
// ========================================================================
// Entrées : counts/amounts par interaction + KPIs mensuels (marge %, NPS, taux crédit, taux Infinity, taux B+)
// Sortie : détail des lignes de commission + total
// ========================================================================

/**
 * Calcule la commission mensuelle d'un vendeur.
 *
 * @param {object} data
 *   - counts : {infinity_uno, infinity_duo, infinity_trio, infinity_solo, infinity_famille, clubplus, oney, canalplus}
 *   - amounts : {po, garantie} en €HT
 *   - kpis : {margePct, tauxCreditPct, tauxInfinityPct, npsTrimestrePct}
 *   - canalMonthsWithoutCancel : nombre de Canal+ vendus il y a 3 mois et toujours actifs (peut être 0)
 * @returns {object} lignes + total
 */
function computeCommission(data) {
  const counts = data.counts || {};
  const amounts = data.amounts || {};
  const kpis = data.kpis || {};

  const lines = [];
  let total = 0;

  // --- PO ---
  // 5% si PO, 10% si et seulement si la marge individuelle ≥ 25%
  const poAmount = amounts.po || 0;
  const margeOk = (kpis.margePct || 0) >= 25;
  if (poAmount > 0) {
    const taux = margeOk ? 0.1 : 0.05;
    const gain = Math.round(poAmount * taux * 100) / 100;
    lines.push({
      category: "PO",
      label: margeOk
        ? `PO × 10 % (marge ≥ 25 % ✓)`
        : `PO × 5 % (marge < 25 %)`,
      detail: `CA HT réalisé : ${poAmount.toFixed(2)} €`,
      amount: gain,
    });
    total += gain;
  }

  // --- INFINITY (Uno/Duo/Trio) ---
  const uno = counts.infinity_uno || 0;
  const duo = counts.infinity_duo || 0;
  const trio = counts.infinity_trio || 0;
  const infinityVol = uno + duo + trio;
  let infinityGain = uno * 7 + duo * 10 + trio * 15;
  if (infinityVol >= 10) {
    lines.push({
      category: "Infinity",
      label: `Bonus volume ≥ 10 Infinity`,
      detail: `${infinityVol} Infinity vendus ce mois`,
      amount: 100,
    });
    total += 100;
  }
  if (infinityVol >= 15) {
    lines.push({
      category: "Infinity",
      label: `Bonus volume ≥ 15 Infinity`,
      detail: `+100 € supplémentaires`,
      amount: 100,
    });
    total += 100;
  }
  if (infinityGain > 0) {
    lines.push({
      category: "Infinity",
      label: `Commission Infinity`,
      detail: `${uno} Uno × 7 € + ${duo} Duo × 10 € + ${trio} Trio × 15 €`,
      amount: infinityGain,
    });
    total += infinityGain;
  }

  // --- INFINITY SMARTPHONE ---
  const solo = counts.infinity_solo || 0;
  const famille = counts.infinity_famille || 0;
  const smartphoneVol = solo + famille;
  const smartphoneGain = solo * 7 + famille * 15;
  if (smartphoneGain > 0) {
    lines.push({
      category: "Infinity Smartphone",
      label: `Commission Infinity Smartphone`,
      detail: `${solo} Solo × 7 € + ${famille} Famille × 15 €`,
      amount: smartphoneGain,
    });
    total += smartphoneGain;
  }
  if (smartphoneVol >= 10) {
    lines.push({
      category: "Infinity Smartphone",
      label: `Bonus volume ≥ 10 Smartphone`,
      detail: `${smartphoneVol} Infinity Smartphone vendus`,
      amount: 100,
    });
    total += 100;
  }
  if (smartphoneVol >= 15) {
    lines.push({
      category: "Infinity Smartphone",
      label: `Bonus volume ≥ 15 Smartphone`,
      detail: `+100 € supplémentaires`,
      amount: 100,
    });
    total += 100;
  }

  // --- B+ / OFFRE CRÉDIT ---
  // 7 € par crédit SI taux global de crédit atteint 9 %
  const oneyCount = counts.oney || 0;
  const tauxCredit = kpis.tauxCreditPct || 0;
  if (oneyCount > 0 && tauxCredit >= 9) {
    const gain = oneyCount * 7;
    lines.push({
      category: "B+",
      label: `B+ / Crédits — taux ≥ 9 % ✓`,
      detail: `${oneyCount} crédits × 7 € (taux crédit : ${tauxCredit.toFixed(1)} %)`,
      amount: gain,
    });
    total += gain;
  } else if (oneyCount > 0) {
    lines.push({
      category: "B+",
      label: `B+ non déclenché — taux crédit < 9 %`,
      detail: `${oneyCount} crédits × 7 € bloqués (taux : ${tauxCredit.toFixed(1)} %)`,
      amount: 0,
      locked: true,
    });
  }

  // --- CLUB+ ---
  // 2,5 € par Club+ SI volume ≥ 20
  const clubCount = counts.clubplus || 0;
  if (clubCount >= 20) {
    const gain = clubCount * 2.5;
    lines.push({
      category: "Club+",
      label: `Club+ (volume ≥ 20 ✓)`,
      detail: `${clubCount} Club+ × 2,50 €`,
      amount: gain,
    });
    total += gain;
  } else if (clubCount > 0) {
    lines.push({
      category: "Club+",
      label: `Club+ non déclenché — volume < 20`,
      detail: `${clubCount}/20 Club+ requis`,
      amount: 0,
      locked: true,
    });
  }

  // --- GARANTIE ---
  // 5 % du montant SI montant ≥ 500 €
  const garantieAmount = amounts.garantie || 0;
  if (garantieAmount >= 500) {
    const gain = Math.round(garantieAmount * 0.05 * 100) / 100;
    lines.push({
      category: "Garantie",
      label: `Garantie — seuil 500 € atteint ✓`,
      detail: `${garantieAmount.toFixed(2)} € × 5 %`,
      amount: gain,
    });
    total += gain;
  } else if (garantieAmount > 0) {
    lines.push({
      category: "Garantie",
      label: `Garantie non déclenchée — seuil 500 €`,
      detail: `${garantieAmount.toFixed(2)} € / 500 € requis`,
      amount: 0,
      locked: true,
    });
  }

  // --- CANAL+ ---
  // 4 € par vente + 10 € au 3e mois si pas d'annulation
  const canalCount = counts.canalplus || 0;
  if (canalCount > 0) {
    const gain = canalCount * 4;
    lines.push({
      category: "Canal+",
      label: `Canal+ — ${canalCount} ventes`,
      detail: `${canalCount} × 4 €`,
      amount: gain,
    });
    total += gain;
  }
  const canalM3 = data.canalMonthsWithoutCancel || 0;
  if (canalM3 > 0) {
    const gain = canalM3 * 10;
    lines.push({
      category: "Canal+",
      label: `Canal+ fidélité 3 mois sans annulation`,
      detail: `${canalM3} abonnements × 10 €`,
      amount: gain,
    });
    total += gain;
  }

  // --- NPS (trimestriel) ---
  // Affiché sur le panneau mensuel mais prime trimestrielle
  const nps = kpis.npsTrimestrePct || 0;
  if (nps >= 72) {
    lines.push({
      category: "NPS",
      label: `Prime NPS trimestrielle (≥ 72 % ✓)`,
      detail: `NPS glissant trimestre : ${nps.toFixed(1)} %`,
      amount: 120,
      trimestriel: true,
    });
    total += 120;
  } else if (nps > 0) {
    lines.push({
      category: "NPS",
      label: `Prime NPS non déclenchée — seuil 72 %`,
      detail: `NPS actuel : ${nps.toFixed(1)} %`,
      amount: 0,
      locked: true,
      trimestriel: true,
    });
  }

  // --- TAUX INFINITY (trimestriel) ---
  // 180 € si taux Infinity ≥ 8 % tous les mois du trimestre
  const tauxInf = kpis.tauxInfinityPct || 0;
  if (tauxInf >= 8) {
    lines.push({
      category: "Taux Infinity",
      label: `Prime Taux Infinity trimestrielle (≥ 8 % ✓)`,
      detail: `Taux actuel : ${tauxInf.toFixed(1)} %`,
      amount: 180,
      trimestriel: true,
    });
    total += 180;
  } else if (tauxInf > 0) {
    lines.push({
      category: "Taux Infinity",
      label: `Prime Taux Infinity non déclenchée — seuil 8 %`,
      detail: `Taux actuel : ${tauxInf.toFixed(1)} %`,
      amount: 0,
      locked: true,
      trimestriel: true,
    });
  }

  return {
    lines,
    total: Math.round(total * 100) / 100,
  };
}

// ============================================================================
// COMMISSIONS LOGISTIQUE — Livreurs, Livreurs Magasiniers, Magasiniers
// ============================================================================
// KPIs et primes spécifiques au pôle logistique
//   - Infinity SAV (volume)
//   - Infinity Home (uno/duo/trio) — comptabilise les installations à domicile
//   - Installations TV
//   - Installations porte encastrable
//   - NPS / Google
//   - Inventaires Tx à 100%
//   - Lignes "extras" personnalisables par admin
// ============================================================================
const LOGISTIQUE_DEFAULT_BAREMES = {
  infinitySAV: { unit: 1.5, label: "Infinity SAV", description: "Par dossier traité" },
  infinityUno: { unit: 5, label: "Infinity Home Uno", description: "Par installation" },
  infinityDuo: { unit: 8, label: "Infinity Home Duo", description: "Par installation" },
  infinityTrio: { unit: 12, label: "Infinity Home Trio", description: "Par installation" },
  installTV: { unit: 10, label: "Installation TV", description: "Par installation" },
  installPorte: { unit: 25, label: "Installation porte encastrable", description: "Par pose" },
  npsMonthBonus: { threshold: 60, bonus: 50, label: "Bonus NPS mois", description: "≥ 60 → 50€" },
  googleMonthBonus: { threshold: 4.5, bonus: 30, label: "Bonus Google mois", description: "≥ 4.5★ → 30€" },
  inventaire100: { unit: 40, label: "Inventaire Tx 100%", description: "Par inventaire complet" },
};

function computeLogistiqueCommission(data) {
  // data : { counts: {...}, kpis: {...}, baremes: {...}, extras: [...] }
  const counts = data.counts || {};
  const kpis = data.kpis || {};
  const baremes = { ...LOGISTIQUE_DEFAULT_BAREMES, ...(data.baremes || {}) };
  const extras = data.extras || []; // [{ id, label, amount }]
  const lines = [];
  let total = 0;

  // Primes "à l'unité" (volume × tarif)
  const unitItems = [
    "infinitySAV",
    "infinityUno",
    "infinityDuo",
    "infinityTrio",
    "installTV",
    "installPorte",
    "inventaire100",
  ];
  unitItems.forEach((key) => {
    const count = counts[key] || 0;
    const b = baremes[key];
    if (!b) return;
    if (count > 0) {
      const gain = Math.round(count * (b.unit || 0) * 100) / 100;
      lines.push({
        category: b.label,
        label: `${count} × ${b.unit}€ — ${b.description || ""}`,
        gain,
      });
      total += gain;
    } else {
      lines.push({
        category: b.label,
        label: `0 × ${b.unit}€`,
        gain: 0,
        zero: true,
      });
    }
  });

  // Bonus NPS mensuel
  const npsScore = kpis.npsMonth || 0;
  const npsB = baremes.npsMonthBonus;
  if (npsB) {
    if (npsScore >= (npsB.threshold || 60)) {
      lines.push({
        category: npsB.label,
        label: `NPS ${npsScore} ≥ ${npsB.threshold}`,
        gain: npsB.bonus,
      });
      total += npsB.bonus;
    } else {
      lines.push({
        category: npsB.label,
        label: `NPS ${npsScore} (seuil ${npsB.threshold})`,
        gain: 0,
        zero: true,
      });
    }
  }

  // Bonus Google mensuel
  const googleRating = kpis.googleMonth || 0;
  const goB = baremes.googleMonthBonus;
  if (goB) {
    if (googleRating >= (goB.threshold || 4.5)) {
      lines.push({
        category: goB.label,
        label: `Google ${googleRating}★ ≥ ${goB.threshold}★`,
        gain: goB.bonus,
      });
      total += goB.bonus;
    } else {
      lines.push({
        category: goB.label,
        label: `Google ${googleRating}★ (seuil ${goB.threshold}★)`,
        gain: 0,
        zero: true,
      });
    }
  }

  // Lignes extras personnalisables (rajouts de l'admin)
  extras.forEach((ex) => {
    const amount = parseFloat(ex.amount) || 0;
    lines.push({
      category: ex.label || "Prime extra",
      label: ex.note || "Ajout personnalisé",
      gain: amount,
      isExtra: true,
    });
    total += amount;
  });

  return { lines, total: Math.round(total * 100) / 100 };
}

function computeGradeProgress(totalPoints) {
  let current = GRADES[0];
  let next = GRADES[1];
  // Grade courant = le plus élevé dont le seuil précédent est <= points
  // Le seuil "pour atteindre X" est stocké dans le grade précédent (nextAt)
  let cumulBase = 0;
  for (let i = 0; i < GRADES.length; i++) {
    const g = GRADES[i];
    if (g.nextAt === null || totalPoints < g.nextAt) {
      current = g;
      next = GRADES[i + 1] || null;
      break;
    }
    cumulBase = g.nextAt;
    current = GRADES[i + 1] || g;
    next = GRADES[i + 2] || null;
  }
  // Progression entre cumulBase et current.nextAt
  let ratio = 1;
  let pointsInLevel = totalPoints - cumulBase;
  let pointsToNext = 0;
  if (current.nextAt !== null) {
    const span = current.nextAt - cumulBase;
    pointsToNext = Math.max(0, current.nextAt - totalPoints);
    ratio = span > 0 ? Math.min(1, Math.max(0, pointsInLevel / span)) : 0;
  }
  return {
    current,
    next,
    ratio, // 0..1 au sein du niveau actuel
    pointsInLevel,
    pointsToNext,
    cumulBase,
  };
}

// Garde DEFAULT_REWARDS pour rétrocompatibilité (ne sert plus pour l'affichage)
const DEFAULT_REWARDS = GRADES.map((g, i) => {
  const prev = i === 0 ? 0 : GRADES[i - 1].nextAt || 0;
  return {
    id: g.id,
    threshold: prev,
    label: g.label,
    reward: "",
    emoji: g.emoji,
  };
});

// ========================================================================
// MODULE SONS — Web Audio API (sans fichier externe)
// ========================================================================
// Active/désactive via localStorage boulanger:sound
// Types de sons : message | pickup | mission | alert | success
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    try {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  // Si l'AudioContext est suspendu (politique d'autoplay), on tente de le reprendre
  if (_audioCtx.state === "suspended") {
    _audioCtx.resume().catch(() => {});
  }
  return _audioCtx;
}

function soundEnabled() {
  try {
    return localStorage.getItem("boulanger:sound") !== "0";
  } catch (e) {
    return true;
  }
}

function setSoundEnabled(enabled) {
  try {
    localStorage.setItem("boulanger:sound", enabled ? "1" : "0");
  } catch (e) {}
}

/**
 * Joue une séquence de tonalités.
 * frequencies : tableau de {f: hz, d: duration seconds, delay: optional start offset}
 * type: 'sine' (doux) | 'triangle' (clair) | 'square' (alerte) | 'sawtooth' (franc)
 */
function playTones(frequencies, type = "sine", volume = 0.15) {
  if (!soundEnabled()) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  frequencies.forEach((tone) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(tone.f, now + (tone.delay || 0));
    gain.gain.setValueAtTime(0, now + (tone.delay || 0));
    gain.gain.linearRampToValueAtTime(
      volume,
      now + (tone.delay || 0) + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + (tone.delay || 0) + tone.d,
    );
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + (tone.delay || 0));
    osc.stop(now + (tone.delay || 0) + tone.d);
  });
}

// Sons typés
function playSoundMessage() {
  // "Pop" doux à deux notes ascendantes (messages)
  playTones(
    [
      { f: 660, d: 0.08, delay: 0 },
      { f: 880, d: 0.12, delay: 0.08 },
    ],
    "sine",
    0.12,
  );
}

function playSoundMention() {
  // "Ding ding" plus marqué pour une mention
  playTones(
    [
      { f: 880, d: 0.1, delay: 0 },
      { f: 1175, d: 0.15, delay: 0.12 },
      { f: 1318, d: 0.2, delay: 0.28 },
    ],
    "triangle",
    0.18,
  );
}

function playSoundPickup() {
  // Deux notes graves puis aigue : nouvelle délivrance caisse
  playTones(
    [
      { f: 440, d: 0.1, delay: 0 },
      { f: 554, d: 0.1, delay: 0.1 },
      { f: 740, d: 0.18, delay: 0.22 },
    ],
    "triangle",
    0.17,
  );
}

function playSoundMission() {
  // Trompette discrète : nouvelle mission
  playTones(
    [
      { f: 523, d: 0.1, delay: 0 },
      { f: 659, d: 0.1, delay: 0.1 },
      { f: 784, d: 0.22, delay: 0.2 },
    ],
    "triangle",
    0.18,
  );
}

function playSoundAlert() {
  // Alerte urgente (zone client >5min, mission en défaut)
  playTones(
    [
      { f: 920, d: 0.12, delay: 0 },
      { f: 520, d: 0.12, delay: 0.14 },
      { f: 920, d: 0.12, delay: 0.3 },
      { f: 520, d: 0.15, delay: 0.44 },
    ],
    "square",
    0.15,
  );
}

function playSoundSuccess() {
  // Fanfare courte : bravo / points gagnés / objectif
  playTones(
    [
      { f: 660, d: 0.08, delay: 0 },
      { f: 880, d: 0.08, delay: 0.08 },
      { f: 1046, d: 0.2, delay: 0.16 },
    ],
    "triangle",
    0.17,
  );
}


const ROLES = [
  { id: "vendeur", label: "Vendeur", emoji: "🛍️" },
  { id: "caisse", label: "Caisse", emoji: "💶" },
  { id: "livreur", label: "Livreur", emoji: "🚚" },
  { id: "magasinier", label: "Magasinier", emoji: "📦" },
  { id: "admin", label: "Admin", emoji: "🛡️" },
];

const ROLE_COLORS = {
  vendeur: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  caisse: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  livreur: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  magasinier: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  admin: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const getRole = (id) => ROLES.find((r) => r.id === id) || ROLES[0];

// Statuts de présence
const STATUSES = [
  { id: "available", label: "Disponible", emoji: "🟢" },
  { id: "with_client", label: "Avec client", emoji: "🔵" },
  { id: "break", label: "En pause", emoji: "🟡" },
  { id: "away", label: "Absent", emoji: "⚫" },
];

const STATUS_DOT_COLORS = {
  available: "bg-emerald-500",
  with_client: "bg-blue-500",
  break: "bg-amber-500",
  away: "bg-slate-400",
};

const getStatus = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];

// Retourne true si une mission "open" dépasse le délai de prise en charge
const isMissionOverdue = (mission) => {
  if (!mission || mission.status !== "open") return false;
  return Date.now() - mission.createdAt >= MISSION_CLAIM_DELAY_MS;
};

// Pénalités
const PENALTY_MISSION_FAIL = 2;
const PENALTY_MISSED_OBJ = 1;
// Pénalité appliquée si la mission est refusée une 2e fois
const PENALTY_MISSION_FAIL_SECOND = 20;
// Délai maximum pour qu'une mission soit prise en charge (sinon : "défaut de prise en charge")
const MISSION_CLAIM_DELAY_MS = 4 * 60 * 60 * 1000; // 4 heures

const formatMoney = (n) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const dateKey = (d) => {
  const dd = d instanceof Date ? d : new Date(d);
  return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}-${String(dd.getDate()).padStart(2, "0")}`;
};

const formatDateFr = (d) => {
  const dd = d instanceof Date ? d : new Date(d);
  return dd.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const formatDateShort = (d) => {
  const dd = d instanceof Date ? d : new Date(d);
  return dd.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const formatDateLongFr = (d) => {
  const dd = d instanceof Date ? d : new Date(d);
  return dd.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

// Compresse une image → base64 JPEG (pour envoi chat)
const compressImage = (file, maxSize = 800, quality = 0.7) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxSize) {
          h = (h * maxSize) / w;
          w = maxSize;
        } else if (h > maxSize) {
          w = (w * maxSize) / h;
          h = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ======= MENTIONS @Prénom =======
// Découpe un texte en parties [text, mention, text, mention...]
const parseTextWithMentions = (text, users) => {
  if (!text) return [];
  const parts = [];
  // Regex qui accepte lettres accentuées, tiret, apostrophe
  const regex = /@([\p{L}][\p{L}\-']{1,30})/gu;
  let lastIdx = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const candidate = match[1];
    const user = users.find(
      (u) => u.prenom.toLowerCase() === candidate.toLowerCase(),
    );
    if (match.index > lastIdx) {
      parts.push({ type: "text", value: text.slice(lastIdx, match.index) });
    }
    if (user) {
      parts.push({ type: "mention", value: user.prenom, fc: user.fc });
    } else {
      parts.push({ type: "text", value: match[0] });
    }
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) {
    parts.push({ type: "text", value: text.slice(lastIdx) });
  }
  return parts;
};

// Extrait les FC mentionnés (unique)
const extractMentionedFcs = (text, users) => {
  const parts = parseTextWithMentions(text, users);
  return [...new Set(parts.filter((p) => p.type === "mention").map((p) => p.fc))];
};

const todayKey = () => dateKey(new Date());

const storage = {
  get: async (key, shared = false) => {
    try {
      const r = await window.storage.get(key, shared);
      return r && r.value ? r.value : null;
    } catch (e) {
      return null;
    }
  },
  set: async (key, value, shared = false) => {
    try {
      await window.storage.set(key, value, shared);
      return true;
    } catch (e) {
      console.error("storage.set failed:", key, e);
      return false;
    }
  },
  del: async (key, shared = false) => {
    try {
      await window.storage.delete(key, shared);
      return true;
    } catch (e) {
      return false;
    }
  },
  list: async (prefix, shared = false) => {
    try {
      const r = await window.storage.list(prefix, shared);
      return r && r.keys ? r.keys : [];
    } catch (e) {
      return [];
    }
  },
};

const hashPassword = (pwd) => {
  let h = 5381;
  for (let i = 0; i < pwd.length; i++) h = (h * 33) ^ pwd.charCodeAt(i);
  return (h >>> 0).toString(36) + ":" + pwd.length.toString(36);
};

const validateFc = (v) => {
  if (!v || v.length < 2) return "Le FC doit contenir au moins 2 caractères";
  if (v.length > 40) return "Le FC est trop long";
  if (/[\s:/\\'"]/.test(v)) return "Le FC ne peut pas contenir d'espaces ni : / \\ ' \"";
  return null;
};

// ========================================================================
// APP
// ========================================================================
export default function ChatBoulanger() {
  const [currentUser, setCurrentUser] = useState(null); // {fc, prenom}
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("login");

  // Auth form
  const [fc, setFc] = useState("");
  const [prenom, setPrenom] = useState("");
  const [role, setRole] = useState("vendeur");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // Activé par défaut
  const [error, setError] = useState("");

  // Chat data
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]); // [{fc, prenom, isAdmin}]
  const [externalContacts, setExternalContacts] = useState([]); // fournisseurs/prestataires
  const [interactions, setInteractions] = useState(DEFAULT_INTERACTIONS);
  const [zones, setZones] = useState(DEFAULT_ZONES);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);
  // Objectifs multi-dates : { "2026-04-20": [{interactionId, target}], ... }
  const [objectivesSchedule, setObjectivesSchedule] = useState({});
  const [missions, setMissions] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [closures, setClosures] = useState({}); // date → true
  const [chatBlocked, setChatBlocked] = useState({ blocked: false, reason: "" });
  const [reminder, setReminder] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [userStatuses, setUserStatuses] = useState({}); // fc → {status, updatedAt}
  const [pickups, setPickups] = useState([]); // demandes de sortie produit
  const [remoteClients, setRemoteClients] = useState([]); // clients à distance (privés)
  const [savCases, setSavCases] = useState([]); // dossiers SAV
  const [vacationRequests, setVacationRequests] = useState([]); // demandes de congés
  const [commissionKpis, setCommissionKpis] = useState({}); // { "FC1234_2026-04": {margePct, tauxCreditPct, tauxInfinityPct, npsTrimestrePct, canalMonthsWithoutCancel} }
  // Commissions logistique : { "FC1234_2026-04": { counts: {...}, kpis: {...}, extras: [...] } }
  const [logistiqueCommissions, setLogistiqueCommissions] = useState({});
  // Barèmes logistique modifiables par l'admin (sinon = valeurs par défaut)
  const [logistiqueBaremes, setLogistiqueBaremes] = useState(LOGISTIQUE_DEFAULT_BAREMES);
  const [logiCommissionsAdminOpen, setLogiCommissionsAdminOpen] = useState(false);
  const [shopKpis, setShopKpis] = useState({}); // { "2026-04": { npsScore, npsCount, googleRating, googleCount, googleNewReviews, npsHistory: [], googleHistory: [] } }

  // Modals
  const [amountModal, setAmountModal] = useState(null);
  const [zoneModal, setZoneModal] = useState(false);

  // Objectifs du jour (dérivé du schedule)
  const objectives = useMemo(
    () => ({
      date: todayKey(),
      items: objectivesSchedule[todayKey()] || [],
    }),
    [objectivesSchedule],
  );

  // UI
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [sending, setSending] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [pickupsOpen, setPickupsOpen] = useState(false);
  const [pickupCreateOpen, setPickupCreateOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [remoteClientsOpen, setRemoteClientsOpen] = useState(false);
  const [remoteClientEdit, setRemoteClientEdit] = useState(null);
  const [teamPhonesOpen, setTeamPhonesOpen] = useState(false);
  const [callPanelOpen, setCallPanelOpen] = useState(false);
  const [wifiCallOpen, setWifiCallOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [zoneAlertsOpen, setZoneAlertsOpen] = useState(false);
  const [missionsStatusOpen, setMissionsStatusOpen] = useState(false);
  const [myMissionsHistoryOpen, setMyMissionsHistoryOpen] = useState(false);
  const [planningOpen, setPlanningOpen] = useState(false);
  const [vacationPanelOpen, setVacationPanelOpen] = useState(false);
  const [progressionOpen, setProgressionOpen] = useState(false);
  const [commissionsOpen, setCommissionsOpen] = useState(false);
  const [npsPanelOpen, setNpsPanelOpen] = useState(false);
  // Module RH
  const [hrPanelOpen, setHrPanelOpen] = useState(false);
  const [hrData, setHrData] = useState(null);
  const [hrLoading, setHrLoading] = useState(false);

  // Helper pour demander les données RH au planning iframe
  const requestHrData = () => {
    setHrLoading(true);
    setHrData(null);
    // On ouvre temporairement l'iframe en mémoire si pas déjà chargée
    // Ici on demande simplement aux iframes existantes
    const iframes = document.querySelectorAll('iframe[title="Planning F890"]');
    if (iframes.length === 0) {
      // Si l'iframe n'est pas montée, on affiche les données depuis localStorage du planning
      try {
        const raw = localStorage.getItem("plf890_data_v1");
        if (raw) {
          const D = JSON.parse(raw);
          // Construit les données depuis localStorage directement
          const employees = (D.employees || []).map((e) => ({
            id: e.id,
            firstName: e.firstName,
            fcId: e.fcId || "",
            role: e.role || "",
            contractHours: e.contractHours || 35,
            contractHoursB: e.contractHoursB || null,
            restDays: e.restDays || [],
            hasFixedSchedule: !!(
              e.fixedSchedule || e.fixedScheduleA || e.fixedScheduleB
            ),
            hasAlternation: !!(e.fixedScheduleA && e.fixedScheduleB),
          }));
          const absences = (D.absences || []).map((a) => ({
            id: a.id,
            empId: a.empId,
            start: a.start,
            end: a.end,
            type: a.type,
          }));
          setHrData({
            employees,
            absences,
            weekHours: {},
            weekStart: null,
            exportedAt: Date.now(),
            fromLocalStorage: true,
          });
        }
      } catch (e) {
        console.error("Erreur lecture localStorage planning:", e);
      }
      setHrLoading(false);
      return;
    }
    iframes.forEach((ifr) => {
      try {
        ifr.contentWindow?.postMessage(
          { source: "collectif-interne", action: "request_hr_data" },
          "*",
        );
      } catch (e) {}
    });
    // Timeout : si pas de réponse en 1.5s, on tente le localStorage
    setTimeout(() => {
      setHrLoading(false);
    }, 1500);
  };

  // Listener pour les données RH renvoyées par le planning
  useEffect(() => {
    const handler = (event) => {
      const data = event.data;
      if (!data || data.source !== "planning-f890") return;
      if (data.action === "hr_data" && data.data) {
        setHrData(data.data);
        setHrLoading(false);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);
  // Mode sombre — persistant
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("boulanger:darkmode") === "1";
    } catch (e) {
      return false;
    }
  });
  // Sons — persistant
  const [soundOn, setSoundOn] = useState(() => soundEnabled());
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);
  useEffect(() => {
    try {
      localStorage.setItem("boulanger:darkmode", darkMode ? "1" : "0");
      if (darkMode) {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
      }
    } catch (e) {}
  }, [darkMode]);
  const [savPanelOpen, setSavPanelOpen] = useState(false);
  const [savCreateOpen, setSavCreateOpen] = useState(false);
  const [savPrepCase, setSavPrepCase] = useState(null); // cas SAV en cours de préparation
  // Vue principale : "home" (dashboard de tuiles) ou "chat"
  const [mainView, setMainView] = useState("home");
  const [objectivesOpen, setObjectivesOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const lastSeenKeysRef = useRef(new Set());
  const initializedRef = useRef(false);

  const isAdmin = currentUser?.fc === ADMIN_FC;

  // ------------------- Session au démarrage -------------------
  useEffect(() => {
    (async () => {
      // 1. Provisionner / synchroniser le compte admin
      const existingAdmin = await storage.get(`users:${ADMIN_FC}`, true);
      let needWrite = false;
      let adminData;
      if (!existingAdmin) {
        adminData = {
          fc: ADMIN_FC,
          prenom: ADMIN_DEFAULT_PRENOM,
          passwordHash: ADMIN_PASSWORD_HASH,
          createdAt: Date.now(),
        };
        needWrite = true;
      } else {
        try {
          adminData = JSON.parse(existingAdmin);
          // Force la mise à jour du hash si obsolète, préserve le prénom
          if (adminData.passwordHash !== ADMIN_PASSWORD_HASH) {
            adminData.passwordHash = ADMIN_PASSWORD_HASH;
            needWrite = true;
          }
          if (!adminData.prenom) {
            adminData.prenom = ADMIN_DEFAULT_PRENOM;
            needWrite = true;
          }
        } catch (e) {
          adminData = {
            fc: ADMIN_FC,
            prenom: ADMIN_DEFAULT_PRENOM,
            passwordHash: ADMIN_PASSWORD_HASH,
            createdAt: Date.now(),
          };
          needWrite = true;
        }
      }
      if (needWrite) {
        await storage.set(
          `users:${ADMIN_FC}`,
          JSON.stringify(adminData),
          true,
        );
      }

      // 2. Restaurer la session courante si existante
      // D'abord tenter localStorage (plus fiable pour "se souvenir"), puis storage partagé
      let sessionFc = null;
      try {
        sessionFc = localStorage.getItem("boulanger:session:current");
      } catch (e) {}
      if (!sessionFc) {
        sessionFc = await storage.get("session:current");
      }
      if (sessionFc) {
        if (sessionFc === ADMIN_FC) {
          // Admin : reconnexion directe en mémoire, sans lire le storage
          setCurrentUser({ fc: ADMIN_FC, prenom: ADMIN_DEFAULT_PRENOM, role: "admin" });
          setView("chat");
        } else {
          const raw = await storage.get(`users:${sessionFc}`, true);
          if (raw) {
            try {
              const userData = JSON.parse(raw);
              setCurrentUser({ fc: userData.fc, prenom: userData.prenom, role: userData.role || "vendeur" });
              setView("chat");
            } catch (e) {}
          }
        }
      }
      setLoading(false);
    })();
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  }, []);

  // ------------------- Polling -------------------
  useEffect(() => {
    if (!currentUser) return;

    const loadAll = async () => {
      // --- Messages : on FUSIONNE avec l'état local au lieu de remplacer ---
      const keys = await storage.list("msg:", true);
      const storedMsgs = [];
      for (const key of keys) {
        const raw = await storage.get(key, true);
        if (raw) {
          try {
            storedMsgs.push({ ...JSON.parse(raw), _key: key });
          } catch (e) {}
        }
      }

      setMessages((prev) => {
        // Map par clé : état local d'abord, storage écrase (pour updates type "pris en charge")
        const byKey = new Map();
        prev.forEach((m) => byKey.set(m._key, m));
        storedMsgs.forEach((m) => byKey.set(m._key, m));
        const merged = Array.from(byKey.values()).sort(
          (a, b) => a.timestamp - b.timestamp,
        );

        // Notifications pour les vrais nouveaux (jamais vus) venant des autres
        if (initializedRef.current) {
          const seenKeys = lastSeenKeysRef.current;
          const reallyNew = merged.filter(
            (m) => !seenKeys.has(m._key) && m.fc !== currentUser.fc,
          );
          reallyNew.forEach((m) => {
            if (m.type === "achievement") {
              pushToast({
                id: Math.random(),
                type: "achievement",
                prenom: m.prenom,
                label: m.interactionLabel,
                emoji: m.interactionEmoji,
              });
              if (
                typeof Notification !== "undefined" &&
                Notification.permission === "granted" &&
                document.hidden
              ) {
                try {
                  new Notification(
                    `🎉 ${m.prenom} a réalisé un ${m.interactionLabel} !`,
                    { body: "Bravo 👏", tag: "chat-boulanger-achievement" },
                  );
                } catch (e) {}
              }
            } else if (m.type === "admin_reminder") {
              pushToast({ id: Math.random(), type: "reminder", text: m.text });
            } else if (m.type === "zone_alert" && !m.takenBy) {
              pushToast({
                id: Math.random(),
                type: "zone_alert",
                prenom: m.prenom,
                zoneLabel: m.zoneLabel,
                zoneEmoji: m.zoneEmoji,
              });
              if (
                typeof Notification !== "undefined" &&
                Notification.permission === "granted"
              ) {
                try {
                  new Notification(`⚡ Clients en attente : ${m.zoneLabel}`, {
                    body: `Signalé par ${m.prenom}`,
                    tag: "chat-boulanger-zone",
                    requireInteraction: true,
                  });
                } catch (e) {}
              }
            } else if (
              m.type === "message" &&
              typeof Notification !== "undefined" &&
              Notification.permission === "granted" &&
              document.hidden
            ) {
              try {
                new Notification(`💬 ${m.prenom || m.fc}`, {
                  body:
                    m.text.length > 120
                      ? m.text.slice(0, 117) + "..."
                      : m.text,
                  tag: "chat-boulanger",
                });
              } catch (e) {}
            }
            // Mention de moi : toast et notif prioritaires
            if (
              (m.mentions || []).includes(currentUser.fc)
            ) {
              pushToast({
                id: Math.random(),
                type: "mention",
                prenom: m.prenom,
                text: m.text,
              });
              if (
                typeof Notification !== "undefined" &&
                Notification.permission === "granted"
              ) {
                try {
                  new Notification(
                    `@ ${m.prenom} vous mentionne`,
                    {
                      body:
                        (m.text || "").length > 120
                          ? m.text.slice(0, 117) + "..."
                          : m.text,
                      tag: "chat-boulanger-mention",
                      requireInteraction: true,
                    },
                  );
                } catch (e) {}
              }
            }
          });
        }
        // Mémorise toutes les clés vues pour la prochaine itération
        lastSeenKeysRef.current = new Set(merged.map((m) => m._key));
        initializedRef.current = true;
        return merged;
      });

      // Users
      const userKeys = await storage.list("users:", true);
      const list = [];
      for (const k of userKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            const u = JSON.parse(raw);
            list.push({
              fc: u.fc,
              prenom: u.prenom,
              role: u.fc === ADMIN_FC ? "admin" : u.role || "vendeur",
              phone: u.phone || "",
              isAdmin: u.fc === ADMIN_FC,
            });
          } catch (e) {}
        }
      }
      list.sort((a, b) => a.prenom.localeCompare(b.prenom));
      setUsers(list);

      // Interactions config
      const interactionsRaw = await storage.get("config:interactions", true);
      if (interactionsRaw) {
        try {
          setInteractions(JSON.parse(interactionsRaw));
        } catch (e) {}
      }

      // Zones config
      const zonesRaw = await storage.get("config:zones", true);
      if (zonesRaw) {
        try {
          setZones(JSON.parse(zonesRaw));
        } catch (e) {}
      }

      // Rewards config
      const rewardsRaw = await storage.get("config:rewards", true);
      if (rewardsRaw) {
        try {
          setRewards(JSON.parse(rewardsRaw));
        } catch (e) {}
      }

      // Barèmes commissions logistique
      const baremesRaw = await storage.get("config:logiBaremes", true);
      if (baremesRaw) {
        try {
          const parsed = JSON.parse(baremesRaw);
          setLogistiqueBaremes({ ...LOGISTIQUE_DEFAULT_BAREMES, ...parsed });
        } catch (e) {}
      }

      // Objectifs planifiés (toutes dates : config:objectives:YYYY-MM-DD) — FUSION
      const objKeys = await storage.list("config:objectives:", true);
      const storedSchedule = {};
      for (const k of objKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            const date = k.replace("config:objectives:", "");
            storedSchedule[date] = JSON.parse(raw);
          } catch (e) {}
        }
      }
      setObjectivesSchedule((prev) => ({ ...prev, ...storedSchedule }));

      // Missions (mission:<id>) — FUSION au lieu de remplacement
      const missionKeys = await storage.list("mission:", true);
      const storedMissions = [];
      for (const k of missionKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            storedMissions.push({ ...JSON.parse(raw), _key: k });
          } catch (e) {}
        }
      }
      setMissions((prev) => {
        const byKey = new Map();
        prev.forEach((m) => byKey.set(m._key, m));
        storedMissions.forEach((m) => byKey.set(m._key, m)); // storage gagne sur updates
        return Array.from(byKey.values()).sort(
          (a, b) => b.createdAt - a.createdAt,
        );
      });

      // Pénalités (penalty:<id>) — FUSION
      const penKeys = await storage.list("penalty:", true);
      const storedPens = [];
      for (const k of penKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            storedPens.push({ ...JSON.parse(raw), _key: k });
          } catch (e) {}
        }
      }
      setPenalties((prev) => {
        const byKey = new Map();
        prev.forEach((p) => byKey.set(p._key, p));
        storedPens.forEach((p) => byKey.set(p._key, p));
        return Array.from(byKey.values());
      });

      // Clôtures de journée (closure:<date>) — FUSION
      const closureKeys = await storage.list("closure:", true);
      setClosures((prev) => {
        const merged = { ...prev };
        closureKeys.forEach((k) => {
          const date = k.replace("closure:", "");
          merged[date] = true;
        });
        return merged;
      });

      // Chat blocked
      const blockedRaw = await storage.get("config:blocked", true);
      if (blockedRaw) {
        try {
          setChatBlocked(JSON.parse(blockedRaw));
        } catch (e) {}
      } else {
        setChatBlocked({ blocked: false, reason: "" });
      }

      // Reminder
      const reminderRaw = await storage.get("config:reminder", true);
      if (reminderRaw) {
        try {
          setReminder(JSON.parse(reminderRaw));
        } catch (e) {}
      } else {
        setReminder(null);
      }

      // Annonce épinglée par admin
      const pinnedRaw = await storage.get("config:pinned", true);
      if (pinnedRaw) {
        try {
          setPinnedMessage(JSON.parse(pinnedRaw));
        } catch (e) {}
      } else {
        setPinnedMessage(null);
      }

      // Statuts de présence (status:<fc>)
      const statusKeys = await storage.list("status:", true);
      const statusMap = {};
      for (const k of statusKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            const fc = k.replace("status:", "");
            statusMap[fc] = JSON.parse(raw);
          } catch (e) {}
        }
      }
      setUserStatuses(statusMap);

      // Demandes de sortie produit (pickup:<id>) — FUSION
      const pickupKeys = await storage.list("pickup:", true);
      const storedPickups = [];
      for (const k of pickupKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            storedPickups.push({ ...JSON.parse(raw), _key: k });
          } catch (e) {}
        }
      }
      setPickups((prev) => {
        const byKey = new Map();
        prev.forEach((p) => byKey.set(p._key, p));
        storedPickups.forEach((p) => byKey.set(p._key, p));
        return Array.from(byKey.values()).sort(
          (a, b) => b.createdAt - a.createdAt,
        );
      });

      // Clients à distance (client:<id>) — FUSION
      const clientKeys = await storage.list("client:", true);
      const storedClients = [];
      for (const k of clientKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            storedClients.push({ ...JSON.parse(raw), _key: k });
          } catch (e) {}
        }
      }
      setRemoteClients((prev) => {
        const byKey = new Map();
        prev.forEach((c) => byKey.set(c._key, c));
        storedClients.forEach((c) => byKey.set(c._key, c));
        return Array.from(byKey.values()).sort(
          (a, b) => b.createdAt - a.createdAt,
        );
      });

      // Contacts externes (contact:<id>) — FUSION
      const contactKeys = await storage.list("contact:", true);
      const storedContacts = [];
      for (const k of contactKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            storedContacts.push({ ...JSON.parse(raw), _key: k });
          } catch (e) {}
        }
      }
      setExternalContacts((prev) => {
        const byId = new Map();
        prev.forEach((c) => byId.set(c.id, c));
        storedContacts.forEach((c) => byId.set(c.id, c));
        return Array.from(byId.values());
      });

      // Dossiers SAV (sav:<id>) — FUSION
      const savKeys = await storage.list("sav:", true);
      const storedSav = [];
      for (const k of savKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            storedSav.push({ ...JSON.parse(raw), _key: k });
          } catch (e) {}
        }
      }
      setSavCases((prev) => {
        const byKey = new Map();
        prev.forEach((s) => byKey.set(s._key, s));
        storedSav.forEach((s) => byKey.set(s._key, s));
        return Array.from(byKey.values()).sort(
          (a, b) => b.createdAt - a.createdAt,
        );
      });

      // Demandes de congés (vacation:<id>) — FUSION
      const vacKeys = await storage.list("vacation:", true);
      const storedVac = [];
      for (const k of vacKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            storedVac.push({ ...JSON.parse(raw), _key: k });
          } catch (e) {}
        }
      }
      setVacationRequests((prev) => {
        const byKey = new Map();
        prev.forEach((v) => byKey.set(v._key, v));
        storedVac.forEach((v) => byKey.set(v._key, v));
        return Array.from(byKey.values()).sort(
          (a, b) => b.createdAt - a.createdAt,
        );
      });

      // KPIs commission (commkpi:<fc>_<YYYY-MM>) — FUSION
      const kpiKeys = await storage.list("commkpi:", true);
      const kpiMap = {};
      for (const k of kpiKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const id = k.replace("commkpi:", "");
            kpiMap[id] = parsed;
          } catch (e) {}
        }
      }
      setCommissionKpis((prev) => {
        const merged = { ...prev };
        Object.keys(kpiMap).forEach((id) => {
          const remote = kpiMap[id];
          const local = prev[id];
          if (
            !local ||
            !local.savedAt ||
            (remote.savedAt && remote.savedAt >= local.savedAt)
          ) {
            merged[id] = remote;
          }
        });
        return merged;
      });

      // Commissions logistique (logicomm:<fc>_<YYYY-MM>) — FUSION
      const logiKeys = await storage.list("logicomm:", true);
      const logiMap = {};
      for (const k of logiKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const id = k.replace("logicomm:", "");
            logiMap[id] = parsed;
          } catch (e) {}
        }
      }
      setLogistiqueCommissions((prev) => {
        const merged = { ...prev };
        Object.keys(logiMap).forEach((id) => {
          const remote = logiMap[id];
          const local = prev[id];
          if (
            !local ||
            !local.savedAt ||
            (remote.savedAt && remote.savedAt >= local.savedAt)
          ) {
            merged[id] = remote;
          }
        });
        return merged;
      });

      // Barème logistique custom (config:logistique-baremes)
      try {
        const baremeRaw = await storage.get("config:logistique-baremes", true);
        if (baremeRaw) {
          const parsed = JSON.parse(baremeRaw);
          if (parsed && typeof parsed === "object") {
            setLogistiqueBaremes((prev) => ({
              ...LOGISTIQUE_DEFAULT_BAREMES,
              ...parsed,
            }));
          }
        }
      } catch (e) {}

      // KPIs boutique (shopkpi:<YYYY-MM>) — NPS et avis Google — FUSION
      const shopKeys = await storage.list("shopkpi:", true);
      const shopMap = {};
      for (const k of shopKeys) {
        const raw = await storage.get(k, true);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const monthId = k.replace("shopkpi:", "");
            shopMap[monthId] = parsed;
          } catch (e) {}
        }
      }
      // Fusion : on garde les valeurs locales si elles ont un timestamp plus récent
      // ou si la clé n'est pas encore propagée côté serveur (race condition)
      setShopKpis((prev) => {
        const merged = { ...prev };
        Object.keys(shopMap).forEach((id) => {
          const remote = shopMap[id];
          const local = prev[id];
          // Préfère la version la plus récente (savedAt timestamp)
          if (
            !local ||
            !local.savedAt ||
            (remote.savedAt && remote.savedAt >= local.savedAt)
          ) {
            merged[id] = remote;
          }
        });
        return merged;
      });
    };

    loadAll();
    const interval = setInterval(loadAll, 2500);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // ============ DÉTECTION DES NOUVEAUTÉS POUR JOUER UN SON ============
  const lastSeenRefs = useRef({
    initialized: false,
    lastMessageId: null,
    lastMissionCount: 0,
    lastPickupCount: 0,
    lastZoneAlertCount: 0,
  });

  useEffect(() => {
    if (!currentUser || loading) return;
    const refs = lastSeenRefs.current;
    // Premier chargement : on mémorise sans jouer de son
    if (!refs.initialized) {
      refs.lastMessageId = messages.length
        ? messages[messages.length - 1].id
        : null;
      refs.lastMissionCount = missions.filter(
        (m) => m.status === "open" || m.status === "available",
      ).length;
      refs.lastPickupCount = pickups.filter(
        (p) => p.status === "requested",
      ).length;
      refs.lastZoneAlertCount = messages.filter(
        (m) => m.type === "zone_alert" && !m.takenBy,
      ).length;
      refs.initialized = true;
      return;
    }

    // --- Nouveau message ---
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.id !== refs.lastMessageId && lastMsg._key !== refs.lastMessageKey) {
        // Ignore mes propres messages
        if (lastMsg.fc !== currentUser.fc) {
          const mentionText = `@${currentUser.prenom}`;
          const isMentioned =
            lastMsg.text &&
            lastMsg.text.toLowerCase().includes(mentionText.toLowerCase());
          if (isMentioned) {
            playSoundMention();
          } else if (lastMsg.type === "achievement") {
            playSoundSuccess();
          } else if (lastMsg.type === "pickup_notification") {
            playSoundPickup();
          } else if (lastMsg.type === "mission_notification") {
            playSoundMission();
          } else if (lastMsg.type === "vacation_notification") {
            playSoundAlert();
          } else if (lastMsg.type === "zone_alert") {
            playSoundAlert();
          } else if (lastMsg.type === "message" || lastMsg.type === "photo") {
            playSoundMessage();
          }
        }
        refs.lastMessageId = lastMsg.id;
        refs.lastMessageKey = lastMsg._key;
      }
    }

    // --- Nouvelle délivrance caisse en attente ---
    const openPickups = pickups.filter(
      (p) => p.status === "requested" && p.createdBy !== currentUser.fc,
    ).length;
    if (openPickups > refs.lastPickupCount) {
      playSoundPickup();
    }
    refs.lastPickupCount = openPickups;

    // --- Nouvelle mission à prendre ---
    const openMissions = missions.filter(
      (m) =>
        (m.status === "open" || m.status === "available") &&
        m.createdBy !== currentUser.fc,
    ).length;
    if (openMissions > refs.lastMissionCount) {
      playSoundMission();
    }
    refs.lastMissionCount = openMissions;

    // --- Alerte zone (nouveau client en attente non pris en charge) ---
    const zoneAlertsWaiting = messages.filter(
      (m) =>
        m.type === "zone_alert" && !m.takenBy && m.fc !== currentUser.fc,
    ).length;
    if (zoneAlertsWaiting > refs.lastZoneAlertCount) {
      playSoundAlert();
    }
    refs.lastZoneAlertCount = zoneAlertsWaiting;
    // eslint-disable-next-line
  }, [messages, missions, pickups, currentUser, loading]);

  const pushToast = (t) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, 4500);
  };

  // ------------------- Auth -------------------
  // Mémorise la session localement si demandé
  const persistSession = async (fcValue) => {
    try {
      await storage.set("session:current", fcValue);
    } catch (e) {}
    if (rememberMe) {
      try {
        localStorage.setItem("boulanger:session:current", fcValue);
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem("boulanger:session:current");
      } catch (e) {}
    }
  };

  const handleRegister = async () => {
    setError("");
    const fcError = validateFc(fc.trim());
    if (fcError) return setError(fcError);
    if (!prenom.trim() || prenom.trim().length < 2)
      return setError("Prénom requis (minimum 2 caractères)");
    if (!password || password.length < 4)
      return setError("Mot de passe : minimum 4 caractères");
    if (!role) return setError("Sélectionnez votre rôle");

    const fcClean = fc.trim();

    // Le FC admin est réservé, personne ne peut s'inscrire avec
    if (fcClean === ADMIN_FC) {
      return setError("Ce FC est réservé. Utilisez la connexion.");
    }

    const prenomClean = prenom.trim();

    const existing = await storage.get(`users:${fcClean}`, true);
    if (existing) return setError("Ce FC est déjà utilisé. Utilisez la connexion.");

    const userData = {
      fc: fcClean,
      prenom: prenomClean,
      role,
      passwordHash: hashPassword(password),
      createdAt: Date.now(),
    };
    const ok = await storage.set(`users:${fcClean}`, JSON.stringify(userData), true);
    if (!ok) return setError("Erreur lors de l'inscription");
    await persistSession(fcClean);
    setCurrentUser({ fc: fcClean, prenom: prenomClean, role });
    setView("chat");
    setPassword("");
    setFc("");
    setPrenom("");
    setRole("vendeur");
  };

  const handleLogin = async () => {
    setError("");
    const fcError = validateFc(fc.trim());
    if (fcError) return setError(fcError);
    if (!password) return setError("Mot de passe requis");

    const fcClean = fc.trim();

    // =============================================================
    // CAS ADMIN : vérification en mémoire, SANS dépendre du storage
    // Le FC1309 peut toujours se connecter avec le bon mot de passe,
    // même si le stockage partagé échoue.
    // =============================================================
    if (fcClean === ADMIN_FC) {
      if (hashPassword(password) !== ADMIN_PASSWORD_HASH) {
        return setError("Mot de passe incorrect");
      }
      // Tentative d'enregistrement du compte admin en storage (pour
      // que son nom apparaisse dans la liste), mais on ne bloque pas
      // la connexion si ça échoue.
      const adminData = {
        fc: ADMIN_FC,
        prenom: ADMIN_DEFAULT_PRENOM,
        passwordHash: ADMIN_PASSWORD_HASH,
        createdAt: Date.now(),
      };
      try {
        await window.storage.set(
          `users:${ADMIN_FC}`,
          JSON.stringify(adminData),
          true,
        );
      } catch (e) {}
      await persistSession(ADMIN_FC);

      setCurrentUser({ fc: ADMIN_FC, prenom: ADMIN_DEFAULT_PRENOM, role: "admin" });
      setView("chat");
      setPassword("");
      setFc("");
      return;
    }

    // =============================================================
    // CAS UTILISATEUR NORMAL
    // =============================================================
    const raw = await storage.get(`users:${fcClean}`, true);
    if (!raw) return setError("FC introuvable. Inscrivez-vous d'abord.");

    try {
      const userData = JSON.parse(raw);
      if (userData.passwordHash !== hashPassword(password))
        return setError("Mot de passe incorrect");
      await persistSession(fcClean);
      setCurrentUser({ fc: fcClean, prenom: userData.prenom, role: userData.role || "vendeur" });
      setView("chat");
      setPassword("");
      setFc("");
    } catch (e) {
      setError("Erreur lors de la connexion.");
    }
  };

  const handleLogout = async () => {
    await storage.del("session:current");
    try {
      localStorage.removeItem("boulanger:session:current");
    } catch (e) {}
    setCurrentUser(null);
    setMessages([]);
    setUsers([]);
    lastSeenKeysRef.current = new Set();
    initializedRef.current = false;
    setView("login");
  };

  // ------------------- Messages -------------------
  const handleSendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !currentUser || sending) return;
    if (chatBlocked.blocked && !isAdmin) return;
    setSending(true);
    const mentions = extractMentionedFcs(text, users);
    const msg = {
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      role: currentUser.role,
      text,
      timestamp: Date.now(),
      type: "message",
      mentions,
    };
    const key = `msg:${String(msg.timestamp).padStart(15, "0")}_${Math.random().toString(36).slice(2, 8)}`;

    // Mise à jour UI immédiate
    setNewMessage("");
    setMessages((prev) => {
      const next = [...prev, { ...msg, _key: key }];
      
      return next;
    });

    // Persistance en arrière-plan
    try {
      await window.storage.set(key, JSON.stringify(msg), true);
    } catch (e) {
      console.error("Échec envoi message:", e);
    }
    setSending(false);
  };

  // ------------------- Achievements -------------------
  const handleInteractionClick = (interaction) => {
    if (!currentUser) return;
    if (chatBlocked.blocked && !isAdmin) return;
    // Type "amount" (PO & co.) : ouvrir la saisie de montant
    if (interaction.type === "amount") {
      setAmountModal({ interaction });
      return;
    }
    // Type "count" : achievement direct
    createAchievement(interaction, 1, 0);
  };

  const createAchievement = async (interaction, count, amount, cancelReason = "") => {
    const isCancellation = amount < 0;
    const absAmount = Math.abs(amount || 0);
    const msg = {
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      text: isCancellation
        ? `a enregistré une annulation ${interaction.label} de ${formatMoney(absAmount)} ${interaction.unit || ""}${cancelReason ? ` — ${cancelReason}` : ""}`.trim()
        : interaction.type === "amount"
          ? `a réalisé un ${interaction.label} de ${formatMoney(amount)} ${interaction.unit || ""}`.trim()
          : `a réalisé un ${interaction.label} ${interaction.emoji}`,
      timestamp: Date.now(),
      type: "achievement",
      interactionId: interaction.id,
      interactionLabel: interaction.label,
      interactionEmoji: interaction.emoji,
      interactionType: interaction.type || "count",
      interactionUnit: interaction.unit || "",
      count: isCancellation ? -1 : count || 1,
      amount: amount || 0,
      points: isCancellation ? -(interaction.points || 0) : interaction.points || 0,
      isCancellation,
      cancelReason: cancelReason || "",
      reactions: [],
    };
    const key = `msg:${String(msg.timestamp).padStart(15, "0")}_${Math.random().toString(36).slice(2, 8)}`;

    // UI immédiat
    setMessages((prev) => {
      const next = [...prev, { ...msg, _key: key }];
      
      return next;
    });
    pushToast({
      id: Math.random(),
      type: "self_achievement",
      label: isCancellation ? `Annulation ${interaction.label}` : interaction.label,
      points: msg.points,
      amount: amount,
      interactionType: interaction.type || "count",
      isCancellation,
    });

    try {
      await window.storage.set(key, JSON.stringify(msg), true);
    } catch (e) {
      console.error("Échec sauvegarde achievement:", e);
    }
  };

  const handleAmountSubmit = async (amount, cancelReason = "") => {
    if (!amountModal) return;
    const interaction = amountModal.interaction;
    setAmountModal(null);
    // amount peut être négatif = annulation
    if (amount !== 0 && !isNaN(amount)) {
      await createAchievement(interaction, 1, amount, cancelReason);
    }
  };

  // ------------------- Zone alerts -------------------
  const handleZoneAlert = async (zone) => {
    if (!currentUser) return;
    if (chatBlocked.blocked && !isAdmin) return;
    setZoneModal(false);
    const msg = {
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      text: `Clients en attente en ${zone.label}`,
      timestamp: Date.now(),
      type: "zone_alert",
      zoneId: zone.id,
      zoneLabel: zone.label,
      zoneEmoji: zone.emoji,
      takenBy: null,
      takenByPrenom: null,
      takenAt: null,
    };
    const key = `msg:${String(msg.timestamp).padStart(15, "0")}_${Math.random().toString(36).slice(2, 8)}`;

    // UI immédiat
    setMessages((prev) => {
      const next = [...prev, { ...msg, _key: key }];
      
      return next;
    });

    try {
      await window.storage.set(key, JSON.stringify(msg), true);
    } catch (e) {
      console.error("Échec alerte zone:", e);
    }
  };

  const handleTakeZone = async (msg) => {
    if (!currentUser) return;
    if (msg.takenBy) return; // déjà prise
    const updated = {
      ...msg,
      takenBy: currentUser.fc,
      takenByPrenom: currentUser.prenom,
      takenAt: Date.now(),
    };
    const keyCopy = msg._key;
    const saveObj = { ...updated };
    delete saveObj._key;
    setMessages((prev) =>
      prev.map((m) => (m._key === keyCopy ? { ...updated, _key: keyCopy } : m)),
    );
    try {
      await window.storage.set(keyCopy, JSON.stringify(saveObj), true);
    } catch (e) {
      console.error("Échec prise en charge zone:", e);
    }
  };

  // Libérer une prise en charge : seul le collaborateur qui l'a prise, ou l'admin
  const handleReleaseZone = async (msg) => {
    if (!currentUser) return;
    if (!msg.takenBy) return; // pas prise
    // Contrôle : seul celui qui a pris, ou l'admin
    if (msg.takenBy !== currentUser.fc && !isAdmin) return;
    const updated = {
      ...msg,
      takenBy: null,
      takenByPrenom: null,
      takenAt: null,
      releasedBy: currentUser.fc,
      releasedByPrenom: currentUser.prenom,
      releasedAt: Date.now(),
    };
    const keyCopy = msg._key;
    const saveObj = { ...updated };
    delete saveObj._key;
    setMessages((prev) =>
      prev.map((m) => (m._key === keyCopy ? { ...updated, _key: keyCopy } : m)),
    );
    try {
      await window.storage.set(keyCopy, JSON.stringify(saveObj), true);
    } catch (e) {
      console.error("Échec libération zone:", e);
    }
  };

  // ------------------- Réactions emoji (sur tout message) -------------------
  const handleEmojiReaction = async (msg, emoji) => {
    if (!currentUser) return;
    const emojiReactions = msg.emojiReactions || {};
    const current = emojiReactions[emoji] || [];
    const next = current.includes(currentUser.fc)
      ? current.filter((fc) => fc !== currentUser.fc)
      : [...current, currentUser.fc];
    const updatedReactions = { ...emojiReactions };
    if (next.length === 0) {
      delete updatedReactions[emoji];
    } else {
      updatedReactions[emoji] = next;
    }
    const updated = { ...msg, emojiReactions: updatedReactions };
    const keyCopy = msg._key;
    const saveObj = { ...updated };
    delete saveObj._key;
    setMessages((prev) =>
      prev.map((m) =>
        m._key === keyCopy ? { ...updated, _key: keyCopy } : m,
      ),
    );
    try {
      await window.storage.set(keyCopy, JSON.stringify(saveObj), true);
    } catch (e) {
      console.error("Échec réaction:", e);
    }
  };

  // ------------------- Bravos (réactions) -------------------
  const handleBravo = async (msg) => {
    if (!currentUser) return;
    const current = msg.reactions || [];
    const alreadyReacted = current.includes(currentUser.fc);
    const updated = alreadyReacted
      ? current.filter((fc) => fc !== currentUser.fc)
      : [...current, currentUser.fc];
    const updatedMsg = { ...msg, reactions: updated };
    delete updatedMsg._key;
    await storage.set(msg._key, JSON.stringify(updatedMsg), true);
    setMessages((prev) =>
      prev.map((m) => (m._key === msg._key ? { ...updatedMsg, _key: msg._key } : m)),
    );
  };

  // ------------------- Admin: suppression message -------------------
  const handleDeleteMessage = async (msg) => {
    if (!isAdmin) return;
    await storage.del(msg._key, true);
    setMessages((prev) => prev.filter((m) => m._key !== msg._key));
  };

  // ------------------- Admin: toggle chat blocked -------------------
  const toggleChatBlocked = async (reason = "") => {
    if (!isAdmin) return;
    const next = { blocked: !chatBlocked.blocked, reason };
    await storage.set("config:blocked", JSON.stringify(next), true);
    setChatBlocked(next);
  };

  // ------------------- Admin: envoyer un rappel -------------------
  const sendReminder = async (text, durationMinutes = 60) => {
    if (!isAdmin || !text.trim()) return;
    const r = {
      text: text.trim(),
      from: currentUser.prenom,
      timestamp: Date.now(),
      expiresAt: Date.now() + durationMinutes * 60 * 1000,
    };
    await storage.set("config:reminder", JSON.stringify(r), true);
    setReminder(r);

    // Aussi un message dans le fil
    const msg = {
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      text: text.trim(),
      timestamp: Date.now(),
      type: "admin_reminder",
    };
    const key = `msg:${String(msg.timestamp).padStart(15, "0")}_${Math.random().toString(36).slice(2, 8)}`;
    await storage.set(key, JSON.stringify(msg), true);
  };

  const clearReminder = async () => {
    if (!isAdmin) return;
    await storage.del("config:reminder", true);
    setReminder(null);
  };

  // ------------------- Admin: interactions -------------------
  const saveInteractions = async (next) => {
    if (!isAdmin) return;
    await storage.set("config:interactions", JSON.stringify(next), true);
    setInteractions(next);
  };

  const saveZones = async (next) => {
    if (!isAdmin) return;
    await storage.set("config:zones", JSON.stringify(next), true);
    setZones(next);
  };

  // ------------------- Admin: objectifs planifiés (multi-dates) -------------------
  const saveObjectivesForDate = async (date, items) => {
    if (!isAdmin) return;
    const key = `config:objectives:${date}`;
    // UI optimiste
    setObjectivesSchedule((prev) => ({ ...prev, [date]: items }));
    if (items && items.length > 0) {
      await storage.set(key, JSON.stringify(items), true);
    } else {
      await storage.del(key, true);
    }
  };

  const saveRewards = async (next) => {
    if (!isAdmin) return;
    setRewards(next);
    await storage.set("config:rewards", JSON.stringify(next), true);
  };

  // ------------------- Missions -------------------
  // ------------------- Message système dans le chat -------------------
  // Publie un message système (notification de demande) dans le chat partagé
  const postSystemMessage = async (payload) => {
    const timestamp = Date.now();
    const msg = {
      timestamp,
      ...payload, // type, text, fc, prenom, etc.
    };
    const key = `msg:${String(timestamp).padStart(15, "0")}_${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [...prev, { ...msg, _key: key }]);
    try {
      await window.storage.set(key, JSON.stringify(msg), true);
    } catch (e) {
      console.error("Échec message système:", e);
    }
  };

  const createMission = async (mission) => {
    if (!isAdmin) return;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const full = {
      id,
      title: mission.title,
      description: mission.description || "",
      rewardPoints: mission.rewardPoints || 5,
      createdAt: Date.now(),
      createdBy: currentUser.fc,
      status: "open", // open | claimed | completed | validated | failed
      claimedBy: null,
      claimedByPrenom: null,
      claimedAt: null,
      completedAt: null,
      validatedAt: null,
    };
    const key = `mission:${id}`;
    setMissions((prev) => [{ ...full, _key: key }, ...prev]);
    try {
      await window.storage.set(key, JSON.stringify(full), true);
    } catch (e) {
      console.error("Échec création mission:", e);
    }
    // Notification chat
    await postSystemMessage({
      type: "mission_notification",
      missionId: id,
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      role: currentUser.role,
      text: `🎯 Nouvelle mission : ${mission.title} (+${mission.rewardPoints || 5} pts)`,
    });
  };

  const updateMission = async (mission, changes) => {
    const updated = { ...mission, ...changes };
    const keyCopy = mission._key;
    const toSave = { ...updated };
    delete toSave._key;
    setMissions((prev) =>
      prev.map((m) => (m._key === keyCopy ? { ...updated, _key: keyCopy } : m)),
    );
    try {
      await window.storage.set(keyCopy, JSON.stringify(toSave), true);
    } catch (e) {
      console.error("Échec update mission:", e);
    }
  };

  const handleClaimMission = async (mission) => {
    if (!currentUser) return;
    if (mission.status !== "open") return;
    await updateMission(mission, {
      status: "claimed",
      claimedBy: currentUser.fc,
      claimedByPrenom: currentUser.prenom,
      claimedAt: Date.now(),
    });
  };

  // Libérer une mission prise en charge (renvoie en "open")
  // Autorisé pour : celui qui l'a prise, ou l'admin
  const handleReleaseMission = async (mission) => {
    if (!currentUser) return;
    if (!mission.claimedBy) return;
    if (mission.claimedBy !== currentUser.fc && !isAdmin) return;
    await updateMission(mission, {
      status: "open",
      claimedBy: null,
      claimedByPrenom: null,
      claimedAt: null,
      releasedBy: currentUser.fc,
      releasedByPrenom: currentUser.prenom,
      releasedAt: Date.now(),
    });
  };

  const handleCompleteMission = async (mission, proofPhotoUrl = "") => {
    if (!currentUser) return;
    if (mission.claimedBy !== currentUser.fc && !isAdmin) return;
    await updateMission(mission, {
      status: "completed",
      completedAt: Date.now(),
      proofPhotoUrl: proofPhotoUrl || "",
    });
  };

  const handleValidateMission = async (mission) => {
    if (!isAdmin) return;
    await updateMission(mission, {
      status: "validated",
      validatedAt: Date.now(),
      validatedBy: currentUser.fc,
    });
  };

  const handleFailMission = async (mission) => {
    if (!isAdmin) return;
    if (!mission.claimedBy) {
      // Si personne n'a pris la mission, on la supprime simplement
      try {
        await window.storage.delete(mission._key, true);
      } catch (e) {}
      setMissions((prev) => prev.filter((m) => m._key !== mission._key));
      return;
    }
    const rejections = mission.rejections || 0;
    const isSecondRefusal = rejections >= 1;

    if (isSecondRefusal) {
      // 2ème refus : pénalité lourde de −20 pts et mission fermée
      await updateMission(mission, {
        status: "failed",
        validatedAt: Date.now(),
        validatedBy: currentUser.fc,
        rejections: rejections + 1,
      });
      await recordPenalty({
        fc: mission.claimedBy,
        prenom: mission.claimedByPrenom,
        amount: PENALTY_MISSION_FAIL_SECOND,
        reason: `Mission refusée 2 fois : ${mission.title}`,
        type: "mission_fail_second",
        relatedMissionId: mission.id,
      });
    } else {
      // 1er refus : la mission repart en "claimed" (à refaire)
      // On efface la preuve photo pour forcer une nouvelle capture
      // Pas de pénalité, juste la perte des points en attente
      await updateMission(mission, {
        status: "claimed",
        rejections: rejections + 1,
        rejectedAt: Date.now(),
        rejectedBy: currentUser.fc,
        rejectedByPrenom: currentUser.prenom,
        proofPhotoUrl: "", // photo effacée, il doit en refaire une
        completedAt: null,
      });
    }
  };

  const handleDeleteMission = async (mission) => {
    if (!isAdmin) return;
    try {
      await window.storage.delete(mission._key, true);
    } catch (e) {}
    setMissions((prev) => prev.filter((m) => m._key !== mission._key));
  };

  // ------------------- Pénalités -------------------
  const recordPenalty = async (penalty) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const full = { id, timestamp: Date.now(), ...penalty };
    const key = `penalty:${id}`;
    setPenalties((prev) => [...prev, { ...full, _key: key }]);
    try {
      await window.storage.set(key, JSON.stringify(full), true);
    } catch (e) {
      console.error("Échec enregistrement pénalité:", e);
    }
  };

  // ------------------- Clôture de journée (admin) -------------------
  const handleCloseDay = async (date) => {
    if (!isAdmin) return;
    if (closures[date]) return; // déjà clôturé

    const dayItems = objectivesSchedule[date] || [];
    if (dayItems.length === 0) {
      // Pas d'objectifs → juste marquer clôturé
      await storage.set(
        `closure:${date}`,
        JSON.stringify({ date, closedAt: Date.now(), closedBy: currentUser.fc }),
        true,
      );
      setClosures((prev) => ({ ...prev, [date]: true }));
      return;
    }

    // Calcul : pour chaque objectif non atteint → -1 pt à chaque participant actif
    const dayStart = new Date(date).setHours(0, 0, 0, 0);
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayAchievements = messages.filter(
      (m) =>
        m.type === "achievement" &&
        m.timestamp >= dayStart &&
        m.timestamp < dayEnd,
    );

    const progress = {};
    dayAchievements.forEach((m) => {
      if (!progress[m.interactionId]) progress[m.interactionId] = { count: 0, amount: 0 };
      progress[m.interactionId].count += m.count || 1;
      progress[m.interactionId].amount += m.amount || 0;
    });

    // Pénalités pour chaque objectif manqué, appliquées à chaque collaborateur (sauf admin)
    for (const item of dayItems) {
      const interaction = interactions.find((i) => i.id === item.interactionId);
      if (!interaction) continue;
      const p = progress[item.interactionId] || { count: 0, amount: 0 };
      const current = interaction.type === "amount" ? p.amount : p.count;
      if (current < item.target) {
        // Objectif manqué → -1 à chaque utilisateur non-admin
        for (const u of users) {
          if (u.fc === ADMIN_FC) continue;
          await recordPenalty({
            fc: u.fc,
            prenom: u.prenom,
            amount: PENALTY_MISSED_OBJ,
            reason: `Objectif manqué : ${interaction.label} (${current}/${item.target})`,
            type: "missed_obj",
            relatedDate: date,
            relatedInteraction: item.interactionId,
          });
        }
      }
    }

    await storage.set(
      `closure:${date}`,
      JSON.stringify({ date, closedAt: Date.now(), closedBy: currentUser.fc }),
      true,
    );
    setClosures((prev) => ({ ...prev, [date]: true }));
  };

  const handleReopenDay = async (date) => {
    if (!isAdmin) return;
    // Supprime les pénalités liées à cette date
    const toDelete = penalties.filter((p) => p.relatedDate === date);
    for (const p of toDelete) {
      try {
        await window.storage.delete(p._key, true);
      } catch (e) {}
    }
    setPenalties((prev) => prev.filter((p) => p.relatedDate !== date));
    try {
      await window.storage.delete(`closure:${date}`, true);
    } catch (e) {}
    setClosures((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  };

  // ------------------- Photos -------------------
  const handleSendPhoto = async (file, caption = "") => {
    if (!currentUser || !file) return;
    if (chatBlocked.blocked && !isAdmin) return;
    try {
      const dataUrl = await compressImage(file, 800, 0.7);
      const mentions = extractMentionedFcs(caption, users);
      const msg = {
        fc: currentUser.fc,
        prenom: currentUser.prenom,
        role: currentUser.role,
        text: caption,
        timestamp: Date.now(),
        type: "photo",
        dataUrl,
        mentions,
      };
      const key = `msg:${String(msg.timestamp).padStart(15, "0")}_${Math.random().toString(36).slice(2, 8)}`;
      setMessages((prev) => {
        const next = [...prev, { ...msg, _key: key }];
        return next;
      });
      try {
        await window.storage.set(key, JSON.stringify(msg), true);
      } catch (e) {
        console.error("Échec envoi photo:", e);
      }
    } catch (e) {
      console.error("Erreur compression image:", e);
    }
  };

  // ------------------- Statut de présence -------------------
  const handleSetStatus = async (statusId) => {
    if (!currentUser) return;
    const data = { status: statusId, updatedAt: Date.now() };
    setUserStatuses((prev) => ({ ...prev, [currentUser.fc]: data }));
    try {
      await window.storage.set(
        `status:${currentUser.fc}`,
        JSON.stringify(data),
        true,
      );
    } catch (e) {
      console.error("Échec statut:", e);
    }
  };

  // ------------------- Annonce épinglée -------------------
  const handlePinMessage = async (text) => {
    if (!isAdmin || !text.trim()) return;
    const pin = {
      text: text.trim(),
      by: currentUser.prenom,
      timestamp: Date.now(),
    };
    setPinnedMessage(pin);
    await storage.set("config:pinned", JSON.stringify(pin), true);
  };

  const handleUnpin = async () => {
    if (!isAdmin) return;
    setPinnedMessage(null);
    await storage.del("config:pinned", true);
  };

  // ------------------- Sortie produit (pickup requests) -------------------
  const createPickup = async (data) => {
    if (!currentUser) return;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const full = {
      id,
      createdAt: Date.now(),
      createdBy: currentUser.fc,
      createdByPrenom: currentUser.prenom,
      createdByRole: currentUser.role,
      product: data.product,
      reference: data.reference || "",
      invoiceNumber: data.invoiceNumber || "",
      invoicePhotoUrl: data.invoicePhotoUrl || "",
      productPhotoUrl: data.productPhotoUrl || "",
      destination: data.destination, // "comptoir", "caisse", "client", "livraison"
      urgency: data.urgency || "normal", // "normal" | "urgent"
      notes: data.notes || "",
      status: "requested", // requested | in_preparation | ready | picked_up | cancelled
      takenBy: null,
      takenByPrenom: null,
      takenAt: null,
      readyAt: null,
      pickedUpAt: null,
      pickedUpBy: null,
    };
    const key = `pickup:${id}`;
    setPickups((prev) => [{ ...full, _key: key }, ...prev]);
    try {
      await window.storage.set(key, JSON.stringify(full), true);
    } catch (e) {
      console.error("Échec sortie produit:", e);
    }
    // Notification dans le chat
    const productLabel = data.product?.trim() || "produit non précisé";
    const urgentTag = data.urgency === "urgent" ? "🚨 URGENT — " : "";
    await postSystemMessage({
      type: "pickup_notification",
      pickupId: id,
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      role: currentUser.role,
      text: `${urgentTag}📦 Demande de délivrance caisse : ${productLabel}`,
    });
  };

  const updatePickup = async (pickup, changes) => {
    const updated = { ...pickup, ...changes };
    const keyCopy = pickup._key;
    const toSave = { ...updated };
    delete toSave._key;
    setPickups((prev) =>
      prev.map((p) => (p._key === keyCopy ? { ...updated, _key: keyCopy } : p)),
    );
    try {
      await window.storage.set(keyCopy, JSON.stringify(toSave), true);
    } catch (e) {
      console.error("Échec update pickup:", e);
    }
  };

  const handlePickupTake = async (pickup) => {
    if (!currentUser) return;
    await updatePickup(pickup, {
      status: "in_preparation",
      takenBy: currentUser.fc,
      takenByPrenom: currentUser.prenom,
      takenAt: Date.now(),
    });
  };

  const handlePickupReady = async (pickup) => {
    if (!currentUser) return;
    await updatePickup(pickup, {
      status: "ready",
      readyAt: Date.now(),
    });
  };

  const handlePickupConfirm = async (pickup) => {
    if (!currentUser) return;
    await updatePickup(pickup, {
      status: "picked_up",
      pickedUpAt: Date.now(),
      pickedUpBy: currentUser.fc,
    });
  };

  const handlePickupCancel = async (pickup) => {
    await updatePickup(pickup, { status: "cancelled" });
  };

  const handlePickupDelete = async (pickup) => {
    if (!isAdmin) return;
    try {
      await window.storage.delete(pickup._key, true);
    } catch (e) {}
    setPickups((prev) => prev.filter((p) => p._key !== pickup._key));
  };

  // ------------------- Clients à distance (privés) -------------------
  // Seul l'admin et le créateur peuvent voir/éditer la fiche complète
  const createRemoteClient = async (data) => {
    if (!currentUser) return;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const full = {
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: currentUser.fc,
      createdByPrenom: currentUser.prenom,
      name: data.name,
      customerNumber: data.customerNumber || "",
      phone: data.phone || "",
      notes: data.notes || "",
      status: data.status || "active", // "active" | "converted" | "lost"
    };
    const key = `client:${id}`;
    setRemoteClients((prev) => [{ ...full, _key: key }, ...prev]);
    try {
      await window.storage.set(key, JSON.stringify(full), true);
    } catch (e) {
      console.error("Échec création client:", e);
    }
  };

  const updateRemoteClient = async (client, changes) => {
    // Contrôle sécurité : seul créateur ou admin
    if (client.createdBy !== currentUser.fc && !isAdmin) return;
    const keyCopy = client._key;
    const updated = { ...client, ...changes, updatedAt: Date.now() };
    const toSave = { ...updated };
    delete toSave._key;
    setRemoteClients((prev) =>
      prev.map((c) => (c._key === keyCopy ? { ...updated, _key: keyCopy } : c)),
    );
    try {
      await window.storage.set(keyCopy, JSON.stringify(toSave), true);
    } catch (e) {
      console.error("Échec update client:", e);
    }
  };

  const deleteRemoteClient = async (client) => {
    if (client.createdBy !== currentUser.fc && !isAdmin) return;
    try {
      await window.storage.delete(client._key, true);
    } catch (e) {}
    setRemoteClients((prev) => prev.filter((c) => c._key !== client._key));
  };

  // Mes clients (non-admin : seulement mes clients ; admin : tous)
  const visibleRemoteClients = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) return remoteClients;
    return remoteClients.filter((c) => c.createdBy === currentUser.fc);
  }, [remoteClients, isAdmin, currentUser]);

  // ------------------- Dossiers SAV -------------------
  // Workflow : created (6 photos produit) → awaiting_prep →
  //            in_preparation (6 photos colisage) → ready_shipment → shipped
  const createSavCase = async (data) => {
    if (!currentUser) return;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    // Génération du numéro de prise en charge : SAV-YYYYMMDD-XXXX
    const d = new Date();
    const dateStr =
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    const existingToday = savCases.filter((s) =>
      (s.caseNumber || "").includes(`SAV-${dateStr}`),
    ).length;
    const caseNumber = `SAV-${dateStr}-${String(existingToday + 1).padStart(4, "0")}`;

    const full = {
      id,
      caseNumber,
      createdAt: Date.now(),
      createdBy: currentUser.fc,
      createdByPrenom: currentUser.prenom,
      // Infos client / produit
      clientName: data.clientName || "",
      clientPhone: data.clientPhone || "",
      product: data.product,
      reference: data.reference || "",
      serialNumber: data.serialNumber || "",
      issue: data.issue || "",
      // Photos prise en charge (6)
      intakePhotos: data.intakePhotos || [],
      // Préparation expédition
      shippingMethod: "", // Chrono | DPD | Autres
      preparedBy: null,
      preparedByPrenom: null,
      preparedAt: null,
      packagingPhotos: [],
      trackingNumber: "",
      // Statut
      status: "awaiting_prep", // awaiting_prep | in_preparation | ready_shipment | shipped
      notes: data.notes || "",
    };
    const key = `sav:${id}`;
    setSavCases((prev) => [{ ...full, _key: key }, ...prev]);
    try {
      await window.storage.set(key, JSON.stringify(full), true);
    } catch (e) {
      console.error("Échec création SAV:", e);
    }
    return full;
  };

  const updateSavCase = async (savCase, changes) => {
    const updated = { ...savCase, ...changes };
    const keyCopy = savCase._key;
    const toSave = { ...updated };
    delete toSave._key;
    setSavCases((prev) =>
      prev.map((s) => (s._key === keyCopy ? { ...updated, _key: keyCopy } : s)),
    );
    try {
      await window.storage.set(keyCopy, JSON.stringify(toSave), true);
    } catch (e) {
      console.error("Échec update SAV:", e);
    }
  };

  const handleStartSavPrep = async (savCase, shippingMethod) => {
    if (!currentUser) return;
    await updateSavCase(savCase, {
      status: "in_preparation",
      shippingMethod,
      preparedBy: currentUser.fc,
      preparedByPrenom: currentUser.prenom,
      preparedAt: Date.now(),
    });
  };

  const handleFinalizeSavPrep = async (
    savCase,
    packagingPhotos,
    trackingNumber,
  ) => {
    await updateSavCase(savCase, {
      status: "ready_shipment",
      packagingPhotos,
      trackingNumber: trackingNumber || "",
      finalizedAt: Date.now(),
    });
  };

  const handleMarkSavShipped = async (savCase) => {
    await updateSavCase(savCase, {
      status: "shipped",
      shippedAt: Date.now(),
      shippedBy: currentUser.fc,
    });
  };

  const handleDeleteSavCase = async (savCase) => {
    if (!isAdmin) return;
    try {
      await window.storage.delete(savCase._key, true);
    } catch (e) {}
    setSavCases((prev) => prev.filter((s) => s._key !== savCase._key));
  };

  // ------------------- Demandes de congés -------------------
  const saveVacationRequest = async (request) => {
    const key = `vacation:${request.id}`;
    setVacationRequests((prev) => {
      const without = prev.filter((r) => r._key !== key);
      return [{ ...request, _key: key }, ...without];
    });
    try {
      await window.storage.set(key, JSON.stringify(request), true);
    } catch (e) {
      console.error("Échec sauvegarde demande congé:", e);
    }
  };

  const handleVacationReview = async (request, approved, adminNote = "") => {
    if (!isAdmin) return;
    const updated = {
      ...request,
      status: approved ? "approved" : "rejected",
      reviewedBy: currentUser.fc,
      reviewedByPrenom: currentUser.prenom,
      reviewedAt: Date.now(),
      adminNote: adminNote || "",
    };
    delete updated._key;
    await saveVacationRequest(updated);
    // Propager vers l'iframe planning si ouverte
    postToPlanningIframe({
      action: approved ? "vacation_approved" : "vacation_rejected",
      request: updated,
    });
    // Créer un message chat de notification pour le collaborateur
    const notifMsg = {
      fc: "SYSTEM",
      prenom: "Système",
      text: approved
        ? `@${request.prenom} Votre demande de ${request.type} du ${formatDateShort(request.start)} au ${formatDateShort(request.end)} a été validée ✓`
        : `@${request.prenom} Votre demande de ${request.type} du ${formatDateShort(request.start)} au ${formatDateShort(request.end)} a été refusée${adminNote ? ` : ${adminNote}` : ""}`,
      timestamp: Date.now(),
      type: "admin_reminder",
      mentions: [request.prenom],
      reactions: [],
    };
    const msgKey = `msg:${String(notifMsg.timestamp).padStart(15, "0")}_vacnotif`;
    setMessages((prev) => [...prev, { ...notifMsg, _key: msgKey }]);
    try {
      await window.storage.set(msgKey, JSON.stringify(notifMsg), true);
    } catch (e) {}
  };

  const handleVacationDelete = async (request) => {
    if (!isAdmin && request.fc !== currentUser.fc) return;
    try {
      await window.storage.delete(request._key, true);
    } catch (e) {}
    setVacationRequests((prev) => prev.filter((v) => v._key !== request._key));
    postToPlanningIframe({ action: "vacation_cancel", id: request.id });
  };

  // Helper pour envoyer un message à l'iframe planning
  const postToPlanningIframe = (data) => {
    try {
      const iframe = document.querySelector('iframe[title="Planning F890"]');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { source: "collectif-interne", ...data },
          "*",
        );
      }
    } catch (e) {}
  };

  // ------------------- KPIs Commissions -------------------
  const saveCommissionKpi = async (fc, monthKey, kpi) => {
    const id = `${fc}_${monthKey}`;
    const key = `commkpi:${id}`;
    const stamped = { ...kpi, savedAt: Date.now() };
    setCommissionKpis((prev) => ({ ...prev, [id]: stamped }));
    try {
      await window.storage.set(key, JSON.stringify(stamped), true);
    } catch (e) {
      console.error("Échec sauvegarde KPI:", e);
    }
  };

  // ------------------- Commissions logistique -------------------
  const saveLogistiqueCommission = async (fc, monthKey, payload) => {
    const id = `${fc}_${monthKey}`;
    const key = `logicomm:${id}`;
    const stamped = { ...payload, savedAt: Date.now() };
    setLogistiqueCommissions((prev) => ({ ...prev, [id]: stamped }));
    try {
      await window.storage.set(key, JSON.stringify(stamped), true);
    } catch (e) {
      console.error("Échec sauvegarde logistique:", e);
    }
  };

  const saveLogistiqueBaremes = async (next) => {
    setLogistiqueBaremes(next);
    try {
      await window.storage.set(
        "config:logistique-baremes",
        JSON.stringify(next),
        true,
      );
    } catch (e) {
      console.error("Échec sauvegarde barème logistique:", e);
    }
  };

  // ------------------- KPIs Boutique (NPS + Google) -------------------
  const saveShopKpi = async (monthKey, kpi) => {
    const key = `shopkpi:${monthKey}`;
    const stamped = { ...kpi, savedAt: Date.now() };
    setShopKpis((prev) => ({ ...prev, [monthKey]: stamped }));
    try {
      await window.storage.set(key, JSON.stringify(stamped), true);
    } catch (e) {
      console.error("Échec sauvegarde KPI boutique:", e);
    }
  };

  // ------------------- Mon téléphone (annuaire équipe) -------------------
  const handleUpdateMyPhone = async (phone) => {
    if (!currentUser) return;
    const cleaned = (phone || "").trim();
    // Lire les données actuelles puis réécrire avec le nouveau téléphone
    const raw = await storage.get(`users:${currentUser.fc}`, true);
    if (!raw) return;
    try {
      const userData = JSON.parse(raw);
      userData.phone = cleaned;
      await storage.set(
        `users:${currentUser.fc}`,
        JSON.stringify(userData),
        true,
      );
      // Mettre à jour la liste locale immédiatement
      setUsers((prev) =>
        prev.map((u) =>
          u.fc === currentUser.fc ? { ...u, phone: cleaned } : u,
        ),
      );
    } catch (e) {
      console.error("Échec MAJ téléphone:", e);
    }
  };

  // --- Contacts externes (fournisseurs, prestataires, etc.) ---
  const saveExternalContact = async (contact) => {
    const id = contact.id || `ext_${Date.now()}`;
    const data = { ...contact, id, _key: `contact:${id}` };
    setExternalContacts((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = data;
        return next;
      }
      return [...prev, data];
    });
    try {
      await storage.set(`contact:${id}`, JSON.stringify(data), true);
    } catch (e) {
      console.error("Échec save contact externe:", e);
    }
  };
  const deleteExternalContact = async (id) => {
    setExternalContacts((prev) => prev.filter((c) => c.id !== id));
    try {
      await storage.delete(`contact:${id}`, true);
    } catch (e) {}
  };

  // ------------------- Passage de client à un collègue -------------------
  const handleHandover = async (targetUser, note) => {
    if (!currentUser || !targetUser) return;
    const text = `@${targetUser.prenom} je te passe un client${note ? ` — ${note}` : ""}. Merci 🙏`;
    const mentions = [targetUser.fc];
    const msg = {
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      role: currentUser.role,
      text,
      timestamp: Date.now(),
      type: "message",
      mentions,
    };
    const key = `msg:${String(msg.timestamp).padStart(15, "0")}_${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [...prev, { ...msg, _key: key }]);
    try {
      await window.storage.set(key, JSON.stringify(msg), true);
    } catch (e) {
      console.error("Échec handover:", e);
    }
    // Le demandeur redevient disponible
    await handleSetStatus("available");
  };

  // ------------------- Calculs dérivés -------------------
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, [messages.length]);

  const todayAchievements = useMemo(
    () => messages.filter((m) => m.type === "achievement" && m.timestamp >= todayStart),
    [messages, todayStart],
  );

  const progressByInteraction = useMemo(() => {
    const map = {};
    todayAchievements.forEach((m) => {
      if (!map[m.interactionId]) map[m.interactionId] = { count: 0, amount: 0 };
      map[m.interactionId].count += m.count || 1;
      map[m.interactionId].amount += m.amount || 0;
    });
    return map;
  }, [todayAchievements]);

  const pointsByUser = useMemo(() => {
    const map = {};
    // Achievements — on additionne les points de base
    messages.forEach((m) => {
      if (m.type === "achievement") {
        map[m.fc] = (map[m.fc] || 0) + (m.points || 0);
      }
    });
    // Missions validées
    missions.forEach((m) => {
      if (m.status === "validated" && m.claimedBy) {
        map[m.claimedBy] = (map[m.claimedBy] || 0) + (m.rewardPoints || 0);
      }
    });
    // Pénalités
    penalties.forEach((p) => {
      map[p.fc] = (map[p.fc] || 0) - (p.amount || 0);
    });

    // BONUS : +100% sur les points des achievements du MOIS si l'individu dépasse
    // 100% sur au moins un de ses objectifs mensuels (cumul du mois en cours).
    // On agrège par utilisateur et par interaction, puis on compare au cumul cible
    // des objectifs du mois (somme des valeurs demandées tous les jours du mois).
    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    ).getTime();

    // Cumul mensuel des objectifs cibles (toutes les dates du mois courant)
    const monthlyTargetByInteraction = {};
    Object.keys(objectivesSchedule || {}).forEach((dateKey) => {
      const ts = new Date(dateKey).getTime();
      if (ts >= monthStart && ts <= monthEnd) {
        const items = objectivesSchedule[dateKey] || [];
        items.forEach((it) => {
          const k = it.id || it.interactionId;
          if (!k) return;
          monthlyTargetByInteraction[k] =
            (monthlyTargetByInteraction[k] || 0) + (Number(it.target) || 0);
        });
      }
    });

    // Cumul réel par user + interaction sur le mois
    const monthlyAchievedByUserInteraction = {};
    messages.forEach((m) => {
      if (
        m.type === "achievement" &&
        m.timestamp >= monthStart &&
        m.timestamp <= monthEnd
      ) {
        const interactionKey = m.interactionId;
        if (!interactionKey) return;
        const fc = m.fc;
        if (!monthlyAchievedByUserInteraction[fc]) {
          monthlyAchievedByUserInteraction[fc] = {};
        }
        const prev = monthlyAchievedByUserInteraction[fc][interactionKey] || {
          count: 0,
          amount: 0,
          pts: 0,
        };
        prev.count += m.count || 0;
        prev.amount += m.amount || 0;
        prev.pts += m.points || 0;
        monthlyAchievedByUserInteraction[fc][interactionKey] = prev;
      }
    });

    // Appliquer le bonus : pour chaque user, pour chaque interaction dépassée,
    // on double les points gagnés via cette interaction ce mois-ci
    // (on ajoute un bonus = pts déjà comptés, pour un total × 2).
    Object.keys(monthlyAchievedByUserInteraction).forEach((fc) => {
      const userInteractions = monthlyAchievedByUserInteraction[fc];
      Object.keys(userInteractions).forEach((intId) => {
        const target = monthlyTargetByInteraction[intId] || 0;
        if (target <= 0) return;
        const achieved = userInteractions[intId];
        // "Au-delà de 100%" : la valeur de référence est `count` pour type count,
        // `amount` pour type amount (plus représentatif)
        // On prend le max des deux pour être robuste
        const achievedValue = Math.max(achieved.count || 0, achieved.amount || 0);
        if (achievedValue > target) {
          // doublement : on ajoute à nouveau les points gagnés sur cette interaction
          map[fc] = (map[fc] || 0) + (achieved.pts || 0);
        }
      });
    });

    return map;
  }, [messages, missions, penalties, objectivesSchedule]);

  const todayPointsByUser = useMemo(() => {
    const map = {};
    const dayStart = new Date().setHours(0, 0, 0, 0);
    todayAchievements.forEach((m) => {
      map[m.fc] = (map[m.fc] || 0) + (m.points || 0);
    });
    missions.forEach((m) => {
      if (m.status === "validated" && m.claimedBy && m.validatedAt >= dayStart) {
        map[m.claimedBy] = (map[m.claimedBy] || 0) + (m.rewardPoints || 0);
      }
    });
    penalties.forEach((p) => {
      if (p.timestamp >= dayStart) {
        map[p.fc] = (map[p.fc] || 0) - (p.amount || 0);
      }
    });
    return map;
  }, [todayAchievements, missions, penalties]);

  const leaderboard = useMemo(() => {
    return [...users]
      .map((u) => ({
        ...u,
        points: pointsByUser[u.fc] || 0,
        todayPoints: todayPointsByUser[u.fc] || 0,
      }))
      .sort((a, b) => b.todayPoints - a.todayPoints || b.points - a.points);
  }, [users, pointsByUser, todayPointsByUser]);

  const reminderActive =
    reminder && reminder.expiresAt && reminder.expiresAt > Date.now();

  // ------------------- Rendus -------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (view !== "chat") {
    return (
      <AuthScreen
        view={view}
        fc={fc}
        setFc={setFc}
        prenom={prenom}
        setPrenom={setPrenom}
        role={role}
        setRole={setRole}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        error={error}
        setError={setError}
        setView={setView}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* ==== DARK MODE STYLESHEET (global overrides) ==== */}
      <style>{`
        body.dark-mode, html.dark-mode { color-scheme: dark; }
        body.dark-mode .bg-slate-50 { background-color: #0f172a !important; }
        body.dark-mode .bg-slate-100 { background-color: #1e293b !important; }
        body.dark-mode .bg-white { background-color: #1e293b !important; }
        body.dark-mode .bg-slate-200 { background-color: #334155 !important; }
        body.dark-mode .bg-slate-300 { background-color: #475569 !important; }
        body.dark-mode .text-slate-800 { color: #e2e8f0 !important; }
        body.dark-mode .text-slate-700 { color: #cbd5e1 !important; }
        body.dark-mode .text-slate-900 { color: #f1f5f9 !important; }
        body.dark-mode .text-slate-600 { color: #94a3b8 !important; }
        body.dark-mode .text-slate-500 { color: #94a3b8 !important; }
        body.dark-mode .border-slate-100 { border-color: #334155 !important; }
        body.dark-mode .border-slate-200 { border-color: #334155 !important; }
        body.dark-mode .border-slate-300 { border-color: #475569 !important; }
        body.dark-mode .bg-gradient-to-br.from-slate-50,
        body.dark-mode .bg-gradient-to-r.from-slate-50 { background-image: linear-gradient(to bottom right, #1e293b, #0f172a) !important; }
        body.dark-mode input, body.dark-mode textarea, body.dark-mode select {
          background-color: #1e293b !important; color: #e2e8f0 !important; border-color: #475569 !important;
        }
        body.dark-mode input::placeholder, body.dark-mode textarea::placeholder { color: #64748b !important; }
        body.dark-mode .bg-slate-50.hover\\:bg-slate-100:hover { background-color: #334155 !important; }
        body.dark-mode .hover\\:bg-slate-100:hover { background-color: #334155 !important; }
        body.dark-mode .hover\\:bg-slate-200:hover { background-color: #475569 !important; }
        body.dark-mode .hover\\:bg-slate-50:hover { background-color: #1e293b !important; }
        /* Cartes colorées subtils → teinter légèrement */
        body.dark-mode .bg-amber-50 { background-color: #422006 !important; }
        body.dark-mode .bg-amber-100 { background-color: #4a2a12 !important; }
        body.dark-mode .bg-red-50 { background-color: #3f0a0a !important; }
        body.dark-mode .bg-red-100 { background-color: #4c0d0d !important; }
        body.dark-mode .bg-emerald-50 { background-color: #022c22 !important; }
        body.dark-mode .bg-emerald-100 { background-color: #034737 !important; }
        body.dark-mode .bg-blue-50 { background-color: #0c1e3a !important; }
        body.dark-mode .bg-blue-100 { background-color: #10254d !important; }
        body.dark-mode .bg-purple-50 { background-color: #2a1042 !important; }
        body.dark-mode .bg-indigo-50 { background-color: #1a1a4a !important; }
        body.dark-mode .bg-fuchsia-50 { background-color: #3a0d35 !important; }
        body.dark-mode .bg-pink-50 { background-color: #3a0d28 !important; }
        body.dark-mode .bg-rose-50 { background-color: #3c0d16 !important; }
        body.dark-mode .bg-orange-50 { background-color: #3a1a06 !important; }
        body.dark-mode .bg-yellow-50 { background-color: #3a2e06 !important; }
        body.dark-mode .bg-teal-50 { background-color: #042825 !important; }
        body.dark-mode .bg-sky-50 { background-color: #0a2540 !important; }
        body.dark-mode .bg-violet-50 { background-color: #2a1052 !important; }
        /* Libellés de couleur gardent leur teinte mais avec variante moins saturée */
        body.dark-mode .text-amber-700,
        body.dark-mode .text-amber-800,
        body.dark-mode .text-amber-900 { color: #fcd34d !important; }
        body.dark-mode .text-red-700,
        body.dark-mode .text-red-800,
        body.dark-mode .text-red-900 { color: #fca5a5 !important; }
        body.dark-mode .text-emerald-700,
        body.dark-mode .text-emerald-800,
        body.dark-mode .text-emerald-900 { color: #6ee7b7 !important; }
        body.dark-mode .text-blue-700,
        body.dark-mode .text-blue-800,
        body.dark-mode .text-blue-900 { color: #93c5fd !important; }
        body.dark-mode .text-fuchsia-700,
        body.dark-mode .text-fuchsia-800 { color: #f0abfc !important; }
        body.dark-mode .text-indigo-700 { color: #a5b4fc !important; }
        body.dark-mode .text-purple-700 { color: #c4b5fd !important; }
        /* Ombres plus marquées en dark */
        body.dark-mode .shadow-lg, body.dark-mode .shadow-xl, body.dark-mode .shadow-2xl { box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important; }
        /* Bordures colorées restent visibles */
        body.dark-mode .border-amber-200 { border-color: #78350f !important; }
        body.dark-mode .border-red-200 { border-color: #7f1d1d !important; }
        body.dark-mode .border-emerald-200 { border-color: #064e3b !important; }
        body.dark-mode .border-blue-200 { border-color: #1e3a8a !important; }
      `}</style>

      {/* ============== HEADER ============== */}
      <Header
        currentUser={currentUser}
        isAdmin={isAdmin}
        mainView={mainView}
        onGoHome={() => setMainView("home")}
        onGoChat={() => setMainView("chat")}
        onLogout={handleLogout}
        onOpenSidebar={() => setSidebarOpen(true)}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((v) => !v)}
        soundOn={soundOn}
        onToggleSound={() => {
          // Si on active le son, tenter d'amorcer l'AudioContext + jouer un son de test
          if (!soundOn) {
            setSoundOn(true);
            setTimeout(() => playSoundMessage(), 50);
          } else {
            setSoundOn(false);
          }
        }}
        myStatus={userStatuses[currentUser.fc]}
        onSetStatus={handleSetStatus}
        unreadMentionsCount={0}
      />

      {/* ============== ANNONCE ÉPINGLÉE ============== */}
      {pinnedMessage && (
        <PinnedBanner
          pin={pinnedMessage}
          isAdmin={isAdmin}
          onUnpin={handleUnpin}
        />
      )}

      {/* ============== RAPPEL (BANNIÈRE) ============== */}
      {reminderActive && (
        <ReminderBanner reminder={reminder} isAdmin={isAdmin} onClear={clearReminder} />
      )}

      {/* ============== CHAT BLOQUÉ (BANNIÈRE) ============== */}
      {chatBlocked.blocked && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-sm text-amber-800">
          <Lock size={16} />
          <span className="font-medium">Chat temporairement bloqué</span>
          {chatBlocked.reason && <span>— {chatBlocked.reason}</span>}
        </div>
      )}

      {/* ============== VUE PRINCIPALE : HOME ou CHAT ============== */}
      {mainView === "home" ? (
        <HomeDashboard
          currentUser={currentUser}
          isAdmin={isAdmin}
          todayPoints={todayPointsByUser[currentUser.fc] || 0}
          pendingAlertsCount={
            messages.filter((m) => m.type === "zone_alert" && !m.takenBy).length
          }
          openMissionsCount={missions.filter((m) => m.status === "open").length}
          overdueMissionsCount={missions.filter((m) => isMissionOverdue(m)).length}
          myActiveMissionsCount={
            missions.filter(
              (m) =>
                m.claimedBy === currentUser.fc &&
                ["claimed", "completed"].includes(m.status),
            ).length
          }
          myActiveMissions={missions.filter(
            (m) =>
              m.claimedBy === currentUser.fc &&
              ["claimed", "completed"].includes(m.status),
          )}
          activePickupsCount={
            pickups.filter((p) =>
              ["requested", "in_preparation", "ready"].includes(p.status),
            ).length
          }
          myRemoteClientsCount={
            visibleRemoteClients.filter((c) => c.status === "active").length
          }
          savCasesCount={
            savCases.filter((s) =>
              ["awaiting_prep", "in_preparation", "ready_shipment"].includes(
                s.status,
              ),
            ).length
          }
          objectives={objectives}
          progressByInteraction={progressByInteraction}
          interactions={interactions}
          onOpenChat={() => setMainView("chat")}
          onOpenCallPanel={() => setCallPanelOpen(true)}
          onOpenTeamPhones={() => setTeamPhonesOpen(true)}
          onOpenPickups={() => setPickupsOpen(true)}
          onOpenMissions={() => setMissionsOpen(true)}
          onOpenRewards={() => setRewardsOpen(true)}
          onOpenProgression={() => setProgressionOpen(true)}
          onOpenCommissions={() => setCommissionsOpen(true)}
          onOpenNps={() => setNpsPanelOpen(true)}
          currentNps={(() => {
            const now = new Date();
            const k = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
            return shopKpis[k]?.npsScore || 0;
          })()}
          currentGoogleRating={(() => {
            const now = new Date();
            const k = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
            return shopKpis[k]?.googleRating || 0;
          })()}
          onOpenHistory={() => setHistoryOpen(true)}
          totalPoints={pointsByUser[currentUser.fc] || 0}
          onOpenRemoteClients={() => setRemoteClientsOpen(true)}
          onOpenAdmin={() => setAdminPanelOpen(true)}
          onOpenHr={() => {
            setHrPanelOpen(true);
            requestHrData();
          }}
          onOpenLogiCommissions={() => setLogiCommissionsAdminOpen(true)}
          onOpenZone={() => setZoneModal(true)}
          onOpenPickupCreate={() => setPickupCreateOpen(true)}
          onOpenZoneAlerts={() => setZoneAlertsOpen(true)}
          onOpenMissionsStatus={() => setMissionsStatusOpen(true)}
          onOpenMyMissionsHistory={() => setMyMissionsHistoryOpen(true)}
          onOpenPlanning={() => setPlanningOpen(true)}
          onOpenVacationPanel={() => setVacationPanelOpen(true)}
          pendingVacationsCount={
            isAdmin
              ? vacationRequests.filter((r) => r.status === "pending").length
              : vacationRequests.filter(
                  (r) =>
                    r.fc === currentUser.fc &&
                    (r.status === "pending" || r.status === "approved"),
                ).length
          }
          onOpenSav={() => setSavPanelOpen(true)}
          onAchievement={handleInteractionClick}
        />
      ) : (
        <>
          {/* ============== CONTENU ============== */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar classement */}
            <Sidebar
              leaderboard={leaderboard}
              currentFc={currentUser.fc}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              userStatuses={userStatuses}
            />

            {/* Zone principale */}
            <main className="flex-1 flex flex-col min-w-0 bg-white">
              {/* Messages */}
              <MessageList
                messages={messages}
                currentFc={currentUser.fc}
                isAdmin={isAdmin}
                users={users}
                onBravo={handleBravo}
                onEmojiReact={handleEmojiReaction}
                onDelete={handleDeleteMessage}
                onTakeZone={handleTakeZone}
                onReleaseZone={handleReleaseZone}
                messagesEndRef={messagesEndRef}
              />

              {/* Saisie */}
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSend={handleSendMessage}
                onSendPhoto={handleSendPhoto}
                users={users}
                currentFc={currentUser.fc}
                disabled={chatBlocked.blocked && !isAdmin}
                sending={sending}
                notificationsEnabled={notificationsEnabled}
                onRequestNotifications={async () => {
                  if (typeof Notification === "undefined") return;
                  const perm = await Notification.requestPermission();
                  setNotificationsEnabled(perm === "granted");
                }}
              />
            </main>
          </div>
        </>
      )}

      {/* ============== POP-UP DEMANDES EN ATTENTE ============== */}
      <ActiveDemandsBanner
        pickups={pickups}
        missions={missions}
        zoneAlerts={messages.filter((m) => m.type === "zone_alert")}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenPickups={() => setPickupsOpen(true)}
        onOpenMissions={() => setMissionsOpen(true)}
        onOpenZoneAlerts={() => setZoneAlertsOpen(true)}
        onTakePickup={handlePickupTake}
        onTakeMission={handleClaimMission}
        onTakeZoneAlert={handleTakeZone}
      />

      {/* ============== TOASTS ============== */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </div>

      {/* ============== MODALS ============== */}
      {amountModal && (
        <AmountInputModal
          interaction={amountModal.interaction}
          onSubmit={handleAmountSubmit}
          onClose={() => setAmountModal(null)}
        />
      )}
      {zoneModal && (
        <ZoneSelectorModal
          zones={zones}
          onSelect={handleZoneAlert}
          onClose={() => setZoneModal(false)}
        />
      )}
      {historyOpen && (
        <HistoryPanel
          messages={messages}
          currentFc={currentUser.fc}
          isAdmin={isAdmin}
          onTakeZone={handleTakeZone}
          onReleaseZone={handleReleaseZone}
          onDelete={handleDeleteMessage}
          onClose={() => setHistoryOpen(false)}
        />
      )}
      {missionsOpen && (
        <MissionsPanel
          missions={missions}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onClaim={handleClaimMission}
          onComplete={handleCompleteMission}
          onValidate={handleValidateMission}
          onFail={handleFailMission}
          onDelete={handleDeleteMission}
          onCreate={createMission}
          onClose={() => setMissionsOpen(false)}
        />
      )}
      {rewardsOpen && (
        <RewardsBoard
          users={users}
          currentFc={currentUser.fc}
          pointsByUser={pointsByUser}
          rewards={rewards}
          missions={missions}
          penalties={penalties}
          messages={messages}
          onClose={() => setRewardsOpen(false)}
        />
      )}
      {pickupsOpen && (
        <PickupsPanel
          pickups={pickups}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onTake={handlePickupTake}
          onReady={handlePickupReady}
          onConfirm={handlePickupConfirm}
          onCancel={handlePickupCancel}
          onDelete={handlePickupDelete}
          onCreateClick={() => setPickupCreateOpen(true)}
          onClose={() => setPickupsOpen(false)}
        />
      )}
      {pickupCreateOpen && (
        <PickupCreateModal
          onCreate={async (data) => {
            await createPickup(data);
            setPickupCreateOpen(false);
          }}
          onClose={() => setPickupCreateOpen(false)}
        />
      )}
      {pinModalOpen && isAdmin && (
        <PinModal
          currentPin={pinnedMessage}
          onPin={async (text) => {
            await handlePinMessage(text);
            setPinModalOpen(false);
          }}
          onClose={() => setPinModalOpen(false)}
        />
      )}
      {remoteClientsOpen && (
        <RemoteClientsPanel
          clients={visibleRemoteClients}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onCreateClick={() => setRemoteClientEdit("new")}
          onEditClick={(client) => setRemoteClientEdit(client)}
          onDelete={deleteRemoteClient}
          onClose={() => setRemoteClientsOpen(false)}
        />
      )}
      {remoteClientEdit !== null && (
        <RemoteClientEditModal
          client={remoteClientEdit === "new" ? null : remoteClientEdit}
          onSave={async (data) => {
            if (remoteClientEdit === "new") {
              await createRemoteClient(data);
            } else {
              await updateRemoteClient(remoteClientEdit, data);
            }
            setRemoteClientEdit(null);
          }}
          onClose={() => setRemoteClientEdit(null)}
        />
      )}
      {teamPhonesOpen && (
        <TeamPhonesPanel
          users={users}
          userStatuses={userStatuses}
          currentFc={currentUser.fc}
          isAdmin={isAdmin}
          externalContacts={externalContacts}
          onSaveContact={saveExternalContact}
          onDeleteContact={deleteExternalContact}
          onUpdateMyPhone={handleUpdateMyPhone}
          onClose={() => setTeamPhonesOpen(false)}
        />
      )}
      {callPanelOpen && (
        <CallPanel
          myStatus={userStatuses[currentUser.fc]}
          onSetStatus={handleSetStatus}
          onOpenTeamPhones={() => setTeamPhonesOpen(true)}
          onOpenHandover={() => setHandoverOpen(true)}
          onOpenWifiCall={() => setWifiCallOpen(true)}
          onClose={() => setCallPanelOpen(false)}
        />
      )}
      {wifiCallOpen && (
        <WifiCallModal
          currentUser={currentUser}
          users={users}
          postSystemMessage={postSystemMessage}
          onClose={() => setWifiCallOpen(false)}
        />
      )}
      {handoverOpen && (
        <HandoverModal
          users={users}
          currentFc={currentUser.fc}
          userStatuses={userStatuses}
          onHandover={handleHandover}
          onClose={() => setHandoverOpen(false)}
        />
      )}
      {zoneAlertsOpen && (
        <ZoneAlertsPanel
          alerts={messages.filter((m) => m.type === "zone_alert")}
          currentFc={currentUser.fc}
          isAdmin={isAdmin}
          onTakeZone={handleTakeZone}
          onReleaseZone={handleReleaseZone}
          onCreateClick={() => {
            setZoneAlertsOpen(false);
            setZoneModal(true);
          }}
          onClose={() => setZoneAlertsOpen(false)}
        />
      )}
      {missionsStatusOpen && (
        <MissionsStatusPanel
          missions={missions}
          currentFc={currentUser.fc}
          isAdmin={isAdmin}
          onClaim={handleClaimMission}
          onRelease={handleReleaseMission}
          onCreateClick={() => {
            setMissionsStatusOpen(false);
            setMissionsOpen(true);
          }}
          onClose={() => setMissionsStatusOpen(false)}
        />
      )}
      {myMissionsHistoryOpen && (
        <MyMissionsHistoryPanel
          missions={missions}
          currentFc={currentUser.fc}
          onComplete={handleCompleteMission}
          onRelease={handleReleaseMission}
          onClose={() => setMyMissionsHistoryOpen(false)}
        />
      )}
      {vacationPanelOpen && (
        <VacationRequestsPanel
          requests={vacationRequests}
          isAdmin={isAdmin}
          currentFc={currentUser.fc}
          onReview={handleVacationReview}
          onDelete={handleVacationDelete}
          onClose={() => setVacationPanelOpen(false)}
        />
      )}
      {progressionOpen && (
        <ProgressionPanel
          totalPoints={pointsByUser[currentUser.fc] || 0}
          breakdown={{
            achievements: messages
              .filter((m) => m.type === "achievement" && m.fc === currentUser.fc)
              .reduce((s, m) => s + (m.points || 0), 0),
            missions: missions
              .filter((m) => m.status === "validated" && m.claimedBy === currentUser.fc)
              .reduce((s, m) => s + (m.rewardPoints || 0), 0),
            bonus: Math.max(
              0,
              (pointsByUser[currentUser.fc] || 0) -
                (messages
                  .filter((m) => m.type === "achievement" && m.fc === currentUser.fc)
                  .reduce((s, m) => s + (m.points || 0), 0) +
                  missions
                    .filter(
                      (m) =>
                        m.status === "validated" && m.claimedBy === currentUser.fc,
                    )
                    .reduce((s, m) => s + (m.rewardPoints || 0), 0) -
                  penalties
                    .filter((p) => p.fc === currentUser.fc)
                    .reduce((s, p) => s + (p.amount || 0), 0)),
            ),
            penalties: penalties
              .filter((p) => p.fc === currentUser.fc)
              .reduce((s, p) => s + (p.amount || 0), 0),
          }}
          onClose={() => setProgressionOpen(false)}
        />
      )}
      {logiCommissionsAdminOpen && (
        <LogistiqueCommissionsPanel
          currentUser={currentUser}
          isAdmin={true}
          logistiqueCommissions={logistiqueCommissions}
          shopKpis={shopKpis}
          baremes={logistiqueBaremes}
          onSaveBaremes={saveLogistiqueBaremes}
          onSave={saveLogistiqueCommission}
          onClose={() => setLogiCommissionsAdminOpen(false)}
        />
      )}
      {commissionsOpen && (() => {
        // Détecter si l'utilisateur est logistique (depuis planning)
        let isLogi = false;
        if (!isAdmin) {
          try {
            const raw = localStorage.getItem("plf890_data_v1");
            if (raw) {
              const d = JSON.parse(raw);
              const fcClean = (currentUser?.fc || "").toUpperCase();
              const emp = (d.employees || []).find(
                (e) => (e.fcId || "").toUpperCase() === fcClean,
              );
              if (
                emp &&
                (emp.role === "Livreur Polyvalent" ||
                  emp.role === "Livreur Magasinier" ||
                  emp.role === "Magasinier")
              ) {
                isLogi = true;
              }
            }
          } catch (e) {}
        }
        if (isLogi) {
          return (
            <LogistiqueCommissionsPanel
              currentUser={currentUser}
              isAdmin={false}
              logistiqueCommissions={logistiqueCommissions}
              shopKpis={shopKpis}
              baremes={logistiqueBaremes}
              onSave={saveLogistiqueCommission}
              onClose={() => setCommissionsOpen(false)}
            />
          );
        }
        return (
          <CommissionsPanel
            currentUser={currentUser}
            isAdmin={isAdmin}
            messages={messages}
            commissionKpis={commissionKpis}
            onSaveKpi={saveCommissionKpi}
            onClose={() => setCommissionsOpen(false)}
          />
        );
      })()}
      {npsPanelOpen && (
        <NpsGooglePanel
          shopKpis={shopKpis}
          isAdmin={isAdmin}
          onSaveKpi={saveShopKpi}
          onClose={() => setNpsPanelOpen(false)}
        />
      )}
      {hrPanelOpen && (
        <HrPanel
          hrData={hrData}
          hrLoading={hrLoading}
          onRefresh={requestHrData}
          messages={messages}
          missions={missions}
          penalties={penalties}
          vacationRequests={vacationRequests}
          commissionKpis={commissionKpis}
          shopKpis={shopKpis}
          pointsByUser={pointsByUser}
          onClose={() => setHrPanelOpen(false)}
        />
      )}
      {planningOpen && (
        <PlanningNativePanel
          currentUser={currentUser}
          isAdmin={isAdmin}
          vacationRequests={vacationRequests}
          onClose={() => setPlanningOpen(false)}
        />
      )}
      {false && planningOpen && (
        <PlanningModal
          currentUser={currentUser}
          isAdmin={isAdmin}
          vacationRequests={vacationRequests}
          onVacationRequest={async (r) => {
            await saveVacationRequest({ ...r, _key: `vacation:${r.id}` });
            // Notification chat avec mention @admin
            const startFr = new Date(r.start).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            });
            const endFr = new Date(r.end).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            });
            await postSystemMessage({
              type: "vacation_notification",
              vacationId: r.id,
              fc: r.fc || currentUser.fc,
              prenom: r.prenom || currentUser.prenom,
              role: r.role || currentUser.role,
              text: `🏖️ ${r.prenom || currentUser.prenom} demande un congé (${r.type}) du ${startFr} au ${endFr} — en attente de validation`,
            });
          }}
          onVacationCancel={(id) => {
            const req = vacationRequests.find((r) => r.id === id);
            if (req) handleVacationDelete(req);
          }}
          onClose={() => setPlanningOpen(false)}
        />
      )}
      {savPanelOpen && (
        <SavPanel
          cases={savCases}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onCreateClick={() => setSavCreateOpen(true)}
          onStartPrep={handleStartSavPrep}
          onOpenPrep={(c) => setSavPrepCase(c)}
          onMarkShipped={handleMarkSavShipped}
          onDelete={handleDeleteSavCase}
          onClose={() => setSavPanelOpen(false)}
        />
      )}
      {savCreateOpen && (
        <SavIntakeModal
          onCreate={async (data) => {
            await createSavCase(data);
            setSavCreateOpen(false);
          }}
          onClose={() => setSavCreateOpen(false)}
        />
      )}
      {savPrepCase && (
        <SavPrepModal
          savCase={savPrepCase}
          onFinalize={async (photos, tracking) => {
            await handleFinalizeSavPrep(savPrepCase, photos, tracking);
            setSavPrepCase(null);
          }}
          onClose={() => setSavPrepCase(null)}
        />
      )}

      {/* ============== PANNEAU ADMIN ============== */}
      {adminPanelOpen && isAdmin && (
        <AdminPanel
          onClose={() => setAdminPanelOpen(false)}
          interactions={interactions}
          saveInteractions={saveInteractions}
          zones={zones}
          saveZones={saveZones}
          objectivesSchedule={objectivesSchedule}
          saveObjectivesForDate={saveObjectivesForDate}
          rewards={rewards}
          saveRewards={saveRewards}
          missions={missions}
          createMission={createMission}
          handleValidateMission={handleValidateMission}
          handleFailMission={handleFailMission}
          handleDeleteMission={handleDeleteMission}
          penalties={penalties}
          closures={closures}
          handleCloseDay={handleCloseDay}
          handleReopenDay={handleReopenDay}
          messages={messages}
          chatBlocked={chatBlocked}
          toggleChatBlocked={toggleChatBlocked}
          sendReminder={sendReminder}
          users={users}
          leaderboard={leaderboard}
        />
      )}
    </div>
  );
}

// ========================================================================
// AUTH SCREEN
// ========================================================================
function AuthScreen({
  view,
  fc,
  setFc,
  prenom,
  setPrenom,
  role,
  setRole,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  error,
  setError,
  setView,
  handleLogin,
  handleRegister,
}) {
  const isLogin = view === "login";
  const onSubmit = isLogin ? handleLogin : handleRegister;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <BoulangerLogo className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-1">Collectif Interne</h1>
        <p className="text-center text-slate-500 mb-6 text-sm">
          {isLogin ? "Connectez-vous avec votre FC" : "Créez votre compte collaborateur"}
        </p>

        <div className="space-y-3">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                <div className="relative">
                  <Sparkles
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Votre prénom"
                    onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Votre rôle
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ROLES.filter((r) => r.id !== "admin").map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border-2 text-sm font-semibold transition ${
                        role === r.id
                          ? `${ROLE_COLORS[r.id].bg} ${ROLE_COLORS[r.id].text} border-current`
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">FC</label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={fc}
                onChange={(e) => setFc(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Ex : FC1309"
                autoFocus={isLogin}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              />
            </div>
          </div>

          {/* Se souvenir de moi */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700">
              Se souvenir de moi
            </span>
            <span className="text-xs text-slate-400 ml-auto">
              (reconnexion automatique)
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>

          <div className="text-center text-sm text-slate-600 pt-2">
            {isLogin ? (
              <>
                Pas encore de compte ?{" "}
                <button
                  onClick={() => {
                    setView("register");
                    setError("");
                  }}
                  className="text-orange-600 hover:underline font-semibold"
                >
                  Inscription
                </button>
              </>
            ) : (
              <>
                Déjà inscrit ?{" "}
                <button
                  onClick={() => {
                    setView("login");
                    setError("");
                  }}
                  className="text-orange-600 hover:underline font-semibold"
                >
                  Connexion
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 mt-6 text-xs text-slate-400 border-t border-slate-100 pt-4">
          <Shield size={14} className="mt-0.5 shrink-0" />
          <p>
            Session conservée après connexion. Les messages et performances sont partagés
            avec l'équipe du magasin.
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// LOGO BOULANGER (stylisé)
// ========================================================================
function BoulangerLogo({ className = "", small = false }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg ${
          small ? "w-9 h-9" : "w-14 h-14"
        }`}
      >
        <span
          className={`text-white font-black ${small ? "text-xl" : "text-3xl"} tracking-tighter`}
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          B
        </span>
      </div>
      {!small && (
        <div className="leading-tight">
          <div className="font-black text-slate-900 text-xl tracking-tight">boulanger</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            chat interne
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================================================
// HEADER
// ========================================================================
// ========================================================================
// ZONE ALERTS PANEL — Liste détaillée des clients en attente
// ========================================================================
function ZoneAlertsPanel({
  alerts,
  currentFc,
  isAdmin,
  onTakeZone,
  onReleaseZone,
  onCreateClick,
  onClose,
}) {
  const [filter, setFilter] = useState("pending");

  // Classement
  const pending = alerts.filter((a) => !a.takenBy);
  const taken = alerts.filter((a) => !!a.takenBy);
  const fast = taken.filter(
    (a) => a.takenAt - a.timestamp < 5 * 60 * 1000,
  );
  const slow = taken.filter(
    (a) => a.takenAt - a.timestamp >= 5 * 60 * 1000,
  );

  let filtered;
  if (filter === "pending") filtered = pending;
  else if (filter === "fast") filtered = fast;
  else filtered = slow;

  // Tri : plus récent d'abord pour les prises, plus ancien d'abord pour l'attente
  filtered = [...filtered].sort((a, b) =>
    filter === "pending"
      ? a.timestamp - b.timestamp
      : b.timestamp - a.timestamp,
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} />
            <div>
              <h2 className="font-bold text-lg">Clients en attente</h2>
              <p className="text-xs text-white/80">
                Suivi des alertes zones du jour
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateClick}
              className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
            >
              <Plus size={14} />
              Nouvelle
            </button>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Résumé chiffré */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-2xl font-black text-red-600">
              {pending.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              En attente
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-600">
              {fast.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              &lt; 5 min
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-600">
              {slow.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              &gt; 5 min
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "pending"
                ? "border-red-600 text-red-700 bg-red-50"
                : "border-transparent text-slate-600"
            }`}
          >
            En attente
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "pending" ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {pending.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("fast")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "fast"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                : "border-transparent text-slate-600"
            }`}
          >
            &lt; 5 min
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "fast" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {fast.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("slow")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "slow"
                ? "border-amber-600 text-amber-700 bg-amber-50"
                : "border-transparent text-slate-600"
            }`}
          >
            &gt; 5 min
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "slow" ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {slow.length}
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Zap size={32} className="mx-auto mb-2 opacity-40" />
              {filter === "pending"
                ? "Aucun client en attente 🎉"
                : filter === "fast"
                  ? "Aucune alerte prise rapidement."
                  : "Aucune alerte prise en retard."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((a) => (
                <ZoneAlertRow
                  key={a._key || `${a.timestamp}-${a.fc}`}
                  alert={a}
                  currentFc={currentFc}
                  isAdmin={isAdmin}
                  onTakeZone={onTakeZone}
                  onReleaseZone={onReleaseZone}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// ZONE ALERT ROW
// ========================================================================
function ZoneAlertRow({ alert, currentFc, isAdmin, onTakeZone, onReleaseZone }) {
  const taken = !!alert.takenBy;
  const takenByMe = alert.takenBy === currentFc;
  const waitMs = taken
    ? alert.takenAt - alert.timestamp
    : Date.now() - alert.timestamp;
  const waitSec = Math.floor(waitMs / 1000);
  const waitMin = Math.floor(waitSec / 60);
  const remSec = waitSec % 60;
  const waitLabel =
    waitMin >= 1 ? `${waitMin} min ${remSec}s` : `${waitSec}s`;
  const isFast = taken && waitMs < 5 * 60 * 1000;

  // Couleur carte
  const cls = !taken
    ? "bg-red-50 border-red-300 animate-pulse-slow"
    : isFast
      ? "bg-emerald-50 border-emerald-300"
      : "bg-amber-50 border-amber-300";

  return (
    <div className={`rounded-xl p-3 border-2 ${cls}`}>
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">{alert.zoneEmoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="font-black text-slate-800 text-sm">
              {alert.zoneLabel}
            </span>
            {!taken && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-0.5">
                <Clock size={10} /> {waitLabel} d'attente
              </span>
            )}
            {taken && isFast && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
                <Check size={10} /> Pris en {waitLabel}
              </span>
            )}
            {taken && !isFast && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-600 text-white flex items-center gap-0.5">
                <Clock size={10} /> Pris après {waitLabel}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-600">
            Signalé par <strong>{alert.prenom}</strong>{" "}
            <span className="font-mono text-[10px] text-slate-400">
              ({alert.fc})
            </span>{" "}
            à {formatTime(alert.timestamp)}
          </div>
          {taken && (
            <div className="text-xs text-slate-700 mt-0.5">
              Pris par <strong>{alert.takenByPrenom}</strong>
              {takenByMe ? " (vous)" : ""}{" "}
              <span className="font-mono text-[10px] text-slate-400">
                ({alert.takenBy})
              </span>{" "}
              à {formatTime(alert.takenAt)}
            </div>
          )}
          {!taken && alert.releasedByPrenom && (
            <div className="text-[11px] text-amber-700 italic mt-0.5">
              ↺ Libéré par {alert.releasedByPrenom} à{" "}
              {formatTime(alert.releasedAt)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {!taken && (
            <button
              onClick={() => onTakeZone(alert)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Hand size={12} />
              Prendre
            </button>
          )}
          {taken && (takenByMe || isAdmin) && onReleaseZone && (
            <button
              onClick={() => {
                onReleaseZone(alert);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1"
            >
              <X size={12} />
              Libérer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// MY MISSIONS HISTORY PANEL — Historique perso avec photos
// ========================================================================
function MyMissionsHistoryPanel({
  missions,
  currentFc,
  onComplete,
  onRelease,
  onClose,
}) {
  const [filter, setFilter] = useState("active");
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [retryModalMission, setRetryModalMission] = useState(null);

  // Mes missions uniquement
  const mine = missions.filter((m) => m.claimedBy === currentFc);

  const active = mine.filter(
    (m) => m.status === "claimed" || m.status === "completed",
  );
  const validated = mine.filter((m) => m.status === "validated");
  const failed = mine.filter((m) => m.status === "failed");

  let filtered;
  if (filter === "active") filtered = active;
  else if (filter === "validated") filtered = validated;
  else filtered = failed;

  filtered = [...filtered].sort((a, b) =>
    (b.claimedAt || b.createdAt) - (a.claimedAt || a.createdAt),
  );

  // Calcul des points en attente (missions completed non encore validées)
  const pendingPoints = mine
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + (m.rewardPoints || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={20} />
            <div>
              <h2 className="font-bold text-lg">Mes missions</h2>
              <p className="text-xs text-white/80">
                Suivi perso — photos et points
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Résumé */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xl font-black text-fuchsia-600">
              {active.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              En cours
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-amber-600">
              {pendingPoints}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              Pts en attente
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-emerald-600">
              {validated.reduce((s, m) => s + (m.rewardPoints || 0), 0)}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              Pts validés
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setFilter("active")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "active"
                ? "border-fuchsia-600 text-fuchsia-700 bg-fuchsia-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Actives
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "active" ? "bg-fuchsia-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {active.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("validated")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "validated"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Validées
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "validated" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {validated.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("failed")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "failed"
                ? "border-red-600 text-red-700 bg-red-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Perdues
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "failed" ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {failed.length}
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Target size={32} className="mx-auto mb-2 opacity-40" />
              {filter === "active"
                ? "Aucune mission en cours."
                : filter === "validated"
                  ? "Aucune mission validée pour le moment."
                  : "Aucune mission perdue 💪"}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((m) => (
                <MyMissionRow
                  key={m._key || m.id}
                  mission={m}
                  onOpenLightbox={(src) => setLightboxSrc(src)}
                  onRetry={(mission) => setRetryModalMission(mission)}
                  onRelease={onRelease}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxSrc && (
        <PhotoLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      {/* Modale pour refaire une mission refusée (nouvelle photo) */}
      {retryModalMission && (
        <MissionProofModal
          mission={retryModalMission}
          onConfirm={async (photoUrl) => {
            await onComplete(retryModalMission, photoUrl);
            setRetryModalMission(null);
          }}
          onClose={() => setRetryModalMission(null)}
        />
      )}
    </div>
  );
}

// ========================================================================
// MY MISSION ROW — une ligne d'historique personnel
// ========================================================================
function MyMissionRow({ mission, onOpenLightbox, onRetry, onRelease }) {
  const rejections = mission.rejections || 0;
  const hasBeenRejected = rejections > 0;
  const isRejectedOnce =
    mission.status === "claimed" && hasBeenRejected;

  // Config visuelle par statut
  let wrapCls = "bg-white border-slate-200";
  let badge = null;
  if (mission.status === "claimed") {
    if (isRejectedOnce) {
      wrapCls = "bg-red-50 border-red-300 animate-pulse-slow";
      badge = (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-0.5">
          <AlertCircle size={10} /> À REFAIRE (refusée {rejections}×)
        </span>
      );
    } else {
      wrapCls = "bg-fuchsia-50 border-fuchsia-200";
      badge = (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-fuchsia-500 text-white flex items-center gap-0.5">
          <Clock size={10} /> En cours
        </span>
      );
    }
  } else if (mission.status === "completed") {
    wrapCls = "bg-amber-50 border-amber-300";
    badge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-600 text-white flex items-center gap-0.5">
        <Clock size={10} /> En attente de validation — {mission.rewardPoints} pts en attente
      </span>
    );
  } else if (mission.status === "validated") {
    wrapCls = "bg-emerald-50 border-emerald-300";
    badge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
        <CheckCircle2 size={10} /> Validée — +{mission.rewardPoints} pts
      </span>
    );
  } else if (mission.status === "failed") {
    wrapCls = "bg-red-50 border-red-300";
    badge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-700 text-white flex items-center gap-0.5">
        <XCircle size={10} /> Refusée 2× — −{PENALTY_MISSION_FAIL_SECOND} pts
      </span>
    );
  }

  return (
    <div className={`rounded-xl p-3 border-2 ${wrapCls}`}>
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <h4 className="font-bold text-slate-800 text-sm">
              {mission.title}
            </h4>
            {badge}
          </div>
          {mission.description && (
            <p className="text-xs text-slate-600 mb-1">
              {mission.description}
            </p>
          )}
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <div>
              Prise à {formatTime(mission.claimedAt)}
            </div>
            {mission.completedAt && mission.status !== "claimed" && (
              <div>Terminée à {formatTime(mission.completedAt)}</div>
            )}
            {mission.rejectedByPrenom && mission.status === "claimed" && (
              <div className="text-red-700 font-semibold">
                ⚠ Refusée par {mission.rejectedByPrenom} à{" "}
                {formatTime(mission.rejectedAt)} — Photo à refaire
              </div>
            )}
            {mission.validatedAt && mission.status === "validated" && (
              <div className="text-emerald-700">
                ✓ Validée à {formatTime(mission.validatedAt)}
              </div>
            )}
          </div>
        </div>
        {mission.proofPhotoUrl && (
          <button
            type="button"
            onClick={() => onOpenLightbox(mission.proofPhotoUrl)}
            className="relative rounded-lg overflow-hidden border-2 border-amber-300 hover:border-amber-500 transition group shrink-0"
            style={{ width: "80px", height: "80px" }}
          >
            <img
              src={mission.proofPhotoUrl}
              alt="Preuve"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
              <Maximize2
                size={18}
                className="text-white opacity-0 group-hover:opacity-100"
              />
            </div>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {mission.status === "claimed" && !isRejectedOnce && (
          <>
            <button
              onClick={() => onRetry(mission)}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1"
            >
              <Camera size={12} />
              J'ai terminé (photo)
            </button>
            {onRelease && (
              <button
                onClick={() => {
                  onRelease(mission);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1"
              >
                <X size={12} />
                Libérer
              </button>
            )}
          </>
        )}
        {isRejectedOnce && (
          <button
            onClick={() => onRetry(mission)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 animate-pulse"
          >
            <Camera size={12} />
            Refaire — attention : 2e refus = −{PENALTY_MISSION_FAIL_SECOND} pts
          </button>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// MISSIONS STATUS PANEL — Vue tri par prise en charge (comme ZoneAlerts)
// ========================================================================
function MissionsStatusPanel({
  missions,
  currentFc,
  isAdmin,
  onClaim,
  onRelease,
  onCreateClick,
  onClose,
}) {
  const [filter, setFilter] = useState("pending");

  // Classement
  const pending = missions.filter(
    (m) => m.status === "open" && !isMissionOverdue(m),
  );
  const overdue = missions.filter((m) => isMissionOverdue(m));
  // Missions prises (claimed / completed / validated / failed avec claimedBy)
  const taken = missions.filter(
    (m) =>
      m.claimedBy &&
      ["claimed", "completed", "validated", "failed"].includes(m.status),
  );
  const takenFast = taken.filter(
    (m) => m.claimedAt && m.claimedAt - m.createdAt < MISSION_CLAIM_DELAY_MS,
  );
  const takenSlow = taken.filter(
    (m) =>
      m.claimedAt && m.claimedAt - m.createdAt >= MISSION_CLAIM_DELAY_MS,
  );

  let filtered;
  if (filter === "pending") filtered = pending;
  else if (filter === "overdue") filtered = overdue;
  else if (filter === "fast") filtered = takenFast;
  else filtered = takenSlow;

  filtered = [...filtered].sort((a, b) =>
    filter === "pending" || filter === "overdue"
      ? a.createdAt - b.createdAt
      : b.claimedAt - a.claimedAt,
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={20} />
            <div>
              <h2 className="font-bold text-lg">Missions — Prises en charge</h2>
              <p className="text-xs text-white/80">
                Délai max : 4 h après création
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onCreateClick}
                className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
              >
                <Plus size={14} />
                Nouvelle
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Résumé chiffré */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-xl font-black text-fuchsia-600">
              {pending.length}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">
              En attente
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-red-600">
              {overdue.length}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">
              En défaut
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-emerald-600">
              {takenFast.length}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">
              &lt; 4 h
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-amber-600">
              {takenSlow.length}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">
              &gt; 4 h
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 shrink-0 px-2 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
              filter === "pending"
                ? "border-fuchsia-600 text-fuchsia-700 bg-fuchsia-50"
                : "border-transparent text-slate-600"
            }`}
          >
            En attente
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "pending" ? "bg-fuchsia-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {pending.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("overdue")}
            className={`flex-1 shrink-0 px-2 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
              filter === "overdue"
                ? "border-red-600 text-red-700 bg-red-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Défaut
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "overdue" ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {overdue.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("fast")}
            className={`flex-1 shrink-0 px-2 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
              filter === "fast"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                : "border-transparent text-slate-600"
            }`}
          >
            &lt; 4h
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "fast" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {takenFast.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("slow")}
            className={`flex-1 shrink-0 px-2 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
              filter === "slow"
                ? "border-amber-600 text-amber-700 bg-amber-50"
                : "border-transparent text-slate-600"
            }`}
          >
            &gt; 4h
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "slow" ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {takenSlow.length}
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Target size={32} className="mx-auto mb-2 opacity-40" />
              {filter === "pending"
                ? "Aucune mission en attente 🎉"
                : filter === "overdue"
                  ? "Aucune mission en défaut."
                  : filter === "fast"
                    ? "Aucune mission prise rapidement."
                    : "Aucune mission prise en retard."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((m) => (
                <MissionStatusRow
                  key={m._key || m.id}
                  mission={m}
                  currentFc={currentFc}
                  isAdmin={isAdmin}
                  onClaim={onClaim}
                  onRelease={onRelease}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// MISSION STATUS ROW
// ========================================================================
function MissionStatusRow({ mission, currentFc, isAdmin, onClaim, onRelease }) {
  const [proofLightbox, setProofLightbox] = useState(false);
  const taken = !!mission.claimedBy;
  const takenByMe = mission.claimedBy === currentFc;
  const overdue = isMissionOverdue(mission);

  // Durée
  const sinceCreated = Date.now() - mission.createdAt;
  const waitMs = taken ? mission.claimedAt - mission.createdAt : sinceCreated;
  const hours = Math.floor(waitMs / (60 * 60 * 1000));
  const minutes = Math.floor((waitMs % (60 * 60 * 1000)) / 60000);
  const waitLabel =
    hours >= 1 ? `${hours}h${String(minutes).padStart(2, "0")}` : `${minutes} min`;

  const isFast = taken && waitMs < MISSION_CLAIM_DELAY_MS;

  // Carte
  const cls = !taken
    ? overdue
      ? "bg-red-50 border-red-400 animate-pulse-slow"
      : "bg-fuchsia-50 border-fuchsia-300"
    : isFast
      ? "bg-emerald-50 border-emerald-300"
      : "bg-amber-50 border-amber-300";

  // Libellé du statut
  let statusBadge;
  if (!taken) {
    statusBadge = overdue ? (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-0.5">
        <AlertCircle size={10} /> DÉFAUT DE PRISE — {waitLabel}
      </span>
    ) : (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-fuchsia-500 text-white flex items-center gap-0.5">
        <Clock size={10} /> {waitLabel} en attente
      </span>
    );
  } else if (isFast) {
    statusBadge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
        <Check size={10} /> Prise en {waitLabel}
      </span>
    );
  } else {
    statusBadge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-600 text-white flex items-center gap-0.5">
        <Clock size={10} /> Prise après {waitLabel}
      </span>
    );
  }

  return (
    <div className={`rounded-xl p-3 border-2 ${cls}`}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <h4 className="font-bold text-slate-800 text-sm">{mission.title}</h4>
            {statusBadge}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
              +{mission.rewardPoints} pts
            </span>
          </div>
          {mission.description && (
            <p className="text-xs text-slate-600 mb-1">{mission.description}</p>
          )}
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <div>
              Créée le {formatTime(mission.createdAt)}
            </div>
            {taken && (
              <div className="text-slate-700">
                Prise par <strong>{mission.claimedByPrenom}</strong>
                {takenByMe ? " (vous)" : ""}{" "}
                <span className="font-mono text-slate-400">
                  ({mission.claimedBy})
                </span>{" "}
                à {formatTime(mission.claimedAt)}
              </div>
            )}
            {!taken && mission.releasedByPrenom && (
              <div className="text-amber-700 italic">
                ↺ Libérée par {mission.releasedByPrenom} à{" "}
                {formatTime(mission.releasedAt)}
              </div>
            )}
            {mission.status === "completed" && (
              <div className="text-blue-700">
                ✓ Déclarée terminée à {formatTime(mission.completedAt)}
              </div>
            )}
            {mission.status === "validated" && (
              <div className="text-emerald-700 font-semibold">
                ✓✓ Validée — +{mission.rewardPoints} pts attribués
              </div>
            )}
            {mission.status === "failed" && (
              <div className="text-red-700 font-semibold">
                ✗ Mal réalisée — pénalité appliquée
              </div>
            )}
          </div>
          {mission.proofPhotoUrl && (
            <button
              type="button"
              onClick={() => setProofLightbox(true)}
              className="mt-2 relative rounded-lg overflow-hidden border-2 border-amber-300 hover:border-amber-500 transition group inline-block"
              style={{ maxWidth: "200px" }}
            >
              <img
                src={mission.proofPhotoUrl}
                alt="Preuve"
                className="w-full h-20 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                <Maximize2
                  size={16}
                  className="text-white opacity-0 group-hover:opacity-100 transition"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                <span className="text-[10px] text-white font-semibold flex items-center gap-1">
                  <Camera size={10} /> Preuve
                </span>
              </div>
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {!taken && (
            <button
              onClick={() => onClaim(mission)}
              className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Hand size={12} />
              Prendre
            </button>
          )}
          {taken &&
            (takenByMe || isAdmin) &&
            onRelease &&
            mission.status === "claimed" && (
              <button
                onClick={() => {
                  onRelease(mission);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1"
              >
                <X size={12} />
                Libérer
              </button>
            )}
        </div>
      </div>
      {proofLightbox && mission.proofPhotoUrl && (
        <PhotoLightbox
          src={mission.proofPhotoUrl}
          onClose={() => setProofLightbox(false)}
        />
      )}
    </div>
  );
}

// ========================================================================
// PROGRESSION PANEL — Jauge de grade commercial
// ========================================================================
function ProgressionPanel({
  totalPoints,
  breakdown,
  onClose,
}) {
  const { current, next, ratio, pointsInLevel, pointsToNext, cumulBase } =
    computeGradeProgress(totalPoints);
  const pct = Math.round(ratio * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)" }}
      >
        <div
          className={`bg-gradient-to-r ${current.gradientFrom} ${current.gradientTo} text-white px-5 py-4 flex items-center justify-between shrink-0`}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">{current.emoji}</div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                Mon grade
              </div>
              <h2 className="font-black text-xl leading-tight">
                {current.label}
              </h2>
              <div className="text-xs opacity-90 font-semibold">
                {totalPoints.toLocaleString("fr-FR")} points cumulés
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 min-h-0 p-5 space-y-4 overflow-y-auto overscroll-contain">
          {/* === JAUGE PRINCIPALE === */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-bold ${current.text}`}>
                {current.emoji} {current.label}
              </span>
              {next ? (
                <span className="text-sm font-bold text-slate-500">
                  {next.emoji} {next.label}
                </span>
              ) : (
                <span className="text-sm font-bold text-amber-600">
                  🏆 Grade maximal
                </span>
              )}
            </div>
            <div className="relative h-6 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${current.gradientFrom} ${current.gradientTo} transition-all flex items-center justify-end pr-2`}
                style={{ width: `${Math.max(pct, 5)}%` }}
              >
                {pct >= 18 && (
                  <span className="text-white text-xs font-black">
                    {pct}%
                  </span>
                )}
              </div>
              {pct < 18 && (
                <span className="absolute inset-0 flex items-center justify-center text-slate-700 text-xs font-black">
                  {pct}%
                </span>
              )}
            </div>
            {next ? (
              <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500">
                <span>
                  {pointsInLevel.toLocaleString("fr-FR")} pts dans ce niveau
                </span>
                <span className="font-bold text-slate-700">
                  {pointsToNext.toLocaleString("fr-FR")} pts pour{" "}
                  {next.short}
                </span>
              </div>
            ) : (
              <div className="text-center mt-2 text-xs text-slate-600 font-semibold">
                Vous avez atteint le grade maximal ! 🎉
              </div>
            )}
          </div>

          {/* === TOUS LES GRADES === */}
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Les 7 grades commerciaux
            </div>
            <div className="space-y-1.5">
              {GRADES.map((g, i) => {
                const prev = i === 0 ? 0 : GRADES[i - 1].nextAt || 0;
                const isReached = totalPoints >= prev;
                const isCurrent = g.id === current.id;
                return (
                  <div
                    key={g.id}
                    className={`flex items-center gap-2 p-2 rounded-lg transition ${
                      isCurrent
                        ? `${g.bg} ${g.border} border-2 shadow-sm`
                        : isReached
                          ? "bg-white border border-slate-200"
                          : "bg-white border border-slate-100 opacity-50"
                    }`}
                  >
                    <div
                      className={`text-2xl ${isReached ? "" : "grayscale"}`}
                    >
                      {g.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-bold text-sm ${isCurrent ? g.text : "text-slate-800"}`}
                      >
                        {g.label}
                        {isCurrent && (
                          <span
                            className={`ml-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full ${g.bg} ${g.text} border ${g.border}`}
                          >
                            EN COURS
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {prev === 0
                          ? "Point de départ"
                          : `À partir de ${prev.toLocaleString("fr-FR")} pts`}
                      </div>
                    </div>
                    {isReached && !isCurrent && (
                      <Check
                        size={16}
                        className="text-emerald-600 shrink-0"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* === DÉTAIL DES POINTS === */}
          {breakdown && (
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                Détail du cumul
              </div>
              <div className="space-y-1.5 text-sm">
                <BreakdownRow
                  label="Ventes & objectifs (achievements)"
                  value={breakdown.achievements}
                />
                <BreakdownRow
                  label="Missions validées"
                  value={breakdown.missions}
                />
                {breakdown.bonus > 0 && (
                  <BreakdownRow
                    label="🎁 Bonus ×2 (objectifs dépassés)"
                    value={breakdown.bonus}
                    highlight
                  />
                )}
                <BreakdownRow
                  label="Pénalités"
                  value={-Math.abs(breakdown.penalties)}
                  negative={breakdown.penalties > 0}
                />
                <div className="border-t border-slate-200 pt-1.5 mt-1.5 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total</span>
                  <span
                    className={`font-black text-lg ${totalPoints >= 0 ? "text-amber-600" : "text-red-600"}`}
                  >
                    {totalPoints.toLocaleString("fr-FR")} pts
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* === INFO BONUS === */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 flex items-start gap-2">
            <span className="text-base">🎯</span>
            <div>
              <strong>Bonus objectifs :</strong> quand vous dépassez 100% sur
              un objectif mensuel, les points gagnés sur cet objectif sont{" "}
              <strong>doublés</strong> automatiquement.
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-900 flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <div>
              <strong>Rappel :</strong> si une mission est refusée ou un
              objectif non réalisé, les points correspondants sont retirés
              automatiquement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, negative, highlight }) {
  const tone = highlight
    ? "text-amber-700 font-bold"
    : negative
      ? "text-red-600"
      : value >= 0
        ? "text-slate-700"
        : "text-red-600";
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-600">{label}</span>
      <span className={`font-mono font-semibold ${tone}`}>
        {value >= 0 ? "+" : ""}
        {value.toLocaleString("fr-FR")}
      </span>
    </div>
  );
}

// ========================================================================
// COMMISSIONS PANEL — Calcul et affichage de la commission mensuelle
// ========================================================================
// ========================================================================
// LOGISTIQUE COMMISSIONS PANEL — pour Livreurs / Magasiniers
// ========================================================================
function LogistiqueCommissionsPanel({
  currentUser,
  isAdmin,
  logistiqueCommissions,
  shopKpis,
  baremes,
  onSaveBaremes,
  onSave,
  onClose,
}) {
  const today = new Date();
  const [monthCursor, setMonthCursor] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
  );
  // Liste des employés logistique (depuis le planning local)
  const logiEmployees = useMemo(() => {
    try {
      const raw = localStorage.getItem("plf890_data_v1");
      if (!raw) return [];
      const d = JSON.parse(raw);
      return (d.employees || []).filter(
        (e) =>
          e.role === "Livreur Polyvalent" ||
          e.role === "Livreur Magasinier" ||
          e.role === "Magasinier",
      );
    } catch {
      return [];
    }
  }, []);

  // Si admin → choisir le salarié à voir, sinon = soi-même
  const [selectedFc, setSelectedFc] = useState(currentUser.fc);
  const targetFc = isAdmin ? selectedFc : currentUser.fc;
  const targetEmp = isAdmin
    ? logiEmployees.find(
        (e) => (e.fcId || "").toUpperCase() === targetFc.toUpperCase(),
      )
    : logiEmployees.find(
        (e) => (e.fcId || "").toUpperCase() === currentUser.fc.toUpperCase(),
      );
  const targetName = targetEmp?.firstName || currentUser.prenom;

  const id = `${targetFc}_${monthCursor}`;
  const stored = logistiqueCommissions[id] || {
    counts: {},
    kpis: {},
    extras: [],
  };

  // Mode édition admin
  const [editMode, setEditMode] = useState(false);
  // Barèmes effectifs (custom > défaut)
  const effectiveBaremes = useMemo(
    () => ({ ...LOGISTIQUE_DEFAULT_BAREMES, ...(baremes || {}) }),
    [baremes],
  );

  const [editCounts, setEditCounts] = useState(stored.counts || {});
  const [editKpis, setEditKpis] = useState(stored.kpis || {});
  const [editExtras, setEditExtras] = useState(stored.extras || []);
  // Mode édition des barèmes (admin)
  const [baremesMode, setBaremesMode] = useState(false);
  const [editBaremes, setEditBaremes] = useState(effectiveBaremes);

  useEffect(() => {
    if (!editMode) {
      setEditCounts(stored.counts || {});
      setEditKpis(stored.kpis || {});
      setEditExtras(stored.extras || []);
    }
  }, [stored, editMode]);

  useEffect(() => {
    if (!baremesMode) setEditBaremes(effectiveBaremes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveBaremes, baremesMode]);

  // Pré-remplir NPS/Google si shopKpis dispo
  const monthShop = shopKpis?.[monthCursor];
  const effectiveKpis = {
    ...(stored.kpis || {}),
    npsMonth:
      stored.kpis?.npsMonth !== undefined
        ? stored.kpis.npsMonth
        : monthShop?.npsScore || 0,
    googleMonth:
      stored.kpis?.googleMonth !== undefined
        ? stored.kpis.googleMonth
        : monthShop?.googleRating || 0,
  };

  // Calcul commission courante (avec barèmes en vigueur)
  const result = computeLogistiqueCommission({
    counts: stored.counts || {},
    kpis: effectiveKpis,
    extras: stored.extras || [],
    baremes: effectiveBaremes,
  });

  // Navigation mois
  const changeMonth = (d) => {
    const [y, m] = monthCursor.split("-").map(Number);
    const dt = new Date(y, m - 1 + d, 1);
    setMonthCursor(
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`,
    );
  };
  const monthLabel = (() => {
    const [y, m] = monthCursor.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  })();

  const startEdit = () => {
    setEditMode(true);
    setEditCounts(stored.counts || {});
    setEditKpis({
      npsMonth: effectiveKpis.npsMonth || 0,
      googleMonth: effectiveKpis.googleMonth || 0,
    });
    setEditExtras(stored.extras || []);
  };
  const cancelEdit = () => {
    setEditMode(false);
  };
  const saveEdit = () => {
    onSave(targetFc, monthCursor, {
      counts: editCounts,
      kpis: editKpis,
      extras: editExtras,
    });
    setEditMode(false);
  };

  // Helpers extras
  const addExtra = () => {
    setEditExtras([
      ...editExtras,
      { id: `e_${Date.now()}`, label: "Nouvelle prime", note: "", amount: 0 },
    ]);
  };
  const updateExtra = (idx, field, val) => {
    setEditExtras(
      editExtras.map((e, i) => (i === idx ? { ...e, [field]: val } : e)),
    );
  };
  const removeExtra = (idx) => {
    setEditExtras(editExtras.filter((_, i) => i !== idx));
  };

  // Édition des barèmes
  const updateBareme = (key, field, val) => {
    setEditBaremes({
      ...editBaremes,
      [key]: { ...(editBaremes[key] || {}), [field]: val },
    });
  };
  const saveBaremes = () => {
    if (onSaveBaremes) onSaveBaremes(editBaremes);
    setBaremesMode(false);
  };
  const resetBaremes = () => {
    setEditBaremes(LOGISTIQUE_DEFAULT_BAREMES);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)" }}
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Truck size={22} />
            <div>
              <h2 className="font-bold text-lg">Primes logistique</h2>
              <p className="text-xs text-white/80">{targetName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Sélecteur salarié (admin) */}
        {isAdmin && logiEmployees.length > 0 && (
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 shrink-0">
            <select
              value={selectedFc}
              onChange={(e) => {
                setSelectedFc(e.target.value);
                setEditMode(false);
              }}
              className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded"
            >
              {logiEmployees.map((emp) => (
                <option key={emp.id} value={emp.fcId}>
                  {emp.firstName} ({emp.role}) — {emp.fcId}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation mois */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 hover:bg-slate-200 rounded-lg"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-sm font-bold text-slate-800 capitalize">
            {monthLabel}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 hover:bg-slate-200 rounded-lg"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto overscroll-contain">
          {/* Total */}
          <div className="bg-gradient-to-br from-orange-500 to-red-700 text-white rounded-xl p-4 text-center">
            <div className="text-[11px] uppercase tracking-wider font-bold opacity-90">
              Prime estimée — {monthLabel}
            </div>
            <div className="text-4xl font-black my-1">
              {result.total.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="text-[10px] opacity-80">
              {result.lines.filter((l) => !l.zero).length} ligne(s) actives
            </div>
          </div>

          {/* Mode lecture : afficher les lignes */}
          {!editMode && (
            <>
              <div className="space-y-2">
                {result.lines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`bg-white border rounded-lg p-3 ${line.zero ? "opacity-50 border-slate-200" : line.isExtra ? "border-purple-200 bg-purple-50/30" : "border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-800">
                          {line.category}
                          {line.isExtra && (
                            <span className="ml-2 text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                              EXTRA
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {line.label}
                        </div>
                      </div>
                      <div
                        className={`font-black ${line.zero ? "text-slate-400" : line.gain > 0 ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {line.gain > 0 ? `+${line.gain.toLocaleString("fr-FR")}€` : "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Boutons admin */}
              {isAdmin && !baremesMode && (
                <div className="space-y-2">
                  <button
                    onClick={startEdit}
                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Edit2 size={14} />
                    Modifier les compteurs du mois
                  </button>
                  <button
                    onClick={() => {
                      setEditBaremes(effectiveBaremes);
                      setBaremesMode(true);
                    }}
                    className="w-full px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Settings size={14} />
                    Modifier les barèmes (tarifs unitaires)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Mode édition des BARÈMES (admin) */}
          {baremesMode && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900">
                ⚠️ Les barèmes s'appliquent à <strong>tous les salariés</strong> et à <strong>tous les mois</strong>. Les calculs sont recalculés automatiquement à l'enregistrement.
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Tarifs unitaires
                </div>
                <div className="space-y-1.5">
                  {[
                    { key: "infinitySAV", label: "Infinity SAV", suffix: "€/dossier" },
                    { key: "infinityUno", label: "Infinity Home Uno", suffix: "€/inst." },
                    { key: "infinityDuo", label: "Infinity Home Duo", suffix: "€/inst." },
                    { key: "infinityTrio", label: "Infinity Home Trio", suffix: "€/inst." },
                    { key: "installTV", label: "Installation TV", suffix: "€/inst." },
                    { key: "installPorte", label: "Installation porte encastrable", suffix: "€/pose" },
                    { key: "inventaire100", label: "Inventaire Tx 100%", suffix: "€/inv." },
                  ].map((it) => (
                    <div
                      key={it.key}
                      className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800">
                          {it.label}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Défaut : {LOGISTIQUE_DEFAULT_BAREMES[it.key]?.unit}{it.suffix}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={editBaremes[it.key]?.unit ?? 0}
                          onChange={(e) =>
                            updateBareme(it.key, "unit", parseFloat(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1.5 border border-slate-300 rounded text-sm text-right font-mono"
                        />
                        <span className="text-[10px] text-slate-500">{it.suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Bonus mensuels (seuil + montant)
                </div>
                <div className="space-y-1.5">
                  <div className="bg-white border border-slate-200 rounded-lg p-2 space-y-1.5">
                    <div className="text-sm font-semibold text-slate-800">
                      Bonus NPS mois
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-500 flex-1">
                        Seuil NPS
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editBaremes.npsMonthBonus?.threshold ?? 60}
                        onChange={(e) =>
                          updateBareme("npsMonthBonus", "threshold", parseFloat(e.target.value) || 0)
                        }
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-right font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-500 flex-1">
                        Bonus si atteint
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={editBaremes.npsMonthBonus?.bonus ?? 50}
                          onChange={(e) =>
                            updateBareme("npsMonthBonus", "bonus", parseFloat(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-right font-mono"
                        />
                        <span className="text-[10px] text-slate-500">€</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2 space-y-1.5">
                    <div className="text-sm font-semibold text-slate-800">
                      Bonus Google mois
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-500 flex-1">
                        Seuil note Google ★
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={editBaremes.googleMonthBonus?.threshold ?? 4.5}
                        onChange={(e) =>
                          updateBareme("googleMonthBonus", "threshold", parseFloat(e.target.value) || 0)
                        }
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-right font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-500 flex-1">
                        Bonus si atteint
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={editBaremes.googleMonthBonus?.bonus ?? 30}
                          onChange={(e) =>
                            updateBareme("googleMonthBonus", "bonus", parseFloat(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-right font-mono"
                        />
                        <span className="text-[10px] text-slate-500">€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={resetBaremes}
                className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={12} />
                Réinitialiser aux valeurs par défaut
              </button>
            </>
          )}

          {/* Mode édition admin */}
          {editMode && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-800">
                💡 Saisissez les volumes du mois. Les primes sont recalculées
                automatiquement à l'enregistrement.
              </div>

              {/* Compteurs */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Volumes du mois
                </div>
                <div className="space-y-1.5">
                  {[
                    { key: "infinitySAV", label: "Infinity SAV", suffix: "€/dossier" },
                    { key: "infinityUno", label: "Infinity Home Uno", suffix: "€/inst." },
                    { key: "infinityDuo", label: "Infinity Home Duo", suffix: "€/inst." },
                    { key: "infinityTrio", label: "Infinity Home Trio", suffix: "€/inst." },
                    { key: "installTV", label: "Installation TV", suffix: "€/inst." },
                    { key: "installPorte", label: "Installation porte encastrable", suffix: "€/pose" },
                    { key: "inventaire100", label: "Inventaire Tx 100%", suffix: "€/inv." },
                  ].map((it) => (
                    <div
                      key={it.key}
                      className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800">
                          {it.label}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {(effectiveBaremes[it.key]?.unit ?? 0).toString().replace(".", ",")}{it.suffix}
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={editCounts[it.key] || 0}
                        onChange={(e) =>
                          setEditCounts({
                            ...editCounts,
                            [it.key]: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-20 px-2 py-1.5 border border-slate-300 rounded text-sm text-right font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Indicateurs satisfaction
                </div>
                <div className="space-y-1.5">
                  <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800">
                        Score NPS du mois
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ≥ {effectiveBaremes.npsMonthBonus?.threshold ?? 60} → +{effectiveBaremes.npsMonthBonus?.bonus ?? 50}€
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editKpis.npsMonth || 0}
                      onChange={(e) =>
                        setEditKpis({
                          ...editKpis,
                          npsMonth: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1.5 border border-slate-300 rounded text-sm text-right font-mono"
                    />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800">
                        Note Google du mois
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ≥ {effectiveBaremes.googleMonthBonus?.threshold ?? 4.5}★ → +{effectiveBaremes.googleMonthBonus?.bonus ?? 30}€
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={editKpis.googleMonth || 0}
                      onChange={(e) =>
                        setEditKpis({
                          ...editKpis,
                          googleMonth: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1.5 border border-slate-300 rounded text-sm text-right font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Lignes extras */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Primes additionnelles ({editExtras.length})
                  </div>
                  <button
                    onClick={addExtra}
                    className="text-[10px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Plus size={11} /> Ajouter
                  </button>
                </div>
                <div className="space-y-1.5">
                  {editExtras.length === 0 && (
                    <div className="text-center text-slate-400 text-xs py-3 italic">
                      Aucune prime additionnelle
                    </div>
                  )}
                  {editExtras.map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="bg-purple-50 border border-purple-200 rounded-lg p-2 space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <input
                          value={ex.label}
                          onChange={(e) => updateExtra(idx, "label", e.target.value)}
                          placeholder="Intitulé"
                          className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                        />
                        <input
                          type="number"
                          step="0.5"
                          value={ex.amount}
                          onChange={(e) => updateExtra(idx, "amount", e.target.value)}
                          placeholder="€"
                          className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-right font-mono"
                        />
                        <button
                          onClick={() => removeExtra(idx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <input
                        value={ex.note}
                        onChange={(e) => updateExtra(idx, "note", e.target.value)}
                        placeholder="Note (motif, détail…)"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {editMode && (
          <div className="border-t border-slate-200 bg-white p-3 flex gap-2 shrink-0">
            <button
              onClick={cancelEdit}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={saveEdit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              Enregistrer
            </button>
          </div>
        )}
        {baremesMode && (
          <div className="border-t border-slate-200 bg-white p-3 flex gap-2 shrink-0">
            <button
              onClick={() => setBaremesMode(false)}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={saveBaremes}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              Enregistrer barèmes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CommissionsPanel({
  currentUser,
  isAdmin,
  messages,
  commissionKpis,
  onSaveKpi,
  onClose,
}) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [editMode, setEditMode] = useState(false);

  // Agrégation des achievements du mois pour ce user
  const [year, monthStr] = viewMonth.split("-");
  const monthNum = parseInt(monthStr, 10);
  const monthStart = new Date(
    parseInt(year, 10),
    monthNum - 1,
    1,
  ).getTime();
  const monthEnd = new Date(
    parseInt(year, 10),
    monthNum,
    0,
    23,
    59,
    59,
  ).getTime();

  const monthLabel = new Date(monthStart).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  // Compter par interaction
  const counts = {};
  const amounts = {};
  (messages || [])
    .filter(
      (m) =>
        m.type === "achievement" &&
        m.fc === currentUser.fc &&
        m.timestamp >= monthStart &&
        m.timestamp <= monthEnd,
    )
    .forEach((m) => {
      if (m.interactionType === "amount") {
        amounts[m.interactionId] =
          (amounts[m.interactionId] || 0) + (m.amount || 0);
      } else {
        // count type (les annulations ont count = -1)
        counts[m.interactionId] =
          (counts[m.interactionId] || 0) + (m.count || 0);
      }
    });

  // KPIs saisis par l'admin
  const kpiId = `${currentUser.fc}_${viewMonth}`;
  const kpis = commissionKpis[kpiId] || {};

  // Formulaire KPI (admin)
  const [formKpi, setFormKpi] = useState({
    margePct: kpis.margePct || 0,
    tauxCreditPct: kpis.tauxCreditPct || 0,
    tauxInfinityPct: kpis.tauxInfinityPct || 0,
    npsTrimestrePct: kpis.npsTrimestrePct || 0,
    canalMonthsWithoutCancel: kpis.canalMonthsWithoutCancel || 0,
  });

  useEffect(() => {
    if (editMode) return; // ne pas écraser les saisies en cours
    setFormKpi({
      margePct: kpis.margePct || 0,
      tauxCreditPct: kpis.tauxCreditPct || 0,
      tauxInfinityPct: kpis.tauxInfinityPct || 0,
      npsTrimestrePct: kpis.npsTrimestrePct || 0,
      canalMonthsWithoutCancel: kpis.canalMonthsWithoutCancel || 0,
    });
    // eslint-disable-next-line
  }, [kpiId, JSON.stringify(kpis), editMode]);

  // Calcul commission
  const commission = computeCommission({
    counts,
    amounts,
    kpis,
    canalMonthsWithoutCancel: kpis.canalMonthsWithoutCancel || 0,
  });

  // Lignes groupées par catégorie
  const linesByCategory = {};
  commission.lines.forEach((l) => {
    if (!linesByCategory[l.category]) linesByCategory[l.category] = [];
    linesByCategory[l.category].push(l);
  });

  const handleSaveKpi = async () => {
    await onSaveKpi(currentUser.fc, viewMonth, formKpi);
    setEditMode(false);
  };

  // Navigation mois
  const changeMonth = (delta) => {
    const [y, m] = viewMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setViewMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)" }}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Euro size={22} />
            <div>
              <h2 className="font-bold text-lg">Commissions & primes</h2>
              <p className="text-xs text-white/80">{currentUser.prenom}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Navigation mois */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 hover:bg-slate-200 rounded-lg"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-sm font-bold text-slate-800 capitalize">
            {monthLabel}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 hover:bg-slate-200 rounded-lg"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto overscroll-contain">
          {/* Carte principale */}
          <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-700 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-black/10 rounded-full" />
            <div className="relative z-10">
              <div className="text-[11px] uppercase tracking-wider font-bold opacity-80">
                Commission estimée
              </div>
              <div className="text-4xl font-black mt-1">
                {commission.total.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                €
              </div>
              <div className="text-xs opacity-90 mt-1">
                {commission.lines.filter((l) => !l.locked).length} ligne
                {commission.lines.filter((l) => !l.locked).length > 1
                  ? "s"
                  : ""}{" "}
                acquises
                {commission.lines.some((l) => l.locked) &&
                  ` · ${commission.lines.filter((l) => l.locked).length} bloquées`}
              </div>
            </div>
          </div>

          {/* KPIs du mois */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Indicateurs du mois
              </div>
              {isAdmin &&
                (editMode ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditMode(false)}
                      className="text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveKpi}
                      className="text-xs px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold"
                    >
                      Enregistrer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-xs px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded font-semibold flex items-center gap-1"
                  >
                    <Edit2 size={11} />
                    Modifier
                  </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KpiRow
                label="Marge individuelle"
                value={formKpi.margePct}
                unit="%"
                editable={editMode}
                onChange={(v) => setFormKpi({ ...formKpi, margePct: v })}
                target={25}
              />
              <KpiRow
                label="Taux crédit"
                value={formKpi.tauxCreditPct}
                unit="%"
                editable={editMode}
                onChange={(v) =>
                  setFormKpi({ ...formKpi, tauxCreditPct: v })
                }
                target={9}
              />
              <KpiRow
                label="Taux Infinity"
                value={formKpi.tauxInfinityPct}
                unit="%"
                editable={editMode}
                onChange={(v) =>
                  setFormKpi({ ...formKpi, tauxInfinityPct: v })
                }
                target={8}
              />
              <KpiRow
                label="NPS trimestre"
                value={formKpi.npsTrimestrePct}
                unit="%"
                editable={editMode}
                onChange={(v) =>
                  setFormKpi({ ...formKpi, npsTrimestrePct: v })
                }
                target={72}
              />
              <KpiRow
                label="Canal+ 3 mois sans annul."
                value={formKpi.canalMonthsWithoutCancel}
                unit=""
                editable={editMode}
                onChange={(v) =>
                  setFormKpi({ ...formKpi, canalMonthsWithoutCancel: v })
                }
              />
            </div>
            {!isAdmin && Object.keys(kpis).length === 0 && (
              <p className="text-[11px] text-amber-700 mt-2 italic">
                Les indicateurs seront renseignés par l'admin en fin de mois.
              </p>
            )}
          </div>

          {/* Volumes du mois */}
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Volumes réalisés ce mois
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <VolumeRow emoji="1️⃣" label="Infinity Uno" count={counts.infinity_uno || 0} />
              <VolumeRow emoji="2️⃣" label="Infinity Duo" count={counts.infinity_duo || 0} />
              <VolumeRow emoji="3️⃣" label="Infinity Trio" count={counts.infinity_trio || 0} />
              <VolumeRow emoji="📱" label="Smartphone Solo" count={counts.infinity_solo || 0} />
              <VolumeRow emoji="👪" label="Smartphone Famille" count={counts.infinity_famille || 0} />
              <VolumeRow emoji="⭐" label="Club+" count={counts.clubplus || 0} />
              <VolumeRow emoji="💳" label="Crédits" count={counts.oney || 0} />
              <VolumeRow emoji="📺" label="Canal+" count={counts.canalplus || 0} />
              <VolumeRow
                emoji="🛡️"
                label="PO (€ HT)"
                count={(amounts.po || 0).toFixed(0) + " €"}
              />
              <VolumeRow
                emoji="✅"
                label="Garantie (€ HT)"
                count={(amounts.garantie || 0).toFixed(0) + " €"}
              />
            </div>
          </div>

          {/* Détail commission par catégorie */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Détail par catégorie
            </div>
            {commission.lines.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-sm text-slate-400">
                Aucune commission ce mois.
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(linesByCategory).map(([cat, ls]) => {
                  const catTotal = ls.reduce((s, l) => s + l.amount, 0);
                  return (
                    <div
                      key={cat}
                      className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                        <span className="font-bold text-sm text-slate-800">
                          {cat}
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          {catTotal.toFixed(2)} €
                        </span>
                      </div>
                      {ls.map((l, i) => (
                        <div
                          key={i}
                          className={`px-3 py-2 border-t border-slate-100 flex items-start justify-between gap-2 text-xs ${l.locked ? "opacity-60 bg-slate-50" : ""}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-semibold ${l.locked ? "text-slate-500" : "text-slate-800"}`}
                            >
                              {l.locked && "🔒 "}
                              {l.label}
                              {l.trimestriel && (
                                <span className="ml-1.5 text-[9px] font-bold px-1 py-0.5 rounded bg-purple-100 text-purple-700">
                                  TRIMESTRIEL
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {l.detail}
                            </div>
                          </div>
                          <span
                            className={`font-mono font-bold shrink-0 ${l.locked ? "text-slate-400" : "text-emerald-700"}`}
                          >
                            {l.amount.toFixed(2)} €
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rappel règles */}
          <details className="bg-slate-50 border border-slate-200 rounded-lg">
            <summary className="px-3 py-2 cursor-pointer text-xs font-bold text-slate-700">
              📖 Règles de calcul
            </summary>
            <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-1 leading-relaxed">
              <p>
                <strong>PO :</strong> 5% du CA HT, 10% si marge ≥ 25%
              </p>
              <p>
                <strong>Infinity :</strong> Uno 7€ / Duo 10€ / Trio 15€. Bonus
                +100€ à 10 ventes, +100€ à 15 ventes.
              </p>
              <p>
                <strong>Infinity Smartphone :</strong> Solo 7€ / Famille 15€.
                Bonus +100€ à 10 ventes, +100€ à 15 ventes.
              </p>
              <p>
                <strong>B+ / Crédit :</strong> 7€ par crédit uniquement si
                taux crédit ≥ 9%.
              </p>
              <p>
                <strong>Club+ :</strong> 2,50€ par Club+ uniquement si volume
                ≥ 20.
              </p>
              <p>
                <strong>Garantie :</strong> 5% du montant si montant ≥ 500€.
              </p>
              <p>
                <strong>Canal+ :</strong> 4€ par vente + 10€ au 3e mois sans
                annulation.
              </p>
              <p>
                <strong>NPS :</strong> 120€ au trimestre si NPS glissant ≥
                72%.
              </p>
              <p>
                <strong>Taux Infinity :</strong> 180€ au trimestre si taux ≥
                8%.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function KpiRow({ label, value, unit, editable, onChange, target }) {
  const reached = target && value >= target;
  return (
    <div className="bg-white border border-slate-200 rounded p-1.5">
      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
        {label}
      </div>
      {editable ? (
        <input
          type="number"
          value={value}
          step="0.1"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-sm font-mono font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
        />
      ) : (
        <div className="font-mono font-bold text-sm flex items-center gap-1">
          <span className={target && reached ? "text-emerald-700" : "text-slate-800"}>
            {value || 0}
            {unit}
          </span>
          {target && reached && <Check size={12} className="text-emerald-600" />}
          {target && !reached && value > 0 && (
            <span className="text-[9px] text-slate-400">/{target}{unit}</span>
          )}
        </div>
      )}
    </div>
  );
}

function VolumeRow({ emoji, label, count }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded">
      <span className="text-slate-700 truncate">
        {emoji} {label}
      </span>
      <span className="font-mono font-bold text-slate-900 shrink-0">
        {count}
      </span>
    </div>
  );
}

// ========================================================================
// NPS & GOOGLE PANEL — Suivi satisfaction client & avis Google
// ========================================================================
function NpsGooglePanel({ shopKpis, isAdmin, onSaveKpi, onClose }) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [editMode, setEditMode] = useState(false);

  const monthLabel = new Date(
    parseInt(viewMonth.split("-")[0]),
    parseInt(viewMonth.split("-")[1]) - 1,
    1,
  ).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const currentKpi = shopKpis[viewMonth] || {};

  const [form, setForm] = useState({
    npsScore: currentKpi.npsScore || 0,
    npsCount: currentKpi.npsCount || 0,
    npsPromoters: currentKpi.npsPromoters || 0,
    npsPassives: currentKpi.npsPassives || 0,
    npsDetractors: currentKpi.npsDetractors || 0,
    googleRating: currentKpi.googleRating || 0,
    googleCount: currentKpi.googleCount || 0,
    googleNewReviews: currentKpi.googleNewReviews || 0,
    googleFive: currentKpi.googleFive || 0,
    googleFour: currentKpi.googleFour || 0,
    googleThree: currentKpi.googleThree || 0,
    googleTwo: currentKpi.googleTwo || 0,
    googleOne: currentKpi.googleOne || 0,
  });

  useEffect(() => {
    // Ne réinitialiser le formulaire que si on n'est PAS en mode édition
    // sinon le polling efface les saisies de l'admin en cours
    if (editMode) return;
    setForm({
      npsScore: currentKpi.npsScore || 0,
      npsCount: currentKpi.npsCount || 0,
      npsPromoters: currentKpi.npsPromoters || 0,
      npsPassives: currentKpi.npsPassives || 0,
      npsDetractors: currentKpi.npsDetractors || 0,
      googleRating: currentKpi.googleRating || 0,
      googleCount: currentKpi.googleCount || 0,
      googleNewReviews: currentKpi.googleNewReviews || 0,
      googleFive: currentKpi.googleFive || 0,
      googleFour: currentKpi.googleFour || 0,
      googleThree: currentKpi.googleThree || 0,
      googleTwo: currentKpi.googleTwo || 0,
      googleOne: currentKpi.googleOne || 0,
    });
    // eslint-disable-next-line
  }, [viewMonth, JSON.stringify(currentKpi), editMode]);

  // Historique 6 derniers mois
  const trend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      parseInt(viewMonth.split("-")[0]),
      parseInt(viewMonth.split("-")[1]) - 1 - i,
      1,
    );
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const k = shopKpis[key] || {};
    trend.push({
      key,
      label: d.toLocaleDateString("fr-FR", { month: "short" }),
      nps: k.npsScore || 0,
      google: k.googleRating || 0,
    });
  }

  // NPS glissant trimestre (3 derniers mois)
  const quarter = trend.slice(-3).filter((t) => t.nps > 0);
  const npsQuarterAvg =
    quarter.length > 0
      ? quarter.reduce((s, t) => s + t.nps, 0) / quarter.length
      : 0;
  const npsQuarterReached = npsQuarterAvg >= 72;

  // Auto-calc NPS à partir des promoteurs/détracteurs si saisis
  const autoNps =
    form.npsCount > 0
      ? Math.round(
          ((form.npsPromoters - form.npsDetractors) / form.npsCount) * 100,
        )
      : 0;

  const changeMonth = (delta) => {
    const [y, m] = viewMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setViewMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const handleSave = async () => {
    // Si promoteurs/détracteurs renseignés, prend la moyenne calculée
    const finalForm = { ...form };
    if (form.npsCount > 0 && (form.npsPromoters || form.npsDetractors)) {
      finalForm.npsScore = autoNps;
    }
    await onSaveKpi(viewMonth, finalForm);
    setEditMode(false);
  };

  // Scores colorés
  const npsColor =
    form.npsScore >= 72
      ? "text-emerald-600"
      : form.npsScore >= 50
        ? "text-amber-600"
        : form.npsScore >= 0
          ? "text-orange-600"
          : "text-red-600";
  const googleColor =
    form.googleRating >= 4.5
      ? "text-emerald-600"
      : form.googleRating >= 4
        ? "text-amber-600"
        : form.googleRating >= 3
          ? "text-orange-600"
          : "text-red-600";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={22} />
            <div>
              <h2 className="font-bold text-lg">NPS & Avis Google</h2>
              <p className="text-xs text-white/80">
                Satisfaction client boutique
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Nav mois */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 hover:bg-slate-200 rounded-lg"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-sm font-bold text-slate-800 capitalize">
            {monthLabel}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 hover:bg-slate-200 rounded-lg"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* === NPS === */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold opacity-80">
                    NPS du mois
                  </div>
                  <div className="text-5xl font-black leading-none mt-1">
                    {form.npsScore || 0}
                    <span className="text-lg opacity-70">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold">
                    Objectif
                  </div>
                  <div className="text-2xl font-black">72+</div>
                  {form.npsScore >= 72 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full mt-1">
                      <Check size={10} /> Atteint
                    </span>
                  )}
                </div>
              </div>
              {/* Jauge NPS */}
              <div className="h-2 bg-white/25 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(0, form.npsScore || 0))}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] opacity-80 mt-1">
                <span>0</span>
                <span>50</span>
                <span>72</span>
                <span>100</span>
              </div>
              {form.npsCount > 0 && (
                <div className="text-xs opacity-90 mt-2">
                  {form.npsCount} réponses
                  {form.npsPromoters > 0 &&
                    ` · ${form.npsPromoters} promoteurs · ${form.npsDetractors} détracteurs`}
                </div>
              )}
            </div>
          </div>

          {/* NPS glissant trimestre */}
          <div
            className={`rounded-xl p-3 border-2 ${
              npsQuarterReached
                ? "bg-emerald-50 border-emerald-300"
                : "bg-amber-50 border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wide font-bold text-slate-500">
                  NPS glissant — 3 derniers mois
                </div>
                <div
                  className={`text-2xl font-black ${npsQuarterReached ? "text-emerald-700" : "text-amber-700"}`}
                >
                  {npsQuarterAvg.toFixed(1)}
                </div>
              </div>
              <div className="text-right">
                {npsQuarterReached ? (
                  <div className="text-sm font-bold text-emerald-700">
                    ✓ Prime trimestre 120 €
                  </div>
                ) : (
                  <div className="text-sm font-bold text-amber-700">
                    Objectif ≥ 72
                  </div>
                )}
                <div className="text-[10px] text-slate-500">
                  Commission NPS trimestrielle
                </div>
              </div>
            </div>
          </div>

          {/* === GOOGLE === */}
          <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 text-white rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold opacity-80 flex items-center gap-1">
                    <span className="text-sm">G</span> Note Google
                  </div>
                  <div className="text-5xl font-black leading-none mt-1 flex items-baseline gap-1">
                    {(form.googleRating || 0).toFixed(1)}
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold">
                    Avis
                  </div>
                  <div className="text-2xl font-black">
                    {form.googleCount || 0}
                  </div>
                  {form.googleNewReviews > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full mt-1">
                      +{form.googleNewReviews} ce mois
                    </span>
                  )}
                </div>
              </div>
              {/* Étoiles */}
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = n <= Math.round(form.googleRating || 0);
                  const half =
                    n > (form.googleRating || 0) &&
                    n - 0.5 <= (form.googleRating || 0);
                  return (
                    <Star
                      key={n}
                      size={22}
                      className={`${filled ? "fill-white text-white" : half ? "fill-white/50 text-white" : "text-white/40"}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Distribution des étoiles Google */}
          {(form.googleFive > 0 ||
            form.googleFour > 0 ||
            form.googleThree > 0 ||
            form.googleTwo > 0 ||
            form.googleOne > 0) && (
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                Distribution des avis
              </div>
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  form[
                    star === 5
                      ? "googleFive"
                      : star === 4
                        ? "googleFour"
                        : star === 3
                          ? "googleThree"
                          : star === 2
                            ? "googleTwo"
                            : "googleOne"
                  ] || 0;
                const total =
                  (form.googleFive || 0) +
                  (form.googleFour || 0) +
                  (form.googleThree || 0) +
                  (form.googleTwo || 0) +
                  (form.googleOne || 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                const color =
                  star >= 4
                    ? "bg-emerald-500"
                    : star === 3
                      ? "bg-amber-500"
                      : "bg-red-500";
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono w-6 text-slate-700">
                      {star}★
                    </span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tendance 6 mois */}
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Tendance 6 derniers mois
            </div>
            <div className="grid grid-cols-6 gap-1">
              {trend.map((t) => (
                <div key={t.key} className="text-center">
                  <div className="text-[10px] text-slate-500 capitalize mb-1">
                    {t.label}
                  </div>
                  {/* NPS bar */}
                  <div className="h-10 flex items-end justify-center bg-slate-50 rounded">
                    <div
                      className="w-3/4 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t transition-all"
                      style={{
                        height: `${Math.max(3, t.nps)}%`,
                      }}
                      title={`NPS ${t.nps}`}
                    />
                  </div>
                  <div className="text-[9px] font-mono text-blue-600 font-bold">
                    {t.nps || "—"}
                  </div>
                  <div className="text-[9px] font-mono text-amber-600">
                    {t.google > 0 ? `${t.google.toFixed(1)}★` : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Édition admin */}
          {isAdmin && (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Saisie des indicateurs
                </div>
                {editMode ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditMode(false)}
                      className="text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-xs px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold"
                    >
                      Enregistrer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded font-semibold flex items-center gap-1"
                  >
                    <Edit2 size={11} />
                    Modifier
                  </button>
                )}
              </div>

              {editMode && (
                <div className="space-y-3">
                  {/* NPS */}
                  <div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase mb-1">
                      NPS
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <EditField
                        label="Score"
                        value={form.npsScore}
                        onChange={(v) => setForm({ ...form, npsScore: v })}
                        placeholder={autoNps || "—"}
                      />
                      <EditField
                        label="Réponses"
                        value={form.npsCount}
                        onChange={(v) => setForm({ ...form, npsCount: v })}
                      />
                      <EditField
                        label="Promoteurs"
                        value={form.npsPromoters}
                        onChange={(v) =>
                          setForm({ ...form, npsPromoters: v })
                        }
                      />
                      <EditField
                        label="Détracteurs"
                        value={form.npsDetractors}
                        onChange={(v) =>
                          setForm({ ...form, npsDetractors: v })
                        }
                      />
                    </div>
                    {form.npsCount > 0 &&
                      (form.npsPromoters || form.npsDetractors) && (
                        <div className="text-[10px] text-slate-500 mt-1 italic">
                          Calcul auto : {autoNps}
                        </div>
                      )}
                  </div>

                  {/* Google */}
                  <div>
                    <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">
                      Avis Google
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <EditField
                        label="Note moy."
                        value={form.googleRating}
                        step={0.1}
                        onChange={(v) =>
                          setForm({ ...form, googleRating: v })
                        }
                      />
                      <EditField
                        label="Total avis"
                        value={form.googleCount}
                        onChange={(v) => setForm({ ...form, googleCount: v })}
                      />
                      <EditField
                        label="Nouveaux"
                        value={form.googleNewReviews}
                        onChange={(v) =>
                          setForm({ ...form, googleNewReviews: v })
                        }
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 mb-1">
                      Distribution (facultatif)
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      <EditField
                        label="5★"
                        value={form.googleFive}
                        onChange={(v) => setForm({ ...form, googleFive: v })}
                      />
                      <EditField
                        label="4★"
                        value={form.googleFour}
                        onChange={(v) => setForm({ ...form, googleFour: v })}
                      />
                      <EditField
                        label="3★"
                        value={form.googleThree}
                        onChange={(v) => setForm({ ...form, googleThree: v })}
                      />
                      <EditField
                        label="2★"
                        value={form.googleTwo}
                        onChange={(v) => setForm({ ...form, googleTwo: v })}
                      />
                      <EditField
                        label="1★"
                        value={form.googleOne}
                        onChange={(v) => setForm({ ...form, googleOne: v })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-900 flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <strong>NPS</strong> (Net Promoter Score) : pourcentage de
              clients promoteurs moins détracteurs. Plus il est haut, mieux
              c'est. Objectif <strong>72+</strong> pour déclencher la prime
              trimestrielle.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, step = 1, placeholder }) {
  return (
    <div>
      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </div>
      <input
        type="number"
        step={step}
        value={value || ""}
        placeholder={placeholder || "0"}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full border border-slate-300 rounded px-1.5 py-1 text-sm font-mono font-bold focus:ring-1 focus:ring-amber-500 outline-none"
      />
    </div>
  );
}

// ========================================================================
// HR PANEL — Bloc Ressources Humaines complet
// ========================================================================
// Croise les données du planning F890 + l'app principale :
// - Salariés (planning), missions, ventes, congés, NPS, commissions, points
// ========================================================================
function HrPanel({
  hrData,
  hrLoading,
  onRefresh,
  messages,
  missions,
  penalties,
  vacationRequests,
  commissionKpis,
  shopKpis,
  pointsByUser,
  onClose,
}) {
  const [tab, setTab] = useState("dashboard");
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  // Si pas encore demandé, on déclenche au montage
  useEffect(() => {
    if (!hrData && !hrLoading) onRefresh();
    // eslint-disable-next-line
  }, []);

  const employees = hrData?.employees || [];
  const absences = hrData?.absences || [];
  const weekHours = hrData?.weekHours || {};

  // === Calculs agrégés ===
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const monthEnd = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).getTime();

  // Salariés actuellement en congés/maladie/formation (date du jour entre start et end)
  const onLeaveToday = absences.filter(
    (a) => a.start <= todayStr && a.end >= todayStr,
  );

  // Demandes de congés en attente
  const pendingRequests = (vacationRequests || []).filter(
    (r) => r.status === "pending",
  );

  // Stats par employé (regroupées par fcId pour matcher messages/missions/etc.)
  const empStats = employees.map((emp) => {
    const fc = (emp.fcId || "").toUpperCase();
    // Ventes du mois
    const monthMessages = messages.filter(
      (m) =>
        m.type === "achievement" &&
        m.fc === fc &&
        m.timestamp >= monthStart &&
        m.timestamp <= monthEnd,
    );
    const salesCount = monthMessages.filter(
      (m) => m.interactionType !== "amount" && (m.count || 0) > 0,
    ).length;
    const salesAmount = monthMessages
      .filter((m) => m.interactionType === "amount")
      .reduce((s, m) => s + (m.amount || 0), 0);
    // Annulations du mois
    const cancellations = monthMessages.filter(
      (m) => m.isCancellation || (m.amount || 0) < 0,
    ).length;
    // Missions
    const validatedMissions = missions.filter(
      (m) =>
        m.status === "validated" &&
        m.claimedBy === fc &&
        m.validatedAt >= monthStart,
    ).length;
    const failedMissions = missions.filter(
      (m) => m.status === "failed" && m.claimedBy === fc,
    ).length;
    // Pénalités du mois
    const monthPenalties = penalties
      .filter((p) => p.fc === fc && p.timestamp >= monthStart)
      .reduce((s, p) => s + (p.amount || 0), 0);
    // Absences en cours
    const isOnLeave = absences.some(
      (a) => a.empId === emp.id && a.start <= todayStr && a.end >= todayStr,
    );
    // Absences cumulées sur l'année (par type)
    const yearStart = new Date(today.getFullYear(), 0, 1)
      .toISOString()
      .slice(0, 10);
    const yearAbs = absences.filter(
      (a) => a.empId === emp.id && a.end >= yearStart,
    );
    const absDays = (a) => {
      const d1 = new Date(a.start);
      const d2 = new Date(a.end);
      return Math.max(1, Math.floor((d2 - d1) / 86400000) + 1);
    };
    const cpDays = yearAbs
      .filter((a) => a.type === "Vacances")
      .reduce((s, a) => s + absDays(a), 0);
    const rttDays = yearAbs
      .filter((a) => a.type === "RTT")
      .reduce((s, a) => s + absDays(a), 0);
    const sickDays = yearAbs
      .filter((a) => a.type === "Maladie")
      .reduce((s, a) => s + absDays(a), 0);
    const formationDays = yearAbs
      .filter((a) => a.type === "Formation")
      .reduce((s, a) => s + absDays(a), 0);
    // Points / grade
    const points = pointsByUser[fc] || 0;
    const gradeProgress = computeGradeProgress(points);
    // Heures cette semaine
    const wkH = weekHours[emp.id] || 0;
    const contractH = emp.contractHours || 35;
    const hoursDiff = wkH - contractH;
    return {
      ...emp,
      fc,
      isOnLeave,
      salesCount,
      salesAmount,
      cancellations,
      validatedMissions,
      failedMissions,
      monthPenalties,
      cpDays,
      rttDays,
      sickDays,
      formationDays,
      totalAbsDays: cpDays + rttDays + sickDays + formationDays,
      points,
      grade: gradeProgress.current,
      wkHours: wkH,
      hoursDiff,
    };
  });

  // Tri pour le tableau
  const [sortBy, setSortBy] = useState("name");
  const sortedStats = [...empStats].sort((a, b) => {
    if (sortBy === "name") return a.firstName.localeCompare(b.firstName);
    if (sortBy === "sales") return b.salesCount - a.salesCount;
    if (sortBy === "ca") return b.salesAmount - a.salesAmount;
    if (sortBy === "missions") return b.validatedMissions - a.validatedMissions;
    if (sortBy === "absences") return b.totalAbsDays - a.totalAbsDays;
    if (sortBy === "points") return b.points - a.points;
    return 0;
  });

  // Détail employé sélectionné
  const selected = empStats.find((e) => e.id === selectedEmpId);

  // KPIs globaux
  const totalEmps = employees.length;
  const onLeaveCount = empStats.filter((e) => e.isOnLeave).length;
  const totalCpYear = empStats.reduce((s, e) => s + e.cpDays, 0);
  const totalSickYear = empStats.reduce((s, e) => s + e.sickDays, 0);
  const totalSalesMonth = empStats.reduce((s, e) => s + e.salesCount, 0);
  const totalCaMonth = empStats.reduce((s, e) => s + e.salesAmount, 0);

  // Mois actuel pour shopKpis
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const currentNps = shopKpis?.[monthKey]?.npsScore || 0;
  const currentGoogle = shopKpis?.[monthKey]?.googleRating || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Briefcase size={22} />
            <div className="min-w-0">
              <h2 className="font-bold text-lg leading-tight">
                Ressources Humaines
              </h2>
              <p className="text-[11px] text-white/80 truncate">
                Vue d'ensemble équipe — F890 Flers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-white/20 rounded-lg"
              title="Actualiser depuis le planning"
              disabled={hrLoading}
            >
              <Sparkles size={16} className={hrLoading ? "animate-spin" : ""} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-2 py-1.5 flex gap-1 shrink-0 overflow-x-auto">
          {[
            { id: "dashboard", label: "Tableau de bord", icon: BarChart },
            { id: "team", label: "Équipe", icon: Users },
            { id: "absences", label: "Absences", icon: Calendar },
            { id: "alerts", label: "Alertes RH", icon: AlertCircle },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-slate-600 hover:bg-white/50"
                }`}
              >
                <Icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {hrLoading && !hrData && (
            <div className="text-center py-10 text-slate-500">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Chargement des données planning…
            </div>
          )}

          {hrData && hrData.fromLocalStorage && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <div>
                Données chargées depuis la mémoire locale. Pour des données à
                jour avec les heures de la semaine, ouvrez le module Planning au
                moins une fois.
              </div>
            </div>
          )}

          {!hrData && !hrLoading && (
            <div className="text-center py-10 text-slate-400">
              <Briefcase size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune donnée disponible.</p>
              <p className="text-xs mt-1">
                Ouvrez le module <strong>Planning</strong> au moins une fois,
                puis tapez le bouton ↻ ci-dessus.
              </p>
            </div>
          )}

          {hrData && (
            <>
              {/* ============ ONGLET DASHBOARD ============ */}
              {tab === "dashboard" && (
                <>
                  {/* KPI cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <KpiCard
                      icon={Users}
                      color="from-blue-500 to-indigo-600"
                      label="Effectif"
                      value={totalEmps}
                      sub={`${onLeaveCount} en absence`}
                    />
                    <KpiCard
                      icon={Calendar}
                      color="from-amber-500 to-orange-600"
                      label="Demandes congés"
                      value={pendingRequests.length}
                      sub="en attente"
                      highlight={pendingRequests.length > 0}
                    />
                    <KpiCard
                      icon={Award}
                      color="from-emerald-500 to-green-600"
                      label="Ventes du mois"
                      value={totalSalesMonth}
                      sub={`${Math.round(totalCaMonth)} €`}
                    />
                    <KpiCard
                      icon={Star}
                      color="from-yellow-500 to-amber-600"
                      label="NPS / Google"
                      value={`${currentNps || "—"} / ${currentGoogle ? currentGoogle.toFixed(1) : "—"}★`}
                      sub="ce mois"
                    />
                  </div>

                  {/* Synthèse absences année */}
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Cumul absences {today.getFullYear()}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <AbsStat label="Congés payés" value={totalCpYear} unit="j" color="emerald" />
                      <AbsStat
                        label="RTT"
                        value={empStats.reduce((s, e) => s + e.rttDays, 0)}
                        unit="j"
                        color="blue"
                      />
                      <AbsStat label="Maladie" value={totalSickYear} unit="j" color="red" />
                      <AbsStat
                        label="Formation"
                        value={empStats.reduce((s, e) => s + e.formationDays, 0)}
                        unit="j"
                        color="purple"
                      />
                    </div>
                  </div>

                  {/* En absence aujourd'hui */}
                  {onLeaveToday.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Calendar size={12} />
                        En absence aujourd'hui ({onLeaveToday.length})
                      </div>
                      <div className="space-y-1.5">
                        {onLeaveToday.map((a) => {
                          const emp = employees.find((e) => e.id === a.empId);
                          if (!emp) return null;
                          return (
                            <div
                              key={a.id}
                              className="flex items-center justify-between text-xs bg-white rounded-lg px-2.5 py-1.5"
                            >
                              <div className="font-semibold text-slate-800">
                                {emp.firstName}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-[10px]">
                                  jusqu'au {a.end}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                  {a.type}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Top 3 ventes */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Top 3 ventes du mois
                    </div>
                    <div className="space-y-1.5">
                      {[...empStats]
                        .sort((a, b) => b.salesCount - a.salesCount)
                        .slice(0, 3)
                        .map((e, i) => (
                          <div
                            key={e.id}
                            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-slate-400" : "bg-amber-700"}`}
                            >
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-slate-800 truncate">
                                {e.firstName}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {e.role}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-bold text-emerald-700 text-sm">
                                {e.salesCount} vente{e.salesCount > 1 ? "s" : ""}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {Math.round(e.salesAmount)} €
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {/* ============ ONGLET ÉQUIPE ============ */}
              {tab === "team" && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-500">Trier par :</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-xs border border-slate-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="name">Nom</option>
                      <option value="sales">Nb ventes</option>
                      <option value="ca">CA généré</option>
                      <option value="missions">Missions</option>
                      <option value="absences">Absences</option>
                      <option value="points">Points</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    {sortedStats.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setSelectedEmpId(e.id)}
                        className={`w-full text-left bg-white border rounded-lg p-2.5 hover:border-purple-300 transition ${
                          e.isOnLeave
                            ? "border-amber-300 bg-amber-50/40"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${e.grade.gradientFrom} ${e.grade.gradientTo} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                          >
                            {e.firstName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-sm text-slate-800 truncate">
                                {e.firstName}
                              </span>
                              {e.isOnLeave && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                                  Absent
                                </span>
                              )}
                              {e.hasAlternation && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                                  Sem. A/B
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {e.role} · {e.fcId || "—"} · {e.contractHours}h
                            </div>
                          </div>
                          <div className="text-right shrink-0 text-[10px]">
                            <div className="font-bold text-emerald-700">
                              {e.salesCount} ventes
                            </div>
                            <div className="text-slate-500">
                              {e.points.toLocaleString("fr-FR")} pts
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-400 shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* ============ ONGLET ABSENCES ============ */}
              {tab === "absences" && (
                <>
                  {pendingRequests.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-2">
                        ⏳ Demandes en attente ({pendingRequests.length})
                      </div>
                      <div className="space-y-1.5">
                        {pendingRequests.map((r) => (
                          <div
                            key={r.id}
                            className="bg-amber-50 border border-amber-200 rounded-lg p-2.5"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div>
                                <div className="font-bold text-sm text-slate-800">
                                  {r.prenom} — {r.type}
                                </div>
                                <div className="text-[11px] text-slate-600">
                                  Du {r.start} au {r.end}
                                </div>
                              </div>
                              <span className="text-[10px] text-amber-700 italic">
                                À valider via Congés
                              </span>
                            </div>
                            {r.reason && (
                              <div className="text-[11px] text-slate-600 italic mt-1">
                                {r.reason}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Toutes les absences enregistrées ({absences.length})
                    </div>
                    {absences.length === 0 ? (
                      <div className="text-center text-slate-400 py-6 text-sm">
                        Aucune absence enregistrée
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {[...absences]
                          .sort((a, b) => b.start.localeCompare(a.start))
                          .map((a) => {
                            const emp = employees.find((e) => e.id === a.empId);
                            const typeColor = {
                              Vacances: "bg-emerald-100 text-emerald-700",
                              RTT: "bg-blue-100 text-blue-700",
                              Maladie: "bg-red-100 text-red-700",
                              Formation: "bg-purple-100 text-purple-700",
                            };
                            const isPast = a.end < todayStr;
                            const isOngoing =
                              a.start <= todayStr && a.end >= todayStr;
                            return (
                              <div
                                key={a.id}
                                className={`bg-white border rounded-lg p-2.5 flex items-center gap-2 ${isOngoing ? "border-amber-300" : "border-slate-200"} ${isPast ? "opacity-60" : ""}`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-sm text-slate-800">
                                      {emp?.firstName || "—"}
                                    </span>
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeColor[a.type] || "bg-slate-100 text-slate-700"}`}
                                    >
                                      {a.type}
                                    </span>
                                    {isOngoing && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                                        EN COURS
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    Du {a.start} au {a.end}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ============ ONGLET ALERTES ============ */}
              {tab === "alerts" && (
                <HrAlerts empStats={empStats} pendingRequests={pendingRequests} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal détail employé */}
      {selected && (
        <HrEmployeeDetail
          emp={selected}
          absences={absences.filter((a) => a.empId === selected.id)}
          onClose={() => setSelectedEmpId(null)}
        />
      )}
    </div>
  );
}

function KpiCard({ icon: Icon, color, label, value, sub, highlight }) {
  return (
    <div
      className={`bg-gradient-to-br ${color} text-white rounded-xl p-2.5 shadow ${highlight ? "ring-2 ring-amber-400 animate-pulse" : ""}`}
    >
      <Icon size={14} className="opacity-80 mb-1" />
      <div className="text-2xl font-black leading-tight">{value}</div>
      <div className="text-[10px] opacity-90 font-semibold uppercase tracking-wide">
        {label}
      </div>
      {sub && <div className="text-[9px] opacity-80 mt-0.5">{sub}</div>}
    </div>
  );
}

function AbsStat({ label, value, unit, color }) {
  const colors = {
    emerald: "text-emerald-700 bg-emerald-50",
    blue: "text-blue-700 bg-blue-50",
    red: "text-red-700 bg-red-50",
    purple: "text-purple-700 bg-purple-50",
  };
  return (
    <div className={`rounded-lg p-2 ${colors[color]}`}>
      <div className="text-2xl font-black">
        {value}
        <span className="text-xs">{unit}</span>
      </div>
      <div className="text-[10px] font-semibold uppercase">{label}</div>
    </div>
  );
}

function HrAlerts({ empStats, pendingRequests }) {
  const alerts = [];

  // Alertes basées sur les données
  if (pendingRequests.length > 0) {
    alerts.push({
      type: "warning",
      icon: "📋",
      title: `${pendingRequests.length} demande${pendingRequests.length > 1 ? "s" : ""} de congé en attente`,
      detail: "À valider rapidement via le module Congés",
    });
  }

  empStats.forEach((e) => {
    if (e.sickDays >= 10) {
      alerts.push({
        type: "danger",
        icon: "🏥",
        title: `${e.firstName} : ${e.sickDays} jours de maladie cumulés cette année`,
        detail: "Vigilance — éventuel entretien de retour",
      });
    }
    if (e.cpDays >= 25) {
      alerts.push({
        type: "info",
        icon: "🏖️",
        title: `${e.firstName} : ${e.cpDays} CP utilisés cette année`,
        detail: "Solde à vérifier",
      });
    }
    if (e.failedMissions >= 2) {
      alerts.push({
        type: "warning",
        icon: "⚠️",
        title: `${e.firstName} : ${e.failedMissions} mission${e.failedMissions > 1 ? "s" : ""} en échec`,
        detail: "Possible besoin d'accompagnement",
      });
    }
    if (e.cancellations >= 5) {
      alerts.push({
        type: "warning",
        icon: "↩️",
        title: `${e.firstName} : ${e.cancellations} annulations ce mois`,
        detail: "Examiner les causes (qualité conseil)",
      });
    }
    if (Math.abs(e.hoursDiff) > 5 && e.wkHours > 0) {
      alerts.push({
        type: e.hoursDiff > 0 ? "info" : "warning",
        icon: "⏱️",
        title: `${e.firstName} : ${e.hoursDiff > 0 ? "+" : ""}${e.hoursDiff.toFixed(1)}h cette semaine`,
        detail:
          e.hoursDiff > 0
            ? "Heures supplémentaires (à compenser ou payer)"
            : "Sous le contrat hebdomadaire",
      });
    }
  });

  if (alerts.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-2">✅</div>
        <p className="text-sm text-slate-600 font-semibold">
          Aucune alerte RH détectée
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Tous les indicateurs sont au vert
        </p>
      </div>
    );
  }

  const colorMap = {
    danger: "bg-red-50 border-red-300 text-red-900",
    warning: "bg-amber-50 border-amber-300 text-amber-900",
    info: "bg-blue-50 border-blue-300 text-blue-900",
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
        {alerts.length} point{alerts.length > 1 ? "s" : ""} de vigilance
      </div>
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`border-l-4 rounded-lg p-2.5 flex items-start gap-2.5 ${colorMap[a.type]}`}
        >
          <span className="text-lg shrink-0">{a.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">{a.title}</div>
            <div className="text-[11px] opacity-80 mt-0.5">{a.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HrEmployeeDetail({ emp, absences, onClose }) {
  const restDayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`bg-gradient-to-r ${emp.grade.gradientFrom} ${emp.grade.gradientTo} text-white px-4 py-3`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-lg">{emp.firstName}</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={18} />
            </button>
          </div>
          <div className="text-xs opacity-90 flex items-center gap-2 flex-wrap">
            <span>{emp.role}</span>
            <span>·</span>
            <span className="font-mono">{emp.fcId || "—"}</span>
            <span>·</span>
            <span>{emp.contractHours}h/sem</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
            {emp.grade.emoji} {emp.grade.label}
          </div>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {/* Performance mois */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Performance ce mois
            </div>
            <div className="grid grid-cols-2 gap-2">
              <DetailRow label="Ventes réalisées" value={emp.salesCount} />
              <DetailRow
                label="CA généré"
                value={`${Math.round(emp.salesAmount)} €`}
              />
              <DetailRow
                label="Annulations"
                value={emp.cancellations}
                tone={emp.cancellations >= 3 ? "warning" : "neutral"}
              />
              <DetailRow label="Missions ✓" value={emp.validatedMissions} />
              <DetailRow
                label="Missions échouées"
                value={emp.failedMissions}
                tone={emp.failedMissions >= 1 ? "danger" : "neutral"}
              />
              <DetailRow
                label="Pénalités (pts)"
                value={`-${emp.monthPenalties}`}
                tone={emp.monthPenalties > 0 ? "danger" : "neutral"}
              />
            </div>
          </div>

          {/* Temps de travail */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Cette semaine
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-slate-800">
                  {emp.wkHours}h{" "}
                  <span className="text-sm text-slate-500 font-normal">
                    / {emp.contractHours}h
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Repos : {(emp.restDays || []).map((d) => restDayLabels[d]).join(", ") || "—"}
                </div>
              </div>
              {emp.wkHours > 0 && (
                <div
                  className={`text-sm font-bold ${emp.hoursDiff > 0 ? "text-emerald-600" : emp.hoursDiff < 0 ? "text-amber-600" : "text-slate-600"}`}
                >
                  {emp.hoursDiff > 0 ? "+" : ""}
                  {emp.hoursDiff.toFixed(1)}h
                </div>
              )}
            </div>
          </div>

          {/* Absences année */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Cumul absences {new Date().getFullYear()}
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-emerald-50 rounded p-1.5">
                <div className="text-base font-black text-emerald-700">{emp.cpDays}</div>
                <div className="text-[9px] text-emerald-700 uppercase font-semibold">CP</div>
              </div>
              <div className="bg-blue-50 rounded p-1.5">
                <div className="text-base font-black text-blue-700">{emp.rttDays}</div>
                <div className="text-[9px] text-blue-700 uppercase font-semibold">RTT</div>
              </div>
              <div className="bg-red-50 rounded p-1.5">
                <div className="text-base font-black text-red-700">{emp.sickDays}</div>
                <div className="text-[9px] text-red-700 uppercase font-semibold">Maladie</div>
              </div>
              <div className="bg-purple-50 rounded p-1.5">
                <div className="text-base font-black text-purple-700">{emp.formationDays}</div>
                <div className="text-[9px] text-purple-700 uppercase font-semibold">Formation</div>
              </div>
            </div>
          </div>

          {/* Liste absences */}
          {absences.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Historique absences ({absences.length})
              </div>
              <div className="space-y-1 text-xs">
                {absences
                  .sort((a, b) => b.start.localeCompare(a.start))
                  .slice(0, 6)
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between bg-slate-50 rounded px-2 py-1"
                    >
                      <span className="text-slate-700">
                        {a.start} → {a.end}
                      </span>
                      <span className="font-semibold text-slate-600">
                        {a.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, tone = "neutral" }) {
  const toneCls = {
    neutral: "text-slate-800",
    warning: "text-amber-700",
    danger: "text-red-700",
  };
  return (
    <div className="bg-white border border-slate-200 rounded p-1.5">
      <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">
        {label}
      </div>
      <div className={`font-bold text-base ${toneCls[tone]}`}>{value}</div>
    </div>
  );
}

// ========================================================================
// VACATION REQUESTS PANEL — Gestion admin des demandes de congés
// ========================================================================
function VacationRequestsPanel({
  requests,
  isAdmin,
  currentFc,
  onReview,
  onDelete,
  onClose,
}) {
  const [filter, setFilter] = useState("pending");
  const [noteEdit, setNoteEdit] = useState({});

  // Admin voit toutes les demandes, salarié voit les siennes
  const visible = isAdmin
    ? requests
    : requests.filter((r) => r.fc === currentFc);

  const pending = visible.filter((r) => r.status === "pending");
  const approved = visible.filter((r) => r.status === "approved");
  const rejected = visible.filter((r) => r.status === "rejected");

  let filtered;
  if (filter === "pending") filtered = pending;
  else if (filter === "approved") filtered = approved;
  else filtered = rejected;

  filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <div>
              <h2 className="font-bold text-lg">Demandes de congés</h2>
              <p className="text-xs text-white/80">
                {isAdmin
                  ? "Validation des demandes de l'équipe"
                  : "Mes demandes"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Résumé */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xl font-black text-amber-600">
              {pending.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              En attente
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-emerald-600">
              {approved.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              Validées
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-red-600">
              {rejected.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              Refusées
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "pending"
                ? "border-amber-600 text-amber-700 bg-amber-50"
                : "border-transparent text-slate-600"
            }`}
          >
            En attente
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "pending" ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {pending.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "approved"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Validées
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "approved" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {approved.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "rejected"
                ? "border-red-600 text-red-700 bg-red-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Refusées
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "rejected" ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {rejected.length}
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Calendar size={32} className="mx-auto mb-2 opacity-40" />
              Aucune demande dans cette catégorie.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((r) => {
                const days =
                  Math.floor(
                    (new Date(r.end) - new Date(r.start)) /
                      (1000 * 60 * 60 * 24),
                  ) + 1;
                const wrapCls = {
                  pending:
                    "bg-amber-50 border-amber-300 animate-pulse-slow",
                  approved: "bg-emerald-50 border-emerald-300",
                  rejected: "bg-red-50 border-red-300",
                }[r.status];

                return (
                  <div
                    key={r._key || r.id}
                    className={`rounded-xl p-3 border-2 ${wrapCls}`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="font-bold text-slate-800 text-sm">
                            {r.prenom}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            ({r.fc})
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-700 text-white">
                            {r.type}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700">
                            {days} jour{days > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="text-sm text-slate-800 font-semibold">
                          Du {formatDateShort(r.start)} au{" "}
                          {formatDateShort(r.end)}
                        </div>
                        {r.reason && (
                          <div className="text-xs text-slate-600 italic mt-1">
                            Motif : {r.reason}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1">
                          Demandé le{" "}
                          {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                        {r.reviewedByPrenom && (
                          <div className="text-[11px] text-slate-700 mt-1">
                            {r.status === "approved" ? "✓ Validé" : "✗ Refusé"}{" "}
                            par <strong>{r.reviewedByPrenom}</strong> le{" "}
                            {new Date(r.reviewedAt).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                        {r.adminNote && (
                          <div className="text-xs text-slate-700 mt-1 bg-white/60 p-1.5 rounded border border-slate-200">
                            💬 {r.adminNote}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {isAdmin && r.status === "pending" && (
                      <div className="space-y-2 pt-2 border-t border-amber-200">
                        <input
                          type="text"
                          value={noteEdit[r.id] || ""}
                          onChange={(e) =>
                            setNoteEdit({
                              ...noteEdit,
                              [r.id]: e.target.value,
                            })
                          }
                          placeholder="Note pour le collaborateur (facultatif)"
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              onReview(r, true, noteEdit[r.id] || "")
                            }
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1"
                          >
                            <Check size={12} />
                            Valider
                          </button>
                          <button
                            onClick={() =>
                              onReview(r, false, noteEdit[r.id] || "")
                            }
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1"
                          >
                            <X size={12} />
                            Refuser
                          </button>
                        </div>
                      </div>
                    )}
                    {isAdmin && r.status !== "pending" && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onDelete(r)}
                          className="text-xs text-slate-400 hover:text-red-500 p-1"
                          title="Supprimer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// PLANNING MODAL — Module Boulanger F890 en iframe (HTML autonome)
// ========================================================================
// Contenu HTML embarqué en base64 (décompressé au runtime dans l'iframe)
const PLANNING_HTML_B64 = "PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImZyIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjAsIG1heGltdW0tc2NhbGU9MS4wIj4KPHRpdGxlPlBsYW5uaW5nIEY4OTAg4oCUIEJvdWxhbmdlciBGbGVyczwvdGl0bGU+CjxsaW5rIGhyZWY9Imh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9T3V0Zml0OndnaHRAMzAwOzQwMDs1MDA7NjAwOzcwMDs4MDA7OTAwJmZhbWlseT1KZXRCcmFpbnMrTW9ubzp3Z2h0QDQwMDs3MDAmZGlzcGxheT1zd2FwIiByZWw9InN0eWxlc2hlZXQiPgo8bGluayBocmVmPSJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb250LWF3ZXNvbWUvNi40LjAvY3NzL2FsbC5taW4uY3NzIiByZWw9InN0eWxlc2hlZXQiPgo8c3R5bGU+Cjpyb290ey0tb3JhbmdlOiNmZjVlMDA7LS1vcmFuZ2UtbDojZmY3YTJhOy0tbmF2eTojMGQyODQ2Oy0tbmF2eS1sOiMxYTNkNmI7LS1iZzojZjBmM2Y4Oy0tY2FyZDojZmZmOy0tYm9yZGVyOiNlMmU4ZjI7LS10ZXh0OiMxYTI1NDA7LS1tdXRlZDojODg5NmE4Oy0tZ3JlZW46IzFkYjk1NDstLXJlZDojZTUzZTNlOy0teWVsbG93OiNmNTllMGI7LS1yOjEwcHg7LS1yLXM6N3B4Oy0tc2hhZG93OjAgMnB4IDEycHggcmdiYSgxMyw0MCw3MCwuMDgpOy0tc2hhZG93LWxnOjAgOHB4IDMycHggcmdiYSgxMyw0MCw3MCwuMTYpfQoqLCo6OmJlZm9yZSwqOjphZnRlcntib3gtc2l6aW5nOmJvcmRlci1ib3g7bWFyZ2luOjA7cGFkZGluZzowfQpodG1se3Njcm9sbC1iZWhhdmlvcjpzbW9vdGg7aGVpZ2h0OjEwMCV9CmJvZHl7Zm9udC1mYW1pbHk6J091dGZpdCcsc2Fucy1zZXJpZjtiYWNrZ3JvdW5kOnZhcigtLWJnKTtjb2xvcjp2YXIoLS10ZXh0KTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxLjU7aGVpZ2h0OjEwMCU7bWluLWhlaWdodDoxMDBkdmg7b3ZlcmZsb3cteTphdXRvO292ZXJmbG93LXg6aGlkZGVuOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOnRvdWNoO3BhZGRpbmctYm90dG9tOjY4cHh9Ci5ib3QtbmF2e2Rpc3BsYXk6bm9uZTtwb3NpdGlvbjpmaXhlZDtib3R0b206MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6NjJweDtiYWNrZ3JvdW5kOnZhcigtLW5hdnkpO2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLW5hdnktbCk7ei1pbmRleDoyMDA7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1hcm91bmQ7cGFkZGluZzowIDZweDtib3gtc2hhZG93OjAgLTRweCAyMHB4IHJnYmEoMCwwLDAsLjMpfQouYXBwLWhlYWRlcntiYWNrZ3JvdW5kOnZhcigtLW5hdnkpO2NvbG9yOiNmZmY7aGVpZ2h0OjU2cHg7cGFkZGluZzowIDE0cHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtwb3NpdGlvbjpzdGlja3k7dG9wOjA7ei1pbmRleDoxMDA7Ym94LXNoYWRvdzowIDJweCAxNnB4IHJnYmEoMCwwLDAsLjM1KX0KLmJyYW5ke2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7Zm9udC13ZWlnaHQ6ODAwO2ZvbnQtc2l6ZToxcmVtO2xldHRlci1zcGFjaW5nOi4zcHg7d2hpdGUtc3BhY2U6bm93cmFwfQouYnJhbmQtaWNvbnt3aWR0aDozNHB4O2hlaWdodDozNHB4O2JhY2tncm91bmQ6dmFyKC0tb3JhbmdlKTtib3JkZXItcmFkaXVzOjhweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC1zaXplOjFyZW07ZmxleC1zaHJpbms6MH0KLmhidG5ze2Rpc3BsYXk6ZmxleDtnYXA6NXB4O2FsaWduLWl0ZW1zOmNlbnRlcn0KLmhidG57YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xKTtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjE1KTtjb2xvcjojZmZmO3BhZGRpbmc6NXB4IDExcHg7Ym9yZGVyLXJhZGl1czo3cHg7Zm9udC1mYW1pbHk6J091dGZpdCcsc2Fucy1zZXJpZjtmb250LXdlaWdodDo2MDA7Zm9udC1zaXplOi43OHJlbTtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo1cHg7dHJhbnNpdGlvbjphbGwgLjJzO3doaXRlLXNwYWNlOm5vd3JhcH0KLmhidG46aG92ZXJ7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4yKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX0KLmhidG4ub3tiYWNrZ3JvdW5kOnZhcigtLW9yYW5nZSk7Ym9yZGVyLWNvbG9yOnZhcigtLW9yYW5nZS1sKX0KLmhidG4ubzpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLW9yYW5nZS1sKX0KLmhidG4uZHtiYWNrZ3JvdW5kOnJnYmEoMjI5LDYyLDYyLC4yNSk7Ym9yZGVyLWNvbG9yOnJnYmEoMjI5LDYyLDYyLC40NSl9Ci5oYnRuLmljb3twYWRkaW5nOjVweCA5cHh9Ci5kLW9ubHl7ZGlzcGxheTpmbGV4fQoud2Vlay1uYXZ7YmFja2dyb3VuZDp2YXIoLS1jYXJkKTttYXJnaW46MTRweDtib3JkZXItcmFkaXVzOnZhcigtLXIpO3BhZGRpbmc6MTJweCAxOHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Ym94LXNoYWRvdzp2YXIoLS1zaGFkb3cpO2JvcmRlci1sZWZ0OjRweCBzb2xpZCB2YXIoLS1vcmFuZ2UpfQoud2J0bntiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2JvcmRlcjoxcHggc29saWQgdmFyKC0tYm9yZGVyKTtjb2xvcjp2YXIoLS10ZXh0KTtwYWRkaW5nOjdweCAxNnB4O2JvcmRlci1yYWRpdXM6NTBweDtmb250LWZhbWlseTonT3V0Zml0JyxzYW5zLXNlcmlmO2ZvbnQtd2VpZ2h0OjYwMDtmb250LXNpemU6LjgycmVtO2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjdweDt0cmFuc2l0aW9uOmFsbCAuMnN9Ci53YnRuOmhvdmVye2JvcmRlci1jb2xvcjp2YXIoLS1vcmFuZ2UpO2NvbG9yOnZhcigtLW9yYW5nZSl9Ci53ZWVrLWluZm97dGV4dC1hbGlnbjpjZW50ZXJ9Ci53ZWVrLXRpdGxle2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6Ljk1cmVtfQouY2xpcC1zdGF0dXN7Zm9udC1zaXplOi43MnJlbTtjb2xvcjp2YXIoLS1vcmFuZ2UpO2ZvbnQtd2VpZ2h0OjYwMDtkaXNwbGF5Om5vbmU7bWFyZ2luLXRvcDoycHh9Ci5jbGlwLXN0YXR1cy5zaG93e2Rpc3BsYXk6YmxvY2t9Ci50Ymwtd3JhcHttYXJnaW46MCAxNHB4IDE0cHg7YmFja2dyb3VuZDp2YXIoLS1jYXJkKTtib3JkZXItcmFkaXVzOnZhcigtLXIpO2JveC1zaGFkb3c6dmFyKC0tc2hhZG93KTtvdmVyZmxvdzphdXRvOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOnRvdWNofQoudGJsLXdyYXA6Oi13ZWJraXQtc2Nyb2xsYmFye2hlaWdodDo1cHg7d2lkdGg6NXB4fQoudGJsLXdyYXA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1ie2JhY2tncm91bmQ6dmFyKC0tYm9yZGVyKTtib3JkZXItcmFkaXVzOjNweH0KdGFibGUucGxhbnt3aWR0aDoxMDAlO2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZTtmb250LXNpemU6Ljc4cmVtfQp0YWJsZS5wbGFuIHRoZWFkIHRoe2JhY2tncm91bmQ6dmFyKC0tbmF2eSk7Y29sb3I6I2ZmZjtwYWRkaW5nOjlweCA3cHg7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtc2l6ZTouNzhyZW07d2hpdGUtc3BhY2U6bm93cmFwO2JvcmRlcjoxcHggc29saWQgdmFyKC0tbmF2eS1sKTtwb3NpdGlvbjpzdGlja3k7dG9wOjA7ei1pbmRleDoyMH0KdGFibGUucGxhbiB0aGVhZCB0aC50aC1lbXB7bGVmdDowO3otaW5kZXg6MzA7d2lkdGg6MTg1cHg7bWluLXdpZHRoOjE4NXB4O2JvcmRlci1yaWdodDozcHggc29saWQgdmFyKC0tb3JhbmdlKTt0ZXh0LWFsaWduOmxlZnQ7cGFkZGluZy1sZWZ0OjEycHh9CnRhYmxlLnBsYW4gdGhlYWQgdGgudGgtdG90e3dpZHRoOjY4cHg7bWluLXdpZHRoOjY4cHh9CnRhYmxlLnBsYW4gdGhlYWQgdGgudGgtZGF5e21pbi13aWR0aDoxNDhweH0KdGFibGUucGxhbiB0aGVhZCB0aC50aC10b2RheXtiYWNrZ3JvdW5kOiMxYTNkNmI7Ym9yZGVyLWJvdHRvbTozcHggc29saWQgdmFyKC0tb3JhbmdlKX0KLnRkLWVtcHtiYWNrZ3JvdW5kOnZhcigtLWNhcmQpO3dpZHRoOjE4NXB4O21pbi13aWR0aDoxODVweDtib3JkZXItcmlnaHQ6M3B4IHNvbGlkIHZhcigtLW9yYW5nZSk7cGFkZGluZzo5cHggMTBweDtwb3NpdGlvbjpzdGlja3k7bGVmdDowO3otaW5kZXg6MTA7dmVydGljYWwtYWxpZ246dG9wO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWJvcmRlcil9Ci5lbXAtbmFtZXtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOi45MnJlbTtjb2xvcjp2YXIoLS1uYXZ5KTtsaW5lLWhlaWdodDoxLjJ9Ci5lbXAtbWV0YXtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbi10b3A6M3B4O2dhcDo0cHh9Ci5lbXAtZmN7Zm9udC1zaXplOi42MnJlbTtjb2xvcjp2YXIoLS1tdXRlZCk7Zm9udC1mYW1pbHk6J0pldEJyYWlucyBNb25vJyxtb25vc3BhY2V9Ci5lbXAtYmFkZ2V7Zm9udC1zaXplOi41NnJlbTtmb250LXdlaWdodDo3MDA7YmFja2dyb3VuZDp2YXIoLS1iZyk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO2NvbG9yOnZhcigtLW11dGVkKTtwYWRkaW5nOjFweCA1cHg7Ym9yZGVyLXJhZGl1czo0cHg7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4zcHg7bWF4LXdpZHRoOjg4cHg7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwfQouZW1wLWVkaXR7YmFja2dyb3VuZDpub25lO2JvcmRlcjpub25lO2NvbG9yOnZhcigtLW11dGVkKTtjdXJzb3I6cG9pbnRlcjtmb250LXNpemU6LjcycmVtO3BhZGRpbmc6MnB4IDRweDtib3JkZXItcmFkaXVzOjRweDt0cmFuc2l0aW9uOmFsbCAuMnN9Ci5lbXAtZWRpdDpob3Zlcntjb2xvcjp2YXIoLS1vcmFuZ2UpO2JhY2tncm91bmQ6cmdiYSgyNTUsOTQsMCwuMDgpfQouc2lnLWJveHtib3JkZXI6MXB4IGRhc2hlZCAjY2NkNmUwO2hlaWdodDoyNnB4O2JvcmRlci1yYWRpdXM6NXB4O21hcmdpbi10b3A6N3B4O2JhY2tncm91bmQ6dmFyKC0tYmcpfQouc2lnLWxibHtmb250LXNpemU6LjUycmVtO2NvbG9yOnZhcigtLW11dGVkKTt0ZXh0LWFsaWduOmNlbnRlcjttYXJnaW4tdG9wOjFweDt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjZweH0KLnRkLXRvdHt0ZXh0LWFsaWduOmNlbnRlcjt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7cGFkZGluZzo4cHggM3B4O2JhY2tncm91bmQ6I2ZhZmJmZDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO2JvcmRlci1yaWdodDoxcHggc29saWQgdmFyKC0tYm9yZGVyKTtmb250LWZhbWlseTonSmV0QnJhaW5zIE1vbm8nLG1vbm9zcGFjZX0KLnRvdC1oe2ZvbnQtc2l6ZTouOTVyZW07Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOnZhcigtLXRleHQpfQoudG90LWR7Zm9udC1zaXplOi42N3JlbTtmb250LXdlaWdodDo3MDA7bWFyZ2luLXRvcDoycHh9Ci50b3QtZC5zdXB7Y29sb3I6dmFyKC0tcmVkKX0udG90LWQub2t7Y29sb3I6dmFyKC0tZ3JlZW4pfS50b3QtZC5sb3d7Y29sb3I6dmFyKC0teWVsbG93KX0KLnRvdC1je2ZvbnQtc2l6ZTouNjJyZW07Y29sb3I6dmFyKC0tbXV0ZWQpO21hcmdpbi10b3A6MXB4fQoucGNlbGx7cGFkZGluZzo0cHg7dmVydGljYWwtYWxpZ246dG9wO2JvcmRlcjoxcHggc29saWQgdmFyKC0tYm9yZGVyKTtwb3NpdGlvbjpyZWxhdGl2ZTttaW4td2lkdGg6MTQ4cHg7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIC4xNXN9Ci5wY2VsbC5ycHtiYWNrZ3JvdW5kOiNmN2Y4ZmJ9LnBjZWxsLnZhY3tiYWNrZ3JvdW5kOiNmZmZiZWN9LnBjZWxsLm1hbHtiYWNrZ3JvdW5kOiNmZmY0ZjR9LnBjZWxsLmZlcntiYWNrZ3JvdW5kOiNlZWYyZmY7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICM2MzY2ZjF9LnBjZWxsLndre2JhY2tncm91bmQ6I2ZmZn0ucGNlbGwudG9kYXl7YmFja2dyb3VuZDojZmZmZGY0ICFpbXBvcnRhbnR9Ci5kYXktYWN0c3twb3NpdGlvbjphYnNvbHV0ZTt0b3A6M3B4O3JpZ2h0OjNweDtkaXNwbGF5OmZsZXg7Z2FwOjNweDtvcGFjaXR5OjA7dHJhbnNpdGlvbjpvcGFjaXR5IC4yczt6LWluZGV4OjV9Ci5wY2VsbDpob3ZlciAuZGF5LWFjdHN7b3BhY2l0eToxfQouZGFjdHtiYWNrZ3JvdW5kOiNmZmY7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO3dpZHRoOjE5cHg7aGVpZ2h0OjE5cHg7Ym9yZGVyLXJhZGl1czo0cHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2N1cnNvcjpwb2ludGVyO2ZvbnQtc2l6ZTouNjJyZW07Y29sb3I6dmFyKC0tbXV0ZWQpO3RyYW5zaXRpb246YWxsIC4xNXN9Ci5kYWN0OmhvdmVye2NvbG9yOnZhcigtLW9yYW5nZSk7Ym9yZGVyLWNvbG9yOnZhcigtLW9yYW5nZSl9Ci5zdGF0LXNlbHt3aWR0aDoxMDAlO2JvcmRlcjpub25lO2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7Zm9udC1mYW1pbHk6J091dGZpdCcsc2Fucy1zZXJpZjtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOi43OHJlbTtjb2xvcjp2YXIoLS1uYXZ5KTtjdXJzb3I6cG9pbnRlcjtwYWRkaW5nOjA7bWFyZ2luLWJvdHRvbTo0cHg7YXBwZWFyYW5jZTpub25lO3RleHQtYWxpZ246Y2VudGVyfQouc3RhdC1zZWw6Zm9jdXN7b3V0bGluZTpub25lfQoubWlzc2lvbnMtd3JhcHtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7bWFyZ2luLWJvdHRvbTozcHh9Ci5tc2Vse3dpZHRoOjEwMCU7aGVpZ2h0OjE2cHg7Zm9udC1zaXplOi41OHJlbTtmb250LXdlaWdodDo3MDA7dGV4dC1hbGlnbjpjZW50ZXI7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czozcHg7Y3Vyc29yOnBvaW50ZXI7cGFkZGluZzowO2FwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kOiNlY2VjZWM7Y29sb3I6IzMzMzt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjE1c30KLm1zZWw6Zm9jdXN7b3V0bGluZToxcHggc29saWQgdmFyKC0tb3JhbmdlKX0KLm0tZ2VzdHJheW9ue2JhY2tncm91bmQ6IzBkY2FmMCFpbXBvcnRhbnQ7Y29sb3I6IzAwMCFpbXBvcnRhbnR9Ci5tLWFjdHVie2JhY2tncm91bmQ6IzBkNmVmZCFpbXBvcnRhbnQ7Y29sb3I6I2ZmZiFpbXBvcnRhbnR9Ci5tLWNvbW1lcmNle2JhY2tncm91bmQ6I2ZkN2UxNCFpbXBvcnRhbnQ7Y29sb3I6I2ZmZiFpbXBvcnRhbnR9Ci5tLXJlYWltcGxhbnR7YmFja2dyb3VuZDojZDYzMzg0IWltcG9ydGFudDtjb2xvcjojZmZmIWltcG9ydGFudH0KLm0tY2Fpc3Nle2JhY2tncm91bmQ6IzZmNDJjMSFpbXBvcnRhbnQ7Y29sb3I6I2ZmZiFpbXBvcnRhbnR9Ci5tLW11dHtiYWNrZ3JvdW5kOiNmZmMxMDchaW1wb3J0YW50O2NvbG9yOiMwMDAhaW1wb3J0YW50fQoubS1kZWNoYXJne2JhY2tncm91bmQ6IzQ5NTA1NyFpbXBvcnRhbnQ7Y29sb3I6I2ZmZiFpbXBvcnRhbnR9Ci5tLWFpZGVzYXZ7YmFja2dyb3VuZDojZGMzNTQ1IWltcG9ydGFudDtjb2xvcjojZmZmIWltcG9ydGFudH0KLm0tYWlkZWNhaXNzZXtiYWNrZ3JvdW5kOiNiMzlkZGIhaW1wb3J0YW50O2NvbG9yOiMwMDAhaW1wb3J0YW50fQoubS1pbnZlbnRhaXJle2JhY2tncm91bmQ6IzIwYzk5NyFpbXBvcnRhbnQ7Y29sb3I6IzAwMCFpbXBvcnRhbnR9Ci5tLXZhZHtiYWNrZ3JvdW5kOiMxOTg3NTQhaW1wb3J0YW50O2NvbG9yOiNmZmYhaW1wb3J0YW50fQoubS1zYXZ7YmFja2dyb3VuZDojODQyMDI5IWltcG9ydGFudDtjb2xvcjojZmZmIWltcG9ydGFudH0KLm0tbGl2cmFpc29ue2JhY2tncm91bmQ6IzI4YTc0NSFpbXBvcnRhbnQ7Y29sb3I6I2ZmZiFpbXBvcnRhbnR9Ci5wcmVzZXQtc2Vse3dpZHRoOjEwMCU7Zm9udC1zaXplOi42MnJlbTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoxcHggMnB4O21hcmdpbi1ib3R0b206M3B4O2JhY2tncm91bmQ6I2Y4ZjlmYTtjb2xvcjp2YXIoLS1uYXZ5KTtmb250LXdlaWdodDo2MDA7Zm9udC1mYW1pbHk6J091dGZpdCcsc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcn0KLnRpbWVzLXJvd3tkaXNwbGF5OmZsZXg7Z2FwOjJweDttYXJnaW4tYm90dG9tOjJweH0KLnRpbnB1dHtmbGV4OjE7Zm9udC1zaXplOi42MnJlbTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoycHggMXB4O3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtZmFtaWx5OidKZXRCcmFpbnMgTW9ubycsbW9ub3NwYWNlO2JhY2tncm91bmQ6I2ZmZjtjb2xvcjp2YXIoLS10ZXh0KTttaW4td2lkdGg6MH0KLnRpbnB1dDpmb2N1c3tvdXRsaW5lOjFweCBzb2xpZCB2YXIoLS1vcmFuZ2UpO2JvcmRlci1jb2xvcjp2YXIoLS1vcmFuZ2UpfQouY2VsbC1mb290e2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luLXRvcDozcHh9Ci5icmstd3JhcHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDozcHg7YmFja2dyb3VuZDp2YXIoLS1iZyk7cGFkZGluZzoxcHggNXB4O2JvcmRlci1yYWRpdXM6NHB4O2JvcmRlcjoxcHggc29saWQgdmFyKC0tYm9yZGVyKX0KLmJyay1jYnt3aWR0aDoxMXB4IWltcG9ydGFudDtoZWlnaHQ6MTFweCFpbXBvcnRhbnQ7YWNjZW50LWNvbG9yOnZhcigtLW9yYW5nZSk7Y3Vyc29yOnBvaW50ZXJ9Ci5icmstbGJse2ZvbnQtc2l6ZTouNThyZW07Y29sb3I6dmFyKC0tbXV0ZWQpO2N1cnNvcjpwb2ludGVyfQouZGJhZGdle2ZvbnQtc2l6ZTouNjNyZW07Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOnZhcigtLW5hdnkpO2ZvbnQtZmFtaWx5OidKZXRCcmFpbnMgTW9ubycsbW9ub3NwYWNlfQp0Zm9vdCB0ZHtiYWNrZ3JvdW5kOiNmN2Y4ZmI7Ym9yZGVyLXRvcDoycHggc29saWQgdmFyKC0tbmF2eSk7Zm9udC1zaXplOi42OHJlbTtwYWRkaW5nOjVweCA0cHg7dmVydGljYWwtYWxpZ246dG9wO2JvcmRlcjoxcHggc29saWQgdmFyKC0tYm9yZGVyKX0KLmFscnR7Y29sb3I6dmFyKC0tcmVkKTtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOi42M3JlbTtkaXNwbGF5OmJsb2NrO21hcmdpbi1ib3R0b206MnB4fQoub2staXR7Y29sb3I6dmFyKC0tZ3JlZW4pO2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6LjY4cmVtfQoubml0ZW17ZmxleDoxO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Z2FwOjNweDtwYWRkaW5nOjhweCA0cHg7Y29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuNDUpO2N1cnNvcjpwb2ludGVyO2JvcmRlcjpub25lO2JhY2tncm91bmQ6bm9uZTtmb250LWZhbWlseTonT3V0Zml0JyxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTouNThyZW07Zm9udC13ZWlnaHQ6NjAwO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouNXB4O2JvcmRlci1yYWRpdXM6OHB4O3RyYW5zaXRpb246YWxsIC4yc30KLm5pdGVtIGl7Zm9udC1zaXplOjEuMDVyZW19Ci5uaXRlbS5hY3RpdmV7Y29sb3I6dmFyKC0tb3JhbmdlKX0KLm5pdGVtOmFjdGl2ZXt0cmFuc2Zvcm06c2NhbGUoLjkpfQouZmFie2Rpc3BsYXk6bm9uZTtwb3NpdGlvbjpmaXhlZDtyaWdodDoxOHB4O2JvdHRvbTo3NHB4O3dpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7YmFja2dyb3VuZDp2YXIoLS1vcmFuZ2UpO2NvbG9yOiNmZmY7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo1MCU7Zm9udC1zaXplOjEuMjVyZW07Ym94LXNoYWRvdzowIDRweCAxNnB4IHJnYmEoMjU1LDk0LDAsLjQ1KTtjdXJzb3I6cG9pbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt6LWluZGV4OjE1MDt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMnN9Ci5mYWI6YWN0aXZle3RyYW5zZm9ybTpzY2FsZSguODgpfQoudG9hc3Qtd3JhcHtwb3NpdGlvbjpmaXhlZDtib3R0b206NzZweDtyaWdodDoxNHB4O3otaW5kZXg6OTk5OTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uLXJldmVyc2U7Z2FwOjdweDtwb2ludGVyLWV2ZW50czpub25lfQoudG9hc3R7YmFja2dyb3VuZDp2YXIoLS1uYXZ5KTtjb2xvcjojZmZmO3BhZGRpbmc6MTBweCAxNHB4O2JvcmRlci1yYWRpdXM6OXB4O2ZvbnQtc2l6ZTouODJyZW07Zm9udC13ZWlnaHQ6NTAwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjlweDtib3gtc2hhZG93OnZhcigtLXNoYWRvdy1sZyk7cG9pbnRlci1ldmVudHM6YWxsO2FuaW1hdGlvbjpzVSAuM3MgZWFzZTtib3JkZXItbGVmdDo0cHggc29saWQgdmFyKC0tb3JhbmdlKTttYXgtd2lkdGg6MzAwcHh9Ci50b2FzdC5zdWNjZXNze2JvcmRlci1sZWZ0LWNvbG9yOnZhcigtLWdyZWVuKX0udG9hc3QuZGFuZ2Vye2JvcmRlci1sZWZ0LWNvbG9yOnZhcigtLXJlZCl9LnRvYXN0Lndhcm5pbmd7Ym9yZGVyLWxlZnQtY29sb3I6dmFyKC0teWVsbG93KX0KQGtleWZyYW1lcyBzVXtmcm9te29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgyMHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9fQpAa2V5ZnJhbWVzIHNEe2Zyb217b3BhY2l0eToxO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfXRve29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgyMHB4KX19Ci50b2FzdC5ybXthbmltYXRpb246c0QgLjNzIGVhc2UgZm9yd2FyZHN9Ci5tb3ZlcmxheXtwb3NpdGlvbjpmaXhlZDtpbnNldDowO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNTIpO3otaW5kZXg6NTAwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nOjE0cHg7YmFja2Ryb3AtZmlsdGVyOmJsdXIoNHB4KTthbmltYXRpb246ZkkgLjJzIGVhc2V9Ci5tb3ZlcmxheS5oaWRkZW57ZGlzcGxheTpub25lfQpAa2V5ZnJhbWVzIGZJe2Zyb217b3BhY2l0eTowfXRve29wYWNpdHk6MX19Ci5tYm94e2JhY2tncm91bmQ6dmFyKC0tY2FyZCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yKTtib3gtc2hhZG93OnZhcigtLXNoYWRvdy1sZyk7d2lkdGg6MTAwJTttYXgtd2lkdGg6NTgwcHg7bWF4LWhlaWdodDo5MnZoO292ZXJmbG93LXk6YXV0bzthbmltYXRpb246cEkgLjI1cyBjdWJpYy1iZXppZXIoLjM0LDEuNTYsLjY0LDEpfQoubWJveC53aWRle21heC13aWR0aDo3MDBweH0KQGtleWZyYW1lcyBwSXtmcm9te29wYWNpdHk6MDt0cmFuc2Zvcm06c2NhbGUoLjkpIHRyYW5zbGF0ZVkoMTZweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGVZKDApfX0KLm1oZHJ7YmFja2dyb3VuZDp2YXIoLS1uYXZ5KTtjb2xvcjojZmZmO3BhZGRpbmc6MTRweCAxOHB4O2JvcmRlci1yYWRpdXM6dmFyKC0tcikgdmFyKC0tcikgMCAwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW59Ci5tdGl0bGV7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtc2l6ZTouOTVyZW19Ci5tY2xvc2V7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xNSk7Ym9yZGVyOm5vbmU7Y29sb3I6I2ZmZjt3aWR0aDoyN3B4O2hlaWdodDoyN3B4O2JvcmRlci1yYWRpdXM6NnB4O2N1cnNvcjpwb2ludGVyO2ZvbnQtc2l6ZTouODVyZW07ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMnN9Ci5tY2xvc2U6aG92ZXJ7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4zKX0KLm1ib2R5e3BhZGRpbmc6MThweH0KLnRhYnN7ZGlzcGxheTpmbGV4O2JvcmRlci1ib3R0b206MnB4IHNvbGlkIHZhcigtLWJvcmRlcik7bWFyZ2luLWJvdHRvbToxOHB4fQoudGFie3BhZGRpbmc6OXB4IDE2cHg7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtc2l6ZTouODJyZW07Y3Vyc29yOnBvaW50ZXI7Ym9yZGVyOm5vbmU7YmFja2dyb3VuZDpub25lO2NvbG9yOnZhcigtLW11dGVkKTtmb250LWZhbWlseTonT3V0Zml0JyxzYW5zLXNlcmlmO2JvcmRlci1ib3R0b206MnB4IHNvbGlkIHRyYW5zcGFyZW50O21hcmdpbi1ib3R0b206LTJweDt0cmFuc2l0aW9uOmFsbCAuMnN9Ci50YWIuYWN0aXZle2NvbG9yOnZhcigtLW9yYW5nZSk7Ym9yZGVyLWJvdHRvbS1jb2xvcjp2YXIoLS1vcmFuZ2UpfQoudHBhbmV7ZGlzcGxheTpub25lfS50cGFuZS5hY3RpdmV7ZGlzcGxheTpibG9ja30KLmZne21hcmdpbi1ib3R0b206MTNweH0KLmZsYmx7ZGlzcGxheTpibG9jaztmb250LXdlaWdodDo2MDA7Zm9udC1zaXplOi43OHJlbTttYXJnaW4tYm90dG9tOjRweDtjb2xvcjp2YXIoLS10ZXh0KX0KLmZjLC5mc3t3aWR0aDoxMDAlO3BhZGRpbmc6OHB4IDExcHg7Ym9yZGVyOjEuNXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czp2YXIoLS1yLXMpO2ZvbnQtZmFtaWx5OidPdXRmaXQnLHNhbnMtc2VyaWY7Zm9udC1zaXplOi44M3JlbTtjb2xvcjp2YXIoLS10ZXh0KTtiYWNrZ3JvdW5kOnZhcigtLWNhcmQpO3RyYW5zaXRpb246Ym9yZGVyLWNvbG9yIC4yc30KLmZjOmZvY3VzLC5mczpmb2N1c3tvdXRsaW5lOm5vbmU7Ym9yZGVyLWNvbG9yOnZhcigtLW9yYW5nZSk7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgyNTUsOTQsMCwuMSl9Ci5mcm93e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KGF1dG8tZml0LG1pbm1heCgxMzBweCwxZnIpKTtnYXA6MTBweH0KLmJ0bntwYWRkaW5nOjhweCAxNnB4O2JvcmRlci1yYWRpdXM6dmFyKC0tci1zKTtmb250LWZhbWlseTonT3V0Zml0JyxzYW5zLXNlcmlmO2ZvbnQtd2VpZ2h0OjYwMDtmb250LXNpemU6LjgycmVtO2N1cnNvcjpwb2ludGVyO2JvcmRlcjpub25lO2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7dHJhbnNpdGlvbjphbGwgLjJzO3doaXRlLXNwYWNlOm5vd3JhcH0KLmJ0bi1wcmlte2JhY2tncm91bmQ6dmFyKC0tbmF2eSk7Y29sb3I6I2ZmZn0uYnRuLXByaW06aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1uYXZ5LWwpfQouYnRuLW9yZ3tiYWNrZ3JvdW5kOnZhcigtLW9yYW5nZSk7Y29sb3I6I2ZmZn0uYnRuLW9yZzpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLW9yYW5nZS1sKX0KLmJ0bi1va3tiYWNrZ3JvdW5kOnZhcigtLWdyZWVuKTtjb2xvcjojZmZmfS5idG4tb2s6aG92ZXJ7ZmlsdGVyOmJyaWdodG5lc3MoMS4xKX0KLmJ0bi1lcnJ7YmFja2dyb3VuZDp2YXIoLS1yZWQpO2NvbG9yOiNmZmZ9LmJ0bi1lcnI6aG92ZXJ7ZmlsdGVyOmJyaWdodG5lc3MoMS4xKX0KLmJ0bi1naG9zdHtiYWNrZ3JvdW5kOnZhcigtLWJnKTtjb2xvcjp2YXIoLS10ZXh0KTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcil9LmJ0bi1naG9zdDpob3Zlcntib3JkZXItY29sb3I6dmFyKC0tbmF2eSl9Ci5idG4tc217cGFkZGluZzo0cHggMTBweDtmb250LXNpemU6Ljc0cmVtfQouYnRuLWJsa3t3aWR0aDoxMDAlO2p1c3RpZnktY29udGVudDpjZW50ZXJ9Ci5zdGJse3dpZHRoOjEwMCU7Ym9yZGVyLWNvbGxhcHNlOmNvbGxhcHNlO2ZvbnQtc2l6ZTouOHJlbX0KLnN0YmwgdGh7YmFja2dyb3VuZDp2YXIoLS1uYXZ5KTtjb2xvcjojZmZmO3BhZGRpbmc6N3B4IDlweDt0ZXh0LWFsaWduOmxlZnR9Ci5zdGJsIHRke3BhZGRpbmc6N3B4IDlweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpfQouc3RibCB0cjpob3ZlciB0ZHtiYWNrZ3JvdW5kOnZhcigtLWJnKX0KLnN0YXQtdGJse3dpZHRoOjEwMCU7Ym9yZGVyLWNvbGxhcHNlOmNvbGxhcHNlO2ZvbnQtc2l6ZTouODNyZW19Ci5zdGF0LXRibCB0aHtiYWNrZ3JvdW5kOnZhcigtLWJnKTtwYWRkaW5nOjhweCAxMnB4O3RleHQtYWxpZ246bGVmdDtmb250LXdlaWdodDo3MDA7Ym9yZGVyLWJvdHRvbToycHggc29saWQgdmFyKC0tYm9yZGVyKX0KLnN0YXQtdGJsIHRke3BhZGRpbmc6OHB4IDEycHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tYm9yZGVyKTtmb250LWZhbWlseTonSmV0QnJhaW5zIE1vbm8nLG1vbm9zcGFjZX0KLnN0YXQtdGJsIHRmb290IHRke2JhY2tncm91bmQ6dmFyKC0tbmF2eSk7Y29sb3I6I2ZmZjtmb250LXdlaWdodDo3MDB9Ci5jZm0td3JhcHtwb3NpdGlvbjpmaXhlZDtpbnNldDowO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNik7ei1pbmRleDo5MDAwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nOjIwcHg7YmFja2Ryb3AtZmlsdGVyOmJsdXIoNXB4KX0KLmNmbS13cmFwLmhpZGRlbntkaXNwbGF5Om5vbmV9Ci5jZm0tYm94e2JhY2tncm91bmQ6I2ZmZjtib3JkZXItcmFkaXVzOnZhcigtLXIpO3BhZGRpbmc6MjRweDttYXgtd2lkdGg6MzQwcHg7d2lkdGg6MTAwJTtib3gtc2hhZG93OnZhcigtLXNoYWRvdy1sZyk7dGV4dC1hbGlnbjpjZW50ZXI7YW5pbWF0aW9uOnBJIC4ycyBlYXNlfQouY2ZtLWljb257Zm9udC1zaXplOjIuNHJlbTttYXJnaW4tYm90dG9tOjEwcHh9Ci5jZm0tbXNne2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6Ljg0cmVtO21hcmdpbi1ib3R0b206MThweDtsaW5lLWhlaWdodDoxLjV9Ci5jZm0tYWN0c3tkaXNwbGF5OmZsZXg7Z2FwOjEwcHg7anVzdGlmeS1jb250ZW50OmNlbnRlcn0KLmVtcHR5LXRke3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6NjBweCAyMHB4O2NvbG9yOnZhcigtLW11dGVkKTtib3JkZXI6bm9uZX0KLmVtcHR5LXRkIGl7Zm9udC1zaXplOjIuOHJlbTttYXJnaW4tYm90dG9tOjE0cHg7ZGlzcGxheTpibG9jaztvcGFjaXR5Oi4yNX0KLmVtcHR5LXRkIHB7Zm9udC1zaXplOi44OHJlbTttYXJnaW4tYm90dG9tOjE0cHh9Ci5zbGJse2ZvbnQtc2l6ZTouNzJyZW07Zm9udC13ZWlnaHQ6NzAwO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouOHB4O2NvbG9yOnZhcigtLW11dGVkKTttYXJnaW4tYm90dG9tOjlweDtwYWRkaW5nLWJvdHRvbTo1cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tYm9yZGVyKX0KLmxpdnJldXItdGlwe2JhY2tncm91bmQ6I2U4ZjRmZDtib3JkZXI6MXB4IHNvbGlkICNiZWUzZjg7Ym9yZGVyLXJhZGl1czp2YXIoLS1yLXMpO3BhZGRpbmc6OHB4IDEycHg7Zm9udC1zaXplOi43OHJlbTtjb2xvcjojMmI2Y2IwO2Rpc3BsYXk6bm9uZTthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDttYXJnaW4tdG9wOjZweH0KLmxpdnJldXItdGlwLnNob3d7ZGlzcGxheTpmbGV4fQpAbWVkaWEgcHJpbnR7QHBhZ2V7c2l6ZTpsYW5kc2NhcGU7bWFyZ2luOjVtbX1ib2R5e2JhY2tncm91bmQ6I2ZmZjtwcmludC1jb2xvci1hZGp1c3Q6ZXhhY3Q7LXdlYmtpdC1wcmludC1jb2xvci1hZGp1c3Q6ZXhhY3Q7Zm9udC1zaXplOjhwdDtwYWRkaW5nLWJvdHRvbTowfS5hcHAtaGVhZGVyLC53ZWVrLW5hdiwuYm90LW5hdiwuZmFiLC50b2FzdC13cmFwLC5tb3ZlcmxheSwuY2ZtLXdyYXAsLmRheS1hY3RzLC5wcmVzZXQtc2VsLHRmb290e2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9LnBybnQtaGRye2Rpc3BsYXk6ZmxleCFpbXBvcnRhbnR9LnRibC13cmFwe2JveC1zaGFkb3c6bm9uZTtvdmVyZmxvdzp2aXNpYmxlO21hcmdpbjowO2JvcmRlci1yYWRpdXM6MH0udGQtZW1wLC50YWJsZS5wbGFuIHRoZWFkIHRoe3Bvc2l0aW9uOnN0YXRpYyFpbXBvcnRhbnR9dGFibGUucGxhbiB0aGVhZCB0aHtiYWNrZ3JvdW5kOnZhcigtLW5hdnkpIWltcG9ydGFudDtjb2xvcjojZmZmIWltcG9ydGFudH0udGlucHV0LC5tc2VsLC5zdGF0LXNlbHtib3JkZXI6bm9uZSFpbXBvcnRhbnQ7YmFja2dyb3VuZDp0cmFuc3BhcmVudCFpbXBvcnRhbnQ7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9Lm1zZWx7cHJpbnQtY29sb3ItYWRqdXN0OmV4YWN0Oy13ZWJraXQtcHJpbnQtY29sb3ItYWRqdXN0OmV4YWN0fS5zaWctYm94e2JvcmRlcjoxcHggc29saWQgIzAwMCFpbXBvcnRhbnQ7aGVpZ2h0OjMwcHghaW1wb3J0YW50fWJvZHl7dHJhbnNmb3JtOnNjYWxlKC45Nyk7dHJhbnNmb3JtLW9yaWdpbjp0b3AgbGVmdH19Ci5wcm50LWhkcntkaXNwbGF5Om5vbmU7cGFkZGluZzo4cHggMDtib3JkZXItYm90dG9tOjNweCBzb2xpZCB2YXIoLS1vcmFuZ2UpO21hcmdpbi1ib3R0b206MTBweDthbGlnbi1pdGVtczpiYXNlbGluZTtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbn0KLnBybnQtdGl0bGV7Zm9udC1zaXplOjE3cHQ7Zm9udC13ZWlnaHQ6OTAwO2NvbG9yOnZhcigtLW9yYW5nZSk7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfQoucHJudC13ZWVre2ZvbnQtc2l6ZToxMHB0O2NvbG9yOnZhcigtLW5hdnkpO2ZvbnQtd2VpZ2h0OjYwMH0KLnBybnQtY29uZntmb250LXNpemU6N3B0O2NvbG9yOiM5OTk7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO3BhZGRpbmc6MnB4IDZweDt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2V9CkBtZWRpYShtYXgtd2lkdGg6NzY4cHgpe2JvZHl7cGFkZGluZy1ib3R0b206MTIwcHh9LmJvdC1uYXZ7ZGlzcGxheTpmbGV4fS5mYWJ7ZGlzcGxheTpmbGV4fS5kLW9ubHl7ZGlzcGxheTpub25lIWltcG9ydGFudH0uYXBwLWhlYWRlcntoZWlnaHQ6NTBweH0uYnJhbmQgLmItdHh0e2Rpc3BsYXk6bm9uZX0ud2Vlay1uYXZ7bWFyZ2luOjhweCAxMHB4O3BhZGRpbmc6OHB4IDEwcHh9LndidG57cGFkZGluZzo1cHggOXB4O2ZvbnQtc2l6ZTouNzJyZW19LndlZWstdGl0bGV7Zm9udC1zaXplOi43OHJlbX0udGJsLXdyYXB7bWFyZ2luOjAgOHB4IDhweH0udGQtZW1we21pbi13aWR0aDoxMTBweDt3aWR0aDoxMTBweDtwYWRkaW5nOjZweCA3cHg7Zm9udC1zaXplOi43NHJlbX10YWJsZS5wbGFuIHRoZWFkIHRoLnRoLWVtcHttaW4td2lkdGg6MTEwcHg7d2lkdGg6MTEwcHg7cGFkZGluZy1sZWZ0OjhweDtmb250LXNpemU6LjcycmVtfXRhYmxlLnBsYW4gdGhlYWQgdGh7cGFkZGluZzo2cHggNHB4O2ZvbnQtc2l6ZTouN3JlbX10YWJsZS5wbGFuIHRoZWFkIHRoLnRoLWRheXttaW4td2lkdGg6MTIwcHh9dGFibGUucGxhbiB0aGVhZCB0aC50aC10b3R7bWluLXdpZHRoOjU0cHg7d2lkdGg6NTRweH0ucGNlbGx7bWluLXdpZHRoOjEwOHB4O2ZvbnQtc2l6ZTouNzJyZW07cGFkZGluZzo1cHh9LnRpbnB1dHtmb250LXNpemU6LjdyZW07cGFkZGluZzozcHggNXB4fS5tc2VsLC5zdGF0LXNlbHtmb250LXNpemU6LjdyZW07cGFkZGluZzozcHggNXB4fS50b2FzdC13cmFwe2JvdHRvbToxMzBweDtyaWdodDoxMHB4O2xlZnQ6MTBweH0udG9hc3R7bWF4LXdpZHRoOjEwMCV9Lm1ib3h7bWF4LWhlaWdodDo4OHZofS51c2VyLWluZm97Zm9udC1zaXplOi42OHJlbX0udWJhZGdle3BhZGRpbmc6M3B4IDhweDtmb250LXNpemU6LjY2cmVtfS51c2VyLWluZm8gLnUtcm9sZXtkaXNwbGF5Om5vbmV9fQpAbWVkaWEobWF4LXdpZHRoOjQ4MHB4KXsuYXBwLWhlYWRlcntwYWRkaW5nOjAgOHB4fS51c2VyLWluZm8gLmItZmN7ZGlzcGxheTpub25lfS53ZWVrLWluZm97ZmxleDoxO3RleHQtYWxpZ246Y2VudGVyfS53YnRuIHNwYW57ZGlzcGxheTpub25lfS53YnRuIGl7bWFyZ2luOjB9fQoudWJhZGdle2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMTgpO2NvbG9yOiNmZmY7cGFkZGluZzo0cHggMTFweDtib3JkZXItcmFkaXVzOjE0cHg7Zm9udC1zaXplOi43MnJlbTtmb250LXdlaWdodDo2MDA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NXB4O2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMjUpO3doaXRlLXNwYWNlOm5vd3JhcH0KLnViYWRnZS5tZ3J7YmFja2dyb3VuZDp2YXIoLS1vcmFuZ2UpO2JvcmRlci1jb2xvcjp2YXIoLS1vcmFuZ2UtbCl9Ci51YmFkZ2UgLnUtZG90e3dpZHRoOjZweDtoZWlnaHQ6NnB4O2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2ZsZXgtc2hyaW5rOjB9CmJvZHkuZW1wLW1vZGUgLm1nci1vbmx5e2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9CmJvZHkuZW1wLW1vZGUgLmZhYixib2R5LmVtcC1tb2RlIC5ib3QtbmF2e2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9CmJvZHkuZW1wLW1vZGUgdGZvb3R7ZGlzcGxheTpub25lIWltcG9ydGFudH0KYm9keS5lbXAtbW9kZXtwYWRkaW5nLWJvdHRvbToyMHB4IWltcG9ydGFudH0KYm9keS5lbXAtbW9kZSAuc3RhdC1zZWwsYm9keS5lbXAtbW9kZSAudGlucHV0LGJvZHkuZW1wLW1vZGUgLm1zZWx7cG9pbnRlci1ldmVudHM6bm9uZSFpbXBvcnRhbnR9CmJvZHkuZW1wLW1vZGUgLmRheS1hY3RzLGJvZHkuZW1wLW1vZGUgLmVtcC1lZGl0LGJvZHkuZW1wLW1vZGUgLnByZXNldC1zZWwsYm9keS5lbXAtbW9kZSAuYnJrLXdyYXB7ZGlzcGxheTpub25lIWltcG9ydGFudH0KYm9keS5lbXAtbW9kZSAuc3RhdC1zZWx7YmFja2dyb3VuZDp0cmFuc3BhcmVudCFpbXBvcnRhbnQ7Y29sb3I6dmFyKC0tbmF2eSkhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OjgwMCFpbXBvcnRhbnQ7dGV4dC1hbGlnbjpsZWZ0IWltcG9ydGFudDtwYWRkaW5nLWxlZnQ6M3B4IWltcG9ydGFudH0KYm9keS5lbXAtbW9kZSAudGlucHV0e2JhY2tncm91bmQ6dHJhbnNwYXJlbnQhaW1wb3J0YW50O2JvcmRlcjpub25lIWltcG9ydGFudDtjb2xvcjp2YXIoLS10ZXh0KSFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6NzAwIWltcG9ydGFudH0KYm9keS5lbXAtbW9kZSAubXNlbHtiYWNrZ3JvdW5kOiNlY2VjZWMhaW1wb3J0YW50fQpib2R5LmVtcC1tb2RlIC53ZWVrLW5hdntib3JkZXItbGVmdC1jb2xvcjp2YXIoLS1ncmVlbil9CmJvZHkuZW1wLW1vZGUgLnNpZy1ib3h7YmFja2dyb3VuZDojZmZmfQojbG9naW5Nb2RhbCAubWJveHttYXgtd2lkdGg6NDIwcHg7d2lkdGg6MTAwJX0KLmxvZ2luLWhlcm97dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo2cHggMCAxNHB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7bWFyZ2luLWJvdHRvbToxNnB4fQoubG9naW4tbG9nb3t3aWR0aDo2NHB4O2hlaWdodDo2NHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyx2YXIoLS1vcmFuZ2UpLCNmZjg4NDcpO2JvcmRlci1yYWRpdXM6MTZweDtkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZvbnQtc2l6ZToxLjZyZW07Y29sb3I6I2ZmZjttYXJnaW4tYm90dG9tOjEwcHg7Ym94LXNoYWRvdzowIDZweCAxNnB4IHJnYmEoMjU1LDk0LDAsLjM1KX0KLmxvZ2luLXRpdGxle2ZvbnQtc2l6ZToxLjFyZW07Zm9udC13ZWlnaHQ6ODAwO2NvbG9yOnZhcigtLW5hdnkpfQoubG9naW4tc3Vie2ZvbnQtc2l6ZTouNzhyZW07Y29sb3I6dmFyKC0tbXV0ZWQpO21hcmdpbi10b3A6MnB4fQojbG9naW5QaW57Zm9udC1mYW1pbHk6J0pldEJyYWlucyBNb25vJyxtb25vc3BhY2U7Zm9udC1zaXplOjEuNHJlbTt0ZXh0LWFsaWduOmNlbnRlcjtsZXR0ZXItc3BhY2luZzouNnJlbTtwYWRkaW5nOjEwcHh9CiNsb2dpbkVycm9ye2NvbG9yOnZhcigtLXJlZCk7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOi44MnJlbTtmb250LXdlaWdodDo2MDA7bWluLWhlaWdodDoyMHB4O21hcmdpbjo2cHggMH0KLmxvZ2luLWhpbnR7YmFja2dyb3VuZDojZmZmYmVjO2JvcmRlcjoxcHggc29saWQgI2ZkZTY4YTtjb2xvcjojOTI0MDBlO3BhZGRpbmc6OXB4IDEycHg7Ym9yZGVyLXJhZGl1czo4cHg7Zm9udC1zaXplOi43cmVtO21hcmdpbi10b3A6MTRweDtsaW5lLWhlaWdodDoxLjV9Ci50cGwtYWItYnRue2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7Ym9yZGVyOm5vbmU7Y29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuNik7cGFkZGluZzo5cHggMTRweDtib3JkZXItcmFkaXVzOjdweDtmb250LWZhbWlseTonT3V0Zml0JyxzYW5zLXNlcmlmO2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6LjgzcmVtO2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YWxsIC4yc30KLnRwbC1hYi1idG4uYWN0aXZle2JhY2tncm91bmQ6dmFyKC0tb3JhbmdlKTtjb2xvcjojZmZmO2JveC1zaGFkb3c6MCAycHggOHB4IHJnYmEoMjU1LDk0LDAsLjQpfQoudHBsLWRheS1yb3d7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczo4MHB4IDFmciAxZnIgMWZyIDFmciBhdXRvIDcwcHg7Z2FwOjdweDthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzo4cHggMTBweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMTVzfQoudHBsLWRheS1yb3c6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1iZyl9Ci50cGwtZGF5LXJvdzpsYXN0LWNoaWxke2JvcmRlci1ib3R0b206bm9uZX0KLnRwbC1kYXktcm93Lm9mZntvcGFjaXR5Oi41NX0KLnRwbC1kYXktbGJse2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6LjgycmVtO2NvbG9yOnZhcigtLW5hdnkpfQoudHBsLXR5cGUtc2Vse2JvcmRlcjoxcHggc29saWQgdmFyKC0tYm9yZGVyKTtib3JkZXItcmFkaXVzOjVweDtwYWRkaW5nOjVweCAzcHg7Zm9udC1zaXplOi43MnJlbTtmb250LWZhbWlseTonT3V0Zml0JyxzYW5zLXNlcmlmO2ZvbnQtd2VpZ2h0OjYwMDtiYWNrZ3JvdW5kOiNmZmY7Y3Vyc29yOnBvaW50ZXI7Z3JpZC1jb2x1bW46Mn0KLnRwbC10aW1lLWlue2dyaWQtY29sdW1uOmF1dG87Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO2JvcmRlci1yYWRpdXM6NXB4O3BhZGRpbmc6NXB4IDRweDtmb250LXNpemU6Ljc0cmVtO2ZvbnQtZmFtaWx5OidKZXRCcmFpbnMgTW9ubycsbW9ub3NwYWNlO3RleHQtYWxpZ246Y2VudGVyO3dpZHRoOjEwMCU7bWluLXdpZHRoOjB9Ci50cGwtdGltZS1pbjpmb2N1c3tvdXRsaW5lOjFweCBzb2xpZCB2YXIoLS1vcmFuZ2UpO2JvcmRlci1jb2xvcjp2YXIoLS1vcmFuZ2UpfQoudHBsLXRpbWUtaW46ZGlzYWJsZWR7YmFja2dyb3VuZDp2YXIoLS1iZyk7Y29sb3I6dmFyKC0tbXV0ZWQpfQoudHBsLXNlcHtjb2xvcjp2YXIoLS1tdXRlZCk7Zm9udC1zaXplOi43NXJlbTt0ZXh0LWFsaWduOmNlbnRlcn0KLnRwbC1ocnN7Zm9udC1mYW1pbHk6J0pldEJyYWlucyBNb25vJyxtb25vc3BhY2U7Zm9udC1zaXplOi43NHJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6dmFyKC0tb3JhbmdlKTt0ZXh0LWFsaWduOnJpZ2h0fQpAbWVkaWEobWF4LXdpZHRoOjYyMHB4KXsudHBsLWRheS1yb3d7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjYwcHggMWZyIDFmcjtyb3ctZ2FwOjRweDtwYWRkaW5nOjhweCA2cHh9LnRwbC1kYXktbGJse2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MS9zcGFuIDJ9LnRwbC10eXBlLXNlbHtncmlkLWNvbHVtbjoyL3NwYW4gMjtncmlkLXJvdzoxfS50cGwtdGltZS1pbntncmlkLWNvbHVtbjphdXRvO2dyaWQtcm93OjJ9LnRwbC1zZXB7ZGlzcGxheTpub25lfS50cGwtaHJze2dyaWQtY29sdW1uOjIvc3BhbiAyO2dyaWQtcm93OjM7dGV4dC1hbGlnbjpyaWdodDttYXJnaW4tdG9wOjJweH19Cjwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+CjxpbnB1dCB0eXBlPSJmaWxlIiBpZD0iaW1wb3J0SW5wdXQiIGFjY2VwdD0iLmpzb24iIHN0eWxlPSJkaXNwbGF5Om5vbmUiIG9uY2hhbmdlPSJpbXBvcnREYXRhKHRoaXMpIj4KPGRpdiBjbGFzcz0icHJudC1oZHIiPjxkaXY+PGRpdiBjbGFzcz0icHJudC10aXRsZSI+UGxhbm5pbmcgQm91bGFuZ2VyIEZsZXJzIEY4OTA8L2Rpdj48ZGl2IGNsYXNzPSJwcm50LXdlZWsiIGlkPSJwcm50V2VlayI+U2VtYWluZS4uLjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9InBybnQtY29uZiI+Q29uZmlkZW50aWVsIFJIPC9kaXY+PC9kaXY+CjxoZWFkZXIgY2xhc3M9ImFwcC1oZWFkZXIiPjxkaXYgY2xhc3M9ImJyYW5kIj48ZGl2IGNsYXNzPSJicmFuZC1pY29uIj48aSBjbGFzcz0iZmFzIGZhLXN0b3JlIj48L2k+PC9kaXY+PHNwYW4gY2xhc3M9ImItdHh0Ij5QTEFOSUZJRVImbmJzcDs8c3Ryb25nPkY4OTA8L3N0cm9uZz48L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0iaGJ0bnMiPjxzcGFuIGlkPSJ1c2VyQmFkZ2UiIGNsYXNzPSJ1YmFkZ2UiIHN0eWxlPSJkaXNwbGF5Om5vbmUiPjxzcGFuIGNsYXNzPSJ1LWRvdCI+PC9zcGFuPjxzcGFuIGlkPSJ1c2VyTmFtZSI+4oCUPC9zcGFuPjwvc3Bhbj48YnV0dG9uIGNsYXNzPSJoYnRuIGQtb25seSBtZ3Itb25seSIgb25jbGljaz0iY29uZmlybTIoJ0xhbmNlciBsZSBkaXNwYXRjaCBhdXRvbWF0aXF1ZSAoUm90YXRpb24pID8nLCBhdXRvRGlzcGF0Y2gsICfwn5SEJykiPjxpIGNsYXNzPSJmYXMgZmEtc3luYy1hbHQiPjwvaT4gRGlzcGF0Y2g8L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJoYnRuIGQgZC1vbmx5IG1nci1vbmx5IiBvbmNsaWNrPSJjb25maXJtMignRWZmYWNlciB0b3V0IGxlIHBsYW5uaW5nIGRlIGNldHRlIHNlbWFpbmUgPycsIGNsZWFyQ3VycmVudFdlZWssICfwn6e5JykiPjxpIGNsYXNzPSJmYXMgZmEtZXJhc2VyIj48L2k+IEVmZmFjZXI8L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJoYnRuIGQtb25seSBtZ3Itb25seSIgb25jbGljaz0ib3Blbk1vZGFsKCdkdXBNb2RhbCcpIj48aSBjbGFzcz0iZmFzIGZhLWJvbHQiPjwvaT4gRHVwbGlxdWVyPC9idXR0b24+PGJ1dHRvbiBjbGFzcz0iaGJ0biBpY28gbWdyLW9ubHkiIG9uY2xpY2s9ImV4cG9ydERhdGEoKSIgdGl0bGU9IkV4cG9ydGVyIj48aSBjbGFzcz0iZmFzIGZhLWRvd25sb2FkIj48L2k+PC9idXR0b24+PGJ1dHRvbiBjbGFzcz0iaGJ0biBpY28gbWdyLW9ubHkiIG9uY2xpY2s9ImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbXBvcnRJbnB1dCcpLmNsaWNrKCkiIHRpdGxlPSJJbXBvcnRlciI+PGkgY2xhc3M9ImZhcyBmYS11cGxvYWQiPjwvaT48L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJoYnRuIG8iIG9uY2xpY2s9IndpbmRvdy5wcmludCgpIj48aSBjbGFzcz0iZmFzIGZhLXByaW50Ij48L2k+IDxzcGFuIGNsYXNzPSJkLW9ubHkiPlBERjwvc3Bhbj48L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJoYnRuIGQtb25seSBtZ3Itb25seSIgb25jbGljaz0ib3BlbkVtcE1vZGFsKG51bGwpIj48aSBjbGFzcz0iZmFzIGZhLXVzZXItcGx1cyI+PC9pPiBTYWxhcmnDqTwvYnV0dG9uPjxidXR0b24gY2xhc3M9ImhidG4gaWNvIG1nci1vbmx5IiBvbmNsaWNrPSJjb25maXJtMignRWZmYWNlciBUT1VURVMgbGVzIGRvbm7DqWVzIGTDqWZpbml0aXZlbWVudCA/JywgcmVzZXREYXRhLCAn8J+Xke+4jycpIj48aSBjbGFzcz0iZmFzIGZhLXRyYXNoIj48L2k+PC9idXR0b24+PGJ1dHRvbiBjbGFzcz0iaGJ0biBkIiBvbmNsaWNrPSJsb2dvdXQoKSIgdGl0bGU9IkTDqWNvbm5leGlvbiI+PGkgY2xhc3M9ImZhcyBmYS1zaWduLW91dC1hbHQiPjwvaT48L2J1dHRvbj48L2Rpdj48L2hlYWRlcj4KPGRpdiBjbGFzcz0ibW92ZXJsYXkgaGlkZGVuIiBpZD0ibG9naW5Nb2RhbCIgb25jbGljaz0iaWYoZXZlbnQudGFyZ2V0PT09dGhpcylldmVudC5zdG9wUHJvcGFnYXRpb24oKSIgc3R5bGU9InotaW5kZXg6OTAwIj48ZGl2IGNsYXNzPSJtYm94Ij48ZGl2IGNsYXNzPSJtYm9keSI+PGRpdiBjbGFzcz0ibG9naW4taGVybyI+PGRpdiBjbGFzcz0ibG9naW4tbG9nbyI+PGkgY2xhc3M9ImZhcyBmYS1zdG9yZSI+PC9pPjwvZGl2PjxkaXYgY2xhc3M9ImxvZ2luLXRpdGxlIj5QbGFubmluZyBCb3VsYW5nZXIgRjg5MDwvZGl2PjxkaXYgY2xhc3M9ImxvZ2luLXN1YiI+Q29ubmV4aW9uIMOgIHZvdHJlIGVzcGFjZSBwZXJzb25uZWw8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJmZyI+PGxhYmVsIGNsYXNzPSJmbGJsIj5KZSBzdWlzPC9sYWJlbD48c2VsZWN0IGlkPSJsb2dpbldobyIgY2xhc3M9ImZzIj48L3NlbGVjdD48L2Rpdj48ZGl2IGNsYXNzPSJmZyIgc3R5bGU9Im1hcmdpbi1ib3R0b206NnB4Ij48bGFiZWwgY2xhc3M9ImZsYmwiPkNvZGUgcGVyc29ubmVsICg0IGNoaWZmcmVzKTwvbGFiZWw+PGlucHV0IHR5cGU9InBhc3N3b3JkIiBpZD0ibG9naW5QaW4iIGNsYXNzPSJmYyIgaW5wdXRtb2RlPSJudW1lcmljIiBwYXR0ZXJuPSJbMC05XSoiIG1heGxlbmd0aD0iNCIgcGxhY2Vob2xkZXI9IuKAouKAouKAouKAoiIgb25rZXl1cD0iaWYoZXZlbnQua2V5PT09J0VudGVyJylkb0xvZ2luKCkiPjwvZGl2PjxkaXYgaWQ9ImxvZ2luRXJyb3IiPjwvZGl2PjxidXR0b24gY2xhc3M9ImJ0biBidG4tb3JnIGJ0bi1ibGsiIG9uY2xpY2s9ImRvTG9naW4oKSIgc3R5bGU9Im1hcmdpbi10b3A6NHB4Ij48aSBjbGFzcz0iZmFzIGZhLXNpZ24taW4tYWx0Ij48L2k+IFNlIGNvbm5lY3RlcjwvYnV0dG9uPjxkaXYgY2xhc3M9ImxvZ2luLWhpbnQiPjxpIGNsYXNzPSJmYXMgZmEtaW5mby1jaXJjbGUiPjwvaT4gPHN0cm9uZz5Db2RlcyBwYXIgZMOpZmF1dCA6PC9zdHJvbmc+PGJyPuKAoiBHw6lyYW50IDogPHN0cm9uZz4xMjM0PC9zdHJvbmc+PGJyPuKAoiBTYWxhcmnDqXMgOiBsZXMgPHN0cm9uZz40IGRlcm5pZXJzIGNoaWZmcmVzIGRlIGxldXIgY29kZSBGQzwvc3Ryb25nPiwgb3UgPHN0cm9uZz4wMDAwPC9zdHJvbmc+IHNpIG5vbiByZW5zZWlnbsOpPC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+CjxkaXYgY2xhc3M9IndlZWstbmF2Ij48YnV0dG9uIGNsYXNzPSJ3YnRuIiBvbmNsaWNrPSJjaGFuZ2VXZWVrKC0xKSI+PGkgY2xhc3M9ImZhcyBmYS1jaGV2cm9uLWxlZnQiPjwvaT4gUHLDqWMuPC9idXR0b24+PGRpdiBjbGFzcz0id2Vlay1pbmZvIj48ZGl2IGNsYXNzPSJ3ZWVrLXRpdGxlIiBpZD0id2Vla1RpdGxlIj7igKY8L2Rpdj48ZGl2IGNsYXNzPSJjbGlwLXN0YXR1cyIgaWQ9ImNsaXBTdGF0dXMiPjxpIGNsYXNzPSJmYXMgZmEtcGFzdGUiPjwvaT4gSm91cm7DqWUgY29wacOpZTwvZGl2PjwvZGl2PjxidXR0b24gY2xhc3M9IndidG4iIG9uY2xpY2s9ImNoYW5nZVdlZWsoMSkiPlN1aXYuIDxpIGNsYXNzPSJmYXMgZmEtY2hldnJvbi1yaWdodCI+PC9pPjwvYnV0dG9uPjwvZGl2Pgo8ZGl2IGNsYXNzPSJ0Ymwtd3JhcCIgaWQ9InRibFdyYXAiPjx0YWJsZSBjbGFzcz0icGxhbiI+PHRoZWFkPjx0ciBpZD0iaFJvdyI+PC90cj48L3RoZWFkPjx0Ym9keSBpZD0icEJvZHkiPjwvdGJvZHk+PHRmb290IGlkPSJwRm9vdCI+PC90Zm9vdD48L3RhYmxlPjwvZGl2Pgo8YnV0dG9uIGNsYXNzPSJmYWIiIG9uY2xpY2s9Im9wZW5FbXBNb2RhbChudWxsKSI+PGkgY2xhc3M9ImZhcyBmYS11c2VyLXBsdXMiPjwvaT48L2J1dHRvbj4KPG5hdiBjbGFzcz0iYm90LW5hdiI+PGJ1dHRvbiBjbGFzcz0ibml0ZW0gYWN0aXZlIiBpZD0ibmF2LXBsYW4iIG9uY2xpY2s9InNldE5hdigncGxhbicpIj48aSBjbGFzcz0iZmFzIGZhLWNhbGVuZGFyLXdlZWsiPjwvaT5QbGFubmluZzwvYnV0dG9uPjxidXR0b24gY2xhc3M9Im5pdGVtIiBpZD0ibmF2LWRzcCIgb25jbGljaz0ic2V0TmF2KCdkc3AnKTtjb25maXJtMignTGFuY2VyIGxlIGRpc3BhdGNoIGF1dG9tYXRpcXVlID8nLCBhdXRvRGlzcGF0Y2gsICfwn5SEJykiPjxpIGNsYXNzPSJmYXMgZmEtc3luYy1hbHQiPjwvaT5EaXNwYXRjaDwvYnV0dG9uPjxidXR0b24gY2xhc3M9Im5pdGVtIiBpZD0ibmF2LXRlYW0iIG9uY2xpY2s9InNldE5hdigndGVhbScpO29wZW5FbXBNb2RhbChudWxsKSI+PGkgY2xhc3M9ImZhcyBmYS11c2VycyI+PC9pPsOJcXVpcGU8L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJuaXRlbSIgaWQ9Im5hdi1tb3JlIiBvbmNsaWNrPSJzZXROYXYoJ21vcmUnKTtvcGVuTW9kYWwoJ3Rvb2xzTW9kYWwnKSI+PGkgY2xhc3M9ImZhcyBmYS1lbGxpcHNpcy1oIj48L2k+UGx1czwvYnV0dG9uPjwvbmF2Pgo8ZGl2IGNsYXNzPSJ0b2FzdC13cmFwIiBpZD0idG9hc3RXcmFwIj48L2Rpdj4KPGRpdiBjbGFzcz0ibW92ZXJsYXkgaGlkZGVuIiBpZD0iZW1wTW9kYWwiPjxkaXYgY2xhc3M9Im1ib3ggd2lkZSI+PGRpdiBjbGFzcz0ibWhkciI+PGRpdiBjbGFzcz0ibXRpdGxlIiBpZD0iZW1wTVRpdGxlIj48aSBjbGFzcz0iZmFzIGZhLXVzZXIiPjwvaT4gRmljaGUgU2FsYXJpw6k8L2Rpdj48YnV0dG9uIGNsYXNzPSJtY2xvc2UiIG9uY2xpY2s9ImNsb3NlTW9kYWwoJ2VtcE1vZGFsJykiPjxpIGNsYXNzPSJmYXMgZmEtdGltZXMiPjwvaT48L2J1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPSJtYm9keSI+PGRpdiBjbGFzcz0idGFicyI+PGJ1dHRvbiBjbGFzcz0idGFiIGFjdGl2ZSIgb25jbGljaz0ic3dpdGNoVGFiKCd0cEluZm8nLHRoaXMpIj5JZGVudGl0w6k8L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJ0YWIiIG9uY2xpY2s9InN3aXRjaFRhYigndHBUcGwnLHRoaXMpIj5QbGFubmluZyB0eXBlPC9idXR0b24+PGJ1dHRvbiBjbGFzcz0idGFiIiBvbmNsaWNrPSJzd2l0Y2hUYWIoJ3RwQWJzJyx0aGlzKSI+Q29uZ8OpczwvYnV0dG9uPjxidXR0b24gY2xhc3M9InRhYiIgb25jbGljaz0ic3dpdGNoVGFiKCd0cFN0YXQnLHRoaXMpIj5CaWxhbiBhbm51ZWw8L2J1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPSJ0cGFuZSBhY3RpdmUiIGlkPSJ0cEluZm8iPjxmb3JtIGlkPSJlbXBGb3JtIiBvbnN1Ym1pdD0ic2F2ZUVtcGxveWVlKGV2ZW50KSI+PGlucHV0IHR5cGU9ImhpZGRlbiIgaWQ9ImVJZCI+PGRpdiBjbGFzcz0iZnJvdyI+PGRpdiBjbGFzcz0iZmciPjxsYWJlbCBjbGFzcz0iZmxibCI+UHLDqW5vbSAqPC9sYWJlbD48aW5wdXQgdHlwZT0idGV4dCIgaWQ9ImVGaXJzdCIgY2xhc3M9ImZjIiBwbGFjZWhvbGRlcj0iSmVhbiI+PC9kaXY+PGRpdiBjbGFzcz0iZmciPjxsYWJlbCBjbGFzcz0iZmxibCI+TWF0cmljdWxlIEZDPC9sYWJlbD48aW5wdXQgdHlwZT0idGV4dCIgaWQ9ImVGY0lkIiBjbGFzcz0iZmMiIHBsYWNlaG9sZGVyPSJGQy1YWFhYIj48L2Rpdj48ZGl2IGNsYXNzPSJmZyI+PGxhYmVsIGNsYXNzPSJmbGJsIiBzdHlsZT0iY29sb3I6dmFyKC0tb3JhbmdlKSI+SGV1cmVzIGNvbnRyYXQ8L2xhYmVsPjxpbnB1dCB0eXBlPSJudW1iZXIiIGlkPSJlQ29udCIgY2xhc3M9ImZjIiB2YWx1ZT0iMzUiIG1pbj0iMCIgc3RlcD0iMC41Ij48L2Rpdj48ZGl2IGNsYXNzPSJmZyI+PGxhYmVsIGNsYXNzPSJmbGJsIj5Db2RlIFBJTiAoNCBjaGlmZnJlcyk8L2xhYmVsPjxpbnB1dCB0eXBlPSJ0ZXh0IiBpZD0iZVBpbiIgY2xhc3M9ImZjIiBtYXhsZW5ndGg9IjQiIGlucHV0bW9kZT0ibnVtZXJpYyIgcGxhY2Vob2xkZXI9IkF1dG8gdmlhIEZDIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJmZyI+PGxhYmVsIGNsYXNzPSJmbGJsIj5Gb25jdGlvbjwvbGFiZWw+PHNlbGVjdCBpZD0iZVJvbGUiIGNsYXNzPSJmcyIgb25jaGFuZ2U9Im9uUm9sZUNoZygpIj48b3B0aW9uPkfDqXJhbnQ8L29wdGlvbj48b3B0aW9uPkxpdnJldXIgUG9seXZhbGVudDwvb3B0aW9uPjxvcHRpb24+VmVuZGV1cihzZSk8L29wdGlvbj48b3B0aW9uPlZlbmRldXIoc2UpIFBvbHl2YWxlbnQ8L29wdGlvbj48b3B0aW9uPlZlbmRldXIoc2UpIEV4cGVydDwvb3B0aW9uPjxvcHRpb24+VmVuZGV1cihzZSkgQ29uZmlybcOpKGUpPC9vcHRpb24+PG9wdGlvbj5BZGpvaW50KGUpIFDDtGxlIFNlcnZpY2VzPC9vcHRpb24+PG9wdGlvbj5DYWlzc2llcihlKTwvb3B0aW9uPjxvcHRpb24+Q2Fpc3NpZXIoZSkgUG9seXZhbGVudCBTQVY8L29wdGlvbj48b3B0aW9uPlNBVjwvb3B0aW9uPjxvcHRpb24+TWFnYXNpbmllcjwvb3B0aW9uPjxvcHRpb24+RW5jYWRyYW50PC9vcHRpb24+PG9wdGlvbj5BbHRlcm5hbnQ8L29wdGlvbj48b3B0aW9uPkludGVydmVuYW50PC9vcHRpb24+PG9wdGlvbj5TdGFnaWFpcmU8L29wdGlvbj48L3NlbGVjdD48ZGl2IGNsYXNzPSJsaXZyZXVyLXRpcCIgaWQ9ImxpdnJldXJUaXAiPjxpIGNsYXNzPSJmYXMgZmEtdHJ1Y2siPjwvaT4gUmVwb3MgZml4w6lzIGF1dG9tYXRpcXVlbWVudCA6IEpldWRpICYgRGltYW5jaGU8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJzbGJsIiBzdHlsZT0ibWFyZ2luLXRvcDoxNHB4Ij5SZXBvcyBoZWJkb21hZGFpcmVzPC9kaXY+PGRpdiBjbGFzcz0iZnJvdyI+PGRpdiBjbGFzcz0iZmciPjxsYWJlbCBjbGFzcz0iZmxibCI+UmVwb3MgMTwvbGFiZWw+PHNlbGVjdCBpZD0iZVIxIiBjbGFzcz0iZnMiPjxvcHRpb24gdmFsdWU9IiI+4oCUIGF1Y3VuIOKAlDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9IjEiPkx1bmRpPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iMiI+TWFyZGk8L29wdGlvbj48b3B0aW9uIHZhbHVlPSIzIj5NZXJjcmVkaTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9IjQiPkpldWRpPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iNSI+VmVuZHJlZGk8L29wdGlvbj48b3B0aW9uIHZhbHVlPSI2Ij5TYW1lZGk8L29wdGlvbj48b3B0aW9uIHZhbHVlPSIwIj5EaW1hbmNoZTwvb3B0aW9uPjwvc2VsZWN0PjwvZGl2PjxkaXYgY2xhc3M9ImZnIj48bGFiZWwgY2xhc3M9ImZsYmwiPlJlcG9zIDI8L2xhYmVsPjxzZWxlY3QgaWQ9ImVSMiIgY2xhc3M9ImZzIj48b3B0aW9uIHZhbHVlPSIiPuKAlCBhdWN1biDigJQ8L29wdGlvbj48b3B0aW9uIHZhbHVlPSIxIj5MdW5kaTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9IjIiPk1hcmRpPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iMyI+TWVyY3JlZGk8L29wdGlvbj48b3B0aW9uIHZhbHVlPSI0Ij5KZXVkaTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9IjUiPlZlbmRyZWRpPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iNiI+U2FtZWRpPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iMCI+RGltYW5jaGU8L29wdGlvbj48L3NlbGVjdD48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPSJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4O21hcmdpbi10b3A6NnB4Ij48YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tZXJyIGJ0bi1zbSIgaWQ9ImJ0bkRlbEVtcCIgb25jbGljaz0iZGVsZXRlRW1wbG95ZWUoKSIgc3R5bGU9ImRpc3BsYXk6bm9uZSI+PGkgY2xhc3M9ImZhcyBmYS10cmFzaCI+PC9pPiBTdXBwcmltZXI8L2J1dHRvbj48YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tb2siIHN0eWxlPSJtYXJnaW4tbGVmdDphdXRvIiBvbmNsaWNrPSJzYXZlRW1wbG95ZWUoKSI+PGkgY2xhc3M9ImZhcyBmYS1jaGVjayI+PC9pPiBFbnJlZ2lzdHJlcjwvYnV0dG9uPjwvZGl2PjwvZm9ybT48L2Rpdj48ZGl2IGNsYXNzPSJ0cGFuZSIgaWQ9InRwVHBsIj48ZGl2IHN0eWxlPSJiYWNrZ3JvdW5kOiNlZWYyZmY7Ym9yZGVyOjFweCBzb2xpZCAjYzdkMmZlO2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MTBweCAxM3B4O2ZvbnQtc2l6ZTouNzhyZW07Y29sb3I6IzM3MzBhMzttYXJnaW4tYm90dG9tOjE0cHg7bGluZS1oZWlnaHQ6MS41Ij48aSBjbGFzcz0iZmFzIGZhLWluZm8tY2lyY2xlIj48L2k+IETDqWZpbmlzc2V6IGljaSBsZXMgaG9yYWlyZXMgcsOpY3VycmVudHMuIElscyBzJ2FwcGxpcXVlbnQgYXV0b21hdGlxdWVtZW50IGNoYXF1ZSBzZW1haW5lLCBzYXVmIHNpIHVuZSBqb3VybsOpZSBlc3QgbW9kaWZpw6llIG1hbnVlbGxlbWVudCBvdSBtYXJxdcOpZSBlbiBjb25nw6kvYWJzZW5jZS48L2Rpdj48ZGl2IHN0eWxlPSJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4O21hcmdpbi1ib3R0b206MTRweDtwYWRkaW5nOjEwcHg7YmFja2dyb3VuZDp2YXIoLS1iZyk7Ym9yZGVyLXJhZGl1czo4cHgiPjxsYWJlbCBzdHlsZT0iZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O2N1cnNvcjpwb2ludGVyO2ZvbnQtd2VpZ2h0OjYwMDtmb250LXNpemU6Ljg1cmVtIj48aW5wdXQgdHlwZT0iY2hlY2tib3giIGlkPSJ0cGxBbHRlcm4iIG9uY2hhbmdlPSJ0b2dnbGVBbHRlcm4oKSIgc3R5bGU9IndpZHRoOjE2cHg7aGVpZ2h0OjE2cHg7YWNjZW50LWNvbG9yOnZhcigtLW9yYW5nZSk7Y3Vyc29yOnBvaW50ZXIiPiBBbHRlcm5hbmNlIFNlbWFpbmUgQSAvIFNlbWFpbmUgQjwvbGFiZWw+PHNwYW4gc3R5bGU9ImZvbnQtc2l6ZTouN3JlbTtjb2xvcjp2YXIoLS1tdXRlZCk7bWFyZ2luLWxlZnQ6YXV0byI+KGNvbnRyYXRzIG1vZHVsw6lzKTwvc3Bhbj48L2Rpdj48ZGl2IGlkPSJ0cGxTd2l0Y2hlciIgc3R5bGU9ImRpc3BsYXk6bm9uZTtiYWNrZ3JvdW5kOnZhcigtLW5hdnkpO2JvcmRlci1yYWRpdXM6MTBweDtwYWRkaW5nOjRweDttYXJnaW4tYm90dG9tOjE0cHgiPjxkaXYgc3R5bGU9ImRpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjtnYXA6NHB4Ij48YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9InRwbC1hYi1idG4gYWN0aXZlIiBkYXRhLXdlZWs9IkEiIG9uY2xpY2s9InN3aXRjaFRwbFdlZWsoJ0EnLHRoaXMpIj5TZW1haW5lIEEgPHNwYW4gaWQ9InRwbEFIb3VycyIgc3R5bGU9Im9wYWNpdHk6Ljg7Zm9udC1zaXplOi43cmVtIj7igJQ8L3NwYW4+PC9idXR0b24+PGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJ0cGwtYWItYnRuIiBkYXRhLXdlZWs9IkIiIG9uY2xpY2s9InN3aXRjaFRwbFdlZWsoJ0InLHRoaXMpIj5TZW1haW5lIEIgPHNwYW4gaWQ9InRwbEJIb3VycyIgc3R5bGU9Im9wYWNpdHk6Ljg7Zm9udC1zaXplOi43cmVtIj7igJQ8L3NwYW4+PC9idXR0b24+PC9kaXY+PC9kaXY+PGRpdiBpZD0idHBsQ29udHJhY3RCIiBzdHlsZT0iZGlzcGxheTpub25lO21hcmdpbi1ib3R0b206MTRweCI+PGRpdiBjbGFzcz0iZnJvdyI+PGRpdiBjbGFzcz0iZmciIHN0eWxlPSJtYXJnaW46MCI+PGxhYmVsIGNsYXNzPSJmbGJsIj5IZXVyZXMgY29udHJhdCBTZW1haW5lIEE8L2xhYmVsPjxpbnB1dCB0eXBlPSJudW1iZXIiIGlkPSJlQ29udEEiIGNsYXNzPSJmYyIgbWluPSIwIiBzdGVwPSIwLjUiIHBsYWNlaG9sZGVyPSJleDogMjUiPjwvZGl2PjxkaXYgY2xhc3M9ImZnIiBzdHlsZT0ibWFyZ2luOjAiPjxsYWJlbCBjbGFzcz0iZmxibCI+SGV1cmVzIGNvbnRyYXQgU2VtYWluZSBCPC9sYWJlbD48aW5wdXQgdHlwZT0ibnVtYmVyIiBpZD0iZUNvbnRCIiBjbGFzcz0iZmMiIG1pbj0iMCIgc3RlcD0iMC41IiBwbGFjZWhvbGRlcj0iZXg6IDM0Ij48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGlkPSJ0cGxEYXlzTGlzdCI+PC9kaXY+PGRpdiBzdHlsZT0iZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW4tdG9wOjE0cHg7cGFkZGluZy10b3A6MTRweDtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpIj48ZGl2IHN0eWxlPSJmb250LXNpemU6LjgycmVtO2NvbG9yOnZhcigtLW11dGVkKSI+VG90YWwgc2VtYWluZSA6IDxzdHJvbmcgaWQ9InRwbFdlZWtUb3RhbCIgc3R5bGU9ImNvbG9yOnZhcigtLW9yYW5nZSk7Zm9udC1mYW1pbHk6J0pldEJyYWlucyBNb25vJyxtb25vc3BhY2UiPjBoMDA8L3N0cm9uZz48L2Rpdj48ZGl2IHN0eWxlPSJkaXNwbGF5OmZsZXg7Z2FwOjhweCI+PGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLWdob3N0IGJ0bi1zbSIgb25jbGljaz0iY2xlYXJUcGwoKSI+PGkgY2xhc3M9ImZhcyBmYS1lcmFzZXIiPjwvaT4gVmlkZXI8L2J1dHRvbj48YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tb2siIG9uY2xpY2s9InNhdmVUcGwoKSI+PGkgY2xhc3M9ImZhcyBmYS1jaGVjayI+PC9pPiBFbnJlZ2lzdHJlciBwbGFubmluZyB0eXBlPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0idHBhbmUiIGlkPSJ0cEFicyI+PGRpdiBjbGFzcz0ic2xibCI+QWpvdXRlciB1bmUgYWJzZW5jZTwvZGl2Pjxmb3JtIGlkPSJhYnNGb3JtIiBvbnN1Ym1pdD0ic2F2ZUFic2VuY2UoZXZlbnQpIiBzdHlsZT0iZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyIDFmciBhdXRvO2dhcDo4cHg7YWxpZ24taXRlbXM6ZW5kO21hcmdpbi1ib3R0b206MThweCI+PGRpdiBjbGFzcz0iZmciIHN0eWxlPSJtYXJnaW46MCI+PGxhYmVsIGNsYXNzPSJmbGJsIj5Ew6lidXQ8L2xhYmVsPjxpbnB1dCB0eXBlPSJkYXRlIiBpZD0iYURlYiIgY2xhc3M9ImZjIj48L2Rpdj48ZGl2IGNsYXNzPSJmZyIgc3R5bGU9Im1hcmdpbjowIj48bGFiZWwgY2xhc3M9ImZsYmwiPkZpbjwvbGFiZWw+PGlucHV0IHR5cGU9ImRhdGUiIGlkPSJhRmluIiBjbGFzcz0iZmMiPjwvZGl2PjxkaXYgY2xhc3M9ImZnIiBzdHlsZT0ibWFyZ2luOjAiPjxsYWJlbCBjbGFzcz0iZmxibCI+VHlwZTwvbGFiZWw+PHNlbGVjdCBpZD0iYVR5cGUiIGNsYXNzPSJmcyI+PG9wdGlvbj5WYWNhbmNlczwvb3B0aW9uPjxvcHRpb24+TWFsYWRpZTwvb3B0aW9uPjxvcHRpb24+UlRUPC9vcHRpb24+PG9wdGlvbj5Gb3JtYXRpb248L29wdGlvbj48L3NlbGVjdD48L2Rpdj48YnV0dG9uIHR5cGU9InN1Ym1pdCIgY2xhc3M9ImJ0biBidG4tcHJpbSI+PGkgY2xhc3M9ImZhcyBmYS1wbHVzIj48L2k+PC9idXR0b24+PC9mb3JtPjx0YWJsZSBjbGFzcz0ic3RibCI+PHRoZWFkPjx0cj48dGg+RMOpYnV0PC90aD48dGg+RmluPC90aD48dGg+VHlwZTwvdGg+PHRoPjwvdGg+PC90cj48L3RoZWFkPjx0Ym9keSBpZD0iYWJzTGlzdCI+PC90Ym9keT48L3RhYmxlPjwvZGl2PjxkaXYgY2xhc3M9InRwYW5lIiBpZD0idHBTdGF0Ij48ZGl2IGNsYXNzPSJzbGJsIj5IZXVyZXMgdHJhdmFpbGzDqWVzIOKAlCBhbm7DqWUgZW4gY291cnM8L2Rpdj48dGFibGUgY2xhc3M9InN0YXQtdGJsIj48dGhlYWQ+PHRyPjx0aD5Nb2lzPC90aD48dGg+SGV1cmVzPC90aD48L3RyPjwvdGhlYWQ+PHRib2R5IGlkPSJzdGF0Qm9keSI+PC90Ym9keT48dGZvb3Q+PHRyPjx0ZD5Ub3RhbCBhbm51ZWw8L3RkPjx0ZCBpZD0ic3RhdFRvdGFsIj7igJQ8L3RkPjwvdHI+PC90Zm9vdD48L3RhYmxlPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pgo8ZGl2IGNsYXNzPSJtb3ZlcmxheSBoaWRkZW4iIGlkPSJkdXBNb2RhbCI+PGRpdiBjbGFzcz0ibWJveCI+PGRpdiBjbGFzcz0ibWhkciI+PGRpdiBjbGFzcz0ibXRpdGxlIj48aSBjbGFzcz0iZmFzIGZhLWJvbHQiPjwvaT4gRHVwbGlxdWVyIGxhIHNlbWFpbmU8L2Rpdj48YnV0dG9uIGNsYXNzPSJtY2xvc2UiIG9uY2xpY2s9ImNsb3NlTW9kYWwoJ2R1cE1vZGFsJykiPjxpIGNsYXNzPSJmYXMgZmEtdGltZXMiPjwvaT48L2J1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPSJtYm9keSI+PHAgc3R5bGU9Im1hcmdpbi1ib3R0b206MTBweDtjb2xvcjp2YXIoLS1tdXRlZCk7Zm9udC1zaXplOi44M3JlbSI+RGF0ZSBkYW5zIGxhIHNlbWFpbmUgY2libGUgOjwvcD48aW5wdXQgdHlwZT0iZGF0ZSIgaWQ9ImR1cERhdGUiIGNsYXNzPSJmYyIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTJweCI+PGRpdiBzdHlsZT0iYmFja2dyb3VuZDojZmZmNWY1O2JvcmRlcjoxcHggc29saWQgI2ZjYTVhNTtib3JkZXItcmFkaXVzOjhweDtwYWRkaW5nOjlweCAxM3B4O2ZvbnQtc2l6ZTouNzhyZW07Y29sb3I6I2I5MWMxYzttYXJnaW4tYm90dG9tOjE2cHgiPjxpIGNsYXNzPSJmYXMgZmEtZXhjbGFtYXRpb24tdHJpYW5nbGUiPjwvaT4gw4ljcmFzZSBsZXMgZG9ubsOpZXMgZGUgbGEgc2VtYWluZSBjaWJsZSAhPC9kaXY+PGRpdiBzdHlsZT0iZGlzcGxheTpmbGV4O2dhcDoxMHB4O2p1c3RpZnktY29udGVudDpmbGV4LWVuZCI+PGJ1dHRvbiBjbGFzcz0iYnRuIGJ0bi1naG9zdCIgb25jbGljaz0iY2xvc2VNb2RhbCgnZHVwTW9kYWwnKSI+QW5udWxlcjwvYnV0dG9uPjxidXR0b24gY2xhc3M9ImJ0biBidG4tcHJpbSIgb25jbGljaz0iY29uZmlybUR1cCgpIj48aSBjbGFzcz0iZmFzIGZhLWNoZWNrIj48L2k+IENvbmZpcm1lcjwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pgo8ZGl2IGNsYXNzPSJtb3ZlcmxheSBoaWRkZW4iIGlkPSJ0b29sc01vZGFsIj48ZGl2IGNsYXNzPSJtYm94Ij48ZGl2IGNsYXNzPSJtaGRyIj48ZGl2IGNsYXNzPSJtdGl0bGUiPjxpIGNsYXNzPSJmYXMgZmEtY29nIj48L2k+IEFjdGlvbnM8L2Rpdj48YnV0dG9uIGNsYXNzPSJtY2xvc2UiIG9uY2xpY2s9ImNsb3NlTW9kYWwoJ3Rvb2xzTW9kYWwnKSI+PGkgY2xhc3M9ImZhcyBmYS10aW1lcyI+PC9pPjwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9Im1ib2R5IiBzdHlsZT0iZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OXB4Ij48YnV0dG9uIGNsYXNzPSJidG4gYnRuLWdob3N0IGJ0bi1ibGsiIG9uY2xpY2s9ImNsb3NlTW9kYWwoJ3Rvb2xzTW9kYWwnKTtjb25maXJtMignRWZmYWNlciBsZSBwbGFubmluZyBkZSBjZXR0ZSBzZW1haW5lID8nLGNsZWFyQ3VycmVudFdlZWssJ/Cfp7knKSI+PGkgY2xhc3M9ImZhcyBmYS1lcmFzZXIiPjwvaT4gRWZmYWNlciBsYSBzZW1haW5lPC9idXR0b24+PGJ1dHRvbiBjbGFzcz0iYnRuIGJ0bi1naG9zdCBidG4tYmxrIiBvbmNsaWNrPSJjbG9zZU1vZGFsKCd0b29sc01vZGFsJyk7b3Blbk1vZGFsKCdkdXBNb2RhbCcpIj48aSBjbGFzcz0iZmFzIGZhLWJvbHQiPjwvaT4gRHVwbGlxdWVyIGxhIHNlbWFpbmU8L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJidG4gYnRuLWdob3N0IGJ0bi1ibGsiIG9uY2xpY2s9ImNsb3NlTW9kYWwoJ3Rvb2xzTW9kYWwnKTtleHBvcnREYXRhKCkiPjxpIGNsYXNzPSJmYXMgZmEtZG93bmxvYWQiPjwvaT4gRXhwb3J0ZXIgbGVzIGRvbm7DqWVzPC9idXR0b24+PGJ1dHRvbiBjbGFzcz0iYnRuIGJ0bi1naG9zdCBidG4tYmxrIiBvbmNsaWNrPSJjbG9zZU1vZGFsKCd0b29sc01vZGFsJyk7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltcG9ydElucHV0JykuY2xpY2soKSI+PGkgY2xhc3M9ImZhcyBmYS11cGxvYWQiPjwvaT4gSW1wb3J0ZXIgZGVzIGRvbm7DqWVzPC9idXR0b24+PGJ1dHRvbiBjbGFzcz0iYnRuIGJ0bi1naG9zdCBidG4tYmxrIiBvbmNsaWNrPSJjbG9zZU1vZGFsKCd0b29sc01vZGFsJyk7d2luZG93LnByaW50KCkiPjxpIGNsYXNzPSJmYXMgZmEtcHJpbnQiPjwvaT4gSW1wcmltZXIgLyBQREY8L2J1dHRvbj48YnV0dG9uIGNsYXNzPSJidG4gYnRuLWVyciBidG4tYmxrIiBzdHlsZT0ibWFyZ2luLXRvcDo2cHgiIG9uY2xpY2s9ImNsb3NlTW9kYWwoJ3Rvb2xzTW9kYWwnKTtjb25maXJtMignRWZmYWNlciBUT1VURVMgbGVzIGRvbm7DqWVzIGTDqWZpbml0aXZlbWVudCA/JyxyZXNldERhdGEsJ/Cfl5HvuI8nKSI+PGkgY2xhc3M9ImZhcyBmYS10cmFzaCI+PC9pPiBSw6lpbml0aWFsaXNlciB0b3V0PC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+CjxkaXYgY2xhc3M9ImNmbS13cmFwIGhpZGRlbiIgaWQ9ImNmbU92ZXJsYXkiPjxkaXYgY2xhc3M9ImNmbS1ib3giPjxkaXYgY2xhc3M9ImNmbS1pY29uIiBpZD0iY2ZtSWNvbiI+4pqg77iPPC9kaXY+PGRpdiBjbGFzcz0iY2ZtLW1zZyIgaWQ9ImNmbU1zZyI+w4p0ZXMtdm91cyBzw7tyID88L2Rpdj48ZGl2IGNsYXNzPSJjZm0tYWN0cyI+PGJ1dHRvbiBjbGFzcz0iYnRuIGJ0bi1naG9zdCIgb25jbGljaz0iY2xvc2VDb25maXJtKGZhbHNlKSI+QW5udWxlcjwvYnV0dG9uPjxidXR0b24gY2xhc3M9ImJ0biBidG4tcHJpbSIgb25jbGljaz0iY2xvc2VDb25maXJtKHRydWUpIj5Db25maXJtZXI8L2J1dHRvbj48L2Rpdj48L2Rpdj48L2Rpdj4KPHNjcmlwdD4KY29uc3QgTUlTU0lPTlM9W3t2YWw6Ikdlc3RSYXlvbiIsbGFiZWw6Ikdlc3RSYXlvbiIsY2xzOiJtLWdlc3RyYXlvbiJ9LHt2YWw6IkFjdHViIixsYWJlbDoiQWN0dWIiLGNsczoibS1hY3R1YiJ9LHt2YWw6IkNvbW1lcmNlIixsYWJlbDoiQ29tbWVyY2UiLGNsczoibS1jb21tZXJjZSJ9LHt2YWw6IlJlYUltcGxhbnQiLGxhYmVsOiJSw6lhIEltcGxhbnQiLGNsczoibS1yZWFpbXBsYW50In0se3ZhbDoiQ2Fpc3NlIixsYWJlbDoiQ2Fpc3NlIixjbHM6Im0tY2Fpc3NlIn0se3ZhbDoiTXV0IixsYWJlbDoiTXV0IixjbHM6Im0tbXV0In0se3ZhbDoiRGVjaGFyZyIsbGFiZWw6IkRlY2hhcmciLGNsczoibS1kZWNoYXJnIn0se3ZhbDoiQWlkZVNBViIsbGFiZWw6IkFpZGUgU0FWIixjbHM6Im0tYWlkZXNhdiJ9LHt2YWw6IkFpZGVDYWlzc2UiLGxhYmVsOiJBaWRlIENhaXNzZSIsY2xzOiJtLWFpZGVjYWlzc2UifSx7dmFsOiJJbnZlbnRhaXJlIixsYWJlbDoiSW52ZW50YWlyZSIsY2xzOiJtLWludmVudGFpcmUifSx7dmFsOiJWQUQiLGxhYmVsOiJWQUQiLGNsczoibS12YWQifSx7dmFsOiJTQVYiLGxhYmVsOiJTQVYiLGNsczoibS1zYXYifSx7dmFsOiJMaXZyYWlzb24iLGxhYmVsOiJMaXZyYWlzb24iLGNsczoibS1saXZyYWlzb24ifV07CmNvbnN0IFNPPXtzQU06JzA5OjQ1JyxlQU06JzEyOjAwJyxzUE06JzE0OjAwJyxlUE06JzE4OjAwJyxtMTonUmVhSW1wbGFudCd9Owpjb25zdCBTQz17c0FNOicxMDozMCcsZUFNOicxMzowMCcsc1BNOicxNDowMCcsZVBNOicxOTowMCcsbTE6J0NvbW1lcmNlJ307CmNvbnN0IFNDTT17c0FNOicwOTo0NScsZUFNOicxMjowMCcsc1BNOicxNDowMCcsZVBNOicxODozMCcsbTE6J0NhaXNzZSd9Owpjb25zdCBTQ1M9e3NBTTonMTA6MzAnLGVBTTonMTM6MDAnLHNQTTonMTQ6MDAnLGVQTTonMTk6MTUnLG0xOidDYWlzc2UnfTsKY29uc3QgVl9PUEVOMkE9e3NBTTonMTA6MDAnLGVBTTonMTM6MDAnLHNQTTonMTQ6MDAnLGVQTTonMTg6MzAnLG0xOidBY3R1Yid9Owpjb25zdCBWX09QRU4yQj17c0FNOicxMDoxNScsZUFNOicxMzowMCcsc1BNOicxNDowMCcsZVBNOicxODozMCcsbTE6J0FjdHViJ307CmNvbnN0IFZfQ0xPU0UyPXtzQU06JzExOjAwJyxlQU06JzEzOjAwJyxzUE06JzE0OjAwJyxlUE06JzE5OjAwJyxtMTonQ29tbWVyY2UnfTsKY29uc3QgVl9NSUQ9e3NBTTonMTA6MDAnLGVBTTonMTI6MzAnLHNQTTonMTQ6MDAnLGVQTTonMTg6MDAnLG0xOidHZXN0UmF5b24nfTsKY29uc3QgQ19NSUQ9e3NBTTonMTA6MDAnLGVBTTonMTI6MzAnLHNQTTonMTQ6MDAnLGVQTTonMTg6MzAnLG0xOidDYWlzc2UnfTsKY29uc3QgUEVBS19EQVlTPVs0LDUsNl07CmNvbnN0IEtFWT0ncGxhbm5pbmdGODkwX3YyOCc7CmxldCBEPUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oS0VZKSl8fHtlbXBsb3llZXM6W10sc2NoZWR1bGU6e30sYWJzZW5jZXM6W119OwpsZXQgY3VyRGF0ZT1uZXcgRGF0ZSgpOwpsZXQgY2xpcGJvYXJkPW51bGw7CmxldCBjZm1DYj1udWxsOwpjb25zdCBnZXRNb25kYXk9ZD0+e2Q9bmV3IERhdGUoZCk7Y29uc3QgZGF5PWQuZ2V0RGF5KCksZGlmZj1kLmdldERhdGUoKS1kYXkrKGRheT09PTA/LTY6MSk7cmV0dXJuIG5ldyBEYXRlKGQuc2V0RGF0ZShkaWZmKSl9Owpjb25zdCBmSXNvPWQ9PmQudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdOwpjb25zdCBmRnI9KGQsbyk9PmQudG9Mb2NhbGVEYXRlU3RyaW5nKCdmci1GUicsbyk7CmNvbnN0IGZITT1tPT57aWYoaXNOYU4obSl8fG08MClyZXR1cm4nMGgwMCc7Y29uc3QgaD1NYXRoLmZsb29yKG0vNjApLG1uPU1hdGgucm91bmQobSU2MCk7cmV0dXJuIGgrJ2gnKyhtbjwxMD8nMCcrbW46bW4pfTsKZnVuY3Rpb24gY2FsY01pbnMoZCl7Y29uc3QgZz10PT57aWYoIXQpcmV0dXJuIDA7Y29uc3RbaCxtXT10LnNwbGl0KCc6JykubWFwKE51bWJlcik7cmV0dXJuIGgqNjArbX07bGV0IGE9MCxwPTA7aWYoZC5zdGFydEFNJiZkLmVuZEFNKWE9TWF0aC5tYXgoMCxnKGQuZW5kQU0pLWcoZC5zdGFydEFNKSk7aWYoZC5zdGFydFBNJiZkLmVuZFBNKXA9TWF0aC5tYXgoMCxnKGQuZW5kUE0pLWcoZC5zdGFydFBNKSk7bGV0IHQ9YStwO2lmKGQuYnJlYWsmJnQ+MTApdC09MTA7cmV0dXJuIHR9CmZ1bmN0aW9uIHNhdmUoKXtsb2NhbFN0b3JhZ2Uuc2V0SXRlbShLRVksSlNPTi5zdHJpbmdpZnkoRCkpO3JlbmRlcigpfQpmdW5jdGlvbiB0b2FzdChtc2csdHlwZT0naW5mbycsbXM9MzIwMCl7Y29uc3QgaWNvbnM9e2luZm86J2luZm8tY2lyY2xlJyxzdWNjZXNzOidjaGVjay1jaXJjbGUnLGRhbmdlcjonZXhjbGFtYXRpb24tY2lyY2xlJyx3YXJuaW5nOidleGNsYW1hdGlvbi10cmlhbmdsZSd9O2NvbnN0IGVsPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO2VsLmNsYXNzTmFtZT0ndG9hc3QgJyt0eXBlO2VsLmlubmVySFRNTD0nPGkgY2xhc3M9ImZhcyBmYS0nKyhpY29uc1t0eXBlXXx8J2luZm8tY2lyY2xlJykrJyI+PC9pPiAnK21zZztkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3RXcmFwJykuYXBwZW5kQ2hpbGQoZWwpO3NldFRpbWVvdXQoKCk9PntlbC5jbGFzc0xpc3QuYWRkKCdybScpO3NldFRpbWVvdXQoKCk9PmVsLnJlbW92ZSgpLDQwMCl9LG1zKX0KZnVuY3Rpb24gY29uZmlybTIobXNnLGNiLGljb249J+KaoO+4jycpe2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZm1JY29uJykudGV4dENvbnRlbnQ9aWNvbjtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2ZtTXNnJykudGV4dENvbnRlbnQ9bXNnO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZm1PdmVybGF5JykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7Y2ZtQ2I9Y2J9CmZ1bmN0aW9uIGNsb3NlQ29uZmlybShvayl7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NmbU92ZXJsYXknKS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtpZihvayYmY2ZtQ2IpY2ZtQ2IoKTtjZm1DYj1udWxsfQpmdW5jdGlvbiBvcGVuTW9kYWwoaWQpe2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKX0KZnVuY3Rpb24gY2xvc2VNb2RhbChpZCl7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpfQpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZT0+e2lmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW92ZXJsYXknKSllLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKX0pOwpsZXQgdHhTdGFydD0wOwpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGJsV3JhcCcpLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLGU9Pnt0eFN0YXJ0PWUudG91Y2hlc1swXS5jbGllbnRYfSx7cGFzc2l2ZTp0cnVlfSk7CmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YmxXcmFwJykuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLGU9Pntjb25zdCBkeD1lLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgtdHhTdGFydDtpZihNYXRoLmFicyhkeCk+NzUpY2hhbmdlV2VlayhkeDwwPzE6LTEpfSx7cGFzc2l2ZTp0cnVlfSk7CmZ1bmN0aW9uIHJlbmRlcigpe2NvbnN0IG1vbmRheT1nZXRNb25kYXkoY3VyRGF0ZSk7Y29uc3QgZGF5cz1bXTtmb3IobGV0IGk9MDtpPDc7aSsrKXtjb25zdCBkPW5ldyBEYXRlKG1vbmRheSk7ZC5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkraSk7ZGF5cy5wdXNoKGQpfWNvbnN0IHRvZGF5U3RyPWZJc28obmV3IERhdGUoKSk7Y29uc3Qgcz1mRnIoZGF5c1swXSx7ZGF5OidudW1lcmljJyxtb250aDonc2hvcnQnfSksZT1mRnIoZGF5c1s2XSx7ZGF5OidudW1lcmljJyxtb250aDonc2hvcnQnLHllYXI6JzItZGlnaXQnfSk7Y29uc3Qgd2tUeHQ9J1NlbWFpbmUgZHUgJytzKycgYXUgJytlO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWVrVGl0bGUnKS50ZXh0Q29udGVudD13a1R4dDtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJudFdlZWsnKS50ZXh0Q29udGVudD13a1R4dDtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xpcFN0YXR1cycpLmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnLCEhY2xpcGJvYXJkKTtjb25zdCBoUj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaFJvdycpO2hSLmlubmVySFRNTD0nPHRoIGNsYXNzPSJ0aC1lbXAiPkNvbGxhYm9yYXRldXI8L3RoPjx0aCBjbGFzcz0idGgtdG90Ij5Ub3RhbDwvdGg+JztkYXlzLmZvckVhY2goZD0+e2NvbnN0IGlzVD1mSXNvKGQpPT09dG9kYXlTdHI7aFIuaW5uZXJIVE1MKz0nPHRoIGNsYXNzPSJ0aC1kYXknKyhpc1Q/JyB0aC10b2RheSc6JycpKyciPicrZkZyKGQse3dlZWtkYXk6J3Nob3J0JyxkYXk6J251bWVyaWMnLG1vbnRoOidzaG9ydCd9KSsnPC90aD4nfSk7Y29uc3QgdEI9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BCb2R5Jyk7dEIuaW5uZXJIVE1MPScnO2lmKCFELmVtcGxveWVlcy5sZW5ndGgpe3RCLmlubmVySFRNTD0nPHRyPjx0ZCBjb2xzcGFuPSInKyhkYXlzLmxlbmd0aCsyKSsnIiBjbGFzcz0iZW1wdHktdGQiPjxpIGNsYXNzPSJmYXMgZmEtdXNlcnMiPjwvaT48cD5BdWN1biBzYWxhcmnDqS4gQWpvdXRleiBkZXMgY29sbGFib3JhdGV1cnMgcG91ciBjb21tZW5jZXIuPC9wPjxidXR0b24gY2xhc3M9ImJ0biBidG4tb3JnIiBvbmNsaWNrPSJvcGVuRW1wTW9kYWwobnVsbCkiPjxpIGNsYXNzPSJmYXMgZmEtdXNlci1wbHVzIj48L2k+IEFqb3V0ZXIgdW4gc2FsYXJpw6k8L2J1dHRvbj48L3RkPjwvdHI+JztyZW5kZXJGb290KGRheXMpO3JldHVybn1jb25zdCB2aXNpYmxlRW1wcz1pc01hbmFnZXIoKT9ELmVtcGxveWVlczpELmVtcGxveWVlcy5maWx0ZXIoZT0+ZS5pZD09PShELnNlc3Npb24mJkQuc2Vzc2lvbi5lbXBJZCkpO2lmKCF2aXNpYmxlRW1wcy5sZW5ndGgpe3RCLmlubmVySFRNTD0nPHRyPjx0ZCBjb2xzcGFuPSInKyhkYXlzLmxlbmd0aCsyKSsnIiBjbGFzcz0iZW1wdHktdGQiPjxpIGNsYXNzPSJmYXMgZmEtdXNlci1zbGFzaCI+PC9pPjxwPkF1Y3VuIHBsYW5uaW5nIHRyb3V2w6kgcG91ciB2b3RyZSBzZXNzaW9uLjwvcD48L3RkPjwvdHI+JztyZW5kZXJGb290KGRheXMpO3JldHVybn12aXNpYmxlRW1wcy5mb3JFYWNoKGVtcD0+e2NvbnN0IHRyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7bGV0IHdNaW5zPTAsY2VsbHM9Jyc7ZGF5cy5mb3JFYWNoKGQ9Pntjb25zdCBkaz1mSXNvKGQpLGs9ZW1wLmlkKydfJytkayxpc1Q9ZGs9PT10b2RheVN0cjtsZXQgZGF0YT1ELnNjaGVkdWxlW2tdO2lmKCFkYXRhKXtjb25zdCBkbj1kLmdldERheSgpO2NvbnN0IGFicz0oRC5hYnNlbmNlc3x8W10pLmZpbmQoYT0+YS5lbXBJZD09PWVtcC5pZCYmZGs+PWEuc3RhcnQmJmRrPD1hLmVuZCk7bGV0IHRwbD1udWxsO2lmKGVtcC5maXhlZFNjaGVkdWxlQXx8ZW1wLmZpeGVkU2NoZWR1bGVCKXt0cGw9Z2V0V2Vla051bWJlcihkKSUyPT09MT8oZW1wLmZpeGVkU2NoZWR1bGVBfHxlbXAuZml4ZWRTY2hlZHVsZUIpOihlbXAuZml4ZWRTY2hlZHVsZUJ8fGVtcC5maXhlZFNjaGVkdWxlQSl9ZWxzZSBpZihlbXAuZml4ZWRTY2hlZHVsZSl0cGw9ZW1wLmZpeGVkU2NoZWR1bGU7aWYoYWJzKWRhdGE9e3R5cGU6YWJzLnR5cGV9O2Vsc2UgaWYodHBsJiZ0cGxbZG5dKXtkYXRhPXsuLi50cGxbZG5dfTtELnNjaGVkdWxlW2tdPWRhdGF9ZWxzZSBpZihlbXAucmVzdERheXMmJmVtcC5yZXN0RGF5cy5pbmNsdWRlcyhkbikpZGF0YT17dHlwZTonUmVwb3MnfTtlbHNlIGlmKGVtcC5yb2xlPT09J0xpdnJldXIgUG9seXZhbGVudCcpZGF0YT17dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MDAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J0xpdnJhaXNvbicsbTI6JycsbTM6Jyd9O2Vsc2UgZGF0YT17dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonJyxlbmRBTTonJyxzdGFydFBNOicnLGVuZFBNOicnLGJyZWFrOmZhbHNlLG0xOicnLG0yOicnLG0zOicnfX1jb25zdCBkTWlucz1kYXRhLnR5cGU9PT0nVHJhdmFpbCc/Y2FsY01pbnMoZGF0YSk6MDtpZihkYXRhLnR5cGU9PT0nVHJhdmFpbCcpd01pbnMrPWRNaW5zO2NvbnN0IGJnPWRhdGEudHlwZT09PSdSZXBvcyc/J3JwJzpkYXRhLnR5cGU9PT0nTWFsYWRpZSc/J21hbCc6ZGF0YS50eXBlPT09J0bDqXJpw6knPydmZXInOihkYXRhLnR5cGU9PT0nVmFjYW5jZXMnfHxkYXRhLnR5cGU9PT0nUlRUJ3x8ZGF0YS50eXBlPT09J0Zvcm1hdGlvbicpPyd2YWMnOid3ayc7Y29uc3QgaXNXPWRhdGEudHlwZT09PSdUcmF2YWlsJztjb25zdCBtU2VsPSh2YWwsZmllbGQpPT57bGV0IG9wdHM9JzxvcHRpb24gdmFsdWU9IiI+4oCUPC9vcHRpb24+JyxjbHM9Jyc7TUlTU0lPTlMuZm9yRWFjaChtPT57Y29uc3Qgcz12YWw9PT1tLnZhbDtpZihzKWNscz1tLmNscztvcHRzKz0nPG9wdGlvbiB2YWx1ZT0iJyttLnZhbCsnIicrKHM/JyBzZWxlY3RlZCc6JycpKyc+JyttLmxhYmVsKyc8L29wdGlvbj4nfSk7cmV0dXJuJzxzZWxlY3QgY2xhc3M9Im1zZWwgJytjbHMrJyIgb25jaGFuZ2U9InVwZE1pc3Npb24oJytlbXAuaWQrIiwnIitkaysiJywnIitmaWVsZCsiJyx0aGlzKVwiPiIrb3B0cysnPC9zZWxlY3Q+J307bGV0IHByZXNldHM9JzxvcHRpb24gdmFsdWU9IiI+UmFwaWRl4oCmPC9vcHRpb24+JztpZihlbXAucm9sZT09PSdHw6lyYW50JylwcmVzZXRzKz0nPG9wdGlvbiB2YWx1ZT0iR19SSCI+Ukg8L29wdGlvbj48b3B0aW9uIHZhbHVlPSJHX0NPTVBUQSI+Q29tcHRhPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iR19WRU5URSI+VmVudGVzPC9vcHRpb24+JztlbHNlIGlmKGVtcC5yb2xlIT09J0xpdnJldXIgUG9seXZhbGVudCcpcHJlc2V0cys9JzxvcHRpb24gdmFsdWU9IlQxIj5UMSAoOWg0NSk8L29wdGlvbj48b3B0aW9uIHZhbHVlPSJUMiI+VDIgKDEwaCk8L29wdGlvbj48b3B0aW9uIHZhbHVlPSJUMyI+VDMgKDEwaDMwKTwvb3B0aW9uPic7Y2VsbHMrPSc8dGQgY2xhc3M9InBjZWxsICcrYmcrKGlzVD8nIHRvZGF5JzonJykrJyI+PGRpdiBjbGFzcz0iZGF5LWFjdHMiPjxkaXYgY2xhc3M9ImRhY3QiIG9uY2xpY2s9ImNvcHlEYXkoJytlbXAuaWQrIiwnIitkaysiJylcIiB0aXRsZT1cIkNvcGllclwiPjxpIGNsYXNzPVwiZmFzIGZhLWNvcHlcIj48L2k+PC9kaXY+IisoY2xpcGJvYXJkPyc8ZGl2IGNsYXNzPSJkYWN0IiBvbmNsaWNrPSJwYXN0ZURheSgnK2VtcC5pZCsiLCciK2RrKyInKVwiIHRpdGxlPVwiQ29sbGVyXCI+PGkgY2xhc3M9XCJmYXMgZmEtcGFzdGVcIj48L2k+PC9kaXY+IjonJykrJzwvZGl2PjxzZWxlY3QgY2xhc3M9InN0YXQtc2VsIiBvbmNoYW5nZT0idXBkU2NoZWQoJytlbXAuaWQrIiwnIitkaysiJywndHlwZScsdGhpcy52YWx1ZSlcIj48b3B0aW9uIHZhbHVlPVwiVHJhdmFpbFwiIisoZGF0YS50eXBlPT09J1RyYXZhaWwnPycgc2VsZWN0ZWQnOicnKSsnPlRyYXZhaWw8L29wdGlvbj48b3B0aW9uIHZhbHVlPSJSZXBvcyInKyhkYXRhLnR5cGU9PT0nUmVwb3MnPycgc2VsZWN0ZWQnOicnKSsnPlJlcG9zPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iRsOpcmnDqSInKyhkYXRhLnR5cGU9PT0nRsOpcmnDqSc/JyBzZWxlY3RlZCc6JycpKyc+RsOpcmnDqTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9IlZhY2FuY2VzIicrKGRhdGEudHlwZT09PSdWYWNhbmNlcyc/JyBzZWxlY3RlZCc6JycpKyc+Q1A8L29wdGlvbj48b3B0aW9uIHZhbHVlPSJSVFQiJysoZGF0YS50eXBlPT09J1JUVCc/JyBzZWxlY3RlZCc6JycpKyc+UlRUPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iTWFsYWRpZSInKyhkYXRhLnR5cGU9PT0nTWFsYWRpZSc/JyBzZWxlY3RlZCc6JycpKyc+TWFsYWRpZTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9IkZvcm1hdGlvbiInKyhkYXRhLnR5cGU9PT0nRm9ybWF0aW9uJz8nIHNlbGVjdGVkJzonJykrJz5Gb3JtYXRpb248L29wdGlvbj48L3NlbGVjdD4nKyhpc1c/JzxkaXY+PGRpdiBjbGFzcz0ibWlzc2lvbnMtd3JhcCI+JyttU2VsKGRhdGEubTEsJ20xJykrbVNlbChkYXRhLm0yLCdtMicpK21TZWwoZGF0YS5tMywnbTMnKSsnPC9kaXY+PHNlbGVjdCBjbGFzcz0icHJlc2V0LXNlbCIgb25jaGFuZ2U9ImFwcGx5UHJlc2V0KCcrZW1wLmlkKyIsJyIrZGsrIicsdGhpcy52YWx1ZSlcIj4iK3ByZXNldHMrJzwvc2VsZWN0PjxkaXYgY2xhc3M9InRpbWVzLXJvdyI+PGlucHV0IHR5cGU9InRpbWUiIGNsYXNzPSJ0aW5wdXQiIHZhbHVlPSInKyhkYXRhLnN0YXJ0QU18fCcnKSsnIiBvbmNoYW5nZT0idXBkU2NoZWQoJytlbXAuaWQrIiwnIitkaysiJywnc3RhcnRBTScsdGhpcy52YWx1ZSlcIj48aW5wdXQgdHlwZT1cInRpbWVcIiBjbGFzcz1cInRpbnB1dFwiIHZhbHVlPVwiIisoZGF0YS5lbmRBTXx8JycpKyciIG9uY2hhbmdlPSJ1cGRTY2hlZCgnK2VtcC5pZCsiLCciK2RrKyInLCdlbmRBTScsdGhpcy52YWx1ZSlcIj48L2Rpdj48ZGl2IGNsYXNzPVwidGltZXMtcm93XCI+PGlucHV0IHR5cGU9XCJ0aW1lXCIgY2xhc3M9XCJ0aW5wdXRcIiB2YWx1ZT1cIiIrKGRhdGEuc3RhcnRQTXx8JycpKyciIG9uY2hhbmdlPSJ1cGRTY2hlZCgnK2VtcC5pZCsiLCciK2RrKyInLCdzdGFydFBNJyx0aGlzLnZhbHVlKVwiPjxpbnB1dCB0eXBlPVwidGltZVwiIGNsYXNzPVwidGlucHV0XCIgdmFsdWU9XCIiKyhkYXRhLmVuZFBNfHwnJykrJyIgb25jaGFuZ2U9InVwZFNjaGVkKCcrZW1wLmlkKyIsJyIrZGsrIicsJ2VuZFBNJyx0aGlzLnZhbHVlKVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJjZWxsLWZvb3RcIj48bGFiZWwgY2xhc3M9XCJicmstd3JhcFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImJyay1jYlwiICIrKGRhdGEuYnJlYWs/J2NoZWNrZWQnOicnKSsnIG9uY2hhbmdlPSJ1cGRTY2hlZCgnK2VtcC5pZCsiLCciK2RrKyInLCdicmVhaycsdGhpcy5jaGVja2VkKVwiPjxzcGFuIGNsYXNzPVwiYnJrLWxibFwiPlBhdXNlPC9zcGFuPjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJkYmFkZ2VcIj4iK2ZITShkTWlucykrJzwvc3Bhbj48L2Rpdj48L2Rpdj4nOicnKSsnPC90ZD4nfSk7Y29uc3QgY29udHJhY3RIPWdldENvbnRyYWN0SG91cnMoZW1wLG1vbmRheSk7Y29uc3QgY01pbj1jb250cmFjdEgqNjA7Y29uc3Qgd2tWYXI9Z2V0V2Vla1ZhcmlhbnRMYWJlbChlbXAsbW9uZGF5KTtsZXQgZGlmZj0nJztpZih3TWlucz5jTWluKWRpZmY9JzxkaXYgY2xhc3M9InRvdC1kIHN1cCI+KycrZkhNKHdNaW5zLWNNaW4pKyc8L2Rpdj4nO2Vsc2UgaWYod01pbnM8Y01pbilkaWZmPSc8ZGl2IGNsYXNzPSJ0b3QtZCBsb3ciPuKIkicrZkhNKGNNaW4td01pbnMpKyc8L2Rpdj4nO2Vsc2UgZGlmZj0nPGRpdiBjbGFzcz0idG90LWQgb2siPuKckyBPSzwvZGl2Pic7dHIuaW5uZXJIVE1MPSc8dGQgY2xhc3M9InRkLWVtcCI+PGRpdiBzdHlsZT0iZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQiPjxkaXYgY2xhc3M9ImVtcC1uYW1lIj4nK2VtcC5maXJzdE5hbWUrKHdrVmFyPycgPHNwYW4gc3R5bGU9ImZvbnQtc2l6ZTouNTVyZW07YmFja2dyb3VuZDp2YXIoLS1vcmFuZ2UpO2NvbG9yOiNmZmY7cGFkZGluZzoxcHggNXB4O2JvcmRlci1yYWRpdXM6M3B4O2ZvbnQtd2VpZ2h0OjgwMDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGUiPlMuJyt3a1ZhcisnPC9zcGFuPic6JycpKyc8L2Rpdj48YnV0dG9uIGNsYXNzPSJlbXAtZWRpdCIgb25jbGljaz0ib3BlbkVtcE1vZGFsKCcrZW1wLmlkKycpIj48aSBjbGFzcz0iZmFzIGZhLXBlbiI+PC9pPjwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9ImVtcC1tZXRhIj48c3BhbiBjbGFzcz0iZW1wLWZjIj4nKyhlbXAuZmNJZHx8J04vQScpKyc8L3NwYW4+PHNwYW4gY2xhc3M9ImVtcC1iYWRnZSI+JytlbXAucm9sZSsnPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9InNpZy1ib3giPjwvZGl2PjxkaXYgY2xhc3M9InNpZy1sYmwiPlZpc2E8L2Rpdj48L3RkPjx0ZCBjbGFzcz0idGQtdG90Ij48ZGl2IGNsYXNzPSJ0b3QtaCI+JytmSE0od01pbnMpKyc8L2Rpdj4nK2RpZmYrJzxkaXYgY2xhc3M9InRvdC1jIj4vJytjb250cmFjdEgrJ2g8L2Rpdj48L3RkPicrY2VsbHM7dEIuYXBwZW5kQ2hpbGQodHIpfSk7cmVuZGVyRm9vdChkYXlzKX0KZnVuY3Rpb24gcmVuZGVyRm9vdChkYXlzKXtjb25zdCBmPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwRm9vdCcpO2YuaW5uZXJIVE1MPScnO2NvbnN0IHRyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7dHIuaW5uZXJIVE1MPSc8dGQgY29sc3Bhbj0iMiIgc3R5bGU9InRleHQtYWxpZ246cmlnaHQ7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6LjY4cmVtIj5NQU5RVUFOVFM8L3RkPic7ZGF5cy5mb3JFYWNoKGQ9Pntjb25zdCBkaz1mSXNvKGQpO2NvbnN0IGZlcmllQ250PUQuZW1wbG95ZWVzLmZpbHRlcihlPT57Y29uc3QgeD1ELnNjaGVkdWxlW2UuaWQrJ18nK2RrXTtyZXR1cm4geCYmeC50eXBlPT09J0bDqXJpw6knfSkubGVuZ3RoO2NvbnN0IHdvcmtDbnQ9RC5lbXBsb3llZXMuZmlsdGVyKGU9Pntjb25zdCB4PUQuc2NoZWR1bGVbZS5pZCsnXycrZGtdO3JldHVybiB4JiZ4LnR5cGU9PT0nVHJhdmFpbCcmJih4LnN0YXJ0QU18fHguc3RhcnRQTSl9KS5sZW5ndGg7Y29uc3QgdGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtpZihmZXJpZUNudD4wJiZ3b3JrQ250PT09MCl7dGQuaW5uZXJIVE1MPSc8c3BhbiBzdHlsZT0iY29sb3I6IzYzNjZmMTtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOi43MnJlbSI+PGkgY2xhc3M9ImZhcyBmYS1mbGFnIj48L2k+IEpvdXIgZsOpcmnDqSDigJQgRmVybcOpPC9zcGFuPid9ZWxzZXtjb25zdCBhbD1jaGVja0Nvdihkayk7dGQuaW5uZXJIVE1MPWFsLmxlbmd0aD9hbC5tYXAoeD0+JzxzcGFuIGNsYXNzPSJhbHJ0Ij7imqAgJyt4Kyc8L3NwYW4+Jykuam9pbignJyk6JzxzcGFuIGNsYXNzPSJvay1pdCI+4pyTIE9LPC9zcGFuPid9dHIuYXBwZW5kQ2hpbGQodGQpfSk7Zi5hcHBlbmRDaGlsZCh0cil9CmZ1bmN0aW9uIGNoZWNrQ292KGRrKXtjb25zdCBkb3c9bmV3IERhdGUoZGspLmdldERheSgpO2NvbnN0IGlzUGVhaz1QRUFLX0RBWVMuaW5jbHVkZXMoZG93KTtsZXQgdjk0NT0wLHZPcGVuPTAsdkNsb3NlPTAsY09wZW49MCxjQ2xvc2U9MDtELmVtcGxveWVlcy5mb3JFYWNoKGVtcD0+e2NvbnN0IGQ9RC5zY2hlZHVsZVtlbXAuaWQrJ18nK2RrXTtpZighZHx8ZC50eXBlIT09J1RyYXZhaWwnKXJldHVybjtjb25zdCBpc1Y9ZW1wLnJvbGUuaW5jbHVkZXMoJ1ZlbmRldXInKXx8KGVtcC5yb2xlPT09J0fDqXJhbnQnJiYoZC5tMT09PSdDb21tZXJjZSd8fGQubTE9PT0nR2VzdFJheW9uJykpO2NvbnN0IGlzQz1lbXAucm9sZS5pbmNsdWRlcygnQ2Fpc3NpZXInKXx8ZW1wLnJvbGUuaW5jbHVkZXMoJ1NlcnZpY2VzJyk7aWYoaXNWKXtpZihkLnN0YXJ0QU09PT0nMDk6NDUnKXY5NDUrKztpZihkLnN0YXJ0QU0mJmQuc3RhcnRBTTw9JzEwOjE1Jyl2T3BlbisrO2lmKGQuZW5kUE0mJmQuZW5kUE0+PScxOTowMCcpdkNsb3NlKyt9aWYoaXNDKXtpZihkLnN0YXJ0QU09PT0nMDk6NDUnKWNPcGVuKys7aWYoZC5lbmRQTSYmZC5lbmRQTT49JzE5OjE1JyljQ2xvc2UrK319KTtjb25zdCBhPVtdO2lmKHY5NDU8MSlhLnB1c2goJ1ZlbmQuIDloNDUgcmVxdWlzJyk7aWYodk9wZW48MilhLnB1c2goJ1ZlbmQuIG91di4gJyt2T3BlbisnLzInKTtpZih2Q2xvc2U8KGlzUGVhaz8yOjEpKWEucHVzaCgnVmVuZC4gZmVybS4gJyt2Q2xvc2UrJy8nKyhpc1BlYWs/MjoxKSk7aWYoY09wZW48MSlhLnB1c2goJ0NhaXNzZSA5aDQ1Jyk7aWYoY0Nsb3NlPDEpYS5wdXNoKCdDYWlzc2UgMTloMTUnKTtyZXR1cm4gYX0KZnVuY3Rpb24gZ2V0T3JDcmVhdGUoaWQsZGspe2NvbnN0IGs9aWQrJ18nK2RrO2lmKCFELnNjaGVkdWxlW2tdKUQuc2NoZWR1bGVba109e3R5cGU6J1RyYXZhaWwnLHN0YXJ0QU06JycsZW5kQU06Jycsc3RhcnRQTTonJyxlbmRQTTonJyxicmVhazpmYWxzZSxtMTonJyxtMjonJyxtMzonJ307cmV0dXJuIGt9CmZ1bmN0aW9uIHVwZFNjaGVkKGlkLGRrLGZpZWxkLHZhbHVlKXtjb25zdCBrPWdldE9yQ3JlYXRlKGlkLGRrKTtELnNjaGVkdWxlW2tdW2ZpZWxkXT12YWx1ZTtzYXZlKCl9CmZ1bmN0aW9uIHVwZE1pc3Npb24oaWQsZGssZmllbGQsc2VsKXtjb25zdCB2YWw9c2VsLnZhbHVlLGs9Z2V0T3JDcmVhdGUoaWQsZGspO0Quc2NoZWR1bGVba11bZmllbGRdPXZhbDtjb25zdCBtPU1JU1NJT05TLmZpbmQoeD0+eC52YWw9PT12YWwpO3NlbC5jbGFzc05hbWU9J21zZWwgJysobT9tLmNsczonJyk7bG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLEpTT04uc3RyaW5naWZ5KEQpKTtjb25zdCBtb25kYXk9Z2V0TW9uZGF5KGN1ckRhdGUpLGRheXM9W107Zm9yKGxldCBpPTA7aTw3O2krKyl7Y29uc3QgZD1uZXcgRGF0ZShtb25kYXkpO2Quc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpK2kpO2RheXMucHVzaChkKX1yZW5kZXJGb290KGRheXMpfQpmdW5jdGlvbiBhcHBseVByZXNldChpZCxkayxwKXtpZighcClyZXR1cm47Y29uc3Qgaz1nZXRPckNyZWF0ZShpZCxkayk7aWYocC5zdGFydHNXaXRoKCdUJykpe2NvbnN0IHQ9cD09PSdUMSc/U086KHA9PT0nVDInP3tzQU06JzEwOjAwJyxlQU06JzEyOjMwJyxzUE06JzE0OjAwJyxlUE06JzE4OjMwJyxtMTonQWN0dWInfTpTQyk7T2JqZWN0LmFzc2lnbihELnNjaGVkdWxlW2tdLHtzdGFydEFNOnQuc0FNLGVuZEFNOnQuZUFNLHN0YXJ0UE06dC5zUE0sZW5kUE06dC5lUE0sbTE6dC5tMX0pfWVsc2UgaWYocC5zdGFydHNXaXRoKCdHXycpKXtPYmplY3QuYXNzaWduKEQuc2NoZWR1bGVba10se3N0YXJ0QU06JzA5OjAwJyxlbmRBTTonMTI6MDAnLHN0YXJ0UE06JzE0OjAwJyxlbmRQTTonMTg6MDAnfSk7RC5zY2hlZHVsZVtrXS5tMT1wPT09J0dfUkgnPydBaWRlU0FWJzpwPT09J0dfQ09NUFRBJz8nVkFEJzonQ29tbWVyY2UnfXNhdmUoKX0KZnVuY3Rpb24gY29weURheShpZCxkayl7Y29uc3QgZD1ELnNjaGVkdWxlW2lkKydfJytka107aWYoIWQpe3RvYXN0KCdBdWN1bmUgZG9ubsOpZSDDoCBjb3BpZXInLCd3YXJuaW5nJyk7cmV0dXJufWNsaXBib2FyZD1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGQpKTt0b2FzdCgnSm91cm7DqWUgY29wacOpZScsJ3N1Y2Nlc3MnKTtyZW5kZXIoKX0KZnVuY3Rpb24gcGFzdGVEYXkoaWQsZGspe2lmKCFjbGlwYm9hcmQpcmV0dXJuO0Quc2NoZWR1bGVbaWQrJ18nK2RrXT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNsaXBib2FyZCkpO3NhdmUoKTt0b2FzdCgnSm91cm7DqWUgY29sbMOpZScsJ3N1Y2Nlc3MnKX0KZnVuY3Rpb24gY2hhbmdlV2VlayhvKXtjdXJEYXRlLnNldERhdGUoY3VyRGF0ZS5nZXREYXRlKCkrbyo3KTtyZW5kZXIoKX0KZnVuY3Rpb24gY2xlYXJDdXJyZW50V2Vlaygpe2NvbnN0IG1vbmRheT1nZXRNb25kYXkoY3VyRGF0ZSk7Zm9yKGxldCBpPTA7aTw3O2krKyl7Y29uc3QgZD1uZXcgRGF0ZShtb25kYXkpO2Quc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpK2kpO2NvbnN0IGRrPWZJc28oZCksZG49ZC5nZXREYXkoKTtELmVtcGxveWVlcy5mb3JFYWNoKGVtcD0+e2NvbnN0IGs9ZW1wLmlkKydfJytkayxpc1I9ZW1wLnJlc3REYXlzJiZlbXAucmVzdERheXMuaW5jbHVkZXMoZG4pO2lmKGVtcC5yb2xlPT09J0xpdnJldXIgUG9seXZhbGVudCcpRC5zY2hlZHVsZVtrXT1pc1I/e3R5cGU6J1JlcG9zJyxzdGFydEFNOicnLGVuZEFNOicnLHN0YXJ0UE06JycsZW5kUE06JycsYnJlYWs6ZmFsc2UsbTE6JycsbTI6JycsbTM6Jyd9Ont0eXBlOidUcmF2YWlsJyxzdGFydEFNOicxMDowMCcsZW5kQU06JzEzOjAwJyxzdGFydFBNOicxNDowMCcsZW5kUE06JzE4OjAwJyxicmVhazpmYWxzZSxtMTonTGl2cmFpc29uJyxtMjonJyxtMzonJ307ZWxzZSBELnNjaGVkdWxlW2tdPWlzUj97dHlwZTonUmVwb3MnfTp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonJyxlbmRBTTonJyxzdGFydFBNOicnLGVuZFBNOicnLGJyZWFrOmZhbHNlLG0xOicnLG0yOicnLG0zOicnfX0pfXNhdmUoKTt0b2FzdCgnU2VtYWluZSBlZmZhY8OpZScsJ3N1Y2Nlc3MnKX0KZnVuY3Rpb24gYXV0b0Rpc3BhdGNoKCl7Y29uc3QgbW9uZGF5PWdldE1vbmRheShjdXJEYXRlKTtjb25zdCBkYXlzPVtdO2ZvcihsZXQgaT0wO2k8NztpKyspe2NvbnN0IGQ9bmV3IERhdGUobW9uZGF5KTtkLnNldERhdGUobW9uZGF5LmdldERhdGUoKStpKTtkYXlzLnB1c2goe2RhdGU6ZCxkazpmSXNvKGQpLGRvdzpkLmdldERheSgpLHBlYWs6UEVBS19EQVlTLmluY2x1ZGVzKGQuZ2V0RGF5KCkpfSl9Y29uc3Qgd01pbnM9e30sY01pbnM9e30sc0NvdW50PXt9O0QuZW1wbG95ZWVzLmZvckVhY2goZT0+e3dNaW5zW2UuaWRdPWNhbGNXZWVrTWlucyhlLmlkLG1vbmRheSk7Y01pbnNbZS5pZF09Z2V0Q29udHJhY3RIb3VycyhlLG1vbmRheSkqNjA7c0NvdW50W2UuaWRdPXtvcGVuOjAsY2xvc2U6MH19KTtkYXlzLmZvckVhY2goZGF5PT57RC5lbXBsb3llZXMuZm9yRWFjaChlbXA9Pntjb25zdCBkPUQuc2NoZWR1bGVbZW1wLmlkKydfJytkYXkuZGtdO2lmKCFkfHxkLnR5cGUhPT0nVHJhdmFpbCcpcmV0dXJuO2lmKGQuc3RhcnRBTSYmZC5zdGFydEFNPD0nMTA6MTUnKXNDb3VudFtlbXAuaWRdLm9wZW4rKztpZihkLmVuZFBNJiZkLmVuZFBNPj0nMTk6MDAnKXNDb3VudFtlbXAuaWRdLmNsb3NlKyt9KX0pO2Z1bmN0aW9uIHBpY2tDYW5kaWRhdGUoZGF5LHJvbGVUeXBlLHNsb3RLZXksc2hpZnREdXIpe2NvbnN0IGNhbmRzPUQuZW1wbG95ZWVzLmZpbHRlcihlPT57aWYoZS5yb2xlPT09J0xpdnJldXIgUG9seXZhbGVudCd8fGUucm9sZT09PSdTdGFnaWFpcmUnKXJldHVybiBmYWxzZTtpZighaXNBdmFpbChlLGRheS5kaykpcmV0dXJuIGZhbHNlO2xldCBtYXRjaD1mYWxzZTtpZihyb2xlVHlwZT09PSdWJyltYXRjaD1lLnJvbGUuaW5jbHVkZXMoJ1ZlbmRldXInKXx8ZS5yb2xlPT09J0fDqXJhbnQnO2lmKHJvbGVUeXBlPT09J0MnKW1hdGNoPWUucm9sZS5pbmNsdWRlcygnQ2Fpc3NpZXInKXx8ZS5yb2xlLmluY2x1ZGVzKCdTZXJ2aWNlcycpO2lmKCFtYXRjaClyZXR1cm4gZmFsc2U7aWYod01pbnNbZS5pZF0rc2hpZnREdXI+Y01pbnNbZS5pZF0rNjApcmV0dXJuIGZhbHNlO3JldHVybiB0cnVlfSk7Y2FuZHMuc29ydCgoYSxiKT0+e2NvbnN0IGdhcEE9Y01pbnNbYS5pZF0td01pbnNbYS5pZF0sZ2FwQj1jTWluc1tiLmlkXS13TWluc1tiLmlkXTtpZihNYXRoLmFicyhnYXBBLWdhcEIpPjYwKXJldHVybiBnYXBCLWdhcEE7cmV0dXJuIHNDb3VudFthLmlkXVtzbG90S2V5XS1zQ291bnRbYi5pZF1bc2xvdEtleV19KTtyZXR1cm4gY2FuZHNbMF18fG51bGx9ZnVuY3Rpb24gdHJ5QXNzaWduKGRheSxyb2xlVHlwZSxzbG90S2V5LHNoaWZ0KXtjb25zdCBkdXI9Y2FsY01pbnMoe3N0YXJ0QU06c2hpZnQuc0FNLGVuZEFNOnNoaWZ0LmVBTSxzdGFydFBNOnNoaWZ0LnNQTSxlbmRQTTpzaGlmdC5lUE0sYnJlYWs6ZmFsc2V9KTtjb25zdCBjYW5kPXBpY2tDYW5kaWRhdGUoZGF5LHJvbGVUeXBlLHNsb3RLZXksZHVyKTtpZighY2FuZClyZXR1cm4gZmFsc2U7YXNzaWduUyhjYW5kLmlkLGRheS5kayxzaGlmdCk7d01pbnNbY2FuZC5pZF0rPWR1cjtzQ291bnRbY2FuZC5pZF1bc2xvdEtleV0rKztyZXR1cm4gdHJ1ZX1jb25zdCBzb3J0ZWREYXlzPVsuLi5kYXlzXS5zb3J0KChhLGIpPT5iLnBlYWstYS5wZWFrKTtzb3J0ZWREYXlzLmZvckVhY2goZGF5PT57bGV0IGNvdj1hbmFseXplQyhkYXkuZGspO2lmKCFjb3Yudjk0NSl7dHJ5QXNzaWduKGRheSwnVicsJ29wZW4nLFNPKTtjb3Y9YW5hbHl6ZUMoZGF5LmRrKX1pZighY292LmNPcGVuKXt0cnlBc3NpZ24oZGF5LCdDJywnb3BlbicsU0NNKTtjb3Y9YW5hbHl6ZUMoZGF5LmRrKX1pZihjb3Yudk9wZW5Db3VudDwyKXt0cnlBc3NpZ24oZGF5LCdWJywnb3BlbicsZGF5LnBlYWs/Vl9PUEVOMkE6Vl9PUEVOMkIpO2Nvdj1hbmFseXplQyhkYXkuZGspfWlmKCFjb3YudkNsb3NlMSl7dHJ5QXNzaWduKGRheSwnVicsJ2Nsb3NlJyxTQyk7Y292PWFuYWx5emVDKGRheS5kayl9aWYoIWNvdi5jQ2xvc2Upe3RyeUFzc2lnbihkYXksJ0MnLCdjbG9zZScsU0NTKTtjb3Y9YW5hbHl6ZUMoZGF5LmRrKX1pZihkYXkucGVhayYmY292LnZDbG9zZUNvdW50PDIpe3RyeUFzc2lnbihkYXksJ1YnLCdjbG9zZScsVl9DTE9TRTIpfX0pO2xldCBjaGFuZ2VkPXRydWUsbG9vcHM9MDt3aGlsZShjaGFuZ2VkJiZsb29wczw4KXtjaGFuZ2VkPWZhbHNlO2xvb3BzKys7Y29uc3QgZGVmaWNpdHM9RC5lbXBsb3llZXMuZmlsdGVyKGU9PmUucm9sZSE9PSdMaXZyZXVyIFBvbHl2YWxlbnQnJiZlLnJvbGUhPT0nU3RhZ2lhaXJlJykubWFwKGU9Pih7ZSxnYXA6Y01pbnNbZS5pZF0td01pbnNbZS5pZF19KSkuZmlsdGVyKHg9PnguZ2FwPjI0MCkuc29ydCgoYSxiKT0+Yi5nYXAtYS5nYXApO2Zvcihjb25zdCB7ZX0gb2YgZGVmaWNpdHMpe2xldCBwbGFjZWQ9ZmFsc2U7Zm9yKGNvbnN0IGRheSBvZiBzb3J0ZWREYXlzKXtpZighaXNBdmFpbChlLGRheS5kaykpY29udGludWU7Y29uc3QgaXNWPWUucm9sZS5pbmNsdWRlcygnVmVuZGV1cicpfHxlLnJvbGU9PT0nR8OpcmFudCc7Y29uc3Qgc2hpZnQ9aXNWP1ZfTUlEOkNfTUlEO2NvbnN0IGR1cj1jYWxjTWlucyh7c3RhcnRBTTpzaGlmdC5zQU0sZW5kQU06c2hpZnQuZUFNLHN0YXJ0UE06c2hpZnQuc1BNLGVuZFBNOnNoaWZ0LmVQTSxicmVhazpmYWxzZX0pO2lmKHdNaW5zW2UuaWRdK2R1cjw9Y01pbnNbZS5pZF0rMzApe2Fzc2lnblMoZS5pZCxkYXkuZGssc2hpZnQpO3dNaW5zW2UuaWRdKz1kdXI7cGxhY2VkPXRydWU7Y2hhbmdlZD10cnVlO2JyZWFrfX1pZighcGxhY2VkKWNvbnRpbnVlfX1zYXZlKCk7bGV0IGFsZXJ0cz0wO2RheXMuZm9yRWFjaChkPT57YWxlcnRzKz1jaGVja0NvdihkLmRrKS5sZW5ndGh9KTtpZihhbGVydHM9PT0wKXRvYXN0KCdEaXNwYXRjaCByw6l1c3NpIDogY291dmVydHVyZSBjb21wbMOodGUnLCdzdWNjZXNzJyk7ZWxzZSB0b2FzdCgnRGlzcGF0Y2ggdGVybWluw6kg4oCUICcrYWxlcnRzKycgYWxlcnRlKHMpIMOgIHbDqXJpZmllcicsJ3dhcm5pbmcnLDQwMDApfQpmdW5jdGlvbiBhbmFseXplQyhkayl7bGV0IHY5NDU9ZmFsc2Usdk9wZW5Db3VudD0wLHZDbG9zZTE9ZmFsc2UsdkNsb3NlQ291bnQ9MCxjT3Blbj1mYWxzZSxjQ2xvc2U9ZmFsc2U7RC5lbXBsb3llZXMuZm9yRWFjaChlbXA9Pntjb25zdCBkPUQuc2NoZWR1bGVbZW1wLmlkKydfJytka107aWYoIWR8fGQudHlwZSE9PSdUcmF2YWlsJylyZXR1cm47Y29uc3QgaXNWPWVtcC5yb2xlLmluY2x1ZGVzKCdWZW5kZXVyJyl8fChlbXAucm9sZT09PSdHw6lyYW50JyYmKGQubTE9PT0nQ29tbWVyY2UnfHxkLm0xPT09J0dlc3RSYXlvbicpKTtjb25zdCBpc0M9ZW1wLnJvbGUuaW5jbHVkZXMoJ0NhaXNzaWVyJyl8fGVtcC5yb2xlLmluY2x1ZGVzKCdTZXJ2aWNlcycpO2lmKGlzVil7aWYoZC5zdGFydEFNPT09JzA5OjQ1Jyl2OTQ1PXRydWU7aWYoZC5zdGFydEFNJiZkLnN0YXJ0QU08PScxMDoxNScpdk9wZW5Db3VudCsrO2lmKGQuZW5kUE0mJmQuZW5kUE0+PScxOTowMCcpe3ZDbG9zZTE9dHJ1ZTt2Q2xvc2VDb3VudCsrfX1pZihpc0Mpe2lmKGQuc3RhcnRBTT09PScwOTo0NScpY09wZW49dHJ1ZTtpZihkLmVuZFBNJiZkLmVuZFBNPj0nMTk6MTUnKWNDbG9zZT10cnVlfX0pO3JldHVybnt2OTQ1LHZPcGVuQ291bnQsdkNsb3NlMSx2Q2xvc2VDb3VudCxjT3BlbixjQ2xvc2V9fQpmdW5jdGlvbiBpc0F2YWlsKGVtcCxkayl7Y29uc3QgZW50cnk9RC5zY2hlZHVsZVtlbXAuaWQrJ18nK2RrXTtpZihlbnRyeSYmZW50cnkudHlwZT09PSdUcmF2YWlsJyYmKGVudHJ5LnN0YXJ0QU18fGVudHJ5LnN0YXJ0UE0pKXJldHVybiBmYWxzZTtpZihlbnRyeSYmZW50cnkudHlwZSE9PSdUcmF2YWlsJylyZXR1cm4gZmFsc2U7aWYoZW1wLnJlc3REYXlzJiZlbXAucmVzdERheXMuaW5jbHVkZXMobmV3IERhdGUoZGspLmdldERheSgpKSlyZXR1cm4gZmFsc2U7cmV0dXJuIShELmFic2VuY2VzfHxbXSkuZmluZChhPT5hLmVtcElkPT09ZW1wLmlkJiZkaz49YS5zdGFydCYmZGs8PWEuZW5kKX0KZnVuY3Rpb24gYXNzaWduUyhlaWQsZGsscyl7RC5zY2hlZHVsZVtlaWQrJ18nK2RrXT17dHlwZTonVHJhdmFpbCcsc3RhcnRBTTpzLnNBTSxlbmRBTTpzLmVBTSxzdGFydFBNOnMuc1BNLGVuZFBNOnMuZVBNLGJyZWFrOmZhbHNlLG0xOnMubTEsbTI6JycsbTM6Jyd9fQpmdW5jdGlvbiBjYWxjV2Vla01pbnMoZWlkLG1vbmRheSl7bGV0IHQ9MDtmb3IobGV0IGk9MDtpPDc7aSsrKXtjb25zdCBkPW5ldyBEYXRlKG1vbmRheSk7ZC5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkraSk7Y29uc3QgZGF0YT1ELnNjaGVkdWxlW2VpZCsnXycrZklzbyhkKV07aWYoZGF0YSYmZGF0YS50eXBlPT09J1RyYXZhaWwnKXQrPWNhbGNNaW5zKGRhdGEpfXJldHVybiB0fQpmdW5jdGlvbiBjb25maXJtRHVwKCl7Y29uc3QgdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHVwRGF0ZScpLnZhbHVlO2lmKCF0KXt0b2FzdCgnU8OpbGVjdGlvbm5leiB1bmUgZGF0ZScsJ3dhcm5pbmcnKTtyZXR1cm59Y29uc3Qgc009Z2V0TW9uZGF5KGN1ckRhdGUpLHRNPWdldE1vbmRheShuZXcgRGF0ZSh0KSk7Zm9yKGxldCBpPTA7aTw3O2krKyl7Y29uc3Qgc0Q9bmV3IERhdGUoc00pO3NELnNldERhdGUoc00uZ2V0RGF0ZSgpK2kpO2NvbnN0IHREPW5ldyBEYXRlKHRNKTt0RC5zZXREYXRlKHRNLmdldERhdGUoKStpKTtjb25zdCBzSz1mSXNvKHNEKSx0Sz1mSXNvKHREKTtELmVtcGxveWVlcy5mb3JFYWNoKGVtcD0+e2NvbnN0IHM9RC5zY2hlZHVsZVtlbXAuaWQrJ18nK3NLXTtpZihzKUQuc2NoZWR1bGVbZW1wLmlkKydfJyt0S109SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzKSk7ZWxzZSBkZWxldGUgRC5zY2hlZHVsZVtlbXAuaWQrJ18nK3RLXX0pfWNsb3NlTW9kYWwoJ2R1cE1vZGFsJyk7Y3VyRGF0ZT10TTtzYXZlKCk7dG9hc3QoJ1NlbWFpbmUgZHVwbGlxdcOpZSAhJywnc3VjY2VzcycpfQpmdW5jdGlvbiBvcGVuRW1wTW9kYWwoaWQpe2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbXBGb3JtJykucmVzZXQoKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWJzRm9ybScpLnJlc2V0KCk7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fic0xpc3QnKS5pbm5lckhUTUw9Jyc7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRCb2R5JykuaW5uZXJIVE1MPScnO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZyZXVyVGlwJykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKS5mb3JFYWNoKCh0LGkpPT50LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsaT09PTApKTtkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHBhbmUnKS5mb3JFYWNoKChwLGkpPT5wLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsaT09PTApKTtjb25zdCBkZWxCdG49ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bkRlbEVtcCcpO2lmKGlkKXtjb25zdCBlbXA9RC5lbXBsb3llZXMuZmluZCh4PT54LmlkPT09aWQpO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbXBNVGl0bGUnKS5pbm5lckhUTUw9JzxpIGNsYXNzPSJmYXMgZmEtdXNlci1lZGl0Ij48L2k+ICcrZW1wLmZpcnN0TmFtZTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZUlkJykudmFsdWU9ZW1wLmlkO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlRmlyc3QnKS52YWx1ZT1lbXAuZmlyc3ROYW1lO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlRmNJZCcpLnZhbHVlPWVtcC5mY0lkfHwnJztkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZVJvbGUnKS52YWx1ZT1lbXAucm9sZTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZUNvbnQnKS52YWx1ZT1lbXAuY29udHJhY3RIb3Vyc3x8MzU7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VQaW4nKS52YWx1ZT1lbXAucGlufHwnJztkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZVIxJykudmFsdWU9ZW1wLnJlc3REYXlzPy5bMF0/PycnO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlUjInKS52YWx1ZT1lbXAucmVzdERheXM/LlsxXT8/Jyc7aWYoZW1wLnJvbGU9PT0nTGl2cmV1ciBQb2x5dmFsZW50Jylkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGl2cmV1clRpcCcpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtkZWxCdG4uc3R5bGUuZGlzcGxheT0naW5saW5lLWZsZXgnO3JlbmRlckFicyhpZCk7cmVuZGVyU3RhdHMoaWQpfWVsc2V7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtcE1UaXRsZScpLmlubmVySFRNTD0nPGkgY2xhc3M9ImZhcyBmYS11c2VyLXBsdXMiPjwvaT4gTm91dmVhdSBzYWxhcmnDqSc7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VJZCcpLnZhbHVlPScnO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlRmNJZCcpLnZhbHVlPSdGQy0nO2RlbEJ0bi5zdHlsZS5kaXNwbGF5PSdub25lJ31vcGVuTW9kYWwoJ2VtcE1vZGFsJyl9CmZ1bmN0aW9uIG9uUm9sZUNoZygpe2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZyZXVyVGlwJykuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycsZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VSb2xlJykudmFsdWU9PT0nTGl2cmV1ciBQb2x5dmFsZW50Jyl9CmZ1bmN0aW9uIHNhdmVFbXBsb3llZShlKXtpZihlJiZlLnByZXZlbnREZWZhdWx0KWUucHJldmVudERlZmF1bHQoKTtjb25zdCBmaXJzdE5hbWU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VGaXJzdCcpLnZhbHVlLnRyaW0oKTtpZighZmlyc3ROYW1lKXt0b2FzdCgnTGUgcHLDqW5vbSBlc3Qgb2JsaWdhdG9pcmUnLCdkYW5nZXInKTtyZXR1cm59Y29uc3QgcGluVmFsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlUGluJykudmFsdWUudHJpbSgpO2lmKHBpblZhbCYmIS9eXGR7NH0kLy50ZXN0KHBpblZhbCkpe3RvYXN0KCdMZSBjb2RlIFBJTiBkb2l0IGNvbXBvcnRlciBleGFjdGVtZW50IDQgY2hpZmZyZXMnLCdkYW5nZXInKTtyZXR1cm59Y29uc3QgaWQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VJZCcpLnZhbHVlO2NvbnN0IHJvbGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VSb2xlJykudmFsdWU7bGV0IHJlc3REYXlzPVtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZVIxJykudmFsdWUsZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VSMicpLnZhbHVlXS5maWx0ZXIoeD0+eCE9PScnKS5tYXAoTnVtYmVyKTtpZihyb2xlPT09J0xpdnJldXIgUG9seXZhbGVudCcpcmVzdERheXM9WzQsMF07Y29uc3QgZXhpc3Rpbmc9aWQ/KEQuZW1wbG95ZWVzLmZpbmQoeD0+eC5pZD09aWQpfHx7fSk6e307Y29uc3QgZW1wPXsuLi5leGlzdGluZyxpZDppZD9wYXJzZUludChpZCk6RGF0ZS5ub3coKSxmaXJzdE5hbWUsZmNJZDpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZUZjSWQnKS52YWx1ZS50cmltKCkscm9sZSxjb250cmFjdEhvdXJzOnBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VDb250JykudmFsdWUpfHwzNSxyZXN0RGF5c307aWYoL15cZHs0fSQvLnRlc3QocGluVmFsKSllbXAucGluPXBpblZhbDtlbHNlIGlmKHBpblZhbD09PScnKWRlbGV0ZSBlbXAucGluO2lmKGlkKXtELmVtcGxveWVlc1tELmVtcGxveWVlcy5maW5kSW5kZXgoeD0+eC5pZD09aWQpXT1lbXA7dG9hc3QoZW1wLmZpcnN0TmFtZSsnIOKAlCBtb2RpZmljYXRpb25zIGVucmVnaXN0csOpZXMnLCdzdWNjZXNzJyl9ZWxzZXtELmVtcGxveWVlcy5wdXNoKGVtcCk7dG9hc3QoZW1wLmZpcnN0TmFtZSsiIGFqb3V0w6kgw6AgbCfDqXF1aXBlIiwnc3VjY2VzcycpfWNsb3NlTW9kYWwoJ2VtcE1vZGFsJyk7c2F2ZSgpfQpmdW5jdGlvbiBkZWxldGVFbXBsb3llZSgpe2NvbnN0IGlkPXBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlSWQnKS52YWx1ZSk7Y29uc3QgZW1wPUQuZW1wbG95ZWVzLmZpbmQoeD0+eC5pZD09PWlkKTtjb25maXJtMignU3VwcHJpbWVyICcrKGVtcD8uZmlyc3ROYW1lfHwnY2Ugc2FsYXJpw6knKSsnIGTDqWZpbml0aXZlbWVudCA/JywoKT0+e0QuZW1wbG95ZWVzPUQuZW1wbG95ZWVzLmZpbHRlcih4PT54LmlkIT09aWQpO09iamVjdC5rZXlzKEQuc2NoZWR1bGUpLmZvckVhY2goaz0+e2lmKGsuc3RhcnRzV2l0aChpZCsnXycpKWRlbGV0ZSBELnNjaGVkdWxlW2tdfSk7RC5hYnNlbmNlcz0oRC5hYnNlbmNlc3x8W10pLmZpbHRlcihhPT5hLmVtcElkIT09aWQpO2Nsb3NlTW9kYWwoJ2VtcE1vZGFsJyk7c2F2ZSgpO3RvYXN0KCdTYWxhcmnDqSBzdXBwcmltw6knLCdkYW5nZXInKX0sJ/Cfl5HvuI8nKX0KZnVuY3Rpb24gc2F2ZUFic2VuY2UoZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO2NvbnN0IGVtcElkPXBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlSWQnKS52YWx1ZSk7aWYoIWVtcElkKXt0b2FzdCgiU2F1dmVnYXJkZXogZCdhYm9yZCBsZSBzYWxhcmnDqSIsJ3dhcm5pbmcnKTtyZXR1cm59Y29uc3Qgc3RhcnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FEZWInKS52YWx1ZTtjb25zdCBlbmQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FGaW4nKS52YWx1ZTtjb25zdCB0eXBlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhVHlwZScpLnZhbHVlO2lmKCFzdGFydHx8IWVuZCl7dG9hc3QoJ1JlbnNlaWduZXogbGVzIGRhdGVzJywnd2FybmluZycpO3JldHVybn1pZihzdGFydD5lbmQpe3RvYXN0KCdEYXRlIGZpbiBhdmFudCBkw6lidXQgIScsJ2RhbmdlcicpO3JldHVybn1pZighRC5hYnNlbmNlcylELmFic2VuY2VzPVtdO0QuYWJzZW5jZXMucHVzaCh7aWQ6RGF0ZS5ub3coKSxlbXBJZCxzdGFydCxlbmQsdHlwZX0pO2xvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSxKU09OLnN0cmluZ2lmeShEKSk7cmVuZGVyQWJzKGVtcElkKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWJzRm9ybScpLnJlc2V0KCk7dG9hc3QoJ0Fic2VuY2UgZW5yZWdpc3Ryw6llJywnc3VjY2VzcycpO3JlbmRlcigpfQpmdW5jdGlvbiBkZWxBYnMoYWJzSWQpe2NvbnN0IGVtcElkPXBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlSWQnKS52YWx1ZSk7RC5hYnNlbmNlcz0oRC5hYnNlbmNlc3x8W10pLmZpbHRlcihhPT5hLmlkIT09YWJzSWQpO2xvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSxKU09OLnN0cmluZ2lmeShEKSk7cmVuZGVyQWJzKGVtcElkKTt0b2FzdCgnQWJzZW5jZSBzdXBwcmltw6llJywnc3VjY2VzcycpO3JlbmRlcigpfQpmdW5jdGlvbiByZW5kZXJBYnMoZW1wSWQpe2NvbnN0IGxpc3Q9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fic0xpc3QnKTtjb25zdCBhYnM9KEQuYWJzZW5jZXN8fFtdKS5maWx0ZXIoYT0+YS5lbXBJZD09PWVtcElkKTtpZighYWJzLmxlbmd0aCl7bGlzdC5pbm5lckhUTUw9Jzx0cj48dGQgY29sc3Bhbj0iNCIgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyO2NvbG9yOnZhcigtLW11dGVkKTtwYWRkaW5nOjE2cHgiPkF1Y3VuZSBhYnNlbmNlPC90ZD48L3RyPic7cmV0dXJufWxpc3QuaW5uZXJIVE1MPWFicy5tYXAoYT0+Jzx0cj48dGQ+JythLnN0YXJ0Kyc8L3RkPjx0ZD4nK2EuZW5kKyc8L3RkPjx0ZD48c3Ryb25nPicrYS50eXBlKyc8L3N0cm9uZz48L3RkPjx0ZD48YnV0dG9uIGNsYXNzPSJidG4gYnRuLWVyciBidG4tc20iIG9uY2xpY2s9ImRlbEFicygnK2EuaWQrJykiPjxpIGNsYXNzPSJmYXMgZmEtdGltZXMiPjwvaT48L2J1dHRvbj48L3RkPjwvdHI+Jykuam9pbignJyl9CmZ1bmN0aW9uIHJlbmRlclN0YXRzKGVtcElkKXtjb25zdCBtb250aHM9WydKYW4nLCdGw6l2JywnTWFyJywnQXZyJywnTWFpJywnSnVpbicsJ0p1aWwnLCdBb8O7dCcsJ1NlcCcsJ09jdCcsJ05vdicsJ0TDqWMnXTtjb25zdCBzdGF0cz1uZXcgQXJyYXkoMTIpLmZpbGwoMCk7Y29uc3QgeXI9bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO09iamVjdC5rZXlzKEQuc2NoZWR1bGUpLmZvckVhY2goaz0+e2lmKCFrLnN0YXJ0c1dpdGgoZW1wSWQrJ18nKSlyZXR1cm47Y29uc3QgZD1uZXcgRGF0ZShrLnNwbGl0KCdfJylbMV0pO2lmKGQuZ2V0RnVsbFllYXIoKT09PXlyJiZELnNjaGVkdWxlW2tdLnR5cGU9PT0nVHJhdmFpbCcpc3RhdHNbZC5nZXRNb250aCgpXSs9Y2FsY01pbnMoRC5zY2hlZHVsZVtrXSl9KTtsZXQgdG90YWw9MDtjb25zdCBib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0Qm9keScpO2NvbnN0IHJvd3M9c3RhdHMubWFwKChtLGkpPT57aWYoIW0pcmV0dXJuJyc7dG90YWwrPW07cmV0dXJuJzx0cj48dGQ+Jyttb250aHNbaV0rJzwvdGQ+PHRkPicrZkhNKG0pKyc8L3RkPjwvdHI+J30pLmpvaW4oJycpO2JvZHkuaW5uZXJIVE1MPXJvd3N8fCc8dHI+PHRkIGNvbHNwYW49IjIiIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjp2YXIoLS1tdXRlZCkiPkF1Y3VuZSBkb25uw6llPC90ZD48L3RyPic7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRUb3RhbCcpLnRleHRDb250ZW50PWZITSh0b3RhbCl9CmZ1bmN0aW9uIHN3aXRjaFRhYihwYW5lSWQsYnRuKXtkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykuZm9yRWFjaCh0PT50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKTtkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHBhbmUnKS5mb3JFYWNoKHA9PnAuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpO2J0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYW5lSWQpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO2NvbnN0IGlkPXBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlSWQnKS52YWx1ZSk7aWYocGFuZUlkPT09J3RwU3RhdCcmJmlkKXJlbmRlclN0YXRzKGlkKTtpZihwYW5lSWQ9PT0ndHBBYnMnJiZpZClyZW5kZXJBYnMoaWQpO2lmKHBhbmVJZD09PSd0cFRwbCcpbG9hZFRwbCgpfQpjb25zdCBEQVlfTEFCRUxTPXsxOidMdW5kaScsMjonTWFyZGknLDM6J01lcmNyZWRpJyw0OidKZXVkaScsNTonVmVuZHJlZGknLDY6J1NhbWVkaScsMDonRGltYW5jaGUnfTsKY29uc3QgREFZX09SREVSPVsxLDIsMyw0LDUsNiwwXTsKbGV0IHRwbEVkaXRpbmc9e0E6e30sQjp7fSxjdXJyZW50V2VlazonQScsYWx0ZXJuOmZhbHNlfTsKZnVuY3Rpb24gbG9hZFRwbCgpe2NvbnN0IGlkPXBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlSWQnKS52YWx1ZSk7Y29uc3QgZW1wPWlkP0QuZW1wbG95ZWVzLmZpbmQoeD0+eC5pZD09PWlkKTpudWxsO2lmKGVtcCl7dHBsRWRpdGluZy5BPWVtcC5maXhlZFNjaGVkdWxlQT9KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGVtcC5maXhlZFNjaGVkdWxlQSkpOmVtcC5maXhlZFNjaGVkdWxlP0pTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZW1wLmZpeGVkU2NoZWR1bGUpKTp7fTt0cGxFZGl0aW5nLkI9ZW1wLmZpeGVkU2NoZWR1bGVCP0pTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZW1wLmZpeGVkU2NoZWR1bGVCKSk6e307dHBsRWRpdGluZy5hbHRlcm49ISEoZW1wLmZpeGVkU2NoZWR1bGVCfHwoZW1wLmNvbnRyYWN0SG91cnNCJiZlbXAuY29udHJhY3RIb3Vyc0I+MCkpfWVsc2V7dHBsRWRpdGluZz17QTp7fSxCOnt9LGN1cnJlbnRXZWVrOidBJyxhbHRlcm46ZmFsc2V9fXRwbEVkaXRpbmcuY3VycmVudFdlZWs9J0EnO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cGxBbHRlcm4nKS5jaGVja2VkPXRwbEVkaXRpbmcuYWx0ZXJuO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cGxTd2l0Y2hlcicpLnN0eWxlLmRpc3BsYXk9dHBsRWRpdGluZy5hbHRlcm4/J2Jsb2NrJzonbm9uZSc7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RwbENvbnRyYWN0QicpLnN0eWxlLmRpc3BsYXk9dHBsRWRpdGluZy5hbHRlcm4/J2Jsb2NrJzonbm9uZSc7aWYoZW1wKXtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZUNvbnRBJykudmFsdWU9ZW1wLmNvbnRyYWN0SG91cnN8fDM1O2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlQ29udEInKS52YWx1ZT1lbXAuY29udHJhY3RIb3Vyc0J8fCcnfWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cGwtYWItYnRuJykuZm9yRWFjaChiPT5iLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsYi5kYXRhc2V0LndlZWs9PT0nQScpKTtyZW5kZXJUcGxEYXlzKCk7dXBkYXRlVHBsSGVhZGVycygpfQpmdW5jdGlvbiB0b2dnbGVBbHRlcm4oKXt0cGxFZGl0aW5nLmFsdGVybj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHBsQWx0ZXJuJykuY2hlY2tlZDtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHBsU3dpdGNoZXInKS5zdHlsZS5kaXNwbGF5PXRwbEVkaXRpbmcuYWx0ZXJuPydibG9jayc6J25vbmUnO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cGxDb250cmFjdEInKS5zdHlsZS5kaXNwbGF5PXRwbEVkaXRpbmcuYWx0ZXJuPydibG9jayc6J25vbmUnO2lmKCF0cGxFZGl0aW5nLmFsdGVybil7dHBsRWRpdGluZy5jdXJyZW50V2Vlaz0nQSc7ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRwbC1hYi1idG4nKS5mb3JFYWNoKGI9PmIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyxiLmRhdGFzZXQud2Vlaz09PSdBJykpfXJlbmRlclRwbERheXMoKTt1cGRhdGVUcGxIZWFkZXJzKCl9CmZ1bmN0aW9uIHN3aXRjaFRwbFdlZWsodyxidG4pe3RwbEVkaXRpbmcuY3VycmVudFdlZWs9dztkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHBsLWFiLWJ0bicpLmZvckVhY2goYj0+Yi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSk7YnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO3JlbmRlclRwbERheXMoKX0KZnVuY3Rpb24gcmVuZGVyVHBsRGF5cygpe2NvbnN0IGNvbnRhaW5lcj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHBsRGF5c0xpc3QnKTtjb25zdCBkYXRhPXRwbEVkaXRpbmdbdHBsRWRpdGluZy5jdXJyZW50V2Vla107Y29udGFpbmVyLmlubmVySFRNTD1EQVlfT1JERVIubWFwKGRuPT57Y29uc3QgZD1kYXRhW2RuXXx8e3R5cGU6J1RyYXZhaWwnLHN0YXJ0QU06JycsZW5kQU06Jycsc3RhcnRQTTonJyxlbmRQTTonJ307Y29uc3QgaXNXb3JrPWQudHlwZT09PSdUcmF2YWlsJztyZXR1cm4nPGRpdiBjbGFzcz0idHBsLWRheS1yb3cnKyghaXNXb3JrPycgb2ZmJzonJykrJyI+PGRpdiBjbGFzcz0idHBsLWRheS1sYmwiPicrREFZX0xBQkVMU1tkbl0rJzwvZGl2PjxzZWxlY3QgY2xhc3M9InRwbC10eXBlLXNlbCIgb25jaGFuZ2U9InVwZFRwbCgnK2RuKyIsJ3R5cGUnLHRoaXMudmFsdWUpXCI+PG9wdGlvbiB2YWx1ZT1cIlRyYXZhaWxcIiIrKGQudHlwZT09PSdUcmF2YWlsJz8nIHNlbGVjdGVkJzonJykrJz5UcmF2YWlsPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iUmVwb3MiJysoZC50eXBlPT09J1JlcG9zJz8nIHNlbGVjdGVkJzonJykrJz5SZXBvczwvb3B0aW9uPjwvc2VsZWN0PjxpbnB1dCB0eXBlPSJ0aW1lIiBjbGFzcz0idHBsLXRpbWUtaW4iIHZhbHVlPSInKyhkLnN0YXJ0QU18fCcnKSsnIiAnKyghaXNXb3JrPydkaXNhYmxlZCc6JycpKycgb25jaGFuZ2U9InVwZFRwbCgnK2RuKyIsJ3N0YXJ0QU0nLHRoaXMudmFsdWUpXCIgcGxhY2Vob2xkZXI9XCJEw6lidXQgQU1cIj48aW5wdXQgdHlwZT1cInRpbWVcIiBjbGFzcz1cInRwbC10aW1lLWluXCIgdmFsdWU9XCIiKyhkLmVuZEFNfHwnJykrJyIgJysoIWlzV29yaz8nZGlzYWJsZWQnOicnKSsnIG9uY2hhbmdlPSJ1cGRUcGwoJytkbisiLCdlbmRBTScsdGhpcy52YWx1ZSlcIiBwbGFjZWhvbGRlcj1cIkZpbiBBTVwiPjxpbnB1dCB0eXBlPVwidGltZVwiIGNsYXNzPVwidHBsLXRpbWUtaW5cIiB2YWx1ZT1cIiIrKGQuc3RhcnRQTXx8JycpKyciICcrKCFpc1dvcms/J2Rpc2FibGVkJzonJykrJyBvbmNoYW5nZT0idXBkVHBsKCcrZG4rIiwnc3RhcnRQTScsdGhpcy52YWx1ZSlcIiBwbGFjZWhvbGRlcj1cIkTDqWJ1dCBQTVwiPjxpbnB1dCB0eXBlPVwidGltZVwiIGNsYXNzPVwidHBsLXRpbWUtaW5cIiB2YWx1ZT1cIiIrKGQuZW5kUE18fCcnKSsnIiAnKyghaXNXb3JrPydkaXNhYmxlZCc6JycpKycgb25jaGFuZ2U9InVwZFRwbCgnK2RuKyIsJ2VuZFBNJyx0aGlzLnZhbHVlKVwiIHBsYWNlaG9sZGVyPVwiRmluIFBNXCI+PHNwYW4gY2xhc3M9XCJ0cGwtc2VwXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwidHBsLWhyc1wiPiIrKGlzV29yaz9mSE0oY2FsY01pbnMoZCkpOifigJQnKSsnPC9zcGFuPjwvZGl2Pid9KS5qb2luKCcnKTt1cGRhdGVUcGxIZWFkZXJzKCl9CmZ1bmN0aW9uIHVwZFRwbChkbixmaWVsZCx2YWx1ZSl7Y29uc3QgZGF0YT10cGxFZGl0aW5nW3RwbEVkaXRpbmcuY3VycmVudFdlZWtdO2lmKCFkYXRhW2RuXSlkYXRhW2RuXT17dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonJyxlbmRBTTonJyxzdGFydFBNOicnLGVuZFBNOicnfTtpZihmaWVsZD09PSd0eXBlJyl7aWYodmFsdWU9PT0nUmVwb3MnKWRhdGFbZG5dPXt0eXBlOidSZXBvcyd9O2Vsc2UgZGF0YVtkbl09e3R5cGU6J1RyYXZhaWwnLHN0YXJ0QU06ZGF0YVtkbl0uc3RhcnRBTXx8JycsZW5kQU06ZGF0YVtkbl0uZW5kQU18fCcnLHN0YXJ0UE06ZGF0YVtkbl0uc3RhcnRQTXx8JycsZW5kUE06ZGF0YVtkbl0uZW5kUE18fCcnfX1lbHNle2RhdGFbZG5dW2ZpZWxkXT12YWx1ZX1yZW5kZXJUcGxEYXlzKCl9CmZ1bmN0aW9uIGNhbGNXZWVrVHBsTWlucyh3ayl7bGV0IHQ9MDtEQVlfT1JERVIuZm9yRWFjaChkbj0+e2NvbnN0IGQ9dHBsRWRpdGluZ1t3a11bZG5dO2lmKGQmJmQudHlwZT09PSdUcmF2YWlsJyl0Kz1jYWxjTWlucyhkKX0pO3JldHVybiB0fQpmdW5jdGlvbiB1cGRhdGVUcGxIZWFkZXJzKCl7Y29uc3QgYUg9Y2FsY1dlZWtUcGxNaW5zKCdBJyksYkg9Y2FsY1dlZWtUcGxNaW5zKCdCJyk7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RwbEFIb3VycycpLnRleHRDb250ZW50PScoJytmSE0oYUgpKycpJztkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHBsQkhvdXJzJykudGV4dENvbnRlbnQ9JygnK2ZITShiSCkrJyknO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cGxXZWVrVG90YWwnKS50ZXh0Q29udGVudD1mSE0oY2FsY1dlZWtUcGxNaW5zKHRwbEVkaXRpbmcuY3VycmVudFdlZWspKX0KZnVuY3Rpb24gY2xlYXJUcGwoKXtjb25maXJtMignVmlkZXIgbGUgcGxhbm5pbmcgdHlwZSBkZSBjZXR0ZSBzZW1haW5lID8nLCgpPT57dHBsRWRpdGluZ1t0cGxFZGl0aW5nLmN1cnJlbnRXZWVrXT17fTtyZW5kZXJUcGxEYXlzKCk7dG9hc3QoJ1BsYW5uaW5nIHR5cGUgdmlkw6knLCdpbmZvJyl9LCfwn6e5Jyl9CmZ1bmN0aW9uIHNhdmVUcGwoKXtjb25zdCBpZD1wYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZUlkJykudmFsdWUpO2lmKCFpZCl7dG9hc3QoIkVucmVnaXN0cmV6IGQnYWJvcmQgbGUgc2FsYXJpw6kgKG9uZ2xldCBJZGVudGl0w6kpIiwnd2FybmluZycpO3JldHVybn1jb25zdCBlbXA9RC5lbXBsb3llZXMuZmluZCh4PT54LmlkPT09aWQpO2lmKCFlbXApcmV0dXJuO2NvbnN0IGNsZWFuQT17fSxjbGVhbkI9e307REFZX09SREVSLmZvckVhY2goZG49PntpZih0cGxFZGl0aW5nLkFbZG5dKWNsZWFuQVtkbl09dHBsRWRpdGluZy5BW2RuXTtpZih0cGxFZGl0aW5nLkJbZG5dKWNsZWFuQltkbl09dHBsRWRpdGluZy5CW2RuXX0pO2lmKHRwbEVkaXRpbmcuYWx0ZXJuKXtlbXAuZml4ZWRTY2hlZHVsZUE9Y2xlYW5BO2VtcC5maXhlZFNjaGVkdWxlQj1jbGVhbkI7ZGVsZXRlIGVtcC5maXhlZFNjaGVkdWxlO2NvbnN0IGNBPXBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VDb250QScpLnZhbHVlKTtjb25zdCBjQj1wYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlQ29udEInKS52YWx1ZSk7aWYoY0E+MCl7ZW1wLmNvbnRyYWN0SG91cnM9Y0E7Y29uc3QgZUNvbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VDb250Jyk7aWYoZUNvbnQpZUNvbnQudmFsdWU9Y0F9aWYoY0I+MCllbXAuY29udHJhY3RIb3Vyc0I9Y0J9ZWxzZXtlbXAuZml4ZWRTY2hlZHVsZT1jbGVhbkE7ZGVsZXRlIGVtcC5maXhlZFNjaGVkdWxlQTtkZWxldGUgZW1wLmZpeGVkU2NoZWR1bGVCO2RlbGV0ZSBlbXAuY29udHJhY3RIb3Vyc0J9Y29uc3QgdG9kYXk9ZklzbyhuZXcgRGF0ZSgpKTtPYmplY3Qua2V5cyhELnNjaGVkdWxlKS5mb3JFYWNoKGs9PntpZihrLnN0YXJ0c1dpdGgoaWQrJ18nKSl7Y29uc3QgZGs9ay5zcGxpdCgnXycpWzFdO2lmKGRrPj10b2RheSl7ZGVsZXRlIEQuc2NoZWR1bGVba119fX0pO3NhdmUoKTt0b2FzdCgnUGxhbm5pbmcgdHlwZSBlbnJlZ2lzdHLDqSBwb3VyICcrZW1wLmZpcnN0TmFtZSwnc3VjY2VzcycpfQpmdW5jdGlvbiBleHBvcnREYXRhKCl7Y29uc3QgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7YS5ocmVmPSdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnK2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShELG51bGwsMikpO2EuZG93bmxvYWQ9J3BsYW5uaW5nX0Y4OTBfJytmSXNvKG5ldyBEYXRlKCkpKycuanNvbic7YS5jbGljaygpO3RvYXN0KCdEb25uw6llcyBleHBvcnTDqWVzJywnc3VjY2VzcycpfQpmdW5jdGlvbiBpbXBvcnREYXRhKGlucHV0KXtjb25zdCBmPWlucHV0LmZpbGVzWzBdO2lmKCFmKXJldHVybjtjb25zdCByPW5ldyBGaWxlUmVhZGVyKCk7ci5vbmxvYWQ9ZT0+e3RyeXtEPUpTT04ucGFyc2UoZS50YXJnZXQucmVzdWx0KTtzYXZlKCk7dG9hc3QoJ0Rvbm7DqWVzIGltcG9ydMOpZXMnLCdzdWNjZXNzJyl9Y2F0Y2h7dG9hc3QoJ0ZpY2hpZXIgSlNPTiBpbnZhbGlkZScsJ2RhbmdlcicpfX07ci5yZWFkQXNUZXh0KGYpO2lucHV0LnZhbHVlPScnfQpmdW5jdGlvbiByZXNldERhdGEoKXtsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShLRVkpO0Q9e2VtcGxveWVlczpbXSxzY2hlZHVsZTp7fSxhYnNlbmNlczpbXX07Y2xpcGJvYXJkPW51bGw7c2F2ZSgpO3RvYXN0KCdEb25uw6llcyByw6lpbml0aWFsaXPDqWVzJywnZGFuZ2VyJyl9CmZ1bmN0aW9uIHNldE5hdih2KXtkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubml0ZW0nKS5mb3JFYWNoKGVsPT5lbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSk7Y29uc3QgZWw9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi0nK3YpO2lmKGVsKWVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO3NldFRpbWVvdXQoKCk9PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtcGxhbicpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpLDE1MDApfQpmdW5jdGlvbiBnZXRXZWVrTnVtYmVyKGRhdGUpe2NvbnN0IGQ9bmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLGRhdGUuZ2V0TW9udGgoKSxkYXRlLmdldERhdGUoKSkpO2Quc2V0VVRDRGF0ZShkLmdldFVUQ0RhdGUoKSs0LShkLmdldFVUQ0RheSgpfHw3KSk7Y29uc3QgeVM9bmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLDAsMSkpO3JldHVybiBNYXRoLmNlaWwoKCgoZC15UykvODY0MDAwMDApKzEpLzcpfQpmdW5jdGlvbiBnZXRDb250cmFjdEhvdXJzKGVtcCxyZWZEYXRlKXtpZihlbXAuY29udHJhY3RIb3Vyc0ImJmVtcC5jb250cmFjdEhvdXJzQj4wKXtyZXR1cm4gZ2V0V2Vla051bWJlcihyZWZEYXRlKSUyPT09MT8oZW1wLmNvbnRyYWN0SG91cnN8fDM1KTplbXAuY29udHJhY3RIb3Vyc0J9cmV0dXJuIGVtcC5jb250cmFjdEhvdXJzfHwzNX0KZnVuY3Rpb24gZ2V0V2Vla1ZhcmlhbnRMYWJlbChlbXAscmVmRGF0ZSl7aWYoIWVtcC5jb250cmFjdEhvdXJzQnx8ZW1wLmNvbnRyYWN0SG91cnNCPD0wKXJldHVybicnO3JldHVybiBnZXRXZWVrTnVtYmVyKHJlZkRhdGUpJTI9PT0xPydBJzonQid9CmZ1bmN0aW9uIHNldHVwVGVhbSgpe2NvbnN0IG5vcm09cz0+cy50b0xvd2VyQ2FzZSgpLm5vcm1hbGl6ZSgnTkZEJykucmVwbGFjZSgvW1x1MDMwMC1cdTAzNmZdL2csJycpO2NvbnN0IHRwbEVtaWxpZT17MTp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMDk6NDUnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J1JlYUltcGxhbnQnLG0yOicnLG0zOicnfSwyOnt0eXBlOidUcmF2YWlsJyxzdGFydEFNOicwOTo0NScsZW5kQU06JzEzOjAwJyxzdGFydFBNOicxNDowMCcsZW5kUE06JzE4OjAwJyxicmVhazpmYWxzZSxtMTonUmVhSW1wbGFudCcsbTI6JycsbTM6Jyd9LDM6e3R5cGU6J1RyYXZhaWwnLHN0YXJ0QU06JzA5OjQ1JyxlbmRBTTonMTM6MDAnLHN0YXJ0UE06JzE0OjAwJyxlbmRQTTonMTc6MzAnLGJyZWFrOmZhbHNlLG0xOidBY3R1YicsbTI6JycsbTM6Jyd9LDQ6e3R5cGU6J1JlcG9zJ30sNTp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMDk6NDUnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J1JlYUltcGxhbnQnLG0yOicnLG0zOicnfSw2Ont0eXBlOidUcmF2YWlsJyxzdGFydEFNOicxMDozMCcsZW5kQU06JzEzOjAwJyxzdGFydFBNOicxNDowMCcsZW5kUE06JzE4OjAwJyxicmVhazpmYWxzZSxtMTonQ29tbWVyY2UnLG0yOicnLG0zOicnfSwwOnt0eXBlOidSZXBvcyd9fTtsZXQgZW1pbGllPUQuZW1wbG95ZWVzLmZpbmQoZT0+bm9ybShlLmZpcnN0TmFtZSkuc3RhcnRzV2l0aCgnZW1pJykpO2lmKCFlbWlsaWUpe2VtaWxpZT17aWQ6RGF0ZS5ub3coKSxmaXJzdE5hbWU6J8OJbWlsaWUnLGZjSWQ6J0ZDLScscm9sZTonVmVuZGV1cihzZSknLGNvbnRyYWN0SG91cnM6MzUscmVzdERheXM6WzQsMF19O0QuZW1wbG95ZWVzLnB1c2goZW1pbGllKX1pZighZW1pbGllLmZpeGVkU2NoZWR1bGUpZW1pbGllLmZpeGVkU2NoZWR1bGU9dHBsRW1pbGllO2lmKCFlbWlsaWUucmVzdERheXN8fCFlbWlsaWUucmVzdERheXMubGVuZ3RoKWVtaWxpZS5yZXN0RGF5cz1bNCwwXTtjb25zdCB0cGxQYXVsQT17MTp7dHlwZTonUmVwb3MnfSwyOnt0eXBlOidSZXBvcyd9LDM6e3R5cGU6J1RyYXZhaWwnLHN0YXJ0QU06JycsZW5kQU06Jycsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J0NvbW1lcmNlJyxtMjonJyxtMzonJ30sNDp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MDAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J0FjdHViJyxtMjonJyxtMzonJ30sNTp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MDAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J0NvbW1lcmNlJyxtMjonJyxtMzonJ30sNjp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MzAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODozMCcsYnJlYWs6ZmFsc2UsbTE6J0NvbW1lcmNlJyxtMjonJyxtMzonJ30sMDp7dHlwZTonUmVwb3MnfX07Y29uc3QgdHBsUGF1bEI9ezE6e3R5cGU6J1RyYXZhaWwnLHN0YXJ0QU06JycsZW5kQU06Jycsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxNzowMCcsYnJlYWs6ZmFsc2UsbTE6J0NvbW1lcmNlJyxtMjonJyxtMzonJ30sMjp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MDAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxNzowMCcsYnJlYWs6ZmFsc2UsbTE6J0dlc3RSYXlvbicsbTI6JycsbTM6Jyd9LDM6e3R5cGU6J1RyYXZhaWwnLHN0YXJ0QU06JycsZW5kQU06Jycsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J0NvbW1lcmNlJyxtMjonJyxtMzonJ30sNDp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MDAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J0FjdHViJyxtMjonJyxtMzonJ30sNTp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MDAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODowMCcsYnJlYWs6ZmFsc2UsbTE6J0NvbW1lcmNlJyxtMjonJyxtMzonJ30sNjp7dHlwZTonVHJhdmFpbCcsc3RhcnRBTTonMTA6MzAnLGVuZEFNOicxMzowMCcsc3RhcnRQTTonMTQ6MDAnLGVuZFBNOicxODozMCcsYnJlYWs6ZmFsc2UsbTE6J0NvbW1lcmNlJyxtMjonJyxtMzonJ30sMDp7dHlwZTonUmVwb3MnfX07bGV0IHBhdWw9RC5lbXBsb3llZXMuZmluZChlPT5ub3JtKGUuZmlyc3ROYW1lKS5zdGFydHNXaXRoKCdwYXVsJykpO2lmKCFwYXVsKXtwYXVsPXtpZDpEYXRlLm5vdygpKzEsZmlyc3ROYW1lOidQYXVsaWFuYScsZmNJZDonRkMtJyxyb2xlOidWZW5kZXVyKHNlKScsY29udHJhY3RIb3VyczoyNSxjb250cmFjdEhvdXJzQjozNCxyZXN0RGF5czpbMF19O0QuZW1wbG95ZWVzLnB1c2gocGF1bCl9aWYoIXBhdWwuY29udHJhY3RIb3Vyc0IpcGF1bC5jb250cmFjdEhvdXJzQj0zNDtpZighcGF1bC5maXhlZFNjaGVkdWxlQSlwYXVsLmZpeGVkU2NoZWR1bGVBPXRwbFBhdWxBO2lmKCFwYXVsLmZpeGVkU2NoZWR1bGVCKXBhdWwuZml4ZWRTY2hlZHVsZUI9dHBsUGF1bEI7aWYocGF1bC5maXhlZFNjaGVkdWxlKWRlbGV0ZSBwYXVsLmZpeGVkU2NoZWR1bGU7bG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLEpTT04uc3RyaW5naWZ5KEQpKX0KCi8qID09PSBBVVRPLUxPR0lOIHZpYSBwb3N0TWVzc2FnZSBkZXB1aXMgbGUgcGFyZW50IFJlYWN0ID09PSAqLwpmdW5jdGlvbiBmaW5kT3JDcmVhdGVFbXBCeUZjKGZjLCBmaXJzdE5hbWUsIHJvbGUpewogIGlmKCFmYykgcmV0dXJuIG51bGw7CiAgY29uc3Qgbm9ybSA9IHMgPT4gKHN8fCcnKS50cmltKCkudG9VcHBlckNhc2UoKTsKICBsZXQgZW1wID0gRC5lbXBsb3llZXMuZmluZChlID0+IG5vcm0oZS5mY0lkKSA9PT0gbm9ybShmYykpOwogIGlmKCFlbXApewogICAgLy8gRXNzYXllciBkZSByZXRyb3V2ZXIgcGFyIHByw6lub20gc2kgcGFzIGRlIG1hdGNoIEZDCiAgICBpZihmaXJzdE5hbWUpewogICAgICBjb25zdCBub3JtTmFtZSA9IHMgPT4gKHN8fCcnKS50b0xvd2VyQ2FzZSgpLm5vcm1hbGl6ZSgnTkZEJykucmVwbGFjZSgvW1x1MDMwMC1cdTAzNmZdL2csJycpLnRyaW0oKTsKICAgICAgZW1wID0gRC5lbXBsb3llZXMuZmluZChlID0+IG5vcm1OYW1lKGUuZmlyc3ROYW1lKSA9PT0gbm9ybU5hbWUoZmlyc3ROYW1lKSk7CiAgICAgIGlmKGVtcCAmJiAhZW1wLmZjSWQpewogICAgICAgIGVtcC5mY0lkID0gZmM7IC8vIGFzc29jaWVyIGxlIEZDIMOgIGwnZW1wbG95w6kgZXhpc3RhbnQKICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShLRVksIEpTT04uc3RyaW5naWZ5KEQpKTsKICAgICAgfQogICAgfQogIH0KICBpZighZW1wKXsKICAgIGVtcCA9IHtpZDpEYXRlLm5vdygpK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDAwKSwgZmlyc3ROYW1lOmZpcnN0TmFtZXx8ZmMsIGZjSWQ6ZmMsIHJvbGU6cm9sZXx8J1ZlbmRldXIoc2UpJywgY29udHJhY3RIb3VyczozNSwgcmVzdERheXM6WzBdfTsKICAgIEQuZW1wbG95ZWVzLnB1c2goZW1wKTsKICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkoRCkpOwogIH0KICByZXR1cm4gZW1wOwp9CgpmdW5jdGlvbiBhdXRvTG9naW5Gcm9tUGFyZW50KHBheWxvYWQpewogIGlmKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmZjKSByZXR1cm47CiAgaWYocGF5bG9hZC5pc0FkbWluKXsKICAgIC8vIEFkbWluIDogbW9kZSBHw6lyYW50IGNvbXBsZXQsIHZpc2liaWxpdMOpIHRvdGFsZQogICAgRC5zZXNzaW9uID0ge3JvbGU6J21hbmFnZXInLCBlbXBJZDpudWxsfTsKICB9IGVsc2UgewogICAgY29uc3QgZW1wID0gZmluZE9yQ3JlYXRlRW1wQnlGYyhwYXlsb2FkLmZjLCBwYXlsb2FkLnByZW5vbSwgcGF5bG9hZC5yb2xlKTsKICAgIGlmKGVtcCkgRC5zZXNzaW9uID0ge3JvbGU6J2VtcGxveWVlJywgZW1wSWQ6ZW1wLmlkfTsKICB9CiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBKU09OLnN0cmluZ2lmeShEKSk7CiAgLy8gTWFzcXVlciBsYSBtb2RhbGUgbG9naW4gc2kgdmlzaWJsZQogIGNvbnN0IGxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luTW9kYWwnKTsKICBpZihsbSkgbG0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7CiAgYXBwbHlTZXNzaW9uKCk7CiAgLy8gQmxvYyBkZW1hbmRlIGRlIGNvbmfDqXMgdW5pcXVlbWVudCBwb3VyIHNhbGFyacOpcwogIGlmKCFpc01hbmFnZXIoKSl7CiAgICBpbmplY3RWYWNhdGlvbkJsb2NrKCk7CiAgfSBlbHNlIHsKICAgIGNvbnN0IGV4aXN0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhY1JlcUJsb2NrJyk7CiAgICBpZihleGlzdGluZykgZXhpc3RpbmcucmVtb3ZlKCk7CiAgfQogIHJlbmRlcigpOwp9CgovKiA9PT0gSU5KRUNUSU9OIDogYmxvYyAiTWVzIGRlbWFuZGVzIGRlIGNvbmfDqXMiIChjw7R0w6kgc2FsYXJpw6kpID09PSAqLwpmdW5jdGlvbiBpbmplY3RWYWNhdGlvbkJsb2NrKCl7CiAgaWYoaXNNYW5hZ2VyKCkpIHJldHVybjsKICBpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmFjUmVxQmxvY2snKSkgcmV0dXJuOwogIGNvbnN0IGVtcCA9IGN1cnJlbnRVc2VyKCk7CiAgaWYoIWVtcCkgcmV0dXJuOwogIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgYmxvY2suaWQgPSAndmFjUmVxQmxvY2snOwogIGJsb2NrLnN0eWxlLmNzc1RleHQgPSAnbWFyZ2luOjAgMTRweCAxNHB4O2JhY2tncm91bmQ6I2ZmZjtib3JkZXItcmFkaXVzOjEwcHg7cGFkZGluZzoxNnB4O2JveC1zaGFkb3c6MCAycHggMTJweCByZ2JhKDEzLDQwLDcwLC4wOCk7Ym9yZGVyLWxlZnQ6NHB4IHNvbGlkICMxZGI5NTQnOwogIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsKICBoZWFkLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjttYXJnaW4tYm90dG9tOjEycHgnOwogIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgdGl0bGUuc3R5bGUuY3NzVGV4dCA9ICdmb250LXdlaWdodDo3MDA7Y29sb3I6IzBkMjg0Njtmb250LXNpemU6Ljk1cmVtJzsKICB0aXRsZS50ZXh0Q29udGVudCA9ICfwn4+W77iPIE1lcyBkZW1hbmRlcyBkZSBjb25nw6lzJzsKICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTsKICBidG4uY2xhc3NOYW1lID0gJ2J0biBidG4tb2sgYnRuLXNtJzsKICBidG4uaW5uZXJIVE1MID0gJzxpIGNsYXNzPSJmYXMgZmEtcGx1cyI+PC9pPiBOb3V2ZWxsZSBkZW1hbmRlJzsKICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmFjYXRpb25SZXF1ZXN0KTsKICBoZWFkLmFwcGVuZENoaWxkKHRpdGxlKTsKICBoZWFkLmFwcGVuZENoaWxkKGJ0bik7CiAgY29uc3QgbGlzdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogIGxpc3REaXYuaWQgPSAnbXlWYWNMaXN0JzsKICBsaXN0RGl2LnN0eWxlLmNzc1RleHQgPSAnZm9udC1zaXplOi44MnJlbTtjb2xvcjojODg5NmE4JzsKICBsaXN0RGl2LnRleHRDb250ZW50ID0gJ0NoYXJnZW1lbnTigKYnOwogIGJsb2NrLmFwcGVuZENoaWxkKGhlYWQpOwogIGJsb2NrLmFwcGVuZENoaWxkKGxpc3REaXYpOwogIGNvbnN0IHRibFdyYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGJsV3JhcCcpOwogIHRibFdyYXAucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYmxvY2ssIHRibFdyYXAubmV4dFNpYmxpbmcpOwogIHJlZnJlc2hNeVZhY2F0aW9ucygpOwp9CgpmdW5jdGlvbiByZWZyZXNoTXlWYWNhdGlvbnMoKXsKICBjb25zdCBsaXN0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlWYWNMaXN0Jyk7CiAgaWYoIWxpc3RFbCkgcmV0dXJuOwogIGNvbnN0IGVtcCA9IGN1cnJlbnRVc2VyKCk7CiAgaWYoIWVtcCl7IGxpc3RFbC5pbm5lckhUTUw9Jyc7IHJldHVybjsgfQogIGNvbnN0IHJlcXVlc3RzID0gKEQudmFjYXRpb25SZXF1ZXN0c3x8W10pLmZpbHRlcihyID0+IHIuZmMgJiYgZW1wLmZjSWQgJiYgci5mYy50b1VwcGVyQ2FzZSgpID09PSBlbXAuZmNJZC50b1VwcGVyQ2FzZSgpKTsKICBsaXN0RWwuaW5uZXJIVE1MID0gJyc7CiAgaWYoIXJlcXVlc3RzLmxlbmd0aCl7CiAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogICAgZW1wdHkuc3R5bGUuY3NzVGV4dCA9ICd0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojODg5NmE4O3BhZGRpbmc6MTJweCAwO2ZvbnQtc3R5bGU6aXRhbGljJzsKICAgIGVtcHR5LmlubmVySFRNTCA9ICdBdWN1bmUgZGVtYW5kZS4gVGFwZXogPHN0cm9uZz5Ob3V2ZWxsZSBkZW1hbmRlPC9zdHJvbmc+IHBvdXIgZW4gZmFpcmUgdW5lLic7CiAgICBsaXN0RWwuYXBwZW5kQ2hpbGQoZW1wdHkpOwogICAgcmV0dXJuOwogIH0KICByZXF1ZXN0cy5zb3J0KChhLGIpID0+IGIuY3JlYXRlZEF0IC0gYS5jcmVhdGVkQXQpOwogIGZvcihjb25zdCByIG9mIHJlcXVlc3RzKXsKICAgIGNvbnN0IGNvbmYgPSB7CiAgICAgIHBlbmRpbmc6IHtiZzonI2ZmZmJlYycsIGJyOicjZmRlNjhhJywgY29sOicjOTI0MDBlJywgbGJsOifij7MgRW4gYXR0ZW50ZSBkZSB2YWxpZGF0aW9uJ30sCiAgICAgIGFwcHJvdmVkOntiZzonI2VjZmRmNScsIGJyOicjNmVlN2I3JywgY29sOicjMDY1ZjQ2JywgbGJsOifinJMgVmFsaWTDqWUnfSwKICAgICAgcmVqZWN0ZWQ6e2JnOicjZmVmMmYyJywgYnI6JyNmY2E1YTUnLCBjb2w6JyM5OTFiMWInLCBsYmw6J+KclyBSZWZ1c8OpZSd9CiAgICB9W3Iuc3RhdHVzXSB8fCB7Ymc6JyNmOGY5ZmEnLCBicjonI2UyZThmMicsIGNvbDonIzQ3NTU2OScsIGxibDpyLnN0YXR1c307CiAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgICBjYXJkLnN0eWxlLmNzc1RleHQgPSAnYmFja2dyb3VuZDonK2NvbmYuYmcrJztib3JkZXI6MXB4IHNvbGlkICcrY29uZi5icisnO2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MTBweCAxMnB4O21hcmdpbi1ib3R0b206OHB4JzsKICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogICAgcm93LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7Z2FwOjhweDtmbGV4LXdyYXA6d3JhcCc7CiAgICBjb25zdCBpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgICBpbmZvLmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPSJmb250LXdlaWdodDo3MDA7Y29sb3I6IzFhMjU0MCI+Jytlc2NhcGVIdG1sKHIudHlwZSkrJyDigJQgZHUgJytmb3JtYXREYXRlRnIyKHIuc3RhcnQpKycgYXUgJytmb3JtYXREYXRlRnIyKHIuZW5kKSsnPC9kaXY+JwogICAgICArIChyLnJlYXNvbiA/ICc8ZGl2IHN0eWxlPSJmb250LXNpemU6Ljc2cmVtO2NvbG9yOiM2NDc0OGI7bWFyZ2luLXRvcDoycHg7Zm9udC1zdHlsZTppdGFsaWMiPk1vdGlmIDogJytlc2NhcGVIdG1sKHIucmVhc29uKSsnPC9kaXY+JyA6ICcnKQogICAgICArICc8ZGl2IHN0eWxlPSJmb250LXNpemU6LjcycmVtO2NvbG9yOicrY29uZi5jb2wrJztmb250LXdlaWdodDo3MDA7bWFyZ2luLXRvcDo0cHgiPicrY29uZi5sYmwrJzwvZGl2PicKICAgICAgKyAoci5yZXZpZXdlZEJ5UHJlbm9tID8gJzxkaXYgc3R5bGU9ImZvbnQtc2l6ZTouNjhyZW07Y29sb3I6IzY0NzQ4YiI+cGFyICcrZXNjYXBlSHRtbChyLnJldmlld2VkQnlQcmVub20pKycgbGUgJytmb3JtYXREYXRlRnIyKHIucmV2aWV3ZWRBdCkrJzwvZGl2PicgOiAnJykKICAgICAgKyAoci5hZG1pbk5vdGUgPyAnPGRpdiBzdHlsZT0iZm9udC1zaXplOi43MnJlbTtjb2xvcjonK2NvbmYuY29sKyc7bWFyZ2luLXRvcDozcHgiPvCfkqwgJytlc2NhcGVIdG1sKHIuYWRtaW5Ob3RlKSsnPC9kaXY+JyA6ICcnKTsKICAgIHJvdy5hcHBlbmRDaGlsZChpbmZvKTsKICAgIGlmKHIuc3RhdHVzID09PSAncGVuZGluZycpewogICAgICBjb25zdCBkZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTsKICAgICAgZGVsQnRuLmNsYXNzTmFtZSA9ICdidG4gYnRuLWVyciBidG4tc20nOwogICAgICBkZWxCdG4uaW5uZXJIVE1MID0gJzxpIGNsYXNzPSJmYXMgZmEtdGltZXMiPjwvaT4nOwogICAgICBkZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjYW5jZWxWYWNhdGlvblJlcXVlc3Qoci5pZCkpOwogICAgICByb3cuYXBwZW5kQ2hpbGQoZGVsQnRuKTsKICAgIH0KICAgIGNhcmQuYXBwZW5kQ2hpbGQocm93KTsKICAgIGxpc3RFbC5hcHBlbmRDaGlsZChjYXJkKTsKICB9Cn0KCmZ1bmN0aW9uIGZvcm1hdERhdGVGcjIodHMpewogIGlmKCF0cykgcmV0dXJuICcnOwogIGNvbnN0IGQgPSB0eXBlb2YgdHMgPT09ICdzdHJpbmcnID8gbmV3IERhdGUodHMpIDogbmV3IERhdGUodHMpOwogIHJldHVybiBkLnRvTG9jYWxlRGF0ZVN0cmluZygnZnItRlInLHtkYXk6JzItZGlnaXQnLG1vbnRoOidzaG9ydCcseWVhcjonbnVtZXJpYyd9KTsKfQoKZnVuY3Rpb24gZXNjYXBlSHRtbChzKXsKICByZXR1cm4gU3RyaW5nKHN8fCcnKS5yZXBsYWNlKC9bJjw+Il0vZywgYyA9PiAoeycmJzonJmFtcDsnLCc8JzonJmx0OycsJz4nOicmZ3Q7JywnIic6JyZxdW90Oyd9W2NdKSk7Cn0KCmZ1bmN0aW9uIG9wZW5WYWNhdGlvblJlcXVlc3QoKXsKICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogIG1vZGFsLmNsYXNzTmFtZSA9ICdtb3ZlcmxheSc7CiAgbW9kYWwuaWQgPSAndmFjUmVxTW9kYWwnOwogIGNvbnN0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogIGJveC5jbGFzc05hbWUgPSAnbWJveCc7CiAgY29uc3QgaGRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgaGRyLmNsYXNzTmFtZSA9ICdtaGRyJzsKICBoZHIuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9Im10aXRsZSI+PGkgY2xhc3M9ImZhcyBmYS11bWJyZWxsYS1iZWFjaCI+PC9pPiBOb3V2ZWxsZSBkZW1hbmRlIGRlIGNvbmfDqTwvZGl2Pic7CiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTsKICBjbG9zZUJ0bi5jbGFzc05hbWUgPSAnbWNsb3NlJzsKICBjbG9zZUJ0bi5pbm5lckhUTUwgPSAnPGkgY2xhc3M9ImZhcyBmYS10aW1lcyI+PC9pPic7CiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBtb2RhbC5yZW1vdmUoKSk7CiAgaGRyLmFwcGVuZENoaWxkKGNsb3NlQnRuKTsKICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgYm9keS5jbGFzc05hbWUgPSAnbWJvZHknOwogIGJvZHkuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9ImJhY2tncm91bmQ6I2VlZjJmZjtib3JkZXI6MXB4IHNvbGlkICNjN2QyZmU7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzoxMHB4IDEzcHg7Zm9udC1zaXplOi43OHJlbTtjb2xvcjojMzczMGEzO21hcmdpbi1ib3R0b206MTRweDtsaW5lLWhlaWdodDoxLjUiPjxpIGNsYXNzPSJmYXMgZmEtaW5mby1jaXJjbGUiPjwvaT4gVm90cmUgZGVtYW5kZSBzZXJhIGVudm95w6llIGF1IGfDqXJhbnQgcG91ciB2YWxpZGF0aW9uLiBVbmUgZm9pcyB2YWxpZMOpZSwgbGVzIGRhdGVzIHNlcm9udCBhdXRvbWF0aXF1ZW1lbnQgYWpvdXTDqWVzIMOgIHZvdHJlIHBsYW5uaW5nLjwvZGl2PicKICAgICsgJzxkaXYgY2xhc3M9ImZyb3ciPjxkaXYgY2xhc3M9ImZnIj48bGFiZWwgY2xhc3M9ImZsYmwiPkRhdGUgZGUgZMOpYnV0ICo8L2xhYmVsPjxpbnB1dCB0eXBlPSJkYXRlIiBpZD0idmFjU3RhcnQiIGNsYXNzPSJmYyIgcmVxdWlyZWQ+PC9kaXY+PGRpdiBjbGFzcz0iZmciPjxsYWJlbCBjbGFzcz0iZmxibCI+RGF0ZSBkZSBmaW4gKjwvbGFiZWw+PGlucHV0IHR5cGU9ImRhdGUiIGlkPSJ2YWNFbmQiIGNsYXNzPSJmYyIgcmVxdWlyZWQ+PC9kaXY+PC9kaXY+JwogICAgKyAnPGRpdiBjbGFzcz0iZmciPjxsYWJlbCBjbGFzcz0iZmxibCI+VHlwZSAqPC9sYWJlbD48c2VsZWN0IGlkPSJ2YWNUeXBlIiBjbGFzcz0iZnMiPjxvcHRpb24gdmFsdWU9IlZhY2FuY2VzIj5WYWNhbmNlcyAvIENQPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iUlRUIj5SVFQ8L29wdGlvbj48b3B0aW9uIHZhbHVlPSJGb3JtYXRpb24iPkZvcm1hdGlvbjwvb3B0aW9uPjxvcHRpb24gdmFsdWU9Ik1hbGFkaWUiPk1hbGFkaWU8L29wdGlvbj48L3NlbGVjdD48L2Rpdj4nCiAgICArICc8ZGl2IGNsYXNzPSJmZyI+PGxhYmVsIGNsYXNzPSJmbGJsIj5Nb3RpZiAoZmFjdWx0YXRpZik8L2xhYmVsPjx0ZXh0YXJlYSBpZD0idmFjUmVhc29uIiBjbGFzcz0iZmMiIHJvd3M9IjIiIHBsYWNlaG9sZGVyPSJWYWNhbmNlcyDDqXTDqSwgw6l2w6luZW1lbnQgZmFtaWxpYWwuLi4iPjwvdGV4dGFyZWE+PC9kaXY+JzsKICBjb25zdCBhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgYWN0aW9ucy5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2p1c3RpZnktY29udGVudDpmbGV4LWVuZDttYXJnaW4tdG9wOjEycHgnOwogIGNvbnN0IGNhbmNlbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpOwogIGNhbmNlbEJ0bi50eXBlID0gJ2J1dHRvbic7CiAgY2FuY2VsQnRuLmNsYXNzTmFtZSA9ICdidG4gYnRuLWdob3N0JzsKICBjYW5jZWxCdG4udGV4dENvbnRlbnQgPSAnQW5udWxlcic7CiAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gbW9kYWwucmVtb3ZlKCkpOwogIGNvbnN0IHN1Ym1pdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpOwogIHN1Ym1pdEJ0bi50eXBlID0gJ2J1dHRvbic7CiAgc3VibWl0QnRuLmNsYXNzTmFtZSA9ICdidG4gYnRuLW9rJzsKICBzdWJtaXRCdG4uaW5uZXJIVE1MID0gJzxpIGNsYXNzPSJmYXMgZmEtcGFwZXItcGxhbmUiPjwvaT4gRW52b3llciBsYSBkZW1hbmRlJzsKICBzdWJtaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXRWYWNhdGlvblJlcXVlc3QpOwogIGFjdGlvbnMuYXBwZW5kQ2hpbGQoY2FuY2VsQnRuKTsKICBhY3Rpb25zLmFwcGVuZENoaWxkKHN1Ym1pdEJ0bik7CiAgYm9keS5hcHBlbmRDaGlsZChhY3Rpb25zKTsKICBib3guYXBwZW5kQ2hpbGQoaGRyKTsKICBib3guYXBwZW5kQ2hpbGQoYm9keSk7CiAgbW9kYWwuYXBwZW5kQ2hpbGQoYm94KTsKICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTsKfQoKZnVuY3Rpb24gc3VibWl0VmFjYXRpb25SZXF1ZXN0KCl7CiAgY29uc3QgZW1wID0gY3VycmVudFVzZXIoKTsKICBpZighZW1wKXsgdG9hc3QoJ1Nlc3Npb24gaW52YWxpZGUnLCdkYW5nZXInKTsgcmV0dXJuOyB9CiAgY29uc3Qgc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmFjU3RhcnQnKS52YWx1ZTsKICBjb25zdCBlbmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmFjRW5kJykudmFsdWU7CiAgY29uc3QgdHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWNUeXBlJykudmFsdWU7CiAgY29uc3QgcmVhc29uID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWNSZWFzb24nKS52YWx1ZSB8fCAnJykudHJpbSgpOwogIGlmKCFzdGFydCB8fCAhZW5kKXsgdG9hc3QoJ0xlcyBkYXRlcyBzb250IG9ibGlnYXRvaXJlcycsJ3dhcm5pbmcnKTsgcmV0dXJuOyB9CiAgaWYoc3RhcnQgPiBlbmQpeyB0b2FzdCgnRGF0ZSBkZSBmaW4gYXZhbnQgZMOpYnV0JywnZGFuZ2VyJyk7IHJldHVybjsgfQogIGNvbnN0IHJlcXVlc3QgPSB7CiAgICBpZDogRGF0ZS5ub3coKS50b1N0cmluZygzNikrTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiw3KSwKICAgIGZjOiBlbXAuZmNJZCwKICAgIHByZW5vbTogZW1wLmZpcnN0TmFtZSwKICAgIHJvbGU6IGVtcC5yb2xlLAogICAgc3RhcnQsIGVuZCwgdHlwZSwgcmVhc29uLAogICAgc3RhdHVzOiAncGVuZGluZycsCiAgICBjcmVhdGVkQXQ6IERhdGUubm93KCkKICB9OwogIGlmKCFELnZhY2F0aW9uUmVxdWVzdHMpIEQudmFjYXRpb25SZXF1ZXN0cyA9IFtdOwogIEQudmFjYXRpb25SZXF1ZXN0cy5wdXNoKHJlcXVlc3QpOwogIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkoRCkpOwogIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhY1JlcU1vZGFsJyk7CiAgaWYobW9kYWwpIG1vZGFsLnJlbW92ZSgpOwogIHJlZnJlc2hNeVZhY2F0aW9ucygpOwogIHRyeXsgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7c291cmNlOidwbGFubmluZy1mODkwJywgYWN0aW9uOid2YWNhdGlvbl9yZXF1ZXN0JywgcmVxdWVzdH0sICcqJyk7IH1jYXRjaChlKXt9CiAgdG9hc3QoJ0RlbWFuZGUgZW52b3nDqWUnLCdzdWNjZXNzJyk7Cn0KCmZ1bmN0aW9uIGNhbmNlbFZhY2F0aW9uUmVxdWVzdChpZCl7CiAgY29uZmlybTIoJ0FubnVsZXIgY2V0dGUgZGVtYW5kZSA/JywgKCkgPT4gewogICAgRC52YWNhdGlvblJlcXVlc3RzID0gKEQudmFjYXRpb25SZXF1ZXN0c3x8W10pLmZpbHRlcihyID0+IHIuaWQgIT09IGlkKTsKICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkoRCkpOwogICAgcmVmcmVzaE15VmFjYXRpb25zKCk7CiAgICB0cnl7IHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe3NvdXJjZToncGxhbm5pbmctZjg5MCcsIGFjdGlvbjondmFjYXRpb25fY2FuY2VsJywgaWR9LCAnKicpOyB9Y2F0Y2goZSl7fQogICAgdG9hc3QoJ0RlbWFuZGUgYW5udWzDqWUnLCdpbmZvJyk7CiAgfSwgJ/Cfl5HvuI8nKTsKfQoKLyogPT09IFLDqWN1cMOpcmVyIHVuZSBkZW1hbmRlIHZhbGlkw6llIHBhciBhZG1pbiBldCBsYSBwcm9wYWdlciBkYW5zIGFic2VuY2VzID09PSAqLwpmdW5jdGlvbiBhcHBseUFwcHJvdmVkVmFjYXRpb24ocmVxdWVzdCl7CiAgY29uc3QgZW1wID0gRC5lbXBsb3llZXMuZmluZChlID0+IGUuZmNJZCAmJiByZXF1ZXN0LmZjICYmIGUuZmNJZC50b1VwcGVyQ2FzZSgpID09PSByZXF1ZXN0LmZjLnRvVXBwZXJDYXNlKCkpOwogIGlmKCFlbXApIHJldHVybjsKICBpZighRC5hYnNlbmNlcykgRC5hYnNlbmNlcyA9IFtdOwogIC8vIMOJdml0ZXIgbGVzIGRvdWJsb25zCiAgY29uc3QgYWxyZWFkeSA9IEQuYWJzZW5jZXMuZmluZChhID0+IGEuZW1wSWQgPT09IGVtcC5pZCAmJiBhLnN0YXJ0ID09PSByZXF1ZXN0LnN0YXJ0ICYmIGEuZW5kID09PSByZXF1ZXN0LmVuZCAmJiBhLnR5cGUgPT09IHJlcXVlc3QudHlwZSk7CiAgaWYoIWFscmVhZHkpewogICAgRC5hYnNlbmNlcy5wdXNoKHtpZDpEYXRlLm5vdygpK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDAwKSwgZW1wSWQ6ZW1wLmlkLCBzdGFydDpyZXF1ZXN0LnN0YXJ0LCBlbmQ6cmVxdWVzdC5lbmQsIHR5cGU6cmVxdWVzdC50eXBlfSk7CiAgfQogIC8vIE1ldHRyZSDDoCBqb3VyIGxlIHN0YXR1dCBsb2NhbCBhdXNzaQogIGlmKCFELnZhY2F0aW9uUmVxdWVzdHMpIEQudmFjYXRpb25SZXF1ZXN0cyA9IFtdOwogIGNvbnN0IGV4aXN0aW5nID0gRC52YWNhdGlvblJlcXVlc3RzLmZpbmQociA9PiByLmlkID09PSByZXF1ZXN0LmlkKTsKICBpZihleGlzdGluZyl7CiAgICBPYmplY3QuYXNzaWduKGV4aXN0aW5nLCByZXF1ZXN0KTsKICB9IGVsc2UgewogICAgRC52YWNhdGlvblJlcXVlc3RzLnB1c2gocmVxdWVzdCk7CiAgfQogIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkoRCkpOwogIHJlZnJlc2hNeVZhY2F0aW9ucygpOwogIHJlbmRlcigpOwp9CgovKiA9PT0gw4ljb3V0ZSBkZXMgbWVzc2FnZXMgZHUgcGFyZW50IFJlYWN0ID09PSAqLwp3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCk9PnsKICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YTsKICBpZighZGF0YSB8fCBkYXRhLnNvdXJjZSAhPT0gJ2NvbGxlY3RpZi1pbnRlcm5lJykgcmV0dXJuOwogIGlmKGRhdGEuYWN0aW9uID09PSAnYXV0b19sb2dpbicpewogICAgYXV0b0xvZ2luRnJvbVBhcmVudChkYXRhLnBheWxvYWQpOwogIH0gZWxzZSBpZihkYXRhLmFjdGlvbiA9PT0gJ3ZhY2F0aW9uX2FwcHJvdmVkJyB8fCBkYXRhLmFjdGlvbiA9PT0gJ3ZhY2F0aW9uX3JlamVjdGVkJyl7CiAgICAvLyBMJ2FkbWluIGEgdmFsaWTDqS9yZWZ1c8OpIGRlcHVpcyBsJ2FwcCBSZWFjdAogICAgaWYoIUQudmFjYXRpb25SZXF1ZXN0cykgRC52YWNhdGlvblJlcXVlc3RzID0gW107CiAgICBjb25zdCBleGlzdGluZyA9IEQudmFjYXRpb25SZXF1ZXN0cy5maW5kKHIgPT4gci5pZCA9PT0gZGF0YS5yZXF1ZXN0LmlkKTsKICAgIGlmKGV4aXN0aW5nKXsgT2JqZWN0LmFzc2lnbihleGlzdGluZywgZGF0YS5yZXF1ZXN0KTsgfQogICAgZWxzZSBELnZhY2F0aW9uUmVxdWVzdHMucHVzaChkYXRhLnJlcXVlc3QpOwogICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBKU09OLnN0cmluZ2lmeShEKSk7CiAgICBpZihkYXRhLmFjdGlvbiA9PT0gJ3ZhY2F0aW9uX2FwcHJvdmVkJyl7CiAgICAgIGFwcGx5QXBwcm92ZWRWYWNhdGlvbihkYXRhLnJlcXVlc3QpOwogICAgfSBlbHNlIHsKICAgICAgcmVmcmVzaE15VmFjYXRpb25zKCk7CiAgICB9CiAgfSBlbHNlIGlmKGRhdGEuYWN0aW9uID09PSAnc3luY19yZXF1ZXN0cycpewogICAgLy8gU3luY2hybyBpbml0aWFsZSBkZSB0b3V0ZXMgbGVzIGRlbWFuZGVzCiAgICBELnZhY2F0aW9uUmVxdWVzdHMgPSBkYXRhLnJlcXVlc3RzIHx8IFtdOwogICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBKU09OLnN0cmluZ2lmeShEKSk7CiAgICByZWZyZXNoTXlWYWNhdGlvbnMoKTsKICB9IGVsc2UgaWYoZGF0YS5hY3Rpb24gPT09ICdwcmludCcgfHwgZGF0YS5hY3Rpb24gPT09ICdyZXF1ZXN0X3ByaW50X2h0bWwnKXsKICAgIC8vIFJlY29uc3RydWl0IHVuIEhUTUwgYXV0b25vbWUgYXZlYyBsZSBjb250ZW51IGFjdHVlbCBldCBsZXMgc3R5bGVzIGlubGluZQogICAgdHJ5ewogICAgICBjb25zdCBodG1sQ29udGVudCA9IGJ1aWxkUHJpbnRhYmxlSHRtbCgpOwogICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsKICAgICAgICBzb3VyY2U6ICdwbGFubmluZy1mODkwJywKICAgICAgICBhY3Rpb246ICdwcmludF9odG1sJywKICAgICAgICBodG1sOiBodG1sQ29udGVudAogICAgICB9LCAnKicpOwogICAgfWNhdGNoKGUpeyBjb25zb2xlLmVycm9yKCdDb25zdHJ1Y3Rpb24gSFRNTCBpbXByZXNzaW9uIMOpY2hvdcOpZTonLCBlKTsgfQogIH0gZWxzZSBpZihkYXRhLmFjdGlvbiA9PT0gJ3JlcXVlc3RfaHJfZGF0YScpewogICAgLy8gUmVudm9pZSBsJ2Vuc2VtYmxlIGRlcyBkb25uw6llcyBSSCBkaXNwb25pYmxlcwogICAgdHJ5ewogICAgICBjb25zdCBockRhdGEgPSBidWlsZEhyRGF0YSgpOwogICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsKICAgICAgICBzb3VyY2U6ICdwbGFubmluZy1mODkwJywKICAgICAgICBhY3Rpb246ICdocl9kYXRhJywKICAgICAgICBkYXRhOiBockRhdGEKICAgICAgfSwgJyonKTsKICAgIH1jYXRjaChlKXsgY29uc29sZS5lcnJvcignRXhwb3J0IFJIIMOpY2hvdcOpOicsIGUpOyB9CiAgfQp9KTsKCmZ1bmN0aW9uIGJ1aWxkSHJEYXRhKCl7CiAgY29uc3QgZW1wbG95ZWVzID0gKEQuZW1wbG95ZWVzfHxbXSkubWFwKGUgPT4gKHsKICAgIGlkOiBlLmlkLAogICAgZmlyc3ROYW1lOiBlLmZpcnN0TmFtZSwKICAgIGZjSWQ6IGUuZmNJZCB8fCAnJywKICAgIHJvbGU6IGUucm9sZSB8fCAnJywKICAgIGNvbnRyYWN0SG91cnM6IGUuY29udHJhY3RIb3VycyB8fCAzNSwKICAgIGNvbnRyYWN0SG91cnNCOiBlLmNvbnRyYWN0SG91cnNCIHx8IG51bGwsCiAgICByZXN0RGF5czogZS5yZXN0RGF5cyB8fCBbXSwKICAgIGhhc0ZpeGVkU2NoZWR1bGU6ICEhKGUuZml4ZWRTY2hlZHVsZSB8fCBlLmZpeGVkU2NoZWR1bGVBIHx8IGUuZml4ZWRTY2hlZHVsZUIpLAogICAgaGFzQWx0ZXJuYXRpb246ICEhKGUuZml4ZWRTY2hlZHVsZUEgJiYgZS5maXhlZFNjaGVkdWxlQiksCiAgfSkpOwogIGNvbnN0IGFic2VuY2VzID0gKEQuYWJzZW5jZXN8fFtdKS5tYXAoYSA9PiAoewogICAgaWQ6IGEuaWQsCiAgICBlbXBJZDogYS5lbXBJZCwKICAgIHN0YXJ0OiBhLnN0YXJ0LAogICAgZW5kOiBhLmVuZCwKICAgIHR5cGU6IGEudHlwZQogIH0pKTsKICAvLyBDYWxjdWxlciBsZXMgaGV1cmVzIGRlIGxhIHNlbWFpbmUgY291cmFudGUgcGFyIGVtcGxvecOpCiAgY29uc3QgbW9uZGF5ID0gZ2V0TW9uZGF5KGN1ckRhdGUpOwogIGNvbnN0IHdlZWtIb3VycyA9IHt9OwogIGVtcGxveWVlcy5mb3JFYWNoKGVtcCA9PiB7CiAgICBsZXQgbWlucyA9IDA7CiAgICBmb3IobGV0IGk9MDtpPDc7aSsrKXsKICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKG1vbmRheSk7CiAgICAgIGQuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpK2kpOwogICAgICBjb25zdCBkayA9IGZJc28oZCk7CiAgICAgIGNvbnN0IGRhdGEgPSBELnNjaGVkdWxlW2VtcC5pZCsnXycrZGtdOwogICAgICBpZihkYXRhICYmIGRhdGEudHlwZT09PSdUcmF2YWlsJyl7CiAgICAgICAgbWlucyArPSBjYWxjTWlucyhkYXRhKTsKICAgICAgfQogICAgfQogICAgd2Vla0hvdXJzW2VtcC5pZF0gPSBNYXRoLnJvdW5kKG1pbnMvNjAqMTAwKS8xMDA7CiAgfSk7CiAgcmV0dXJuIHsKICAgIGVtcGxveWVlcywKICAgIGFic2VuY2VzLAogICAgd2Vla0hvdXJzLAogICAgd2Vla1N0YXJ0OiBmSXNvKG1vbmRheSksCiAgICBleHBvcnRlZEF0OiBEYXRlLm5vdygpCiAgfTsKfQoKZnVuY3Rpb24gYnVpbGRQcmludGFibGVIdG1sKCl7CiAgLy8gUsOpY3Vww6hyZSBsZXMgZmV1aWxsZXMgZGUgc3R5bGUgYWN0dWVsbGVzCiAgbGV0IHN0eWxlcyA9ICcnOwogIGZvcihjb25zdCBzaGVldCBvZiBkb2N1bWVudC5zdHlsZVNoZWV0cyl7CiAgICB0cnl7CiAgICAgIGlmKHNoZWV0LmNzc1J1bGVzKXsKICAgICAgICBmb3IoY29uc3QgcnVsZSBvZiBzaGVldC5jc3NSdWxlcyl7CiAgICAgICAgICBzdHlsZXMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xuJzsKICAgICAgICB9CiAgICAgIH0KICAgIH1jYXRjaChlKXsgLyogQ09SUyAqLyB9CiAgfQogIC8vIENsb25lIGxlIG1haW4gY29udGVudAogIGNvbnN0IG1haW5FbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSB8fCBkb2N1bWVudC5ib2R5OwogIGNvbnN0IGNsb25lZCA9IG1haW5FbC5jbG9uZU5vZGUodHJ1ZSk7CiAgLy8gU3VwcHJpbWUgw6lsw6ltZW50cyBpbnV0aWxlcwogIFsnbG9naW5Nb2RhbCcsJ3ZhY1JlcU1vZGFsJywndG9hc3RXcmFwJywnY29uZmlybVdyYXAnLCdmYWInLCdib3QtbmF2J10uZm9yRWFjaChpZD0+ewogICAgY29uc3QgZWwgPSBjbG9uZWQucXVlcnlTZWxlY3RvcignIycraWQpIHx8IGNsb25lZC5xdWVyeVNlbGVjdG9yKCcuJytpZCk7CiAgICBpZihlbCkgZWwucmVtb3ZlKCk7CiAgfSk7CiAgY29uc3QgbW9kYWxzID0gY2xvbmVkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb3ZlcmxheSwuY2ZtLXdyYXAsLnRvYXN0LXdyYXAsLmJvdC1uYXYsLmZhYicpOwogIG1vZGFscy5mb3JFYWNoKG0gPT4gbS5yZW1vdmUoKSk7CgogIC8vIENvbnN0cnVpdCB1biBIVE1MIGF1dG9ub21lCiAgcmV0dXJuIGA8IWRvY3R5cGUgaHRtbD4KPGh0bWwgbGFuZz0iZnIiPgo8aGVhZD4KPG1ldGEgY2hhcnNldD0idXRmLTgiPgo8dGl0bGU+UGxhbm5pbmcgRjg5MCDigJQgJHtuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZygnZnItRlInKX08L3RpdGxlPgo8c3R5bGU+CiR7c3R5bGVzfQovKiBPdmVycmlkZSA6IHMnaW1wcmltZSBkaXJlY3RlbWVudCAqLwpib2R5IHsgYmFja2dyb3VuZDogI2ZmZiAhaW1wb3J0YW50OyBtYXJnaW46IDA7IHBhZGRpbmc6IDEwcHg7IGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksLWFwcGxlLXN5c3RlbSxTZWdvZSBVSSxSb2JvdG8sc2Fucy1zZXJpZjsgfQouYXBwLWhlYWRlciwgLndlZWstbmF2LCAuYm90LW5hdiwgLmZhYiwgLnRvYXN0LXdyYXAsIC5tb3ZlcmxheSwgLmNmbS13cmFwLCAuZGF5LWFjdHMsIC5wcmVzZXQtc2VsLCB0Zm9vdCB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfQoucHJudC1oZHIgeyBkaXNwbGF5OiBmbGV4ICFpbXBvcnRhbnQ7IH0KLnRibC13cmFwIHsgYm94LXNoYWRvdzogbm9uZTsgb3ZlcmZsb3c6IHZpc2libGU7IG1hcmdpbjogMDsgYm9yZGVyLXJhZGl1czogMDsgfQoudGQtZW1wLCAudGFibGUucGxhbiB0aGVhZCB0aCB7IHBvc2l0aW9uOiBzdGF0aWMgIWltcG9ydGFudDsgfQp0YWJsZS5wbGFuIHRoZWFkIHRoIHsgYmFja2dyb3VuZDogIzBkMjg0NiAhaW1wb3J0YW50OyBjb2xvcjogI2ZmZiAhaW1wb3J0YW50OyAtd2Via2l0LXByaW50LWNvbG9yLWFkanVzdDogZXhhY3Q7IHByaW50LWNvbG9yLWFkanVzdDogZXhhY3Q7IH0KLnRpbnB1dCwgLm1zZWwsIC5zdGF0LXNlbCB7IGJvcmRlcjogbm9uZSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50OyB9CkBwYWdlIHsgc2l6ZTogbGFuZHNjYXBlOyBtYXJnaW46IDVtbTsgfQpAbWVkaWEgcHJpbnQgeyBib2R5IHsgdHJhbnNmb3JtOiBzY2FsZSgwLjk3KTsgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7IH0gfQo8L3N0eWxlPgo8L2hlYWQ+Cjxib2R5Pgoke2Nsb25lZC5vdXRlckhUTUx9CjxzY3JgICsgYGlwdD4KLy8gSW1wcmVzc2lvbiBhdXRvbWF0aXF1ZSBhcHLDqHMgY2hhcmdlbWVudAp3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXsKICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7CiAgICB3aW5kb3cuZm9jdXMoKTsKICAgIHdpbmRvdy5wcmludCgpOwogIH0sIDUwMCk7Cn07Cjwvc2NyYCArIGBpcHQ+CjwvYm9keT4KPC9odG1sPmA7Cn0KCi8qIFNpZ25hbGVyIGF1IHBhcmVudCBxdSdvbiBlc3QgcHLDqnQgKGTDqXBsYWPDqSB0b3V0IGVuIGJhcykgKi8KZnVuY3Rpb24gaXNNYW5hZ2VyKCl7cmV0dXJuIEQuc2Vzc2lvbiYmRC5zZXNzaW9uLnJvbGU9PT0nbWFuYWdlcid9CmZ1bmN0aW9uIGN1cnJlbnRVc2VyKCl7cmV0dXJuIEQuc2Vzc2lvbiYmRC5zZXNzaW9uLmVtcElkP0QuZW1wbG95ZWVzLmZpbmQoZT0+ZS5pZD09PUQuc2Vzc2lvbi5lbXBJZCk6bnVsbH0KZnVuY3Rpb24gZGVmYXVsdFBpbkZvcihlbXApe2lmKGVtcC5waW4pcmV0dXJuIGVtcC5waW47Y29uc3QgZGlnaXRzPShlbXAuZmNJZHx8JycpLnJlcGxhY2UoL1xEL2csJycpO3JldHVybiBkaWdpdHMubGVuZ3RoPj00P2RpZ2l0cy5zbGljZSgtNCk6JzAwMDAnfQpmdW5jdGlvbiBwb3B1bGF0ZUxvZ2luU2VsZWN0KCl7Y29uc3Qgc2VsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbldobycpO3NlbC5pbm5lckhUTUw9JzxvcHRpb24gdmFsdWU9Im1hbmFnZXIiPvCflJEgR8OpcmFudCAoYWNjw6hzIGNvbXBsZXQpPC9vcHRpb24+JztELmVtcGxveWVlcy5mb3JFYWNoKGU9PntzZWwuaW5uZXJIVE1MKz0nPG9wdGlvbiB2YWx1ZT0iZW1wXycrZS5pZCsnIj4nK2UuZmlyc3ROYW1lKycg4oCUICcrZS5yb2xlKyc8L29wdGlvbj4nfSl9CmZ1bmN0aW9uIHNob3dMb2dpbigpe3BvcHVsYXRlTG9naW5TZWxlY3QoKTtjb25zdCBwaW5Jbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5QaW4nKTtwaW5Jbi52YWx1ZT0nJztkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5FcnJvcicpLnRleHRDb250ZW50PScnO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbk1vZGFsJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7c2V0VGltZW91dCgoKT0+cGluSW4uZm9jdXMoKSwxNTApfQpmdW5jdGlvbiBkb0xvZ2luKCl7Y29uc3Qgd2hvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbldobycpLnZhbHVlO2NvbnN0IHBpbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5QaW4nKS52YWx1ZS50cmltKCk7Y29uc3QgZXJyRWw9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luRXJyb3InKTtpZihwaW4ubGVuZ3RoPDQpe2VyckVsLnRleHRDb250ZW50PSdTYWlzaXNzZXogdm90cmUgY29kZSDDoCA0IGNoaWZmcmVzJztyZXR1cm59aWYod2hvPT09J21hbmFnZXInKXtjb25zdCBtcGluPUQubWFuYWdlclBpbnx8JzEyMzQnO2lmKHBpbj09PW1waW4pe0Quc2Vzc2lvbj17cm9sZTonbWFuYWdlcicsZW1wSWQ6bnVsbH07bG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLEpTT04uc3RyaW5naWZ5KEQpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5Nb2RhbCcpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO2FwcGx5U2Vzc2lvbigpO3JlbmRlcigpO3RvYXN0KCdCaWVudmVudWUg4oCUIE1vZGUgR8OpcmFudCcsJ3N1Y2Nlc3MnKX1lbHNlIGVyckVsLnRleHRDb250ZW50PSdDb2RlIEfDqXJhbnQgaW5jb3JyZWN0J31lbHNle2NvbnN0IGVtcElkPXBhcnNlSW50KHdoby5yZXBsYWNlKCdlbXBfJywnJykpO2NvbnN0IGVtcD1ELmVtcGxveWVlcy5maW5kKGU9PmUuaWQ9PT1lbXBJZCk7aWYoIWVtcCl7ZXJyRWwudGV4dENvbnRlbnQ9J1NhbGFyacOpIGludHJvdXZhYmxlJztyZXR1cm59aWYocGluPT09ZGVmYXVsdFBpbkZvcihlbXApKXtELnNlc3Npb249e3JvbGU6J2VtcGxveWVlJyxlbXBJZH07bG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLEpTT04uc3RyaW5naWZ5KEQpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5Nb2RhbCcpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO2FwcGx5U2Vzc2lvbigpO3JlbmRlcigpO3RvYXN0KCdCb25qb3VyICcrZW1wLmZpcnN0TmFtZSwnc3VjY2VzcycpfWVsc2UgZXJyRWwudGV4dENvbnRlbnQ9J0NvZGUgcGVyc29ubmVsIGluY29ycmVjdCd9fQpmdW5jdGlvbiBsb2dvdXQoKXtpZighRC5zZXNzaW9uKXtzaG93TG9naW4oKTtyZXR1cm59RC5zZXNzaW9uPW51bGw7bG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLEpTT04uc3RyaW5naWZ5KEQpKTthcHBseVNlc3Npb24oKTtzaG93TG9naW4oKTt0b2FzdCgnRMOpY29ubmV4aW9uIHLDqXVzc2llJywnaW5mbycpfQpmdW5jdGlvbiBhcHBseVNlc3Npb24oKXtjb25zdCBiYWRnZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlckJhZGdlJyk7aWYoIWJhZGdlKXJldHVybjtjb25zdCBuYW1lRWw9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJOYW1lJyk7aWYoIUQuc2Vzc2lvbil7ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdlbXAtbW9kZScpO2JhZGdlLnN0eWxlLmRpc3BsYXk9J25vbmUnO3JldHVybn1iYWRnZS5zdHlsZS5kaXNwbGF5PSdmbGV4JztpZihELnNlc3Npb24ucm9sZT09PSdtYW5hZ2VyJyl7YmFkZ2UuY2xhc3NMaXN0LmFkZCgnbWdyJyk7bmFtZUVsLnRleHRDb250ZW50PSdHw6lyYW50Jztkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2VtcC1tb2RlJyl9ZWxzZXtiYWRnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZ3InKTtjb25zdCBlbXA9Y3VycmVudFVzZXIoKTtuYW1lRWwudGV4dENvbnRlbnQ9ZW1wP2VtcC5maXJzdE5hbWU6J+KAlCc7ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdlbXAtbW9kZScpfX0Kc2V0dXBUZWFtKCk7CmlmKCFELm1hbmFnZXJQaW4pe0QubWFuYWdlclBpbj0nMTIzNCc7bG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLEpTT04uc3RyaW5naWZ5KEQpKX0KYXBwbHlTZXNzaW9uKCk7Ci8vIEF0dGVuZHJlIHVuIGNvdXJ0IGTDqWxhaSBwb3VyIGxhaXNzZXIgYXJyaXZlciBsZSBwb3N0TWVzc2FnZSBkJ2F1dG8tbG9naW4gYXZhbnQgZCdhZmZpY2hlciBsZSBsb2dpbiBtYW51ZWwKaWYoIUQuc2Vzc2lvbil7CiAgc2V0VGltZW91dCgoKT0+ewogICAgaWYoIUQuc2Vzc2lvbikgc2hvd0xvZ2luKCk7CiAgICBlbHNlIHJlbmRlcigpOwogIH0sIDYwMCk7Cn0gZWxzZSB7CiAgcmVuZGVyKCk7CiAgaWYoIWlzTWFuYWdlcigpKSBpbmplY3RWYWNhdGlvbkJsb2NrKCk7Cn0KCi8qIFNpZ25hbGVyIGF1IHBhcmVudCBxdSdvbiBlc3QgcHLDqnQg4oCUIGFwcsOocyBpbml0ICovCnRyeXsgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7c291cmNlOidwbGFubmluZy1mODkwJywgYWN0aW9uOidyZWFkeSd9LCAnKicpOyB9Y2F0Y2goZSl7fQo8L3NjcmlwdD4KPC9ib2R5Pgo8L2h0bWw+Cg==";
const PLANNING_HTML_CONTENT = (typeof atob !== "undefined")
  ? decodeURIComponent(escape(atob(PLANNING_HTML_B64)))
  : "";

// ========================================================================
// PLANNING — Composant React natif (sans iframe)
// Réutilise le localStorage "planningF890_v28" pour rester compatible
// avec les données saisies via l'ancien planning.
// ========================================================================
const PLANNING_STORAGE_KEY = "planningF890_v28";
const PLANNING_TYPES = ["Travail", "Repos", "Férié", "Vacances", "RTT", "Maladie", "Formation"];
const PLANNING_TYPE_BG = {
  Travail: "bg-white",
  Repos: "bg-slate-50",
  Férié: "bg-indigo-50",
  Vacances: "bg-amber-50",
  RTT: "bg-amber-50",
  Maladie: "bg-red-50",
  Formation: "bg-purple-50",
};
const PLANNING_DAY_NAMES_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const PLANNING_DAY_NAMES_LONG = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

// Helpers
const planningGetMonday = (d) => {
  const dt = new Date(d);
  const day = dt.getDay();
  const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(dt.setDate(diff));
};
const planningFIso = (d) => d.toISOString().split("T")[0];
const planningFHM = (m) => {
  if (isNaN(m) || m < 0) return "0h00";
  const h = Math.floor(m / 60);
  const mn = Math.round(m % 60);
  return h + "h" + (mn < 10 ? "0" + mn : mn);
};
const planningCalcMins = (d) => {
  if (!d) return 0;
  const g = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  let a = 0,
    p = 0;
  if (d.startAM && d.endAM) a = Math.max(0, g(d.endAM) - g(d.startAM));
  if (d.startPM && d.endPM) p = Math.max(0, g(d.endPM) - g(d.startPM));
  let t = a + p;
  if (d.break && t > 10) t -= 10;
  return t;
};
const planningGetWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yS = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yS) / 86400000 + 1) / 7);
};
const planningGetContractHours = (emp, refDate) => {
  if (emp.contractHoursB && emp.contractHoursB > 0) {
    return planningGetWeekNumber(refDate) % 2 === 1
      ? emp.contractHours || 35
      : emp.contractHoursB;
  }
  return emp.contractHours || 35;
};

// PLANNING MODAL — (ancien composant iframe, conservé en secours)
// ========================================================================
// ========================================================================
// PLANNING NATIVE PANEL V2 — Planning React natif complet
// ========================================================================
// Reprend TOUTES les fonctionnalités du planning HTML iframe :
// - Plannings types A/B avec alternance semaine impaire/paire
// - Copie/collage journée, duplication semaine vers date
// - Dispatch automatique avec logique ouverture/fermeture/peak days
// - Alertes couverture par jour (ligne MANQUANTS)
// - Stats annuelles par salarié (mois par mois)
// - Onglets modale employé : Identité / Planning type / Absences / Stats
// - Presets T1/T2/T3 + Gérant (RH/Compta/Ventes)
// - Support Livreur Polyvalent, Stagiaire, PIN
// ========================================================================

const PLAN_MISSIONS = [
  { val: "GestRayon", label: "Gest. Rayon", color: "bg-blue-100 text-blue-700" },
  { val: "Actub", label: "Actub", color: "bg-cyan-100 text-cyan-700" },
  { val: "Commerce", label: "Commerce", color: "bg-emerald-100 text-emerald-700" },
  { val: "ReaImplant", label: "Réa Implant", color: "bg-violet-100 text-violet-700" },
  { val: "Caisse", label: "Caisse", color: "bg-rose-100 text-rose-700" },
  { val: "Mut", label: "Mut", color: "bg-amber-100 text-amber-700" },
  { val: "Decharg", label: "Décharg.", color: "bg-orange-100 text-orange-700" },
  { val: "AideSAV", label: "Aide SAV", color: "bg-pink-100 text-pink-700" },
  { val: "AideCaisse", label: "Aide Caisse", color: "bg-fuchsia-100 text-fuchsia-700" },
  { val: "Inventaire", label: "Inventaire", color: "bg-indigo-100 text-indigo-700" },
  { val: "VAD", label: "VAD", color: "bg-teal-100 text-teal-700" },
  { val: "SAV", label: "SAV", color: "bg-red-100 text-red-700" },
  { val: "Livraison", label: "Livraison", color: "bg-lime-100 text-lime-700" },
];

const PLAN_ROLES = [
  "Gérant",
  "Responsable Commerce",
  "Vendeur",
  "Vendeur Polyvalent",
  "Caissier",
  "Caissier Services",
  "Services",
  "Magasinier",
  "Livreur Magasinier",
  "Livreur Polyvalent",
  "Stagiaire",
];

// Pôles d'organisation
function pl_isPoleCommerce(emp) {
  return (
    emp.role === "Vendeur" ||
    emp.role === "Vendeur Polyvalent" ||
    emp.role === "Responsable Commerce" ||
    emp.role === "Gérant"
  );
}
function pl_isCaissier(emp) {
  return emp.role === "Caissier" || emp.role === "Caissier Services";
}
function pl_isPoleServicesAutres(emp) {
  // Pôle Services hors caissiers purs
  return (
    emp.role === "Services" ||
    emp.role === "Magasinier" ||
    emp.role === "Livreur Magasinier" ||
    emp.role === "Livreur Polyvalent"
  );
}
function pl_isPoleServices(emp) {
  return pl_isCaissier(emp) || pl_isPoleServicesAutres(emp);
}

const PLAN_ABSENCE_TYPES = ["Vacances", "RTT", "Maladie", "Formation", "Férié"];
const PLAN_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const PLAN_DAY_LABELS = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
};
const PLAN_PEAK_DAYS = [4, 5, 6]; // Jeudi, Vendredi, Samedi

// Presets horaires
const PLAN_SHIFTS = {
  SO: { sAM: "09:45", eAM: "12:00", sPM: "14:00", ePM: "18:00", m1: "ReaImplant" },
  SC: { sAM: "10:30", eAM: "13:00", sPM: "14:00", ePM: "19:00", m1: "Commerce" },
  SCM: { sAM: "09:45", eAM: "12:00", sPM: "14:00", ePM: "18:30", m1: "Caisse" },
  SCS: { sAM: "10:30", eAM: "13:00", sPM: "14:00", ePM: "19:15", m1: "Caisse" },
  V_OPEN2A: { sAM: "10:00", eAM: "13:00", sPM: "14:00", ePM: "18:30", m1: "Actub" },
  V_OPEN2B: { sAM: "10:15", eAM: "13:00", sPM: "14:00", ePM: "18:30", m1: "Actub" },
  V_CLOSE2: { sAM: "11:00", eAM: "13:00", sPM: "14:00", ePM: "19:00", m1: "Commerce" },
  V_MID: { sAM: "10:00", eAM: "12:30", sPM: "14:00", ePM: "18:00", m1: "GestRayon" },
  C_MID: { sAM: "10:00", eAM: "12:30", sPM: "14:00", ePM: "18:30", m1: "Caisse" },
  T1: { sAM: "09:45", eAM: "13:00", sPM: "14:00", ePM: "18:45" },
  T2: { sAM: "10:00", eAM: "12:30", sPM: "14:00", ePM: "18:30", m1: "Actub" },
  T3: { sAM: "10:30", eAM: "13:00", sPM: "14:00", ePM: "19:00" },
  G_RH: { sAM: "09:00", eAM: "12:00", sPM: "14:00", ePM: "18:00", m1: "AideSAV" },
  G_COMPTA: { sAM: "09:00", eAM: "12:00", sPM: "14:00", ePM: "18:00", m1: "VAD" },
  G_VENTE: { sAM: "09:00", eAM: "12:00", sPM: "14:00", ePM: "18:00", m1: "Commerce" },
};

function pl_mondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay() || 7;
  if (dow !== 1) d.setDate(d.getDate() - (dow - 1));
  return d;
}
function pl_iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function pl_calcMins(d) {
  if (!d) return 0;
  const toM = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  let am = 0,
    pm = 0;
  if (d.startAM && d.endAM) am = Math.max(0, toM(d.endAM) - toM(d.startAM));
  if (d.startPM && d.endPM) pm = Math.max(0, toM(d.endPM) - toM(d.startPM));
  let t = am + pm;
  if (d.break && t > 10) t -= 10;
  return t;
}
function pl_fHM(mins) {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}
function pl_weekNum(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const w1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) /
        7,
    )
  );
}
function pl_getContractH(emp, monday) {
  const base = emp.contractHours || 35;
  // Alternance active si contractHoursB défini (même sans planning type B)
  if (emp.contractHoursB && emp.contractHoursB > 0) {
    return pl_weekNum(monday) % 2 === 1 ? base : emp.contractHoursB;
  }
  return base;
}
function pl_getWeekVariant(emp, monday) {
  // Semaine A/B si alternance active (contractHoursB ou fixedScheduleB définis)
  if (!emp.contractHoursB && !emp.fixedScheduleB) return null;
  return pl_weekNum(monday) % 2 === 1 ? "A" : "B";
}
function pl_getRestDays(emp, dateOrMonday) {
  // Renvoie les jours de repos effectifs pour la semaine de `dateOrMonday`
  // Alternance : restDays = semaine A, restDaysB = semaine B
  const hasAltern = !!(emp.contractHoursB || emp.fixedScheduleB);
  if (hasAltern && emp.restDaysB && emp.restDaysB.length > 0) {
    const isOdd = pl_weekNum(dateOrMonday) % 2 === 1;
    return isOdd ? emp.restDays || [] : emp.restDaysB;
  }
  return emp.restDays || [];
}
// Moyenne journalière d'un salarié = contrat / nb jours travaillés
// Utilisé pour "valoriser" un jour férié / CP / RTT / Maladie / Formation
function pl_avgMinsPerDay(emp, monday) {
  const contractH = pl_getContractH(emp, monday);
  const restDays = pl_getRestDays(emp, monday);
  const workingDays = Math.max(1, 7 - restDays.length);
  return Math.round((contractH * 60) / workingDays);
}
// Vérifie qu'un planning type est non-vide (au moins 1 jour avec un type valide)
function pl_isTplNonEmpty(tpl) {
  if (!tpl || typeof tpl !== "object") return false;
  return Object.values(tpl).some((d) => d && d.type);
}
// Détermine si un salarié a réellement un planning type (au moins un non-vide)
function pl_hasTemplate(emp) {
  return (
    pl_isTplNonEmpty(emp.fixedScheduleA) ||
    pl_isTplNonEmpty(emp.fixedScheduleB) ||
    pl_isTplNonEmpty(emp.fixedSchedule)
  );
}
// Types d'absence qui comptent comme du temps "payé" (vs Repos = non payé)
const PL_PAID_ABSENCE_TYPES = [
  "Férié",
  "Vacances",
  "RTT",
  "Maladie",
  "Formation",
];

// Règles de couverture par jour de la semaine (dow: 0=Dim, 1=Lun, ..., 6=Sam)
// Magasin Boulanger F890 — ouvert 9h45-13h / 14h-19h en semaine (coupure midi)
// Samedi : ouvert 9h45-19h sans coupure (besoin de couverture continue)
const COVERAGE_RULES_BY_DOW = {
  // open945    : nb vendeurs à 9h45
  // open10or1030 : nb vendeurs à 10h-10h30 en plus des ouvreurs
  // closeV     : nb vendeurs qui ferment à 19h (10h30-13h / 14h-19h)
  // closeNoonV : nb vendeurs présents 12h-13h
  // closeNoonC : nb caissiers présents 12h-13h
  // continuousV: samedi → nb vendeurs présents 13h-14h
  0: { open945: 0, open10or1030: 0, closeV: 0, closeNoonV: 0, closeNoonC: 0, continuousV: 0, label: "Dimanche" },
  1: { open945: 2, open10or1030: 0, closeV: 2, closeNoonV: 1, closeNoonC: 1, continuousV: 0, label: "Lundi" },
  2: { open945: 1, open10or1030: 1, closeV: 2, closeNoonV: 1, closeNoonC: 1, continuousV: 0, label: "Mardi" },
  3: { open945: 1, open10or1030: 1, closeV: 2, closeNoonV: 1, closeNoonC: 1, continuousV: 0, label: "Mercredi" },
  4: { open945: 1, open10or1030: 1, closeV: 2, closeNoonV: 1, closeNoonC: 1, continuousV: 0, label: "Jeudi" },
  5: { open945: 1, open10or1030: 1, closeV: 2, closeNoonV: 1, closeNoonC: 1, continuousV: 0, label: "Vendredi" },
  6: { open945: 2, open10or1030: 2, closeV: 2, closeNoonV: 2, closeNoonC: 1, continuousV: 2, label: "Samedi" },
};
const PL_DOW_CONTINUOUS = [6]; // Jours sans coupure midi (samedi)

function pl_loadData() {
  try {
    const raw = localStorage.getItem("plf890_data_v1");
    if (!raw) return { employees: [], schedule: {}, absences: [] };
    const p = JSON.parse(raw);
    return {
      employees: p.employees || [],
      schedule: p.schedule || {},
      absences: p.absences || [],
    };
  } catch {
    return { employees: [], schedule: {}, absences: [] };
  }
}
function pl_saveData(d) {
  try {
    localStorage.setItem("plf890_data_v1", JSON.stringify(d));
  } catch {}
}
function pl_emptyWorkDay() {
  return {
    type: "Travail",
    startAM: "",
    endAM: "",
    startPM: "",
    endPM: "",
    break: false,
    m1: "",
    m2: "",
    m3: "",
  };
}
function pl_livreurDefault() {
  return {
    type: "Travail",
    startAM: "10:00",
    endAM: "13:00",
    startPM: "14:00",
    endPM: "18:00",
    break: false,
    m1: "Livraison",
    m2: "",
    m3: "",
  };
}

function PlanningNativePanel({
  currentUser,
  isAdmin,
  vacationRequests,
  onClose,
}) {
  const [data, setData] = useState(pl_loadData);
  const [currentMonday, setCurrentMonday] = useState(pl_mondayOf(new Date()));
  const [tab, setTab] = useState("grid");
  const [editCell, setEditCell] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [addAbsence, setAddAbsence] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [clipboard, setClipboard] = useState(null);
  const [dupModalOpen, setDupModalOpen] = useState(false);

  useEffect(() => {
    pl_saveData(data);
  }, [data]);

  // Sync congés approuvés
  useEffect(() => {
    if (!vacationRequests || vacationRequests.length === 0) return;
    setData((prev) => {
      let changed = false;
      const newAbs = [...(prev.absences || [])];
      vacationRequests
        .filter((r) => r.status === "approved")
        .forEach((r) => {
          const emp = (prev.employees || []).find(
            (e) => (e.fcId || "").toUpperCase() === (r.fc || "").toUpperCase(),
          );
          if (!emp) return;
          const exists = newAbs.some(
            (a) =>
              a.empId === emp.id &&
              a.start === r.start &&
              a.end === r.end &&
              a.type === r.type,
          );
          if (!exists) {
            newAbs.push({
              id: Date.now() + Math.random(),
              empId: emp.id,
              start: r.start,
              end: r.end,
              type: r.type || "Vacances",
              fromRequest: r.id,
            });
            changed = true;
          }
        });
      if (!changed) return prev;
      return { ...prev, absences: newAbs };
    });
  }, [vacationRequests]);

  const showToast = (msg, kind = "success") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2500);
  };

  const weekDays = useMemo(() => {
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentMonday);
      d.setDate(currentMonday.getDate() + i);
      out.push(d);
    }
    return out;
  }, [currentMonday]);

  const visibleEmployees = useMemo(() => {
    if (isAdmin) return data.employees;
    const fc = (currentUser?.fc || "").toUpperCase();
    return data.employees.filter((e) => (e.fcId || "").toUpperCase() === fc);
  }, [data.employees, isAdmin, currentUser]);

  // Récupère la donnée d'une cellule (avec application auto des templates)
  const getCellData = (emp, date) => {
    const dk = pl_iso(date);
    const key = emp.id + "_" + dk;
    if (data.schedule[key]) return data.schedule[key];
    const abs = (data.absences || []).find(
      (a) => a.empId === emp.id && dk >= a.start && dk <= a.end,
    );
    if (abs) return { type: abs.type };
    const dow = date.getDay();
    let tpl = null;
    const aIsValid = pl_isTplNonEmpty(emp.fixedScheduleA);
    const bIsValid = pl_isTplNonEmpty(emp.fixedScheduleB);
    if (aIsValid || bIsValid) {
      const isOdd = pl_weekNum(date) % 2 === 1;
      if (aIsValid && bIsValid) {
        tpl = isOdd ? emp.fixedScheduleA : emp.fixedScheduleB;
      } else if (aIsValid) {
        tpl = emp.fixedScheduleA;
      } else {
        tpl = emp.fixedScheduleB;
      }
    } else if (pl_isTplNonEmpty(emp.fixedSchedule)) {
      tpl = emp.fixedSchedule;
    }
    if (tpl && tpl[dow]) return { ...tpl[dow] };
    const restDays = pl_getRestDays(emp, date);
    if (restDays.includes(dow)) return { type: "Repos" };
    if (emp.role === "Livreur Polyvalent") return pl_livreurDefault();
    return pl_emptyWorkDay();
  };

  // Total des heures RÉELLEMENT travaillées dans la semaine
  const weekMinsOf = (emp) => {
    return weekDays.reduce((s, d) => {
      const c = getCellData(emp, d);
      return s + (c.type === "Travail" ? pl_calcMins(c) : 0);
    }, 0);
  };
  // Objectif d'heures à travailler cette semaine (contrat − absences payées)
  const weekTargetMinsOf = (emp) => {
    const contractH = pl_getContractH(emp, currentMonday);
    const contractMins = contractH * 60;
    const avg = pl_avgMinsPerDay(emp, currentMonday);
    let deducted = 0;
    weekDays.forEach((d) => {
      const c = getCellData(emp, d);
      if (PL_PAID_ABSENCE_TYPES.includes(c.type)) deducted += avg;
    });
    return Math.max(0, contractMins - deducted);
  };

  // Analyse couverture d'un jour
  const analyzeCoverage = (dk) => {
    const dow = new Date(dk).getDay();
    const rules = COVERAGE_RULES_BY_DOW[dow] || COVERAGE_RULES_BY_DOW[1];
    const isPeak = PLAN_PEAK_DAYS.includes(dow);
    const isContinuous = PL_DOW_CONTINUOUS.includes(dow);
    let v945 = 0,
      vOpen10 = 0, // vendeurs 10h-10h30 (second ouvreur)
      vClose = 0,
      vCloseNoon = 0, // vendeurs présents jusqu'à 13h le matin
      vAfter13 = 0, // vendeurs présents 13h-14h (samedi continu)
      cOpen = 0,
      cClose = 0,
      cCloseNoon = 0, // caissier qui ferme la matinée
      ferieCount = 0,
      workCount = 0;
    data.employees.forEach((emp) => {
      const key = emp.id + "_" + dk;
      const d = data.schedule[key];
      if (d && d.type === "Férié") ferieCount++;
      if (d && d.type === "Travail" && (d.startAM || d.startPM)) workCount++;
      if (!d || d.type !== "Travail") return;
      const isV =
        pl_isPoleCommerce(emp) &&
        !(emp.role === "Gérant" && d.m1 !== "Commerce" && d.m1 !== "GestRayon");
      const isC = pl_isCaissier(emp);
      if (isV) {
        if (d.startAM === "09:45") v945++;
        if (d.startAM && d.startAM >= "10:00" && d.startAM <= "10:30") vOpen10++;
        if (d.endPM && d.endPM >= "19:00") vClose++;
        // Présent 12h-13h : matinée se finit à 13h ou plus tard
        if (d.endAM && d.endAM >= "13:00") vCloseNoon++;
        // Présent 13h-14h : aprem commence à 13h ou avant (samedi continu)
        if (d.startPM && d.startPM <= "13:00") vAfter13++;
        // Ou : pas de coupure du tout (heures continues qui couvrent 12-14h)
        if (!d.endAM && !d.startPM && d.startAM && d.endPM && d.startAM <= "12:00" && d.endPM >= "14:00") {
          vCloseNoon++;
          vAfter13++;
        }
      }
      if (isC) {
        if (d.startAM === "09:45") cOpen++;
        if (d.endPM && d.endPM >= "19:15") cClose++;
        if (d.endAM && d.endAM >= "13:00") cCloseNoon++;
      }
    });
    const alerts = [];
    if (ferieCount > 0 && workCount === 0)
      return { alerts: [], closed: true, peak: isPeak };

    // Règle ouverture matin selon le jour
    if (rules.open945 > 0 && v945 < rules.open945) {
      alerts.push(`Vend. 9h45 ${v945}/${rules.open945}`);
    }
    if (rules.open10or1030 > 0 && vOpen10 < rules.open10or1030) {
      alerts.push(`Vend. 10h-10h30 ${vOpen10}/${rules.open10or1030}`);
    }
    // Règle fermeture matin (12h-13h) — sauf samedi continu
    if (!isContinuous && rules.closeNoonV > 0 && vCloseNoon < rules.closeNoonV) {
      alerts.push(`Vend. 12h-13h ${vCloseNoon}/${rules.closeNoonV}`);
    }
    if (!isContinuous && rules.closeNoonC > 0 && cCloseNoon < rules.closeNoonC) {
      alerts.push(`Caisse 12h-13h ${cCloseNoon}/${rules.closeNoonC}`);
    }
    // Règle samedi continu : 2 vendeurs 12h-13h ET 2 vendeurs 13h-14h
    if (isContinuous) {
      if (vCloseNoon < rules.closeNoonV) {
        alerts.push(`Vend. 12h-13h ${vCloseNoon}/${rules.closeNoonV}`);
      }
      if (vAfter13 < rules.continuousV) {
        alerts.push(`Vend. 13h-14h ${vAfter13}/${rules.continuousV}`);
      }
    }
    // Règles fermeture 19h
    if (rules.closeV > 0 && vClose < rules.closeV) {
      alerts.push(`Vend. fermeture 19h ${vClose}/${rules.closeV}`);
    }
    if (cClose < 1) alerts.push("Caisse 19h15");
    return { alerts, closed: false, peak: isPeak, continuous: isContinuous };
  };

  // Navigation
  const prevWeek = () => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() - 7);
    setCurrentMonday(d);
  };
  const nextWeek = () => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + 7);
    setCurrentMonday(d);
  };
  const thisWeek = () => setCurrentMonday(pl_mondayOf(new Date()));

  const weekLabel = (() => {
    const s = weekDays[0].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    const e = weekDays[6].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    return `Sem. ${pl_weekNum(weekDays[0])} — ${s} au ${e}`;
  })();

  // Actions sur les cellules
  const saveCellEdit = (newData) => {
    if (!editCell) return;
    const key = editCell.empId + "_" + editCell.dateKey;
    setData((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [key]: newData },
    }));
    setEditCell(null);
    showToast("Journée enregistrée");
  };
  const copyDay = (emp, date) => {
    const cell = getCellData(emp, date);
    setClipboard(JSON.parse(JSON.stringify(cell)));
    showToast("Journée copiée");
  };
  const pasteDay = (emp, date) => {
    if (!clipboard) return;
    const key = emp.id + "_" + pl_iso(date);
    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [key]: JSON.parse(JSON.stringify(clipboard)),
      },
    }));
    showToast("Journée collée");
  };

  // Preset
  const applyPresetToCell = (emp, date, presetKey) => {
    const t = PLAN_SHIFTS[presetKey];
    if (!t) return;
    const key = emp.id + "_" + pl_iso(date);
    const current = data.schedule[key] || pl_emptyWorkDay();
    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [key]: {
          ...current,
          type: "Travail",
          startAM: t.sAM,
          endAM: t.eAM,
          startPM: t.sPM,
          endPM: t.ePM,
          m1: t.m1 || current.m1 || "",
        },
      },
    }));
    showToast(`Preset ${presetKey} appliqué`);
  };

  // CRUD salariés
  const saveEmployee = (emp) => {
    setData((prev) => {
      const emps = [...prev.employees];
      const existingIdx = emp.id ? emps.findIndex((e) => e.id === emp.id) : -1;
      if (existingIdx >= 0) {
        emps[existingIdx] = emp;
      } else {
        emps.push({ ...emp, id: emp.id || Date.now() });
      }
      return { ...prev, employees: emps };
    });
    setEditEmp(null);
    showToast("Salarié enregistré");
  };
  const deleteEmployee = (id) => {
    setData((prev) => {
      const newSched = { ...prev.schedule };
      Object.keys(newSched).forEach((k) => {
        if (k.startsWith(id + "_")) delete newSched[k];
      });
      return {
        ...prev,
        employees: prev.employees.filter((e) => e.id !== id),
        schedule: newSched,
        absences: (prev.absences || []).filter((a) => a.empId !== id),
      };
    });
    setConfirmDelete(null);
    setEditEmp(null);
    showToast("Salarié supprimé", "danger");
  };

  // CRUD absences
  const saveAbsence = (abs) => {
    setData((prev) => ({
      ...prev,
      absences: [
        ...(prev.absences || []),
        { ...abs, id: Date.now() + Math.random() },
      ],
    }));
    setAddAbsence(false);
    showToast("Absence enregistrée");
  };
  const deleteAbsence = (id) => {
    setData((prev) => ({
      ...prev,
      absences: (prev.absences || []).filter((a) => a.id !== id),
    }));
    showToast("Absence supprimée", "danger");
  };

  // Actions semaine
  const clearWeek = () => {
    setData((prev) => {
      const newSched = { ...prev.schedule };
      weekDays.forEach((d) => {
        const dk = pl_iso(d);
        prev.employees.forEach((emp) => {
          const dn = d.getDay();
          const isRest = emp.restDays && emp.restDays.includes(dn);
          newSched[emp.id + "_" + dk] =
            emp.role === "Livreur Polyvalent"
              ? isRest
                ? { type: "Repos" }
                : pl_livreurDefault()
              : isRest
                ? { type: "Repos" }
                : pl_emptyWorkDay();
        });
      });
      return { ...prev, schedule: newSched };
    });
    showToast("Semaine effacée", "warning");
  };
  const duplicatePrevWeek = () => {
    const sourceMonday = new Date(currentMonday);
    sourceMonday.setDate(sourceMonday.getDate() - 7);
    setData((prev) => {
      const newSched = { ...prev.schedule };
      for (let i = 0; i < 7; i++) {
        const sD = new Date(sourceMonday);
        sD.setDate(sourceMonday.getDate() + i);
        const tD = new Date(currentMonday);
        tD.setDate(currentMonday.getDate() + i);
        prev.employees.forEach((emp) => {
          const s = prev.schedule[emp.id + "_" + pl_iso(sD)];
          if (s)
            newSched[emp.id + "_" + pl_iso(tD)] = JSON.parse(JSON.stringify(s));
        });
      }
      return { ...prev, schedule: newSched };
    });
    showToast("Semaine précédente dupliquée");
  };
  const duplicateToDate = (targetDate) => {
    const sM = pl_mondayOf(currentMonday);
    const tM = pl_mondayOf(new Date(targetDate));
    setData((prev) => {
      const newSched = { ...prev.schedule };
      for (let i = 0; i < 7; i++) {
        const sD = new Date(sM);
        sD.setDate(sM.getDate() + i);
        const tD = new Date(tM);
        tD.setDate(tM.getDate() + i);
        prev.employees.forEach((emp) => {
          const s = prev.schedule[emp.id + "_" + pl_iso(sD)];
          if (s) {
            newSched[emp.id + "_" + pl_iso(tD)] = JSON.parse(JSON.stringify(s));
          } else {
            delete newSched[emp.id + "_" + pl_iso(tD)];
          }
        });
      }
      return { ...prev, schedule: newSched };
    });
    setCurrentMonday(tM);
    setDupModalOpen(false);
    showToast("Semaine dupliquée");
  };

  // Export PDF de la semaine (ouvre une fenêtre imprimable)
  const exportPDF = () => {
    const monday = currentMonday;
    const days = weekDays;
    const todayStr = pl_iso(new Date());
    const wkNum = pl_weekNum(monday);
    const s = days[0].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const e = days[6].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const printDate = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const employeesToExport = isAdmin ? data.employees : visibleEmployees;

    // Helpers pour escape HTML
    const esc = (s) =>
      String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const formatCellForPrint = (emp, date) => {
      const cell = getCellData(emp, date);
      if (cell.type !== "Travail") {
        const emoji =
          cell.type === "Repos"
            ? "🛋️"
            : cell.type === "Vacances"
              ? "🏖️"
              : cell.type === "RTT"
                ? "📅"
                : cell.type === "Maladie"
                  ? "🤒"
                  : cell.type === "Formation"
                    ? "📚"
                    : "🎌";
        return `<div class="abs ${cell.type === "Repos" ? "rp" : "wk-abs"}">${emoji} ${esc(cell.type)}</div>`;
      }
      const hours = pl_calcMins(cell);
      const timesAM =
        cell.startAM && cell.endAM
          ? `${cell.startAM}-${cell.endAM}`
          : "";
      const timesPM =
        cell.startPM && cell.endPM
          ? `${cell.startPM}-${cell.endPM}`
          : "";
      const missions = [cell.m1, cell.m2, cell.m3].filter(Boolean);
      const missionsTxt = missions
        .map((m) => {
          const mi = PLAN_MISSIONS.find((x) => x.val === m);
          return `<span class="m-badge">${esc(mi?.label || m)}</span>`;
        })
        .join(" ");
      return `<div class="cell">
        ${timesAM ? `<div class="tm">${timesAM}</div>` : ""}
        ${timesPM ? `<div class="tm">${timesPM}</div>` : ""}
        ${hours > 0 ? `<div class="hrs">${pl_fHM(hours)}</div>` : ""}
        ${missions.length > 0 ? `<div class="missions">${missionsTxt}</div>` : ""}
      </div>`;
    };

    const empRows = employeesToExport
      .map((emp) => {
        const wkMins = weekMinsOf(emp);
        const contractH = pl_getContractH(emp, monday);
        const targetMins = weekTargetMinsOf(emp);
        const targetH = targetMins / 60;
        const diff = wkMins - targetMins;
        const wkVar = pl_getWeekVariant(emp, monday);
        const cellsHTML = days
          .map((d) => {
            const isToday = pl_iso(d) === todayStr;
            return `<td class="${isToday ? "today" : ""}">${formatCellForPrint(emp, d)}</td>`;
          })
          .join("");
        const diffHTML =
          diff === 0
            ? '<span class="ok">✓ OK</span>'
            : diff > 0
              ? `<span class="sup">+${pl_fHM(diff)}</span>`
              : `<span class="low">−${pl_fHM(Math.abs(diff))}</span>`;
        return `<tr>
          <td class="emp">
            <div class="emp-name">${esc(emp.firstName)}${wkVar ? ` <span class="wk-var">S.${wkVar}</span>` : ""}</div>
            <div class="emp-meta">${esc(emp.fcId || "—")} · ${esc(emp.role)}</div>
            <div class="visa">Visa : ____________</div>
          </td>
          <td class="tot">
            <div class="tot-h">${pl_fHM(wkMins)}</div>
            <div class="tot-c">/ ${targetH.toFixed(1).replace(".0", "").replace(".", ",")}h${targetH !== contractH ? "*" : ""}</div>
            <div class="tot-d">${diffHTML}</div>
          </td>
          ${cellsHTML}
        </tr>`;
      })
      .join("");

    // Ligne MANQUANTS
    const manquantsRow = `<tr class="footer-row">
      <td colspan="2" class="manq-lbl">MANQUANTS</td>
      ${days
        .map((d) => {
          const cov = analyzeCoverage(pl_iso(d));
          if (cov.closed)
            return `<td class="closed">🎌 Fermé</td>`;
          if (cov.alerts.length === 0)
            return `<td class="ok-cov">✓ OK</td>`;
          return `<td class="alerts">${cov.alerts.map((a) => `<div>⚠ ${esc(a)}</div>`).join("")}</td>`;
        })
        .join("")}
    </tr>`;

    // En-têtes jours
    const headersHTML = days
      .map((d) => {
        const isToday = pl_iso(d) === todayStr;
        return `<th class="${isToday ? "today" : ""}">
          <div class="dn">${d.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
          <div class="dd">${d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
        </th>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Planning F890 — Semaine ${wkNum}</title>
<style>
@page { size: A4 landscape; margin: 8mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a2540; font-size: 10px; padding: 12px; background: #fff; }
.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ff5e00; padding-bottom: 6px; margin-bottom: 8px; }
.header .title { display: flex; align-items: center; gap: 8px; }
.header .logo { background: #ff5e00; color: #fff; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: 800; font-size: 12px; }
.header h1 { font-size: 14px; font-weight: 800; color: #0d2846; }
.header .sub { font-size: 10px; color: #64748b; margin-top: 1px; }
.header .meta { text-align: right; font-size: 9px; color: #64748b; }
table { width: 100%; border-collapse: collapse; background: #fff; }
thead th { background: #f0f3f8; color: #0d2846; font-weight: 700; padding: 6px 4px; text-align: center; font-size: 9px; border: 1px solid #e2e8f2; }
thead th.emp-h { text-align: left; padding-left: 8px; width: 120px; }
thead th.tot-h { width: 58px; }
thead th .dn { font-size: 8px; text-transform: uppercase; opacity: 0.7; font-weight: 600; }
thead th .dd { font-size: 11px; font-weight: 800; }
thead th.today { background: #dbeafe; color: #1e40af; }
tbody td { border: 1px solid #e2e8f2; padding: 4px; vertical-align: top; font-size: 9px; }
td.emp { background: #fafbfc; }
td.emp .emp-name { font-weight: 700; font-size: 11px; color: #0d2846; }
td.emp .emp-meta { font-size: 8px; color: #64748b; margin-top: 1px; }
td.emp .visa { font-size: 8px; color: #94a3b8; margin-top: 8px; border-top: 1px dashed #e2e8f2; padding-top: 4px; }
td.emp .wk-var { background: #ff5e00; color: #fff; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: 800; }
td.tot { text-align: center; background: #fafbfc; }
td.tot .tot-h { font-size: 12px; font-weight: 800; color: #0d2846; }
td.tot .tot-c { font-size: 8px; color: #64748b; }
td.tot .tot-d { font-size: 8px; margin-top: 2px; font-weight: 700; }
td.tot .sup { color: #059669; }
td.tot .low { color: #d97706; }
td.tot .ok { color: #059669; }
td.today { background: #f0f9ff; }
.cell { display: flex; flex-direction: column; gap: 1px; }
.cell .tm { font-family: 'Courier New', monospace; font-weight: 700; font-size: 9px; }
.cell .hrs { text-align: right; font-weight: 700; color: #ea580c; font-size: 8px; }
.cell .missions { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px; }
.m-badge { background: #e0e7ff; color: #3730a3; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: 700; }
.abs { font-weight: 700; text-align: center; padding: 8px 4px; font-size: 9px; border-radius: 3px; }
.abs.rp { background: #f1f5f9; color: #64748b; }
.abs.wk-abs { background: #f0fdfa; color: #0f766e; }
.footer-row td { background: #fff7ed; font-size: 8px; padding: 4px; }
.manq-lbl { text-align: right; font-weight: 800; color: #9a3412; font-size: 8px; }
.closed { color: #6366f1; font-weight: 700; text-align: center; }
.ok-cov { color: #059669; font-weight: 700; text-align: center; }
.alerts { color: #dc2626; font-size: 7px; }
.alerts div { margin-bottom: 2px; font-weight: 700; }
.signature-zone { margin-top: 12px; display: flex; justify-content: space-between; gap: 12px; padding-top: 8px; border-top: 1px solid #e2e8f2; font-size: 9px; color: #64748b; }
.signature-zone div { flex: 1; padding: 8px; border: 1px dashed #cbd5e1; border-radius: 4px; min-height: 40px; }
.signature-zone .lbl { font-weight: 700; margin-bottom: 4px; color: #1a2540; }
.legend { margin-top: 8px; font-size: 8px; color: #64748b; display: flex; gap: 12px; flex-wrap: wrap; }
.legend span strong { color: #1a2540; }
@media print {
  body { padding: 0; }
  .no-print { display: none !important; }
}
.print-btn { position: fixed; top: 10px; right: 10px; background: #ff5e00; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
.print-btn:hover { background: #ea580c; }
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button>
<div class="header">
  <div class="title">
    <div class="logo">B+</div>
    <div>
      <h1>Planning Boulanger F890 · Flers</h1>
      <div class="sub">Semaine ${wkNum} · du ${s} au ${e}</div>
    </div>
  </div>
  <div class="meta">
    Édité le ${printDate}<br>
    ${employeesToExport.length} collaborateur${employeesToExport.length > 1 ? "s" : ""}
  </div>
</div>
<table>
  <thead>
    <tr>
      <th class="emp-h">Collaborateur</th>
      <th class="tot-h">Total</th>
      ${headersHTML}
    </tr>
  </thead>
  <tbody>
    ${empRows}
    ${manquantsRow}
  </tbody>
</table>
<div class="legend">
  <span>* Objectif ajusté = contrat − absences payées</span>
  <span><strong>S.A / S.B</strong> : alternance</span>
  <span>✓ OK : couverture respectée</span>
</div>
<div class="signature-zone">
  <div><div class="lbl">Signature Gérant</div></div>
  <div><div class="lbl">Date d'affichage</div></div>
</div>
<script>
  // Auto-print au chargement (avec petite latence pour rendu CSS)
  setTimeout(function(){ try { window.print(); } catch(e){} }, 400);
</script>
</body>
</html>`;

    // Essayer d'ouvrir un nouvel onglet
    try {
      const win = window.open("", "_blank");
      if (win) {
        win.document.open();
        win.document.write(html);
        win.document.close();
        showToast("Planning PDF prêt à imprimer");
        return;
      }
    } catch (e) {}
    // Fallback : télécharger en HTML
    try {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `planning-F890-sem${wkNum}-${pl_iso(monday)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("Fichier téléchargé — ouvrez-le pour imprimer");
    } catch (e) {
      showToast("Erreur lors de l'export PDF", "danger");
    }
  };

  // Générer un résumé texte du planning pour le mail
  const generatePlanningTextSummary = (employeesToSend) => {
    const days = weekDays;
    const s = days[0].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
    const e = days[6].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const wkNum = pl_weekNum(currentMonday);
    let txt = `PLANNING BOULANGER F890 — FLERS\n`;
    txt += `Semaine ${wkNum} — du ${s} au ${e}\n`;
    txt += `${"═".repeat(60)}\n\n`;
    employeesToSend.forEach((emp) => {
      const wkMins = weekMinsOf(emp);
      const contractH = pl_getContractH(emp, currentMonday);
      const targetMins = weekTargetMinsOf(emp);
      const targetH = targetMins / 60;
      const wkVar = pl_getWeekVariant(emp, currentMonday);
      txt += `${emp.firstName}${wkVar ? ` (Sem. ${wkVar})` : ""} — ${emp.role}\n`;
      txt += `${"─".repeat(40)}\n`;
      days.forEach((d) => {
        const dn = d.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        const cell = getCellData(emp, d);
        if (cell.type !== "Travail") {
          txt += `  ${dn.padEnd(18)} : ${cell.type}\n`;
          return;
        }
        const times = [];
        if (cell.startAM && cell.endAM)
          times.push(`${cell.startAM}-${cell.endAM}`);
        if (cell.startPM && cell.endPM)
          times.push(`${cell.startPM}-${cell.endPM}`);
        const mins = pl_calcMins(cell);
        const missions = [cell.m1, cell.m2, cell.m3].filter(Boolean).join(", ");
        txt += `  ${dn.padEnd(18)} : ${times.join(" · ") || "—"} (${pl_fHM(mins)})`;
        if (missions) txt += ` · ${missions}`;
        txt += `\n`;
      });
      const diff = wkMins - targetMins;
      const diffStr =
        diff === 0
          ? "✓ OK"
          : diff > 0
            ? `+${pl_fHM(diff)}`
            : `−${pl_fHM(Math.abs(diff))}`;
      txt += `  Total : ${pl_fHM(wkMins)} / ${targetH.toFixed(1).replace(".0", "").replace(".", ",")}h — ${diffStr}\n\n`;
    });
    txt += `${"═".repeat(60)}\n`;
    txt += `Édité le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}\n`;
    return txt;
  };

  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const sendPlanningByEmail = (emailAddress, mode) => {
    // mode = "self" (planning salarié) ou "all" (tous)
    const employeesToSend =
      mode === "self" ? visibleEmployees : data.employees;
    const days = weekDays;
    const wkNum = pl_weekNum(currentMonday);
    const s = days[0].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    const e = days[6].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    const subject = `Planning F890 — Semaine ${wkNum} (${s} au ${e})`;
    const body = generatePlanningTextSummary(employeesToSend);
    // Ouvre le client mail par défaut
    const mailto = `mailto:${emailAddress || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      window.location.href = mailto;
      showToast("Ouverture de votre client mail…");
    } catch (e) {
      showToast("Impossible d'ouvrir le client mail", "danger");
    }
    setEmailModalOpen(false);
  };

  // Dispatch automatique — répartit les heures contractuelles sur les jours travaillés
  const autoDispatch = () => {
    const toMin = (t) => {
      if (!t) return 0;
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const fromMin = (min) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    // Compteurs pré-calcul pour le toast
    const tplCount = data.employees.filter(
      (e) => e.role !== "Stagiaire" && pl_hasTemplate(e),
    ).length;
    const dispCount = data.employees.filter(
      (e) => e.role !== "Stagiaire" && !pl_hasTemplate(e),
    ).length;

    setData((prev) => {
      const newSched = { ...prev.schedule };

      // ====================================================================
      // PASSE A : Plannings types — appliquer tels quels
      // ====================================================================
      prev.employees.forEach((emp) => {
        if (emp.role === "Stagiaire") return;
        if (!pl_hasTemplate(emp)) return;
        // Sélectionne le planning type pertinent : alternance A/B ou simple
        let tpl = null;
        const aIsValid = pl_isTplNonEmpty(emp.fixedScheduleA);
        const bIsValid = pl_isTplNonEmpty(emp.fixedScheduleB);
        if (aIsValid || bIsValid) {
          const isOdd = pl_weekNum(currentMonday) % 2 === 1;
          // Si seul A est rempli, on l'utilise toutes les semaines
          // Si seul B est rempli, idem
          // Si les 2 sont remplis, alternance
          if (aIsValid && bIsValid) {
            tpl = isOdd ? emp.fixedScheduleA : emp.fixedScheduleB;
          } else if (aIsValid) {
            tpl = emp.fixedScheduleA;
          } else {
            tpl = emp.fixedScheduleB;
          }
        } else if (pl_isTplNonEmpty(emp.fixedSchedule)) {
          tpl = emp.fixedSchedule;
        }
        if (!tpl) return;
        const empRestDaysT = pl_getRestDays(emp, currentMonday);
        for (let i = 0; i < 7; i++) {
          const d = new Date(currentMonday);
          d.setDate(currentMonday.getDate() + i);
          const dow = d.getDay();
          const dk = pl_iso(d);
          const existing = newSched[emp.id + "_" + dk];
          if (existing && PL_PAID_ABSENCE_TYPES.includes(existing.type)) continue;
          const hasAbs = (prev.absences || []).some(
            (a) => a.empId === emp.id && dk >= a.start && dk <= a.end,
          );
          if (hasAbs) continue;
          if (empRestDaysT.includes(dow)) {
            newSched[emp.id + "_" + dk] = { type: "Repos" };
            continue;
          }
          if (tpl && tpl[dow]) {
            newSched[emp.id + "_" + dk] = { ...tpl[dow] };
          } else {
            newSched[emp.id + "_" + dk] = { type: "Repos" };
          }
        }
      });

      // ====================================================================
      // PASSE B-1 : Pour chaque salarié SANS planning type
      //   → calculer ses jours travaillables et la durée de chaque jour
      // ====================================================================
      const empPlanning = []; // [{ emp, days: [{date, dk, dow, dayMins}] }]
      prev.employees.forEach((emp) => {
        if (emp.role === "Stagiaire") return;
        if (pl_hasTemplate(emp)) return; // déjà traité

        // Livreur Polyvalent : horaires fixes
        if (emp.role === "Livreur Polyvalent") {
          const empRestDays = pl_getRestDays(emp, currentMonday);
          for (let i = 0; i < 7; i++) {
            const d = new Date(currentMonday);
            d.setDate(currentMonday.getDate() + i);
            const dow = d.getDay();
            const dk = pl_iso(d);
            const existing = newSched[emp.id + "_" + dk];
            if (existing && PL_PAID_ABSENCE_TYPES.includes(existing.type)) continue;
            const hasAbs = (prev.absences || []).some(
              (a) => a.empId === emp.id && dk >= a.start && dk <= a.end,
            );
            if (hasAbs) continue;
            if (empRestDays.includes(dow)) {
              newSched[emp.id + "_" + dk] = { type: "Repos" };
            } else {
              newSched[emp.id + "_" + dk] = pl_livreurDefault();
            }
          }
          return;
        }

        const empRestDays = pl_getRestDays(emp, currentMonday);
        const availableDays = [];
        let paidAbsenceDays = 0;
        for (let i = 0; i < 7; i++) {
          const d = new Date(currentMonday);
          d.setDate(currentMonday.getDate() + i);
          const dow = d.getDay();
          const dk = pl_iso(d);
          if (empRestDays.includes(dow)) {
            newSched[emp.id + "_" + dk] = { type: "Repos" };
            continue;
          }
          const hasAbs = (prev.absences || []).some(
            (a) => a.empId === emp.id && dk >= a.start && dk <= a.end,
          );
          if (hasAbs) {
            paidAbsenceDays++;
            continue;
          }
          const existing = newSched[emp.id + "_" + dk];
          if (existing && PL_PAID_ABSENCE_TYPES.includes(existing.type)) {
            paidAbsenceDays++;
            continue;
          }
          availableDays.push({ date: d, dk, dow });
        }
        if (availableDays.length === 0) return;

        const contractH = pl_getContractH(emp, currentMonday);
        const contractMins = contractH * 60;
        const avgMinsPerDay = pl_avgMinsPerDay(emp, currentMonday);
        const paidAbsenceMins = paidAbsenceDays * avgMinsPerDay;
        const minsToDistribute = Math.max(0, contractMins - paidAbsenceMins);
        const baseMinsPerDay = Math.floor(minsToDistribute / availableDays.length);
        const remainder = minsToDistribute % availableDays.length;
        const days = availableDays.map((day, idx) => ({
          ...day,
          dayMins: baseMinsPerDay + (idx < remainder ? 1 : 0),
        }));
        empPlanning.push({ emp, days });
      });

      // ====================================================================
      // PASSE B-2 : Attribution des horaires JOUR par JOUR
      //   → respecte les règles de couverture par dow
      // ====================================================================
      // Pôles — Commerce vs Services
      const isPoleCom = (emp) => pl_isPoleCommerce(emp);
      const isCaiss = (emp) => pl_isCaissier(emp);
      const isOtherSvc = (emp) =>
        pl_isPoleServicesAutres(emp) && emp.role !== "Livreur Polyvalent";
      // Compteurs ouvertures/fermetures pour alternance des caissiers
      const cashOpen = {};
      const cashClose = {};
      // Compteurs équivalents pour les vendeurs (pour le tour de rôle des fermetures)
      const vendOpen = {};
      const vendClose = {};

      for (let i = 0; i < 7; i++) {
        const d = new Date(currentMonday);
        d.setDate(currentMonday.getDate() + i);
        const dow = d.getDay();
        const dk = pl_iso(d);
        const rules = COVERAGE_RULES_BY_DOW[dow] || COVERAGE_RULES_BY_DOW[1];
        const isContinuous = PL_DOW_CONTINUOUS.includes(dow);
        const isPeak = PLAN_PEAK_DAYS.includes(dow);

        // Salariés présents ce jour avec leur durée à faire
        const presents = empPlanning
          .map(({ emp, days }) => {
            const dayInfo = days.find((x) => x.dk === dk);
            return dayInfo ? { emp, dayMins: dayInfo.dayMins } : null;
          })
          .filter(Boolean);
        if (presents.length === 0) continue;

        const vendeurs = presents.filter((p) => isPoleCom(p.emp));
        const caissiers = presents.filter((p) => isCaiss(p.emp));
        const others = presents.filter((p) => isOtherSvc(p.emp));

        // ============= ATTRIBUTION VENDEURS =============
        // RÈGLES MÉTIER F890 :
        // - "Ouvreur" 9h45 : matin 9h45-12h / pause / fin 18h
        //   • Semaine : pause 12h-14h
        //   • Samedi : pause 12h-13h, fin 18h-18h30 selon contrat
        // - "Fermeur" 19h : 10h30-13h / 14h-19h (en TOUR DE RÔLE — équilibrage)
        //   • Du lundi au vendredi : il faut closeV (= 2) vendeurs qui ferment
        //   • Le samedi : il faut closeV (= 2) vendeurs qui ferment à 19h
        // - "Milieu" 10h ou 10h30 : 10h-13h / 14h-? selon contrat
        // Init compteurs vendeurs
        vendeurs.forEach((p) => {
          if (vendOpen[p.emp.id] === undefined) vendOpen[p.emp.id] = 0;
          if (vendClose[p.emp.id] === undefined) vendClose[p.emp.id] = 0;
        });

        const need945 = rules.open945;
        const needClose = rules.closeV;

        // Stratégie d'attribution :
        // 1) Sélectionner N vendeurs pour OUVRIR (9h45) — ceux qui ont le moins ouvert cette semaine
        // 2) Sélectionner M vendeurs pour FERMER (19h) — ceux qui ont le moins fermé cette semaine
        //    (en évitant si possible les ouvreurs du jour pour ne pas les surcharger)
        // 3) Le reste passe en milieu (10h-10h30)
        const vendeursLeft = [...vendeurs];

        // === Choix des ouvreurs ===
        const openers = [];
        for (let n = 0; n < need945 && vendeursLeft.length > 0; n++) {
          vendeursLeft.sort(
            (a, b) =>
              (vendOpen[a.emp.id] || 0) - (vendOpen[b.emp.id] || 0) ||
              (a.emp.firstName || "").localeCompare(b.emp.firstName || ""),
          );
          openers.push(vendeursLeft.shift());
        }

        // === Choix des fermeurs (priorité aux non-ouvreurs) ===
        const closers = [];
        for (let n = 0; n < needClose && vendeursLeft.length > 0; n++) {
          vendeursLeft.sort(
            (a, b) =>
              (vendClose[a.emp.id] || 0) - (vendClose[b.emp.id] || 0) ||
              (a.emp.firstName || "").localeCompare(b.emp.firstName || ""),
          );
          closers.push(vendeursLeft.shift());
        }
        // Si pas assez de non-ouvreurs disponibles, on peut prendre un ouvreur en plus
        // mais c'est exceptionnel — on lève juste l'alerte de couverture si besoin

        const middlers = vendeursLeft;

        // === Helper de placement d'un shift vendeur ===
        const placeVendShift = (p, role) => {
          const dayMins = p.dayMins;
          let cell;
          const missionByRole =
            role === "open"
              ? "ReaImplant"
              : role === "close"
                ? "Commerce"
                : "Actub";

          if (role === "open") {
            // 9h45 → 12h / pause / fin 18h (ou 18h-18h30 le samedi)
            const startAMMin = toMin("09:45");
            const endAMMin = 12 * 60;
            const amDur = endAMMin - startAMMin;
            let startPMMin, endPMMin;
            if (isContinuous) {
              startPMMin = 13 * 60;
              const pmDur = Math.max(0, dayMins - amDur);
              const candidate = startPMMin + pmDur;
              endPMMin = Math.min(Math.max(18 * 60, candidate), 18 * 60 + 30);
            } else {
              startPMMin = 14 * 60;
              endPMMin = 18 * 60;
            }
            cell = {
              type: "Travail",
              startAM: "09:45",
              endAM: fromMin(endAMMin),
              startPM: fromMin(startPMMin),
              endPM: fromMin(endPMMin),
              break: false,
              m1: missionByRole,
              m2: "",
              m3: "",
            };
          } else if (role === "close") {
            // 10h30 → 13h / 14h → 19h
            cell = {
              type: "Travail",
              startAM: "10:30",
              endAM: "13:00",
              startPM: "14:00",
              endPM: "19:00",
              break: false,
              m1: missionByRole,
              m2: "",
              m3: "",
            };
          } else {
            // Milieu : 10h ou 10h30 → 13h / 14h → fin selon contrat
            const startAM = "10:00";
            const startAMMin = toMin(startAM);
            const endAMMin = 13 * 60;
            const amDur = endAMMin - startAMMin;
            const startPMMin = 14 * 60;
            const pmDur = Math.max(0, dayMins - amDur);
            const endPMMin = Math.min(startPMMin + pmDur, 19 * 60);
            cell = {
              type: "Travail",
              startAM,
              endAM: "13:00",
              startPM: "14:00",
              endPM: fromMin(endPMMin),
              break: false,
              m1: missionByRole,
              m2: "",
              m3: "",
            };
          }
          newSched[p.emp.id + "_" + dk] = cell;
        };

        openers.forEach((p) => {
          placeVendShift(p, "open");
          vendOpen[p.emp.id]++;
        });
        closers.forEach((p) => {
          placeVendShift(p, "close");
          vendClose[p.emp.id]++;
        });
        middlers.forEach((p) => placeVendShift(p, "middle"));

        // ============= ATTRIBUTION CAISSIERS (alternance ouv/ferm) =============
        // Règles métier :
        // - Le caissier qui démarre à 9h45 finit à 18h (pause 12h-14h en semaine, 12h-13h le sam)
        // - Le caissier qui ferme démarre à 10h30 et finit à 19h15
        // - Si un seul caissier ce jour : il alterne ouverture OU fermeture selon compteur
        //   (ne peut pas couvrir 9h45-19h15 d'une journée à cause de la règle 9h45→18h)
        caissiers.forEach((p) => {
          if (cashOpen[p.emp.id] === undefined) cashOpen[p.emp.id] = 0;
          if (cashClose[p.emp.id] === undefined) cashClose[p.emp.id] = 0;
        });

        // Helper : place un shift caissier selon le rôle
        const placeCashShift = (p, role) => {
          const dayMins = p.dayMins;
          let cell;
          if (role === "open") {
            // RÈGLE 9h45 → 12h, pause, fin 18h
            const endAMMin = 12 * 60;
            const amDur = endAMMin - toMin("09:45"); // 135 min
            let startPMMin, endPMMin;
            if (isContinuous) {
              // Samedi : pause 12h-13h, fin 18h-18h30 selon dayMins
              startPMMin = 13 * 60;
              const pmDur = Math.max(0, dayMins - amDur);
              const candidate = startPMMin + pmDur;
              endPMMin = Math.min(Math.max(18 * 60, candidate), 18 * 60 + 30);
            } else {
              // Semaine : pause 12h-14h, fin 18h
              startPMMin = 14 * 60;
              endPMMin = 18 * 60;
            }
            cell = {
              type: "Travail",
              startAM: "09:45",
              endAM: fromMin(endAMMin),
              startPM: fromMin(startPMMin),
              endPM: fromMin(endPMMin),
              break: false,
              m1: "Caisse",
              m2: "",
              m3: "",
            };
          } else if (role === "close") {
            // Démarrage 10h30, fermeture 19h15
            const startAMMin = toMin("10:30");
            const dayMins = p.dayMins;
            const endAMMin = 13 * 60;
            const amDur = Math.max(0, endAMMin - startAMMin);
            const startPMMin = 14 * 60;
            const pmDur = Math.max(0, dayMins - amDur);
            let endPMMin = Math.max(19 * 60 + 15, startPMMin + pmDur);
            endPMMin = Math.min(endPMMin, 19 * 60 + 30);
            const actualPmDur = endPMMin - startPMMin;
            let actualStartAM = startAMMin;
            if (actualPmDur < pmDur) {
              actualStartAM = Math.max(7 * 60, startAMMin - (pmDur - actualPmDur));
            }
            cell = {
              type: "Travail",
              startAM: fromMin(actualStartAM),
              endAM: "13:00",
              startPM: "14:00",
              endPM: fromMin(endPMMin),
              break: false,
              m1: "Caisse",
              m2: "",
              m3: "",
            };
          } else {
            // Milieu (10h, cas rare avec 3+ caissiers)
            const startAMMin = toMin("10:00");
            const endAMMin = 13 * 60;
            const amDur = Math.max(0, endAMMin - startAMMin);
            const startPMMin = 14 * 60;
            const pmDur = Math.max(0, dayMins - amDur);
            const endPMMin = Math.min(startPMMin + pmDur, 19 * 60);
            cell = {
              type: "Travail",
              startAM: "10:00",
              endAM: "13:00",
              startPM: "14:00",
              endPM: fromMin(endPMMin),
              break: false,
              m1: "Caisse",
              m2: "",
              m3: "",
            };
          }
          newSched[p.emp.id + "_" + dk] = cell;
        };

        if (caissiers.length === 1) {
          // Un seul caissier → alterner ouverture/fermeture selon compteurs
          const p = caissiers[0];
          // Choisir le rôle qu'il a fait le moins
          const opens = cashOpen[p.emp.id] || 0;
          const closes = cashClose[p.emp.id] || 0;
          const role = opens <= closes ? "open" : "close";
          placeCashShift(p, role);
          if (role === "open") cashOpen[p.emp.id]++;
          else cashClose[p.emp.id]++;
        } else if (caissiers.length >= 2) {
          // 2 caissiers (ou +) → alterner ouvertures/fermetures équitablement
          const sorted = [...caissiers].sort(
            (a, b) =>
              (cashOpen[a.emp.id] || 0) - (cashOpen[b.emp.id] || 0) ||
              (a.emp.firstName || "").localeCompare(b.emp.firstName || ""),
          );
          const opener = sorted[0];
          const closer = sorted[sorted.length - 1];
          const middles = sorted.slice(1, -1);

          placeCashShift(opener, "open");
          cashOpen[opener.emp.id]++;
          placeCashShift(closer, "close");
          cashClose[closer.emp.id]++;
          middles.forEach((p) => placeCashShift(p, "middle"));
        }

        // ============= ATTRIBUTION AUTRES RÔLES PÔLE SERVICES =============
        // Magasinier · Livreur Magasinier · Services
        // Horaire standard 10h-13h / 14h-? avec mission selon le rôle
        others.forEach((p, idx) => {
          const startAM = idx === 0 ? "10:00" : "10:30";
          const startAMMin = toMin(startAM);
          const dayMins = p.dayMins;
          const endAMMin = 13 * 60;
          const amDur = Math.max(0, endAMMin - startAMMin);
          const startPMMin = 14 * 60;
          const pmDur = Math.max(0, dayMins - amDur);
          const endPMMin = Math.min(startPMMin + pmDur, 19 * 60);
          const actualPmDur = endPMMin - startPMMin;
          let actualStartAM = startAMMin;
          if (actualPmDur < pmDur) {
            actualStartAM = Math.max(7 * 60, startAMMin - (pmDur - actualPmDur));
          }
          // Mission par défaut selon le rôle
          let m1 = "Decharg";
          if (p.emp.role === "Livreur Magasinier") m1 = "Livraison";
          else if (p.emp.role === "Magasinier") m1 = "Decharg";
          else if (p.emp.role === "Services") m1 = "AideCaisse";
          newSched[p.emp.id + "_" + dk] = {
            type: "Travail",
            startAM: fromMin(actualStartAM),
            endAM: "13:00",
            startPM: "14:00",
            endPM: fromMin(endPMMin),
            break: false,
            m1,
            m2: "",
            m3: "",
          };
        });
      }

      // ====================================================================
      // FILET DE SÉCURITÉ : tout salarié sans planning type qui n'a pas reçu
      // d'horaire pour un de ses jours dispo se voit attribuer un default
      // ====================================================================
      empPlanning.forEach(({ emp, days }) => {
        days.forEach((day) => {
          const key = emp.id + "_" + day.dk;
          const existing = newSched[key];
          // Déjà placé en travail/repos/absence → on ne touche pas
          if (existing && existing.type) return;
          // Sinon, on lui pose un horaire standard correspondant à dayMins
          const startAMMin = 10 * 60;
          const dayMins = day.dayMins;
          const endAMMin = 13 * 60;
          const amDur = Math.max(0, endAMMin - startAMMin);
          const startPMMin = 14 * 60;
          const pmDur = Math.max(0, dayMins - amDur);
          const endPMMin = Math.min(startPMMin + pmDur, 19 * 60);
          newSched[key] = {
            type: "Travail",
            startAM: "10:00",
            endAM: "13:00",
            startPM: "14:00",
            endPM: fromMin(endPMMin),
            break: false,
            m1: pl_isPoleCommerce(emp)
              ? "Commerce"
              : pl_isCaissier(emp)
                ? "Caisse"
                : pl_isPoleServicesAutres(emp)
                  ? "Decharg"
                  : "Commerce",
            m2: "",
            m3: "",
          };
        });
      });

      return { ...prev, schedule: newSched };
    });

    setTimeout(() => {
      let alerts = 0;
      weekDays.forEach((d) => {
        alerts += analyzeCoverage(pl_iso(d)).alerts.length;
      });
      const parts = [];
      if (tplCount > 0)
        parts.push(`${tplCount} planning${tplCount > 1 ? "s" : ""} type appliqué${tplCount > 1 ? "s" : ""}`);
      if (dispCount > 0)
        parts.push(`${dispCount} dispatch${dispCount > 1 ? "ées" : "ée"} équitable${dispCount > 1 ? "s" : ""}`);
      const summary = parts.join(" · ");
      if (alerts === 0) {
        showToast(
          summary
            ? `${summary} — Couverture OK`
            : "Dispatch réussi : couverture OK",
        );
      } else {
        showToast(
          summary
            ? `${summary} — ${alerts} alerte(s) à vérifier`
            : `Dispatch terminé — ${alerts} alerte(s) à vérifier`,
          "warning",
        );
      }
    }, 100);
  };

  // Stats annuelles pour un salarié
  const getYearStats = (empId) => {
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    const stats = new Array(12).fill(0);
    const yr = new Date().getFullYear();
    Object.keys(data.schedule).forEach((k) => {
      if (!k.startsWith(empId + "_")) return;
      const d = new Date(k.split("_")[1]);
      if (d.getFullYear() === yr && data.schedule[k].type === "Travail")
        stats[d.getMonth()] += pl_calcMins(data.schedule[k]);
    });
    return { months, stats, total: stats.reduce((s, x) => s + x, 0) };
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-100 flex flex-col"
      style={{ height: "100dvh" }}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2 shrink-0">
        <Calendar size={20} className="text-orange-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base truncate">Planning F890</h2>
          <p className="text-[10px] text-slate-400 truncate">
            {isAdmin
              ? `Mode Gérant · ${data.employees.length} salariés`
              : `Mon planning (${currentUser?.fc || ""})`}
          </p>
        </div>
        {clipboard && (
          <span className="text-[10px] font-bold bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
            📋 Journée en mémoire
          </span>
        )}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded"
          title="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-2 py-1.5 flex gap-1 shrink-0 overflow-x-auto">
        {[
          { id: "grid", label: "Planning", icon: Calendar },
          ...(isAdmin
            ? [
                { id: "team", label: "Équipe", icon: Users },
                { id: "absences", label: "Absences", icon: Award },
              ]
            : [{ id: "absences", label: "Mes absences", icon: Award }]),
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold whitespace-nowrap transition ${
                active
                  ? "bg-orange-500 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Nav semaine */}
      {tab === "grid" && (
        <div className="bg-white border-b border-slate-200 px-2 py-2 flex items-center gap-1.5 shrink-0">
          <button
            onClick={prevWeek}
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={thisWeek}
            className="px-2 py-1 text-[10px] font-bold bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Aujourd'hui
          </button>
          <div className="flex-1 text-center font-bold text-xs text-slate-700 truncate">
            {weekLabel}
          </div>
          <button
            onClick={nextWeek}
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Toolbar non-admin (PDF + mail pour son propre planning) */}
      {tab === "grid" && !isAdmin && visibleEmployees.length > 0 && (
        <div className="bg-slate-50 border-b border-slate-200 px-2 py-1.5 flex gap-1 shrink-0 overflow-x-auto">
          <button
            onClick={exportPDF}
            className="px-2 py-1 text-[10px] font-bold bg-slate-700 text-white rounded flex items-center gap-1 whitespace-nowrap"
          >
            <Download size={11} />
            PDF
          </button>
          <button
            onClick={() => setEmailModalOpen(true)}
            className="px-2 py-1 text-[10px] font-bold bg-cyan-600 text-white rounded flex items-center gap-1 whitespace-nowrap"
          >
            <Send size={11} />
            Envoyer par mail
          </button>
        </div>
      )}

      {/* Toolbar admin */}
      {tab === "grid" && isAdmin && (
        <div className="bg-slate-50 border-b border-slate-200 px-2 py-1.5 flex gap-1 shrink-0 overflow-x-auto">
          <button
            onClick={() => setEditEmp("new")}
            className="px-2 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded flex items-center gap-1 whitespace-nowrap"
          >
            <UserPlus size={11} />
            Salarié
          </button>
          <button
            onClick={autoDispatch}
            className="px-2 py-1 text-[10px] font-bold bg-purple-600 text-white rounded flex items-center gap-1 whitespace-nowrap"
            title="Dispatch auto équipe"
          >
            <Sparkles size={11} />
            Dispatch auto
          </button>
          <button
            onClick={duplicatePrevWeek}
            className="px-2 py-1 text-[10px] font-bold bg-blue-600 text-white rounded flex items-center gap-1 whitespace-nowrap"
          >
            <Copy size={11} />
            Dupliquer préc.
          </button>
          <button
            onClick={() => setDupModalOpen(true)}
            className="px-2 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded flex items-center gap-1 whitespace-nowrap"
          >
            <Calendar size={11} />
            Dupliquer vers…
          </button>
          <button
            onClick={exportPDF}
            className="px-2 py-1 text-[10px] font-bold bg-slate-700 text-white rounded flex items-center gap-1 whitespace-nowrap"
            title="Télécharger / imprimer en PDF"
          >
            <Download size={11} />
            PDF
          </button>
          <button
            onClick={() => setEmailModalOpen(true)}
            className="px-2 py-1 text-[10px] font-bold bg-cyan-600 text-white rounded flex items-center gap-1 whitespace-nowrap"
            title="Envoyer le planning par mail"
          >
            <Send size={11} />
            Mail
          </button>
          <button
            onClick={clearWeek}
            className="px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded flex items-center gap-1 whitespace-nowrap"
          >
            <Trash2 size={11} />
            Effacer
          </button>
        </div>
      )}

      {/* Sélecteur jour mobile */}
      {tab === "grid" && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-2 py-1.5 flex gap-1 shrink-0 overflow-x-auto">
          {weekDays.map((d, i) => {
            const active = selectedDay === i;
            const today = pl_iso(d) === pl_iso(new Date());
            const cov = analyzeCoverage(pl_iso(d));
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`shrink-0 px-2.5 py-1 rounded flex flex-col items-center text-[10px] font-bold min-w-[48px] relative ${
                  active
                    ? "bg-orange-500 text-white"
                    : today
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                <span className="uppercase">
                  {d.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 3)}
                </span>
                <span className="text-sm">{d.getDate()}</span>
                {cov.alerts.length > 0 && !active && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Corps principal scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        {tab === "grid" && (
          <PlanGridView
            employees={visibleEmployees}
            weekDays={weekDays}
            selectedDay={selectedDay}
            getCellData={getCellData}
            weekMinsOf={weekMinsOf}
            weekTargetMinsOf={weekTargetMinsOf}
            currentMonday={currentMonday}
            analyzeCoverage={analyzeCoverage}
            clipboard={clipboard}
            onCopyDay={copyDay}
            onPasteDay={pasteDay}
            onCellClick={(emp, date) => {
              if (
                !isAdmin &&
                (emp.fcId || "").toUpperCase() !==
                  (currentUser?.fc || "").toUpperCase()
              )
                return;
              setEditCell({
                empId: emp.id,
                dateKey: pl_iso(date),
                date,
                data: getCellData(emp, date),
                emp,
              });
            }}
            onEmpClick={(emp) => isAdmin && setEditEmp(emp)}
            isAdmin={isAdmin}
          />
        )}
        {tab === "team" && isAdmin && (
          <PlanTeamView
            employees={data.employees}
            onEmpClick={(emp) => setEditEmp(emp)}
            onAddEmp={() => setEditEmp("new")}
          />
        )}
        {tab === "absences" && (
          <PlanAbsencesView
            employees={visibleEmployees}
            absences={(data.absences || []).filter((a) => {
              if (isAdmin) return true;
              const emp = data.employees.find((e) => e.id === a.empId);
              if (!emp) return false;
              return (
                (emp.fcId || "").toUpperCase() ===
                (currentUser?.fc || "").toUpperCase()
              );
            })}
            onAdd={isAdmin ? () => setAddAbsence(true) : null}
            onDelete={isAdmin ? deleteAbsence : null}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {/* Modales */}
      {editCell && (
        <PlanCellEditModal
          initial={editCell}
          clipboard={clipboard}
          onCopy={() => {
            copyDay(editCell.emp, editCell.date);
          }}
          onPaste={() => {
            if (!clipboard) return;
            pasteDay(editCell.emp, editCell.date);
            setEditCell(null);
          }}
          onApplyPreset={(p) => {
            applyPresetToCell(editCell.emp, editCell.date, p);
            setEditCell(null);
          }}
          onSave={saveCellEdit}
          onClose={() => setEditCell(null)}
        />
      )}
      {editEmp && (
        <PlanEmployeeModal
          initial={editEmp === "new" ? null : editEmp}
          onSave={saveEmployee}
          onDelete={(id) => setConfirmDelete(id)}
          onClose={() => setEditEmp(null)}
          getYearStats={getYearStats}
          absences={(data.absences || []).filter(
            (a) => editEmp !== "new" && a.empId === editEmp.id,
          )}
          onAddAbsenceForEmp={(abs) => {
            setData((prev) => ({
              ...prev,
              absences: [
                ...(prev.absences || []),
                { ...abs, id: Date.now() + Math.random() },
              ],
            }));
          }}
          onDeleteAbsence={deleteAbsence}
        />
      )}
      {addAbsence && (
        <PlanAbsenceModal
          employees={data.employees}
          onSave={saveAbsence}
          onClose={() => setAddAbsence(false)}
        />
      )}
      {dupModalOpen && (
        <PlanDupModal
          onConfirm={duplicateToDate}
          onClose={() => setDupModalOpen(false)}
        />
      )}
      {emailModalOpen && (
        <PlanEmailModal
          isAdmin={isAdmin}
          defaultScope={isAdmin ? "all" : "self"}
          onSend={sendPlanningByEmail}
          onClose={() => setEmailModalOpen(false)}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          title="Supprimer le salarié ?"
          message="Planning et absences seront aussi supprimés."
          confirmText="Supprimer"
          danger
          onConfirm={() => deleteEmployee(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-bold z-[80] ${
            toast.kind === "danger"
              ? "bg-red-600"
              : toast.kind === "warning"
                ? "bg-amber-600"
                : "bg-emerald-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// --- Vue grille ---
function PlanGridView({
  employees,
  weekDays,
  selectedDay,
  getCellData,
  weekMinsOf,
  weekTargetMinsOf,
  currentMonday,
  analyzeCoverage,
  clipboard,
  onCopyDay,
  onPasteDay,
  onCellClick,
  onEmpClick,
  isAdmin,
}) {
  if (employees.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Users size={36} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">
          {isAdmin
            ? "Aucun salarié. Ajoutez-en via le bouton Salarié."
            : "Votre profil n'est pas encore créé dans le planning."}
        </p>
      </div>
    );
  }
  const todayStr = pl_iso(new Date());

  return (
    <>
      <div className="sm:hidden p-2 space-y-2">
        <PlanDayCoverageBanner
          date={weekDays[selectedDay]}
          cov={analyzeCoverage(pl_iso(weekDays[selectedDay]))}
        />
        {employees.map((emp) => {
          const cell = getCellData(emp, weekDays[selectedDay]);
          return (
            <PlanDayCard
              key={emp.id}
              emp={emp}
              date={weekDays[selectedDay]}
              cell={cell}
              onClick={() => onCellClick(emp, weekDays[selectedDay])}
              onEmpClick={() => onEmpClick(emp)}
              weekMins={weekMinsOf(emp)}
              contractH={pl_getContractH(emp, currentMonday)}
              targetMins={weekTargetMinsOf(emp)}
              weekVariant={pl_getWeekVariant(emp, currentMonday)}
              isAdmin={isAdmin}
              clipboard={clipboard}
              onCopy={() => onCopyDay(emp, weekDays[selectedDay])}
              onPaste={() => onPasteDay(emp, weekDays[selectedDay])}
            />
          );
        })}
      </div>

      <div className="hidden sm:block p-2">
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100">
                <th className="sticky left-0 bg-slate-100 px-2 py-2 text-left font-bold text-slate-700 border-b border-slate-200 min-w-[140px] z-10">
                  Collaborateur
                </th>
                <th className="px-1 py-2 text-center font-bold text-slate-700 border-b border-slate-200 min-w-[66px]">
                  Total
                </th>
                {weekDays.map((d, i) => (
                  <th
                    key={i}
                    className={`px-1 py-2 text-center font-bold text-slate-700 border-b border-slate-200 min-w-[104px] ${pl_iso(d) === todayStr ? "bg-blue-100 text-blue-800" : ""}`}
                  >
                    <div className="text-[10px] uppercase">
                      {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                    </div>
                    <div className="text-sm font-black">
                      {d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const wkMins = weekMinsOf(emp);
                const contractH = pl_getContractH(emp, currentMonday);
                const targetMins = weekTargetMinsOf(emp);
                const diff = wkMins - targetMins;
                const targetH = targetMins / 60;
                const wkVar = pl_getWeekVariant(emp, currentMonday);
                return (
                  <tr key={emp.id} className="border-b border-slate-100">
                    <td
                      className="sticky left-0 bg-white px-2 py-1.5 font-semibold text-slate-800 z-10 cursor-pointer hover:bg-slate-50"
                      onClick={() => onEmpClick(emp)}
                    >
                      <div className="flex items-center gap-1 text-sm">
                        <span>{emp.firstName}</span>
                        {wkVar && (
                          <span className="text-[8px] bg-orange-500 text-white font-black px-1 rounded">
                            S.{wkVar}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-500 flex items-center gap-1">
                        <span>{emp.fcId || "—"}</span>
                        <span>·</span>
                        <span className="truncate">{emp.role}</span>
                      </div>
                    </td>
                    <td className="px-1 py-1.5 text-center">
                      <div className="font-black text-sm text-slate-800">{pl_fHM(wkMins)}</div>
                      <div className="text-[9px] text-slate-500">
                        /{targetH === contractH ? `${contractH}h` : (
                          <span title={`Contrat ${contractH}h − absences payées`}>
                            {targetH.toFixed(1).replace('.0', '').replace('.', ',')}h<span className="text-amber-600">*</span>
                          </span>
                        )}
                      </div>
                      {diff !== 0 && (
                        <div className={`text-[9px] font-bold ${diff > 0 ? "text-emerald-600" : "text-amber-600"}`}>
                          {diff > 0 ? "+" : "−"}{pl_fHM(Math.abs(diff))}
                        </div>
                      )}
                    </td>
                    {weekDays.map((d, i) => {
                      const cell = getCellData(emp, d);
                      return (
                        <td key={i} className="p-0.5 align-top cursor-pointer" onClick={() => onCellClick(emp, d)}>
                          <PlanMiniCell cell={cell} emp={emp} date={d} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="bg-slate-50">
                <td colSpan={2} className="sticky left-0 bg-slate-50 px-2 py-1.5 text-right text-[10px] font-bold text-slate-500 z-10">
                  MANQUANTS
                </td>
                {weekDays.map((d, i) => {
                  const cov = analyzeCoverage(pl_iso(d));
                  return (
                    <td key={i} className="px-1 py-1 text-center align-top">
                      {cov.closed ? (
                        <span className="text-[9px] text-indigo-600 font-bold">🎌 Fermé</span>
                      ) : cov.alerts.length === 0 ? (
                        <span className="text-[9px] text-emerald-600 font-bold">✓ OK</span>
                      ) : (
                        <div className="space-y-0.5">
                          {cov.alerts.map((a, j) => (
                            <div key={j} className="text-[9px] text-red-600 font-semibold">⚠ {a}</div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PlanDayCoverageBanner({ date, cov }) {
  if (cov.closed) {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center text-xs font-bold text-indigo-700">
        🎌 Jour férié — Magasin fermé
      </div>
    );
  }
  if (cov.alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center text-xs font-bold text-emerald-700">
        ✓ Couverture complète{cov.peak ? " (jour de pointe)" : ""}
      </div>
    );
  }
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
      <div className="text-[10px] font-bold text-red-700 uppercase mb-1">
        ⚠ Manquants{cov.peak ? " (jour de pointe)" : ""}
      </div>
      <div className="flex flex-wrap gap-1">
        {cov.alerts.map((a, i) => (
          <span key={i} className="text-[10px] font-semibold bg-white text-red-700 px-2 py-0.5 rounded border border-red-200">
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlanDayCard({ emp, date, cell, onClick, onEmpClick, weekMins, contractH, targetMins, weekVariant, isAdmin, clipboard, onCopy, onPaste }) {
  const typeStyles = {
    Travail: "bg-white border-slate-200",
    Repos: "bg-slate-100 border-slate-200 opacity-70",
    Vacances: "bg-emerald-50 border-emerald-200",
    RTT: "bg-blue-50 border-blue-200",
    Maladie: "bg-red-50 border-red-200",
    Formation: "bg-purple-50 border-purple-200",
    Férié: "bg-indigo-50 border-indigo-200",
  };
  const isWork = cell.type === "Travail";
  const mins = isWork ? pl_calcMins(cell) : 0;
  const missions = [cell.m1, cell.m2, cell.m3].filter(Boolean);
  const effectiveTarget = typeof targetMins === "number" ? targetMins : contractH * 60;
  const diff = weekMins - effectiveTarget;
  const targetH = effectiveTarget / 60;
  return (
    <div className={`border rounded-lg p-2.5 ${typeStyles[cell.type] || typeStyles.Travail}`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <button onClick={onEmpClick} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-slate-800 truncate">{emp.firstName}</span>
            {weekVariant && (
              <span className="text-[8px] bg-orange-500 text-white font-black px-1 rounded">S.{weekVariant}</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <span>{emp.fcId || "—"}</span>
            <span>·</span>
            <span className="truncate">{emp.role}</span>
          </div>
        </button>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-bold text-slate-600">{pl_fHM(weekMins)}</div>
          <div className="text-[9px] text-slate-500">
            /{targetH === contractH ? `${contractH}h` : (
              <span title={`Contrat ${contractH}h − absences`}>
                {targetH.toFixed(1).replace('.0', '').replace('.', ',')}h<span className="text-amber-600">*</span>
              </span>
            )}
          </div>
          {diff !== 0 && weekMins > 0 && (
            <div className={`text-[9px] font-bold ${diff > 0 ? "text-emerald-600" : "text-amber-600"}`}>
              {diff > 0 ? "+" : "−"}{pl_fHM(Math.abs(diff))}
            </div>
          )}
        </div>
      </div>
      <button onClick={onClick} className="w-full text-left bg-slate-50 hover:bg-slate-100 rounded p-2 transition">
        {!isWork ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {cell.type === "Repos" ? "🛋️" : cell.type === "Vacances" ? "🏖️" : cell.type === "RTT" ? "📅" : cell.type === "Maladie" ? "🤒" : cell.type === "Formation" ? "📚" : "🎌"}
              </span>
              <span className="font-bold text-sm text-slate-700">{cell.type}</span>
            </div>
            {PL_PAID_ABSENCE_TYPES.includes(cell.type) && (
              <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                − {pl_fHM(pl_avgMinsPerDay(emp, date))} décomptés
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                {cell.startAM || cell.startPM ? (
                  <>
                    {cell.startAM && (
                      <span className="font-mono font-bold text-slate-800">{cell.startAM}-{cell.endAM || "?"}</span>
                    )}
                    {cell.startPM && (
                      <span className="font-mono font-bold text-slate-800">{cell.startPM}-{cell.endPM || "?"}</span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-400 italic">Horaires à définir</span>
                )}
              </div>
              {mins > 0 && <span className="text-xs font-black text-orange-600">{pl_fHM(mins)}</span>}
            </div>
            {missions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {missions.map((m, i) => {
                  const mi = PLAN_MISSIONS.find((x) => x.val === m);
                  return (
                    <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${mi?.color || "bg-slate-100 text-slate-700"}`}>
                      {mi?.label || m}
                    </span>
                  );
                })}
              </div>
            )}
            {cell.break && <div className="mt-1 text-[9px] text-slate-500 italic">Pause 10 min déduite</div>}
          </>
        )}
      </button>
      {isAdmin && (
        <div className="flex gap-1 mt-1.5">
          <button onClick={onCopy} className="flex-1 text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 rounded flex items-center justify-center gap-1">
            <Copy size={10} /> Copier
          </button>
          {clipboard && (
            <button onClick={onPaste} className="flex-1 text-[9px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-700 py-1 rounded flex items-center justify-center gap-1">
              📋 Coller
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PlanMiniCell({ cell, emp, date }) {
  const typeBg = {
    Travail: "bg-white",
    Repos: "bg-slate-100 text-slate-400",
    Vacances: "bg-emerald-50 text-emerald-700",
    RTT: "bg-blue-50 text-blue-700",
    Maladie: "bg-red-50 text-red-700",
    Formation: "bg-purple-50 text-purple-700",
    Férié: "bg-indigo-50 text-indigo-700",
  };
  const isWork = cell.type === "Travail";
  const mins = isWork ? pl_calcMins(cell) : 0;
  const isPaidAbs =
    cell.type && PL_PAID_ABSENCE_TYPES.includes(cell.type);
  const avg = isPaidAbs && emp && date ? pl_avgMinsPerDay(emp, date) : 0;
  return (
    <div className={`rounded border border-slate-200 px-1.5 py-1 min-h-[62px] text-[10px] hover:ring-2 hover:ring-orange-300 ${typeBg[cell.type] || "bg-white"}`}>
      {!isWork ? (
        <div className="flex flex-col items-center justify-center py-1 gap-0.5">
          <div className="font-bold">{cell.type}</div>
          {isPaidAbs && avg > 0 && (
            <div className="text-[9px] font-black opacity-80">−{pl_fHM(avg)}</div>
          )}
        </div>
      ) : (
        <>
          {cell.startAM && <div className="font-mono font-semibold">{cell.startAM}-{cell.endAM || "?"}</div>}
          {cell.startPM && <div className="font-mono font-semibold">{cell.startPM}-{cell.endPM || "?"}</div>}
          {!cell.startAM && !cell.startPM && <div className="text-slate-400 italic text-center py-2">—</div>}
          {mins > 0 && <div className="text-right text-[9px] font-bold text-orange-600">{pl_fHM(mins)}</div>}
          {cell.m1 && (
            <div className={`text-[8px] font-bold px-1 rounded truncate mt-0.5 ${PLAN_MISSIONS.find((x) => x.val === cell.m1)?.color || "bg-slate-100 text-slate-700"}`}>
              {PLAN_MISSIONS.find((x) => x.val === cell.m1)?.label || cell.m1}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlanTeamView({ employees, onEmpClick, onAddEmp }) {
  return (
    <div className="p-3 space-y-2">
      <button onClick={onAddEmp} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2">
        <UserPlus size={16} />
        Ajouter un salarié
      </button>
      {employees.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          <Users size={36} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucun salarié</p>
        </div>
      ) : (
        employees.map((emp) => (
          <button key={emp.id} onClick={() => onEmpClick(emp)} className="w-full bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3 hover:border-orange-400 transition text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shrink-0">
              {emp.firstName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-slate-800 truncate">{emp.firstName}</span>
                {pl_isTplNonEmpty(emp.fixedScheduleB) && <span className="text-[8px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">A/B</span>}
                {pl_isTplNonEmpty(emp.fixedScheduleA) && !pl_isTplNonEmpty(emp.fixedScheduleB) && <span className="text-[8px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Type</span>}
                {emp.pin && <span className="text-[8px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">🔒 PIN</span>}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {emp.role} · {emp.fcId || "—"} · {emp.contractHoursB ? (
                  <>
                    <span className="font-bold text-orange-600">{emp.contractHours}h</span>/
                    <span className="font-bold text-blue-600">{emp.contractHoursB}h</span>
                    {" "}
                    (moy. <span className="font-bold text-emerald-700">{((parseFloat(emp.contractHours) + parseFloat(emp.contractHoursB)) / 2).toFixed(2).replace('.', ',')}h</span>)
                  </>
                ) : (
                  `${emp.contractHours}h`
                )}
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 shrink-0" />
          </button>
        ))
      )}
    </div>
  );
}

function PlanAbsencesView({ employees, absences, onAdd, onDelete, isAdmin }) {
  const todayStr = pl_iso(new Date());
  const sorted = [...absences].sort((a, b) => b.start.localeCompare(a.start));
  return (
    <div className="p-3 space-y-2">
      {onAdd && (
        <button onClick={onAdd} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2">
          <Plus size={16} />
          Saisir une absence
        </button>
      )}
      {sorted.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          <Award size={36} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucune absence enregistrée</p>
        </div>
      ) : (
        sorted.map((a) => {
          const emp = employees.find((e) => e.id === a.empId);
          const isPast = a.end < todayStr;
          const isOngoing = a.start <= todayStr && a.end >= todayStr;
          const typeColor = {
            Vacances: "bg-emerald-100 text-emerald-700",
            RTT: "bg-blue-100 text-blue-700",
            Maladie: "bg-red-100 text-red-700",
            Formation: "bg-purple-100 text-purple-700",
            Férié: "bg-indigo-100 text-indigo-700",
          };
          return (
            <div key={a.id} className={`bg-white border rounded-lg p-2.5 flex items-center gap-2 ${isOngoing ? "border-amber-300" : "border-slate-200"} ${isPast ? "opacity-60" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-slate-800">{emp?.firstName || "—"}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeColor[a.type] || "bg-slate-100 text-slate-700"}`}>{a.type}</span>
                  {isOngoing && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">EN COURS</span>}
                  {a.fromRequest && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-700">Demande</span>}
                </div>
                <div className="text-[11px] text-slate-500">Du {a.start} au {a.end}</div>
              </div>
              {onDelete && !a.fromRequest && (
                <button onClick={() => onDelete(a.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// --- Modal édition cellule ---
function PlanCellEditModal({ initial, clipboard, onCopy, onPaste, onApplyPreset, onSave, onClose }) {
  const [type, setType] = useState(initial.data.type || "Travail");
  const [startAM, setStartAM] = useState(initial.data.startAM || "");
  const [endAM, setEndAM] = useState(initial.data.endAM || "");
  const [startPM, setStartPM] = useState(initial.data.startPM || "");
  const [endPM, setEndPM] = useState(initial.data.endPM || "");
  const [brk, setBrk] = useState(!!initial.data.break);
  const [m1, setM1] = useState(initial.data.m1 || "");
  const [m2, setM2] = useState(initial.data.m2 || "");
  const [m3, setM3] = useState(initial.data.m3 || "");

  const preview = pl_calcMins({ type, startAM, endAM, startPM, endPM, break: brk });
  const dateLabel = initial.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  // Presets selon rôle
  const isGerant = initial.emp?.role === "Gérant";
  const isLivreur = initial.emp?.role === "Livreur Polyvalent";
  const presets = isGerant
    ? ["G_RH", "G_COMPTA", "G_VENTE"]
    : isLivreur
      ? []
      : ["T1", "T2", "T3", "SO", "SC", "SCM", "SCS"];
  const presetLabels = {
    T1: "T1 (9h45)",
    T2: "T2 (10h)",
    T3: "T3 (10h30)",
    SO: "Ouverture",
    SC: "Fermeture",
    SCM: "Caisse ouv.",
    SCS: "Caisse ferm.",
    G_RH: "RH",
    G_COMPTA: "Compta",
    G_VENTE: "Ventes",
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style={{ maxHeight: "min(92vh, 92dvh)" }} onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-base">{initial.emp?.firstName || "Salarié"}</div>
              <div className="text-[11px] opacity-90 capitalize">{dateLabel}</div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Type de journée</div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { v: "Travail", icon: "💼", label: "Trav." },
                { v: "Repos", icon: "🛋️", label: "Repos" },
                { v: "Vacances", icon: "🏖️", label: "CP" },
                { v: "RTT", icon: "📅", label: "RTT" },
                { v: "Maladie", icon: "🤒", label: "Mal." },
                { v: "Formation", icon: "📚", label: "Form." },
                { v: "Férié", icon: "🎌", label: "Férié" },
              ].map((t) => (
                <button key={t.v} onClick={() => setType(t.v)} className={`px-1 py-2 rounded text-[10px] font-bold flex flex-col items-center gap-0.5 transition ${type === t.v ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  <span className="text-sm">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {type === "Travail" && (
            <>
              {/* Actions rapides : copier/coller + presets */}
              <div className="flex gap-1 flex-wrap">
                <button onClick={onCopy} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center gap-1">
                  <Copy size={11} /> Copier
                </button>
                {clipboard && (
                  <button onClick={onPaste} className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-[10px] font-bold rounded flex items-center gap-1">
                    📋 Coller
                  </button>
                )}
              </div>

              {presets.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Horaires rapides</div>
                  <div className="flex gap-1 flex-wrap">
                    {presets.map((p) => (
                      <button key={p} onClick={() => onApplyPreset(p)} className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-[10px] font-bold rounded">
                        {presetLabels[p]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Matin</div>
                <div className="flex gap-2">
                  <input type="time" value={startAM} onChange={(e) => setStartAM(e.target.value)} className="flex-1 px-2 py-2 border border-slate-300 rounded text-sm font-mono" />
                  <span className="self-center text-slate-400">→</span>
                  <input type="time" value={endAM} onChange={(e) => setEndAM(e.target.value)} className="flex-1 px-2 py-2 border border-slate-300 rounded text-sm font-mono" />
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Après-midi</div>
                <div className="flex gap-2">
                  <input type="time" value={startPM} onChange={(e) => setStartPM(e.target.value)} className="flex-1 px-2 py-2 border border-slate-300 rounded text-sm font-mono" />
                  <span className="self-center text-slate-400">→</span>
                  <input type="time" value={endPM} onChange={(e) => setEndPM(e.target.value)} className="flex-1 px-2 py-2 border border-slate-300 rounded text-sm font-mono" />
                </div>
              </div>
              <label className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 cursor-pointer">
                <input type="checkbox" checked={brk} onChange={(e) => setBrk(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm text-slate-700">Pause -10 min déduite</span>
              </label>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Missions du jour (3 max)</div>
                <div className="space-y-1.5">
                  {[m1, m2, m3].map((val, i) => {
                    const setter = [setM1, setM2, setM3][i];
                    return (
                      <select key={i} value={val} onChange={(e) => setter(e.target.value)} className="w-full px-2 py-2 border border-slate-300 rounded text-sm">
                        <option value="">— Mission {i + 1} —</option>
                        {PLAN_MISSIONS.map((m) => (
                          <option key={m.val} value={m.val}>{m.label}</option>
                        ))}
                      </select>
                    );
                  })}
                </div>
              </div>
              {preview > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">Total journée</span>
                  <div className="text-xl font-black text-orange-700">{pl_fHM(preview)}</div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="border-t border-slate-200 bg-white p-3 flex gap-2 shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg">
            Annuler
          </button>
          <button onClick={() => onSave({ type, startAM, endAM, startPM, endPM, break: brk, m1, m2, m3 })} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Modal employé avec onglets (Identité / Planning type / Absences / Stats) ---
function PlanEmployeeModal({ initial, onSave, onDelete, onClose, getYearStats, absences, onAddAbsenceForEmp, onDeleteAbsence }) {
  const [activeTab, setActiveTab] = useState("identity");
  const [firstName, setFirstName] = useState(initial?.firstName || "");
  const [fcId, setFcId] = useState(initial?.fcId || "FC-");
  const [role, setRole] = useState(initial?.role || "Vendeur");
  const [contractHours, setContractHours] = useState(initial?.contractHours || 35);
  const [contractHoursB, setContractHoursB] = useState(initial?.contractHoursB || "");
  const [pin, setPin] = useState(initial?.pin || "");
  // Jusqu'à 4 jours de repos par semaine
  const [restDaysA, setRestDaysA] = useState(() => {
    const src = initial?.restDays || [];
    const out = [...src.map(String), "", "", "", ""].slice(0, 4);
    return out;
  });
  const [restDaysBState, setRestDaysBState] = useState(() => {
    const src = initial?.restDaysB || initial?.restDays || [];
    const out = [...src.map(String), "", "", "", ""].slice(0, 4);
    return out;
  });
  const setRestDayA = (idx, val) => {
    setRestDaysA((prev) => prev.map((v, i) => (i === idx ? val : v)));
  };
  const setRestDayB = (idx, val) => {
    setRestDaysBState((prev) => prev.map((v, i) => (i === idx ? val : v)));
  };

  // Planning type
  const [altern, setAltern] = useState(!!(initial?.fixedScheduleB || initial?.contractHoursB));
  const [currentWeekAB, setCurrentWeekAB] = useState("A");
  const [tplA, setTplA] = useState(() =>
    initial?.fixedScheduleA ? JSON.parse(JSON.stringify(initial.fixedScheduleA)) :
    initial?.fixedSchedule ? JSON.parse(JSON.stringify(initial.fixedSchedule)) : {}
  );
  const [tplB, setTplB] = useState(() =>
    initial?.fixedScheduleB ? JSON.parse(JSON.stringify(initial.fixedScheduleB)) : {}
  );

  // Absences onglet
  const [absStart, setAbsStart] = useState(pl_iso(new Date()));
  const [absEnd, setAbsEnd] = useState(pl_iso(new Date()));
  const [absType, setAbsType] = useState("Vacances");

  const canSave = firstName.trim().length > 0;
  const handleSave = () => {
    if (!canSave) return;
    // Dédupliquer et nettoyer les jours de repos
    const restDays = [...new Set(restDaysA.filter((x) => x !== "").map(Number))];
    const restDaysB = [
      ...new Set(restDaysBState.filter((x) => x !== "").map(Number)),
    ];
    const emp = {
      ...(initial || {}),
      id: initial?.id,
      firstName: firstName.trim(),
      fcId: fcId.trim(),
      role,
      contractHours: parseFloat(contractHours) || 35,
      restDays,
    };
    if (pin && /^\d{4}$/.test(pin)) emp.pin = pin;
    else if (!pin) delete emp.pin;
    // Plannings types (A/B)
    if (pl_isTplNonEmpty(tplA)) emp.fixedScheduleA = tplA;
    else delete emp.fixedScheduleA;
    // Alternance A/B : le contrat B et les repos B sont sauvegardés si alternance
    if (altern) {
      emp.contractHoursB = parseFloat(contractHoursB) || emp.contractHours;
      // Si les jours de repos B sont différents de A, on les sauvegarde
      const sortedA = [...restDays].sort();
      const sortedB = [...restDaysB].sort();
      const sameRest =
        sortedA.length === sortedB.length &&
        sortedA.every((d, i) => d === sortedB[i]);
      if (!sameRest && restDaysB.length > 0) {
        emp.restDaysB = restDaysB;
      } else {
        delete emp.restDaysB;
      }
      if (pl_isTplNonEmpty(tplB)) emp.fixedScheduleB = tplB;
      else delete emp.fixedScheduleB;
    } else {
      delete emp.fixedScheduleB;
      delete emp.contractHoursB;
      delete emp.restDaysB;
    }
    // Livreur forced rest days
    if (role === "Livreur Polyvalent") emp.restDays = [4, 0];
    onSave(emp);
  };

  const updTpl = (week, dn, field, value) => {
    const setter = week === "A" ? setTplA : setTplB;
    const current = week === "A" ? tplA : tplB;
    const newTpl = { ...current };
    if (!newTpl[dn]) newTpl[dn] = { type: "Travail", startAM: "", endAM: "", startPM: "", endPM: "" };
    if (field === "type") {
      if (value === "Repos") newTpl[dn] = { type: "Repos" };
      else newTpl[dn] = { type: "Travail", startAM: newTpl[dn].startAM || "", endAM: newTpl[dn].endAM || "", startPM: newTpl[dn].startPM || "", endPM: newTpl[dn].endPM || "" };
    } else {
      newTpl[dn][field] = value;
    }
    setter(newTpl);
  };

  const stats = initial ? getYearStats(initial.id) : null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "min(92vh, 92dvh)" }} onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-3 shrink-0 flex items-center justify-between">
          <h3 className="font-bold text-base">{initial ? initial.firstName : "Nouveau salarié"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Onglets */}
        <div className="bg-slate-100 border-b border-slate-200 px-2 py-1.5 flex gap-1 shrink-0 overflow-x-auto">
          {[
            { id: "identity", label: "Identité" },
            { id: "template", label: "Planning type" },
            ...(initial ? [
              { id: "absences", label: "Absences" },
              { id: "stats", label: "Bilan annuel" }
            ] : []),
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-3 py-1 rounded text-[11px] font-bold whitespace-nowrap ${activeTab === t.id ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-white"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3">
          {/* --- ONGLET IDENTITÉ --- */}
          {activeTab === "identity" && (
            <>
              <PlanField label="Prénom *">
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </PlanField>
              <PlanField label="Identifiant FC">
                <input value={fcId} onChange={(e) => setFcId(e.target.value)} placeholder="FC1234" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none" />
              </PlanField>
              <PlanField label="Rôle">
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  {PLAN_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {role === "Livreur Polyvalent" && (
                  <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-1.5 mt-1">
                    💡 Repos automatiquement fixés au jeudi et dimanche. Horaires par défaut : 10h-13h / 14h-18h en Livraison.
                  </div>
                )}
              </PlanField>
              {/* Contrat : mono ou alterné A/B */}
              <PlanField label="Contrat horaire">
                <label className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 cursor-pointer mb-2">
                  <input type="checkbox" checked={altern} onChange={(e) => setAltern(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm text-slate-700 font-semibold">Contrat en alternance semaine A / semaine B</span>
                </label>
                {!altern ? (
                  <div>
                    <input type="number" step="0.5" value={contractHours} onChange={(e) => setContractHours(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="35" />
                    <div className="text-[10px] text-slate-500 mt-1">heures par semaine</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                        <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wide mb-1">Semaine A (impaire)</div>
                        <div className="flex items-center gap-1">
                          <input type="number" step="0.5" value={contractHours} onChange={(e) => setContractHours(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm font-mono bg-white" placeholder="25" />
                          <span className="text-xs font-bold text-orange-700">h</span>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                        <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-1">Semaine B (paire)</div>
                        <div className="flex items-center gap-1">
                          <input type="number" step="0.5" value={contractHoursB} onChange={(e) => setContractHoursB(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm font-mono bg-white" placeholder="35" />
                          <span className="text-xs font-bold text-blue-700">h</span>
                        </div>
                      </div>
                    </div>
                    {/* Moyenne pondérée calculée en direct */}
                    {(() => {
                      const hA = parseFloat(contractHours) || 0;
                      const hB = parseFloat(contractHoursB) || 0;
                      const moyenne = (hA + hB) / 2;
                      const total4sem = hA * 2 + hB * 2;
                      if (hA > 0 && hB > 0) {
                        return (
                          <div className="bg-gradient-to-r from-emerald-500 to-green-700 text-white rounded-lg p-2.5">
                            <div className="text-[10px] font-bold uppercase tracking-wide opacity-90">Moyenne pondérée</div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black">{moyenne.toFixed(2).replace('.', ',')}h</span>
                              <span className="text-xs opacity-90">/ semaine</span>
                            </div>
                            <div className="text-[10px] opacity-90 mt-1">
                              ({hA}h × 2) + ({hB}h × 2) = <strong>{total4sem}h sur 4 semaines</strong>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="text-[11px] text-slate-500 italic bg-slate-50 rounded-lg p-2">
                          Saisissez les deux semaines pour voir la moyenne
                        </div>
                      );
                    })()}
                  </div>
                )}
              </PlanField>
              <PlanField label="Code PIN (4 chiffres, facultatif)">
                <input type="text" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="1234" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none" />
              </PlanField>
              {role !== "Livreur Polyvalent" && !altern && (
                <PlanField label="Jours de repos (jusqu'à 4)">
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-7 gap-1">
                      {PLAN_DAY_ORDER.map((dn) => {
                        const selected = restDaysA
                          .filter((x) => x !== "")
                          .map(Number)
                          .includes(dn);
                        const toggle = () => {
                          if (selected) {
                            // Retire le jour
                            setRestDaysA((prev) => {
                              const out = prev.filter(
                                (v) => v !== "" && Number(v) !== dn,
                              );
                              while (out.length < 4) out.push("");
                              return out.slice(0, 4);
                            });
                          } else {
                            // Ajoute le jour (max 4)
                            setRestDaysA((prev) => {
                              const current = prev
                                .filter((x) => x !== "")
                                .map(Number);
                              if (current.length >= 4) return prev;
                              const next = [...current, dn].map(String);
                              while (next.length < 4) next.push("");
                              return next;
                            });
                          }
                        };
                        return (
                          <button
                            key={dn}
                            type="button"
                            onClick={toggle}
                            className={`py-2 rounded text-[10px] font-bold transition ${
                              selected
                                ? "bg-red-500 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {PLAN_DAY_LABELS[dn].slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {restDaysA.filter((x) => x !== "").length} / 4 sélectionné
                      {restDaysA.filter((x) => x !== "").length > 1 ? "s" : ""} · Tapez pour ajouter/retirer
                    </div>
                  </div>
                </PlanField>
              )}
              {role !== "Livreur Polyvalent" && altern && (
                <PlanField label="Jours de repos par semaine (jusqu'à 4 chacune)">
                  <div className="space-y-2">
                    {/* Semaine A */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                      <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wide mb-1.5">
                        Semaine A · {contractHours || "?"}h
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {PLAN_DAY_ORDER.map((dn) => {
                          const selected = restDaysA
                            .filter((x) => x !== "")
                            .map(Number)
                            .includes(dn);
                          const toggle = () => {
                            if (selected) {
                              setRestDaysA((prev) => {
                                const out = prev.filter(
                                  (v) => v !== "" && Number(v) !== dn,
                                );
                                while (out.length < 4) out.push("");
                                return out.slice(0, 4);
                              });
                            } else {
                              setRestDaysA((prev) => {
                                const current = prev
                                  .filter((x) => x !== "")
                                  .map(Number);
                                if (current.length >= 4) return prev;
                                const next = [...current, dn].map(String);
                                while (next.length < 4) next.push("");
                                return next;
                              });
                            }
                          };
                          return (
                            <button
                              key={dn}
                              type="button"
                              onClick={toggle}
                              className={`py-1.5 rounded text-[10px] font-bold transition ${
                                selected
                                  ? "bg-red-500 text-white"
                                  : "bg-white text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {PLAN_DAY_LABELS[dn].slice(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-[10px] text-orange-700 mt-1">
                        {restDaysA.filter((x) => x !== "").length} / 4 jour
                        {restDaysA.filter((x) => x !== "").length > 1 ? "s" : ""} de repos
                      </div>
                    </div>
                    {/* Semaine B */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                          Semaine B · {contractHoursB || "?"}h
                        </div>
                        <button
                          type="button"
                          onClick={() => setRestDaysBState([...restDaysA])}
                          className="text-[9px] bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold px-1.5 py-0.5 rounded"
                          title="Copier les repos de la semaine A"
                        >
                          ↺ Identique à A
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {PLAN_DAY_ORDER.map((dn) => {
                          const selected = restDaysBState
                            .filter((x) => x !== "")
                            .map(Number)
                            .includes(dn);
                          const toggle = () => {
                            if (selected) {
                              setRestDaysBState((prev) => {
                                const out = prev.filter(
                                  (v) => v !== "" && Number(v) !== dn,
                                );
                                while (out.length < 4) out.push("");
                                return out.slice(0, 4);
                              });
                            } else {
                              setRestDaysBState((prev) => {
                                const current = prev
                                  .filter((x) => x !== "")
                                  .map(Number);
                                if (current.length >= 4) return prev;
                                const next = [...current, dn].map(String);
                                while (next.length < 4) next.push("");
                                return next;
                              });
                            }
                          };
                          return (
                            <button
                              key={dn}
                              type="button"
                              onClick={toggle}
                              className={`py-1.5 rounded text-[10px] font-bold transition ${
                                selected
                                  ? "bg-red-500 text-white"
                                  : "bg-white text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {PLAN_DAY_LABELS[dn].slice(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-[10px] text-blue-700 mt-1">
                        {restDaysBState.filter((x) => x !== "").length} / 4 jour
                        {restDaysBState.filter((x) => x !== "").length > 1 ? "s" : ""} de repos
                      </div>
                    </div>
                    {/* Badge différence */}
                    {(() => {
                      const a = [...new Set(restDaysA.filter((x) => x !== "").map(Number))].sort();
                      const b = [...new Set(restDaysBState.filter((x) => x !== "").map(Number))].sort();
                      const same = a.length === b.length && a.every((v, i) => v === b[i]);
                      if (same) return (
                        <div className="text-[10px] text-slate-500 italic text-center">
                          Mêmes jours de repos pour A et B
                        </div>
                      );
                      return (
                        <div className="text-[10px] text-emerald-700 font-bold text-center bg-emerald-50 border border-emerald-200 rounded p-1">
                          ✓ Repos différents selon la semaine
                        </div>
                      );
                    })()}
                  </div>
                </PlanField>
              )}
              {initial && (
                <button onClick={() => onDelete(initial.id)} className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-sm flex items-center justify-center gap-2">
                  <Trash2 size={14} />
                  Supprimer ce salarié
                </button>
              )}
            </>
          )}

          {/* --- ONGLET PLANNING TYPE --- */}
          {activeTab === "template" && (
            <>
              {!altern ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-800">
                  💡 Pour activer l'alternance A/B, cochez la case dans l'onglet <strong>Identité</strong>.
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[11px] text-slate-600">
                    Alternance active — Semaine A : <strong>{contractHours || "?"}h</strong> / Semaine B : <strong>{contractHoursB || "?"}h</strong>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setCurrentWeekAB("A")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold ${currentWeekAB === "A" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                      Semaine A · {contractHours || "?"}h
                    </button>
                    <button onClick={() => setCurrentWeekAB("B")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold ${currentWeekAB === "B" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                      Semaine B · {contractHoursB || "?"}h
                    </button>
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {altern ? `Horaires type — Semaine ${currentWeekAB}` : "Horaires type de la semaine"}
                  </div>
                  {(() => {
                    const tpl = altern ? (currentWeekAB === "A" ? tplA : tplB) : tplA;
                    const totalMins = PLAN_DAY_ORDER.reduce((s, dn) => {
                      const d = tpl[dn];
                      if (d && d.type === "Travail") return s + pl_calcMins(d);
                      return s;
                    }, 0);
                    const target = altern ? (currentWeekAB === "A" ? parseFloat(contractHours) || 0 : parseFloat(contractHoursB) || 0) : parseFloat(contractHours) || 0;
                    const targetMins = target * 60;
                    const diff = totalMins - targetMins;
                    if (totalMins === 0) return null;
                    return (
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${diff === 0 ? "bg-emerald-100 text-emerald-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                        {pl_fHM(totalMins)} / {target}h {diff !== 0 ? `(${diff > 0 ? "+" : "−"}${pl_fHM(Math.abs(diff))})` : "✓"}
                      </div>
                    );
                  })()}
                </div>
                {PLAN_DAY_ORDER.map((dn) => {
                  const tpl = altern ? (currentWeekAB === "A" ? tplA : tplB) : tplA;
                  const d = tpl[dn] || { type: "Travail", startAM: "", endAM: "", startPM: "", endPM: "" };
                  const isWork = d.type === "Travail";
                  const mins = isWork ? pl_calcMins(d) : 0;
                  return (
                    <div key={dn} className={`bg-white border border-slate-200 rounded-lg p-2 ${!isWork ? "opacity-70" : ""}`}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-sm text-slate-800">{PLAN_DAY_LABELS[dn]}</span>
                        <select value={d.type} onChange={(e) => updTpl(currentWeekAB, dn, "type", e.target.value)} className="px-2 py-1 border border-slate-300 rounded text-xs">
                          <option value="Travail">Travail</option>
                          <option value="Repos">Repos</option>
                        </select>
                      </div>
                      {isWork && (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <input type="time" value={d.startAM || ""} onChange={(e) => updTpl(currentWeekAB, dn, "startAM", e.target.value)} className="flex-1 px-1.5 py-1 border border-slate-300 rounded text-xs font-mono" />
                            <span className="text-slate-400 text-xs">-</span>
                            <input type="time" value={d.endAM || ""} onChange={(e) => updTpl(currentWeekAB, dn, "endAM", e.target.value)} className="flex-1 px-1.5 py-1 border border-slate-300 rounded text-xs font-mono" />
                            <span className="text-slate-400 text-xs mx-1">/</span>
                            <input type="time" value={d.startPM || ""} onChange={(e) => updTpl(currentWeekAB, dn, "startPM", e.target.value)} className="flex-1 px-1.5 py-1 border border-slate-300 rounded text-xs font-mono" />
                            <span className="text-slate-400 text-xs">-</span>
                            <input type="time" value={d.endPM || ""} onChange={(e) => updTpl(currentWeekAB, dn, "endPM", e.target.value)} className="flex-1 px-1.5 py-1 border border-slate-300 rounded text-xs font-mono" />
                          </div>
                          {mins > 0 && <div className="text-right text-[10px] font-bold text-orange-600">{pl_fHM(mins)}</div>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* --- ONGLET ABSENCES --- */}
          {activeTab === "absences" && initial && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 space-y-2">
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Nouvelle absence</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <input type="date" value={absStart} onChange={(e) => setAbsStart(e.target.value)} className="px-2 py-1.5 border border-slate-300 rounded text-xs" />
                  <input type="date" value={absEnd} onChange={(e) => setAbsEnd(e.target.value)} className="px-2 py-1.5 border border-slate-300 rounded text-xs" />
                </div>
                <select value={absType} onChange={(e) => setAbsType(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs">
                  {PLAN_ABSENCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button onClick={() => {
                  if (!absStart || !absEnd || absStart > absEnd) return;
                  onAddAbsenceForEmp({ empId: initial.id, start: absStart, end: absEnd, type: absType });
                  setAbsStart(pl_iso(new Date()));
                  setAbsEnd(pl_iso(new Date()));
                }} className="w-full px-3 py-1.5 bg-amber-600 text-white rounded text-xs font-bold">+ Ajouter</button>
              </div>
              <div className="space-y-1.5">
                {absences.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm py-4">Aucune absence</div>
                ) : (
                  absences.sort((a, b) => b.start.localeCompare(a.start)).map((a) => (
                    <div key={a.id} className="bg-white border border-slate-200 rounded p-2 flex items-center gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800">{a.type}</div>
                        <div className="text-[11px] text-slate-500">Du {a.start} au {a.end}</div>
                      </div>
                      {!a.fromRequest && (
                        <button onClick={() => onDeleteAbsence(a.id)} className="p-1 text-red-600">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* --- ONGLET STATS --- */}
          {activeTab === "stats" && stats && (
            <>
              <div className="bg-gradient-to-br from-emerald-500 to-green-700 text-white rounded-lg p-3 text-center">
                <div className="text-[10px] opacity-90 font-bold uppercase tracking-wide">Total {new Date().getFullYear()}</div>
                <div className="text-3xl font-black">{pl_fHM(stats.total)}</div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {stats.months.map((m, i) => (
                  <div key={m} className={`rounded-lg p-2 text-center ${stats.stats[i] > 0 ? "bg-blue-50" : "bg-slate-100 opacity-60"}`}>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{m}</div>
                    <div className="text-sm font-black text-slate-800">{pl_fHM(stats.stats[i])}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-3 flex gap-2 shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg">
            Fermer
          </button>
          <button onClick={handleSave} disabled={!canSave} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-lg disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Modal ajout absence ---
function PlanAbsenceModal({ employees, onSave, onClose }) {
  const [empId, setEmpId] = useState(employees[0]?.id || "");
  const [start, setStart] = useState(pl_iso(new Date()));
  const [end, setEnd] = useState(pl_iso(new Date()));
  const [type, setType] = useState("Vacances");
  const canSave = empId && start && end && start <= end;
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style={{ maxHeight: "min(92vh, 92dvh)" }} onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-4 py-3 shrink-0 flex items-center justify-between">
          <h3 className="font-bold text-base">Nouvelle absence</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3">
          <PlanField label="Salarié">
            <select value={empId} onChange={(e) => setEmpId(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.firstName} ({e.fcId || "—"})</option>
              ))}
            </select>
          </PlanField>
          <PlanField label="Type">
            <div className="grid grid-cols-5 gap-1">
              {PLAN_ABSENCE_TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} className={`px-1 py-2 rounded text-[10px] font-bold ${type === t ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {t}
                </button>
              ))}
            </div>
          </PlanField>
          <div className="grid grid-cols-2 gap-2">
            <PlanField label="Début">
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </PlanField>
            <PlanField label="Fin">
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </PlanField>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-white p-3 flex gap-2 shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg">
            Annuler
          </button>
          <button onClick={() => onSave({ empId, start, end, type })} disabled={!canSave} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold rounded-lg disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Modal duplication vers date ---
// --- Modal envoi par mail ---
function PlanEmailModal({ isAdmin, defaultScope, onSend, onClose }) {
  const [email, setEmail] = useState("");
  const [scope, setScope] = useState(defaultScope);
  const canSend = true; // mailto: ouvre même sans adresse

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-2"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send size={18} />
            <h3 className="font-bold text-base">Envoyer par mail</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <PlanField label="Destinataire (facultatif)">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresse@exemple.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <div className="text-[10px] text-slate-500 mt-1">
              Laissez vide pour choisir dans votre application mail
            </div>
          </PlanField>
          {isAdmin && (
            <PlanField label="Quoi envoyer ?">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setScope("all")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold ${scope === "all" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  👥 Tous les salariés
                </button>
                <button
                  onClick={() => setScope("self")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold ${scope === "self" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  👤 Moi uniquement
                </button>
              </div>
            </PlanField>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-800">
            💡 Votre application mail s'ouvrira avec le planning pré-rempli (résumé texte). Vous pourrez joindre le PDF manuellement si besoin.
          </div>
        </div>
        <div className="border-t border-slate-200 p-3 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={() => onSend(email.trim(), scope)}
            disabled={!canSend}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
          >
            <Send size={14} />
            Ouvrir mail
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanDupModal({ onConfirm, onClose }) {
  const [target, setTarget] = useState(pl_iso(new Date()));
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <h3 className="font-bold text-base">Dupliquer la semaine vers…</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="text-sm text-slate-600">
            Copie toute la semaine courante vers la semaine contenant la date choisie.
          </div>
          <input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        </div>
        <div className="border-t border-slate-200 p-3 flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg">Annuler</button>
          <button onClick={() => onConfirm(target)} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} /> Dupliquer
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanField({ label, children }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function PlanningModal({
  onClose,
  currentUser,
  isAdmin,
  vacationRequests,
  onVacationRequest,
  onVacationCancel,
}) {
  // Chargement initial depuis localStorage
  const loadData = () => {
    try {
      const raw = localStorage.getItem(PLANNING_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { employees: [], schedule: {}, absences: [] };
  };

  const [data, setData] = useState(loadData);
  const [curDate, setCurDate] = useState(new Date());
  const [editEmpId, setEditEmpId] = useState(null);
  const [showNewEmp, setShowNewEmp] = useState(false);

  // Persistance auto
  const saveData = (newData) => {
    setData(newData);
    try {
      localStorage.setItem(PLANNING_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {}
  };

  // Semaine courante (lundi → dimanche)
  const monday = planningGetMonday(curDate);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  const todayStr = planningFIso(new Date());
  const weekTitle = `Semaine du ${monday.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} au ${days[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" })}`;

  // Employés visibles
  const currentFc = (currentUser?.fc || "").toUpperCase();
  const visibleEmps = isAdmin
    ? data.employees || []
    : (data.employees || []).filter(
        (e) => (e.fcId || "").toUpperCase() === currentFc,
      );

  // Propagation automatique des demandes de congés approuvées en absences
  useEffect(() => {
    const approved = (vacationRequests || []).filter((r) => r.status === "approved");
    if (!approved.length) return;
    let changed = false;
    const newData = { ...data };
    if (!newData.absences) newData.absences = [];
    approved.forEach((r) => {
      const emp = (newData.employees || []).find(
        (e) => (e.fcId || "").toUpperCase() === (r.fc || "").toUpperCase(),
      );
      if (!emp) return;
      const already = newData.absences.find(
        (a) =>
          a.empId === emp.id &&
          a.start === r.start &&
          a.end === r.end &&
          a.type === r.type,
      );
      if (!already) {
        newData.absences.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          empId: emp.id,
          start: r.start,
          end: r.end,
          type: r.type,
        });
        changed = true;
      }
    });
    if (changed) saveData(newData);
    // eslint-disable-next-line
  }, [vacationRequests]);

  // Récupère ou crée les données d'une cellule jour
  const getCellData = (emp, day) => {
    const dk = planningFIso(day);
    const k = emp.id + "_" + dk;
    if (data.schedule?.[k]) return data.schedule[k];
    // Sinon, applique template ou repos par défaut
    const dn = day.getDay();
    const abs = (data.absences || []).find(
      (a) => a.empId === emp.id && dk >= a.start && dk <= a.end,
    );
    if (abs) return { type: abs.type };
    let tpl = null;
    if (emp.fixedScheduleA || emp.fixedScheduleB) {
      tpl =
        planningGetWeekNumber(day) % 2 === 1
          ? emp.fixedScheduleA || emp.fixedScheduleB
          : emp.fixedScheduleB || emp.fixedScheduleA;
    } else if (emp.fixedSchedule) {
      tpl = emp.fixedSchedule;
    }
    if (tpl && tpl[dn]) return { ...tpl[dn] };
    if (emp.restDays?.includes(dn)) return { type: "Repos" };
    return {
      type: "Travail",
      startAM: "",
      endAM: "",
      startPM: "",
      endPM: "",
      break: false,
    };
  };

  // Update cellule
  const updateCell = (emp, day, field, value) => {
    const dk = planningFIso(day);
    const k = emp.id + "_" + dk;
    const newData = { ...data };
    if (!newData.schedule) newData.schedule = {};
    const current = newData.schedule[k] || getCellData(emp, day);
    if (field === "type") {
      if (value === "Travail") {
        newData.schedule[k] = {
          type: "Travail",
          startAM: current.startAM || "",
          endAM: current.endAM || "",
          startPM: current.startPM || "",
          endPM: current.endPM || "",
          break: current.break || false,
        };
      } else {
        newData.schedule[k] = { type: value };
      }
    } else {
      newData.schedule[k] = { ...current, [field]: value };
    }
    saveData(newData);
  };

  // Totaux semaine
  const computeWeekMins = (emp) => {
    let total = 0;
    days.forEach((d) => {
      const cell = getCellData(emp, d);
      if (cell.type === "Travail") total += planningCalcMins(cell);
    });
    return total;
  };

  // Save / delete employé
  const saveEmployee = (emp) => {
    const newData = { ...data };
    if (!newData.employees) newData.employees = [];
    const idx = newData.employees.findIndex((e) => e.id === emp.id);
    if (idx >= 0) newData.employees[idx] = emp;
    else newData.employees.push({ ...emp, id: emp.id || Date.now() });
    saveData(newData);
  };
  const deleteEmployee = (empId) => {
    const newData = { ...data };
    newData.employees = (newData.employees || []).filter((e) => e.id !== empId);
    Object.keys(newData.schedule || {}).forEach((k) => {
      if (k.startsWith(empId + "_")) delete newData.schedule[k];
    });
    newData.absences = (newData.absences || []).filter((a) => a.empId !== empId);
    saveData(newData);
    setEditEmpId(null);
  };

  // Absence add/del
  const addAbsence = (empId, start, end, type) => {
    const newData = { ...data };
    if (!newData.absences) newData.absences = [];
    newData.absences.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      empId,
      start,
      end,
      type,
    });
    saveData(newData);
  };
  const deleteAbsence = (absId) => {
    const newData = { ...data };
    newData.absences = (newData.absences || []).filter((a) => a.id !== absId);
    saveData(newData);
  };

  // Ajouter des employés Émilie + Pauliana si vides (seulement admin)
  useEffect(() => {
    if (!isAdmin) return;
    if ((data.employees || []).length > 0) return;
    const emilie = {
      id: Date.now(),
      firstName: "Émilie",
      fcId: "FC-",
      role: "Vendeur(se)",
      contractHours: 35,
      restDays: [4, 0],
    };
    const pauliana = {
      id: Date.now() + 1,
      firstName: "Pauliana",
      fcId: "FC-",
      role: "Vendeur(se)",
      contractHours: 25,
      contractHoursB: 34,
      restDays: [0],
    };
    saveData({ employees: [emilie, pauliana], schedule: {}, absences: [] });
    // eslint-disable-next-line
  }, []);

  // Impression
  const handlePrint = () => window.print();

  // Demande de congés (côté employé)
  const [showVacRequest, setShowVacRequest] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-50 flex flex-col"
      style={{ height: "100dvh" }}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-3 py-2 flex items-center gap-2 shrink-0 shadow-lg">
        <Calendar size={20} className="text-orange-500" />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm truncate">Planning F890</h2>
          <p className="text-[10px] text-slate-400 truncate">
            {isAdmin ? "Mode Gérant" : `Mon planning (${currentUser?.fc || ""})`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowNewEmp(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
          >
            <Users size={14} />
            <span className="hidden sm:inline">Salarié</span>
          </button>
        )}
        <button
          onClick={handlePrint}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
        >
          <Download size={14} />
          <span className="hidden sm:inline">PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation semaine */}
      <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => {
            const d = new Date(curDate);
            d.setDate(d.getDate() - 7);
            setCurDate(d);
          }}
          className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Préc.</span>
        </button>
        <div className="flex-1 text-center">
          <div className="font-bold text-sm text-slate-800">{weekTitle}</div>
          <button
            onClick={() => setCurDate(new Date())}
            className="text-[10px] text-orange-600 hover:underline"
          >
            Revenir à aujourd'hui
          </button>
        </div>
        <button
          onClick={() => {
            const d = new Date(curDate);
            d.setDate(d.getDate() + 7);
            setCurDate(d);
          }}
          className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <span className="hidden sm:inline">Suiv.</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Contenu principal scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-contain">
        {visibleEmps.length === 0 ? (
          <div className="text-center py-20 px-6 text-slate-500">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">Aucun salarié visible</p>
            <p className="text-xs mt-1 text-slate-400">
              {isAdmin
                ? "Tapez Salarié ci-dessus pour ajouter votre équipe."
                : "Demandez à votre manager de créer votre fiche."}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-3 pb-24">
            {/* Bloc demande de congés pour employé */}
            {!isAdmin && currentUser && (
              <PlanningEmployeeVacationBlock
                currentUser={currentUser}
                vacationRequests={vacationRequests || []}
                onSubmit={onVacationRequest}
                onCancel={onVacationCancel}
              />
            )}

            {visibleEmps.map((emp) => (
              <PlanningEmployeeCard
                key={emp.id}
                emp={emp}
                days={days}
                todayStr={todayStr}
                getCellData={getCellData}
                updateCell={updateCell}
                onEdit={() => setEditEmpId(emp.id)}
                isAdmin={isAdmin}
                weekMins={computeWeekMins(emp)}
                contractHours={planningGetContractHours(emp, monday)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal édition employé */}
      {editEmpId !== null && (
        <PlanningEmployeeEditor
          emp={
            editEmpId === "new"
              ? {
                  id: Date.now(),
                  firstName: "",
                  fcId: "FC-",
                  role: "Vendeur(se)",
                  contractHours: 35,
                  restDays: [],
                }
              : (data.employees || []).find((e) => e.id === editEmpId)
          }
          absences={(data.absences || []).filter(
            (a) => a.empId === editEmpId,
          )}
          isNew={editEmpId === "new"}
          onSave={(emp) => {
            saveEmployee(emp);
            setEditEmpId(null);
          }}
          onDelete={deleteEmployee}
          onAddAbsence={addAbsence}
          onDeleteAbsence={deleteAbsence}
          onClose={() => setEditEmpId(null)}
        />
      )}

      {showNewEmp && (
        <PlanningEmployeeEditor
          emp={{
            id: Date.now(),
            firstName: "",
            fcId: "FC-",
            role: "Vendeur(se)",
            contractHours: 35,
            restDays: [],
          }}
          absences={[]}
          isNew
          onSave={(emp) => {
            saveEmployee(emp);
            setShowNewEmp(false);
          }}
          onClose={() => setShowNewEmp(false)}
          onAddAbsence={addAbsence}
          onDeleteAbsence={deleteAbsence}
        />
      )}
    </div>
  );
}

// Carte semaine d'un employé (une carte empilée, mobile-first)
function PlanningEmployeeCard({
  emp,
  days,
  todayStr,
  getCellData,
  updateCell,
  onEdit,
  isAdmin,
  weekMins,
  contractHours,
}) {
  const contractMins = contractHours * 60;
  const diff = weekMins - contractMins;
  let diffBadge;
  if (diff > 0)
    diffBadge = (
      <span className="text-[10px] font-bold text-red-600">
        +{planningFHM(diff)}
      </span>
    );
  else if (diff < 0)
    diffBadge = (
      <span className="text-[10px] font-bold text-amber-600">
        −{planningFHM(-diff)}
      </span>
    );
  else
    diffBadge = (
      <span className="text-[10px] font-bold text-emerald-600">✓ OK</span>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Bandeau employé */}
      <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">{emp.firstName}</div>
          <div className="text-[10px] text-slate-400 truncate">
            {emp.fcId || "—"} · {emp.role} · {contractHours}h/sem
          </div>
        </div>
        <div className="text-right shrink-0 mx-2">
          <div className="font-mono font-bold text-sm">
            {planningFHM(weekMins)}
          </div>
          <div>{diffBadge}</div>
        </div>
        {isAdmin && (
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-white/10 rounded shrink-0"
            title="Modifier"
          >
            <Settings size={14} />
          </button>
        )}
      </div>

      {/* Grille 7 jours */}
      <div className="divide-y divide-slate-100">
        {days.map((day, idx) => {
          const cell = getCellData(emp, day);
          const isToday = planningFIso(day) === todayStr;
          const dayMins =
            cell.type === "Travail" ? planningCalcMins(cell) : 0;
          const dayName = PLANNING_DAY_NAMES_SHORT[day.getDay()];
          const dayNum = day.getDate();
          const bg = PLANNING_TYPE_BG[cell.type] || "bg-white";
          return (
            <div
              key={idx}
              className={`${bg} ${isToday ? "ring-2 ring-orange-400 ring-inset" : ""} p-2`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-bold text-slate-800 uppercase">
                    {dayName} {dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded">
                      AUJ.
                    </span>
                  )}
                </div>
                <select
                  value={cell.type}
                  onChange={(e) => updateCell(emp, day, "type", e.target.value)}
                  disabled={!isAdmin}
                  className="text-[11px] font-semibold border border-slate-300 rounded px-1.5 py-0.5 bg-white disabled:bg-slate-50 disabled:text-slate-600"
                >
                  {PLANNING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t === "Vacances" ? "CP" : t}
                    </option>
                  ))}
                </select>
              </div>
              {cell.type === "Travail" && (
                <>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase mb-0.5">
                        Matin
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={cell.startAM || ""}
                          onChange={(e) =>
                            updateCell(emp, day, "startAM", e.target.value)
                          }
                          disabled={!isAdmin}
                          className="flex-1 text-[11px] font-mono border border-slate-300 rounded px-1 py-0.5 min-w-0 bg-white disabled:bg-slate-50"
                        />
                        <input
                          type="time"
                          value={cell.endAM || ""}
                          onChange={(e) =>
                            updateCell(emp, day, "endAM", e.target.value)
                          }
                          disabled={!isAdmin}
                          className="flex-1 text-[11px] font-mono border border-slate-300 rounded px-1 py-0.5 min-w-0 bg-white disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase mb-0.5">
                        Après-midi
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={cell.startPM || ""}
                          onChange={(e) =>
                            updateCell(emp, day, "startPM", e.target.value)
                          }
                          disabled={!isAdmin}
                          className="flex-1 text-[11px] font-mono border border-slate-300 rounded px-1 py-0.5 min-w-0 bg-white disabled:bg-slate-50"
                        />
                        <input
                          type="time"
                          value={cell.endPM || ""}
                          onChange={(e) =>
                            updateCell(emp, day, "endPM", e.target.value)
                          }
                          disabled={!isAdmin}
                          className="flex-1 text-[11px] font-mono border border-slate-300 rounded px-1 py-0.5 min-w-0 bg-white disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    {isAdmin ? (
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!cell.break}
                          onChange={(e) =>
                            updateCell(emp, day, "break", e.target.checked)
                          }
                          className="w-3 h-3 accent-orange-500"
                        />
                        <span className="text-slate-600">
                          Pause 10 min déduite
                        </span>
                      </label>
                    ) : (
                      <span className="text-slate-500">
                        {cell.break ? "Pause déduite" : ""}
                      </span>
                    )}
                    <span className="font-mono font-bold text-slate-800">
                      {planningFHM(dayMins)}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Editeur employé (modal)
function PlanningEmployeeEditor({
  emp,
  absences,
  isNew,
  onSave,
  onDelete,
  onAddAbsence,
  onDeleteAbsence,
  onClose,
}) {
  const [form, setForm] = useState({ ...emp });
  const [tab, setTab] = useState("info");
  const [newAbsStart, setNewAbsStart] = useState("");
  const [newAbsEnd, setNewAbsEnd] = useState("");
  const [newAbsType, setNewAbsType] = useState("Vacances");

  const roles = [
    "Gérant",
    "Livreur Polyvalent",
    "Vendeur(se)",
    "Vendeur(se) Polyvalent",
    "Vendeur(se) Expert",
    "Vendeur(se) Confirmé(e)",
    "Adjoint(e) Pôle Services",
    "Caissier(e)",
    "Caissier(e) Polyvalent SAV",
    "SAV",
    "Magasinier",
    "Encadrant",
    "Alternant",
    "Stagiaire",
  ];

  const handleSave = () => {
    if (!form.firstName?.trim()) {
      alert("Le prénom est obligatoire");
      return;
    }
    const clean = { ...form, firstName: form.firstName.trim() };
    onSave(clean);
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-base">
              {isNew ? "Nouveau salarié" : form.firstName}
            </h3>
            <p className="text-[10px] text-slate-400">
              {form.role} · {form.fcId || "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {!isNew && (
          <div className="bg-slate-100 border-b border-slate-200 px-2 py-1 flex gap-1 shrink-0 overflow-x-auto">
            {[
              { id: "info", label: "Identité" },
              { id: "abs", label: "Absences" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                  tab === t.id
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {(isNew || tab === "info") && (
            <>
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">
                  Prénom *
                </label>
                <input
                  value={form.firstName || ""}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  placeholder="Ex : Émilie"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">
                  Matricule FC
                </label>
                <input
                  value={form.fcId || ""}
                  onChange={(e) => setForm({ ...form, fcId: e.target.value })}
                  placeholder="FC-XXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">
                  Fonction
                </label>
                <select
                  value={form.role || ""}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mt-1 bg-white"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">
                    H. contrat
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.contractHours || 35}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contractHours: parseFloat(e.target.value) || 35,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">
                    H. sem. B (alternance)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.contractHoursB || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contractHoursB: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="(optionnel)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">
                  Jours de repos habituels
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 0].map((dn) => {
                    const active = (form.restDays || []).includes(dn);
                    return (
                      <button
                        key={dn}
                        type="button"
                        onClick={() => {
                          const cur = form.restDays || [];
                          setForm({
                            ...form,
                            restDays: active
                              ? cur.filter((x) => x !== dn)
                              : [...cur, dn],
                          });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          active
                            ? "bg-orange-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {PLANNING_DAY_NAMES_LONG[dn].slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {!isNew && tab === "abs" && (
            <>
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                <div className="text-[11px] font-bold text-slate-600 uppercase">
                  Ajouter une absence
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={newAbsStart}
                    onChange={(e) => setNewAbsStart(e.target.value)}
                    className="px-2 py-1.5 border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="date"
                    value={newAbsEnd}
                    onChange={(e) => setNewAbsEnd(e.target.value)}
                    className="px-2 py-1.5 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={newAbsType}
                    onChange={(e) => setNewAbsType(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option>Vacances</option>
                    <option>RTT</option>
                    <option>Maladie</option>
                    <option>Formation</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!newAbsStart || !newAbsEnd) {
                        alert("Renseignez les dates");
                        return;
                      }
                      onAddAbsence(emp.id, newAbsStart, newAbsEnd, newAbsType);
                      setNewAbsStart("");
                      setNewAbsEnd("");
                    }}
                    className="bg-emerald-600 text-white text-xs font-bold px-3 rounded hover:bg-emerald-700"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-600 uppercase mb-2">
                  Historique ({absences.length})
                </div>
                {absences.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-6">
                    Aucune absence
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {absences.map((a) => (
                      <div
                        key={a.id}
                        className="bg-white border border-slate-200 rounded p-2 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">
                            {a.type}
                          </div>
                          <div className="text-slate-500">
                            {a.start} → {a.end}
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteAbsence(a.id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-3 shrink-0 flex gap-2">
          {!isNew && onDelete && (
            <button
              onClick={() => {
                if (
                  window.confirm("Supprimer " + emp.firstName + " définitivement ?")
                ) {
                  onDelete(emp.id);
                }
              }}
              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg text-xs"
            >
              Supprimer
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// Bloc "Mes demandes de congés" (côté salarié)
function PlanningEmployeeVacationBlock({
  currentUser,
  vacationRequests,
  onSubmit,
  onCancel,
}) {
  const [showForm, setShowForm] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState("Vacances");
  const [reason, setReason] = useState("");

  const mine = (vacationRequests || [])
    .filter(
      (r) =>
        (r.fc || "").toUpperCase() === (currentUser.fc || "").toUpperCase(),
    )
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const submit = () => {
    if (!start || !end) {
      alert("Les dates sont obligatoires");
      return;
    }
    if (start > end) {
      alert("Date de fin avant début");
      return;
    }
    const req = {
      id:
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 7),
      fc: currentUser.fc,
      prenom: currentUser.prenom,
      role: currentUser.role || "",
      start,
      end,
      type,
      reason: reason.trim(),
      status: "pending",
      createdAt: Date.now(),
    };
    if (onSubmit) onSubmit(req);
    setStart("");
    setEnd("");
    setType("Vacances");
    setReason("");
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-l-4 border-emerald-500 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-sm text-slate-800">
          🏖️ Mes demandes de congés
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
        >
          {showForm ? "Annuler" : "+ Nouvelle"}
        </button>
      </div>
      {showForm && (
        <div className="bg-slate-50 rounded-lg p-2.5 space-y-2 mb-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded text-xs"
              placeholder="Début"
            />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded text-xs"
              placeholder="Fin"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
          >
            <option>Vacances</option>
            <option>RTT</option>
            <option>Formation</option>
            <option>Maladie</option>
          </select>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motif (facultatif)"
            rows={2}
            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs resize-none"
          />
          <button
            onClick={submit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg"
          >
            Envoyer la demande
          </button>
        </div>
      )}
      {mine.length === 0 ? (
        <div className="text-center text-slate-400 text-xs py-3 italic">
          Aucune demande. Tapez <strong>+ Nouvelle</strong> pour en créer une.
        </div>
      ) : (
        <div className="space-y-1.5">
          {mine.map((r) => {
            const conf = {
              pending: {
                bg: "bg-amber-50",
                border: "border-amber-200",
                col: "text-amber-700",
                lbl: "⏳ En attente",
              },
              approved: {
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                col: "text-emerald-700",
                lbl: "✓ Validée",
              },
              rejected: {
                bg: "bg-red-50",
                border: "border-red-200",
                col: "text-red-700",
                lbl: "✗ Refusée",
              },
            }[r.status] || {};
            return (
              <div
                key={r.id}
                className={`${conf.bg} border ${conf.border} rounded-lg p-2 flex items-center justify-between gap-2`}
              >
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-semibold text-slate-800">
                    {r.type} — {r.start} → {r.end}
                  </div>
                  {r.reason && (
                    <div className="text-[11px] text-slate-500 italic truncate">
                      {r.reason}
                    </div>
                  )}
                  <div className={`text-[10px] font-bold ${conf.col} mt-0.5`}>
                    {conf.lbl}
                  </div>
                </div>
                {r.status === "pending" && onCancel && (
                  <button
                    onClick={() => onCancel(r.id)}
                    className="text-red-500 hover:bg-red-100 p-1.5 rounded shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ========================================================================
// SAV — Configuration
// ========================================================================
const SHIPPING_METHODS = [
  { id: "chrono", label: "Chronopost", emoji: "📦", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { id: "dpd", label: "DPD", emoji: "🚚", color: "bg-red-100 text-red-800 border-red-300" },
  { id: "autres", label: "Autres", emoji: "📮", color: "bg-slate-100 text-slate-700 border-slate-300" },
];
const getShippingMethod = (id) =>
  SHIPPING_METHODS.find((m) => m.id === id) || SHIPPING_METHODS[2];

// Les 6 angles demandés pour le produit
const INTAKE_ANGLES = [
  { id: 1, label: "Face avant", emoji: "🔲" },
  { id: 2, label: "Face arrière", emoji: "🔳" },
  { id: 3, label: "Côté gauche", emoji: "◀️" },
  { id: 4, label: "Côté droit", emoji: "▶️" },
  { id: 5, label: "Dessus", emoji: "🔼" },
  { id: 6, label: "Dessous / plaque série", emoji: "🔽" },
];
// Les 6 angles demandés pour le colisage
const PACKAGING_ANGLES = [
  { id: 1, label: "Produit protégé", emoji: "🛡️" },
  { id: 2, label: "Calage interne", emoji: "🧊" },
  { id: 3, label: "Carton fermé", emoji: "📦" },
  { id: 4, label: "Étiquette transport", emoji: "🏷️" },
  { id: 5, label: "Vue globale du colis", emoji: "📐" },
  { id: 6, label: "N° de suivi visible", emoji: "🔢" },
];

// ========================================================================
// PHOTO GRID — Composant réutilisable pour les 6 photos
// ========================================================================
function PhotoGrid({ angles, photos, setPhotos, themeColor = "red" }) {
  const [lightbox, setLightbox] = useState(null);
  const captureRef = useRef(null);
  const [capturingIdx, setCapturingIdx] = useState(null);

  const handleCapture = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 1000, 0.72);
      const newPhotos = [...photos];
      newPhotos[idx] = dataUrl;
      setPhotos(newPhotos);
    } catch (err) {
      console.error("Compression photo:", err);
    }
    setCapturingIdx(null);
    if (captureRef.current) captureRef.current.value = "";
  };

  const removePhoto = (idx) => {
    const newPhotos = [...photos];
    newPhotos[idx] = null;
    setPhotos(newPhotos);
  };

  const count = photos.filter((p) => !!p).length;
  const theme = {
    red: { btnBg: "from-red-500 to-rose-600", progBg: "bg-red-500", border: "border-red-300" },
    blue: { btnBg: "from-blue-500 to-indigo-600", progBg: "bg-blue-500", border: "border-blue-300" },
  }[themeColor];

  return (
    <div>
      <input
        ref={captureRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => capturingIdx !== null && handleCapture(capturingIdx, e)}
        className="hidden"
      />
      {/* Progress */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.progBg} transition-all`}
            style={{ width: `${(count / 6) * 100}%` }}
          />
        </div>
        <span
          className={`text-sm font-black ${count === 6 ? "text-emerald-600" : "text-slate-700"}`}
        >
          {count}/6
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {angles.map((angle, i) => {
          const photo = photos[i];
          return (
            <div key={angle.id} className="relative">
              {photo ? (
                <div
                  className={`relative rounded-lg overflow-hidden border-2 ${theme.border} aspect-square`}
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(photo)}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={photo}
                      alt={angle.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="absolute top-1 left-1 bg-white text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {i + 1}
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCapturingIdx(i);
                        setTimeout(() => captureRef.current?.click(), 0);
                      }}
                      className="bg-white/90 hover:bg-white text-slate-700 w-6 h-6 rounded flex items-center justify-center"
                      title="Reprendre"
                    >
                      <Camera size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded flex items-center justify-center"
                      title="Supprimer"
                    >
                      <X size={11} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1 py-0.5 flex items-center gap-1">
                    <span>{angle.emoji}</span>
                    <span className="truncate">{angle.label}</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCapturingIdx(i);
                    setTimeout(() => captureRef.current?.click(), 0);
                  }}
                  className={`w-full aspect-square bg-slate-50 hover:bg-slate-100 border-2 border-dashed ${theme.border} rounded-lg flex flex-col items-center justify-center gap-0.5 text-slate-600 hover:text-slate-800 transition`}
                >
                  <span className="text-lg">{angle.emoji}</span>
                  <span className="text-[10px] font-bold leading-tight px-1 text-center">
                    {i + 1}. {angle.label}
                  </span>
                  <Camera size={14} className="opacity-50 mt-0.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {lightbox && (
        <PhotoLightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

// ========================================================================
// SAV INTAKE MODAL — Création d'un dossier SAV avec 6 photos
// ========================================================================
function SavIntakeModal({ onCreate, onClose }) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [product, setProduct] = useState("");
  const [reference, setReference] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState(new Array(6).fill(null));

  const photoCount = photos.filter((p) => !!p).length;
  const canSubmit =
    clientName.trim().length >= 2 &&
    product.trim().length >= 2 &&
    photoCount === 6;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)", height: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white px-5 py-3 flex items-center gap-2 shrink-0">
          <Wrench size={20} />
          <div className="flex-1">
            <h2 className="font-bold text-lg">Nouveau dossier SAV</h2>
            <p className="text-[11px] text-white/80">
              Prise en charge — 6 photos obligatoires
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto overscroll-contain">
          {/* Client */}
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Client
            </div>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nom du client *"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <input
              type="tel"
              inputMode="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Téléphone (facultatif)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          {/* Produit */}
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Produit
            </div>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ex : TV Samsung QE65Q70D *"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Référence / modèle"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <input
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="N° de série (IMEI / SN)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Panne déclarée par le client"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
            />
          </div>

          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-sm text-slate-800">
                  📸 Photos du produit
                </div>
                <div className="text-[11px] text-slate-500">
                  Les 6 angles sont obligatoires (preuve visuelle)
                </div>
              </div>
            </div>
            <PhotoGrid
              angles={INTAKE_ANGLES}
              photos={photos}
              setPhotos={setPhotos}
              themeColor="red"
            />
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes internes (facultatif)"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
          />
        </div>

        {/* Footer fixe avec boutons */}
        <div className="border-t border-slate-200 bg-white p-3 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={() =>
                onCreate({
                  clientName: clientName.trim(),
                  clientPhone: clientPhone.trim(),
                  product: product.trim(),
                  reference: reference.trim(),
                  serialNumber: serialNumber.trim(),
                  issue: issue.trim(),
                  notes: notes.trim(),
                  intakePhotos: photos,
                })
              }
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-lg disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              {canSubmit
                ? "Créer le dossier"
                : photoCount < 6
                  ? `Photos : ${photoCount}/6`
                  : "Champs manquants"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// SAV PREP MODAL — 6 photos de colisage + tracking
// ========================================================================
function SavPrepModal({ savCase, onFinalize, onClose }) {
  const [photos, setPhotos] = useState(
    savCase.packagingPhotos && savCase.packagingPhotos.length === 6
      ? [...savCase.packagingPhotos]
      : new Array(6).fill(null),
  );
  const [trackingNumber, setTrackingNumber] = useState(
    savCase.trackingNumber || "",
  );

  const photoCount = photos.filter((p) => !!p).length;
  const canFinalize = photoCount === 6;
  const method = getShippingMethod(savCase.shippingMethod);

  return (
    <div
      className="fixed inset-0 z-[55] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)", height: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-3 flex items-center gap-2 shrink-0">
          <Package size={20} />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg">Préparation colisage</h2>
            <p className="text-[11px] text-white/80 truncate">
              {savCase.caseNumber} · {method.emoji} {method.label}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto overscroll-contain">
          {/* Rappel dossier */}
          <div className="bg-slate-50 rounded-lg p-2.5 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-800">
                {savCase.product}
              </span>
              {savCase.reference && (
                <span className="font-mono text-slate-500">
                  {savCase.reference}
                </span>
              )}
            </div>
            <div className="text-slate-600">
              Client : <strong>{savCase.clientName}</strong>
            </div>
            {savCase.issue && (
              <div className="text-slate-600 italic mt-0.5">
                ⚠ {savCase.issue}
              </div>
            )}
          </div>

          {/* Tracking */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              N° de suivi {method.label}
            </label>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ex : XA123456789FR"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Photos colisage */}
          <div>
            <div className="font-bold text-sm text-slate-800">
              📦 Photos du colisage
            </div>
            <div className="text-[11px] text-slate-500 mb-2">
              6 photos pour documenter l'emballage
            </div>
            <PhotoGrid
              angles={PACKAGING_ANGLES}
              photos={photos}
              setPhotos={setPhotos}
              themeColor="blue"
            />
          </div>
        </div>

        {/* Footer fixe avec boutons */}
        <div className="border-t border-slate-200 bg-white p-3 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Fermer
            </button>
            <button
              onClick={() => onFinalize(photos, trackingNumber.trim())}
              disabled={!canFinalize}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-lg disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              {canFinalize ? "Valider le colisage" : `${photoCount}/6 photos`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// SAV PANEL — Liste des dossiers avec blocs par statut
// ========================================================================
function SavPanel({
  cases,
  currentUser,
  isAdmin,
  onCreateClick,
  onStartPrep,
  onOpenPrep,
  onMarkShipped,
  onDelete,
  onClose,
}) {
  const [filter, setFilter] = useState("awaiting_prep");
  const [detailCase, setDetailCase] = useState(null);

  const awaiting = cases.filter((c) => c.status === "awaiting_prep");
  const chrono = cases.filter(
    (c) => c.status === "in_preparation" && c.shippingMethod === "chrono",
  );
  const dpd = cases.filter(
    (c) => c.status === "in_preparation" && c.shippingMethod === "dpd",
  );
  const autres = cases.filter(
    (c) => c.status === "in_preparation" && c.shippingMethod === "autres",
  );
  const ready = cases.filter((c) => c.status === "ready_shipment");
  const shipped = cases.filter((c) => c.status === "shipped");

  let filtered;
  if (filter === "awaiting_prep") filtered = awaiting;
  else if (filter === "chrono") filtered = chrono;
  else if (filter === "dpd") filtered = dpd;
  else if (filter === "autres") filtered = autres;
  else if (filter === "ready") filtered = ready;
  else filtered = shipped;

  filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench size={20} />
            <div>
              <h2 className="font-bold text-lg">Service Après-Vente</h2>
              <p className="text-xs text-white/80">
                Prise en charge → Préparation → Envoi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateClick}
              className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
            >
              <Plus size={14} />
              Nouveau dossier
            </button>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2.5 grid grid-cols-3 sm:grid-cols-6 gap-2">
          <ResumeCell
            count={awaiting.length}
            label="En attente"
            color="text-rose-600"
          />
          <ResumeCell
            count={chrono.length}
            label="Chrono"
            color="text-yellow-700"
          />
          <ResumeCell count={dpd.length} label="DPD" color="text-red-700" />
          <ResumeCell
            count={autres.length}
            label="Autres"
            color="text-slate-600"
          />
          <ResumeCell
            count={ready.length}
            label="Prêts envoi"
            color="text-emerald-600"
          />
          <ResumeCell
            count={shipped.length}
            label="Expédiés"
            color="text-slate-500"
          />
        </div>

        {/* Onglets scrollables */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <SavTab
            label="En attente"
            count={awaiting.length}
            active={filter === "awaiting_prep"}
            onClick={() => setFilter("awaiting_prep")}
            tone="rose"
          />
          <SavTab
            label="📦 Chronopost"
            count={chrono.length}
            active={filter === "chrono"}
            onClick={() => setFilter("chrono")}
            tone="yellow"
          />
          <SavTab
            label="🚚 DPD"
            count={dpd.length}
            active={filter === "dpd"}
            onClick={() => setFilter("dpd")}
            tone="red"
          />
          <SavTab
            label="📮 Autres"
            count={autres.length}
            active={filter === "autres"}
            onClick={() => setFilter("autres")}
            tone="slate"
          />
          <SavTab
            label="Prêts"
            count={ready.length}
            active={filter === "ready"}
            onClick={() => setFilter("ready")}
            tone="emerald"
          />
          <SavTab
            label="Expédiés"
            count={shipped.length}
            active={filter === "shipped"}
            onClick={() => setFilter("shipped")}
            tone="slate"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Wrench size={32} className="mx-auto mb-2 opacity-40" />
              Aucun dossier dans cette catégorie.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((c) => (
                <SavCaseRow
                  key={c._key || c.id}
                  savCase={c}
                  currentUser={currentUser}
                  isAdmin={isAdmin}
                  onStartPrep={onStartPrep}
                  onOpenPrep={onOpenPrep}
                  onMarkShipped={onMarkShipped}
                  onDelete={onDelete}
                  onOpenDetail={() => setDetailCase(c)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {detailCase && (
        <SavDetailModal
          savCase={detailCase}
          onClose={() => setDetailCase(null)}
        />
      )}
    </div>
  );
}

function ResumeCell({ count, label, color }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-black ${color}`}>{count}</div>
      <div className="text-[9px] text-slate-500 uppercase font-bold leading-tight">
        {label}
      </div>
    </div>
  );
}

function SavTab({ label, count, active, onClick, tone }) {
  const tones = {
    rose: active ? "border-rose-600 text-rose-700 bg-rose-50" : "",
    yellow: active ? "border-yellow-600 text-yellow-700 bg-yellow-50" : "",
    red: active ? "border-red-600 text-red-700 bg-red-50" : "",
    slate: active ? "border-slate-600 text-slate-700 bg-slate-100" : "",
    emerald: active ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "",
  };
  const badgeTones = {
    rose: "bg-rose-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
    slate: "bg-slate-600",
    emerald: "bg-emerald-600",
  };
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
        active ? tones[tone] : "border-transparent text-slate-600"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 text-[10px] font-bold ${active ? `${badgeTones[tone]} text-white` : "bg-slate-200 text-slate-700"}`}
      >
        {count}
      </span>
    </button>
  );
}

// ========================================================================
// SAV CASE ROW
// ========================================================================
function SavCaseRow({
  savCase,
  currentUser,
  isAdmin,
  onStartPrep,
  onOpenPrep,
  onMarkShipped,
  onDelete,
  onOpenDetail,
}) {
  const [methodPickerOpen, setMethodPickerOpen] = useState(false);
  const method = savCase.shippingMethod
    ? getShippingMethod(savCase.shippingMethod)
    : null;

  const statusConfig = {
    awaiting_prep: { cls: "bg-rose-50 border-rose-300", label: "En attente envoi" },
    in_preparation: { cls: "bg-amber-50 border-amber-300", label: "En préparation" },
    ready_shipment: { cls: "bg-emerald-50 border-emerald-300", label: "Prêt à expédier" },
    shipped: { cls: "bg-white border-slate-200 opacity-80", label: "Expédié" },
  }[savCase.status];

  return (
    <div className={`rounded-xl p-3 border-2 ${statusConfig.cls}`}>
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="font-mono font-black text-xs text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              {savCase.caseNumber}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-700 text-white">
              {statusConfig.label}
            </span>
            {method && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${method.color}`}
              >
                {method.emoji} {method.label}
              </span>
            )}
          </div>
          <h4 className="font-bold text-slate-800 text-sm leading-tight">
            {savCase.product}
          </h4>
          {savCase.reference && (
            <p className="text-xs text-slate-500 font-mono">
              Réf. {savCase.reference}
            </p>
          )}
          <p className="text-xs text-slate-700 mt-0.5">
            Client : <strong>{savCase.clientName}</strong>
            {savCase.clientPhone && (
              <a
                href={`tel:${savCase.clientPhone}`}
                className="ml-1 text-emerald-700 hover:underline"
              >
                📞 {savCase.clientPhone}
              </a>
            )}
          </p>
          {savCase.issue && (
            <p className="text-xs text-slate-600 mt-0.5 italic">
              ⚠ {savCase.issue}
            </p>
          )}
          {savCase.trackingNumber && (
            <p className="text-xs font-mono text-blue-700 mt-0.5">
              🔢 {savCase.trackingNumber}
            </p>
          )}
          <div className="text-[10px] text-slate-500 mt-1">
            Créé par <strong>{savCase.createdByPrenom}</strong>{" "}
            {formatTime(savCase.createdAt)}
            {savCase.preparedByPrenom && (
              <>
                {" "}• Préparé par{" "}
                <strong>{savCase.preparedByPrenom}</strong>
              </>
            )}
          </div>
        </div>
        {/* Miniature 1ère photo */}
        {savCase.intakePhotos?.[0] && (
          <button
            onClick={onOpenDetail}
            className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-slate-300 hover:border-rose-500"
            title="Voir les photos"
          >
            <img
              src={savCase.intakePhotos[0]}
              alt="Produit"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[9px] px-1 font-bold">
              {savCase.intakePhotos.filter((p) => !!p).length}/6
            </div>
          </button>
        )}
      </div>

      {/* Actions par statut */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={onOpenDetail}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
        >
          <Maximize2 size={11} /> Détails
        </button>

        {savCase.status === "awaiting_prep" && (
          <div className="relative flex-1">
            <button
              onClick={() => setMethodPickerOpen(!methodPickerOpen)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1"
            >
              <Package size={12} />
              Démarrer préparation
              <ChevronDown size={12} />
            </button>
            {methodPickerOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-slate-200 py-1 z-10"
                onMouseLeave={() => setMethodPickerOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] text-slate-500 uppercase tracking-wide font-bold border-b">
                  Transporteur
                </div>
                {SHIPPING_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMethodPickerOpen(false);
                      onStartPrep(savCase, m.id);
                      setTimeout(() => onOpenPrep(savCase), 100);
                    }}
                    className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm"
                  >
                    <span>{m.emoji}</span>
                    <span className="font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {savCase.status === "in_preparation" && (
          <button
            onClick={() => onOpenPrep(savCase)}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1"
          >
            <Camera size={12} />
            Poursuivre colisage
          </button>
        )}

        {savCase.status === "ready_shipment" && (
          <button
            onClick={() => onMarkShipped(savCase)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1"
          >
            <Truck size={12} />
            Marquer expédié
          </button>
        )}

        {isAdmin && ["shipped"].includes(savCase.status) && (
          <button
            onClick={() => onDelete(savCase)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
            title="Supprimer"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// SAV DETAIL MODAL — Consulter toutes les photos d'un dossier
// ========================================================================
function SavDetailModal({ savCase, onClose }) {
  const [lightbox, setLightbox] = useState(null);
  const method = savCase.shippingMethod
    ? getShippingMethod(savCase.shippingMethod)
    : null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center gap-2">
          <Wrench size={20} className="text-rose-500" />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg font-mono">
              {savCase.caseNumber}
            </h2>
            <p className="text-xs text-slate-300 truncate">
              {savCase.product}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Infos dossier */}
          <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
            <div>
              Client : <strong>{savCase.clientName}</strong>{" "}
              {savCase.clientPhone && (
                <a
                  href={`tel:${savCase.clientPhone}`}
                  className="text-emerald-700 hover:underline"
                >
                  📞 {savCase.clientPhone}
                </a>
              )}
            </div>
            {savCase.reference && (
              <div className="font-mono text-xs text-slate-600">
                Réf : {savCase.reference}
              </div>
            )}
            {savCase.serialNumber && (
              <div className="font-mono text-xs text-slate-600">
                SN : {savCase.serialNumber}
              </div>
            )}
            {savCase.issue && (
              <div className="italic text-slate-700">⚠ {savCase.issue}</div>
            )}
            <div className="text-xs text-slate-500 pt-1 border-t border-slate-200 mt-2">
              Créé par <strong>{savCase.createdByPrenom}</strong> le{" "}
              {new Date(savCase.createdAt).toLocaleString("fr-FR")}
            </div>
            {method && (
              <div className="text-xs text-slate-600">
                Transporteur :{" "}
                <span className={`px-1.5 py-0.5 rounded border ${method.color}`}>
                  {method.emoji} {method.label}
                </span>
              </div>
            )}
            {savCase.trackingNumber && (
              <div className="font-mono text-sm text-blue-700">
                🔢 N° suivi : <strong>{savCase.trackingNumber}</strong>
              </div>
            )}
          </div>

          {/* Photos prise en charge */}
          <div>
            <div className="font-bold text-sm text-slate-800 mb-2">
              📸 Photos prise en charge
            </div>
            <div className="grid grid-cols-3 gap-2">
              {INTAKE_ANGLES.map((angle, i) => {
                const photo = savCase.intakePhotos?.[i];
                return (
                  <div
                    key={angle.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    {photo ? (
                      <button
                        onClick={() => setLightbox(photo)}
                        className="absolute inset-0"
                      >
                        <img
                          src={photo}
                          alt={angle.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs">
                        —
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] px-1 py-0.5 truncate">
                      {i + 1}. {angle.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photos colisage */}
          {savCase.packagingPhotos && savCase.packagingPhotos.length > 0 && (
            <div>
              <div className="font-bold text-sm text-slate-800 mb-2">
                📦 Photos colisage
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PACKAGING_ANGLES.map((angle, i) => {
                  const photo = savCase.packagingPhotos?.[i];
                  return (
                    <div
                      key={angle.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                    >
                      {photo ? (
                        <button
                          onClick={() => setLightbox(photo)}
                          className="absolute inset-0"
                        >
                          <img
                            src={photo}
                            alt={angle.label}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs">
                          —
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] px-1 py-0.5 truncate">
                        {i + 1}. {angle.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {savCase.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900">
              📝 {savCase.notes}
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <PhotoLightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

// ========================================================================
// HOME DASHBOARD — Tuiles carrées pour chaque fonction
// ========================================================================
function HomeDashboard({
  currentUser,
  isAdmin,
  todayPoints,
  pendingAlertsCount,
  openMissionsCount,
  activePickupsCount,
  myRemoteClientsCount,
  objectives,
  progressByInteraction,
  interactions,
  onOpenChat,
  onOpenCallPanel,
  onOpenTeamPhones,
  onOpenPickups,
  onOpenMissions,
  onOpenRewards,
  onOpenProgression,
  onOpenCommissions,
  onOpenNps,
  currentNps,
  currentGoogleRating,
  totalPoints,
  onOpenHistory,
  onOpenRemoteClients,
  onOpenAdmin,
  onOpenHr,
  onOpenLogiCommissions,
  onOpenZone,
  onOpenPickupCreate,
  onOpenZoneAlerts,
  onOpenMissionsStatus,
  onOpenMyMissionsHistory,
  overdueMissionsCount,
  myActiveMissionsCount,
  myActiveMissions,
  onOpenPlanning,
  onOpenVacationPanel,
  pendingVacationsCount,
  onOpenSav,
  savCasesCount,
  onAchievement,
}) {
  // Détection du profil "logistique" (livreurs et magasiniers)
  // → accès limité : Planning, SAV, NPS, Missions, Chat, Délivrance, Appel
  // Le rôle est cherché dans le planning F890 (source de vérité métier)
  const userRole = (() => {
    if (isAdmin) return "admin";
    try {
      const raw = localStorage.getItem("plf890_data_v1");
      if (raw) {
        const d = JSON.parse(raw);
        const fcClean = (currentUser?.fc || "").toUpperCase();
        const emp = (d.employees || []).find(
          (e) => (e.fcId || "").toUpperCase() === fcClean,
        );
        if (emp && emp.role) return emp.role;
      }
    } catch (e) {}
    return currentUser?.role || "";
  })();
  const isLogistique =
    !isAdmin &&
    (userRole === "Livreur Polyvalent" ||
      userRole === "Livreur Magasinier" ||
      userRole === "Magasinier");

  // IDs des tuiles autorisées pour les profils logistique
  const LOGISTIQUE_ALLOWED = [
    "chat",
    "call",
    "pickup",
    "missions",
    "planning",
    "sav",
    "nps",
    "commissions",
  ];

  let tiles = [
    {
      id: "chat",
      label: "Chat direct",
      subtitle: "Messages équipe",
      icon: MessageCircle,
      onClick: onOpenChat,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      id: "call",
      label: "Appel",
      subtitle: "Décrocher / Passer",
      icon: PhoneCall,
      onClick: onOpenCallPanel,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      id: "zone",
      label: "Clients en attente",
      subtitle: "Alerter l'équipe",
      icon: Zap,
      onClick: onOpenZone,
      onBadgeClick: onOpenZoneAlerts,
      badge: pendingAlertsCount,
      badgeBig: true,
      gradient: "from-red-500 to-rose-600",
      pulse: pendingAlertsCount > 0,
    },
    {
      id: "pickup",
      label: "Délivrance caisse",
      subtitle: "Demande au magasinier",
      icon: Package,
      onClick: onOpenPickupCreate,
      badge: activePickupsCount,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "remote",
      label: "Clients à distance",
      subtitle: "Suivi clients privés",
      icon: Phone,
      onClick: onOpenRemoteClients,
      badge: myRemoteClientsCount,
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      id: "missions",
      label: "Missions",
      subtitle: "Challenges équipe",
      icon: Target,
      onClick: onOpenMissions,
      onBadgeClick: onOpenMissionsStatus,
      badge: openMissionsCount,
      badgeBig: openMissionsCount > 0,
      overdueCount: overdueMissionsCount,
      gradient: "from-fuchsia-500 to-pink-600",
      pulse: overdueMissionsCount > 0,
    },
    {
      id: "planning",
      label: "Planning",
      subtitle: "Horaires équipe",
      icon: Calendar,
      onClick: onOpenPlanning,
      gradient: "from-sky-500 to-blue-600",
    },
    {
      id: "conges",
      label: "Congés",
      subtitle: "Demandes & validation",
      icon: Calendar,
      onClick: onOpenVacationPanel,
      badge: pendingVacationsCount,
      gradient: "from-emerald-500 to-teal-600",
      pulse: pendingVacationsCount > 0,
    },
    {
      id: "sav",
      label: "SAV",
      subtitle: "Prise en charge & envoi",
      icon: Wrench,
      onClick: onOpenSav,
      badge: savCasesCount,
      gradient: "from-rose-500 to-red-600",
    },
    {
      id: "progression",
      label: "Ma progression",
      subtitle: "Grade & objectifs",
      icon: Award,
      onClick: onOpenProgression,
      gradient: "from-amber-500 to-yellow-600",
      isProgression: true,
    },
    {
      id: "commissions",
      label: "Commissions",
      subtitle: "Primes du mois",
      icon: Euro,
      onClick: onOpenCommissions,
      gradient: "from-green-500 to-emerald-700",
    },
    {
      id: "nps",
      label: "NPS & Google",
      subtitle: "Satisfaction client",
      icon: Star,
      onClick: onOpenNps,
      gradient: "from-yellow-500 to-amber-600",
      isNps: true,
    },
    {
      id: "history",
      label: "Historique",
      subtitle: "Activités & alertes",
      icon: History,
      onClick: onOpenHistory,
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  // Filtrage pour les profils logistique
  if (isLogistique) {
    tiles = tiles.filter((t) => LOGISTIQUE_ALLOWED.includes(t.id));
  }

  if (isAdmin) {
    tiles.push({
      id: "logiCommissions",
      label: "Primes Logistique",
      subtitle: "Livreurs / Magasiniers",
      icon: Truck,
      onClick: onOpenLogiCommissions,
      gradient: "from-orange-600 to-red-700",
    });
    tiles.push({
      id: "hr",
      label: "RH",
      subtitle: "Vue équipe",
      icon: Briefcase,
      onClick: onOpenHr,
      gradient: "from-pink-600 via-fuchsia-600 to-purple-700",
    });
    tiles.push({
      id: "admin",
      label: "Paramètres",
      subtitle: "Panneau admin",
      icon: Settings,
      onClick: onOpenAdmin,
      gradient: "from-slate-600 to-slate-800",
    });
  }

  // Objectifs du jour : récupérer items liés et calculer progrès
  const todayItems = (objectives?.items || []).map((item) => {
    const interaction = (interactions || []).find(
      (i) => i.id === item.interactionId,
    );
    const p = (progressByInteraction || {})[item.interactionId] || {
      count: 0,
      amount: 0,
    };
    const isAmount = interaction?.type === "amount";
    const current = isAmount ? p.amount : p.count;
    const pct =
      item.target > 0 ? Math.min(100, Math.round((current / item.target) * 100)) : 0;
    return {
      item,
      interaction,
      current,
      pct,
      done: current >= item.target,
      isAmount,
    };
  }).filter((x) => x.interaction);

  // Trouver la PO spécifiquement (matching flexible)
  const poEntry = todayItems.find(
    (x) =>
      (x.interaction.label || "").toUpperCase().includes("PO") ||
      (x.interaction.id || "").toLowerCase().includes("po"),
  );

  const globalPct = todayItems.length
    ? Math.round(
        todayItems.reduce((sum, x) => sum + x.pct, 0) / todayItems.length,
      )
    : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Salutation */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
            Bonjour {currentUser.prenom} 👋
          </h1>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* === BANNIÈRE OBJECTIFS DU JOUR === */}
        <div className="mb-4 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black/10 rounded-full" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Target size={18} />
                </div>
                <div>
                  <h2 className="font-black text-base leading-tight">
                    Objectifs du jour
                  </h2>
                  <p className="text-[11px] text-white/80">
                    Magasin — toute l'équipe
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black">{globalPct}%</div>
                <div className="text-[10px] text-white/80 uppercase tracking-wide font-bold">
                  Global
                </div>
              </div>
            </div>

            {todayItems.length === 0 ? (
              <div className="bg-white/10 rounded-xl p-3 text-sm text-center italic">
                {isAdmin
                  ? "Aucun objectif fixé. Allez dans Paramètres → Planning pour en définir."
                  : "Aucun objectif fixé pour aujourd'hui."}
              </div>
            ) : (
              <>
                {/* FOCUS PO si présente — cliquable pour ajouter sa contribution */}
                {poEntry && (
                  <button
                    onClick={() => onAchievement && onAchievement(poEntry.interaction)}
                    className="w-full text-left bg-white text-slate-800 rounded-xl p-3 mb-2 shadow-md hover:shadow-lg active:scale-[0.99] transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{poEntry.interaction.emoji}</span>
                        <span className="font-black text-sm">
                          {poEntry.interaction.label}
                        </span>
                        {poEntry.done && (
                          <PartyPopper size={16} className="text-emerald-600" />
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-lg font-black ${poEntry.done ? "text-emerald-600" : "text-orange-600"}`}
                        >
                          {poEntry.isAmount
                            ? `${poEntry.current} €`
                            : poEntry.current}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {" "}
                          / {poEntry.isAmount
                            ? `${poEntry.item.target} €`
                            : poEntry.item.target}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${poEntry.done ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-orange-500 to-red-500"}`}
                        style={{ width: `${poEntry.pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wide flex items-center gap-1">
                        <Plus size={10} /> Tapez pour ajouter votre réalisation
                      </span>
                      <span className="text-[10px] font-bold text-slate-600">
                        {poEntry.pct}%
                      </span>
                    </div>
                  </button>
                )}

                {/* Autres objectifs compacts — cliquables */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {todayItems
                    .filter((x) => x !== poEntry)
                    .map((x) => (
                      <button
                        key={x.item.interactionId}
                        onClick={() => onAchievement && onAchievement(x.interaction)}
                        className={`text-left rounded-lg px-2 py-1.5 backdrop-blur-sm hover:brightness-110 active:scale-[0.97] transition ${x.done ? "bg-emerald-500/30 ring-1 ring-emerald-300" : "bg-white/15 hover:bg-white/25"}`}
                      >
                        <div className="flex items-center gap-1 text-xs font-bold truncate">
                          <span>{x.interaction.emoji}</span>
                          <span className="truncate">
                            {x.interaction.label}
                          </span>
                          {x.done && <PartyPopper size={11} />}
                        </div>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-sm font-black">
                            {x.isAmount ? `${x.current}€` : x.current}
                          </span>
                          <span className="text-[10px] opacity-75">
                            /
                            {x.isAmount ? `${x.item.target}€` : x.item.target}
                          </span>
                          <span className="ml-auto text-[10px] font-bold">
                            {x.pct}%
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
                <p className="text-[10px] text-white/80 mt-2 text-center italic">
                  Tapez un objectif pour ajouter votre réalisation
                </p>
              </>
            )}
          </div>
        </div>

        {/* === BANDEAU RAPPEL MISSIONS EN COURS === */}
        {myActiveMissionsCount > 0 && (
          <button
            onClick={onOpenMyMissionsHistory}
            className="w-full mb-4 bg-gradient-to-r from-fuchsia-100 to-pink-100 border-2 border-fuchsia-400 hover:border-fuchsia-600 rounded-xl p-3 flex items-center gap-3 shadow-sm transition text-left"
          >
            <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl flex items-center justify-center text-white relative animate-pulse">
              <Target size={20} />
              <span className="absolute -top-1 -right-1 bg-white text-fuchsia-600 text-[11px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-md">
                {myActiveMissionsCount}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-fuchsia-800 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {myActiveMissionsCount === 1
                  ? "Vous avez 1 mission en cours non finie"
                  : `Vous avez ${myActiveMissionsCount} missions en cours non finies`}
              </div>
              <div className="text-xs text-fuchsia-700 truncate">
                {myActiveMissions
                  .slice(0, 3)
                  .map((m) => {
                    if (m.status === "completed") return `✓ ${m.title} (en attente validation)`;
                    if (m.rejections > 0) return `↻ ${m.title} (à refaire)`;
                    return `• ${m.title}`;
                  })
                  .join(" · ")}
                {myActiveMissions.length > 3 && ` · +${myActiveMissions.length - 3} autres`}
              </div>
            </div>
            <ChevronRight size={18} className="text-fuchsia-500 shrink-0" />
          </button>
        )}

        {/* === GRILLE DE TUILES === */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {tiles.map((t) => {
            const Icon = t.icon;
            const hasBigBadge = t.badgeBig && t.badge > 0;
            // Progression pour la tuile "progression"
            const progInfo = t.isProgression
              ? computeGradeProgress(totalPoints || 0)
              : null;
            return (
              <button
                key={t.id}
                onClick={t.onClick}
                className={`aspect-square relative bg-gradient-to-br ${progInfo ? `${progInfo.current.gradientFrom} ${progInfo.current.gradientTo}` : t.gradient} text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all p-3 sm:p-4 flex flex-col items-center justify-center gap-1.5 sm:gap-2 overflow-hidden ${t.pulse ? "animate-pulse-slow" : ""}`}
              >
                {/* Badge normal */}
                {t.badge > 0 && !t.badgeBig && (
                  <span className="absolute top-2 right-2 bg-white text-slate-800 text-xs font-black rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center shadow-md">
                    {t.badge}
                  </span>
                )}
                {/* Gros badge cliquable (pour la zone) */}
                {hasBigBadge && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      t.onBadgeClick && t.onBadgeClick();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        t.onBadgeClick && t.onBadgeClick();
                      }
                    }}
                    className={`absolute top-2 right-2 bg-white ${t.id === "missions" ? "text-fuchsia-600" : "text-red-600"} text-2xl sm:text-3xl font-black rounded-2xl min-w-[52px] h-[52px] sm:min-w-[60px] sm:h-[60px] px-2 flex items-center justify-center shadow-2xl ring-4 ring-white/40 hover:scale-110 active:scale-95 transition cursor-pointer animate-pulse z-20`}
                    title="Voir le détail"
                  >
                    {t.badge}
                  </span>
                )}
                {/* Badge "Défaut" si mission en retard */}
                {t.overdueCount > 0 && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      t.onBadgeClick && t.onBadgeClick();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        t.onBadgeClick && t.onBadgeClick();
                      }
                    }}
                    className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-lg z-20 animate-pulse cursor-pointer"
                    title="Missions en défaut de prise en charge"
                  >
                    <AlertCircle size={10} />
                    {t.overdueCount} défaut{t.overdueCount > 1 ? "s" : ""}
                  </span>
                )}
                {/* Halo décoratif */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-black/10 rounded-full" />

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 relative z-10">
                  <Icon size={28} strokeWidth={2.2} />
                </div>
                <div className="text-center relative z-10 px-1 w-full">
                  <div className="font-black text-sm sm:text-base leading-tight">
                    {progInfo ? progInfo.current.label : t.label}
                  </div>
                  {progInfo ? (
                    <>
                      <div className="text-[10px] sm:text-xs opacity-90 font-bold mt-0.5">
                        {progInfo.current.emoji}{" "}
                        {(totalPoints || 0).toLocaleString("fr-FR")} pts
                      </div>
                      {/* Mini-jauge */}
                      <div className="mt-1.5 h-1.5 bg-white/25 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all"
                          style={{
                            width: `${Math.max(Math.round(progInfo.ratio * 100), 3)}%`,
                          }}
                        />
                      </div>
                      {progInfo.next && (
                        <div className="text-[9px] opacity-80 mt-0.5 font-semibold">
                          {progInfo.pointsToNext.toLocaleString("fr-FR")} →{" "}
                          {progInfo.next.short}
                        </div>
                      )}
                    </>
                  ) : t.isNps ? (
                    <>
                      <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold mt-1">
                        <span className="bg-white/25 rounded px-1.5 py-0.5">
                          NPS <strong>{currentNps || 0}</strong>
                        </span>
                        <span className="bg-white/25 rounded px-1.5 py-0.5">
                          {(currentGoogleRating || 0).toFixed(1)}★
                        </span>
                      </div>
                      <div className="text-[9px] opacity-85 mt-1 font-semibold">
                        Objectif 72+ / 4.5★
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] sm:text-xs opacity-90 font-medium mt-0.5">
                      {hasBigBadge ? "Tapez le chiffre pour voir" : t.subtitle}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Lien rapide annuaire équipe */}
        <div className="mt-5">
          <button
            onClick={onOpenTeamPhones}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white">
              <PhoneCall size={18} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-slate-800 text-sm">
                Annuaire équipe
              </div>
              <div className="text-xs text-slate-500">
                Voir et appeler les collègues
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// CALL PANEL — Appel, Décrocher, Raccrocher, Passer le client
// ========================================================================
// ========================================================================
// WIFI CALL MODAL — Appels via WiFi (Jitsi, WhatsApp, FaceTime, etc.)
// ========================================================================
function WifiCallModal({ currentUser, users, postSystemMessage, onClose }) {
  const [targetFc, setTargetFc] = useState("");
  const [mode, setMode] = useState("jitsi"); // jitsi | whatsapp | facetime | phone
  const [inCall, setInCall] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [activeCalls, setActiveCalls] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);

  // Charge les appels actifs (storage partagé avec savedAt)
  useEffect(() => {
    const loadActiveCalls = async () => {
      try {
        const list = await window.storage.list("call:active:", true);
        if (!list || !list.keys) return;
        const calls = [];
        const cutoff = Date.now() - 60 * 60 * 1000; // 1h
        for (const k of list.keys) {
          try {
            const got = await window.storage.get(k, true);
            if (!got || !got.value) continue;
            const c = JSON.parse(got.value);
            // Considérer les appels < 1h comme actifs
            if (c.startedAt && c.startedAt > cutoff && !c.endedAt) {
              calls.push({ ...c, _key: k });
            }
          } catch (e) {}
        }
        calls.sort((a, b) => b.startedAt - a.startedAt);
        setActiveCalls(calls);
      } catch (e) {}
    };
    loadActiveCalls();
    const id = setInterval(loadActiveCalls, 5000);
    return () => clearInterval(id);
  }, []);

  // Liste des collègues joignables (hors soi-même)
  const colleagues = (users || [])
    .filter((u) => u.fc !== currentUser.fc)
    .sort((a, b) => (a.prenom || "").localeCompare(b.prenom || ""));

  const targetUser = colleagues.find((u) => u.fc === targetFc);

  // Génère un nom de salle unique et propre
  const generateRoomName = (forTeam = false) => {
    const myName = (currentUser.prenom || "user").replace(/[^a-zA-Z0-9]/g, "");
    if (forTeam) return `boulangerF890-equipe-${Date.now().toString(36).slice(-6)}`;
    const targetName = (targetUser?.prenom || "call").replace(/[^a-zA-Z0-9]/g, "");
    const shortId = Date.now().toString(36).slice(-6);
    return `boulangerF890-${myName}-${targetName}-${shortId}`;
  };

  // Enregistre l'appel comme actif (visible par tous)
  const registerActiveCall = async (room, type, targets) => {
    const callId = `c${Date.now()}`;
    const data = {
      id: callId,
      room,
      url: `https://meet.jit.si/${room}`,
      startedBy: currentUser.fc,
      startedByName: currentUser.prenom,
      startedAt: Date.now(),
      type, // "duo" | "team"
      targets: targets || [],
    };
    try {
      await window.storage.set(
        `call:active:${callId}`,
        JSON.stringify(data),
        true,
      );
    } catch (e) {}
    return data;
  };

  // URL active de l'appel en cours (utilisée pour l'écran "Appel lancé")
  const [callLaunchUrl, setCallLaunchUrl] = useState("");
  const [callLaunchType, setCallLaunchType] = useState(""); // "jitsi-duo" | "jitsi-team" | "whatsapp" | "facetime" | "phone"

  // Tente d'ouvrir un lien (avec fallbacks pour les sandbox)
  const tryOpenLink = (url) => {
    // Méthode 1 : créer un vrai <a> et le cliquer (passe à travers allow-popups)
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    } catch (e) {}
    // Méthode 2 : window.open
    try {
      const w = window.open(url, "_blank", "noopener,noreferrer");
      if (w) return true;
    } catch (e) {}
    // Méthode 3 : changement direct (dernier recours)
    try {
      window.location.href = url;
      return true;
    } catch (e) {}
    return false;
  };

  const launchJitsi = async () => {
    if (!targetUser) {
      alert("Choisissez un collègue");
      return;
    }
    const room = generateRoomName();
    setRoomName(room);
    const url = `https://meet.jit.si/${room}`;
    await registerActiveCall(room, "duo", [targetUser.fc]);
    try {
      postSystemMessage({
        type: "wifi_call",
        text: `📞 ${currentUser.prenom} propose un appel WiFi à @${targetUser.prenom}. [Rejoindre l'appel](${url})`,
        mentions: [targetUser.fc],
        link: url,
        mode: "jitsi",
      });
    } catch (e) {}
    setCallLaunchUrl(url);
    setCallLaunchType("jitsi-duo");
    setInCall(true);
  };

  // Salle équipe ouverte à tous
  const launchTeamRoom = async () => {
    const room = generateRoomName(true);
    setRoomName(room);
    const url = `https://meet.jit.si/${room}`;
    const others = colleagues.map((c) => c.fc);
    await registerActiveCall(room, "team", others);
    try {
      postSystemMessage({
        type: "wifi_call",
        text: `🎙️ ${currentUser.prenom} démarre une réunion équipe en visio. [Rejoindre](${url})`,
        mentions: others,
        link: url,
        mode: "jitsi",
      });
    } catch (e) {}
    setCallLaunchUrl(url);
    setCallLaunchType("jitsi-team");
    setInCall(true);
  };

  // Rejoindre un appel actif → affiche aussi l'écran de lancement
  const joinActiveCall = (call) => {
    setCallLaunchUrl(call.url);
    setCallLaunchType(call.type === "team" ? "jitsi-team" : "jitsi-duo");
    setRoomName(call.room || "");
    setInCall(true);
  };

  // Mettre fin à un appel (que le créateur peut faire)
  const endCall = async (call) => {
    try {
      await window.storage.set(
        call._key,
        JSON.stringify({ ...call, endedAt: Date.now() }),
        true,
      );
      setActiveCalls((prev) => prev.filter((c) => c.id !== call.id));
    } catch (e) {}
  };

  const launchWhatsApp = () => {
    if (!targetUser || !targetUser.phone) {
      alert("Le collègue n'a pas de numéro renseigné");
      return;
    }
    const phone = targetUser.phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const url = `https://wa.me/${phone}`;
    setCallLaunchUrl(url);
    setCallLaunchType("whatsapp");
    setInCall(true);
  };

  const launchFaceTime = () => {
    if (!targetUser || !targetUser.phone) {
      alert("Le collègue n'a pas de numéro renseigné");
      return;
    }
    const phone = targetUser.phone.replace(/\s/g, "");
    setCallLaunchUrl(`facetime-audio://${phone}`);
    setCallLaunchType("facetime");
    setInCall(true);
  };

  const launchPhone = () => {
    if (!targetUser || !targetUser.phone) {
      alert("Le collègue n'a pas de numéro renseigné");
      return;
    }
    const phone = targetUser.phone.replace(/\s/g, "");
    setCallLaunchUrl(`tel:${phone}`);
    setCallLaunchType("phone");
    setInCall(true);
  };

  const copyLink = () => {
    const url = callLaunchUrl || `https://meet.jit.si/${roomName}`;
    // Méthode moderne
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        return;
      }
    } catch (e) {}
    // Fallback : zone de texte temporaire (marche dans la plupart des sandbox)
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (e) {
      alert("Copie impossible. Sélectionnez le texte manuellement.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-2"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi size={20} />
            <div>
              <h2 className="font-bold text-base">Appel WiFi</h2>
              <p className="text-[10px] text-white/80">
                Appel gratuit via internet
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3">
          {!inCall ? (
            <>
              {/* Appels en cours */}
              {activeCalls.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg p-2.5">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {activeCalls.length} appel{activeCalls.length > 1 ? "s" : ""} en cours
                  </div>
                  <div className="space-y-1.5">
                    {activeCalls.map((call) => {
                      const ago = Math.round((Date.now() - call.startedAt) / 60000);
                      const isOwn = call.startedBy === currentUser.fc;
                      return (
                        <div
                          key={call.id}
                          className="bg-white rounded p-2 flex items-center gap-2 border border-slate-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {call.startedByName}
                              </span>
                              {call.type === "team" && (
                                <span className="text-[8px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                  ÉQUIPE
                                </span>
                              )}
                              {call.type === "duo" && (
                                <span className="text-[8px] font-bold bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded">
                                  1-à-1
                                </span>
                              )}
                            </div>
                            <div className="text-[9px] text-slate-500">
                              Démarré il y a {ago === 0 ? "<1" : ago} min
                            </div>
                          </div>
                          <button
                            onClick={() => joinActiveCall(call)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded flex items-center gap-1"
                          >
                            <Wifi size={11} />
                            Rejoindre
                          </button>
                          {isOwn && (
                            <button
                              onClick={() => endCall(call)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Terminer l'appel"
                            >
                              <PhoneOff size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bouton réunion équipe */}
              <button
                onClick={launchTeamRoom}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow"
              >
                <Video size={18} />
                <div className="text-left">
                  <div className="text-sm">Démarrer une réunion équipe</div>
                  <div className="text-[10px] opacity-90 font-normal">
                    Tous les collègues invités automatiquement
                  </div>
                </div>
              </button>

              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide text-center py-1">
                — ou appel 1-à-1 —
              </div>

              {/* Choix collègue */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Appeler
                </div>
                <select
                  value={targetFc}
                  onChange={(e) => setTargetFc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="">— Choisir un collègue —</option>
                  {colleagues.map((u) => (
                    <option key={u.fc} value={u.fc}>
                      {u.prenom} ({u.fc}){u.phone ? " 📱" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Choix mode */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Mode d'appel
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode("jitsi")}
                    className={`px-3 py-3 rounded-lg border-2 text-left transition ${mode === "jitsi" ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Video size={16} className="text-cyan-600" />
                      <span className="font-bold text-sm">Jitsi Meet</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Audio+vidéo WiFi, gratuit, sans compte
                    </div>
                  </button>
                  <button
                    onClick={() => setMode("whatsapp")}
                    disabled={!targetUser?.phone}
                    className={`px-3 py-3 rounded-lg border-2 text-left transition ${mode === "whatsapp" ? "border-green-500 bg-green-50" : "border-slate-200 bg-white hover:border-slate-300"} ${!targetUser?.phone ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      <span className="font-bold text-sm">WhatsApp</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {targetUser?.phone
                        ? "Appel via WhatsApp"
                        : "N° requis"}
                    </div>
                  </button>
                  <button
                    onClick={() => setMode("facetime")}
                    disabled={!targetUser?.phone}
                    className={`px-3 py-3 rounded-lg border-2 text-left transition ${mode === "facetime" ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"} ${!targetUser?.phone ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📱</span>
                      <span className="font-bold text-sm">FaceTime</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Audio iOS/Mac uniquement
                    </div>
                  </button>
                  <button
                    onClick={() => setMode("phone")}
                    disabled={!targetUser?.phone}
                    className={`px-3 py-3 rounded-lg border-2 text-left transition ${mode === "phone" ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"} ${!targetUser?.phone ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <PhoneCall size={16} className="text-orange-600" />
                      <span className="font-bold text-sm">Téléphone</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Appel cellulaire classique
                    </div>
                  </button>
                </div>
              </div>

              {/* Info bloc Jitsi */}
              {mode === "jitsi" && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-2.5 text-[11px] text-cyan-800">
                  💡 Le lien sera envoyé dans le chat avec une mention à votre
                  collègue. Il lui suffit de taper le lien pour rejoindre
                  l'appel dans son navigateur ou l'app Jitsi Meet.
                </div>
              )}
              {mode === "whatsapp" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-[11px] text-green-800">
                  💡 WhatsApp s'ouvrira avec une conversation vers votre
                  collègue. Tapez sur l'icône téléphone pour l'appel WiFi.
                </div>
              )}
              {mode === "facetime" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-800">
                  💡 FaceTime Audio s'ouvrira directement. Fonctionne
                  uniquement si vous et votre collègue avez un iPhone/Mac.
                </div>
              )}
              {mode === "phone" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 text-[11px] text-orange-800">
                  💡 Appel téléphonique classique (peut consommer votre
                  forfait). Pour un appel gratuit en WiFi, préférez Jitsi
                  Meet ou WhatsApp.
                </div>
              )}
            </>
          ) : (
            <>
              {/* Écran "Appel lancé" — affiche le lien de manière sandbox-safe */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-700 text-white rounded-xl p-4 text-center">
                <Video size={32} className="mx-auto mb-2 opacity-90" />
                <div className="font-bold text-base">
                  {callLaunchType === "jitsi-team"
                    ? "Réunion équipe créée"
                    : callLaunchType === "jitsi-duo"
                      ? `Appel avec ${targetUser?.prenom || "—"}`
                      : callLaunchType === "whatsapp"
                        ? `WhatsApp ${targetUser?.prenom || ""}`
                        : "Appel"}
                </div>
                <div className="text-[11px] opacity-90 mt-1">
                  Tapez le bouton vert pour ouvrir l'appel
                </div>
              </div>

              {/* GRAND BOUTON OUVRIR (vrai <a> qui passe le sandbox) */}
              <a
                href={callLaunchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-4 px-4 rounded-xl text-center shadow-lg active:scale-95 transition"
                onClick={() => {
                  // Tentative supplémentaire si le lien direct est bloqué
                  setTimeout(() => tryOpenLink(callLaunchUrl), 100);
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Wifi size={20} />
                  <span className="text-base">
                    {callLaunchType === "whatsapp"
                      ? "Ouvrir WhatsApp"
                      : "Ouvrir l'appel"}
                  </span>
                </div>
                <div className="text-[10px] opacity-90 font-normal mt-0.5">
                  S'ouvre dans un nouvel onglet
                </div>
              </a>

              {/* QR Code pour partage rapide */}
              <div className="bg-white border-2 border-slate-200 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
                  📱 Scannez pour rejoindre
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(callLaunchUrl)}&margin=10`}
                  alt="QR Code de l'appel"
                  className="mx-auto rounded"
                  width="200"
                  height="200"
                />
                <div className="text-[10px] text-slate-500 mt-2">
                  Avec l'appareil photo de votre téléphone
                </div>
              </div>

              {/* Lien complet + copier */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Lien de l'appel
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={callLaunchUrl}
                    onClick={(e) => e.target.select()}
                    className="flex-1 text-[10px] bg-white border border-slate-200 rounded px-2 py-1.5 font-mono"
                  />
                  <button
                    onClick={copyLink}
                    className={`px-3 py-1.5 ${linkCopied ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"} text-white rounded text-xs font-bold whitespace-nowrap`}
                  >
                    {linkCopied ? "✓ Copié" : "📋 Copier"}
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 italic">
                  Le lien a aussi été envoyé dans le chat avec une mention
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900">
                💡 <strong>Si le bouton vert ne s'ouvre pas :</strong> copiez le
                lien et collez-le dans la barre d'adresse de votre navigateur
                (Safari, Chrome, Firefox).
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-3 flex gap-2 shrink-0">
          {!inCall ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (!targetFc) {
                    alert("Choisissez un collègue");
                    return;
                  }
                  if (mode === "jitsi") launchJitsi();
                  else if (mode === "whatsapp") launchWhatsApp();
                  else if (mode === "facetime") launchFaceTime();
                  else if (mode === "phone") launchPhone();
                }}
                disabled={!targetFc}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
              >
                <PhoneCall size={16} />
                Lancer l'appel
              </button>
            </>
          ) : (
            <>
              <a
                href={callLaunchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(() => tryOpenLink(callLaunchUrl), 100)}
                className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Video size={16} />
                Rouvrir
              </a>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                Fermer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CallPanel({
  myStatus,
  onSetStatus,
  onOpenTeamPhones,
  onOpenHandover,
  onOpenWifiCall,
  onClose,
}) {
  const statusId = myStatus?.status || "available";
  const withClient = statusId === "with_client";

  const actions = [
    {
      id: "call",
      label: "Appeler un collègue",
      subtitle: "Ouvrir l'annuaire",
      icon: PhoneCall,
      gradient: "from-emerald-500 to-green-600",
      onClick: () => {
        onOpenTeamPhones();
        onClose();
      },
    },
    {
      id: "wifi",
      label: "Appel WiFi",
      subtitle: "Jitsi / Visio / App",
      icon: Wifi,
      gradient: "from-cyan-500 to-blue-600",
      onClick: () => {
        onOpenWifiCall();
        onClose();
      },
    },
    {
      id: "pickup",
      label: withClient ? "Je suis déjà en appel" : "Je décroche",
      subtitle: withClient ? "Statut : avec client" : "Marquer 'avec client'",
      icon: PhoneIncoming,
      gradient: withClient
        ? "from-slate-400 to-slate-500"
        : "from-blue-500 to-indigo-600",
      disabled: withClient,
      onClick: () => {
        onSetStatus("with_client");
        onClose();
      },
    },
    {
      id: "hangup",
      label: "Raccrocher",
      subtitle: "Je redeviens dispo",
      icon: PhoneOff,
      gradient: !withClient
        ? "from-slate-400 to-slate-500"
        : "from-red-500 to-rose-600",
      disabled: !withClient,
      onClick: () => {
        onSetStatus("available");
        onClose();
      },
    },
    {
      id: "handover",
      label: "Passer à un collègue",
      subtitle: "Transférer l'appel",
      icon: PhoneForwarded,
      gradient: "from-orange-500 to-amber-600",
      onClick: () => {
        onOpenHandover();
        onClose();
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-5 py-3 flex items-center gap-2">
          <PhoneCall size={20} />
          <div className="flex-1">
            <h2 className="font-bold text-lg">Gestion d'appel</h2>
            <p className="text-xs text-white/80">
              Statut actuel :{" "}
              <span className="font-bold">
                {getStatus(statusId).label}
              </span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={a.onClick}
                disabled={a.disabled}
                className={`aspect-square relative bg-gradient-to-br ${a.gradient} text-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all p-3 flex flex-col items-center justify-center gap-2 ${a.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="bg-white/20 rounded-xl p-2.5">
                  <Icon size={26} strokeWidth={2.2} />
                </div>
                <div className="text-center">
                  <div className="font-black text-sm leading-tight">
                    {a.label}
                  </div>
                  <div className="text-[10px] opacity-90 mt-0.5">
                    {a.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// HANDOVER MODAL — Passer le client à un collègue
// ========================================================================
function HandoverModal({ users, currentFc, userStatuses, onHandover, onClose }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [note, setNote] = useState("");

  // Trier : disponibles d'abord, puis alphabétique
  const available = useMemo(() => {
    return users
      .filter((u) => u.fc !== currentFc)
      .sort((a, b) => {
        const aStatus = userStatuses?.[a.fc]?.status || "available";
        const bStatus = userStatuses?.[b.fc]?.status || "available";
        const aAvail = aStatus === "available" ? 0 : 1;
        const bAvail = bStatus === "available" ? 0 : 1;
        if (aAvail !== bAvail) return aAvail - bAvail;
        return a.prenom.localeCompare(b.prenom);
      });
  }, [users, currentFc, userStatuses]);

  const handleConfirm = async () => {
    if (!selectedUser) return;
    await onHandover(selectedUser, note.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-5 py-3 flex items-center gap-2">
          <PhoneForwarded size={20} />
          <h2 className="font-bold text-lg flex-1">Passer un client</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <p className="text-xs text-slate-500 mb-2">
            Choisissez un collègue à qui passer le client. Un message sera envoyé
            dans le chat et il recevra une notification.
          </p>

          <div className="space-y-1 mb-3">
            {available.map((u) => {
              const statusId = userStatuses?.[u.fc]?.status || "available";
              const statusData = getStatus(statusId);
              const isSelected = selectedUser?.fc === u.fc;
              const isAvailable = statusId === "available";
              return (
                <button
                  key={u.fc}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border-2 transition ${
                    isSelected
                      ? "bg-orange-50 border-orange-500"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full ${colorForUser(u.fc)} flex items-center justify-center text-white font-bold text-xs`}
                    >
                      {u.prenom.slice(0, 2).toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${STATUS_DOT_COLORS[statusId]}`}
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-800 truncate">
                        {u.prenom}
                      </span>
                      <RoleBadge role={u.role} compact />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {statusData.label}
                      {!isAvailable && " — pas disponible"}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={18} className="text-orange-500" />
                  )}
                </button>
              );
            })}
            {available.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm">
                Aucun collègue disponible.
              </div>
            )}
          </div>

          {selectedUser && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message / contexte (facultatif)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex : cherche TV 65 pouces, budget 1500 €"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-200 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedUser}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-lg disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <PhoneForwarded size={16} />
            Passer le client
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// ACTIVE DEMANDS BANNER — Pop-up persistants pour les demandes en attente
// ========================================================================
function ActiveDemandsBanner({
  pickups,
  missions,
  zoneAlerts,
  currentUser,
  isAdmin,
  onOpenPickups,
  onOpenMissions,
  onOpenZoneAlerts,
  onTakePickup,
  onTakeMission,
  onTakeZoneAlert,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [hiddenIds, setHiddenIds] = useState(new Set());

  // Demandes actives, non masquées par l'utilisateur
  const activePickups = (pickups || []).filter(
    (p) =>
      p.status === "requested" &&
      p.createdBy !== currentUser.fc &&
      !hiddenIds.has(`pickup-${p.id}`),
  );

  const activeMissions = (missions || []).filter(
    (m) =>
      (m.status === "open" || m.status === "available") &&
      m.createdBy !== currentUser.fc &&
      !hiddenIds.has(`mission-${m.id}`),
  );

  const activeZones = (zoneAlerts || []).filter(
    (a) =>
      !a.takenBy &&
      a.fc !== currentUser.fc &&
      !hiddenIds.has(`zone-${a._key || a.timestamp}`),
  );

  const total = activePickups.length + activeMissions.length + activeZones.length;

  if (total === 0) return null;

  const hideItem = (key) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-2xl mx-auto p-3">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="pointer-events-auto ml-auto flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 transition animate-pulse"
          >
            <Bell size={16} />
            <span>
              {total} demande{total > 1 ? "s" : ""} en attente
            </span>
          </button>
        ) : (
          <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border-2 border-orange-300 overflow-hidden max-h-[60vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={16} className="animate-pulse" />
                <span className="font-bold text-sm">
                  {total} demande{total > 1 ? "s" : ""} en attente
                </span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1 hover:bg-white/20 rounded"
                title="Réduire"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Liste scrollable */}
            <div className="overflow-y-auto p-2 space-y-2">
              {/* Délivrances caisse */}
              {activePickups.map((p) => {
                const age = Math.floor((Date.now() - p.createdAt) / 60000);
                const urgent = p.urgency === "urgent";
                return (
                  <div
                    key={`pickup-${p.id}`}
                    className={`rounded-xl p-2.5 border-2 ${urgent ? "bg-red-50 border-red-400 animate-pulse-slow" : "bg-purple-50 border-purple-300"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-purple-600 text-white">
                            📦 DÉLIVRANCE CAISSE
                          </span>
                          {urgent && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-0.5">
                              <Zap size={9} /> URGENT
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-slate-500">
                            {age} min
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-800 truncate">
                          {p.product || (
                            <span className="italic font-normal text-slate-500">
                              Produit non précisé
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Demandé par <strong>{p.createdByPrenom}</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => hideItem(`pickup-${p.id}`)}
                        className="text-slate-300 hover:text-slate-500 p-0.5"
                        title="Masquer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={() => onTakePickup(p)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Hand size={11} />
                        Je m'en occupe
                      </button>
                      <button
                        onClick={onOpenPickups}
                        className="px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-1.5 rounded-lg"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Missions */}
              {activeMissions.map((m) => {
                const age = Math.floor((Date.now() - m.createdAt) / 60000);
                return (
                  <div
                    key={`mission-${m.id}`}
                    className="rounded-xl p-2.5 border-2 bg-fuchsia-50 border-fuchsia-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-fuchsia-600 text-white">
                            🎯 MISSION
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-100 text-fuchsia-700">
                            +{m.rewardPoints || 0} pts
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {age} min
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-800 truncate">
                          {m.title}
                        </div>
                        {m.description && (
                          <div className="text-[11px] text-slate-600 truncate">
                            {m.description}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => hideItem(`mission-${m.id}`)}
                        className="text-slate-300 hover:text-slate-500 p-0.5"
                        title="Masquer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={() => onTakeMission(m)}
                        className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Hand size={11} />
                        Je la prends
                      </button>
                      <button
                        onClick={onOpenMissions}
                        className="px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-1.5 rounded-lg"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Alertes zone */}
              {activeZones.map((a) => {
                const age = Math.floor(
                  (Date.now() - (a.timestamp || a.createdAt || 0)) / 60000,
                );
                return (
                  <div
                    key={`zone-${a._key || a.timestamp}`}
                    className="rounded-xl p-2.5 border-2 bg-red-50 border-red-400 animate-pulse-slow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-0.5">
                            <Zap size={9} /> CLIENT EN ATTENTE
                          </span>
                          <span
                            className={`text-[10px] font-bold ${age >= 5 ? "text-red-700" : "text-slate-500"}`}
                          >
                            {age} min
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-800 truncate">
                          {a.zoneLabel || a.zone || "Zone"}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Signalé par <strong>{a.prenom}</strong>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          hideItem(`zone-${a._key || a.timestamp}`)
                        }
                        className="text-slate-300 hover:text-slate-500 p-0.5"
                        title="Masquer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={() => onTakeZoneAlert(a)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Hand size={11} />
                        J'y vais
                      </button>
                      <button
                        onClick={onOpenZoneAlerts}
                        className="px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-1.5 rounded-lg"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function Header({
  currentUser,
  isAdmin,
  mainView,
  onGoHome,
  onGoChat,
  onLogout,
  onOpenSidebar,
  myStatus,
  onSetStatus,
  unreadMentionsCount,
  darkMode,
  onToggleDark,
  soundOn,
  onToggleSound,
}) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const currentStatus = getStatus(myStatus?.status || "available");

  return (
    <header className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-sm shrink-0">
      {/* GAUCHE : navigation home/chat */}
      <div className="flex items-center gap-1.5">
        {mainView !== "home" && (
          <button
            onClick={onGoHome}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
            title="Retour à l'accueil"
          >
            <Home size={18} />
            <span className="text-xs font-bold hidden sm:inline">Accueil</span>
          </button>
        )}
        {mainView === "home" && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            title="Équipe"
          >
            <Trophy size={20} />
          </button>
        )}
        {mainView === "home" && (
          <button
            onClick={onGoChat}
            className="relative p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition flex items-center gap-1.5"
            title="Accéder au chat"
          >
            <MessageCircle size={18} />
            <span className="text-xs font-bold hidden sm:inline">Chat</span>
            {unreadMentionsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {unreadMentionsCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* DROITE : infos utilisateur + logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 relative">
        <div className="hidden xs:block border-r border-slate-200 pr-3 min-w-0 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <p className="font-semibold text-slate-800 text-sm truncate">
              {currentUser.prenom}
            </p>
            {currentUser.role && <RoleBadge role={currentUser.role} />}
          </div>
          <button
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            className="flex items-center justify-end gap-1 text-xs text-slate-500 hover:text-slate-800 ml-auto"
          >
            <span>{currentStatus.label}</span>
            <span
              className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[currentStatus.id]}`}
            />
            <ChevronDown size={10} />
          </button>
        </div>
        <BoulangerLogo small />
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg transition ${soundOn ? "text-orange-500 hover:bg-orange-50" : "text-slate-400 hover:bg-slate-100"}`}
          title={soundOn ? "Couper le son" : "Activer le son"}
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          title={darkMode ? "Mode clair" : "Mode sombre"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={onLogout}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          title="Déconnexion"
        >
          <LogOut size={18} />
        </button>

        {/* Menu statut */}
        {statusMenuOpen && (
          <div
            className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-40 min-w-[180px]"
            onMouseLeave={() => setStatusMenuOpen(false)}
          >
            <div className="px-3 py-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wide border-b border-slate-100">
              Mon statut
            </div>
            {STATUSES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onSetStatus(s.id);
                  setStatusMenuOpen(false);
                }}
                className={`w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm ${
                  myStatus?.status === s.id ? "bg-slate-50 font-semibold" : ""
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT_COLORS[s.id]}`}
                />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ========================================================================
// ROLE BADGE
// ========================================================================
function RoleBadge({ role, compact = false }) {
  const r = getRole(role);
  const colors = ROLE_COLORS[role] || ROLE_COLORS.vendeur;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${colors.bg} ${colors.text}`}
      title={r.label}
    >
      <span className="text-[11px]">{r.emoji}</span>
      {!compact && <span>{r.label}</span>}
    </span>
  );
}

// ========================================================================
// REMINDER BANNER
// ========================================================================
function ReminderBanner({ reminder, isAdmin, onClear }) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 flex items-center gap-2 text-sm shadow">
      <Megaphone size={16} className="shrink-0" />
      <span className="font-semibold shrink-0">Rappel :</span>
      <span className="truncate">{reminder.text}</span>
      {isAdmin && (
        <button
          onClick={onClear}
          className="ml-auto p-1 hover:bg-white/20 rounded shrink-0"
          title="Retirer le rappel"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ========================================================================
// OBJECTIVES BOARD
// ========================================================================
function ObjectivesBoard({
  objectives,
  progressByInteraction,
  interactions,
  isOpen,
  onToggle,
}) {
  const isToday = objectives.date === todayKey();
  const items = isToday ? objectives.items || [] : [];

  // Progrès global : moyenne des pourcentages par objectif
  const globalPct = useMemo(() => {
    if (!items.length) return 0;
    const pcts = items.map((item) => {
      const p = progressByInteraction[item.interactionId] || { count: 0, amount: 0 };
      const interaction = interactions.find((i) => i.id === item.interactionId);
      const current =
        interaction?.type === "amount" ? p.amount : p.count;
      return item.target > 0 ? Math.min(100, (current / item.target) * 100) : 0;
    });
    return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
  }, [items, progressByInteraction, interactions]);

  return (
    <div className="bg-white border-b border-slate-200 shrink-0">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
            <Target size={16} />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-bold text-slate-800">Objectifs du jour</h2>
            <p className="text-[11px] text-slate-500">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all"
                  style={{ width: `${globalPct}%` }}
                />
              </div>
              <span className="text-sm font-bold text-orange-600">{globalPct}%</span>
            </div>
          )}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-3 pt-0">
          {items.length === 0 ? (
            <div className="text-center py-4 text-slate-400 text-sm italic bg-slate-50 rounded-lg">
              Aucun objectif fixé pour aujourd'hui.
              {/* hint for admin */}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {items.map((item) => {
                const interaction = interactions.find(
                  (i) => i.id === item.interactionId,
                );
                if (!interaction) return null;
                const p = progressByInteraction[item.interactionId] || {
                  count: 0,
                  amount: 0,
                };
                const isAmount = interaction.type === "amount";
                const current = isAmount ? p.amount : p.count;
                const pct = Math.min(100, Math.round((current / item.target) * 100));
                const done = current >= item.target;
                return (
                  <div
                    key={item.interactionId}
                    className={`rounded-xl p-3 border transition ${
                      done
                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <span>{interaction.emoji}</span>
                        <span className="truncate">{interaction.label}</span>
                      </span>
                      {done && <PartyPopper size={14} className="text-emerald-600" />}
                    </div>
                    <div className="flex items-baseline gap-1 mb-1.5">
                      <span
                        className={`text-xl font-black ${
                          done ? "text-emerald-600" : "text-slate-800"
                        }`}
                      >
                        {isAmount ? formatMoney(current) : current}
                      </span>
                      <span className="text-xs text-slate-500">
                        / {isAmount ? formatMoney(item.target) : item.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          done
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-orange-500 to-orange-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================================================================
// INTERACTIONS BAR
// ========================================================================
function InteractionsBar({
  interactions,
  onAchievement,
  progressByInteraction,
  disabled,
}) {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-b from-orange-50 to-white px-3 sm:px-4 py-3 shrink-0">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-orange-600" />
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          J'ai réalisé une vente
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {interactions.map((i) => {
          const p = progressByInteraction[i.id] || { count: 0, amount: 0 };
          const isAmount = i.type === "amount";
          const current = isAmount ? p.amount : p.count;
          const hasActivity = isAmount ? p.amount > 0 : p.count > 0;
          return (
            <button
              key={i.id}
              onClick={() => onAchievement(i)}
              disabled={disabled}
              className="group relative flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition shadow-sm border disabled:opacity-50 disabled:cursor-not-allowed bg-white border-slate-200 text-slate-800 hover:border-orange-400 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-base">{i.emoji}</span>
              <span>{i.label}</span>
              {isAmount ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 bg-orange-100 text-orange-700 group-hover:bg-orange-500 group-hover:text-white">
                  <Euro size={10} /> CA HT
                </span>
              ) : (
                i.points > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700 group-hover:bg-orange-500 group-hover:text-white">
                    +{i.points}
                  </span>
                )
              )}
              {hasActivity && (
                <span className="text-[10px] font-bold text-slate-500">
                  ({isAmount ? formatMoney(current) : current})
                </span>
              )}
            </button>
          );
        })}
      </div>
      {disabled && (
        <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
          <Lock size={12} /> Envoi bloqué par l'administrateur.
        </p>
      )}
    </div>
  );
}

// ========================================================================
// MESSAGE LIST
// ========================================================================
function MessageList({ messages, currentFc, isAdmin, users, onBravo, onEmojiReact, onDelete, onTakeZone, onReleaseZone, messagesEndRef }) {
  const grouped = [];
  let prevDay = null;
  messages.forEach((m) => {
    const day = formatDay(m.timestamp);
    if (day !== prevDay) {
      grouped.push({ type: "day", day, key: `d${m.timestamp}` });
      prevDay = day;
    }
    grouped.push({ type: "msg", msg: m, key: m._key || `m${m.timestamp}` });
  });

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-1 bg-slate-50">
      {grouped.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2 py-10">
          <MessageCircle size={40} className="opacity-30" />
          <p>Aucun message pour le moment.</p>
          <p className="text-xs">Soyez le premier à écrire ou à réaliser une vente !</p>
        </div>
      ) : (
        grouped.map((item) => {
          if (item.type === "day") {
            return (
              <div key={item.key} className="flex justify-center my-3">
                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm font-medium">
                  {item.day}
                </span>
              </div>
            );
          }
          return (
            <MessageItem
              key={item.key}
              msg={item.msg}
              currentFc={currentFc}
              isAdmin={isAdmin}
              users={users}
              onBravo={onBravo}
              onEmojiReact={onEmojiReact}
              onDelete={onDelete}
              onTakeZone={onTakeZone}
              onReleaseZone={onReleaseZone}
            />
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

// ========================================================================
// REACTION BAR (réactions emoji sur un message)
// ========================================================================
const QUICK_EMOJIS = ["👍", "❤️", "🔥", "👏", "😂", "🎉"];

function ReactionBar({ msg, currentFc, onReact, dark = false }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const reactions = msg.emojiReactions || {};
  const entries = Object.entries(reactions).filter(
    ([, fcs]) => fcs && fcs.length > 0,
  );

  return (
    <div className="flex items-center gap-1 flex-wrap mt-1 relative">
      {entries.map(([emoji, fcs]) => {
        const mine = fcs.includes(currentFc);
        return (
          <button
            key={emoji}
            onClick={() => onReact(msg, emoji)}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition ${
              mine
                ? dark
                  ? "bg-white text-slate-800 border-white"
                  : "bg-orange-100 text-orange-700 border-orange-400"
                : dark
                  ? "bg-white/20 text-white border-white/30 hover:bg-white/30"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
            }`}
          >
            <span>{emoji}</span>
            <span className="font-bold text-[10px]">{fcs.length}</span>
          </button>
        );
      })}
      <button
        onClick={() => setPickerOpen(!pickerOpen)}
        className={`p-0.5 rounded-full text-xs transition ${
          dark
            ? "text-white/70 hover:text-white hover:bg-white/20"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
        title="Réagir"
      >
        <span className="text-[13px]">🙂+</span>
      </button>
      {pickerOpen && (
        <div
          className="absolute bottom-full left-0 mb-1 bg-white rounded-full shadow-xl border border-slate-200 px-2 py-1.5 flex items-center gap-1 z-10"
          onMouseLeave={() => setPickerOpen(false)}
        >
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => {
                onReact(msg, e);
                setPickerOpen(false);
              }}
              className="hover:scale-125 transition text-lg w-7 h-7 flex items-center justify-center"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================================================
// MESSAGE TEXT avec mentions
// ========================================================================
function MessageText({ text, users, currentFc, dark = false }) {
  if (!text) return null;
  const parts = parseTextWithMentions(text, users);
  if (parts.length === 0) {
    return <span>{text}</span>;
  }
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === "mention") {
          const isMe = p.fc === currentFc;
          return (
            <span
              key={i}
              className={`font-bold px-1 rounded ${
                isMe
                  ? "bg-orange-500 text-white"
                  : dark
                    ? "bg-white/30 text-white"
                    : "bg-orange-100 text-orange-700"
              }`}
            >
              @{p.value}
            </span>
          );
        }
        return <span key={i}>{p.value}</span>;
      })}
    </>
  );
}

// ========================================================================
// MESSAGE ITEM
// ========================================================================
function MessageItem({ msg, currentFc, isAdmin, users, onBravo, onEmojiReact, onDelete, onTakeZone, onReleaseZone }) {
  const isOwn = msg.fc === currentFc;

  // Achievement
  if (msg.type === "achievement") {
    const reactions = msg.reactions || [];
    const hasReacted = reactions.includes(currentFc);
    const isAmount = msg.interactionType === "amount";
    const isCancellation = !!msg.isCancellation || msg.amount < 0;
    const cardGradient = isCancellation
      ? "from-red-500 via-red-500 to-red-700"
      : "from-orange-500 via-orange-500 to-orange-600";
    return (
      <div className="flex justify-center my-2 group">
        <div className="relative max-w-md w-full">
          <div
            className={`bg-gradient-to-br ${cardGradient} text-white rounded-2xl p-4 shadow-lg`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCancellation ? (
                <>
                  <AlertCircle size={18} />
                  <span className="font-bold text-sm uppercase tracking-wide">
                    Annulation — {msg.prenom}
                  </span>
                </>
              ) : (
                <>
                  <PartyPopper size={18} />
                  <span className="font-bold text-sm uppercase tracking-wide">
                    Bravo {msg.prenom} !
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {isCancellation ? "↩️" : msg.interactionEmoji}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">
                  {msg.interactionLabel}
                  {isAmount && msg.amount !== 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-sm ${isCancellation ? "bg-black/30" : "bg-white/20"}`}
                    >
                      {isCancellation ? "−" : ""}
                      {formatMoney(Math.abs(msg.amount))}
                      {msg.interactionUnit
                        ? " " + msg.interactionUnit.replace("€", "").trim()
                        : ""}
                    </span>
                  )}
                </p>
                <p className="text-xs text-white/80">
                  {!isAmount && msg.points > 0 && `+${msg.points} pts • `}
                  {formatTime(msg.timestamp)}
                </p>
                {isCancellation && msg.cancelReason && (
                  <p className="text-xs text-white/90 italic mt-1">
                    Motif : {msg.cancelReason}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {!isCancellation && (
                <button
                  onClick={() => onBravo(msg)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    hasReacted
                      ? "bg-white text-orange-600"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart size={12} fill={hasReacted ? "currentColor" : "none"} />
                  <span>{hasReacted ? "Bravo !" : "Féliciter"}</span>
                  {reactions.length > 0 && (
                    <span className="bg-white/30 rounded-full px-1.5 text-[10px]">
                      {reactions.length}
                    </span>
                  )}
                </button>
              )}
              {isCancellation && (
                <span className="text-[11px] text-white/90 font-semibold bg-black/20 px-2 py-1 rounded-full">
                  CA du jour réajusté
                </span>
              )}
              {isAdmin && (
                <button
                  onClick={() => onDelete(msg)}
                  className="opacity-0 group-hover:opacity-100 ml-auto p-1 bg-white/20 hover:bg-white/30 rounded transition"
                  title="Supprimer (admin)"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Zone alert
  if (msg.type === "zone_alert") {
    const taken = !!msg.takenBy;
    const takenByMe = msg.takenBy === currentFc;
    return (
      <div className="flex justify-center my-2 group">
        <div
          className={`max-w-md w-full rounded-2xl p-4 shadow-lg transition ${
            taken
              ? "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
              : "bg-gradient-to-br from-red-500 to-red-600 text-white animate-pulse-slow"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {taken ? <Check size={18} /> : <Zap size={18} />}
            <span className="font-bold text-sm uppercase tracking-wide">
              {taken ? "Pris en charge" : "Clients en attente"}
            </span>
            <span className="ml-auto text-[10px] text-white/70">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">{msg.zoneEmoji}</div>
            <div className="flex-1">
              <p className="font-bold text-lg leading-tight">{msg.zoneLabel}</p>
              <p className="text-xs text-white/80">
                Signalé par <span className="font-semibold">{msg.prenom}</span>
              </p>
            </div>
          </div>
          {taken ? (
            <div className="space-y-2">
              <div className="bg-white/20 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5">
                <Check size={14} />
                <span>
                  Pris par <strong>{msg.takenByPrenom}</strong>
                  {takenByMe ? " (vous)" : ""} à {formatTime(msg.takenAt)}
                </span>
              </div>
              {(takenByMe || isAdmin) && (
                <button
                  onClick={() => {
                    onReleaseZone && onReleaseZone(msg);
                  }}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1.5 text-xs"
                >
                  <X size={14} />
                  <span>
                    Annuler ma prise en charge
                    {isAdmin && !takenByMe ? " (admin)" : ""}
                  </span>
                </button>
              )}
            </div>
          ) : (
            <>
              {msg.releasedByPrenom && (
                <div className="mb-2 bg-amber-500/20 rounded-lg px-3 py-1.5 text-[11px] flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  <span className="italic">
                    Libéré par <strong>{msg.releasedByPrenom}</strong>{" "}
                    {formatTime(msg.releasedAt)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTakeZone(msg)}
                  className="flex-1 bg-white text-red-600 font-bold py-2 rounded-lg hover:bg-white/90 transition flex items-center justify-center gap-1.5"
                >
                  <Hand size={14} />
                  <span>Je prends en charge</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(msg)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                    title="Supprimer (admin)"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Notification : nouvelle délivrance caisse
  if (msg.type === "pickup_notification") {
    return (
      <div className="flex justify-center my-2">
        <div className="max-w-md bg-purple-50 border-2 border-purple-300 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-purple-700">
            <Package size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">
              Délivrance caisse
            </span>
            <span className="text-[10px] text-purple-600 ml-auto">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <p className="text-sm text-slate-800 font-semibold">{msg.text}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Demandée par {msg.prenom}
          </p>
        </div>
      </div>
    );
  }

  // Notification : nouvelle mission
  if (msg.type === "mission_notification") {
    return (
      <div className="flex justify-center my-2">
        <div className="max-w-md bg-fuchsia-50 border-2 border-fuchsia-300 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-fuchsia-700">
            <Target size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">
              Nouvelle mission
            </span>
            <span className="text-[10px] text-fuchsia-600 ml-auto">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <p className="text-sm text-slate-800 font-semibold">{msg.text}</p>
        </div>
      </div>
    );
  }

  // Notification : demande de congé
  if (msg.type === "vacation_notification") {
    return (
      <div className="flex justify-center my-2">
        <div className="max-w-md bg-teal-50 border-2 border-teal-300 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-teal-700">
            <Calendar size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">
              Demande de congé
            </span>
            <span className="text-[10px] text-teal-600 ml-auto">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <p className="text-sm text-slate-800">{msg.text}</p>
        </div>
      </div>
    );
  }

  // Admin reminder
  if (msg.type === "admin_reminder") {
    return (
      <div className="flex justify-center my-2">
        <div className="max-w-md bg-amber-50 border border-amber-300 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-amber-700">
            <Megaphone size={14} />
            <span className="font-bold text-xs uppercase tracking-wide">
              Rappel de {msg.prenom}
            </span>
            <span className="text-[10px] text-amber-600 ml-auto">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <p className="text-sm text-slate-800">{msg.text}</p>
        </div>
      </div>
    );
  }

  // Photo
  if (msg.type === "photo") {
    return (
      <div
        className={`flex gap-2 group ${isOwn ? "justify-end" : "justify-start"}`}
      >
        {!isOwn && (
          <div
            className={`w-8 h-8 rounded-full ${colorForUser(msg.fc)} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto shadow-sm`}
          >
            {(msg.prenom || msg.fc).slice(0, 2).toUpperCase()}
          </div>
        )}
        <div
          className={`max-w-xs flex flex-col ${isOwn ? "items-end" : "items-start"}`}
        >
          {!isOwn && (
            <span className="text-xs text-slate-600 mb-0.5 px-1 font-semibold">
              {msg.prenom}
            </span>
          )}
          <div
            className={`rounded-2xl shadow-sm overflow-hidden ${
              isOwn
                ? "bg-gradient-to-br from-orange-500 to-orange-600 rounded-br-sm"
                : "bg-white border border-slate-200 rounded-bl-sm"
            }`}
          >
            <img
              src={msg.dataUrl}
              alt="Photo partagée"
              className="max-w-full h-auto block"
              style={{ maxHeight: "320px" }}
            />
            {msg.text && (
              <p
                className={`text-sm whitespace-pre-wrap break-words px-3 py-2 ${
                  isOwn ? "text-white" : "text-slate-800"
                }`}
              >
                <MessageText
                  text={msg.text}
                  users={users || []}
                  currentFc={currentFc}
                  dark={isOwn}
                />
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 px-1">
            <span className="text-[10px] text-slate-400">
              {formatTime(msg.timestamp)}
            </span>
            {isAdmin && (
              <button
                onClick={() => onDelete(msg)}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-red-500 hover:underline transition"
              >
                Supprimer
              </button>
            )}
          </div>
          {onEmojiReact && (
            <ReactionBar
              msg={msg}
              currentFc={currentFc}
              onReact={onEmojiReact}
            />
          )}
        </div>
      </div>
    );
  }

  // Message normal
  return (
    <div className={`flex gap-2 group ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div
          className={`w-8 h-8 rounded-full ${colorForUser(msg.fc)} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto shadow-sm`}
        >
          {(msg.prenom || msg.fc).slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className={`max-w-md flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <span className="text-xs text-slate-600 mb-0.5 px-1 font-semibold">
            {msg.prenom}
            <span className="text-slate-400 font-normal ml-1">· {msg.fc}</span>
          </span>
        )}
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm ${
            isOwn
              ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-sm"
              : "bg-white text-slate-800 rounded-bl-sm border border-slate-200"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            <MessageText
              text={msg.text}
              users={users || []}
              currentFc={currentFc}
              dark={isOwn}
            />
          </p>
        </div>
        <div className="flex items-center gap-2 mt-0.5 px-1">
          <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
          {isAdmin && !isOwn && (
            <button
              onClick={() => onDelete(msg)}
              className="opacity-0 group-hover:opacity-100 text-[10px] text-red-500 hover:underline transition"
            >
              Supprimer
            </button>
          )}
        </div>
        {onEmojiReact && (
          <ReactionBar
            msg={msg}
            currentFc={currentFc}
            onReact={onEmojiReact}
          />
        )}
      </div>
    </div>
  );
}

// ========================================================================
// MESSAGE INPUT
// ========================================================================
function MessageInput({
  newMessage,
  setNewMessage,
  onSend,
  onSendPhoto,
  users = [],
  currentFc,
  disabled,
  sending,
  notificationsEnabled,
  onRequestNotifications,
}) {
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [mentionQuery, setMentionQuery] = useState(null);

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onSendPhoto(file, newMessage.trim());
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    // Détection d'un @mot en cours à la position du curseur
    const cursor = e.target.selectionStart ?? value.length;
    const before = value.slice(0, cursor);
    const match = before.match(/@([\p{L}\-']*)$/u);
    if (match) {
      setMentionQuery(match[1]);
    } else {
      setMentionQuery(null);
    }
  };

  const selectMention = (user) => {
    const input = textInputRef.current;
    if (!input) return;
    const cursor = input.selectionStart ?? newMessage.length;
    const before = newMessage.slice(0, cursor);
    const after = newMessage.slice(cursor);
    const atIdx = before.lastIndexOf("@");
    if (atIdx === -1) return;
    const newValue = before.slice(0, atIdx) + `@${user.prenom} ` + after;
    setNewMessage(newValue);
    setMentionQuery(null);
    setTimeout(() => {
      input.focus();
      const newPos = atIdx + user.prenom.length + 2;
      input.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const mentionSuggestions =
    mentionQuery !== null
      ? users
          .filter((u) => u.fc !== currentFc)
          .filter((u) =>
            mentionQuery === ""
              ? true
              : u.prenom.toLowerCase().startsWith(mentionQuery.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  return (
    <div className="bg-white border-t border-slate-200 p-3 shrink-0 relative">
      {/* Dropdown mentions */}
      {mentionSuggestions.length > 0 && (
        <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 max-h-56 overflow-y-auto z-20">
          <div className="px-3 py-1 text-[10px] text-slate-500 uppercase tracking-wide font-bold border-b border-slate-100">
            <AtSign size={10} className="inline -mt-0.5 mr-1" />
            Mentionner un membre
          </div>
          {mentionSuggestions.map((u) => (
            <button
              key={u.fc}
              onClick={() => selectMention(u)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-50 text-left"
            >
              <div
                className={`w-6 h-6 rounded-full ${colorForUser(u.fc)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
              >
                {u.prenom.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-semibold text-sm text-slate-800">
                {u.prenom}
              </span>
              {u.role && <RoleBadge role={u.role} compact />}
            </button>
          ))}
        </div>
      )}

      {!notificationsEnabled && (
        <div className="mb-2 text-xs text-slate-500 flex items-center gap-1.5">
          <BellOff size={12} />
          <button
            onClick={onRequestNotifications}
            className="underline hover:text-orange-600"
          >
            Activer les notifications pour être alerté
          </button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoPick}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="shrink-0 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Envoyer une photo"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera size={18} />
          )}
        </button>
        <input
          ref={textInputRef}
          type="text"
          value={newMessage}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setMentionQuery(null);
            } else if (e.key === "Enter" && !e.shiftKey) {
              if (mentionSuggestions.length > 0) {
                e.preventDefault();
                selectMention(mentionSuggestions[0]);
                return;
              }
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={
            disabled
              ? "Chat bloqué par l'admin"
              : "Tapez votre message... (@ pour mentionner)"
          }
          disabled={disabled}
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-slate-100 disabled:text-slate-400 min-w-0"
        />
        <button
          onClick={onSend}
          disabled={!newMessage.trim() || sending || disabled}
          className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition flex items-center justify-center shadow-md shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// ========================================================================
// SIDEBAR (Classement)
// ========================================================================
function Sidebar({ leaderboard, currentFc, open, onClose, userStatuses }) {
  const content = (
    <>
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-orange-600" />
          <h2 className="text-sm font-bold text-slate-700">Équipe du jour</h2>
        </div>
        <button onClick={onClose} className="md:hidden p-1 hover:bg-slate-100 rounded">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {leaderboard.length === 0 ? (
          <div className="p-4 text-sm text-slate-400">Aucun membre pour le moment.</div>
        ) : (
          leaderboard.map((u, idx) => {
            const isMe = u.fc === currentFc;
            const isPodium = idx < 3 && u.todayPoints > 0;
            const medal = ["🥇", "🥈", "🥉"][idx];
            const status = userStatuses?.[u.fc];
            const statusId = status?.status || "available";
            const statusData = getStatus(statusId);
            return (
              <div
                key={u.fc}
                className={`px-3 py-2.5 flex items-center gap-2 border-b border-slate-100 ${
                  isMe ? "bg-orange-50" : ""
                }`}
              >
                <div className="w-5 text-center text-sm shrink-0">
                  {isPodium ? (
                    medal
                  ) : (
                    <span className="text-slate-400 text-[10px] font-bold">
                      #{idx + 1}
                    </span>
                  )}
                </div>
                <div className="relative shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full ${colorForUser(u.fc)} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {u.prenom.slice(0, 2).toUpperCase()}
                  </div>
                  {/* Pastille statut */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${STATUS_DOT_COLORS[statusId]}`}
                    title={statusData.label}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span
                      className={`text-sm truncate ${
                        isMe ? "font-bold text-orange-700" : "font-semibold text-slate-800"
                      }`}
                    >
                      {u.prenom}
                    </span>
                    <RoleBadge role={u.role} compact />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <span>{statusData.label}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-black ${u.todayPoints < 0 ? "text-red-500" : "text-orange-600"}`}
                  >
                    {u.todayPoints}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {u.points} tot.
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0">
        {content}
      </aside>
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="bg-black/40 flex-1" onClick={onClose} />
          <aside className="w-72 bg-white flex flex-col shadow-xl">{content}</aside>
        </div>
      )}
    </>
  );
}

// ========================================================================
// TOAST
// ========================================================================
function Toast({ toast }) {
  if (toast.type === "achievement") {
    return (
      <div className="pointer-events-auto bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[260px] animate-slide-in">
        <div className="text-2xl">{toast.emoji}</div>
        <div className="flex-1">
          <div className="font-bold text-sm flex items-center gap-1">
            <PartyPopper size={14} /> Bravo {toast.prenom} !
          </div>
          <div className="text-xs text-white/90">a réalisé un {toast.label}</div>
        </div>
      </div>
    );
  }
  if (toast.type === "self_achievement") {
    const isAmount = toast.interactionType === "amount";
    return (
      <div className="pointer-events-auto bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2 animate-slide-in">
        <PartyPopper size={18} />
        <div className="font-bold text-sm">
          {isAmount
            ? `${formatMoney(toast.amount)} (${toast.label})`
            : `+${toast.points} pts (${toast.label})`}
        </div>
      </div>
    );
  }
  if (toast.type === "reminder") {
    return (
      <div className="pointer-events-auto bg-amber-500 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2 max-w-sm animate-slide-in">
        <Megaphone size={18} />
        <div className="text-sm">
          <div className="font-bold">Rappel</div>
          <div className="text-xs text-white/90 line-clamp-2">{toast.text}</div>
        </div>
      </div>
    );
  }
  if (toast.type === "zone_alert") {
    return (
      <div className="pointer-events-auto bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[280px] animate-slide-in">
        <div className="text-3xl">{toast.zoneEmoji}</div>
        <div className="flex-1">
          <div className="font-bold text-sm flex items-center gap-1">
            <Zap size={14} /> Clients en attente
          </div>
          <div className="text-xs text-white/90">
            <strong>{toast.zoneLabel}</strong> • par {toast.prenom}
          </div>
        </div>
      </div>
    );
  }
  if (toast.type === "mention") {
    return (
      <div className="pointer-events-auto bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[280px] animate-slide-in ring-2 ring-orange-300">
        <AtSign size={20} />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">
            {toast.prenom} vous mentionne
          </div>
          <div className="text-xs text-white/90 line-clamp-2">
            {toast.text || "(pas de texte)"}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ========================================================================
// ACTION BAR (Zone + Sortie produit)
// ========================================================================
function ActionBar({ onZoneClick, onPickupClick, disabled }) {
  return (
    <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 px-3 sm:px-4 py-2.5 shrink-0">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onZoneClick}
          disabled={disabled}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 disabled:cursor-not-allowed text-sm"
        >
          <Zap size={16} className="animate-pulse" />
          <span>Clients en attente</span>
        </button>
        <button
          onClick={onPickupClick}
          disabled={disabled}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 disabled:cursor-not-allowed text-sm"
        >
          <Package size={16} />
          <span>Délivrance caisse</span>
        </button>
      </div>
    </div>
  );
}

// ========================================================================
// ZONE ALERT BUTTON (legacy, kept for internal refs)
// ========================================================================
function ZoneAlertButton({ onClick, disabled }) {
  return (
    <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 px-3 sm:px-4 py-2.5 shrink-0">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
      >
        <Zap size={18} className="animate-pulse" />
        <span>Clients en attente — alerter l'équipe</span>
      </button>
    </div>
  );
}

// ========================================================================
// AMOUNT INPUT MODAL (for PO and other amount-type interactions)
// ========================================================================
function AmountInputModal({ interaction, onSubmit, onClose }) {
  const [amount, setAmount] = useState("");
  const [isCancel, setIsCancel] = useState(false);
  const [reason, setReason] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleValidate = () => {
    const n = parseFloat(amount.replace(",", "."));
    if (!isNaN(n) && n > 0) {
      // En mode annulation, on envoie un montant négatif + le motif
      const finalAmount = isCancel ? -Math.abs(n) : Math.abs(n);
      onSubmit(finalAmount, isCancel ? reason.trim() : "");
    }
  };

  const headerGradient = isCancel
    ? "from-red-500 to-red-700"
    : "from-orange-500 to-orange-600";
  const btnGradient = isCancel
    ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
    : "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`bg-gradient-to-r ${headerGradient} text-white px-5 py-3 flex items-center gap-2 transition`}
        >
          <div className="text-2xl">
            {isCancel ? "↩️" : interaction.emoji}
          </div>
          <h2 className="font-bold text-lg flex-1">
            {isCancel ? `Annulation ${interaction.label}` : interaction.label}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          {/* Toggle mode */}
          <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setIsCancel(false)}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                !isCancel
                  ? "bg-white shadow-sm text-orange-600"
                  : "text-slate-600"
              }`}
            >
              ✅ Vente
            </button>
            <button
              onClick={() => setIsCancel(true)}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                isCancel ? "bg-white shadow-sm text-red-600" : "text-slate-600"
              }`}
            >
              ↩️ Annulation
            </button>
          </div>

          {isCancel && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-800 mb-3 flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <div>
                Le montant sera <strong>déduit</strong> de votre CA du jour.
                Saisissez le montant de la vente à annuler en positif, il sera
                converti automatiquement.
              </div>
            </div>
          )}

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Montant {interaction.unit ? `(${interaction.unit})` : ""}
          </label>
          <div className="relative">
            <Euro
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
              }
              onKeyDown={(e) => e.key === "Enter" && handleValidate()}
              className={`w-full pl-10 pr-3 py-3 text-xl font-bold border-2 rounded-lg outline-none ${
                isCancel
                  ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="0"
            />
          </div>
          {isCancel && amount && (
            <p className="text-sm text-red-700 font-bold mt-1">
              → Impact : −{parseFloat(amount.replace(",", ".")) || 0} €
            </p>
          )}

          {isCancel && (
            <div className="mt-3">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Motif de l'annulation (facultatif)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex : rétractation, erreur de saisie, avoir..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
          )}

          {!isCancel && (
            <p className="text-xs text-slate-500 mt-2">
              Saisissez le CA HT réalisé sur cette vente
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              disabled={!amount || isNaN(parseFloat(amount.replace(",", ".")))}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${btnGradient} disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed`}
            >
              {isCancel ? "Enregistrer l'annulation" : "Valider"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// ZONE SELECTOR MODAL
// ========================================================================
function ZoneSelectorModal({ zones, onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-3 flex items-center gap-2">
          <Zap size={20} />
          <h2 className="font-bold text-lg flex-1">Clients en attente</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <p className="text-sm text-slate-500 mb-3">
            Sélectionnez la zone où des clients attendent. L'équipe sera
            immédiatement alertée.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {zones.map((z) => (
              <button
                key={z.id}
                onClick={() => onSelect(z)}
                className="bg-white hover:bg-red-50 border-2 border-slate-200 hover:border-red-400 rounded-xl p-3 transition hover:shadow-md flex flex-col items-center gap-1.5 text-center"
              >
                <div className="text-3xl">{z.emoji}</div>
                <div className="text-sm font-semibold text-slate-800 leading-tight">
                  {z.label}
                </div>
              </button>
            ))}
          </div>
          {zones.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4">
              Aucune zone configurée. L'admin peut en ajouter via le panneau.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


// ========================================================================
// HISTORY PANEL — visible par tous
// ========================================================================
function HistoryPanel({ messages, currentFc, isAdmin, onTakeZone, onReleaseZone, onDelete, onClose }) {
  const [filter, setFilter] = useState("alerts_pending");

  const alertsAll = messages.filter((m) => m.type === "zone_alert");
  const alertsPending = alertsAll.filter((m) => !m.takenBy);
  const alertsTaken = alertsAll.filter((m) => !!m.takenBy);
  const achievements = messages.filter((m) => m.type === "achievement");
  const regularMsgs = messages.filter((m) => m.type === "message");

  let filtered;
  if (filter === "all") filtered = messages;
  else if (filter === "alerts_pending") filtered = alertsPending;
  else if (filter === "alerts_taken") filtered = alertsTaken;
  else if (filter === "achievements") filtered = achievements;
  else filtered = regularMsgs;

  // Plus récent en premier
  filtered = [...filtered].sort((a, b) => b.timestamp - a.timestamp);

  const tabs = [
    {
      id: "alerts_pending",
      label: "En attente",
      count: alertsPending.length,
      cls: "red",
    },
    {
      id: "alerts_taken",
      label: "Prises",
      count: alertsTaken.length,
      cls: "emerald",
    },
    {
      id: "achievements",
      label: "Ventes",
      count: achievements.length,
      cls: "orange",
    },
    {
      id: "messages",
      label: "Messages",
      count: regularMsgs.length,
      cls: "slate",
    },
    { id: "all", label: "Tout", count: messages.length, cls: "indigo" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={20} />
            <h2 className="font-bold text-lg">Historique complet</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Résumé en bandeau */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-sm shrink-0">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-bold text-red-600">{alertsPending.length}</span>
            <span className="text-slate-600">en attente</span>
          </div>
          <div className="text-slate-300">•</div>
          <div className="flex items-center gap-1.5 text-sm shrink-0">
            <Check size={12} className="text-emerald-600" />
            <span className="font-bold text-emerald-600">{alertsTaken.length}</span>
            <span className="text-slate-600">traitées</span>
          </div>
          <div className="text-slate-300">•</div>
          <div className="flex items-center gap-1.5 text-sm shrink-0">
            <PartyPopper size={12} className="text-orange-600" />
            <span className="font-bold text-orange-600">{achievements.length}</span>
            <span className="text-slate-600">ventes</span>
          </div>
        </div>

        {/* Onglets filtres */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
                filter === t.id
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  filter === t.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <div className="mb-2 opacity-40">
                {filter === "alerts_pending" ? (
                  <Check size={32} className="mx-auto" />
                ) : (
                  <Clock size={32} className="mx-auto" />
                )}
              </div>
              {filter === "alerts_pending"
                ? "Aucune alerte en attente 🎉"
                : "Aucun élément à afficher."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((m) => (
                <HistoryItem
                  key={m._key || `${m.timestamp}-${m.fc}`}
                  msg={m}
                  currentFc={currentFc}
                  isAdmin={isAdmin}
                  onTakeZone={onTakeZone}
                  onReleaseZone={onReleaseZone}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// HISTORY ITEM
// ========================================================================
function HistoryItem({ msg, currentFc, isAdmin, onTakeZone, onReleaseZone, onDelete }) {
  const when = `${formatDay(msg.timestamp)} ${formatTime(msg.timestamp)}`;

  // Zone alert
  if (msg.type === "zone_alert") {
    const taken = !!msg.takenBy;
    const takenByMe = msg.takenBy === currentFc;
    const waitMs = taken
      ? msg.takenAt - msg.timestamp
      : Date.now() - msg.timestamp;
    const waitMin = Math.round(waitMs / 60000);
    return (
      <div
        className={`rounded-xl p-3 border-2 ${
          taken
            ? "bg-white border-emerald-200"
            : "bg-red-50 border-red-300 animate-pulse-slow"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">{msg.zoneEmoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-slate-800">{msg.zoneLabel}</span>
              {taken ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                  <Check size={10} /> Prise
                </span>
              ) : (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                  <Clock size={10} /> {waitMin} min
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mb-1">
              Signalé par <strong>{msg.prenom}</strong> • {when}
            </div>
            {taken && (
              <div className="text-xs text-emerald-700 font-medium">
                Pris par {msg.takenByPrenom}
                {takenByMe ? " (vous)" : ""} à{" "}
                {formatTime(msg.takenAt)}{" "}
                <span className="text-slate-500">({waitMin} min d'attente)</span>
              </div>
            )}
            {!taken && msg.releasedByPrenom && (
              <div className="text-[11px] text-amber-700 italic mt-0.5">
                ↺ Libéré par {msg.releasedByPrenom} à{" "}
                {formatTime(msg.releasedAt)}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            {!taken && (
              <button
                onClick={() => onTakeZone(msg)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
              >
                <Hand size={12} />
                Prendre
              </button>
            )}
            {taken && (takenByMe || isAdmin) && onReleaseZone && (
              <button
                onClick={() => {
                  onReleaseZone(msg);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2 py-1.5 rounded-lg transition flex items-center gap-1"
                title="Libérer"
              >
                <X size={12} />
                Libérer
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => onDelete(msg)}
                className="text-red-400 hover:text-red-600 text-xs p-1"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Achievement
  if (msg.type === "achievement") {
    const isAmount = msg.interactionType === "amount";
    return (
      <div className="bg-white rounded-xl p-3 border border-orange-200 flex items-start gap-3">
        <div className="text-2xl">{msg.interactionEmoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-800">{msg.prenom}</span>
            <span className="text-xs text-slate-500">a réalisé</span>
            <span className="font-bold text-orange-600">{msg.interactionLabel}</span>
            {isAmount && msg.amount > 0 && (
              <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {formatMoney(msg.amount)}
              </span>
            )}
            {!isAmount && msg.points > 0 && (
              <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                +{msg.points} pts
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{when}</div>
        </div>
        {(msg.reactions || []).length > 0 && (
          <div className="flex items-center gap-0.5 text-xs text-slate-500 shrink-0">
            <Heart size={10} fill="currentColor" className="text-rose-500" />
            {msg.reactions.length}
          </div>
        )}
        {isAdmin && (
          <button
            onClick={() => onDelete(msg)}
            className="text-slate-400 hover:text-red-500 p-1 shrink-0"
            title="Supprimer"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    );
  }

  // Admin reminder
  if (msg.type === "admin_reminder") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <Megaphone size={16} className="text-amber-700 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-amber-700 font-bold mb-0.5">
            Rappel de {msg.prenom}
          </div>
          <p className="text-sm text-slate-800">{msg.text}</p>
          <div className="text-xs text-slate-500 mt-0.5">{when}</div>
        </div>
      </div>
    );
  }

  // Message normal
  const isOwn = msg.fc === currentFc;
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-start gap-2">
      <div
        className={`w-7 h-7 rounded-full ${colorForUser(msg.fc)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
      >
        {(msg.prenom || msg.fc).slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-800 text-sm">
            {msg.prenom}
            {isOwn && <span className="text-slate-400 font-normal"> (vous)</span>}
          </span>
          <span className="text-xs text-slate-500">{when}</span>
        </div>
        <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap break-words">
          {msg.text}
        </p>
      </div>
      {isAdmin && (
        <button
          onClick={() => onDelete(msg)}
          className="text-slate-400 hover:text-red-500 p-1 shrink-0"
          title="Supprimer"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}

// ========================================================================
// MISSIONS PANEL — visible par tous
// ========================================================================
function MissionsPanel({
  missions,
  currentUser,
  isAdmin,
  onClaim,
  onComplete,
  onValidate,
  onFail,
  onDelete,
  onCreate,
  onClose,
}) {
  const [filter, setFilter] = useState("available");
  const [showCreate, setShowCreate] = useState(false);

  const available = missions.filter((m) => m.status === "open");
  const mine = missions.filter(
    (m) => m.claimedBy === currentUser.fc && ["claimed", "completed"].includes(m.status),
  );
  const toValidate = missions.filter((m) => m.status === "completed");
  const history = missions.filter((m) =>
    ["validated", "failed"].includes(m.status),
  );

  let filtered;
  if (filter === "available") filtered = available;
  else if (filter === "mine") filtered = mine;
  else if (filter === "validate") filtered = toValidate;
  else filtered = history;

  const tabs = [
    { id: "available", label: "À prendre", count: available.length },
    { id: "mine", label: "Mes missions", count: mine.length },
    ...(isAdmin
      ? [{ id: "validate", label: "À valider", count: toValidate.length }]
      : []),
    { id: "history", label: "Terminées", count: history.length },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={20} />
            <h2 className="font-bold text-lg">Missions</h2>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowCreate(true)}
                className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
              >
                <Plus size={14} />
                Nouvelle
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
                filter === t.id
                  ? "border-purple-600 text-purple-600 bg-purple-50"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  filter === t.id
                    ? "bg-purple-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Target size={32} className="mx-auto mb-2 opacity-40" />
              {filter === "available"
                ? "Aucune mission disponible. L'admin peut en créer."
                : filter === "mine"
                  ? "Aucune mission en cours. Prenez-en une dans l'onglet 'À prendre'."
                  : filter === "validate"
                    ? "Aucune mission à valider."
                    : "Aucune mission terminée."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((m) => (
                <MissionCard
                  key={m._key || m.id}
                  mission={m}
                  currentUser={currentUser}
                  isAdmin={isAdmin}
                  onClaim={onClaim}
                  onComplete={onComplete}
                  onValidate={onValidate}
                  onFail={onFail}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>

        {showCreate && (
          <MissionCreateModal
            onCreate={async (m) => {
              await onCreate(m);
              setShowCreate(false);
            }}
            onClose={() => setShowCreate(false)}
          />
        )}
      </div>
    </div>
  );
}

// ========================================================================
// MISSION CARD
// ========================================================================
function MissionCard({
  mission,
  currentUser,
  isAdmin,
  onClaim,
  onComplete,
  onValidate,
  onFail,
  onDelete,
}) {
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofPhotoLightbox, setProofPhotoLightbox] = useState(false);
  const [confirmFailOpen, setConfirmFailOpen] = useState(false);
  const statusColor = {
    open: "bg-purple-50 border-purple-200",
    claimed: "bg-blue-50 border-blue-200",
    completed: "bg-amber-50 border-amber-300",
    validated: "bg-emerald-50 border-emerald-200",
    failed: "bg-red-50 border-red-200",
  }[mission.status];

  const statusLabel = {
    open: "À prendre",
    claimed: "En cours",
    completed: "Terminée — à valider",
    validated: "Validée",
    failed: "Non réalisée",
  }[mission.status];

  const statusIcon = {
    open: <Target size={12} />,
    claimed: <Clock size={12} />,
    completed: <CheckCircle2 size={12} />,
    validated: <CheckCircle2 size={12} />,
    failed: <XCircle size={12} />,
  }[mission.status];

  const statusTextColor = {
    open: "text-purple-700",
    claimed: "text-blue-700",
    completed: "text-amber-700",
    validated: "text-emerald-700",
    failed: "text-red-700",
  }[mission.status];

  const isMine = mission.claimedBy === currentUser.fc;

  return (
    <div className={`rounded-xl p-3 border-2 ${statusColor}`}>
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 bg-white ${statusTextColor}`}
            >
              {statusIcon} {statusLabel}
            </span>
            <span className="text-[10px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Star size={10} /> +{mission.rewardPoints} pts
            </span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{mission.title}</h4>
          {mission.description && (
            <p className="text-xs text-slate-600 mt-0.5">{mission.description}</p>
          )}
          {mission.claimedByPrenom && (
            <p className="text-xs text-slate-500 mt-1">
              Prise par <strong>{mission.claimedByPrenom}</strong>
              {isMine ? " (vous)" : ""}
            </p>
          )}
          {mission.proofPhotoUrl && (
            <button
              type="button"
              onClick={() => setProofPhotoLightbox(true)}
              className="mt-2 relative rounded-lg overflow-hidden border-2 border-amber-300 hover:border-amber-500 transition group"
              style={{ maxWidth: "200px" }}
            >
              <img
                src={mission.proofPhotoUrl}
                alt="Preuve de réalisation"
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                <Maximize2
                  size={18}
                  className="text-white opacity-0 group-hover:opacity-100 transition"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                <span className="text-[10px] text-white font-semibold flex items-center gap-1">
                  <Camera size={10} /> Preuve
                </span>
              </div>
            </button>
          )}
        </div>
        {isAdmin && mission.status === "open" && (
          <button
            onClick={() => onDelete(mission)}
            className="text-slate-400 hover:text-red-500 p-1 shrink-0"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        {mission.status === "open" && (
          <button
            onClick={() => onClaim(mission)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-2 rounded-lg transition flex items-center justify-center gap-1.5"
          >
            <Hand size={14} />
            Je la prends
          </button>
        )}
        {mission.status === "claimed" && isMine && (
          <button
            onClick={() => setProofModalOpen(true)}
            className={`flex-1 font-bold text-sm py-2 rounded-lg transition flex items-center justify-center gap-1.5 text-white ${
              mission.rejections > 0
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            <Camera size={14} />
            {mission.rejections > 0
              ? `Refaire — 2e refus = −${PENALTY_MISSION_FAIL_SECOND} pts`
              : "J'ai terminé (photo)"}
          </button>
        )}
        {mission.status === "completed" && isAdmin && (
          <>
            <button
              onClick={() => onValidate(mission)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-2 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              Valider (+{mission.rewardPoints})
            </button>
            <button
              onClick={() => setConfirmFailOpen(true)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-2 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <XCircle size={14} />
              {(mission.rejections || 0) >= 1
                ? `Refuser (2e : −${PENALTY_MISSION_FAIL_SECOND} pts)`
                : "Refuser (à refaire)"}
            </button>
          </>
        )}
        {mission.status === "claimed" && isAdmin && !isMine && (
          <button
            onClick={() => onFail(mission)}
            className="text-xs text-red-600 hover:underline"
          >
            Annuler / mal réalisée
          </button>
        )}
      </div>

      {/* Modale de capture de preuve */}
      {proofModalOpen && (
        <MissionProofModal
          mission={mission}
          onConfirm={async (photoUrl) => {
            await onComplete(mission, photoUrl);
            setProofModalOpen(false);
          }}
          onClose={() => setProofModalOpen(false)}
        />
      )}

      {/* Lightbox pour voir la photo en grand */}
      {proofPhotoLightbox && mission.proofPhotoUrl && (
        <PhotoLightbox
          src={mission.proofPhotoUrl}
          onClose={() => setProofPhotoLightbox(false)}
        />
      )}

      {/* Confirmation refus (remplace confirm() natif qui est bloqué dans les artefacts) */}
      {confirmFailOpen && (
        <ConfirmModal
          icon={<XCircle size={28} className="text-red-600" />}
          title={
            (mission.rejections || 0) >= 1
              ? "Refuser (2e fois) ?"
              : "Refuser la mission ?"
          }
          message={
            (mission.rejections || 0) >= 1 ? (
              <>
                <strong>⚠ 2ème refus</strong>
                <br />
                {mission.claimedByPrenom} perdra{" "}
                <strong>{PENALTY_MISSION_FAIL_SECOND} points</strong> et la
                mission sera close définitivement.
              </>
            ) : (
              <>
                <strong>1er refus</strong>
                <br />
                La mission repart chez{" "}
                <strong>{mission.claimedByPrenom}</strong> qui devra refaire
                une nouvelle photo. Pas de pénalité pour cette fois, mais au
                prochain refus, il perdra {PENALTY_MISSION_FAIL_SECOND} points.
              </>
            )
          }
          confirmLabel={
            (mission.rejections || 0) >= 1
              ? "Oui, refuser définitivement"
              : "Oui, faire refaire"
          }
          confirmTone="red"
          onConfirm={() => {
            onFail(mission);
            setConfirmFailOpen(false);
          }}
          onCancel={() => setConfirmFailOpen(false)}
        />
      )}
    </div>
  );
}

// ========================================================================
// CONFIRM MODAL — remplace confirm() natif (bloqué dans les artefacts)
// ========================================================================
function ConfirmModal({
  icon,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  confirmTone = "red", // red | orange | emerald
  onConfirm,
  onCancel,
}) {
  const toneClasses = {
    red: "bg-red-500 hover:bg-red-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    emerald: "bg-emerald-500 hover:bg-emerald-600",
  };
  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 text-center">
          {icon && (
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              {icon}
            </div>
          )}
          <h3 className="font-bold text-lg text-slate-800 mb-1">{title}</h3>
          <div className="text-sm text-slate-600">{message}</div>
        </div>
        <div className="p-3 bg-slate-50 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white font-bold rounded-lg ${toneClasses[confirmTone] || toneClasses.red}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// MISSION PROOF MODAL — Capture photo pour valider la fin de mission
// ========================================================================
function MissionProofModal({ mission, onConfirm, onClose }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [capturing, setCapturing] = useState(false);
  const photoInputRef = useRef(null);

  const handleCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturing(true);
    try {
      const dataUrl = await compressImage(file, 1200, 0.75);
      setPhotoUrl(dataUrl);
    } catch (err) {
      console.error("Erreur compression photo preuve:", err);
    }
    setCapturing(false);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 flex items-center gap-2">
          <Camera size={20} />
          <h2 className="font-bold text-lg flex-1">Preuve de réalisation</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800 flex items-start gap-2">
            <span className="text-base">📸</span>
            <div>
              Prenez une photo qui prouve que la mission est bien terminée.{" "}
              <strong>L'admin validera ensuite</strong> et vous attribuera vos
              points.
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 text-sm">
            <div className="font-bold text-slate-800">{mission.title}</div>
            {mission.description && (
              <div className="text-xs text-slate-600 mt-0.5">
                {mission.description}
              </div>
            )}
            <div className="text-[10px] text-purple-700 font-bold mt-1">
              +{mission.rewardPoints} pts à la validation
            </div>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            className="hidden"
          />

          {photoUrl ? (
            <div className="relative rounded-lg overflow-hidden border-2 border-amber-400">
              <img
                src={photoUrl}
                alt="Preuve"
                className="w-full max-h-64 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-md"
                  title="Reprendre"
                >
                  <Camera size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-full shadow-md"
                  title="Supprimer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={capturing}
              className="w-full bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-2 border-dashed border-amber-400 text-amber-700 py-6 rounded-lg font-semibold flex flex-col items-center gap-1.5 disabled:opacity-50"
            >
              {capturing ? (
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={28} />
              )}
              <span>
                {capturing ? "Traitement..." : "Prendre la photo"}
              </span>
            </button>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={() => onConfirm(photoUrl)}
              disabled={!photoUrl}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-lg disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              Envoyer pour validation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// MISSION CREATE MODAL (admin)
// ========================================================================
function MissionCreateModal({ onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(5);

  const canSubmit = title.trim().length >= 3 && points > 0;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-3 flex items-center gap-2">
          <Plus size={20} />
          <h2 className="font-bold text-lg flex-1">Nouvelle mission</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Titre
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Ranger le rayon TV"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description (facultatif)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Détails de la mission..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Points à gagner
            </label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={() => onCreate({ title: title.trim(), description: description.trim(), rewardPoints: points })}
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// REWARDS BOARD — visible par tous
// ========================================================================
function RewardsBoard({
  users,
  currentFc,
  pointsByUser,
  rewards,
  missions,
  penalties,
  messages,
  onClose,
}) {
  const sortedRewards = [...rewards].sort((a, b) => a.threshold - b.threshold);

  const leaderboard = [...users]
    .map((u) => ({
      ...u,
      points: pointsByUser[u.fc] || 0,
      achievements: messages.filter(
        (m) => m.type === "achievement" && m.fc === u.fc,
      ).length,
      validatedMissions: missions.filter(
        (m) => m.claimedBy === u.fc && m.status === "validated",
      ).length,
      failedMissions: missions.filter(
        (m) => m.claimedBy === u.fc && m.status === "failed",
      ).length,
      penalties: penalties.filter((p) => p.fc === u.fc).length,
    }))
    .sort((a, b) => b.points - a.points);

  const mePoints = pointsByUser[currentFc] || 0;
  const nextReward = sortedRewards.find((r) => mePoints < r.threshold);
  const currentReward = [...sortedRewards]
    .reverse()
    .find((r) => mePoints >= r.threshold);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift size={20} />
            <h2 className="font-bold text-lg">Récompenses de l'année</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Bandeau "ma position" */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-200 p-4">
            <div className="text-center">
              <p className="text-xs text-slate-600 mb-1">Votre total</p>
              <p className="text-4xl font-black text-orange-600 mb-1">
                {mePoints} pts
              </p>
              {currentReward ? (
                <div className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 shadow-sm border border-amber-200 mb-2">
                  <span className="text-xl">{currentReward.emoji}</span>
                  <span className="font-bold text-slate-800">
                    Palier {currentReward.label} atteint
                  </span>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic mb-2">
                  Aucun palier atteint pour l'instant
                </p>
              )}
              {nextReward && (
                <div className="max-w-xs mx-auto">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>
                      Prochain : <strong>{nextReward.label}</strong>{" "}
                      {nextReward.emoji}
                    </span>
                    <span className="font-bold text-orange-600">
                      {nextReward.threshold - mePoints} pts restants
                    </span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                      style={{
                        width: `${Math.min(100, (mePoints / nextReward.threshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Paliers */}
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
              <Gift size={14} /> Paliers de récompenses
            </h3>
            <div className="space-y-2">
              {sortedRewards.map((r) => {
                const reached = mePoints >= r.threshold;
                return (
                  <div
                    key={r.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                      reached
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="text-3xl">{r.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">
                          {r.label}
                        </span>
                        {reached && (
                          <CheckCircle2
                            size={14}
                            className="text-emerald-600"
                          />
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{r.reward}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">À partir de</p>
                      <p className="font-black text-orange-600">
                        {r.threshold} pts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Classement annuel */}
          <div className="p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
              <Trophy size={14} /> Classement annuel
            </h3>
            <div className="space-y-1.5">
              {leaderboard.map((u, idx) => {
                const userReward = [...sortedRewards]
                  .reverse()
                  .find((r) => u.points >= r.threshold);
                const isMe = u.fc === currentFc;
                const podium = ["🥇", "🥈", "🥉"][idx];
                return (
                  <div
                    key={u.fc}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                      isMe
                        ? "bg-orange-50 border-orange-300"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="w-7 text-center text-base shrink-0">
                      {podium || (
                        <span className="text-slate-400 text-xs font-bold">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold text-sm truncate ${isMe ? "text-orange-700" : "text-slate-800"}`}
                        >
                          {u.prenom}
                          {isMe && (
                            <span className="text-slate-400 font-normal ml-1">
                              (vous)
                            </span>
                          )}
                        </span>
                        {u.isAdmin && (
                          <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1 rounded">
                            ADMIN
                          </span>
                        )}
                        {userReward && (
                          <span className="text-sm" title={userReward.label}>
                            {userReward.emoji}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{u.achievements} ventes</span>
                        {u.validatedMissions > 0 && (
                          <span className="text-emerald-600">
                            +{u.validatedMissions} missions
                          </span>
                        )}
                        {u.penalties > 0 && (
                          <span className="text-red-500">
                            −{u.penalties} pénalités
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={`font-black text-lg ${u.points >= 0 ? "text-orange-600" : "text-red-500"}`}
                      >
                        {u.points}
                      </div>
                      <div className="text-[10px] text-slate-400">pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// PINNED BANNER
// ========================================================================
function PinnedBanner({ pin, isAdmin, onUnpin }) {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-yellow-950 px-4 py-2 flex items-center gap-2 text-sm shadow border-b-2 border-yellow-600">
      <Pin size={16} className="shrink-0 fill-current" />
      <span className="font-bold shrink-0">Épinglé :</span>
      <span className="truncate flex-1">{pin.text}</span>
      <span className="text-xs opacity-70 shrink-0 hidden sm:inline">
        — {pin.by}
      </span>
      {isAdmin && (
        <button
          onClick={onUnpin}
          className="p-1 hover:bg-black/10 rounded shrink-0"
          title="Retirer l'annonce"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ========================================================================
// PIN MODAL (admin)
// ========================================================================
function PinModal({ currentPin, onPin, onClose }) {
  const [text, setText] = useState(currentPin?.text || "");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-5 py-3 flex items-center gap-2">
          <Pin size={20} />
          <h2 className="font-bold text-lg flex-1">Annonce épinglée</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-slate-600">
            L'annonce s'affichera en bandeau jaune en haut du chat pour toute
            l'équipe jusqu'à ce qu'elle soit retirée.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Ex : Formation produit à 14h en salle 2"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={() => onPin(text)}
              disabled={!text.trim()}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Pin size={16} />
              Épingler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// PHOTO LIGHTBOX (afficher une photo en plein écran)
// ========================================================================
function PhotoLightbox({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt="Photo"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ========================================================================
// PICKUP DESTINATIONS
// ========================================================================
const PICKUP_DESTINATIONS = [
  { id: "comptoir", label: "Comptoir retrait", emoji: "🛒" },
  { id: "caisse", label: "Caisse", emoji: "💶" },
  { id: "client", label: "Remise client direct", emoji: "🤝" },
  { id: "livraison", label: "Zone livraison", emoji: "🚚" },
];

// ========================================================================
// PICKUP CREATE MODAL
// ========================================================================
function PickupCreateModal({ onCreate, onClose }) {
  const [product, setProduct] = useState("");
  const [reference, setReference] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoicePhotoUrl, setInvoicePhotoUrl] = useState("");
  const [productPhotoUrl, setProductPhotoUrl] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [capturingProduct, setCapturingProduct] = useState(false);
  const [destination, setDestination] = useState("comptoir");
  const [urgency, setUrgency] = useState("normal");
  const [notes, setNotes] = useState("");
  const photoInputRef = useRef(null);
  const productPhotoRef = useRef(null);

  // On peut soumettre dès qu'il y a au moins une info (produit, photo, facture ou notes)
  const canSubmit =
    product.trim().length > 0 ||
    invoicePhotoUrl ||
    productPhotoUrl ||
    invoiceNumber.trim().length > 0;

  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturing(true);
    try {
      const dataUrl = await compressImage(file, 1200, 0.75);
      setInvoicePhotoUrl(dataUrl);
    } catch (err) {
      console.error("Compression photo facture:", err);
    }
    setCapturing(false);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleProductPhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturingProduct(true);
    try {
      const dataUrl = await compressImage(file, 1200, 0.75);
      setProductPhotoUrl(dataUrl);
    } catch (err) {
      console.error("Compression photo produit:", err);
    }
    setCapturingProduct(false);
    if (productPhotoRef.current) productPhotoRef.current.value = "";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-3 flex items-center gap-2">
          <Package size={20} />
          <h2 className="font-bold text-lg flex-1">Demande de délivrance caisse</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          {/* Photo de la facture */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Photo de la facture{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
            {invoicePhotoUrl ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-purple-300">
                <img
                  src={invoicePhotoUrl}
                  alt="Facture"
                  className="w-full max-h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-md"
                    title="Reprendre"
                  >
                    <Camera size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoicePhotoUrl("")}
                    className="bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-full shadow-md"
                    title="Supprimer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={capturing}
                className="w-full bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-dashed border-purple-300 text-purple-700 py-4 rounded-lg font-semibold flex flex-col items-center gap-1 disabled:opacity-50"
              >
                {capturing ? (
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={22} />
                )}
                <span className="text-sm">
                  {capturing ? "Traitement..." : "Prendre une photo"}
                </span>
              </button>
            )}
          </div>

          {/* N° de facture (manuel) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              N° de facture{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="Ex : F-2024-00123"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
            />
          </div>

          {/* Photo du produit */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Photo du produit{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              ref={productPhotoRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleProductPhotoCapture}
              className="hidden"
            />
            {productPhotoUrl ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-indigo-300">
                <img
                  src={productPhotoUrl}
                  alt="Produit"
                  className="w-full max-h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => productPhotoRef.current?.click()}
                    className="bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-md"
                    title="Reprendre"
                  >
                    <Camera size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductPhotoUrl("")}
                    className="bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-full shadow-md"
                    title="Supprimer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => productPhotoRef.current?.click()}
                disabled={capturingProduct}
                className="w-full bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-2 border-dashed border-indigo-300 text-indigo-700 py-4 rounded-lg font-semibold flex flex-col items-center gap-1 disabled:opacity-50"
              >
                {capturingProduct ? (
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={22} />
                )}
                <span className="text-sm">
                  {capturingProduct ? "Traitement..." : "Prendre une photo"}
                </span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Produit{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ex : TV Samsung 65 QLED"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Référence / code produit{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex : QE65Q70D"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Destination
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PICKUP_DESTINATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDestination(d.id)}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border-2 text-sm font-semibold transition ${
                    destination === d.id
                      ? "bg-purple-100 text-purple-700 border-purple-500"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>{d.emoji}</span>
                  <span className="truncate">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Urgence
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setUrgency("normal")}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-semibold transition ${
                  urgency === "normal"
                    ? "bg-slate-100 text-slate-700 border-slate-400"
                    : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                Normale
              </button>
              <button
                type="button"
                onClick={() => setUrgency("urgent")}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-semibold transition flex items-center justify-center gap-1 ${
                  urgency === "urgent"
                    ? "bg-red-100 text-red-700 border-red-500"
                    : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                <Zap size={14} /> Urgent
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Notes{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Client attend depuis 10 min"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={() =>
                onCreate({
                  product: product.trim(),
                  reference: reference.trim(),
                  invoiceNumber: invoiceNumber.trim(),
                  invoicePhotoUrl: invoicePhotoUrl,
                  productPhotoUrl: productPhotoUrl,
                  destination,
                  urgency,
                  notes: notes.trim(),
                })
              }
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
            >
              Envoyer la demande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// PICKUPS PANEL
// ========================================================================
function PickupsPanel({
  pickups,
  currentUser,
  isAdmin,
  onTake,
  onReady,
  onConfirm,
  onCancel,
  onDelete,
  onCreateClick,
  onClose,
}) {
  const [filter, setFilter] = useState("active");

  const requested = pickups.filter((p) => p.status === "requested");
  const inPrep = pickups.filter((p) => p.status === "in_preparation");
  const ready = pickups.filter((p) => p.status === "ready");
  const active = [...requested, ...inPrep, ...ready].sort(
    (a, b) => a.createdAt - b.createdAt,
  );
  const done = pickups.filter((p) =>
    ["picked_up", "cancelled"].includes(p.status),
  );

  let filtered;
  if (filter === "active") filtered = active;
  else filtered = done;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={20} />
            <h2 className="font-bold text-lg">Délivrances caisse</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateClick}
              className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
            >
              <Plus size={14} />
              Nouvelle
            </button>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-sm shrink-0">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-bold text-red-600">{requested.length}</span>
            <span className="text-slate-600">à prendre</span>
          </div>
          <div className="text-slate-300">•</div>
          <div className="flex items-center gap-1.5 text-sm shrink-0">
            <Clock size={12} className="text-amber-600" />
            <span className="font-bold text-amber-600">{inPrep.length}</span>
            <span className="text-slate-600">en prépa</span>
          </div>
          <div className="text-slate-300">•</div>
          <div className="flex items-center gap-1.5 text-sm shrink-0">
            <PackageCheck size={12} className="text-emerald-600" />
            <span className="font-bold text-emerald-600">{ready.length}</span>
            <span className="text-slate-600">prêts</span>
          </div>
        </div>

        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setFilter("active")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "active"
                ? "border-purple-600 text-purple-600 bg-purple-50"
                : "border-transparent text-slate-600"
            }`}
          >
            En cours
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "active" ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {active.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "done"
                ? "border-purple-600 text-purple-600 bg-purple-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Terminées
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "done" ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {done.length}
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Package size={32} className="mx-auto mb-2 opacity-40" />
              {filter === "active"
                ? "Aucune sortie en cours 🎉"
                : "Aucune sortie terminée."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((p) => (
                <PickupCard
                  key={p._key || p.id}
                  pickup={p}
                  currentUser={currentUser}
                  isAdmin={isAdmin}
                  onTake={onTake}
                  onReady={onReady}
                  onConfirm={onConfirm}
                  onCancel={onCancel}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// PICKUP CARD
// ========================================================================
function PickupCard({
  pickup,
  currentUser,
  isAdmin,
  onTake,
  onReady,
  onConfirm,
  onCancel,
  onDelete,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [productLightboxOpen, setProductLightboxOpen] = useState(false);
  const dest = PICKUP_DESTINATIONS.find((d) => d.id === pickup.destination);
  const isRequester = pickup.createdBy === currentUser.fc;
  const isTaker = pickup.takenBy === currentUser.fc;
  const urgent = pickup.urgency === "urgent";

  const statusConfig = {
    requested: { cls: "bg-red-50 border-red-300", label: "À prendre", color: "red" },
    in_preparation: {
      cls: "bg-amber-50 border-amber-300",
      label: "En préparation",
      color: "amber",
    },
    ready: {
      cls: "bg-emerald-50 border-emerald-300",
      label: "PRÊT",
      color: "emerald",
    },
    picked_up: {
      cls: "bg-white border-slate-200 opacity-80",
      label: "Récupéré",
      color: "slate",
    },
    cancelled: {
      cls: "bg-slate-50 border-slate-200 opacity-70",
      label: "Annulé",
      color: "slate",
    },
  }[pickup.status];

  const statusColorMap = {
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div
      className={`rounded-xl p-3 border-2 ${statusConfig.cls} ${urgent && pickup.status === "requested" ? "animate-pulse-slow" : ""}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusColorMap[statusConfig.color]}`}
            >
              {statusConfig.label}
            </span>
            {urgent && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-0.5">
                <Zap size={10} /> URGENT
              </span>
            )}
            {dest && (
              <span className="text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {dest.emoji} {dest.label}
              </span>
            )}
            {pickup.takenByPrenom && pickup.status !== "requested" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-0.5">
                <Hand size={10} /> Pris par {pickup.takenByPrenom}
                {isTaker ? " (vous)" : ""}
              </span>
            )}
          </div>
          <h4 className="font-bold text-slate-800 text-sm leading-tight">
            {pickup.product || (
              <span className="italic text-slate-500 font-normal">
                Produit non précisé
              </span>
            )}
          </h4>
          {pickup.reference && (
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Réf. {pickup.reference}
            </p>
          )}
          {pickup.invoiceNumber && (
            <p className="text-xs text-purple-700 font-mono mt-0.5">
              Facture : {pickup.invoiceNumber}
            </p>
          )}
          {/* Photos : produit (demandeur) + facture */}
          {(pickup.productPhotoUrl || pickup.invoicePhotoUrl) && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {pickup.productPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setProductLightboxOpen(true)}
                  className="relative rounded-lg overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition group"
                  style={{ width: "110px", height: "90px" }}
                >
                  <img
                    src={pickup.productPhotoUrl}
                    alt="Produit"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <Maximize2
                      size={16}
                      className="text-white opacity-0 group-hover:opacity-100 transition"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-0.5">
                    <span className="text-[9px] text-white font-medium flex items-center gap-1">
                      📦 Produit
                    </span>
                  </div>
                </button>
              )}
              {pickup.invoicePhotoUrl && (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="relative rounded-lg overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition group"
                  style={{ width: "110px", height: "90px" }}
                >
                  <img
                    src={pickup.invoicePhotoUrl}
                    alt="Facture"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <Maximize2
                      size={16}
                      className="text-white opacity-0 group-hover:opacity-100 transition"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-0.5">
                    <span className="text-[9px] text-white font-medium flex items-center gap-1">
                      🧾 Facture
                    </span>
                  </div>
                </button>
              )}
            </div>
          )}
          {pickup.notes && (
            <p className="text-xs text-slate-600 mt-1 italic">📝 {pickup.notes}</p>
          )}
          <div className="text-[10px] text-slate-500 mt-1.5 space-y-0.5">
            <div>
              Demandé par <strong>{pickup.createdByPrenom}</strong>
              {isRequester && " (vous)"} à {formatTime(pickup.createdAt)}
            </div>
            {pickup.takenByPrenom && (
              <div className="text-amber-700">
                Pris par <strong>{pickup.takenByPrenom}</strong>
                {isTaker && " (vous)"} à {formatTime(pickup.takenAt)}
              </div>
            )}
            {pickup.readyAt && (
              <div className="text-emerald-700">
                ✓ Prêt à {formatTime(pickup.readyAt)}
              </div>
            )}
            {pickup.pickedUpAt && (
              <div className="text-slate-600">
                ✓ Récupéré à {formatTime(pickup.pickedUpAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {pickup.status === "requested" && (
          <>
            <button
              onClick={() => onTake(pickup)}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1"
            >
              <Hand size={12} />
              Je m'en occupe
            </button>
            {isRequester && (
              <button
                onClick={() => onCancel(pickup)}
                className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              >
                Annuler
              </button>
            )}
          </>
        )}
        {pickup.status === "in_preparation" && isTaker && (
          <button
            onClick={() => onReady(pickup)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1"
          >
            <PackageCheck size={12} />
            Marquer "Prêt à retirer"
          </button>
        )}
        {pickup.status === "ready" && (
          <button
            onClick={() => onConfirm(pickup)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1"
          >
            <CheckCircle2 size={12} />
            Confirmer récupération
          </button>
        )}
        {isAdmin && ["picked_up", "cancelled"].includes(pickup.status) && (
          <button
            onClick={() => onDelete(pickup)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {lightboxOpen && pickup.invoicePhotoUrl && (
        <PhotoLightbox
          src={pickup.invoicePhotoUrl}
          onClose={() => setLightboxOpen(false)}
        />
      )}
      {productLightboxOpen && pickup.productPhotoUrl && (
        <PhotoLightbox
          src={pickup.productPhotoUrl}
          onClose={() => setProductLightboxOpen(false)}
        />
      )}
    </div>
  );
}

// ========================================================================
// REMOTE CLIENTS — STATUS CONFIG
// ========================================================================
const CLIENT_STATUS = {
  active: { label: "En cours", color: "bg-teal-100 text-teal-700" },
  converted: { label: "Vente réalisée", color: "bg-emerald-100 text-emerald-700" },
  lost: { label: "Perdu", color: "bg-slate-100 text-slate-500" },
};

// ========================================================================
// REMOTE CLIENTS PANEL
// ========================================================================
function RemoteClientsPanel({
  clients,
  currentUser,
  isAdmin,
  onCreateClick,
  onEditClick,
  onDelete,
  onClose,
}) {
  const [filter, setFilter] = useState("active");

  const active = clients.filter((c) => c.status === "active");
  const converted = clients.filter((c) => c.status === "converted");
  const lost = clients.filter((c) => c.status === "lost");

  let filtered;
  if (filter === "active") filtered = active;
  else if (filter === "converted") filtered = converted;
  else filtered = lost;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone size={20} />
            <div>
              <h2 className="font-bold text-lg">Clients à distance</h2>
              <p className="text-xs text-white/80">
                {isAdmin
                  ? "🛡️ Vue admin : tous les clients de l'équipe"
                  : "🔒 Privé : visible par vous et l'admin uniquement"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateClick}
              className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
            >
              <Plus size={14} />
              Nouveau
            </button>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setFilter("active")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "active"
                ? "border-teal-600 text-teal-700 bg-teal-50"
                : "border-transparent text-slate-600"
            }`}
          >
            En cours
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "active" ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {active.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("converted")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "converted"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                : "border-transparent text-slate-600"
            }`}
          >
            Vendus
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "converted" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {converted.length}
            </span>
          </button>
          <button
            onClick={() => setFilter("lost")}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              filter === "lost"
                ? "border-slate-600 text-slate-700 bg-slate-100"
                : "border-transparent text-slate-600"
            }`}
          >
            Perdus
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${filter === "lost" ? "bg-slate-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {lost.length}
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Phone size={32} className="mx-auto mb-2 opacity-40" />
              {filter === "active"
                ? "Aucun client à distance en cours."
                : filter === "converted"
                  ? "Aucune vente enregistrée."
                  : "Aucun client perdu."}
              <div className="mt-3">
                <button
                  onClick={onCreateClick}
                  className="text-teal-600 text-xs font-semibold hover:underline"
                >
                  + Créer une fiche
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((c) => (
                <RemoteClientCard
                  key={c._key || c.id}
                  client={c}
                  currentUser={currentUser}
                  isAdmin={isAdmin}
                  onEdit={onEditClick}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// REMOTE CLIENT CARD
// ========================================================================
function RemoteClientCard({ client, currentUser, isAdmin, onEdit, onDelete }) {
  const canEdit = client.createdBy === currentUser.fc || isAdmin;
  const isCreator = client.createdBy === currentUser.fc;
  const statusCfg = CLIENT_STATUS[client.status] || CLIENT_STATUS.active;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200 hover:shadow-md transition">
      <div className="flex items-start gap-2 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {client.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <h4 className="font-bold text-slate-800 text-sm">{client.name}</h4>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusCfg.color}`}
            >
              {statusCfg.label}
            </span>
          </div>
          {client.customerNumber && (
            <p className="text-xs text-slate-500 font-mono">
              N° {client.customerNumber}
            </p>
          )}
          {client.phone && (
            <a
              href={`tel:${client.phone}`}
              className="text-xs text-teal-700 font-semibold flex items-center gap-1 hover:underline mt-0.5"
            >
              <Phone size={11} />
              {client.phone}
            </a>
          )}
          {client.notes && (
            <p className="text-xs text-slate-600 mt-1 italic whitespace-pre-wrap break-words">
              {client.notes}
            </p>
          )}
          <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 flex-wrap">
            <span>
              Par <strong>{client.createdByPrenom}</strong>
              {isCreator && " (vous)"} • {formatTime(client.createdAt)}
            </span>
            {client.updatedAt && client.updatedAt !== client.createdAt && (
              <span>• modifié {formatTime(client.updatedAt)}</span>
            )}
          </div>
        </div>
        {canEdit && (
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={() => onEdit(client)}
              className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded"
              title="Modifier"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      {confirmDelete && (
        <ConfirmModal
          icon="🗑️"
          title="Supprimer la fiche ?"
          message={`Supprimer la fiche client de ${client.name} ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          confirmTone="red"
          onConfirm={() => {
            setConfirmDelete(false);
            onDelete(client);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

// ========================================================================
// REMOTE CLIENT EDIT MODAL (création + édition)
// ========================================================================
function RemoteClientEditModal({ client, onSave, onClose }) {
  const isNew = !client;
  const [name, setName] = useState(client?.name || "");
  const [customerNumber, setCustomerNumber] = useState(
    client?.customerNumber || "",
  );
  const [phone, setPhone] = useState(client?.phone || "");
  const [notes, setNotes] = useState(client?.notes || "");
  const [status, setStatus] = useState(client?.status || "active");

  const canSubmit = name.trim().length >= 2;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-5 py-3 flex items-center gap-2">
          <Phone size={20} />
          <h2 className="font-bold text-lg flex-1">
            {isNew ? "Nouveau client à distance" : "Modifier la fiche"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800 flex items-start gap-2">
            <span className="text-base">🔒</span>
            <span>
              Cette fiche ne sera visible que par <strong>vous</strong> et
              l'admin. Les autres collaborateurs n'y ont pas accès.
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nom du client <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : M. Dupont Jean"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              N° client Boulanger{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Ex : 12345678"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Téléphone{" "}
              <span className="text-slate-400 font-normal">(facultatif)</span>
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : 06 12 34 56 78"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Notes / détails de la demande
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Recherche TV 65 pouces, budget 1500 €, à rappeler jeudi après-midi"
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none"
            />
          </div>

          {!isNew && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Statut
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(CLIENT_STATUS).map(([id, cfg]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStatus(id)}
                    className={`px-2 py-2 rounded-lg border-2 text-xs font-semibold transition ${
                      status === id
                        ? cfg.color + " border-current"
                        : "bg-white border-slate-200 text-slate-500"
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={() =>
                onSave({
                  name: name.trim(),
                  customerNumber: customerNumber.trim(),
                  phone: phone.trim(),
                  notes: notes.trim(),
                  status,
                })
              }
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
            >
              {isNew ? "Créer la fiche" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// TEAM PHONES PANEL — Annuaire équipe
// ========================================================================
function TeamPhonesPanel({
  users,
  userStatuses,
  currentFc,
  isAdmin,
  externalContacts,
  onSaveContact,
  onDeleteContact,
  onUpdateMyPhone,
  onClose,
}) {
  const [tab, setTab] = useState("team"); // team | external
  const [editMine, setEditMine] = useState(false);
  const me = users.find((u) => u.fc === currentFc);
  const [phoneDraft, setPhoneDraft] = useState(me?.phone || "");
  const [search, setSearch] = useState("");
  const [editContact, setEditContact] = useState(null); // null | "new" | contact

  // Trier : moi en premier, puis par rôle (admin d'abord), puis par prénom
  const sorted = useMemo(() => {
    const rolePriority = { admin: 0, vendeur: 1, caisse: 2, magasinier: 3, livreur: 4 };
    return [...users].sort((a, b) => {
      if (a.fc === currentFc) return -1;
      if (b.fc === currentFc) return 1;
      const ra = rolePriority[a.role] ?? 99;
      const rb = rolePriority[b.role] ?? 99;
      if (ra !== rb) return ra - rb;
      return a.prenom.localeCompare(b.prenom);
    });
  }, [users, currentFc]);

  const filtered = search
    ? sorted.filter(
        (u) =>
          u.prenom.toLowerCase().includes(search.toLowerCase()) ||
          (u.phone || "").includes(search),
      )
    : sorted;

  const saveMyPhone = async () => {
    await onUpdateMyPhone(phoneDraft);
    setEditMine(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-5 py-3 flex items-center gap-2">
          <PhoneCall size={20} />
          <div className="flex-1">
            <h2 className="font-bold text-lg">Annuaire équipe</h2>
            <p className="text-xs text-white/80">
              Tapez sur un numéro pour appeler directement
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-2 py-1.5 flex gap-1 shrink-0">
          <button
            onClick={() => setTab("team")}
            className={`flex-1 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition ${tab === "team" ? "bg-emerald-600 text-white shadow" : "text-slate-600 hover:bg-white"}`}
          >
            <Users size={13} /> Équipe
          </button>
          <button
            onClick={() => setTab("external")}
            className={`flex-1 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition ${tab === "external" ? "bg-cyan-600 text-white shadow" : "text-slate-600 hover:bg-white"}`}
          >
            <PhoneCall size={13} /> Contacts externes
            {externalContacts && externalContacts.length > 0 && (
              <span className="ml-1 bg-white/20 px-1.5 rounded-full text-[10px]">
                {externalContacts.length}
              </span>
            )}
          </button>
        </div>

        {/* Recherche */}
        <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "team" ? "Rechercher un prénom ou un numéro..." : "Rechercher un contact, entreprise..."}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {tab === "team" && (
          <>
        {/* === MON NUMÉRO — toujours visible en haut === */}
        <div className={`px-4 py-3 border-b border-slate-200 ${editMine || !me?.phone ? "bg-amber-50" : "bg-emerald-50"}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">📱</span>
            <div className="flex-1">
              <div className="font-bold text-sm text-slate-800">
                Mon numéro {me ? `— ${me.prenom}` : ""}
              </div>
              {!editMine && (
                <div className="text-[11px] text-slate-600">
                  {me?.phone || "Aucun numéro renseigné"}
                </div>
              )}
            </div>
            {!editMine && (
              <button
                onClick={() => {
                  setPhoneDraft(me?.phone || "");
                  setEditMine(true);
                }}
                className={`text-xs font-bold px-2.5 py-1.5 rounded ${me?.phone ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50" : "bg-amber-500 hover:bg-amber-600 text-white"}`}
              >
                {me?.phone ? "✎ Modifier" : "+ Ajouter"}
              </button>
            )}
          </div>
          {editMine && (
            <div className="flex gap-1.5 mt-1">
              <input
                type="tel"
                inputMode="tel"
                value={phoneDraft}
                onChange={(e) => setPhoneDraft(e.target.value)}
                placeholder="06 12 34 56 78"
                className="flex-1 px-3 py-2 border border-emerald-400 bg-white rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                autoFocus
              />
              <button
                onClick={saveMyPhone}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 rounded-lg text-sm flex items-center gap-1"
              >
                <CheckCircle2 size={14} />
                OK
              </button>
              <button
                onClick={() => {
                  setEditMine(false);
                  setPhoneDraft(me?.phone || "");
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 rounded-lg text-sm"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <PhoneCall size={32} className="mx-auto mb-2 opacity-40" />
              Aucun collaborateur trouvé.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const isMe = u.fc === currentFc;
                const status = userStatuses?.[u.fc];
                const statusId = status?.status || "available";
                const statusData = getStatus(statusId);
                const hasPhone = !!u.phone;

                return (
                  <li
                    key={u.fc}
                    className={`px-4 py-3 flex items-center gap-3 ${isMe ? "bg-emerald-50" : "hover:bg-slate-50"}`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full ${colorForUser(u.fc)} flex items-center justify-center text-white font-bold`}
                      >
                        {u.prenom.slice(0, 2).toUpperCase()}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${STATUS_DOT_COLORS[statusId]}`}
                        title={statusData.label}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm truncate">
                          {u.prenom}
                          {isMe && (
                            <span className="text-[10px] font-bold text-emerald-700 ml-1">
                              (vous)
                            </span>
                          )}
                        </span>
                        <RoleBadge role={u.role} compact />
                      </div>
                      {/* Affichage du numéro */}
                      {hasPhone ? (
                        <a
                          href={`tel:${u.phone}`}
                          className="inline-flex items-center gap-1 text-sm text-emerald-700 font-semibold hover:underline mt-0.5"
                        >
                          <PhoneCall size={12} />
                          {u.phone}
                        </a>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-0.5">
                          Pas de numéro renseigné
                        </p>
                      )}
                    </div>
                    {/* Actions */}
                    {isMe && (
                      <button
                        onClick={() => {
                          setPhoneDraft(u.phone || "");
                          setEditMine(true);
                        }}
                        className="shrink-0 p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="Modifier mon numéro"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    {!isMe && hasPhone && (
                      <a
                        href={`tel:${u.phone}`}
                        className="shrink-0 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-2.5 rounded-full shadow-md"
                        title={`Appeler ${u.prenom}`}
                      >
                        <PhoneCall size={16} />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 text-center text-[11px] text-slate-500">
          {users.filter((u) => u.phone).length} / {users.length} collaborateurs
          avec numéro
        </div>
          </>
        )}

        {tab === "external" && (
          <ExternalContactsView
            contacts={externalContacts || []}
            search={search}
            isAdmin={isAdmin}
            onAdd={() => setEditContact("new")}
            onEdit={(c) => setEditContact(c)}
          />
        )}
      </div>

      {editContact && (
        <ExternalContactEditModal
          initial={editContact === "new" ? null : editContact}
          onSave={(c) => {
            onSaveContact(c);
            setEditContact(null);
          }}
          onDelete={(id) => {
            onDeleteContact(id);
            setEditContact(null);
          }}
          onClose={() => setEditContact(null)}
        />
      )}
    </div>
  );
}

// ========================================================================
// EXTERNAL CONTACTS — Annuaire fournisseurs, prestataires, contacts utiles
// ========================================================================
const EXT_CONTACT_CATEGORIES = [
  { id: "supplier", label: "Fournisseur", emoji: "📦", color: "bg-blue-100 text-blue-700" },
  { id: "delivery", label: "Livraison", emoji: "🚚", color: "bg-orange-100 text-orange-700" },
  { id: "service", label: "SAV / Service", emoji: "🔧", color: "bg-red-100 text-red-700" },
  { id: "maintenance", label: "Entretien", emoji: "🛠️", color: "bg-slate-100 text-slate-700" },
  { id: "security", label: "Sécurité", emoji: "🔒", color: "bg-amber-100 text-amber-700" },
  { id: "boulanger", label: "Boulanger", emoji: "🏢", color: "bg-emerald-100 text-emerald-700" },
  { id: "partner", label: "Partenaire", emoji: "🤝", color: "bg-violet-100 text-violet-700" },
  { id: "emergency", label: "Urgence", emoji: "🚨", color: "bg-rose-100 text-rose-700" },
  { id: "other", label: "Autre", emoji: "📞", color: "bg-gray-100 text-gray-700" },
];

function ExternalContactsView({ contacts, search, isAdmin, onAdd, onEdit }) {
  const filtered = search
    ? contacts.filter((c) => {
        const s = search.toLowerCase();
        return (
          (c.name || "").toLowerCase().includes(s) ||
          (c.company || "").toLowerCase().includes(s) ||
          (c.phone || "").includes(search) ||
          (c.notes || "").toLowerCase().includes(s)
        );
      })
    : contacts;

  // Grouper par catégorie
  const grouped = {};
  filtered.forEach((c) => {
    const cat = c.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(c);
  });
  // Tri dans chaque catégorie : favoris d'abord, puis alphabétique
  Object.keys(grouped).forEach((k) => {
    grouped[k].sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
  });

  return (
    <>
      {isAdmin && (
        <div className="px-4 py-2.5 border-b border-slate-200 bg-cyan-50">
          <button
            onClick={onAdd}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} />
            Ajouter un contact externe
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm px-4">
            <PhoneCall size={32} className="mx-auto mb-2 opacity-40" />
            {search ? (
              <>Aucun contact trouvé pour "{search}"</>
            ) : (
              <>
                Aucun contact externe enregistré.
                {isAdmin && (
                  <div className="text-xs mt-1 text-slate-500">
                    Ajoutez vos fournisseurs, livreurs, prestataires via le
                    bouton ci-dessus.
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          EXT_CONTACT_CATEGORIES.filter((cat) => grouped[cat.id] && grouped[cat.id].length > 0).map(
            (cat) => (
              <div key={cat.id}>
                <div className="bg-slate-100 px-4 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5 sticky top-0 z-10">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className="ml-auto text-slate-400">
                    {grouped[cat.id].length}
                  </span>
                </div>
                <ul className="divide-y divide-slate-100">
                  {grouped[cat.id].map((c) => (
                    <ExternalContactRow
                      key={c.id}
                      contact={c}
                      category={cat}
                      isAdmin={isAdmin}
                      onEdit={() => onEdit(c)}
                    />
                  ))}
                </ul>
              </div>
            ),
          )
        )}
      </div>
    </>
  );
}

function ExternalContactRow({ contact, category, isAdmin, onEdit }) {
  const phoneClean = (contact.phone || "").replace(/\s/g, "");
  return (
    <li className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50">
      <div
        className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-lg shrink-0`}
      >
        {category.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm text-slate-800 truncate">
            {contact.name}
          </span>
          {contact.favorite && <span className="text-amber-500">⭐</span>}
        </div>
        {contact.company && (
          <div className="text-[11px] text-slate-500 truncate">
            {contact.company}
          </div>
        )}
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="inline-flex items-center gap-1 text-sm text-emerald-700 font-semibold hover:underline mt-0.5"
          >
            <PhoneCall size={12} />
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline ml-2"
          >
            ✉️ {contact.email}
          </a>
        )}
        {contact.notes && (
          <div className="text-[10px] text-slate-400 italic truncate mt-0.5">
            {contact.notes}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-2 rounded-full shadow-md"
            title={`Appeler ${contact.name}`}
          >
            <PhoneCall size={14} />
          </a>
        )}
        {isAdmin && (
          <button
            onClick={onEdit}
            className="p-2 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg"
            title="Modifier"
          >
            <Edit2 size={14} />
          </button>
        )}
      </div>
    </li>
  );
}

function ExternalContactEditModal({ initial, onSave, onDelete, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [company, setCompany] = useState(initial?.company || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [category, setCategory] = useState(initial?.category || "supplier");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [favorite, setFavorite] = useState(!!initial?.favorite);
  const [confirmDel, setConfirmDel] = useState(false);

  const canSave = name.trim().length > 0 && phone.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: initial?.id,
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      category,
      notes: notes.trim(),
      favorite,
      createdAt: initial?.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-2"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
        style={{ maxHeight: "min(92vh, 92dvh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-3 shrink-0 flex items-center justify-between">
          <h3 className="font-bold text-base">
            {initial ? "Modifier le contact" : "Nouveau contact externe"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Nom du contact *
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : M. Dupont"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              autoFocus
            />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Entreprise
            </div>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex : Samsung France"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Téléphone *
            </div>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01 23 45 67 89"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Email (facultatif)
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@exemple.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Catégorie
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {EXT_CONTACT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-2 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-0.5 transition ${category === cat.id ? `${cat.color} ring-2 ring-cyan-500` : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 font-semibold flex-1">
              ⭐ Marquer comme favori
            </span>
            <span className="text-[10px] text-slate-500">
              (affiché en premier dans sa catégorie)
            </span>
          </label>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Notes (facultatif)
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Horaires, référent, procédure…"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
            />
          </div>
          {initial && (
            <>
              {!confirmDel ? (
                <button
                  onClick={() => setConfirmDel(true)}
                  className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Supprimer ce contact
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 space-y-2">
                  <div className="text-xs text-red-800 font-semibold">
                    Supprimer définitivement ce contact ?
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDel(false)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => onDelete(initial.id)}
                      className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-3 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-lg disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={16} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN PANEL
// ========================================================================
function AdminPanel({
  onClose,
  interactions,
  saveInteractions,
  zones,
  saveZones,
  objectivesSchedule,
  saveObjectivesForDate,
  rewards,
  saveRewards,
  missions,
  createMission,
  handleValidateMission,
  handleFailMission,
  handleDeleteMission,
  penalties,
  closures,
  handleCloseDay,
  handleReopenDay,
  messages,
  chatBlocked,
  toggleChatBlocked,
  sendReminder,
  users,
  leaderboard,
}) {
  const [tab, setTab] = useState("planning");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <h2 className="font-bold text-lg">Panneau administrateur</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 overflow-x-auto">
          {[
            { id: "planning", label: "Planning", icon: Calendar },
            { id: "interactions", label: "Ventes", icon: Sparkles },
            { id: "zones", label: "Zones", icon: MapPin },
            { id: "missions", label: "Missions", icon: Target },
            { id: "rewards", label: "Récompenses", icon: Gift },
            { id: "closure", label: "Clôture", icon: CheckCircle2 },
            { id: "reminder", label: "Rappel", icon: Megaphone },
            { id: "chat", label: "Chat", icon: MessageCircle },
            { id: "stats", label: "Classement", icon: Trophy },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
                  tab === t.id
                    ? "border-orange-500 text-orange-600 bg-orange-50"
                    : "border-transparent text-slate-600 hover:text-slate-800"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "planning" && (
            <PlanningEditor
              objectivesSchedule={objectivesSchedule}
              saveObjectivesForDate={saveObjectivesForDate}
              interactions={interactions}
              closures={closures}
            />
          )}
          {tab === "interactions" && (
            <InteractionsEditor
              interactions={interactions}
              saveInteractions={saveInteractions}
            />
          )}
          {tab === "zones" && (
            <ZonesEditor zones={zones} saveZones={saveZones} />
          )}
          {tab === "missions" && (
            <MissionsAdmin
              missions={missions}
              createMission={createMission}
              onValidate={handleValidateMission}
              onFail={handleFailMission}
              onDelete={handleDeleteMission}
            />
          )}
          {tab === "rewards" && (
            <RewardsEditor rewards={rewards} saveRewards={saveRewards} />
          )}
          {tab === "closure" && (
            <ClosureEditor
              objectivesSchedule={objectivesSchedule}
              closures={closures}
              handleCloseDay={handleCloseDay}
              handleReopenDay={handleReopenDay}
              messages={messages}
              interactions={interactions}
              users={users}
              penalties={penalties}
            />
          )}
          {tab === "reminder" && <ReminderEditor sendReminder={sendReminder} />}
          {tab === "chat" && (
            <ChatControlEditor
              chatBlocked={chatBlocked}
              toggleChatBlocked={toggleChatBlocked}
            />
          )}
          {tab === "stats" && <StatsPanel leaderboard={leaderboard} />}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN: Planning editor (multi-dates)
// ========================================================================
function PlanningEditor({
  objectivesSchedule,
  saveObjectivesForDate,
  interactions,
  closures,
}) {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const dayItems = objectivesSchedule[selectedDate] || [];
  const [items, setItems] = useState(dayItems);

  // Ne recharger items que quand on change de date,
  // sinon chaque polling (toutes les 2,5s) écrase les saisies en cours
  useEffect(() => {
    setItems(objectivesSchedule[selectedDate] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const updateItem = (interactionId, target) => {
    const next = items.filter((i) => i.interactionId !== interactionId);
    const t = parseInt(target, 10);
    if (t > 0) next.push({ interactionId, target: t });
    setItems(next);
  };

  const handleSave = async () => {
    await saveObjectivesForDate(selectedDate, items);
  };

  const handleReset = async () => {
    await saveObjectivesForDate(selectedDate, []);
    setItems([]);
  };

  const copyFromDate = (sourceDate) => {
    const sourceItems = objectivesSchedule[sourceDate] || [];
    setItems(sourceItems);
  };

  // Génère 30 prochains jours
  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = -3; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const isSelectedClosed = !!closures[selectedDate];
  const isSelectedPast =
    new Date(selectedDate).getTime() <
    new Date(todayKey()).getTime();

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-1">
        Planification des objectifs
      </h3>
      <p className="text-sm text-slate-500 mb-3">
        Fixez les objectifs à l'avance pour n'importe quel jour.
      </p>

      {/* Sélecteur de date horizontal */}
      <div className="mb-4 -mx-2 px-2 overflow-x-auto">
        <div className="flex gap-1.5 pb-1">
          {upcomingDates.map((d) => {
            const key = dateKey(d);
            const isSelected = key === selectedDate;
            const isToday = key === todayKey();
            const hasObjs = (objectivesSchedule[key] || []).length > 0;
            const isClosed = !!closures[key];
            return (
              <button
                key={key}
                onClick={() => setSelectedDate(key)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex flex-col items-center gap-0.5 min-w-[60px] border-2 ${
                  isSelected
                    ? "bg-orange-500 border-orange-600 text-white"
                    : isToday
                      ? "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                      : "bg-white border-slate-200 text-slate-700 hover:border-orange-300"
                }`}
              >
                <span className="text-[10px] opacity-80 uppercase">
                  {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                </span>
                <span className="text-base font-black">{d.getDate()}</span>
                <span className="text-[9px] opacity-70">
                  {d.toLocaleDateString("fr-FR", { month: "short" })}
                </span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {hasObjs && (
                    <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                  )}
                  {isClosed && (
                    <CheckCircle2 size={10} className="opacity-60" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3 flex items-center gap-2">
        <Calendar size={16} className="text-orange-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">
            {formatDateLongFr(selectedDate)}
          </p>
          <p className="text-xs text-slate-600">
            {isSelectedClosed
              ? "✓ Journée clôturée"
              : isSelectedPast
                ? "Journée passée"
                : selectedDate === todayKey()
                  ? "Aujourd'hui"
                  : "À venir"}
          </p>
        </div>
        {!isSelectedClosed && (
          <QuickCopyButton
            objectivesSchedule={objectivesSchedule}
            onCopy={copyFromDate}
            exclude={selectedDate}
          />
        )}
      </div>

      <div className="space-y-2">
        {interactions.map((i) => {
          const existing = items.find((x) => x.interactionId === i.id);
          const isAmount = i.type === "amount";
          return (
            <div
              key={i.id}
              className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200"
            >
              <div className="text-2xl">{i.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800">{i.label}</div>
                <div className="text-xs text-slate-500">
                  {isAmount ? `CA HT en euros` : `${i.points} pts par vente`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={existing?.target || ""}
                    onChange={(e) => updateItem(i.id, e.target.value)}
                    disabled={isSelectedClosed}
                    className={`${isAmount ? "w-24 pr-6" : "w-20"} pl-2 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-center font-semibold disabled:bg-slate-100 disabled:cursor-not-allowed`}
                    placeholder="0"
                  />
                  {isAmount && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">
                      €
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSave}
          disabled={isSelectedClosed}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg transition disabled:cursor-not-allowed"
        >
          Enregistrer pour ce jour
        </button>
        <button
          onClick={handleReset}
          disabled={isSelectedClosed}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition disabled:opacity-50"
        >
          Effacer
        </button>
      </div>
    </div>
  );
}

function QuickCopyButton({ objectivesSchedule, onCopy, exclude }) {
  const [open, setOpen] = useState(false);
  const datesWithObjs = Object.keys(objectivesSchedule)
    .filter((d) => d !== exclude && (objectivesSchedule[d] || []).length > 0)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 10);

  if (datesWithObjs.length === 0) return null;
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs bg-white border border-orange-300 text-orange-700 hover:bg-orange-100 px-2 py-1 rounded-lg font-semibold"
      >
        Copier d'un autre jour
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-10 min-w-[180px]">
          {datesWithObjs.map((d) => (
            <button
              key={d}
              onClick={() => {
                onCopy(d);
                setOpen(false);
              }}
              className="w-full px-3 py-1.5 hover:bg-orange-50 text-xs text-left text-slate-700 font-medium"
            >
              {formatDateFr(d)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================================================
// ADMIN: Missions manager
// ========================================================================
function MissionsAdmin({ missions, createMission, onValidate, onFail, onDelete }) {
  const [showCreate, setShowCreate] = useState(false);
  const open = missions.filter((m) => m.status === "open");
  const inProgress = missions.filter((m) =>
    ["claimed", "completed"].includes(m.status),
  );
  const done = missions.filter((m) =>
    ["validated", "failed"].includes(m.status),
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 mb-1">Missions</h3>
          <p className="text-sm text-slate-500">
            Créez des missions avec récompense. Pénalité de −{PENALTY_MISSION_FAIL}{" "}
            pts si mal réalisée.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-3 py-2 rounded-lg flex items-center gap-1.5"
        >
          <Plus size={16} />
          Créer
        </button>
      </div>

      <div className="space-y-4">
        {inProgress.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              En cours ({inProgress.length})
            </h4>
            <div className="space-y-1.5">
              {inProgress.map((m) => (
                <MissionAdminRow
                  key={m._key || m.id}
                  mission={m}
                  onValidate={onValidate}
                  onFail={onFail}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
        {open.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              À prendre ({open.length})
            </h4>
            <div className="space-y-1.5">
              {open.map((m) => (
                <MissionAdminRow
                  key={m._key || m.id}
                  mission={m}
                  onValidate={onValidate}
                  onFail={onFail}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
        {done.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Historique ({done.length})
            </h4>
            <div className="space-y-1.5">
              {done.slice(0, 20).map((m) => (
                <MissionAdminRow
                  key={m._key || m.id}
                  mission={m}
                  onValidate={onValidate}
                  onFail={onFail}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
        {missions.length === 0 && (
          <p className="text-center py-10 text-slate-400 text-sm">
            Aucune mission. Créez-en une pour commencer.
          </p>
        )}
      </div>

      {showCreate && (
        <MissionCreateModal
          onCreate={async (m) => {
            await createMission(m);
            setShowCreate(false);
          }}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}

function MissionAdminRow({ mission, onValidate, onFail, onDelete }) {
  const statusBadge = {
    open: {
      label: "À prendre",
      cls: "bg-purple-100 text-purple-700",
    },
    claimed: {
      label: "En cours",
      cls: "bg-blue-100 text-blue-700",
    },
    completed: {
      label: "À valider",
      cls: "bg-amber-100 text-amber-700",
    },
    validated: {
      label: `+${mission.rewardPoints} validée`,
      cls: "bg-emerald-100 text-emerald-700",
    },
    failed: {
      label: `−${PENALTY_MISSION_FAIL} ratée`,
      cls: "bg-red-100 text-red-700",
    },
  }[mission.status];

  return (
    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className="font-semibold text-slate-800 text-sm truncate">
            {mission.title}
          </span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusBadge.cls}`}
          >
            {statusBadge.label}
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          {mission.claimedByPrenom ? `Par ${mission.claimedByPrenom}` : "Libre"}
          {" • "}+{mission.rewardPoints} pts
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {mission.status === "completed" && (
          <>
            <button
              onClick={() => onValidate(mission)}
              className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded"
              title="Valider"
            >
              <CheckCircle2 size={14} />
            </button>
            <button
              onClick={() => onFail(mission)}
              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded"
              title="Mal réalisée (−2)"
            >
              <XCircle size={14} />
            </button>
          </>
        )}
        {mission.status === "claimed" && (
          <button
            onClick={() => onFail(mission)}
            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded"
            title="Mal réalisée (−2)"
          >
            <XCircle size={14} />
          </button>
        )}
        {(mission.status === "open" ||
          mission.status === "validated" ||
          mission.status === "failed") && (
          <button
            onClick={() => onDelete(mission)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN: Rewards editor
// ========================================================================
function RewardsEditor({ rewards, saveRewards }) {
  const [local, setLocal] = useState(rewards);
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    setLocal(rewards);
  }, [rewards]);

  // Sauvegarde automatique debouncée (400ms après le dernier changement)
  const autoSave = (next) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveRewards(next);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    }, 400);
  };

  const update = (id, field, val) => {
    setLocal((prev) => {
      const next = prev.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]: field === "threshold" ? parseInt(val) || 0 : val,
            }
          : r,
      );
      autoSave(next);
      return next;
    });
  };

  const remove = (id) => {
    const next = local.filter((r) => r.id !== id);
    setLocal(next);
    saveRewards(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const add = () => {
    const next = [
      ...local,
      {
        id: `r_${Date.now()}`,
        threshold: 100,
        label: "Nouveau palier",
        reward: "À définir",
        emoji: "🎁",
      },
    ];
    setLocal(next);
    saveRewards(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  // Cleanup au démontage
  useEffect(
    () => () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    },
    [],
  );

  // Tri stable : on ne re-trie PAS pendant l'édition pour ne pas perdre le focus.
  // Le tri n'est appliqué qu'à la première vue (via useMemo sur length et ids)
  // puis la liste conserve son ordre même si on change un threshold.
  const displayOrder = useMemo(() => {
    // Ordre d'affichage basé sur les IDs, trié initialement par threshold
    return [...local].sort((a, b) => a.threshold - b.threshold).map((r) => r.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.length, local.map((r) => r.id).join("|")]);
  const sortedForDisplay = displayOrder
    .map((id) => local.find((r) => r.id === id))
    .filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800">Paliers de récompenses</h3>
        {savedFlash && (
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
            <CheckCircle2 size={12} />
            Enregistré
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Définissez les récompenses annuelles selon les points cumulés.
        <br />
        <span className="text-[11px] text-emerald-700 font-semibold">
          ✓ Les modifications sont sauvegardées automatiquement
        </span>
      </p>

      <div className="space-y-2 mb-3">
        {sortedForDisplay.map((r) => (
            <div
              key={r.id}
              className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-200"
            >
              <input
                value={r.emoji}
                onChange={(e) => update(r.id, "emoji", e.target.value)}
                className="w-10 text-center text-xl bg-white border border-slate-300 rounded-lg px-1 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none"
                maxLength={4}
              />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <input
                  value={r.label}
                  onChange={(e) => update(r.id, "label", e.target.value)}
                  placeholder="Nom du palier"
                  className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  value={r.reward}
                  onChange={(e) => update(r.id, "reward", e.target.value)}
                  placeholder="Récompense"
                  className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={r.threshold}
                  onChange={(e) => update(r.id, "threshold", e.target.value)}
                  className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <span className="text-xs text-slate-500">pts</span>
              </div>
              <button
                onClick={() => remove(r.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={add}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg transition text-sm flex items-center justify-center gap-1"
        >
          <Plus size={16} />
          Ajouter un palier
        </button>
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN: Closure editor (clôture de journée → pénalités)
// ========================================================================
function ClosureEditor({
  objectivesSchedule,
  closures,
  handleCloseDay,
  handleReopenDay,
  messages,
  interactions,
  users,
  penalties,
}) {
  // Liste les dates avec objectifs, récentes d'abord
  const dates = Object.keys(objectivesSchedule)
    .filter((d) => (objectivesSchedule[d] || []).length > 0)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 30);

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-1">Clôture de journée</h3>
      <p className="text-sm text-slate-500 mb-4">
        À la clôture, chaque objectif non atteint génère une pénalité de −
        {PENALTY_MISSED_OBJ} pt pour chaque collaborateur non-admin.
      </p>

      {dates.length === 0 ? (
        <p className="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-lg">
          Aucun jour avec objectifs définis.
        </p>
      ) : (
        <div className="space-y-2">
          {dates.map((date) => {
            const items = objectivesSchedule[date] || [];
            const closed = !!closures[date];
            const dayStart = new Date(date).setHours(0, 0, 0, 0);
            const dayEnd = dayStart + 24 * 60 * 60 * 1000;
            const dayAch = messages.filter(
              (m) =>
                m.type === "achievement" &&
                m.timestamp >= dayStart &&
                m.timestamp < dayEnd,
            );
            const progress = {};
            dayAch.forEach((m) => {
              if (!progress[m.interactionId])
                progress[m.interactionId] = { count: 0, amount: 0 };
              progress[m.interactionId].count += m.count || 1;
              progress[m.interactionId].amount += m.amount || 0;
            });
            const missed = items.filter((it) => {
              const inter = interactions.find((i) => i.id === it.interactionId);
              if (!inter) return false;
              const p = progress[it.interactionId] || { count: 0, amount: 0 };
              const cur = inter.type === "amount" ? p.amount : p.count;
              return cur < it.target;
            });
            const isPast =
              new Date(date).getTime() < new Date(todayKey()).getTime();

            return (
              <div
                key={date}
                className={`rounded-lg p-3 border ${closed ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">
                      {formatDateLongFr(date)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {items.length} objectif(s) planifié(s)
                      {missed.length > 0 && (
                        <span className="text-red-500 font-semibold ml-1">
                          • {missed.length} manqué(s)
                        </span>
                      )}
                    </p>
                  </div>
                  {closed ? (
                    <button
                      onClick={() => handleReopenDay(date)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded flex items-center gap-1 shrink-0"
                    >
                      <Minus size={12} /> Annuler clôture
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCloseDay(date)}
                      disabled={!isPast && date !== todayKey()}
                      className="text-xs bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white px-2.5 py-1 rounded flex items-center gap-1 shrink-0 font-semibold disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 size={12} /> Clôturer
                    </button>
                  )}
                </div>
                {closed && (
                  <div className="text-xs text-emerald-700 flex items-center gap-1">
                    <Check size={10} /> Clôturée
                    {missed.length > 0 && (
                      <span className="text-red-600 ml-1">
                        • −{missed.length} pt par collaborateur
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {penalties.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 mb-2">
            Dernières pénalités ({penalties.length})
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {[...penalties]
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 20)
              .map((p) => (
                <div
                  key={p._key}
                  className="text-xs bg-red-50 border border-red-100 rounded p-2 flex items-center gap-2"
                >
                  <Minus size={12} className="text-red-600 shrink-0" />
                  <span className="font-bold text-red-700 shrink-0">
                    −{p.amount}
                  </span>
                  <span className="text-slate-700 truncate">
                    {p.prenom} — {p.reason}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================================================
// ADMIN: Interactions editor
// ========================================================================
function InteractionsEditor({ interactions, saveInteractions }) {
  const [local, setLocal] = useState(interactions);
  const [newItem, setNewItem] = useState({ label: "", emoji: "🎯", points: 5 });

  useEffect(() => {
    setLocal(interactions);
  }, [interactions]);

  const addInteraction = () => {
    if (!newItem.label.trim()) return;
    const id = newItem.label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20) +
      "_" +
      Math.random().toString(36).slice(2, 5);
    const next = [
      ...local,
      {
        id,
        label: newItem.label.trim(),
        emoji: newItem.emoji || "🎯",
        points: parseInt(newItem.points) || 5,
      },
    ];
    setLocal(next);
    saveInteractions(next);
    setNewItem({ label: "", emoji: "🎯", points: 5 });
  };

  const removeInteraction = (id) => {
    const next = local.filter((i) => i.id !== id);
    setLocal(next);
    saveInteractions(next);
  };

  const updateInteraction = (id, field, value) => {
    const next = local.map((i) =>
      i.id === id
        ? { ...i, [field]: field === "points" ? parseInt(value) || 0 : value }
        : i,
    );
    setLocal(next);
  };

  const saveAll = () => saveInteractions(local);

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-1">Types de ventes</h3>
      <p className="text-sm text-slate-500 mb-4">
        Ajoutez, modifiez ou supprimez les boutons cliqués par les collaborateurs lors d'une
        vente.
      </p>

      <div className="space-y-2 mb-4">
        {local.map((i) => (
          <div
            key={i.id}
            className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-200"
          >
            <input
              value={i.emoji}
              onChange={(e) => updateInteraction(i.id, "emoji", e.target.value)}
              className="w-12 text-center text-xl bg-white border border-slate-300 rounded-lg px-1 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none"
              maxLength={4}
            />
            <input
              value={i.label}
              onChange={(e) => updateInteraction(i.id, "label", e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={i.points}
                onChange={(e) => updateInteraction(i.id, "points", e.target.value)}
                className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-center text-sm font-semibold"
              />
              <span className="text-xs text-slate-500">pts</span>
            </div>
            <button
              onClick={() => removeInteraction(i.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={saveAll}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition text-sm mb-4"
      >
        Enregistrer les modifications
      </button>

      <div className="border-t border-slate-200 pt-4">
        <h4 className="font-semibold text-slate-700 mb-2 text-sm">Ajouter un type</h4>
        <div className="flex items-center gap-2">
          <input
            value={newItem.emoji}
            onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
            className="w-12 text-center text-xl bg-white border border-slate-300 rounded-lg px-1 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            maxLength={4}
          />
          <input
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            placeholder="Nom du produit / service"
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && addInteraction()}
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={newItem.points}
              onChange={(e) => setNewItem({ ...newItem, points: e.target.value })}
              className="w-16 px-2 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-center text-sm font-semibold"
            />
            <span className="text-xs text-slate-500">pts</span>
          </div>
          <button
            onClick={addInteraction}
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN: Zones editor
// ========================================================================
function ZonesEditor({ zones, saveZones }) {
  const [local, setLocal] = useState(zones);
  const [newItem, setNewItem] = useState({ label: "", emoji: "📍" });

  useEffect(() => {
    setLocal(zones);
  }, [zones]);

  const addZone = () => {
    if (!newItem.label.trim()) return;
    const id =
      newItem.label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 20) +
      "_" +
      Math.random().toString(36).slice(2, 5);
    const next = [
      ...local,
      { id, label: newItem.label.trim(), emoji: newItem.emoji || "📍" },
    ];
    setLocal(next);
    saveZones(next);
    setNewItem({ label: "", emoji: "📍" });
  };

  const removeZone = (id) => {
    const next = local.filter((z) => z.id !== id);
    setLocal(next);
    saveZones(next);
  };

  const updateZone = (id, field, value) => {
    const next = local.map((z) => (z.id === id ? { ...z, [field]: value } : z));
    setLocal(next);
  };

  const saveAll = () => saveZones(local);

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-1">Zones du magasin</h3>
      <p className="text-sm text-slate-500 mb-4">
        Ajoutez, modifiez ou supprimez les zones proposées dans le bouton
        "Clients en attente".
      </p>

      <div className="space-y-2 mb-4">
        {local.map((z) => (
          <div
            key={z.id}
            className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-200"
          >
            <input
              value={z.emoji}
              onChange={(e) => updateZone(z.id, "emoji", e.target.value)}
              className="w-12 text-center text-xl bg-white border border-slate-300 rounded-lg px-1 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none"
              maxLength={4}
            />
            <input
              value={z.label}
              onChange={(e) => updateZone(z.id, "label", e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
            <button
              onClick={() => removeZone(z.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {local.length > 0 && (
        <button
          onClick={saveAll}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition text-sm mb-4"
        >
          Enregistrer les modifications
        </button>
      )}

      <div className="border-t border-slate-200 pt-4">
        <h4 className="font-semibold text-slate-700 mb-2 text-sm">
          Ajouter une zone
        </h4>
        <div className="flex items-center gap-2">
          <input
            value={newItem.emoji}
            onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
            className="w-12 text-center text-xl bg-white border border-slate-300 rounded-lg px-1 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            maxLength={4}
          />
          <input
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            placeholder="Nom de la zone"
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && addZone()}
          />
          <button
            onClick={addZone}
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN: Reminder editor
// ========================================================================
function ReminderEditor({ sendReminder }) {
  const [text, setText] = useState("");
  const [duration, setDuration] = useState(60);
  const [sent, setSent] = useState(false);

  const presets = [
    "Pensez à proposer Infinity à chaque client !",
    "Rappel : le Club+ est offert le premier mois, à proposer systématiquement.",
    "N'oubliez pas la PO sur chaque produit > 200 €.",
    "Briefing dans 15 minutes au comptoir.",
    "Nouveau promo : Canal+ à tarif préférentiel cette semaine.",
  ];

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendReminder(text, parseInt(duration) || 60);
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-1">Envoyer un rappel d'utilisation</h3>
      <p className="text-sm text-slate-500 mb-4">
        Le rappel s'affiche en bandeau en haut du chat et en notification pour toute l'équipe.
      </p>

      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Ex : Pensez à proposer Infinity à chaque client !"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
        />

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Durée d'affichage
          </label>
          <div className="flex gap-1.5">
            {[
              { v: 30, l: "30 min" },
              { v: 60, l: "1 h" },
              { v: 180, l: "3 h" },
              { v: 480, l: "8 h" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setDuration(opt.v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  duration === opt.v
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Suggestions rapides
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setText(p)}
                className="text-xs bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-700 px-2 py-1 rounded-full transition text-left"
              >
                {p.length > 40 ? p.slice(0, 40) + "..." : p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Megaphone size={18} />
          Envoyer le rappel
        </button>

        {sent && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 py-2 rounded-lg flex items-center gap-2">
            <PartyPopper size={16} /> Rappel envoyé à toute l'équipe.
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN: Chat control
// ========================================================================
function ChatControlEditor({ chatBlocked, toggleChatBlocked }) {
  const [reason, setReason] = useState(chatBlocked.reason || "");

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-1">Contrôle du chat</h3>
      <p className="text-sm text-slate-500 mb-4">
        Bloquez l'envoi de messages et de ventes pour toute l'équipe (vous conservez l'accès).
      </p>

      <div
        className={`rounded-xl p-4 border-2 ${
          chatBlocked.blocked
            ? "bg-red-50 border-red-200"
            : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {chatBlocked.blocked ? (
            <Lock className="text-red-600" size={24} />
          ) : (
            <Unlock className="text-emerald-600" size={24} />
          )}
          <div>
            <div
              className={`font-bold ${
                chatBlocked.blocked ? "text-red-700" : "text-emerald-700"
              }`}
            >
              {chatBlocked.blocked ? "Chat bloqué" : "Chat ouvert"}
            </div>
            <div className="text-sm text-slate-600">
              {chatBlocked.blocked
                ? "Les collaborateurs ne peuvent ni écrire ni enregistrer de ventes."
                : "Chacun peut écrire et enregistrer ses ventes librement."}
            </div>
          </div>
        </div>

        {!chatBlocked.blocked && (
          <div className="mb-3">
            <label className="text-xs font-medium text-slate-700 mb-1 block">
              Motif (optionnel)
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : Briefing en cours..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
          </div>
        )}

        <button
          onClick={() => toggleChatBlocked(reason)}
          className={`w-full font-semibold py-2.5 rounded-lg transition text-white ${
            chatBlocked.blocked
              ? "bg-emerald-500 hover:bg-emerald-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {chatBlocked.blocked ? "Débloquer le chat" : "Bloquer le chat"}
        </button>
      </div>
    </div>
  );
}

// ========================================================================
// ADMIN: Stats
// ========================================================================
function StatsPanel({ leaderboard }) {
  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-1">Classement complet</h3>
      <p className="text-sm text-slate-500 mb-4">
        Points du jour et total cumulé depuis l'inscription.
      </p>
      <div className="space-y-1.5">
        {leaderboard.map((u, idx) => (
          <div
            key={u.fc}
            className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200"
          >
            <div className="w-8 text-center font-bold text-slate-400">#{idx + 1}</div>
            <div
              className={`w-9 h-9 rounded-full ${colorForUser(u.fc)} flex items-center justify-center text-white text-sm font-bold shrink-0`}
            >
              {u.prenom.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-800 truncate">{u.prenom}</span>
                {u.isAdmin && (
                  <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1 rounded">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">{u.fc}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-orange-600 font-bold">
                <TrendingUp size={14} />
                {u.todayPoints} pts
              </div>
              <div className="text-xs text-slate-500">{u.points} total</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================================================
// HELPERS
// ========================================================================
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Aujourd'hui";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function colorForUser(name) {
  const palette = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-sky-500",
    "bg-lime-600",
    "bg-orange-500",
    "bg-indigo-500",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
