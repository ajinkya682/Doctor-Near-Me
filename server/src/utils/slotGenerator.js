import { format, addMinutes, parse, isAfter, isBefore, isEqual, startOfDay } from 'date-fns';

export const generateDoctorSlots = (doctor, date, bookedSlots) => {
  const queryDate = startOfDay(date);
  const now = new Date();

  // 1. Check if date is in leavesDates
  const isOnLeave = doctor.leavesDates.some(leaveDate => 
    isEqual(startOfDay(new Date(leaveDate)), queryDate)
  );
  if (isOnLeave) return { morning: [], afternoon: [], evening: [] };

  // 2. Check if doctor works on this day
  const dayName = format(queryDate, 'EEEE').toLowerCase();
  const schedule = doctor.workingDays[dayName];
  if (!schedule || !schedule.open) return { morning: [], afternoon: [], evening: [] };

  const slots = {
    morning: [],
    afternoon: [],
    evening: []
  };

  const duration = doctor.availableSlotDuration || 20;
  let current = parse(schedule.startTime, 'HH:mm', queryDate);
  const end = parse(schedule.endTime, 'HH:mm', queryDate);

  // Parse break times if they exist
  let breakStart = null;
  let breakEnd = null;
  if (schedule.breakStart && schedule.breakEnd) {
    breakStart = parse(schedule.breakStart, 'HH:mm', queryDate);
    breakEnd = parse(schedule.breakEnd, 'HH:mm', queryDate);
  }

  while (isBefore(current, end)) {
    const slotTimeStr = format(current, 'hh:mm a');
    
    // Check if slot is in break period
    let isInBreak = false;
    if (breakStart && breakEnd) {
      if ((isAfter(current, breakStart) || isEqual(current, breakStart)) && isBefore(current, breakEnd)) {
        isInBreak = true;
      }
    }

    // Check if slot is in the past (if date is today)
    let isPast = false;
    if (isEqual(queryDate, startOfDay(now))) {
      if (isBefore(current, now)) {
        isPast = true;
      }
    }

    // Check if slot is already booked
    const isBooked = bookedSlots.includes(slotTimeStr);

    if (!isInBreak && !isPast && !isBooked) {
      const hour = current.getHours();
      
      if (hour < 12) {
        slots.morning.push(slotTimeStr);
      } else if (hour >= 12 && hour < 17) {
        slots.afternoon.push(slotTimeStr);
      } else {
        slots.evening.push(slotTimeStr);
      }
    }

    current = addMinutes(current, duration);
  }

  return slots;
};
