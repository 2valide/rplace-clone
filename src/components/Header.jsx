import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Header() {
  const [nick, setNick] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookieNick = Cookies.get("nick");
    if (cookieNick) {
      setNick(cookieNick);
    }
  }, []);

  const copyToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Vérifie si l'URL correspond à /accueil/rplace/${id}
  const showShareButton = router.pathname === "/accueil/rplace/[id]";

  return (
    <header>
      <div className="w-full max-h-16 bg-MainContentBackground rounded-3xl flex items-center mt-10 px-10">
        <div className="flex-1 flex items-center">
          <Link href="/accueil">
            <span className="font-pixelFont text-white hover:shadow-neon mr-4">
              Lobby
            </span>
          </Link>
          {showShareButton && (
            <button
              className="font-pixelFont text-white hover:shadow-neon bg-transparent border border-white rounded px-2 py-1"
              onClick={copyToClipboard}
            >
              Share Party
            </button>
          )}
          {copied && (
            <span className="ml-2 text-sm text-green-500">Copied!</span>
          )}
        </div>

        <Link href="/accueil">
          <span className="flex justify-center flex-grow-0">
            <Image
              src="/logoRplace.svg"
              alt="logo R Place"
              className="mx-auto"
            />
          </span>
        </Link>

        <div className={`flex-1 text-right ${nick ? "" : "invisible"}`}>
          {nick && <p className="font-pixelFont text-white">Bonjour, {nick}</p>}
        </div>
      </div>
    </header>
  );
}
