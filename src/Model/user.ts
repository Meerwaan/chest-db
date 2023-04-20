import { ObjectId } from "mongodb";

interface User {
  nom: string;
  email: string;
  motDePasse: string;
  friends: ObjectId[];
}

export default User;
