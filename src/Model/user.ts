import { ObjectId } from "mongodb";

interface User {
  id: ObjectId;
  nom: string;
  email: string;
  motDePasse: string;
}

export default User;
