import { User } from '../db/class/User';
import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Bonjour le monde!' });
});

router.post('/adduser', (req, res) => {
  const { nom, email, motDePasse } = req.body;
  const newUser = new User({ nom, email, motDePasse }); // création d'une instance de User
  newUser.save()
    .then(() => res.json({ message: 'Utilisateur créé avec succès.' }))
    .catch(error => res.status(400).json({ error }));
});

export default router;
