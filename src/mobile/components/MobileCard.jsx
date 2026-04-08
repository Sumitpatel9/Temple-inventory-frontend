/**
 * MobileCard
 * accent: "green" | "red" — drives the left border color
 * Green = Active, Red = Deactive
 */
export default function MobileCard({ children, onClick, className = "", accent = "green" }) {
  const border = accent === "red" ? "border-l-red-400" : "border-l-green-400";

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl
        border border-gray-100 border-l-[4px] ${border}
        shadow-[0_1px_6px_rgba(0,0,0,0.07)]
        px-4 py-3.5
        ${onClick ? "cursor-pointer active:scale-[0.985] transition-transform duration-100" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
