export default function Modal({ open, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded shadow-lg p-6 text-gray-700">
        {children}
      </div>
    </div>
  );
}
