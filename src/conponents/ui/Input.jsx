export default function Input({ value, onChange, className, ...props }) {
  const defaultClass =
    "w-full bg-white border border-gray-300 text-gray-600 placeholder-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 transition";

  return (
    <input
      {...props}
      className={className || defaultClass}
      value={value || ""}
      onChange={onChange || (() => {})}
    />
  );
}
