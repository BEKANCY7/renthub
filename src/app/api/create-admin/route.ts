import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if there are any existing admin users
    const adminCount = await db.user.count({
      where: { role: "ADMIN" },
    });

    // If there are existing admins, only allow admin users to create more admins
    if (adminCount > 0) {
      // Check if the current user is an admin
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const currentUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      if (currentUser?.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Only admins can create other admin users" },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create admin user
    const newAdmin = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(newAdmin);
  } catch (error) {
    console.error("[CREATE_ADMIN_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
