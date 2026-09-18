import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { whatsappWebhookRouter } from './server/whatsappWebhookRouter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register WhatsApp Webhook & Direct Send API routes
app.use('/api/whatsapp', whatsappWebhookRouter);

// Serve static frontend dist in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 PartnerPlus Express Production Server running on port ${PORT}`);
  console.log(`💬 Meta WhatsApp Webhook Receiver active at GET/POST /api/whatsapp/webhook`);
});
