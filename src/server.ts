import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, Collection } from "mongodb";
import Config from "dotenv";
import bcrypt from "bcrypt";
import User from "./Model/user";

const app = express();
const port = 3000;
const uri =
  "mongodb+srv://fayssal:fayssal@chest-game.ej0g82h.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let users: Collection<User>;

app.use(bodyParser.json());
app.use(cors());

try {
  client.connect();
  console.log("Connected to MongoDB.");
  const db = client.db("Chest-Game");
  users = db.collection<User>("users");

  // Écrivez le code de votre application ici
} catch (err) {
  console.log(err);
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/adduser", async (req, res) => {
  try {
    const user: User = {
      nom: req.body.nom,
      email: req.body.email,
      motDePasse: req.body.motDePasse,
    };
    const existingUser = await users.findOne({ email: user.email });
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé.");
    }

    user.motDePasse = await bcrypt.hash(user.motDePasse, 10);

    const result = await users.insertOne(user);
    res.status(201).json(`Utilisateur ajouté avec l'ID ${result.insertedId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur serveur");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
