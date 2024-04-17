import app from './src/app';
import { config } from './src/config/config';
import { connectDB } from './src/config/db';

const startServer = async () => {
  const PORT = config.port;

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
};

startServer();
