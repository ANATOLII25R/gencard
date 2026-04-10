import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Gratuito",
    price: 0,
    priceId: null,
    maxProjects: 3,
    features: [
      "3 progetti",
      "Export PNG",
      "Template base",
      "800x600 px",
    ],
  },
  PRO: {
    name: "Pro",
    price: 9,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    maxProjects: -1, // illimitati
    features: [
      "Progetti illimitati",
      "Export PNG + PDF",
      "Tutti i template",
      "Dimensioni personalizzate",
      "Supporto prioritario",
    ],
  },
  BUSINESS: {
    name: "Business",
    price: 29,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    maxProjects: -1,
    features: [
      "Tutto di Pro",
      "Brand kit",
      "Collaborazione team",
      "API access",
      "Supporto dedicato",
    ],
  },
};
