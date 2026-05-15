/**
 * Generate time slots for a doctor on a specific date
 * @param {string} startTime - e.g., "09:00"
 * @param {string} endTime - e.g., "13:00"
 * @param {number} interval - e.g., 20 (minutes)
 * @returns {string[]} - List of slots like ["09:00 AM", "09:20 AM", ...]
 */
export const generateTimeSlots = (startTime, endTime, interval) => {
  const slots = [];
  let current = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  while (current < end) {
    slots.push(
      current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    current = new Date(current.getTime() + interval * 60000);
  }

  return slots;
};
