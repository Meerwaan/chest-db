import express, { Request, Response } from 'express';

const app = express();

app.get('/data', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});



