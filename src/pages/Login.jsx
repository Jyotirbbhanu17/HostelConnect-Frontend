import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveAuthSession } from "../services/authService";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const user = await loginUser({
        email: trimmedEmail,
        password,
      });

      if (user.role === "STUDENT") {
        saveAuthSession(user);
        navigate("/dashboard", { replace: true });
        return;
      }

      if (user.role === "WARDEN") {
        saveAuthSession(user);
        navigate("/warden/dashboard", { replace: true });
        return;
      }

      setError("This user role is not supported in the frontend yet.");
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setError("Invalid email or password.");
      } else {
        setError("Unable to connect to server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <div className="login-brand__mark" aria-hidden="true">
            HC
          </div>

          <div>
            <h1 id="login-title">Hostel Connect</h1>
            <p>Hostel Management Portal</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-control">
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                aria-pressed={isPasswordVisible}
                disabled={isLoading}
              >
                <span
                  className={
                    isPasswordVisible
                      ? "login-eye login-eye--hidden"
                      : "login-eye"
                  }
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
