import Header from "@/components/Header";
import MainContent from "@/components/MainContent";

export default function Rplace() {
  return (
    <>
      <div className="h-screen overflow-scroll bg-[url('/img/background.png')] bg-cover px-40 ">
        <Header />
        <MainContent />
      </div>
    </>
  );
}
