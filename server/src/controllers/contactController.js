import ContactSubmission from '../models/ContactSubmission.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const submission = new ContactSubmission({
      name,
      email,
      phone,
      subject,
      message
    });

    await submission.save();

    // Placeholder for Nodemailer: In a real production setup, 
    // you would use transporter.sendMail(...) here.
    console.log(`New Contact Submission from ${name}: ${subject}`);

    res.status(201).json({ 
      success: true, 
      message: 'We have received your message and will respond within 24 hours.' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
