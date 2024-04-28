import Main from "@/components/Main";
import Header from "@/components/Header";

export default function Rplace() {
  return (
    <>
      <div className="h-screen overflow-hidden bg-[url('/img/background.png')] bg-cover px-40 ">
        <Header />
        <Main />
      </div>
    </>
  );
}
