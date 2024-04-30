import React from "react";

function ColorCase({ color, onColorSelect }) {
  return (
    <div
      className="w-8 h-8 cursor-pointer m-1 rounded-md shadow-sm border-2 border-black"
      style={{ backgroundColor: color }}
      onClick={() => onColorSelect(color)}
    />
  );
}

export default function ColorPicker({ currentColor, setCurrentColor }) {
  const predefinedColors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#0000FF",
    "#00FF00",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#808080",
    "#FFA500",
    "#40E0D0",
    "#FFC0CB",
    "#E6E6FA",
    "#A52A2A",
    "#808000",
    "#800080",
    "#FFD700",
    "#C0C0C0",
  ];

  const handleColorChange = (color) => {
    console.log("Color picked from predefined:", color);
    setCurrentColor(color);
  };

  return (
    <div
      className="flex flex-wrap justify-between items-center p-2 bg-UtilitiesBackground rounded-xl max-w-40 gap-1"
      style={{ backgroundSize: "cover" }}
    >
      {predefinedColors.map((color) => (
        <ColorCase
          key={color}
          color={color}
          onColorSelect={handleColorChange}
        />
      ))}
      <input
        type="color"
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
        className="mt-2 rounded shadow-sm w-full h-10"
      />
    </div>
  );
}
