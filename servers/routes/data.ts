import { User } from "../db/class/User";
import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Bonjour le monde!" });
});

router.post("/adduser", (req, res) => {
  console.log(req.body);
  const { nom, email, motDePasse } = req.body;
  console.log(nom, email, motDePasse);
  const user = new User({
    nom: req.body.nom,
    email: req.body.email,
    motDePasse: req.body.motDePasse,
  });
  console.log(user);
  user.save({ w: "majority", wtimeout: 30000 });
});

export default router;
