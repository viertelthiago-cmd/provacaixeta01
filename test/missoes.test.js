import request from "supertest";
import { jest } from "@jest/globals";
import app from "../app.js";

// ---------- GET /missoes ----------

test("GET /missoes retorna 200 e um array com pelo menos 5 itens", async () => {
    const resposta = await request(app).get("/missoes");

    expect(resposta.status).toBe(200);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(resposta.body)).toBe(true);
    expect(resposta.body.length).toBeGreaterThanOrEqual(5);
});

test("GET /missoes filtra missoes pelo nome", async () => {
    const resposta = await request(app).get("/missoes")
        .query({ nome: "Ancião" });

    expect(resposta.status).toBe(200);
    expect(resposta.body.length).toBeGreaterThan(0);
    resposta.body.forEach(missao => {
        expect(missao.nome.toLowerCase()).toContain("ancião");
    });
});

test("GET /missoes retorna array vazio quando o nome nao existe", async () => {
    const resposta = await request(app).get("/missoes")
        .query({ nome: "naoexiste123" });

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual([]);
});

// ---------- GET /missoes/:id ----------

test("GET /missoes/:id retorna 200 com a missao correta", async () => {
    const resposta = await request(app).get("/missoes/1");

    expect(resposta.status).toBe(200);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body.id).toBe(1);
    expect(resposta.body.nome).toBe("Ancião");
});

test("GET /missoes/:id retorna 404 para ID inexistente", async () => {
    const resposta = await request(app).get("/missoes/9999");

    expect(resposta.status).toBe(404);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body).toHaveProperty("error");
});

// ---------- POST /missoes ----------

test("POST /missoes cria uma nova missao e retorna 201 com id", async () => {
    const resposta = await request(app).post("/missoes")
        .send({ nome: "Artemis III", agencia: "NASA", ano: "2027", status: "Planejada" });

    expect(resposta.status).toBe(201);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body).toHaveProperty("id");
    expect(resposta.body.nome).toBe("Artemis III");
    expect(resposta.body.agencia).toBe("NASA");
    expect(resposta.body.ano).toBe("2027");
    expect(resposta.body.status).toBe("Planejada");
});

test("POST /missoes retorna 400 quando falta o nome", async () => {
    const resposta = await request(app).post("/missoes")
        .send({ agencia: "NASA", ano: "2027", status: "Planejada" });

    expect(resposta.status).toBe(400);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body).toHaveProperty("error");
});

test("POST /missoes retorna 400 quando falta a agencia", async () => {
    const resposta = await request(app).post("/missoes")
        .send({ nome: "Teste", ano: "2027", status: "Planejada" });

    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty("error");
});

test("POST /missoes retorna 400 quando falta o ano", async () => {
    const resposta = await request(app).post("/missoes")
        .send({ nome: "Teste", agencia: "NASA", status: "Planejada" });

    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty("error");
});

test("POST /missoes retorna 400 quando falta o status", async () => {
    const resposta = await request(app).post("/missoes")
        .send({ nome: "Teste", agencia: "NASA", ano: "2027" });

    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty("error");
});

test("POST /missoes retorna 400 com corpo vazio", async () => {
    const resposta = await request(app).post("/missoes").send({});

    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty("error");
});

// ---------- PUT /missoes/:id ----------

test("PUT /missoes/:id atualiza a missao e retorna 200", async () => {
    const criada = await request(app).post("/missoes")
        .send({ nome: "Para atualizar", agencia: "NASA", ano: "2030", status: "pendente" });

    const resposta = await request(app).put(`/missoes/${criada.body.id}`)
        .send({ nome: "Atualizada", agencia: "ESA", ano: "2031", status: "concluido" });

    expect(resposta.status).toBe(200);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body.id).toBe(criada.body.id);
    expect(resposta.body.nome).toBe("Atualizada");
    expect(resposta.body.agencia).toBe("ESA");
    expect(resposta.body.ano).toBe("2031");
    expect(resposta.body.status).toBe("concluido");
});

test("PUT /missoes/:id mantem os campos que nao foram enviados", async () => {
    const criada = await request(app).post("/missoes")
        .send({ nome: "Parcial", agencia: "NASA", ano: "2030", status: "pendente" });

    const resposta = await request(app).put(`/missoes/${criada.body.id}`)
        .send({ status: "concluido" });

    expect(resposta.status).toBe(200);
    expect(resposta.body.status).toBe("concluido");
    expect(resposta.body.nome).toBe("Parcial");
    expect(resposta.body.agencia).toBe("NASA");
});

test("PUT /missoes/:id retorna 404 para ID inexistente", async () => {
    const resposta = await request(app).put("/missoes/9999")
        .send({ nome: "Teste" });

    expect(resposta.status).toBe(404);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body).toHaveProperty("error");
});

// ---------- DELETE /missoes/:id ----------

test("DELETE /missoes/:id remove a missao e retorna 204", async () => {
    const criada = await request(app).post("/missoes")
        .send({ nome: "Para remover", agencia: "NASA", ano: "2030", status: "pendente" });

    const resposta = await request(app).delete(`/missoes/${criada.body.id}`);

    expect(resposta.status).toBe(204);
});

test("DELETE /missoes/:id retorna 404 para ID inexistente", async () => {
    const resposta = await request(app).delete("/missoes/9999");

    expect(resposta.status).toBe(404);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body).toHaveProperty("error");
});

test("DELETE /missoes/:id a missao nao e mais encontrada apos a remocao", async () => {
    const criada = await request(app).post("/missoes")
        .send({ nome: "Sumir", agencia: "NASA", ano: "2030", status: "pendente" });

    await request(app).delete(`/missoes/${criada.body.id}`);
    const resposta = await request(app).get(`/missoes/${criada.body.id}`);

    expect(resposta.status).toBe(404);
});

// ---------- GET /previsao (fetch simulado) ----------

test("GET /previsao retorna 200 com o clima atual", async () => {
    const clima = { temperature: 22.5, windspeed: 10, weathercode: 1 };
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
        json: async () => ({ current_weather: clima })
    });

    const resposta = await request(app).get("/previsao")
        .query({ lat: -26.3, lon: -48.8 });

    expect(resposta.status).toBe(200);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body).toEqual(clima);
    expect(fetchMock.mock.calls[0][0]).toContain("latitude=-26.3");
    expect(fetchMock.mock.calls[0][0]).toContain("longitude=-48.8");

    fetchMock.mockRestore();
});

test("GET /previsao retorna 502 quando o servico externo falha", async () => {
    const fetchMock = jest.spyOn(globalThis, "fetch")
        .mockRejectedValue(new Error("falha de rede"));

    const resposta = await request(app).get("/previsao")
        .query({ lat: 1, lon: 1 });

    expect(resposta.status).toBe(502);
    expect(resposta.headers["content-type"]).toMatch(/json/);
    expect(resposta.body).toHaveProperty("erro");

    fetchMock.mockRestore();
});
