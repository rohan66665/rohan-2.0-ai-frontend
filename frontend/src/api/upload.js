export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload/image`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.status || data;
}
