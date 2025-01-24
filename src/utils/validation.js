import Joi from "joi";

export const isValidMedia = (url) => {
  if (!url || typeof url !== "string") return false;

  // ✅ Allow images (png, jpg, jpeg, gif) and videos (mp4, mov, webm)
  const mediaRegex =
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|mp4|mov|webm)(\?.*)?)$/i;

  // ✅ Allow YouTube links (youtube.com, youtu.be)
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  return mediaRegex.test(url) || youtubeRegex.test(url);
};

export const signupSchema = Joi.object({
  email: Joi.string().email().max(50).required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
    "string.max": "Email must not exceed 50 characters.",
  }),
  name: Joi.string().max(30).required().messages({
    "string.empty": "Name is required.",
    "string.max": "Name must not exceed 30 characters.",
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password must not exceed 20 characters.",
  }),
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});
