export default function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-400 transition cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}