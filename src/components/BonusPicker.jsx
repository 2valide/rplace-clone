import BonusGrenade from "./BonusGrenade";
import BonusLine from "./BonusLine";

export default function BonusPicker({ onBonusSelect }) {
  // ... Logique de BonusPicker, par exemple gestion d'un état pour le bonus actuel

  return (
    <div className="bg-UtilitiesBackground p-4 flex flex-col gap-4 mr-32">
      <BonusGrenade type="bomb" onActivate={() => onBonusSelect("bomb")} />
      <BonusLine type="line" onActivate={() => onBonusSelect("line")} />
    </div>
  );
}
