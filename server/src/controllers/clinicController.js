import Clinic from '../models/Clinic.js';
import Doctor from '../models/Doctor.js';
import Review from '../models/Review.js';

export const getNearbyClinics = async (req, res) => {
  try {
    const { lat, lng, radius = 10, specialty, minRating = 0, sortBy = 'distance' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
      isActive: true,
      averageRating: { $gte: parseFloat(minRating) },
    };

    if (specialty) {
      query.specializations = { $in: [specialty] };
    }

    let clinics = await Clinic.find(query);

    // Sorting logic if not distance (distance is default by $near)
    if (sortBy === 'rating') {
      clinics = clinics.sort((a, b) => b.averageRating - a.averageRating);
    }

    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClinicBySlug = async (req, res) => {
  try {
    const clinic = await Clinic.findOne({ slug: req.params.slug, isActive: true }).populate('ownerId', 'name');
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.status(200).json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClinicDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ clinicId: req.params.id, isAvailableToday: true });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClinicReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await Review.find({ clinicId: req.params.id, isVisible: true })
      .populate('patientId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Review.countDocuments({ clinicId: req.params.id, isVisible: true });

    res.status(200).json({ reviews, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
