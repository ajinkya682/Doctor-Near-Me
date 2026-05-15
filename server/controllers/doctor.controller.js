import Doctor from "../models/Doctor.js";
import Review from "../models/Review.js";

/**
 * @desc    Get doctor profile
 * @route   GET /api/doctors/:id
 * @access  Public
 */
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("clinic");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reviews = await Review.find({ doctor: req.params.id }).populate(
      "patient",
      "name"
    );

    res.status(200).json({
      doctor,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
