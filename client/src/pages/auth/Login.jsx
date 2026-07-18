
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

import { useLoginMutation } from "../../services/auth/authApi";
import { setCredentials } from "../../store/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const response = await login(formData).unwrap();

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );

      toast.success(response.message);

      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 shadow-xl sm:p-8">
        {/* Header */}

        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl text-white sm:h-14 sm:w-14 sm:text-2xl">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Login to continue shopping
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          {/* Email */}

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <div className="relative mt-2">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email", {
                  required: "Email is required",
                })}
                className="w-full rounded-xl border border-gray-300 py-3.5 pl-10 pr-3 text-[15px] text-gray-700 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative mt-2">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full rounded-xl border border-gray-300 py-3.5 pl-10 pr-12 text-[15px] text-gray-700 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <p className="text-red-500 text-xs mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Button */}

          <button
            disabled={isLoading}
            className="w-full rounded-xl bg-black py-3.5 text-base font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <Link
          to="/"
          className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
        >
          <FiArrowLeft /> Home
        </Link>

        {/* Register */}

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?
          <Link
            to="/register"
            className="mt-6 pl-1  pt-5 text-center text-sm text-black hover:underline font-medium "
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;