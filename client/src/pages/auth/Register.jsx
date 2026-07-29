import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { useRegisterMutation } from "../../services/auth/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const response = await registerUser(formData).unwrap();

      toast.success(response.message);

      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="

"
    >
      <div
        className="
w-full
max-w-md
bg-white
rounded-2xl
shadow-md
border
border-gray-100
p-8
"
      >
        {/* Header */}

        <div
          className="
text-center
mb-8
"
        >
          <div
            className="
mx-auto
w-14
h-14
rounded-full
bg-black
text-white
flex
items-center
justify-center
text-2xl
mb-4
"
          >
            👤
          </div>

          <h1
            className="
text-3xl
font-bold
text-gray-800
"
          >
            Create Account
          </h1>

          <p
            className="
text-gray-500
mt-2
"
          >
            Join us and start shopping
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
space-y-5
"
        >
          {/* Name */}

          <div>
            <label
              className="
text-sm
font-semibold
text-gray-700
"
            >
              Full Name
            </label>

            <div
              className="
relative
mt-2
"
            >
              <FiUser
                className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
              />

              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                })}
                className="
w-full
rounded-xl
border
border-gray-300
py-3
pl-10
pr-3
outline-none
transition
focus:border-black
focus:ring-2
focus:ring-black/10
"
              />
            </div>

            <p
              className="
text-red-500
text-xs
mt-1
"
            >
              {errors.name?.message}
            </p>
          </div>

          {/* Email */}

          <div>
            <label
              className="
text-sm
font-semibold
text-gray-700
"
            >
              Email Address
            </label>

            <div
              className="
relative
mt-2
"
            >
              <FiMail
                className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
              />

              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email", {
                  required: "Email is required",
                })}
                className="
w-full
rounded-xl
border
border-gray-300
py-3
pl-10
pr-3
outline-none
transition
focus:border-black
focus:ring-2
focus:ring-black/10
"
              />
            </div>

            <p
              className="
text-red-500
text-xs
mt-1
"
            >
              {errors.email?.message}
            </p>
          </div>

          {/* Password */}

          <div>
            <label
              className="
text-sm
font-semibold
text-gray-700
"
            >
              Password
            </label>

            <div
              className="
relative
mt-2
"
            >
              <FiLock
                className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="
w-full
rounded-xl
border
border-gray-300
py-3
pl-10
pr-12
outline-none
transition
focus:border-black
focus:ring-2
focus:ring-black/10
"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
absolute
right-3
top-1/2
-translate-y-1/2
text-gray-500
hover:text-black
cursor-pointer
"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <p
              className="
text-red-500
text-xs
mt-1
"
            >
              {errors.password?.message}
            </p>
          </div>

          {/* Submit */}

          <button
            disabled={isLoading}
            type="submit"
            className="
w-full
bg-black
text-white
py-3
rounded-xl
font-semibold
transition
duration-300
hover:bg-gray-800
active:scale-95
cursor-pointer
disabled:opacity-50
disabled:cursor-not-allowed
"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Login */}

        <p
          className="
text-center
text-sm
text-gray-500
mt-6
"
        >
          Already have an account?
          <Link
            to="/login"
            className="
ml-1
font-semibold
text-black
hover:underline
cursor-pointer
"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
