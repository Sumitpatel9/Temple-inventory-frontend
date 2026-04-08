export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center rounded text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2",
    gold: "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2",
    outline: "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded",
    danger: "bg-orange-600 hover:bg-orange-700 text-white px-2 py-1.5 rounded",
    inwardform: "bg-[#FF6900] hover:bg-[#E85D00] text-white px-4 py-2 rounded",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}