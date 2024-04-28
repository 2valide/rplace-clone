import React from "react";

// Composant pour une case de couleur individuelle
function ColorCase({ color, onColorSelect }) {
  return (
    <div
      className="w-8 h-8 cursor-pointer m-1 rounded-md shadow-sm border-2 border-black"
      style={{ backgroundColor: color }}
      onClick={() => onColorSelect(color)}
    />
  );
}

// Composant principal pour la palette de couleurs avec sélecteur de précision
export default function ColorPicker({ currentColor, setCurrentColor }) {
  // Définissez ici les couleurs prédéfinies selon celles de votre image
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

  // Appliquez le style de fond similaire à celui de votre image
  return (
    <div
      className="flex flex-wrap justify-between items-center p-2 bg-UtilitiesBackground max-w-40 gap-1"
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
        className="mt-2 rounded shadow-sm"
        style={{ width: "100%", height: "40px" }} // Ajustez selon le style souhaité
      />
    </div>
  );
}
