import { app } from './app.js';
import { connectDB } from './db/db.js';

const PORT = 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend rodando na porta: ${PORT}`);
    });
  } catch (error) {
    console.error(`Erro ao iniciar aplicação: ${error}`);
  }
};

start();
