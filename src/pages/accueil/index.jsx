import { useState } from "react";
import Cookies from "js-cookie";
import Header from "@/components/Header";
import { useRouter } from "next/router";

export default function Accueil() {
  const [nick, setNick] = useState(() => Cookies.get("nick") || "");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nick.trim()) {
      // Vérifie si nick est vide ou composé uniquement d'espaces
      setError("Le pseudonyme ne peut pas être vide."); // Définir un message d'erreur
      return; // Arrête l'exécution si la validation échoue
    }
    Cookies.set("nick", nick, { expires: 7 });
    console.log("Nick set to:", nick);
    setError(""); // Efface les erreurs précédentes
    router.push("/accueil/rplace");
  };

  const handleNickChange = (e) => {
    setNick(e.target.value);
    if (error) setError(""); // Efface l'erreur lors de la modification du champ
  };

  return (
    <>
      <div className="h-screen overflow-hidden bg-[url('/img/background.png')] bg-cover px-40 flex flex-col gap-44">
        <Header />
        <div className="flex flex-col items-center gap-20 ">
          <div className=" bg-MainContentBackground rounded-3xl flex justify-center items-center flex-col p-20  font-pixelFont text-white max-w-2xl gap-12 ">
            {/* login contente */}
            <h1 className="text-2xl ">r/place</h1>
            <div>
              {/* input container */}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={nick}
                  onChange={handleNickChange}
                  className={`border-2 ${
                    error ? "border-red-500" : "border-white"
                  } rounded-lg p-2 m-2 text-black`}
                  placeholder="Nick..."
                  // required
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
          </div>

          <div className=" bg-MainContentBackground rounded-3xl flex justify-center items-center flex-col p-20  font-pixelFont text-white max-w-2xl gap-12 ">
            <h1 className="text-2xl">Party mode</h1>
            <div>
              {/* Input container */}
              <input
                type="text"
                className="border-2 border-white rounded-lg p-2  text-black"
              />
              <button className="border-2 border-white rounded-lg p-2 m-0 hover:bg-btnhover">
                COPY
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
