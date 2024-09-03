import connect from "@/app/lib/db";
import User from "@/app/lib/models/user";
import Category from "@/app/lib/models/category";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const categories = await Category.find({ user: new Types.ObjectId(userId) });

    if (!categories) {
      return new NextResponse("No categories found", { status: 400 });
    }

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error getting categories..." + error.message, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    const { title } = await request.json();

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const newCategory = new Category({ title, user: new Types.ObjectId(userId) });
    await newCategory.save();

    return new NextResponse(JSON.stringify({ message: "Category is Created", category: newCategory }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error creating category..." + error.message, { status: 500 });
  }
};
