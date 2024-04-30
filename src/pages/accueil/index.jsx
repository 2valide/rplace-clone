import { useState } from "react";
import Cookies from "js-cookie";
import Header from "@/components/Header";
import { useRouter } from "next/router";

export default function Accueil() {
  const [nick, setNick] = useState(() => Cookies.get("nick") || "");
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPartyInput, setShowPartyInput] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prévenir le rechargement de la page
    if (!nick.trim()) {
      setError("Le pseudonyme ne peut pas être vide.");
      return;
    }
    saveNickCookie();
    router.push("/accueil/rplace/ffa");
  };

  const handleNickChange = (e) => {
    setNick(e.target.value);
    if (error) setError(""); // Réinitialiser l'erreur lors de la modification
  };

  const handleCreateClick = () => {
    if (!nick.trim()) {
      setError("Veuillez d'abord entrer un pseudonyme pour créer une grille.");
      return;
    }
    const newId = Math.random().toString(36).substring(2, 6);
    saveNickCookie();
    router.push(`/accueil/rplace/${newId}`);
    setShowCreateButton(false);
    setShowPartyInput(true);
  };

  const saveNickCookie = () => {
    Cookies.set("nick", nick, { expires: 7 });
  };

  return (
    <>
      <div className="h-screen overflow-hidden bg-[url('/img/background.png')] bg-cover px-40 flex flex-col gap-44">
        <Header />
        <div className="flex flex-col items-center gap-20">
          <div className="bg-MainContentBackground rounded-3xl flex justify-center items-center flex-col p-20 font-pixelFont text-white max-w-2xl gap-12">
            <h1 className="text-2xl">r/place</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={nick}
                onChange={handleNickChange}
                className={`border-2 ${
                  error ? "border-red-500" : "border-white"
                } rounded-lg p-2 m-2 text-black`}
                placeholder="Nick..."
              />
              <button
                type="submit"
                className="border-2 border-white rounded-lg p-2 m-2 hover:bg-btnhover"
              >
                PLAY
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
          {showCreateButton && (
            <div className="bg-MainContentBackground rounded-3xl flex justify-center items-center flex-col p-20 font-pixelFont text-white max-w-2xl gap-12">
              <h1 className="text-2xl">Party mode</h1>
              <button
                onClick={handleCreateClick}
                className="border-2 border-white rounded-lg p-2 m-2 hover:bg-btnhover"
              >
                CREATE
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
