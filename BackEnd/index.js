const db = require('./conf/autenticacao.js');
const express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let methodOverride = require('method-override');
const app = express();
const port = 3000;

app.use(cors());            // permite que o front acesse o backend
app.use(express.json());

// Permite que você use verbos HTTP
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

// Corrigido: Access-Control-Allow-Origin (tava escrito errado)
app.use((req, resp, next) => {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROTEAMENTO PARA LISTAR TODOS OS CLIENTES
app.get('/clientes', async (req, res) => {
  const results = await db.selectFull();
  console.log(results);
  res.json(results);
});

// ROTEAMENTO PARA BUSCAR PELO ID
app.get('/clientes/:id', async (req, res) => {  
  const id = req.params.id;
  const results = await db.selectById(id);
  console.log(results);
  res.json(results);
});

// ROTEAMENTO PARA INSERIR
app.post('/clientes/', async (req, res) => { 
  const { Nome, Idade, UF } = req.body;
  const results = await db.insertCliente(Nome, Idade, UF);
  console.log(results);
  res.json(results);  
}); 

// ROTEAMENTO PARA ATUALIZAR
app.put('/clientes/:id', async (req, res) => {    
  const id = req.params.id;
  const { Nome, Idade, UF } = req.body;
  const results = await db.updateCliente(Nome, Idade, UF, id);
  console.log(results);
  res.json(results);  
}); 

// DELETAR PELO ID
app.delete('/clientes/:id', async (req, res) => { 
  const id = req.params.id;
  const results = await db.deleteById(id);
  console.log(results);
  res.json(results);
});

// RAIZ (opcional: pode devolver todos também)
app.get('/', async (req, res) => {
  res.send("API de Clientes rodando! Use /clientes");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
