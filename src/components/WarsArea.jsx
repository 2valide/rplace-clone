import { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import BonusPicker from "./BonusPicker";

export default function WarsArea() {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [cooldown, setCooldown] = useState(false);
  const paintedPixels = useRef(new Map()); // Utilise useRef pour maintenir l'état entre les re-renders
  const [isActiveBomb, setIsActiveBomb] = useState(false);
  const [isActiveLine, setIsActiveLine] = useState(false);

  // Initialisation et écouteurs d'événements
  useEffect(() => {
    console.log("Current color updated in ZoneDeCombat to:", currentColor);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.style.width = "820px";
    canvas.style.height = "820px";
    canvas.width = 820 * devicePixelRatio;
    canvas.height = 820 * devicePixelRatio;

    ctx.scale(devicePixelRatio, devicePixelRatio);
    redrawPixels(ctx); // Dessine les pixels initiaux`

    function handleMouseMove(e) {
      if (cooldown) return; // Ignore le mouvement de la souris si cooldown
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / 20) * 20;
      const y = Math.floor((e.clientY - rect.top) / 20) * 20;
      drawHover(ctx, x, y);
    }

    function handleClick(e) {
      if (cooldown || checkCooldown()) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Vérifiez si le bonus de la bombe est actif
      if (isActiveBomb) {
        // Dessiner un cercle de pixels si le bonus de bombe est actif
        drawBombCircle(x, y);
        setIsActiveBomb(false); // Désactiver le bonus de bombe après utilisation
      } else if (isActiveLine) {
        // Dessiner une ligne complète si le bonus de ligne est actif
        drawLine(y);
        setIsActiveLine(false); // Désactiver le bonus de ligne après utilisation
      } else {
        // Dessiner un seul pixel si aucun bonus n'est actif
        const pixelX = Math.floor(x / 20) * 20;
        const pixelY = Math.floor(y / 20) * 20;
        paintedPixels.current.set(`${pixelX},${pixelY}`, currentColor);
      }

      redrawPixels();
      triggerCooldown();
    }

    function drawLine(y) {
      const gridY = Math.floor(y / 20) * 20;

      for (let i = 0; i < canvas.width; i += 20) {
        paintedPixels.current.set(`${i},${gridY}`, currentColor);
      }
    }

    function drawHover(ctx, x, y) {
      redrawPixels(ctx); // Efface le dernier survol et redessine le canvas
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, 18, 18);
    }

    function redrawPixels() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      paintedPixels.current.forEach((color, key) => {
        const [x, y] = key.split(",").map(Number);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 20, 20);
      });
    }

    function triggerCooldown() {
      setCooldown(true);
      setCookie("cooldown", "true", 5);
      setTimeout(() => {
        setCooldown(false);
        clearCookie("cooldown");
      }, 5000);
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    redrawPixels();

    let bombTimeout;
    if (isActiveBomb) {
      bombTimeout = setTimeout(() => setIsActiveBomb(false), 300000);
    }

    return () => {
      if (bombTimeout) {
        clearTimeout(bombTimeout);
      }
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [cooldown, currentColor, isActiveBomb]);

  function handleBonusSelect(bonusType) {
    if (bonusType === "bomb") {
      setIsActiveBomb(true);
      setTimeout(() => setIsActiveBomb(false), 300000); // Cooldown de 5 minutes
    } else if (bonusType === "line") {
      setIsActiveLine(true);
      setTimeout(() => setIsActiveLine(false), 180000); // Cooldown de 3 minutes
    }
  }

  function setCookie(name, value, seconds) {
    const expires = new Date(Date.now() + seconds * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  function clearCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  function checkCooldown() {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("cooldown=true"));
  }

  console.log("Initial currentColor:", currentColor);

  function drawBombCircle(centerX, centerY) {
    const radius = 4; // Rayon pour un cercle de 8 pixels de diamètre
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const pixelX = Math.floor((centerX + dx * 20) / 20) * 20;
          const pixelY = Math.floor((centerY + dy * 20) / 20) * 20;
          paintedPixels.current.set(`${pixelX},${pixelY}`, currentColor);
        }
      }
    }
  }

  return (
    <>
      <div className="z-10">
        <ColorPicker
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{
            width: "820px",
            height: "820px",
            cursor: cooldown ? "not-allowed" : "auto",
          }}
          className="border border-gray-400"
        />
      </div>

      <BonusPicker onBonusSelect={handleBonusSelect} />
    </>
  );
}
