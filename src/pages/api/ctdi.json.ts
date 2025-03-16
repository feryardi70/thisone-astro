import type { APIRoute } from "astro";
import { verifyToken } from "../../lib/generateToken";
import { randstr } from "../../lib/randstr";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("auth_token")?.value;
  // const body = await request.json();
  // const { email, password } = body;

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
  const resp = await fetch(`https://thisone.my.id/api/ctdi.php`, {
    // const resp = await fetch(`http://localhost/api/ctdi.php`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
  });
  const dataCTDI = await resp.json();
  const data = dataCTDI.data;
  //console.log(data);

  return new Response(
    JSON.stringify({
      msg: "success",
      data: data,
    }),
    { status: 200 }
  );
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("auth_token")?.value;
  const body = await request.json();
  const { id, databaseId, parameter_uji, instansi, data_pesawat, CTDI_Vol_ukur, CTDI_Vol_konsol, deviasi, tanggal_uji } = body;

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
  const payload = {
    id,
    databaseId,
    parameter_uji,
    instansi,
    data_pesawat,
    CTDI_Vol_ukur,
    CTDI_Vol_konsol,
    deviasi,
    tanggal_uji,
  };
  const resp = await fetch(`https://thisone.my.id/api/ctdi.php`, {
    // const resp = await fetch(`http://localhost/api/ctdi.php`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
    body: JSON.stringify(payload),
  });
  const dataCTDI = await resp.json();
  //const data = dataCTDI.data;
  console.log(dataCTDI);

  return new Response(
    JSON.stringify({
      msg: "success",
      //data: data,
    }),
    { status: 200 }
  );
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("auth_token")?.value;
  const body = await request.json();
  const { parameter_uji, instansi, data_pesawat, CTDI_Vol_ukur, CTDI_Vol_konsol, deviasi, tanggal_uji } = body;

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
  const databaseId = randstr();
  const payload = {
    databaseId,
    parameter_uji,
    instansi,
    data_pesawat,
    CTDI_Vol_ukur,
    CTDI_Vol_konsol,
    deviasi,
    tanggal_uji,
  };

  const resp = await fetch(`https://thisone.my.id/api/ctdi.php`, {
    // const resp = await fetch(`http://localhost/api/ctdi.php`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
    body: JSON.stringify(payload),
  });
  const dataCTDI = await resp.json();
  //const data = dataCTDI.data;
  console.log(dataCTDI);

  return new Response(
    JSON.stringify({
      msg: "success",
      //data: data,
    }),
    { status: 201 }
  );
};
