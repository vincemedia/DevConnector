const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//https://www.udemy.com/course/mern-stack-front-to-back/learn/lecture/10055140#overview