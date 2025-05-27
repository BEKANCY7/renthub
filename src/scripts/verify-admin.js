// Script to verify admin user
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function verifyAdmin() {
  try {
    // Check if admin exists
    const admin = await prisma.user.findFirst({
      where: {
        email: "admin@renthub.com",
      },
    });

    if (!admin) {
      console.log("Admin user does not exist!");
      return;
    }

    console.log("Admin user details:");
    console.log("ID:", admin.id);
    console.log("Email:", admin.email);
    console.log("Name:", admin.name);
    console.log("Role:", admin.role);

    // Verify role is ADMIN
    if (admin.role !== "ADMIN") {
      console.log("WARNING: User exists but does not have ADMIN role!");

      // Update the role to ADMIN if needed
      console.log("Updating role to ADMIN...");
      await prisma.user.update({
        where: { id: admin.id },
        data: { role: "ADMIN" },
      });

      console.log("Role updated successfully!");
    } else {
      console.log("User has correct ADMIN role.");
    }
  } catch (error) {
    console.error("Error verifying admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdmin();
