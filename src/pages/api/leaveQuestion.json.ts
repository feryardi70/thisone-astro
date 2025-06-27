import type { APIRoute } from "astro";
import { verifyToken } from "../../lib/generateToken";
import { insertComment } from "../data-access/lquestionDAL";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  //console.log(request);
  //const referer = request.headers.get("referer") || "";
  const origin = request.headers.get("origin") || "";
  const token = cookies.get("contactToken")?.value;
  const body = await request.json();
  const { nama, email, pesan } = body;
  //console.log("Referer:", referer);
  //console.log("Origin:", origin);
  //console.log("Token:", token);
  //console.log("Body:", body);

  if (!token) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized",
      }),
      { status: 401,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
            }, }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized, token was expired",
      }),
      { status: 401,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
            }, }
    );
  }

  const statusComment = await insertComment(nama, email, pesan);

  if(statusComment == 'success'){
      return new Response(
        JSON.stringify({
          msg: "success",
        }),
        { status: 201,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
            },
        }
      );
  } else{
    return new Response(
        JSON.stringify({
          msg: "failed to insert comment",
        }),
        { status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
            },
        }
      );
  }

};

// Handle preflight requests
export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get("origin") || "";

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
};
