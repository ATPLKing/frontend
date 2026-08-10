import type { QuestionBank } from "../utils/types";

export const sampleBank: QuestionBank = {
  id: "bank-sample",
  name: "Culture générale",
  description:
    "Banque d'exemple pour découvrir la plateforme. Supprimez-la ou modifiez-la librement.",
  subjects: [
    {
      code: "GEO",
      name: "Géographie",
      subtopics: [
        { code: "GEO-CAP", name: "Capitales" },
        { code: "GEO-MON", name: "Montagnes" },
      ],
    },
    {
      code: "HIS",
      name: "Histoire",
      subtopics: [{ code: "HIS-ANT", name: "Antiquité" }],
    },
  ],
  questions: [
    {
      id: "sample-q1",
      question: "Quelle est la capitale de la France ?",
      explanation: "Paris est la capitale de la France depuis le Moyen Âge.",
      options: [
        { text: "Lyon", correct: false },
        { text: "Paris", correct: true },
        { text: "Marseille", correct: false },
        { text: "Toulouse", correct: false },
      ],
      subtopic: "GEO-CAP",
    },
    {
      id: "sample-q2",
      question: "Quel est le plus haut sommet d'Europe ?",
      explanation: "Le mont Blanc culmine à 4 806 mètres.",
      options: [
        { text: "Le mont Blanc", correct: true },
        { text: "Le mont Ventoux", correct: false },
        { text: "Le Cervin", correct: false },
        { text: "Le mont Viso", correct: false },
      ],
      subtopic: "GEO-MON",
    },
    {
      id: "sample-q3",
      question: "Quel empire était dirigé par Jules César ?",
      explanation: "Jules César fut dictateur de la République romaine.",
      options: [
        { text: "L'empire byzantin", correct: false },
        { text: "L'empire romain", correct: true },
        { text: "L'empire ottoman", correct: false },
        { text: "L'empire perse", correct: false },
      ],
      subtopic: "HIS-ANT",
    },
  ],
};
