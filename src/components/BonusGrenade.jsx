import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function BonusGrenade({ type, onActivate }) {
  const cooldownPeriod = 300; // 5 minutes
  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(cooldownPeriod);

  // Lire le cookie au chargement du composant
  useEffect(() => {
    const savedCooldown = Cookies.get("bonusCooldown");
    const timeLeft = savedCooldown
      ? Math.max(new Date(savedCooldown).getTime() - new Date().getTime(), 0)
      : 0;
    setSeconds(Math.floor(timeLeft / 1000));

    if (timeLeft > 0) {
      setIsActive(false);
    }
  }, []);

  // Mettre à jour le cookie et le compte à rebours chaque seconde
  useEffect(() => {
    let interval;
    if (!isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          if (newSeconds === 0) {
            Cookies.remove("bonusCooldown");
            setIsActive(true);
          }
          return newSeconds;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleClick = () => {
    if (isActive) {
      onActivate();
      const expiresAt = new Date(new Date().getTime() + cooldownPeriod * 1000);
      Cookies.set("bonusCooldown", expiresAt.toISOString(), {
        expires: 1 / 288,
      }); // Le cookie expirera après 5 minutes
      setIsActive(false);
      setSeconds(cooldownPeriod);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
  };

  return (
    <div
      className={`bonus ${type} w-12 h-12 p-1 flex items-center justify-center rounded overflow-hidden border-black border-solid border-2 bg-white	 ${
        isActive ? "" : "bg-UtilitiesBackground cursor-not-allowed"
      }`}
      onClick={handleClick}
    >
      {isActive ? (
        <img src="/img/logo/bomb-solid.svg" alt="Grenade de couleur" />
      ) : (
        <div className="text-black text-sm">{formatTime()}</div>
      )}
    </div>
  );
}
