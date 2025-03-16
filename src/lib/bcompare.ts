import { compareSync } from "bcrypt-ts";

function checkPass(password: string, dbpassword?: string): boolean {
  if (!password || !dbpassword) {
    console.error("Invalid arguments passed to compareSync.");
    return false;
  }

  return compareSync(password, dbpassword);
}

export default checkPass;
