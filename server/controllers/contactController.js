import Contact from "../models/Contact.js";

// @desc   Submit a contact message (public)
// @route  POST /api/contact
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters.",
      });
    }

    const contact = await Contact.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you for reaching out! We'll get back to you within 24 hours.",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact submit error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message. Please try again.",
    });
  }
};

// @desc   Get all contact messages (admin)
// @route  GET /api/contact
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve messages.",
    });
  }
};

// @desc   Update message status (admin)
// @route  PATCH /api/contact/:id/status
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Unread", "Read", "Replied"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated.",
      contact,
    });
  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update status.",
    });
  }
};

// @desc   Delete a contact message (admin)
// @route  DELETE /api/contact/:id
export const deleteMessage = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted.",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete message.",
    });
  }
};
