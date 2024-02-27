import type { Express, Request, Response } from 'express';
import express from 'express';

const app: Express = express();
const port = 3001;

app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
