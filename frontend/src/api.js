export const BASE_URL = "http://localhost:4000";

async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    const headers = options.headers || {}
    headers["Content-Type"] = "application/json"
    
    // 🚨 ADICIONADO: Desabilita o cache do navegador para evitar 304 Not Modified
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
    // -----------------------------------------------------------------------

    const token = localStorage.getItem("token")
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const config = {
        ...options,
        headers
    }

    const res = await fetch(url, config);

    
    if (!res.ok) {
        // ... (lógica de erro 401 e parsing de JSON) ...
        if (res.status === 401 && !url.includes('/login')) {
            localStorage.removeItem("token")
            window.location.href = "/login"
            return
        }

        const text = await res.text();

        try {
            const jsonError = JSON.parse(text)
            throw new Error(jsonError.message || res.statusText)
        } catch {
            throw new Error(text || res.statusText);
        }
    }

    // Garante que não tentamos ler JSON se o status for 204 ou resposta vazia
    if (res.status === 204 || res.headers.get("Content-Length") === '0') {
        return null;
    }

    return res.json();
}

export const api = {
    list(entity) {
        return request(`/api/${entity}`);
    },
    get(entity, id) {
        return request(`/api/${entity}/${id}`);
    },
    // 🚨 NOVO MÉTODO: Usado para endpoints que não seguem o padrão /entidade/id
    read(path) {
        return request(path);
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
    login(email, senha) {
        return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
    },
    register(nome, email, senha) {
        return request('/api/auth/register', { method: 'POST', body: JSON.stringify({ nome, email, senha }) });
    },
    // 🚨 CORRIGIDO: Agora usa a rota correta do resumo geral (sem o /api, pois o request já adiciona)
    getDashboard() {
        return request('/api/relatorios/resumo-geral');
    }
};
