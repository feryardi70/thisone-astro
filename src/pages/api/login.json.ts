import { type APIRoute } from "astro";
import { generateAuthToken, verifyToken } from "../../lib/generateToken";
import { serialize } from "cookie";
import { baseUrl } from "../../lib/baseUrl";
import { getUserByEmail } from "../data-access/userDAL";
import { signInWithEmailnPassword } from "../../lib/signIn";

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

  const result = await signInWithEmailnPassword(email, password);

  if (result.error === "user not found") {
    return new Response(JSON.stringify({ msg: "User not found" }), { status: 404 });
  }

  if (result.error === "wrong password") {
    return new Response(JSON.stringify({ msg: "Unauthorized" }), { status: 401 });
  }

  const dbuser = result.user;

  const authToken = generateAuthToken(dbuser.email, dbuser.user_role);
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize("auth_token", authToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
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
