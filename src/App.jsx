import React, { useState } from "react";
import "./App.css";

// Star Rating Component
const Rating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? "filled" : ""}`}>
          ★
        </span>
      ))}
    </div>
  );
};

// Login Page
const LoginPage = ({ setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token (if provided) and navigate to review page
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      setPage("review");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
        <p>
          Don't have an account? <a href="#" onClick={() => setPage("signup")}>Signup</a>
        </p>
      </form>
    </div>
  );
};

// Signup Page
const SignupPage = ({ setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // On successful signup, redirect to login page
      alert("Signup successful! Please login.");
      setPage("login");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>
        <button type="submit" className="submit-btn">
          Sign Up
        </button>
        <p>
          Already have an account? <a href="#" onClick={() => setPage("login")}>Login</a>
        </p>
      </form>
    </div>
  );
};

// Review Platform Page
function App() {
  const [page, setPage] = useState("login"); // Tracks current page (login, signup, review)
  const [reviews, setReviews] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookTitle && reviewText) {
      const newReview = {
        bookTitle,
        reviewText,
        rating,
        id: Date.now(),
      };
      setReviews([...reviews, newReview]);
      setBookTitle("");
      setReviewText("");
      setRating(1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Book Review Platform</h1>
        <p>Your go-to platform to discover and share book reviews.</p>
      </header>

      <main className="content">
        {page === "login" && <LoginPage setPage={setPage} />}
        {page === "signup" && <SignupPage setPage={setPage} />}
        {page === "review" && (
          <>
            <section className="review-form-container">
              <h2>Submit Your Review</h2>
              <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                  <label htmlFor="bookTitle">Book Title:</label>
                  <input
                    type="text"
                    id="bookTitle"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    required
                    placeholder="Enter book title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reviewText">Review:</label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    placeholder="Share your thoughts about the book..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Rating:</label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {star} Star{star > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="submit-btn">
                  Submit Review
                </button>
              </form>
            </section>

            <section className="reviews-container">
              <h2>Recent Reviews</h2>
              {reviews.length === 0 ? (
                <p>No reviews yet! Be the first to review a book.</p>
              ) : (
                <ul className="reviews-list">
                  {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                      <h3>{review.bookTitle}</h3>
                      <Rating rating={review.rating} />
                      <p>{review.reviewText}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Book Review Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
