const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'creator_dashboard';

app.use(bodyParser.json());

MongoClient.connect(MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  const db = client.db(DB_NAME);

  // API endpoint to receive data and store it in the database
  app.post('/api/creators', (req, res) => {
    const data = req.body;
    db.collection('creators').insertOne(data, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
      } else {
        res.status(201).json({ message: 'Data inserted successfully', data: result.ops[0] });
      }
    });
  });

  // API endpoint to retrieve all creators
  app.get('/api/creators', (req, res) => {
    db.collection('creators')
      .find()
      .toArray((err, data) => {
        if (err) {
          console.error('Error fetching data:', err);
          res.status(500).send('Error fetching data');
        } else {
          res.json(data);
        }
      });
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
