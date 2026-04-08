import React from "react";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";

const StatusModal = ({ isOpen, message, type, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const isSuccess = type === "success";
  const isConfirm = type === "confirm"; 

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-gray-200 rounded-lg shadow-2xl p-8 w-87.5 text-center transform transition-all scale-100">
        <div className="flex items-center justify-center gap-3 mb-8">
          {isConfirm ? (
            <FaQuestionCircle className="text-orange-500 text-3xl" />
          ) : isSuccess ? (
            <div className="bg-emerald-500 rounded text-white p-0.5">
              <FaCheckCircle className="text-xl" />
            </div>
          ) : (
            <FaTimesCircle className="text-red-500 text-2xl" />
          )}
          <h3 className="text-black text-lg font-medium leading-tight">
            {message}
          </h3>
        </div>

        <div className="flex justify-center gap-4">
          {isConfirm ? (
            <>
              <button
                onClick={onConfirm}
                className="bg-orange-500 hover:bg-[#F54900] cursor-pointer text-white px-8 py-2 rounded font-semibold transition-colors uppercase text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={onClose}
                className="border-3 border-gray-400 hover:border-gray-800  cursor-pointer text-black px-8 py-2 rounded font-semibold transition-colors uppercase text-sm"
              >
                No
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-orange-500 hover:bg-[#F54900] cursor-pointer text-white px-12 py-2 rounded font-semibold transition-colors uppercase tracking-wider text-sm"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
