/** Single icon+value row inside a card */
export default function MobileCardField({ icon, label, value, valueClass = "" }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      {!icon && label && <span className="text-gray-400 shrink-0">{label}:</span>}
      <span className={`text-gray-700 font-medium break-all ${valueClass}`}>{value}</span>
    </div>
  );
}
