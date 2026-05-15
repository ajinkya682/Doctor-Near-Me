import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import { format, addHours } from "date-fns";

export const initCronJobs = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏰ Running Appointment Reminder Cron Job...");
    
    try {
      const now = new Date();
      const oneHourFromNow = addHours(now, 1);

      // Find appointments in the next 60 minutes that haven't received a reminder
      const upcomingAppointments = await Appointment.find({
        dateTime: { $gte: now, $lte: oneHourFromNow },
        status: "confirmed",
        reminderSent: { $ne: true }
      }).populate("user doctor clinic");

      for (const appointment of upcomingAppointments) {
        console.log(`📱 Sending WhatsApp reminder to ${appointment.user.name} for Dr. ${appointment.doctor.name}`);
        
        // Mock WhatsApp Service Call
        // await whatsappService.sendReminder(appointment.user.phone, { ... });

        // Mark as sent
        appointment.reminderSent = true;
        await appointment.save();
      </div>
    } catch (error) {
      console.error("❌ Cron Job Error:", error);
    }
  });
};
