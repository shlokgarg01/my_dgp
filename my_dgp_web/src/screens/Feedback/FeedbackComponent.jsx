import React, { useState } from "react";
import "./FeedbackComponent.css";

export default function FeedbackComponent() {
  const [ratingGiven, setRatingGiven] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0); // Persist user selection
  const [hoverStars, setHoverStars] = useState(0); // Temporarily highlight stars on hover

  const handleStarClick = (stars) => {
    setSelectedStars(stars); // Save the selected stars
  };

  const handleRatingSubmit = () => {
    if (selectedStars > 0) {
      setRatingGiven(true);
    } else {
      alert("Please select a rating before submitting!");
    }
  };

  return (
    <div className="feedback-container">
      {!ratingGiven ? (
        <div>
          <div>
            <img
              src="https://via.placeholder.com/120"
              style={{ borderRadius: "100px" }}
            />
          </div>

          <p className="feedback-title">We are glad you enjoyed your ride</p>
          <div className="feedback-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`feedback-star ${
                  star <= (hoverStars || selectedStars) ? "highlighted" : ""
                }`}
                onMouseEnter={() => setHoverStars(star)} // Highlight stars on hover
                onMouseLeave={() => setHoverStars(0)} // Reset hover on mouse leave
                onClick={() => handleStarClick(star)} // Persist selection on click
              >
                ⭐
              </span>
            ))}
          </div>
          <div
            style={{
              borderBottom: "2px dotted black",
              width: "100%",
              margin: "20px 0",
            }}
          ></div>
          <p className="feedback-subtitle">
            We will share your valuable feedback with our dedicated team
          </p>

          <div className="feedback-textarea-container">
            <textarea
              placeholder="Tell us more..."
              className="feedback-textarea"
            />
          </div>

          <div className="feedback-buttons">
            <button
              className="feedback-button"
              style={{ borderRadius: "25px", color: "black", width: "100%" }}
              onClick={handleRatingSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="feedback-title">
            Thank you for your {selectedStars}-star rating!
          </p>

          <p className="feedback-thankyou">
            We will share your valuable feedback with our deticated team
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <button className="feedback-button">Home</button>
            <button className="feedback-button">gallary</button>
          </div>
        </div>
      )}
    </div>
  );
}
