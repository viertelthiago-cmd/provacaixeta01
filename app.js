import express from "express";
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

// app.js (trecho)
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const Missoes = [
    {
        id: 1,
        nome: "Ancião",
        agencia: "Proteção intergalatica",
        ano: "3000",
        status: "pendente"
    },
    {
        id: 2,
        nome: "Ades",
        agencia: "Interdiciplinares",
        ano: "1585",
        status: "pendente"
    },
    {
        id: 3,
        nome: "Divine",
        agencia: "Nasa",
        ano: "3651",
        status: "concluido"
    },
    {
        id: 4,
        nome: "Zeus",
        agencia: "Sky-fall",
        ano: "6000",
        status: "concluido"
    },
    {
        id: 5,
        nome: "Cyber",
        agencia: "Find-space",
        ano: "5621521",
        status: "pendente"
    }
]




/**
 * @openapi
 * /missoes:
 *   get:
 *     summary: Lista Missoes
 *     description: Retorna as todas as missoes 
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra as missoes pelo nome
 *     responses:
 *       200:
 *         description: Lista de missoes retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   autor:
 *                     type: string
 *                   disponivel:
 *                     type: boolean
 */
app.get('/missoes', (req, res) => {
    const nome = req.query?.nome || null
    let Missoesfiltrados = null
    if (nome !== null) {
        Missoesfiltrados = Missoes.filter(item => item.nome.toLowerCase()
            .includes(nome.toLowerCase()));
    }
    Missoesfiltrados = Missoesfiltrados ?? Missoes;
    res.status(200).json(Missoesfiltrados);
});



/**
 * @openapi
 * /missoes/{id}:
 *   get:
 *     summary: Busca uma missao pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Missão encontrado
 *       404:
 *         description: Missão não encontrado
 */

app.get('/missoes/:id', (req, res) => {
    const id = Number(req.params?.id);

    const dados = Missoes.find(item => item.id === id);

    if (!dados) {
        return res.status(404).json({

            error: "Missao nao encontrada"

        })
    }

    res.status(200).json(

        dados

    );

});

/**
 * @openapi
 * /missoes:
 *   post:
 *     summary: Criar uma nova missão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - nome
 *                - agencia
 *                - ano
 *                - status
 *             properties:
 *               nome:
 *                 type: string
 *               agencia:
 *                 type: string
 *               ano:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: true
 *     responses:
 *       201:
 *         description: Missao criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

app.post('/missoes', (req, res) => {

    const nome = req.body?.nome || null;
    const agencia = req.body?.agencia || null;
    const ano = req.body?.ano || null;
    const status = req.body?.status || null;


    if (!nome) {
        return res.status(400).json({

            error: "Nome é obrigatorio"

        })
    }

    if (!agencia) {
        return res.status(400).json({

            error: "O nome da agencia é obrigatório"

        })
    }

    if (!ano) {
        return res.status(400).json({

            error: "O ano da missão é obrigatório"

        })
    }


    if (!status) {
        return res.status(400).json({

            error: "O status da missão  é obrigatório"

        })
    }

    const novaMissao = {

        id: Missoes.length + 1,

        nome: nome,

        agencia: agencia,

        ano: ano,

        status: status

    }

    Missoes.push(novaMissao);

    res.status(201).json(

        novaMissao

    );

});


/**
 * @openapi
 * /missoes/{id}:
 *   put:
 *     summary: Atualizar uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Memórias Póstumas de Brás Cubas
 *               agencia:
 *                 type: string
 *               ano:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: Machado de Assis
 *               disponivel:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Missão atualizada com sucesso
 *       404:
 *         description: Missão não encontrado
 */

app.put('/missoes/:id', (req, res) => {
    const id = Number(req.params.id);
    const dados = Missoes.find(item => item.id === id);
    if (!dados) {
        return res.status(404).json({

            error: "Missão não encontrado"

        })
    }

    if (req?.body?.nome && req.body.nome !== "") {
        dados.nome = req.body.nome;
    }

    if (req?.body?.agencia && req.body.agencia !== "") {
        dados.agencia = req.body.agencia;
    }
 
    if (req?.body?.ano && req.body.ano !== "") {
        dados.ano = req.body.ano;
    }
 
    if (req?.body?.status && req.body.status !== "") {
        dados.status = req.body.status;
    }
 
    res.status(200).json(dados)

});


/**
 * @openapi
 * /missoes/{id}:
 *   delete:
 *     summary: Exclui uma missao pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Missao excluida com sucesso
 *       404:
 *         description: Missão não encontrado
 */
app.delete('/missoes/:id', (req, res) =>{
    const id = Number(req.params.id);
    const indice = Missoes.findIndex(item => item.id === id)

    if(indice === -1){
        return res.status(404).json({ error: "Missão não encontrado" })
    }

    Missoes.splice(indice, 1);

    res.status(204).send(
    
        'Missão deletada com sucesso'
    
    )

});

/**
 * @openapi
 * /previsao:
 *   get:
 *     summary: Criar uma nova missão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - lat
 *                - lon
 *             properties:
 *               lat:
 *                 type: integer
 *               lon:
 *                 type: integer
 *                 example: true
 *     responses:
 *       201:
 *         description: Previsão do tempo encontrada
 *       400:
 *         description: Previsão não encontrada
 */
app.get('/previsao', async (req, res) => {
  const { lat, lon } = req.query;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    res.status(200).json(dados.current_weather);
  } catch (erro) {
    res.status(502).json({ erro: 'Falha ao consultar serviço de previsão do tempo' });
  }
});



export default app