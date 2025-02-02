import React, { useState, useEffect } from "react";
import "./coinanimation.css"; // Import the coin animation CSS

const CoinAnimation = ({ trigger }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger the animation when needed
  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);  // Reset after animation completes
      }, 1500);  // Match the duration of the animation
    }
  }, [trigger]);

  return (
    isAnimating && (
      <div className="coin-animation-container">
        <div className="coin-overplay">
          <div className="coin"></div> {/* The coin will be represented by a div with a gold background */}
        </div>
      </div>
    )
  );
};

export default CoinAnimation;
