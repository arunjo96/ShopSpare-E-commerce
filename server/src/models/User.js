import { Schema, model} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },


    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },


    resetPasswordToken: {
      type: String,
      default: "",
    },

    resetPasswordExpiry: {
      type: Date,
    },

    refreshToken: {
      type: String,
      default: "",
      select: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);


// -----becrypt password----- //
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

  
});

// --compare password-- //
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


/* ---------------- Access Token ---------------- */

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
};

/* ---------------- Refresh Token ---------------- */

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const User = model("User", userSchema);

export default User;
