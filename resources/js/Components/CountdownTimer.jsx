import React, { useState, useEffect, memo } from 'react';

// Single shared ticker for all CountdownTimers on the page
let sharedNow = Date.now();
let intervalId = null;
const timerListeners = new Set();

function startSharedTicker() {
       if (intervalId !== null) return;
       intervalId = setInterval(() => {
              if (timerListeners.size === 0) {
                     clearInterval(intervalId);
                     intervalId = null;
                     return;
              }
              sharedNow = Date.now();
              timerListeners.forEach((listener) => listener(sharedNow));
       }, 1000);
}

function stopSharedTickerIfEmpty() {
       if (timerListeners.size === 0 && intervalId !== null) {
              clearInterval(intervalId);
              intervalId = null;
       }
}

const CountdownTimer = memo(({ endDate, variant = 'default', className = '' }) => {
       const [timeLeft, setTimeLeft] = useState(() => {
              const diff = new Date(endDate).getTime() - Date.now();
              if (isNaN(diff) || diff <= 0) {
                     return { days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false };
              }
              return {
                     days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                     hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                     minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                     seconds: Math.floor((diff % (1000 * 60)) / 1000),
                     isActive: true,
              };
       });

       useEffect(() => {
              const endMs = new Date(endDate).getTime();
              if (isNaN(endMs)) {
                     setTimeLeft((prev) => (prev.isActive ? { ...prev, isActive: false } : prev));
                     return;
              }

              const onTick = (now) => {
                     const diff = endMs - now;
                     if (diff <= 0) {
                            setTimeLeft((prev) => (prev.isActive ? { days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false } : prev));
                            return;
                     }
                     const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                     setTimeLeft((prev) => {
                            if (
                                   prev.seconds === seconds &&
                                   prev.minutes === minutes &&
                                   prev.hours === hours &&
                                   prev.days === days &&
                                   prev.isActive
                            ) {
                                   return prev;
                            }
                            return { days, hours, minutes, seconds, isActive: true };
                     });
              };

              timerListeners.add(onTick);
              startSharedTicker();

              return () => {
                     timerListeners.delete(onTick);
                     stopSharedTickerIfEmpty();
              };
       }, [endDate]);

       if (!timeLeft.isActive) return null;

       return (
              <div className={`counter ${variant === 'inline' ? 'counter-inline' : ''} ${className}`.trim()}>
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
              </div>
       );
});

export default CountdownTimer;
