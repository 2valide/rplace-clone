import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function BonusLine({ onActivate }) {
  const cooldownPeriod = 180; // 3 minutes en secondes
  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(cooldownPeriod);

  useEffect(() => {
    const savedCooldown = Cookies.get("bonusLineCooldown");
    const timeLeft = savedCooldown
      ? Math.max(new Date(savedCooldown).getTime() - Date.now(), 0)
      : 0;
    setSeconds(Math.floor(timeLeft / 1000));
    if (timeLeft > 0) {
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (!isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const nextSeconds = prev - 1;
          if (nextSeconds === 0) {
            clearInterval(interval);
            Cookies.remove("bonusLineCooldown");
            setIsActive(true);
          }
          return nextSeconds;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleClick = () => {
    if (isActive) {
      onActivate("line");
      setIsActive(false);
      setSeconds(cooldownPeriod);
      const expiresAt = new Date(Date.now() + cooldownPeriod * 1000);
      Cookies.set("bonusLineCooldown", expiresAt.toISOString(), {
        expires: cooldownPeriod / (24 * 60 * 60),
      });
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
  };

  return (
    <div
      className={`bonus-line w-12 h-12 flex items-center justify-center rounded overflow-hidden border-black border-solid border-2 bg-white ${
        isActive
          ? "border-black"
          : "border-gray-500 bg-gray-500 cursor-not-allowed"
      }`}
      onClick={handleClick}
    >
      {isActive ? (
        <span>----</span> // Mettez ici l'icône ou l'image correspondant au bonus de la ligne
      ) : (
        <div className="text-black text-sm">{formatTime()}</div>
      )}
    </div>
  );
}
