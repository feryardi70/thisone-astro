import { APIUrl } from "../../lib/baseUrl";
import { randstr } from "../../lib/randstr";

export async function getAllCTDIData(page) {
  const ctdiToken = import.meta.env.CTDI_SECRET;

  const resp = await fetch(`${APIUrl}/api/ctdi.php?page=${page}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
  });
  const dataCTDI = await resp.json();

  return dataCTDI;
}

export async function insertCTDIData(parameter_uji, instansi, data_pesawat, CTDI_Vol_ukur, CTDI_Vol_konsol, deviasi, tanggal_uji) {
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

  const resp = await fetch(`${APIUrl}/api/ctdi.php`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
    body: JSON.stringify(payload),
  });
  const dataCTDI = await resp.json();

  if (dataCTDI.msg == "berhasil menambahkan data baru") {
    return "success";
  } else {
    return "failed";
  }
}

export async function editCTDIDataByDatabaseId(id, databaseId, parameter_uji, instansi, data_pesawat, CTDI_Vol_ukur, CTDI_Vol_konsol, deviasi, tanggal_uji) {
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

  const resp = await fetch(`${APIUrl}/api/ctdi.php`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
    body: JSON.stringify(payload),
  });
  const dataCTDI = await resp.json();

  if (dataCTDI.msg == "berhasil mengubah data penerbangan") {
    return "success";
  } else {
    return "failed";
  }
}

export async function getCTDIDataByDatabaseId(id) {
  const ctdiToken = import.meta.env.CTDI_SECRET;

  const resp = await fetch(`${APIUrl}/api/ctdi.php?databaseId=${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
  });
  const dataCTDI = await resp.json();
  const ctdi = dataCTDI.data;

  return ctdi;
}

export async function deleteCTDIData(id) {
  const ctdiToken = import.meta.env.CTDI_SECRET;

  const resp = await fetch(`${APIUrl}/api/ctdi.php?id=${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${ctdiToken}`,
    },
  });
  const result = await resp.json();

  if (result.msg == "berhasil menghapus data") {
    return "success";
  } else {
    return "failed";
  }
}
