import type { APIRoute } from "astro";
import { verifyToken } from "../../lib/generateToken";
import { APIUrl } from "../../lib/baseUrl";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  console.log(url);
  const page = url.searchParams.get("page"); // Default to 1 if missing
  const instansi = url.searchParams.get("instansi");
  const year = url.searchParams.get("year");

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

  const ctdiToken = import.meta.env.CTDI_SECRET;

  if (instansi) {
    const resp = await fetch(`${APIUrl}/api/ctdiSearch.php?instansi=${instansi}&page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ctdiToken}`,
      },
    });
    const dataCTDI = await resp.json();
    //const data = dataCTDI.data;
    //console.log(dataCTDI);

    return new Response(
      JSON.stringify({
        msg: "success",
        data: dataCTDI,
      }),
      { status: 200 }
    );
  } else if (year) {
    const resp = await fetch(`${APIUrl}/api/ctdiSearch.php?year=${year}&page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ctdiToken}`,
      },
    });
    const dataCTDI = await resp.json();
    //const data = dataCTDI.data;
    //console.log(dataCTDI);

    return new Response(
      JSON.stringify({
        msg: "success",
        data: dataCTDI,
      }),
      { status: 200 }
    );
  }
};
