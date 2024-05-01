import WarsArea from "./WarsArea";

export default function MainContent() {
  return (
    <>
      <div className="mb-3.5 mt-8">
        <div className="bg-MainContentBackground rounded-3xl md:flex items-center justify-center gap-5 flex-row flex-wrap px-0 py-0 lg:px-36 lg:py-10 hidden ">
          <WarsArea />
        </div>
      </div>
    </>
  );
}
