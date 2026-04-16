import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const start = async (): Promise<void> => {
  await prisma.$connect();
  app.listen(env.PORT, () => {
    process.stdout.write(`Clizer backend running on port ${env.PORT}\n`);
  });
};

void start();
