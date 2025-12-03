export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
}
