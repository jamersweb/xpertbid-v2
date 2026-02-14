import React, { useState, useEffect } from "react";

const CountdownTimer = ({ endDate }) => {
       const [timeLeft, setTimeLeft] = useState({
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
       });
       const [isActive, setIsActive] = useState(false);

       useEffect(() => {
              const calculateTimeLeft = () => {
                     const now = new Date();
                     const end = new Date(endDate);
                     const diff = end - now;

                     if (diff <= 0) {
                            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                            setIsActive(false);
                            return;
                     }

                     setIsActive(true);

                     const msInSec = 1000;
                     const msInMin = msInSec * 60;
                     const msInHour = msInMin * 60;
                     const msInDay = msInHour * 24;

                     const days = Math.floor(diff / msInDay);
                     const remAfterDays = diff % msInDay;

                     const hours = Math.floor(remAfterDays / msInHour);
                     const remAfterHours = remAfterDays % msInHour;

                     const minutes = Math.floor(remAfterHours / msInMin);
                     const remAfterMinutes = remAfterHours % msInMin;

                     const seconds = Math.floor(remAfterMinutes / msInSec);

                     setTimeLeft({ days, hours, minutes, seconds });
              };

              calculateTimeLeft();
              const timer = setInterval(calculateTimeLeft, 1000);
              return () => clearInterval(timer);
       }, [endDate]);

       return (
              <div className="counter">
                     {isActive ? (
                            <div className="counter-grid">
                                   <div className="counter-box">
                                          <div className="counter-value">{timeLeft.days}</div>
                                          <div className="counter-label">Days</div>
                                   </div>
                                   <div className="counter-box">
                                          <div className="counter-value">{timeLeft.hours}</div>
                                          <div className="counter-label">Hours</div>
                                   </div>
                                   <div className="counter-box">
                                          <div className="counter-value">{timeLeft.minutes}</div>
                                          <div className="counter-label">Minutes</div>
                                   </div>
                                   <div className="counter-box">
                                          <div className="counter-value">{timeLeft.seconds}</div>
                                          <div className="counter-label">Seconds</div>
                                   </div>
                            </div>
                     ) : null}
              </div>
       );
};

export default CountdownTimer;
