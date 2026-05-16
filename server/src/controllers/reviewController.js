import Review from '../models/Review.js';
import Clinic from '../models/Clinic.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

const updateRatings = async (clinicId, doctorId) => {
  const clinicReviews = await Review.find({ clinicId, isVisible: true });
  const doctorReviews = await Review.find({ doctorId, isVisible: true });

  const clinicAvg = clinicReviews.reduce((acc, item) => item.overallRating + acc, 0) / clinicReviews.length;
  const doctorAvg = doctorReviews.reduce((acc, item) => item.doctorRating + acc, 0) / doctorReviews.length;

  await Clinic.findByIdAndUpdate(clinicId, { 
    averageRating: clinicAvg || 0, 
    totalReviews: clinicReviews.length 
  });
  
  await Doctor.findByIdAndUpdate(doctorId, { 
    averageRating: doctorAvg || 0, 
    totalReviews: doctorReviews.length 
  });
};

export const createReview = async (req, res) => {
  try {
    const { appointmentId, overallRating, doctorRating, waitTimeRating, facilityRating, comment } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const review = new Review({
      patientId: req.user.id,
      doctorId: appointment.doctorId,
      clinicId: appointment.clinicId,
      appointmentId,
      overallRating,
      doctorRating,
      waitTimeRating,
      facilityRating,
      comment
    });

    await review.save();
    
    // Mark appointment as rated
    appointment.isRated = true;
    await appointment.save();

    // Update clinic and doctor ratings
    await updateRatings(appointment.clinicId, appointment.doctorId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.patientId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(review, req.body);
    await review.save();
    
    await updateRatings(review.clinicId, review.doctorId);

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markHelpful = async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { $inc: { helpfulCount: 1 } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
