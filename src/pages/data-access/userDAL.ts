import { APIUrl } from "../../lib/baseUrl";

export async function getUserByEmail(email) {
  const serverToken = import.meta.env.SERVER_TOKEN;

  const resp = await fetch(`${APIUrl}/api/user.php?email=${email}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${serverToken}`,
    },
  });
  const dataUser = await resp.json();

  return dataUser;
}
