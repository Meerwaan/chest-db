import { ObjectId } from "mongodb";

interface User {
  nom: string;
  email: string;
  motDePasse: string;
  friends: string[];
}

export default User;
