import { getUserByEmail } from "../pages/data-access/userDAL";
import checkPass from "./bcompare";

export async function signInWithEmailnPassword(email, password) {
  const dataUser = await getUserByEmail(email);
  const dbuser = dataUser.data;

  if (!dbuser) {
    return { error: "user not found" };
  }

  const pwMatch = checkPass(password, dbuser.hashpass);
  if (!pwMatch) {
    return { error: "wrong password" };
  }

  return { user: dbuser };
}
