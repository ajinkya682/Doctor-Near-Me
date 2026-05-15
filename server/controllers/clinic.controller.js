import Clinic from "../models/Clinic.js";
import Doctor from "../models/Doctor.js";

/**
 * @desc    Get nearby clinics
 * @route   GET /api/clinics/nearby
 * @access  Public
 */
export const getNearbyClinics = async (req, res) => {
  const { lat, lng, radius = 5, specialty, minRating } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  try {
    const clinics = await Clinic.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance",
          maxDistance: parseFloat(radius) * 1000, // km to meters
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctors",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $match: {
          isActive: true,
          ...(specialty && { "doctorDetails.specialization": specialty }),
          ...(minRating && { averageRating: { $gte: parseFloat(minRating) } }),
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          distance: { $divide: ["$distance", 1000] }, // meters to km
          rating: "$averageRating",
          photos: 1,
          doctorDetails: {
            name: 1,
            specialization: 1,
            fee: 1,
            profilePhoto: 1,
          },
        },
      },
    ]);

    res.status(200).json({ count: clinics.length, clinics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get clinic details
 * @route   GET /api/clinics/:id
 * @access  Public
 */
export const getClinicDetails = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate("doctors");
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
