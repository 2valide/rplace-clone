import WarsArea from "./WarsArea";

export default function MainContent() {
  return (
    <>
      <div className="mb-3.5 mt-8">
        <div className=" bg-MainContentBackground rounded-3xl flex items-center justify-center gap-5 flex-row px-36 py-10">
          <WarsArea />
        </div>
      </div>
    </>
  );
}
