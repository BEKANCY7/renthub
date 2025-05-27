import { hash } from "bcrypt";
import { db } from "@/lib/db";

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create an admin user
    const hashedPassword = await hash("admin123", 12);

    const adminUser = await db.user.create({
      data: {
        name: "Admin User",
        email: "admin@renthub.com",
        hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created successfully:");
    console.log({
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    });
    console.log("Login credentials:");
    console.log({
      email: "admin@renthub.com",
      password: "admin123",
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await db.$disconnect();
  }
}

// Run the function
createAdminUser();
