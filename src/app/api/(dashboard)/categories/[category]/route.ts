import connect from "@/app/lib/db";
import User from "@/app/lib/models/user";
import Category from "@/app/lib/models/category";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest, context: { params: any }) => {
  const categoryId = context.params.category;
  console.log(categoryId);
  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or Missing categoryId", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse("Category not found", { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title }, { new: true });

    return new NextResponse(JSON.stringify({ message: "Category is Updated", category: updatedCategory }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error updating category..." + error.message, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or Missing categoryId", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse("Category not found or does not belong to the user", { status: 400 });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return new NextResponse("Category not found", { status: 400 });
    }

    return new NextResponse(JSON.stringify({ message: "Category is Deleted", category: deletedCategory }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error deleting category..." + error.message, { status: 500 });
  }
};
