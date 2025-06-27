import type { APIRoute } from "astro";
import { generateToken } from "../../lib/generateToken";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  //console.log(request);
  const referer = request.headers.get("referer") || "";
  const origin = request.headers.get("origin") || "";
  //console.log("Referer:", referer);

  if(referer !== "http://thisone.my.id/") {
    return new Response(
      JSON.stringify({
        msg: "unauthorized",
      }),
      { status: 401 },
    );
  }

  const token = generateToken();
  //console.log("Generated Token:", token);

  return new Response(
    JSON.stringify({
      msg: "success",
    }),
    { status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Set-Cookie": `contactToken=${token}; Path=/; HttpOnly; Max-Age=900`,
        },
    }
  );
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
