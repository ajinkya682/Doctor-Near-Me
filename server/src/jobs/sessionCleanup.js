import cron from 'node-cron';
import WhatsappSession from '../models/WhatsappSession.js';

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const result = await WhatsappSession.deleteMany({
      lastActivityAt: { $lt: thirtyMinutesAgo }
    });
    if (result.deletedCount > 0) {
      console.log(`Cron: Cleaned up ${result.deletedCount} expired WhatsApp sessions.`);
    }
  } catch (error) {
    console.error('Error in session cleanup cron job:', error);
  }
});

console.log('Cron Job: WhatsApp Session Cleanup scheduled.');
