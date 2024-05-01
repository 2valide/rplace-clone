import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ColorPicker from "./ColorPicker";
import BonusPicker from "./BonusPicker";
import Cookies from "js-cookie";
import io from "socket.io-client";

export default function WarsArea() {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [cooldown, setCooldown] = useState(false);
  const paintedPixels = useRef(new Map());
  const [isActiveBomb, setIsActiveBomb] = useState(false);
  const [isActiveLine, setIsActiveLine] = useState(false);
  const { id } = useRouter().query;

  useEffect(() => {
    const socket = io(); // Connexion au serveur WebSocket

    socket.on("pixel_updated", (data) => {
      const { key, color, nick } = data;
      paintedPixels.current.set(key, { color, nick });
      redrawPixels();
    });

    return () => {
      socket.off("pixel_updated");
      socket.close();
    };
  }, []);

  const loadGridState = async () => {
    try {
      const response = await fetch(`/api/loadGrid/${id}`);
      const data = await response.json();
      if (data && data.grid) {
        paintedPixels.current = new Map(
          data.grid.map(({ key, value, nick }) => [key, { color: value, nick }])
        );
        redrawPixels();
      }
    } catch (error) {
      console.error("Failed to load grid:", error);
    }
  };

  const saveGridState = async () => {
    const nick = Cookies.get("nick");
    const gridArray = Array.from(paintedPixels.current).map(
      ([key, details]) => ({
        key,
        value: details.color,
        nick,
      })
    );
    try {
      const response = await fetch(`/api/saveGrid/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grid: gridArray }),
      });
      const data = await response.json();
      console.log("Grid state saved:", data);
    } catch (error) {
      console.error("Failed to save grid:", error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.style.width = "820px";
    canvas.style.height = "820px";
    canvas.width = 820 * devicePixelRatio;
    canvas.height = 820 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    loadGridState();
    redrawPixels();

    function redrawPixels() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      paintedPixels.current.forEach((details, key) => {
        const [x, y] = key.split(",").map(Number);
        ctx.fillStyle = details.color;
        ctx.fillRect(x, y, 20, 20);
      });
    }

    function handleMouseMove(e) {
      if (cooldown) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / 20) * 20;
      const y = Math.floor((e.clientY - rect.top) / 20) * 20;
      drawHover(ctx, x, y);
    }

    function handleClick(e) {
      if (cooldown) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / 20) * 20;
      const y = Math.floor((e.clientY - rect.top) / 20) * 20;
      const color = currentColor;
      const nick = Cookies.get("nick");
      paintedPixels.current.set(`${x},${y}`, { color, nick });
      socket.emit("update_pixel", { key: `${x},${y}`, color, nick });
      saveGridState();
      redrawPixels();
    }

    function drawHover(ctx, x, y) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawPixels();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 20, 20);
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [currentColor, cooldown, isActiveBomb, isActiveLine]);

  function handleBonusSelect(bonusType) {
    if (bonusType === "bomb") {
      setIsActiveBomb(true);
    } else if (bonusType === "line") {
      setIsActiveLine(true);
    }
  }

  return (
    <>
      <ColorPicker
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
      />
      <canvas ref={canvasRef} className="border border-gray-400" />
      <BonusPicker onBonusSelect={handleBonusSelect} />
    </>
  );
}
