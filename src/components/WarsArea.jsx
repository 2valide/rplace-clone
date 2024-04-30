import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ColorPicker from "./ColorPicker";
import BonusPicker from "./BonusPicker";
import Cookies from "js-cookie";
import io from "socket.io-client";

export default function WarsArea() {
  const canvasRef = useRef(null); // Correctly using useRef here
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [cooldown, setCooldown] = useState(false);
  const paintedPixels = useRef(new Map());
  const [isActiveBomb, setIsActiveBomb] = useState(false);
  const [isActiveLine, setIsActiveLine] = useState(false);
  const [isActiveLineX, setIsActiveLineX] = useState(false);
  const { id } = useRouter().query;
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(); // Assuming your server is setup to handle WebSocket connections at the root.

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadGridState = async () => {
      try {
        const response = await fetch(`/api/loadGrid/${id}`);
        const data = await response.json();
        if (data && data.grid) {
          paintedPixels.current = new Map(
            data.grid.map(({ key, value, nick }) => [
              key,
              { color: value, nick },
            ])
          );
          redrawPixels(); // Make sure to define this function correctly
        }
      } catch (error) {
        console.error("Failed to load grid:", error);
      }
    };

    loadGridState();

    function redrawPixels() {
      const ctx = canvasRef.current.getContext("2d"); // Accessing canvas context
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Use canvasRef.current
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Use canvasRef.current
      paintedPixels.current.forEach(({ color }, key) => {
        const [x, y] = key.split(",").map(Number);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 20, 20);
      });
    }

    function drawHover(ctx, x, y) {
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, 18, 18);
    }

    const handleMouseMove = (e) => {
      if (cooldown) return;
      const rect = canvasRef.current.getBoundingClientRect(); // Using canvasRef.current
      const x = Math.floor((e.clientX - rect.left) / 20) * 20;
      const y = Math.floor((e.clientY - rect.top) / 20) * 20;
      drawHover(canvasRef.current.getContext("2d"), x, y);
    };

    const handleClick = (e) => {
      if (cooldown || checkCooldown()) return;

      const rect = canvasRef.current.getBoundingClientRect(); // Using canvasRef.current
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isActiveBomb) {
        drawBombCircle(x, y);
        setIsActiveBomb(false);
      } else if (isActiveLine) {
        drawLine(y);
        setIsActiveLine(false);
      } else {
        const pixelKey = `${Math.floor(x / 20) * 20},${
          Math.floor(y / 20) * 20
        }`;
        paintedPixels.current.set(pixelKey, {
          color: currentColor,
          nick: Cookies.get("nick"),
        });
      }

      socket.current.emit("update_pixel", {
        key: `${Math.floor(x / 20) * 20},${Math.floor(y / 20) * 20}`,
        color: currentColor,
        nick: Cookies.get("nick"),
      });
      redrawPixels();
      triggerCooldown();
    };

    canvasRef.current.addEventListener("mousemove", handleMouseMove);
    canvasRef.current.addEventListener("click", handleClick);

    return () => {
      canvasRef.current.removeEventListener("mousemove", handleMouseMove);
      canvasRef.current.removeEventListener("click", handleClick);
    };
  }, [cooldown, isActiveBomb, isActiveLine, isActiveLineX, id]);

  function checkCooldown() {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("cooldown=true"));
  }

  function triggerCooldown() {
    setCooldown(true);
    setTimeout(() => setCooldown(false), 5000);
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
      <BonusPicker
        onBonusSelect={(bonusType) => {
          if (bonusType === "bomb") setIsActiveBomb(true);
          else if (bonusType === "line") setIsActiveLine(true);
          else if (bonusType === "lineX") setIsActiveLineX(true);
        }}
      />
    </>
  );
}
