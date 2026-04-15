import type { Card } from "../types";

// Top French verbs × common tenses
// IDs start at 2000 to avoid conflicts

interface VerbData {
  infinitive: string;
  translation: string;
  tenses: Record<string, Record<string, string>>;
}

const VERBS: VerbData[] = [
  {
    infinitive: "être",
    translation: "to be",
    tenses: {
      présent: { je: "suis", tu: "es", "il/elle": "est", nous: "sommes", vous: "êtes", "ils/elles": "sont" },
      "passé composé": { je: "ai été", tu: "as été", "il/elle": "a été", nous: "avons été", vous: "avez été", "ils/elles": "ont été" },
      imparfait: { je: "étais", tu: "étais", "il/elle": "était", nous: "étions", vous: "étiez", "ils/elles": "étaient" },
      futur: { je: "serai", tu: "seras", "il/elle": "sera", nous: "serons", vous: "serez", "ils/elles": "seront" },
    },
  },
  {
    infinitive: "avoir",
    translation: "to have",
    tenses: {
      présent: { je: "ai", tu: "as", "il/elle": "a", nous: "avons", vous: "avez", "ils/elles": "ont" },
      "passé composé": { je: "ai eu", tu: "as eu", "il/elle": "a eu", nous: "avons eu", vous: "avez eu", "ils/elles": "ont eu" },
      imparfait: { je: "avais", tu: "avais", "il/elle": "avait", nous: "avions", vous: "aviez", "ils/elles": "avaient" },
      futur: { je: "aurai", tu: "auras", "il/elle": "aura", nous: "aurons", vous: "aurez", "ils/elles": "auront" },
    },
  },
  {
    infinitive: "aller",
    translation: "to go",
    tenses: {
      présent: { je: "vais", tu: "vas", "il/elle": "va", nous: "allons", vous: "allez", "ils/elles": "vont" },
      "passé composé": { je: "suis allé(e)", tu: "es allé(e)", "il/elle": "est allé(e)", nous: "sommes allé(e)s", vous: "êtes allé(e)(s)", "ils/elles": "sont allé(e)s" },
      imparfait: { je: "allais", tu: "allais", "il/elle": "allait", nous: "allions", vous: "alliez", "ils/elles": "allaient" },
      futur: { je: "irai", tu: "iras", "il/elle": "ira", nous: "irons", vous: "irez", "ils/elles": "iront" },
    },
  },
  {
    infinitive: "faire",
    translation: "to do / to make",
    tenses: {
      présent: { je: "fais", tu: "fais", "il/elle": "fait", nous: "faisons", vous: "faites", "ils/elles": "font" },
      "passé composé": { je: "ai fait", tu: "as fait", "il/elle": "a fait", nous: "avons fait", vous: "avez fait", "ils/elles": "ont fait" },
      imparfait: { je: "faisais", tu: "faisais", "il/elle": "faisait", nous: "faisions", vous: "faisiez", "ils/elles": "faisaient" },
      futur: { je: "ferai", tu: "feras", "il/elle": "fera", nous: "ferons", vous: "ferez", "ils/elles": "feront" },
    },
  },
  {
    infinitive: "pouvoir",
    translation: "to be able to / can",
    tenses: {
      présent: { je: "peux", tu: "peux", "il/elle": "peut", nous: "pouvons", vous: "pouvez", "ils/elles": "peuvent" },
      imparfait: { je: "pouvais", tu: "pouvais", "il/elle": "pouvait", nous: "pouvions", vous: "pouviez", "ils/elles": "pouvaient" },
      futur: { je: "pourrai", tu: "pourras", "il/elle": "pourra", nous: "pourrons", vous: "pourrez", "ils/elles": "pourront" },
    },
  },
  {
    infinitive: "vouloir",
    translation: "to want",
    tenses: {
      présent: { je: "veux", tu: "veux", "il/elle": "veut", nous: "voulons", vous: "voulez", "ils/elles": "veulent" },
      imparfait: { je: "voulais", tu: "voulais", "il/elle": "voulait", nous: "voulions", vous: "vouliez", "ils/elles": "voulaient" },
      futur: { je: "voudrai", tu: "voudras", "il/elle": "voudra", nous: "voudrons", vous: "voudrez", "ils/elles": "voudront" },
    },
  },
  {
    infinitive: "devoir",
    translation: "to have to / must",
    tenses: {
      présent: { je: "dois", tu: "dois", "il/elle": "doit", nous: "devons", vous: "devez", "ils/elles": "doivent" },
      imparfait: { je: "devais", tu: "devais", "il/elle": "devait", nous: "devions", vous: "deviez", "ils/elles": "devaient" },
      futur: { je: "devrai", tu: "devras", "il/elle": "devra", nous: "devrons", vous: "devrez", "ils/elles": "devront" },
    },
  },
  {
    infinitive: "savoir",
    translation: "to know (fact)",
    tenses: {
      présent: { je: "sais", tu: "sais", "il/elle": "sait", nous: "savons", vous: "savez", "ils/elles": "savent" },
      imparfait: { je: "savais", tu: "savais", "il/elle": "savait", nous: "savions", vous: "saviez", "ils/elles": "savaient" },
      futur: { je: "saurai", tu: "sauras", "il/elle": "saura", nous: "saurons", vous: "saurez", "ils/elles": "sauront" },
    },
  },
  {
    infinitive: "prendre",
    translation: "to take",
    tenses: {
      présent: { je: "prends", tu: "prends", "il/elle": "prend", nous: "prenons", vous: "prenez", "ils/elles": "prennent" },
      "passé composé": { je: "ai pris", tu: "as pris", "il/elle": "a pris", nous: "avons pris", vous: "avez pris", "ils/elles": "ont pris" },
      imparfait: { je: "prenais", tu: "prenais", "il/elle": "prenait", nous: "prenions", vous: "preniez", "ils/elles": "prenaient" },
      futur: { je: "prendrai", tu: "prendras", "il/elle": "prendra", nous: "prendrons", vous: "prendrez", "ils/elles": "prendront" },
    },
  },
  {
    infinitive: "venir",
    translation: "to come",
    tenses: {
      présent: { je: "viens", tu: "viens", "il/elle": "vient", nous: "venons", vous: "venez", "ils/elles": "viennent" },
      "passé composé": { je: "suis venu(e)", tu: "es venu(e)", "il/elle": "est venu(e)", nous: "sommes venu(e)s", vous: "êtes venu(e)(s)", "ils/elles": "sont venu(e)s" },
      imparfait: { je: "venais", tu: "venais", "il/elle": "venait", nous: "venions", vous: "veniez", "ils/elles": "venaient" },
      futur: { je: "viendrai", tu: "viendras", "il/elle": "viendra", nous: "viendrons", vous: "viendrez", "ils/elles": "viendront" },
    },
  },
  {
    infinitive: "manger",
    translation: "to eat",
    tenses: {
      présent: { je: "mange", tu: "manges", "il/elle": "mange", nous: "mangeons", vous: "mangez", "ils/elles": "mangent" },
      "passé composé": { je: "ai mangé", tu: "as mangé", "il/elle": "a mangé", nous: "avons mangé", vous: "avez mangé", "ils/elles": "ont mangé" },
      imparfait: { je: "mangeais", tu: "mangeais", "il/elle": "mangeait", nous: "mangions", vous: "mangiez", "ils/elles": "mangeaient" },
      futur: { je: "mangerai", tu: "mangeras", "il/elle": "mangera", nous: "mangerons", vous: "mangerez", "ils/elles": "mangeront" },
    },
  },
  {
    infinitive: "parler",
    translation: "to speak",
    tenses: {
      présent: { je: "parle", tu: "parles", "il/elle": "parle", nous: "parlons", vous: "parlez", "ils/elles": "parlent" },
      "passé composé": { je: "ai parlé", tu: "as parlé", "il/elle": "a parlé", nous: "avons parlé", vous: "avez parlé", "ils/elles": "ont parlé" },
      imparfait: { je: "parlais", tu: "parlais", "il/elle": "parlait", nous: "parlions", vous: "parliez", "ils/elles": "parlaient" },
      futur: { je: "parlerai", tu: "parleras", "il/elle": "parlera", nous: "parlerons", vous: "parlerez", "ils/elles": "parleront" },
    },
  },
];

// Generate cards from verb data
let nextId = 2000;
export const CONJUGATION_CARDS: Card[] = [];

for (const verb of VERBS) {
  for (const [tense, forms] of Object.entries(verb.tenses)) {
    for (const [pronoun, answer] of Object.entries(forms)) {
      CONJUGATION_CARDS.push({
        id: nextId++,
        category: "Conjugation",
        front: `${verb.infinitive} — ${tense} — ${pronoun}`,
        back: `${pronoun} ${answer}`,
        keyPoints: [
          `${verb.infinitive} = ${verb.translation}`,
          `Tense: ${tense}`,
        ],
        exerciseType: "conjugation",
        type: "vocabulary",
        deck: "french-conjugation",
        cefrLevel: "A1",
        verb: verb.infinitive,
        tense,
        pronoun,
      });
    }
  }
}
