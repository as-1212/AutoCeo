import { v4 as uuid } from "uuid";

const memoryVectors = [];

function embed(text) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const vec = new Array(alphabet.length).fill(0);
  const normalized = text.toLowerCase();
  for (const ch of normalized) {
    const idx = alphabet.indexOf(ch);
    if (idx >= 0) vec[idx] += 1;
  }
  const magnitude = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / magnitude);
}

function cosine(a, b) {
  let score = 0;
  for (let i = 0; i < a.length; i += 1) score += a[i] * b[i];
  return score;
}

export function storeMemory(text, metadata = {}) {
  memoryVectors.push({ id: uuid(), text, metadata, vector: embed(text), createdAt: new Date().toISOString() });
}

export function searchMemory(query, limit = 5) {
  const qv = embed(query);
  return memoryVectors
    .map((entry) => ({ ...entry, score: cosine(entry.vector, qv) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getAllMemory() {
  return memoryVectors;
}
