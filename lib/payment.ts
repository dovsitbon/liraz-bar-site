/**
 * Paiement d'acompte en ligne : prévu mais DÉSACTIVÉ par défaut.
 * Pour l'activer plus tard : créer un compte Stripe (ou un prestataire israélien type Grow / Meshulam / Cardcom),
 * ajouter STRIPE_SECRET_KEY dans les variables d'environnement Vercel, passer `enabled` à true,
 * puis créer une route app/api/deposit/route.ts qui ouvre une session de paiement du montant ci-dessous.
 * Tant que `enabled` vaut false, aucun bouton de paiement n'est affiché et rien n'est appelé.
 */
export const deposit = {
  enabled: false,
  /** Acompte en shekels (À REMPLIR avec Liraz). */
  amount: null as number | null,
  currency: "ILS",
} as const;
