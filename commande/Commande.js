const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  produits: [{
    produit_id: String,
    quantite: Number
  }],
  client_id: String,
  prix_total: Number,
  statut: { type: String, default: "En attente" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Commande", commandeSchema);
