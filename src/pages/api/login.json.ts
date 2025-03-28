import { type APIRoute } from "astro";
import { generateAuthToken, verifyToken } from "../../lib/generateToken";
import checkPass from "../../lib/bcompare";
import { serialize } from "cookie";
import { baseUrl, APIUrl } from "../../lib/baseUrl";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { email, password } = body;
  //console.log(password);

  if (!email || !password) {
    return new Response(
      JSON.stringify({
        msg: "bad request, missing data",
      }),
      { status: 400 }
    );
  }

  const token = cookies.get("logToken")?.value;
  //console.log(token);

  if (!token) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized",
      }),
      { status: 401 }
    );
  }

  const referer = request.headers.get("referer");
  //console.log(referer);
  if (referer !== `${baseUrl}/login`) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized",
      }),
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  //console.log(decoded);

  if (!decoded) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized, token was expired",
      }),
      { status: 401 }
    );
  }
  //const urlParams = new URL(context.url);
  //const key = urlParams.searchParams.get('key');
  const serverToken = import.meta.env.SERVER_TOKEN;

  const resp = await fetch(`${APIUrl}/api/user.php?email=${email}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${serverToken}`,
    },
  });
  const dataUser = await resp.json();
  const dbuser = dataUser.data;
  //console.log(dbuser.hashpass);

  if (!dbuser) {
    return new Response(
      JSON.stringify({
        msg: "User not found",
      }),
      { status: 404 }
    );
  }

  const pwMatch = checkPass(password, dbuser.hashpass);

  if (!pwMatch) {
    return new Response(
      JSON.stringify({
        msg: "unauthorized",
      }),
      { status: 401 }
    );
  }

  const authToken = generateAuthToken(dbuser.email, dbuser.user_role);
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize("auth_token", authToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    })
  );

  return new Response(JSON.stringify({ message: "Login successful" }), {
    status: 200,
    headers,
  });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize("auth_token", "LOGOUT", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 6,
    })
  );

  return new Response(JSON.stringify({ message: "Logout successful" }), {
    status: 200,
    headers,
  });
};
