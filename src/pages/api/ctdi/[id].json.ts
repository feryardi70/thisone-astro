import type { APIRoute } from "astro";
//import { APIUrl } from "../../../lib/baseUrl";
import { verifyToken } from "../../../lib/generateToken";
import { deleteCTDIData, getCTDIDataByDatabaseId } from "../data-access/ctdiDAL";

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  const { id } = params;
  //console.log(id);

  if (!id) {
    return new Response(
      JSON.stringify({
        message: "bad request",
      }),
      { status: 400 }
    );
  }

  // const CTDIToken = import.meta.env.CTDI_SECRET;
  // const resp = await fetch(`${APIUrl}/api/ctdi.php?databaseId=${id}`, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${CTDIToken}`,
  //   },
  // });
  // const dataCTDI = await resp.json();
  const ctdi = await getCTDIDataByDatabaseId(id);
  //console.log(ctdi);

  return new Response(
    JSON.stringify({
      message: "success",
      data: ctdi,
    }),
    { status: 200 }
  );
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const { id } = params;
  //console.log(id);

  if (!id) {
    return new Response(
      JSON.stringify({
        message: "bad request",
      }),
      { status: 400 }
    );
  }

  const token = cookies.get("auth_token")?.value;
  if (!token) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized",
      }),
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized, token was expired",
      }),
      { status: 401 }
    );
  }

  //const CTDIToken = import.meta.env.CTDI_SECRET;
  // const resp = await fetch(`${APIUrl}/api/ctdi.php?id=${id}`, {
  //   method: "DELETE",
  //   headers: {
  //     Authorization: `Bearer ${CTDIToken}`,
  //   },
  // });
  const result = await deleteCTDIData(id);
  //const ctdi = result.data;
  //console.log(result);

  if (result == "success") {
    return new Response(
      JSON.stringify({
        message: "success",
      }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({
        message: "failed",
      }),
      { status: 500 }
    );
  }
};
