import express, { type Express } from 'express';

const app: Express = express();

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, (err?: Error) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});

// Basic root route so GET / doesn't 404
app.get('/', (_req, res) => {
  res.status(200).send('lol');
});

export default app;
