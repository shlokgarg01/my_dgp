import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import "./FeedbackComponent.css";
import axios from "axios";
import { BASE_URL } from "../../config/Axios";
import { useNavigate } from "react-router-dom";

export default function FeedbackComponent() {
  const [ratingGiven, setRatingGiven] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0); 
  const [textArea, setTextArea] = useState("")

  const navigate = useNavigate()

  // Callback function when the user clicks a star
  const handleRatingChange = (newRating) => {
    setSelectedStars(newRating); // Update the selected rating
  };

  // Handle rating submission
  const handleRatingSubmit = async() => {
    if (selectedStars > 0) {
      setRatingGiven(true); // Mark the rating as given
      const payload={
        stars:selectedStars,
        comment:textArea?.trim(),
        givenBy:"Customer",
        bookingId:"002255",
        booking:"ds4555asd6454",
        customer:"asad65654fas7588544",
        rider:"5446saf4a454fas"
      }

      try{
        const request = await axios.post(`${BASE_URL}/api/v1/reviews/create`,payload);
        const response =  request;
        console.log(response)
      }
      catch(e){console.error(e)}
    } else {
      alert("Please select a rating before submitting!");
    }
  };

  return (
    <div className="feedback-container">
      {!ratingGiven ? (
        <div>
          <div style={{textAlign:"center"}}>
            <img
              src="https://via.placeholder.com/120"
              style={{ borderRadius: "100px" }}
              alt="User"
            />
          </div>

          <p className="feedback-title">We are glad you enjoyed your ride</p>

          <div className="feedback-stars" style={{textAlign:"center"}} >
            <Rating
              ratingValue={selectedStars} // Set the current rating value
              onClick={handleRatingChange} // Callback function to handle rating change
              size={40} // Adjust the size of the stars
              fillColor={"#ffd700"} // Color of the filled stars
              emptyColor={"#e4e5e9"} // Color of the empty stars
              allowHover={true} // Allow hover to highlight stars
              transitionSpeed={0.3} // Speed of the transition effect
            />
          </div>

          <div
            style={{
              borderBottom: "2px dotted black",
              width: "100%",
              margin: "20px 0",
            }}
          ></div>

          <p className="feedback-subtitle">
            We will share your feedback with our dedicated team 
          </p>

          <div className="feedback-textarea-container">
            <textarea
              placeholder="Tell us more..."
              className="feedback-textarea"
              onChange={(e)=>setTextArea(e?.target?.value)}
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
            We will share your valuable feedback with our dedicated team .
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <button className="feedback-button" onClick={()=>navigate("/")}>Home</button>
            <button className="feedback-button" onClick={()=>navigate("/")}>Gallery</button>
          </div>
        </div>
      )}
    </div>
  );
}
