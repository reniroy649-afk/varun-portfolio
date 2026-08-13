function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, message } = req.body || {};

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "User-Agent": "varun-portfolio/1.0",
      },

      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",

        to: [process.env.CONTACT_EMAIL],

        reply_to: email,

        subject: `New Portfolio Message from ${name}`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

            <h2 style="color: #6c63ff;">
              New Portfolio Contact
            </h2>

            <p>
              <strong>Name:</strong><br>
              ${safeName}
            </p>

            <p>
              <strong>Email:</strong><br>
              ${safeEmail}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <div style="
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              white-space: pre-wrap;
            ">
              ${safeMessage}
            </div>

          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);

      return res.status(500).json({
        success: false,
        message: "Failed to send email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}