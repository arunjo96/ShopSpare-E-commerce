import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

import  cancelReasons  from "../../constants/cancelResons";

const CancelOrderModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason) return;

    const finalReason = reason === "Other" ? otherReason.trim() : reason;

    if (!finalReason) return;

    onConfirm(finalReason);

    setReason("");
    setOtherReason("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Overlay */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          w-[95%]
          max-w-lg
          -translate-x-1/2
          -translate-y-1/2
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between border-gray-300 border-b p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <FiAlertTriangle size={22} className="text-red-500" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Cancel Order</h2>

              <p className="text-sm text-gray-500">
                Please tell us why you're cancelling.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-3 p-6 overflow-y-auto max-h-[70vh]">
          {cancelReasons.map((item) => (
            <label
              key={item}
              className="
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                border
                border-gray-300
                p-4
                transition
                hover:border-gray-400
                hover:bg-gray-50
              "
            >
              <input
                type="radio"
                checked={reason === item}
                onChange={() => setReason(item)}
              />

              <span>{item}</span>
            </label>
          ))}

          {reason === "Other" && (
            <textarea
              rows={4}
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please tell us your reason..."
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                p-3
                outline-none
                focus:border-gray-400
              "
            />
          )}
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-gray-300 border-t p-6">
          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              px-5
              py-3
              border-gray-300
              hover:bg-gray-50
            "
          >
            Keep Order
          </button>

          <button
            disabled={
              !reason || (reason === "Other" && otherReason.trim().length < 5)
            }
            onClick={handleConfirm}
            className="
              rounded-xl
              bg-red-500
              px-5
              py-3
              font-medium
              text-white
              transition
              hover:bg-red-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
