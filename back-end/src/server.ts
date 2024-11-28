import { app } from './App';
import dotenv from 'dotenv';

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string , 10) || 8080; 

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

