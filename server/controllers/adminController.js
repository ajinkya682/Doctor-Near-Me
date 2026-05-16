import ClinicOwner from '../models/ClinicOwner.js';
import { sendEmail } from '../utils/emailUtils.js';

export const approveClinicOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await ClinicOwner.findById(id);

    if (!owner) return res.status(404).json({ message: 'Clinic owner not found' });

    owner.isApprovedByAdmin = true;
    await owner.save();

    // Send congratulations email
    await sendEmail({
      to: owner.email,
      subject: 'Account Approved - Doctor Near Me',
      html: `<h1>Congratulations ${owner.name}!</h1><p>Your clinic owner account has been approved by the admin. You can now log in and manage your clinics.</p>`
    });

    res.status(200).json({ success: true, message: 'Clinic owner approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
