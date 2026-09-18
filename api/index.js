import express from 'express';
import { whatsappWebhookRouter } from '../server/whatsappWebhookRouter.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount router on /api/whatsapp, /api/notifications, and /api
app.use('/api/whatsapp', whatsappWebhookRouter);
app.use('/api/notifications', whatsappWebhookRouter);
app.use('/api', whatsappWebhookRouter);

export default app;
