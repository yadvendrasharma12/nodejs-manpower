import User from "../models/userModels.js";
import { env } from "../config/env.js";
import { connectDatabase } from "../config/databaseConnect.js";
import { hashPassword } from "../utils/hashPassword.js";

const createAdmin = async () => {
  try {
    await connectDatabase();

    const email = env.Admin_Email;
    const password = env.Admin_Password;
    const phone = env.Admin_Phone;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("Admin already exists");
        process.exit(0);
      }

      console.log("User with this email already exists");
      process.exit(1);
    }

    // Password hash
    const hashedPassword = await hashPassword(password);

    const admin = await User.create({
      name: "Admin",
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    console.log("Admin created successfully");
    console.log("Admin ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  }
};

createAdmin();



// crrate script in package.json and run command npm run create-admin this coomand run only one time to create a admin
