export const BASE_URL = "http://localhost:4000";

async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    const headers = options.headers || {};
    headers["Content-Type"] = "application/json";

    // Adiciona o token automaticamente
    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    const res = await fetch(url, config);

    // Se der erro
    if (!res.ok) {

        // Não faz logout automático!
        // Apenas lança o erro de 401 e deixa a interface mostrar o problema
        if (res.status === 401) {
            throw new Error("401 - Não autorizado. O servidor recusou o token.");
        }

        const text = await res.text();

        try {
            const jsonError = JSON.parse(text);
            throw new Error(jsonError.message || res.statusText);
        } catch {
            throw new Error(text || res.statusText);
        }
    }

    // Caso DELETE (204 No Content)
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
        return request(`/api/${entity}`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    },
    update(entity, id, data) {
        return request(`/api/${entity}/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },
    remove(entity, id) {
        return request(`/api/${entity}/${id}`, {
            method: "DELETE"
        });
    },
    login(email, senha) {
        return request(`/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, senha })
        });
    },
    register(nome, email, senha) {
        return request(`/api/auth/register`, {
            method: "POST",
            body: JSON.stringify({ nome, email, senha })
        });
    }
};
