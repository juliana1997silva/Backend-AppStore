import dotenv from "dotenv";
import path from "path";
import express from 'express';
import cors from 'cors';
import routes from './routes/clients';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use("/static", express.static(process.env.BASE_FOLDER!));

app.listen(3000,'0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:3000`);
});

export const BASE_FOLDER: string = path.resolve(process.env.BASE_FOLDER!);