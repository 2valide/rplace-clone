import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ColorPicker from "./ColorPicker";
import BonusPicker from "./BonusPicker";
import Cookies from "js-cookie";

export default function WarsArea() {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [cooldown, setCooldown] = useState(false);
  const paintedPixels = useRef(new Map());
  const [isActiveBomb, setIsActiveBomb] = useState(false);
  const [isActiveLine, setIsActiveLine] = useState(false);
  const [isActiveLineX, setIsActiveLineX] = useState(false);
  const { id } = useRouter().query;
  const [isLoading, setLoading] = useState(true);
  const [nick, setNick] = useState("");
  const [error, setError] = useState("");
  const [showNickPrompt, setShowNickPrompt] = useState(false);

  const loadGridState = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/loadGrid/${id}`);
      const data = await response.json();
      if (data && data.grid) {
        paintedPixels.current = new Map(
          data.grid.map(({ key, value }) => [key, value])
        );
        // redrawPixels();
      }
    } catch (error) {
      console.error("Failed to load grid:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveGridState = async () => {
    const nick = Cookies.get("nick");
    const gridArray = Array.from(paintedPixels.current).map(([key, value]) => ({
      key,
      value,
      nick,
    }));
    try {
      const response = await fetch(`/api/saveGrid/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grid: gridArray, nick }),
      });
      const data = await response.json();
      console.log("Grid state saved:", data);
    } catch (error) {
      console.error("Failed to save grid:", error);
    }
  };
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
    redrawPixels(ctx);
    loadGridState();

    const storedNick = Cookies.get("nick");
    if (!storedNick) {
      setShowNickPrompt(true);
    } else {
      setNick(storedNick);
    }

    function handleMouseMove(e) {
      if (cooldown) return; // Ignore le mouvement de la souris si cooldown
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / 20) * 20;
      const y = Math.floor((e.clientY - rect.top) / 20) * 20;
      drawHover(ctx, x, y);
    }

    function handleClick(e) {
      if (!nick) {
        setError("Please enter a nickname to play.");
        return;
      } else if (cooldown || checkCooldown()) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isActiveBomb) {
        drawBombCircle(x, y);
        setIsActiveBomb(false);
      } else if (isActiveLine) {
        drawLine(y);
        setIsActiveLine(false);
      } else if (isActiveLineX) {
        drawlineX(x);
        setIsActiveLineX(false);
      } else {
        const pixelX = Math.floor(x / 20) * 20;
        const pixelY = Math.floor(y / 20) * 20;
        paintedPixels.current.set(`${pixelX},${pixelY}`, currentColor);
      }
      saveGridState();
      redrawPixels();
      triggerCooldown();
    }

    function drawLine(y) {
      const gridY = Math.floor(y / 20) * 20;

      for (let i = 0; i < canvas.width; i += 20) {
        paintedPixels.current.set(`${i},${gridY}`, currentColor);
      }
    }

    function drawlineX(x) {
      const gridX = Math.floor(x / 20) * 20;

      for (let i = 0; i < canvas.height; i += 20) {
        paintedPixels.current.set(`${gridX}, ${i}`, currentColor);
      }
    }

    function drawHover(ctx, x, y) {
      redrawPixels(ctx);
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

    if (id) {
      loadGridState(id);
    } else {
      console.log("Grid ID is undefined.");
    }

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [cooldown, currentColor, isActiveBomb, id]);

  function handleBonusSelect(bonusType) {
    if (bonusType === "bomb") {
      setIsActiveBomb(true);
      setTimeout(() => setIsActiveBomb(false), 300000); // Cooldown de 5 minutes
    } else if (bonusType === "line") {
      setIsActiveLine(true);
      setTimeout(() => setIsActiveLine(false), 180000); // Cooldown de 3 minutes
    } else if (bonusType === "lineX") {
      setIsActiveLineX(true);
      setTimeout(() => setIsActiveLineX(false), 180000); // Cooldown de 3 minutes
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

  const handleSubmit = () => {
    if (!nick.trim()) {
      setError("Nickname cannot be empty.");
      return;
    }
    Cookies.set("nick", nick);
    setShowNickPrompt(false);
    setError("");
  };

  const handleNickChange = (e) => {
    setNick(e.target.value);
    if (error) setError("");
  };

  return (
    <>
      <div
        className={
          showNickPrompt
            ? "absolute z-50 flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50"
            : "hidden"
        }
      >
        <form
          onSubmit={handleSubmit}
          className="bg-MainContentBackground p-10  rounded-lg"
        >
          <input
            type="text"
            value={nick}
            onChange={handleNickChange}
            className={`border-2 ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg p-2 m-2 text-black`}
            placeholder="Enter your nickname..."
          />
          <button
            type="submit"
            className="border-2 border-gray-300 rounded-lg p-2 m-2 hover:bg-blue-500 text-white"
          >
            Play
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
      <div
        className={
          isLoading
            ? "absolute z-50 flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50"
            : "hidden"
        }
      >
        <div class="flex flex-row gap-2">
          <div class="w-4 h-4 bg-black animate-bounce"></div>
          <div class="w-4 h-4 bg-black animate-bounce [animation-delay:-.3s]"></div>
          <div class="w-4 h-4 bg-black animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
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
