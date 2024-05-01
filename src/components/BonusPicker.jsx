import BonusGrenade from "./BonusGrenade";
import BonusLine from "./BonusLine";
import BonusLineX from "./BonusLineX";

export default function BonusPicker({ onBonusSelect }) {
  return (
    <div className="bg-UtilitiesBackground p-4 flex flex-row 2xl:flex-col gap-4 2xl:mr-32 rounded-xl">
      <BonusGrenade type="bomb" onActivate={() => onBonusSelect("bomb")} />
      <BonusLine type="line" onActivate={() => onBonusSelect("line")} />
      <BonusLineX type="lineX" onActivate={() => onBonusSelect("lineX")} />
    </div>
  );
}
