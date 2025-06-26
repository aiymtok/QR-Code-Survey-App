const express = require('express');
const mariadb = require('mariadb');
const QRCode = require('qrcode');
const app = express();
const port = 3000;

const pool = mariadb.createPool({
  host: 'db-service', 
  user: 'root',
  password: '',
  database: 'survey_db',
  connectionLimit: 5,
  connectTimeout: 5000,         
  acquireTimeout: 10000,        
  waitForConnections: true,      
  idleTimeout: 10000         
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', async (req, res) => {
  const { question } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO surveys (question, yes_count, no_count) VALUES (?, 0, 0)',
      [question]
    );
    const surveyId = result.insertId;
    const voteUrl = `http://${req.headers.host}/vote/${surveyId}`;
    console.log(voteUrl);
    const qrCode = await QRCode.toDataURL(voteUrl);
    res.render('survey', {
        question: question,
        qrCode: qrCode,
        surveyId: surveyId
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating survey');
  } finally {
    if (conn) conn.release();
  }
});

app.get('/vote/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT question FROM surveys WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send('Survey not found');
    res.render('vote', { surveyId: id, question: rows[0].question });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading survey');
  } finally {
    if (conn) conn.release();
  }
});

app.post('/vote/:id', async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!['yes', 'no'].includes(answer)) {
    return res.status(400).send('Invalid vote option');
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const field = answer === 'yes' ? 'yes_count' : 'no_count';
    await conn.query(`UPDATE surveys SET ${field} = ${field} + 1 WHERE id = ?`, [id]);
    res.redirect(`/results/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting vote');
  } finally {
    if (conn) conn.release();
  }
});

app.get('/results/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT question, yes_count, no_count FROM surveys WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).send('Survey not found');
    const { question, yes_count, no_count } = rows[0];
    res.render('results', {
      question,
      yes_count: Number(yes_count),
      no_count: Number(no_count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading results');
  } finally {
    if (conn) conn.release();
  }
});

app.get('/', (req, res) => {
  res.redirect('/create');
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

pool.getConnection()
  .then(conn => {
    return conn.query("SELECT 1")
      .then(res => {
        console.log("DB connection OK:", res);
        conn.release(); 
      })
      .catch(err => {
        console.error("Query error:", err);
        conn.release();
      });
  })
  .catch(err => {
    console.error("Connection error:", err);
  });

