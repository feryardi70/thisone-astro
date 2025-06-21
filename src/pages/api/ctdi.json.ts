import type { APIRoute } from "astro";
import { verifyToken } from "../../lib/generateToken";
import { editCTDIDataByDatabaseId, getAllCTDIData, getCTDIDataByDatabaseId, insertCTDIData } from "../data-access/ctdiDAL";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page"); // Default to 1 if missing
  //console.log("Page:", page);
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

  const dataCTDI = await getAllCTDIData(page);
  //console.log(dataCTDI);

  return new Response(
    JSON.stringify({
      msg: "success",
      data: dataCTDI,
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

  const findCTDI = await getCTDIDataByDatabaseId(databaseId);
  //console.log(findCTDI);
  if (findCTDI == "Data not found") {
    return new Response(
      JSON.stringify({
        msg: "Bad request",
      }),
      { status: 400 }
    );
  }

  const statusEdit = await editCTDIDataByDatabaseId(id, databaseId, parameter_uji, instansi, data_pesawat, CTDI_Vol_ukur, CTDI_Vol_konsol, deviasi, tanggal_uji);
  //console.log(dataCTDI);

  if (statusEdit == "success") {
    return new Response(
      JSON.stringify({
        msg: "success",
        //data: data,
      }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({
        msg: "database problem",
        //data: data,
      }),
      { status: 500 }
    );
  }
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

  const statusCTDI = await insertCTDIData(parameter_uji, instansi, data_pesawat, CTDI_Vol_ukur, CTDI_Vol_konsol, deviasi, tanggal_uji);
  //console.log(statusCTDI);

  if (statusCTDI == "success") {
    return new Response(
      JSON.stringify({
        msg: "success",
        //data: data,
      }),
      { status: 201 }
    );
  } else {
    return new Response(
      JSON.stringify({
        msg: "database problem",
        //data: data,
      }),
      { status: 500 }
    );
  }
};
