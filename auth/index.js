const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const Utilisateur = require("./Utilisateur");

mongoose.connect("mongodb://localhost:27017/auth-microservice");
const SECRET = "SECRET_JWT";

// Enregistrement
app.post("/auth/register", async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;
  const hash = await bcrypt.hash(mot_de_passe, 10);

  try {
    const user = new Utilisateur({ nom, email, mot_de_passe: hash });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: "Utilisateur existe déjà" });
  }
});

// Connexion
app.post("/auth/login", async (req, res) => {
  const { email, mot_de_passe } = req.body;
  const user = await Utilisateur.findOne({ email });

  if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// Profil
app.get("/auth/profil", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requis" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await Utilisateur.findById(decoded.id);
    res.json(user);
  } catch (e) {
    res.status(401).json({ message: "Token invalide" });
  }
});

app.listen(3004, () => console.log("Auth service sur le port 3004"));
