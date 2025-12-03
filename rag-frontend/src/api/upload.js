const API_URL = `${import.meta.env.VITE_BACKEND_URL}/upload`;

export async function uploadFile(formData) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  return await res.json();
}
