export const BASE_URL = "http://localhost:3000"; // <-- ajuste aqui quando tiver o backend

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list(entity) {
    return request(`/api/${entity}`);
  },
  get(entity, id) {
    return request(`/api/${entity}/${id}`);
  },
  create(entity, data) {
    return request(`/api/${entity}`, { method: "POST", body: JSON.stringify(data) });
  },
  update(entity, id, data) {
    return request(`/api/${entity}/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  remove(entity, id) {
    return request(`/api/${entity}/${id}`, { method: "DELETE" });
  },
};
