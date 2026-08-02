export default function Privacy({ onBack }) {
  const pageStyle = {
    background:
      "radial-gradient(circle at 20% 20%, #1a1440 0%, #07060f 45%, #050308 100%)",
    minHeight: "100vh",
    color: "#ece9f8",
  };

  const cardStyle = {
    backgroundColor: "#14112b",
    border: "1px solid #2a2450",
    borderRadius: "14px",
  };

  const gradientText = {
    background: "linear-gradient(90deg, #9b6bff, #c084fc)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const badgeStyle = {
    display: "inline-block",
    background: "linear-gradient(90deg, #7c3aed, #c084fc)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    padding: "4px 12px",
    borderRadius: "20px",
    marginBottom: "12px",
  };

  const pStyle = { color: "#d8d4ea" };
  const mutedStyle = { color: "#a29ac2" };

  return (
    <div style={pageStyle} className="py-4">
      <div className="container" style={{ maxWidth: "720px" }}>
        <button className="btn btn-sm btn-outline-light mb-3" onClick={onBack}>
          &larr; Back
        </button>

        <div className="p-4" style={cardStyle}>
          <span style={badgeStyle}>College Project</span>
          <h3 style={gradientText}>Privacy Policy</h3>
          <p style={mutedStyle}>Last updated: August 2026</p>

          <p style={pStyle}>
            AI Study Buddy is an educational chatbot built as a college
            project to help Indian students with general education
            questions, the Indian Constitution, and English speaking
            practice. This page explains what information the app collects,
            how it is used, and how it is protected. Please read this policy
            carefully before using the app.
          </p>

          <h5 className="mt-4" style={gradientText}>1. Information We Collect</h5>
          <p style={pStyle}>
            When you create an account, we collect your full name, email
            address, mobile number, and a password (stored securely by our
            authentication provider, Supabase, and never visible to us in
            plain text). We do not collect your location, contacts, photos,
            or any other data from your device.
          </p>

          <h5 className="mt-4" style={gradientText}>2. How Your Chat Messages Are Used</h5>
          <p style={pStyle}>
            When you send a message in the chat, that message (along with
            recent conversation history, so the AI has context) is sent to
            Google's Gemini API to generate a reply. Google's own privacy
            policy governs how they process that data. We do not manually
            read or review your chat messages ourselves.
          </p>

          <h5 className="mt-4" style={gradientText}>3. How We Store Your Data</h5>
          <p style={pStyle}>
            Your account details (name, email, mobile number) are stored
            securely using Supabase, a third-party database and
            authentication service. Chat messages are not permanently stored
            on our servers beyond what is needed to generate a response in
            the current session.
          </p>

          <h5 className="mt-4" style={gradientText}>4. What We Don't Do</h5>
          <p style={pStyle}>
            We do not sell, rent, or share your personal information with
            advertisers or other third parties for marketing purposes. This
            app does not display third-party ads.
          </p>

          <h5 className="mt-4" style={gradientText}>5. Your Rights</h5>
          <p style={pStyle}>
            You can request that your account and associated data be deleted
            at any time by contacting the app owner. Since this is a
            student/college project and not a commercial product, please
            treat it accordingly - avoid sharing highly sensitive personal
            information in your chat messages.
          </p>

          <h5 className="mt-4" style={gradientText}>6. Changes to This Policy</h5>
          <p style={pStyle}>
            This policy may be updated as the project evolves. Continued use
            of the app after changes means you accept the updated policy.
          </p>

          <h5 className="mt-4" style={gradientText}>7. Contact</h5>
          <p style={pStyle}>
            For any questions, concerns, or data deletion requests, please
            contact the app developer directly.
          </p>

          <p className="small mt-4" style={mutedStyle}>
            Note: This is a student-built educational/college project, not a
            commercial product. This policy should be replaced with a more
            detailed, legally reviewed version before any public or
            commercial launch.
          </p>
        </div>
      </div>
    </div>
  );
}
