const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();
app.use(express.json());
const Livraison = require("./Livraison");
mongoose.connect("mongodb://localhost:27017/livraison-microservice");



// Ajouter une livraison
app.post("/livraison/ajouter", async (req, res) => {
  const { commande_id, transporteur_id, adresse_livraison } = req.body;

  try {
    const resCommande = await axios.get(`http://localhost:3002/commande/${commande_id}`);
    if (!resCommande.data) return res.status(404).json({ message: "Commande introuvable" });
  } catch (e) {
    return res.status(404).json({ message: "Commande introuvable" });
  }

  const livraison = new Livraison({ commande_id, transporteur_id, adresse_livraison });
  await livraison.save();
  res.status(201).json(livraison);
});

// Mise à jour du statut
app.put("/livraison/:id", async (req, res) => {
  const { statut } = req.body;
  const livraison = await Livraison.findByIdAndUpdate(req.params.id, { statut }, { new: true });
  if (!livraison) return res.status(404).json({ message: "Livraison non trouvée" });
  res.json(livraison);
});

app.listen(3003, () => console.log("Livraison service sur le port 3003"));