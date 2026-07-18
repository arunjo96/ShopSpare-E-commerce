
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { closeLoginModal } from "../store/uiSlice";

const LoginModal = () => {
  const dispatch = useDispatch();

  const { loginModalOpen } = useSelector((state) => state.ui);

  if (!loginModalOpen) return null;

  const handleClose = () => {
    dispatch(closeLoginModal());
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md rounded-xl bg-white p-8">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4"
        >
          <FiX size={22} />
        </button>

        <h2 className="mb-3 text-2xl font-bold">Login Required</h2>

        <p className="mb-6 text-gray-500">Please login to continue.</p>


        <Link
          to="/login"
          onClick={handleClose}
          className="mb-3 block rounded bg-slate-900 py-3 text-center text-white"
        >
          Login
        </Link>

        <Link
          to="/register"
          onClick={handleClose}
          className="block rounded border py-3 text-center"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginModal;