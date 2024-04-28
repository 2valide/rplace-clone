import Link from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <div className="w-full  max-h-16 bg-MainContentBackground rounded-3xl flex justify-center items-center mt-10">
          <Link href="/">
            <img src="/logoRplace.svg" alt="logo R Place" />
          </Link>
        </div>
      </header>
    </>
  );
}
