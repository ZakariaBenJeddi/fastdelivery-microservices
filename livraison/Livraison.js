const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema({
  commande_id: String,
  transporteur_id: String,
  statut: { type: String, default: "En attente" },
  adresse_livraison: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Livraison", livraisonSchema);
