export default function FormLabel({
  children,
  required = false,
}) {
  return (
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {children}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
  );
}
