"use client";

import { useEffect, useState } from "react";

type Props = {
  endDate?: string | null;
  className?: string;
};

export function CountdownTimer({ endDate, className = "" }: Props) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!endDate) {
      setIsActive(false);
      return;
    }

    const calculateTimeLeft = () => {
      const diff = new Date(endDate).getTime() - Date.now();
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
    const timer = window.setInterval(calculateTimeLeft, 1000);
    return () => window.clearInterval(timer);
  }, [endDate]);

  return (
    <div className={`counter ${className}`.trim()}>
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
}
