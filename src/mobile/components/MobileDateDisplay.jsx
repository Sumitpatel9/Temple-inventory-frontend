export default function MobileDateDisplay({ date }) {
  if (!date) return <span className="text-gray-400">—</span>;
  const d = new Date(date);
  if (isNaN(d)) return <span>{date}</span>;
  return (
    <span>
      {d.getDate().toString().padStart(2, "0")}/
      {(d.getMonth() + 1).toString().padStart(2, "0")}/
      {d.getFullYear()}
    </span>
  );
}
