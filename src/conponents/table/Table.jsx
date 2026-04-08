export default function Table({ children }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col min-h-0">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
}
