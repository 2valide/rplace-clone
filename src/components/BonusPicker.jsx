import BonusGrenade from "./BonusGrenade";
import BonusLine from "./BonusLine";

export default function BonusPicker({ onBonusSelect }) {
  return (
    <div className="bg-UtilitiesBackground p-4 flex flex-col gap-4 mr-32 rounded-xl">
      <BonusGrenade type="bomb" onActivate={() => onBonusSelect("bomb")} />
      <BonusLine type="line" onActivate={() => onBonusSelect("line")} />
    </div>
  );
}
