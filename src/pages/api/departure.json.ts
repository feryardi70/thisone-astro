import type { APIRoute } from "astro";
//import { getStore } from '@netlify/blobs';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  //console.log(context.request);
  //const urlParams = new URL(context.url);
  //const key = urlParams.searchParams.get('key');
  const departures = [{ _id: "670d3779e22aa936c07553e8", airline: "IW", flightnumber: 1265, destination: "Medan", departdate: "2024-10-15", departtime: "06:15", gate: "01", remark: "Delay", __v: 0 }];

  return new Response(
    JSON.stringify({
      msg: "success",
      data: departures,
    }),
    { status: 200 }
  );
};
