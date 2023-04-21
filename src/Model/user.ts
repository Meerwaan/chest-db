import { ObjectId } from "mongodb";

interface User {
  nom: string;
  email: string;
  motDePasse: string;
  friends: string[];
  games: { name: string; price: number }[];
  coins: number;
}

export default User;
