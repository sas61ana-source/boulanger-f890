// firebase-storage.js
// Wrapper Firebase Realtime Database — réimplémente window.storage avec partage temps réel

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set as fbSet,
  remove,
  onValue,
  query,
  orderByKey,
  startAt,
  endAt,
} from "firebase/database";

// =============================================================================
// 🔧 CONFIGURATION FIREBASE — À REMPLACER PAR VOS VALEURS
// =============================================================================
// Récupérez ces valeurs sur console.firebase.google.com :
// ⚙️ Paramètres du projet → Vos applications → app web → Configuration SDK
const firebaseConfig = {
  apiKey: "REMPLACEZ_PAR_VOTRE_API_KEY",
  authDomain: "REMPLACEZ.firebaseapp.com",
  databaseURL: "https://REMPLACEZ-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "REMPLACEZ",
  storageBucket: "REMPLACEZ.appspot.com",
  messagingSenderId: "REMPLACEZ",
  appId: "REMPLACEZ",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =============================================================================
// IMPORTANT : encodage des clés
// Firebase interdit les caractères . $ # [ ] / dans les chemins.
// Le code utilise abondamment les ":" (ex: msg:abc, call:active:xyz).
// On les remplace par "__" pour Firebase, et on inverse en lecture.
// =============================================================================
function encodeKey(key) {
  return String(key)
    .replace(/\./g, "_DOT_")
    .replace(/\$/g, "_DLR_")
    .replace(/#/g, "_HSH_")
    .replace(/\[/g, "_OBR_")
    .replace(/\]/g, "_CBR_")
    .replace(/\//g, "_SLH_")
    .replace(/:/g, "__");
}
function decodeKey(key) {
  return String(key)
    .replace(/__/g, ":")
    .replace(/_SLH_/g, "/")
    .replace(/_CBR_/g, "]")
    .replace(/_OBR_/g, "[")
    .replace(/_HSH_/g, "#")
    .replace(/_DLR_/g, "$")
    .replace(/_DOT_/g, ".");
}

// =============================================================================
// API window.storage — compatible avec votre code existant
// =============================================================================
window.storage = {
  async get(key, shared = true) {
    try {
      const r = ref(db, `data/${encodeKey(key)}`);
      const snap = await get(r);
      if (!snap.exists()) return null;
      const v = snap.val();
      // Firebase stocke les valeurs telles quelles ; on encapsule au format attendu
      return { key, value: typeof v === "string" ? v : JSON.stringify(v), shared };
    } catch (e) {
      console.error("storage.get", key, e);
      return null;
    }
  },

  async set(key, value, shared = true) {
    try {
      const r = ref(db, `data/${encodeKey(key)}`);
      // On stocke directement la string JSON (pour préserver le format actuel)
      await fbSet(r, value);
      return { key, value, shared };
    } catch (e) {
      console.error("storage.set", key, e);
      return null;
    }
  },

  async delete(key, shared = true) {
    try {
      const r = ref(db, `data/${encodeKey(key)}`);
      await remove(r);
      return { key, deleted: true, shared };
    } catch (e) {
      console.error("storage.delete", key, e);
      return null;
    }
  },

  async list(prefix = "", shared = true) {
    try {
      // Firebase n'a pas de "list with prefix" natif comme Anthropic.
      // On charge toutes les clés sous `data/` puis on filtre.
      // Pour des bases plus grosses, mieux vaudrait segmenter en sous-chemins.
      const r = ref(db, "data");
      const snap = await get(r);
      if (!snap.exists()) return { keys: [], prefix, shared };
      const allKeys = Object.keys(snap.val() || {}).map(decodeKey);
      const filtered = allKeys.filter((k) => k.startsWith(prefix));
      return { keys: filtered, prefix, shared };
    } catch (e) {
      console.error("storage.list", prefix, e);
      return { keys: [], prefix, shared };
    }
  },
};

// =============================================================================
// BONUS : abonnement temps réel (utile pour le futur)
// Permet à votre code d'être notifié des changements sans polling
// =============================================================================
window.storageSubscribe = function (prefix, callback) {
  const r = ref(db, "data");
  const unsub = onValue(r, (snap) => {
    const all = snap.val() || {};
    const filtered = {};
    Object.keys(all).forEach((k) => {
      const decoded = decodeKey(k);
      if (decoded.startsWith(prefix)) {
        filtered[decoded] = all[k];
      }
    });
    callback(filtered);
  });
  return unsub; // appelez unsub() pour vous désabonner
};

console.log("✅ Firebase Realtime Database connecté");
