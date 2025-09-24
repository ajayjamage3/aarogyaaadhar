import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    const newUser = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
