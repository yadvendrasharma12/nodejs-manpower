import bcrypt from "bcryptjs";

export const hashOtp = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

export const compareOtp = async (otp, hashedOtp) => {
  return await bcrypt.compare(otp, hashedOtp);
};