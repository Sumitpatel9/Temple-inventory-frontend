import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";

export default function MobileStatusModal({ isOpen, message, type, onClose, onConfirm }) {
  if (!isOpen) return null;
  const isSuccess = type === "success";
  const isConfirm = type === "confirm";

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {isConfirm ? (
            <FaQuestionCircle className="text-orange-500 text-3xl" />
          ) : isSuccess ? (
            <FaCheckCircle className="text-emerald-500 text-3xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-3xl" />
          )}
        </div>
        <p className="text-gray-800 font-medium mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          {isConfirm ? (
            <>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-semibold"
              >
                No
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-10 py-2.5 bg-orange-500 text-white rounded-lg font-semibold"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
