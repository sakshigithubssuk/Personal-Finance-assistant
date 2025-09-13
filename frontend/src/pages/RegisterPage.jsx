import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/index.js";

const RegisterPage = () => {
  // State for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for handling errors and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors
    setLoading(true); // Set loading state

    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/users/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(response.data));

      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
     <h1 style={styles.mainTitle}>
  Welcome to <span style={styles.highlightText}>Personal Finance Assistant</span>
</h1>
        <h2 style={styles.title}>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={styles.errorMessage}>{error}</p>}

          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength="6"
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={styles.subtext}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f7f6",
  },
  formWrapper: {
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
 
mainTitle: {
  fontSize: '32px', 
  fontWeight: '600', 
  color: '#2d3748', 
  textAlign: 'center',
  marginBottom: '0.5rem', 
},
highlightText: {
  color: '#9fe7ecff', 
  fontWeight: '700', 
},
  title: {
    marginBottom: "24px",
    color: "#333",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#555",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    backgroundColor: "#ffe6e6",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  subtext: {
    marginTop: "20px",
    textAlign: "center",
    color: "#666",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default RegisterPage;
