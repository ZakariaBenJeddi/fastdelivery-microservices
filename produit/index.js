const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const Produit = require("./Produit");
mongoose.connect("mongodb://localhost:27017/produit-microservice");

app.post("/produit/ajouter", async (req, res) => {
  const produit = new Produit(req.body);
  await produit.save();
  res.status(201).json(produit);
});

// Récupérer un produit par ID
app.get("/produit/:id", async (req, res) => {
  const produit = await Produit.findById(req.params.id);
  if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
  res.json(produit);
});

// Mettre à jour le stock d’un produit
app.patch('/produit/:id/stock', async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { new: true }
    );
    if (!produit) return res.status(404).send('Produit non trouvé');
    res.json(produit);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.listen(3001, () => console.log("Produit service sur le port 3001"));