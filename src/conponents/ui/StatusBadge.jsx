export default function StatusBadge({ status }) {
  const active = status === "Active" || status === "INWARD" || status === "Inward";;

  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs rounded font-medium ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}
