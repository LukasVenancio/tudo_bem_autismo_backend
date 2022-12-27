'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const indexRoutes = require('./routes/indexRoutes');

const routesGenero = require('./routes/routesGenero');
const routesNivelAutismo = require('./routes/routesNivelAutismo');
const routesResponsavel = require('./routes/routesResponsavel');
const routesCrianca = require('./routes/routesCrianca');
const routesMiniJogo = require('./routes/routesMiniJogo');
const routesSituacaoEscolha = require('./routes/routesSituacaoEscolha');
const routesRelatorio = require('./routes/routesRelatorio');
const routesPremiacao = require('./routes/routesPremiacao');
const routesGerenciamento = require('./routes/routesGerenciamento');
const routesBotaoApoio = require('./routes/routesBotaoApoio');
const routesIcone = require('./routes/routesIcone');
const routesDiaSemana = require('./routes/routesDiaSemana');
const routesTarefa = require('./routes/routesTarefa');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRoutes);
app.use('/genero', routesGenero);
app.use('/responsavel', routesResponsavel);
app.use('/crianca', routesCrianca);
app.use('/nivelAutismo', routesNivelAutismo);
app.use('/minijogo', routesMiniJogo);
app.use('/minijogo/situacaoescolha', routesSituacaoEscolha);
app.use('/relatorio', routesRelatorio);
app.use('/premiacao', routesPremiacao);
app.use('/gerenciamento', routesGerenciamento);
app.use('/botaoApoio', routesBotaoApoio);
app.use('/icone', routesIcone);
app.use('/diasemana', routesDiaSemana);
app.use('/tarefa', routesTarefa);

module.exports = app;