import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import "./FeedbackComponent.css";
import axios from "axios";
import { BASE_URL } from "../../config/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-custom-alert";

export default function FeedbackComponent({setIsFeedbackVisible}) {
  const [ratingGiven, setRatingGiven] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0); 
  const [textArea, setTextArea] = useState("")
  const data = JSON.parse(localStorage.getItem("feedback"))

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
        bookingId:data?.bookingId,
        booking:data?.booking?.address,
        customer:data?.customerId,
        rider:data?.serviceProvider?._id
      }

      try{
        const request = await axios.post(`${BASE_URL}/api/v1/reviews/create`,payload);
        const response =  request;
        console.log(response);
        localStorage.removeItem("feedback")
      }
      catch(e){console.error(e)}
    } else {
      alert("Please select a rating before submitting!");
    }
  };  

  const getRatingText = (stars) => {
    switch (stars) {
      case 5:
        return "Excellent!";
      case 4:
        return "Good!";
      case 3:
        return "Ok Ok !";
      case 2:
        return "Fair";
      case 1:
        return "Poor";
      default:
        return "";
    }
  };

  return (
    <div className="feedback-container">
      {!ratingGiven ? (
        <div>
          <div style={{textAlign:"center"}}>
            <img
              src={`data:image/jpeg;base64,${data?.serviceProvider?.avatar}`}    
                         width={"80px"} height={"80px"}
              style={{ borderRadius: "100px" }}
              alt="User"
            />
          </div>

          <p className="feedback-title">How was your experience with {data?.serviceProvider?.name} ?</p>

          <div className="feedback-stars" style={{textAlign:"center"}} >
            <Rating
              ratingValue={selectedStars} 
              onClick={handleRatingChange} 
              size={40} 
              fillColor={"#ffd700"}
              emptyColor={"#e4e5e9"} 
              allowHover={true} 
              transitionSpeed={0.3} 
            />
            {selectedStars > 0 && (
              <p style={{ marginTop: "10px", fontWeight: "bold", color: "#666" }}>
                {getRatingText(selectedStars)}
              </p>
            )}
          </div>

          <div
            style={{
              borderBottom: "2px dotted #8080804a",
              width: "100%",
              margin: "20px 0",
            }}
          ></div>

          <p className="feedback-subtitle">
          {selectedStars == 1 ? "What felt bad? Please tell us how we can improve" 
            :selectedStars == 2 ? "Thanks for your feedback! What can we do better next time?"
            :selectedStars == 3 ? "Thanks for sharing! What would make it better?"
            :selectedStars == 4 ? "Glad you liked it! How can we make it prefect next time?"
            : "You're my star, and we'll keep trying to impress you"}
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
              style={{ borderRadius: "25px", color: "white", width: "100%" }}
              onClick={handleRatingSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '2em',textAlign:"center" }}>
          <span >🤩</span>
          </div>
          <p className="feedback-title">
            {/* Thank you for your {selectedStars}-star rating! */}
            Thanks for sharing your feedback!
          </p>

          <p style={{textAlign:"center",color:"grey"}}>
            We will share your valuable feedback with our dedicated team .
          </p>  
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',padding:'6px 0px'
            }}
          >
            <button style={{width:"100%"}} className="feedback-button" onClick={()=>setIsFeedbackVisible(false)}>Home</button>
          </div>
        </div>
      )}
    </div>
  );
}
