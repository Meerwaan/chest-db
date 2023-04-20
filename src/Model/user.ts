import { ObjectId } from "mongodb";

interface User {
  id: ObjectId;
  nom: string;
  email: string;
  motDePasse: string;
  friends: ObjectId[];
}

export default User;
