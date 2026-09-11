const express = require('express');
const cors = require('cors');
require('dotenv').config();

const validacaoRoutes = require('./routes/validacao');
const { router: leadsRoutes } = require('./routes/leads');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/validacao', validacaoRoutes);
app.use('/api/leads', leadsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});