const express = require('express');
const app = express();

app.use(express.json());
app.get('/api', (req, res) => res.send('API funcionando'));

app.listen(4000, () => console.log('Servidor en puerto 4000'));
