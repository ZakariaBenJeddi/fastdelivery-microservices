const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
  nom: String,
  description: String,
  prix: Number,
  stock: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Produit", produitSchema);
