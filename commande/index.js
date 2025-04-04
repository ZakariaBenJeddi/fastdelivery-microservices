const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();
app.use(express.json());

const Commande = require("./Commande");

mongoose.connect("mongodb://localhost:27017/commande-microservice");

// Ajouter une commande
app.post("/commande/ajouter", async (req, res) => {
  const { produits, client_id } = req.body;
  let prix_total = 0;

  for (let item of produits) {
    const resProd = await axios.get(`http://localhost:3001/produit/${item.produit_id}`);
    const produit = resProd.data;

    if (!produit || produit.stock < item.quantite) {
      return res.status(400).json({ message: "Produit insuffisant ou non trouvé" });
    }

    prix_total += produit.prix * item.quantite;

    await axios.patch(`http://localhost:3001/produit/${item.produit_id}/stock`, {
      stock: produit.stock - item.quantite
    });
  }

  const commande = new Commande({ produits, client_id, prix_total });
  await commande.save();
  res.status(201).json(commande);
});

// Récupérer une commande
app.get("/commande/:id", async (req, res) => {
  const commande = await Commande.findById(req.params.id);
  if (!commande) return res.status(404).json({ message: "Commande non trouvée" });
  res.json(commande);
});

// Mettre à jour le statut
app.patch("/commande/:id/statut", async (req, res) => {
  const { statut } = req.body;
  const commande = await Commande.findByIdAndUpdate(req.params.id, { statut }, { new: true });
  if (!commande) return res.status(404).json({ message: "Commande non trouvée" });
  res.json(commande);
});

app.listen(3002, () => console.log("Commande service sur le port 3002"));