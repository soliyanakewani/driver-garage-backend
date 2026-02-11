import 'dotenv/config';
import { createServer } from '../core/app/http/server';
import rootRouter from './routes';


const app = createServer();

app.use(rootRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
