import type { APIRoute } from "astro";
//import { verifyToken } from "../../../lib/generateToken";

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  const { id } = params;
  console.log(id);

  if (!id) {
    return new Response(
      JSON.stringify({
        message: "bad request",
      }),
      { status: 400 }
    );
  }

  const CTDIToken = import.meta.env.CTDI_SECRET;
  const resp = await fetch(`https://thisone.my.id/api/ctdi.php?databaseId=${id}`, {
    // const resp = await fetch(`http://localhost/api/ctdi.php?databaseId=${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${CTDIToken}`,
    },
  });
  const dataCTDI = await resp.json();
  const ctdi = dataCTDI.data;
  console.log(ctdi);

  return new Response(
    JSON.stringify({
      message: "success",
      data: ctdi,
    }),
    { status: 200 }
  );
};
