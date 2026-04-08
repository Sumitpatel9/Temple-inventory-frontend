export default function MobileStatusBadge({ status }) {
  const active = status === "Active" || status === "INWARD" || status === "Inward";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}
