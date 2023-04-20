import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, Collection } from "mongodb";
import Config from "dotenv";
import bcrypt from "bcrypt";
import User from "./Model/user";
import nodemailer from "nodemailer";

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
      id: req.body.id,
      nom: req.body.nom,
      email: req.body.email,
      motDePasse: req.body.motDePasse,
      friends: [],
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

app.post("/login", async (req, res) => {
  // Extraire les données de la requête

  try {
    const user: User = {
      id: req.body.id,
      nom: req.body.nom,
      email: req.body.email,
      motDePasse: req.body.motDePasse,
      friends: [],
    };

    console.log(req.body.email);
    console.log(req.body.motDePasse);
    // Rechercher l'utilisateur par email
    const login = await users.findOne({ email: req.body.email });

    console.log(login);
    // Vérifier si l'utilisateur existe
    if (!login) {
      throw new Error("L'utilisateur n'existe pas");
    }

    // Vérifier le mot de passe
    const match = await bcrypt.compare(req.body.motDePasse, login.motDePasse);
    if (!match) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    // Envoyer la réponse
    res.status(200).send(login);
  } catch (err) {
    console.log(err);
    res.status(401).send("Authentification échouée.");
  }
});

// Définition de la route
app.post("/forgotPassword", async (req, res) => {
  try {
    // Extraire les données de la requête
    const to = req.body.email;
    console.log(to);
    const login = await users.findOne({ email: to });
    if (!login) {
      throw new Error("L'utilisateur n'existe pas");
    }
    console.log(login);

    // Vérifier que les données requises sont fournies
    if (!to) {
      throw new Error("Tous les champs sont requis.");
    }

    let testAccount = await nodemailer.createTestAccount();
    // Créer un transporteur SMTP pour Nodemailer
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Définir le contenu du mail
    let info = await transporter.sendMail({
      from: testAccount, // sender address
      to: "fayssalmechmeche.pro@gmail.com", // list of receivers
      subject: "Réinialisation du mot de passe", // Subject line
      text: "Réinialisation du mot de passe", // plain text body
      html: `<a href='http://localhost:3001/password/${to}'>Réinitialisation du mot de passe</a>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur serveur.");
  }
});

app.post("/resetPassword", async (req, res) => {
  try {
    // Extraire les données de la requête
    const email = req.body.email;
    console.log(email);
    const password = req.body.password;

    // Vérifier que les données requises sont fournies
    if (!password) {
      throw new Error("Tous les champs sont requis.");
    }

    // Rechercher l'utilisateur par ID
    const user = await users.findOne({ email: email });

    // Vérifier si l'utilisateur existe
    if (!user) {
      throw new Error("L'utilisateur n'existe pas.");
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await users.updateOne(
      { email: email },
      { $set: { motDePasse: hashedPassword } }
    );
    console.log(newUser);

    // Envoyer la réponse
    res.status(200).send("Mot de passe mis à jour.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur serveur.");
  }
});

app.post("/addfriend", async (req, res) => {
  try {
    const nom = req.body.nom;
    const id = req.body.id;
    console.log(nom);

    const user = await users.findOne({ nom: nom });

    if (!user) {
      throw new Error("L'utilisateur n'existe pas.");
    }

    const newFriend = await users.updateOne(
      { id: id },
      { $push: { friends: user.id } }
    );
    console.log(newFriend);
    res.status(200).send("Ami ajouté.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur serveur.");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
