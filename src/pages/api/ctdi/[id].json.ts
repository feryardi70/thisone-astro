import type { APIRoute } from "astro";
import { verifyToken } from "../../../lib/generateToken";
import { deleteCTDIData, getCTDIDataByDatabaseId } from "../../data-access/ctdiDAL";

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

  const result = await deleteCTDIData(id);
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
