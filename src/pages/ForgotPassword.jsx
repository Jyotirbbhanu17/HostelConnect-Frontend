import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordRecovery } from "../services/authService";
import hostelConnectLogo from "../assets/hostelconnect-logo.png";
import "../styles/forgotPassword.css";

const GENERIC_SUCCESS_MESSAGE =
  "If an account exists with this email, recovery instructions will be sent.";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedEmail) {
      setSuccess("");
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail) {
      setSuccess("");
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await requestPasswordRecovery({ email: trimmedEmail });
      setSuccess(GENERIC_SUCCESS_MESSAGE);
    } catch {
      setError("Unable to send recovery instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-card" aria-labelledby="forgot-password-title">
        <div className="forgot-password-brand">
          <img
            className="forgot-password-brand__logo"
            src={hostelConnectLogo}
            alt="HostelConnect logo"
          />
          <div>
            <p className="forgot-password-brand__name">Hostel Connect</p>
            <p className="forgot-password-brand__subtitle">Hostel Management Portal</p>
          </div>
        </div>

        <div className="forgot-password-intro">
          <h1 id="forgot-password-title">Forgot Password?</h1>
          <p>
            Enter your registered email address and we will send a temporary
            password if an account is associated with it.
          </p>
        </div>

        <form className="forgot-password-form" onSubmit={handleSubmit} noValidate>
          <div className="forgot-password-field">
            <label htmlFor="recovery-email">Email</label>
            <input
              id="recovery-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your registered email"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="forgot-password-message forgot-password-message--error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="forgot-password-message forgot-password-message--success" role="status">
              {success}
            </p>
          )}

          <button className="forgot-password-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Sending Recovery Email..." : "Send Recovery Email"}
          </button>
        </form>

        <Link className="forgot-password-back" to="/login">
          Back to Login
        </Link>
      </section>
    </main>
  );
}

export default ForgotPassword;
