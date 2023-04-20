import { ObjectId } from "mongodb";

interface User {
  nom: string;
  email: string;
  motDePasse: string;
  friends: string[];
  games: { name: string, price: number }[];
}


export default User;
