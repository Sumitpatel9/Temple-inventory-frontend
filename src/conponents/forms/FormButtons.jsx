export default function FormButtons({ onCancel, submitText }) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2 rounded border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition cursor-pointer"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="px-5 py-2 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 transition cursor-pointer"
      >
        {submitText}
      </button>
    </div>
  );
}
