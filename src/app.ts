import express, { Application, Request, Response} from 'express';
import cors from "cors"
import authRouter from './modules/auth/auth.route';
import categoryRouter from './modules/category/category.route';

const app: Application = express();

app.use(cors())
app.use(express.json())



// routes

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/category", categoryRouter)


app.get('/api/v1', (req:Request, res:Response) => {
    res.send('Hello World!');
});

export default app;