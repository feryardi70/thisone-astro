import { APIUrl } from "../../lib/baseUrl";

export async function insertComment(nama, email, pesan) {
  const commentToken = import.meta.env.QUESTION_SECRET;
  
  const payload = {
    nama,
    email,
    pesan,
  };

  const resp = await fetch(`${APIUrl}/api/question.php`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${commentToken}`,
    },
    body: JSON.stringify(payload),
  });
  const dataComment = await resp.json();

  if (dataComment.msg == "berhasil menambahkan data baru") {
    return "success";
  } else {
    return "failed";
  }
}