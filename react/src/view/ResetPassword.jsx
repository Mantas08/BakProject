import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function ResetPassword() {
  const passwordRef = createRef();
  const confirmPasswordRef = createRef();
  const { setNotification } = useStateContext();
  const [message, setMessage] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      password: passwordRef.current.value,
      password_confirmation: confirmPasswordRef.current.value,
      token: "token_from_url", // Replace with the actual token from the URL
    };

    axiosClient
      .post("/reset-password", payload)
      .then(() => {
        setNotification("Password reset successfully");
        // Redirect or display success message
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Reset Your Password</h1>

          {message && (
            <div className="alert">
              <p>{message}</p>
            </div>
          )}

          <input ref={passwordRef} type="password" placeholder="New Password" />
          <input ref={confirmPasswordRef} type="password" placeholder="Confirm Password" />
          <button className="btn btn-block">Reset Password</button>
          <p className="message">
            Remember your password? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}