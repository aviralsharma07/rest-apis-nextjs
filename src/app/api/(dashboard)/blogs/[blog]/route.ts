import connect from "@/app/lib/db";
import User from "@/app/lib/models/user";
import Category from "@/app/lib/models/category";
import Blog from "@/app/lib/models/blogs";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or Missing categoryId", { status: 400 });
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid or Missing blogId", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse("Category not found", { status: 400 });
    }

    const blog = await Blog.findOne({ _id: blogId, user: userId, category: categoryId });

    if (!blog) {
      return new NextResponse("Blog not found", { status: 400 });
    }

    return new NextResponse(JSON.stringify({ message: "Blog....", blog: blog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error updating Blog..." + error.message, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { title, description } = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid or Missing blogId", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const blog = await Blog.findOne({ _id: blogId, user: userId });

    if (!blog) {
      return new NextResponse("Blog not found", { status: 400 });
    }

    const updateBlog = await Blog.findByIdAndUpdate(blogId, { title, description }, { new: true });

    return new NextResponse(JSON.stringify({ message: "Blog is Updated", blog: updateBlog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error updating Blog..." + error.message, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid or Missing blogId", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const blog = await Blog.findOne({ _id: blogId, user: userId });

    if (!blog) {
      return new NextResponse("Blog not found", { status: 400 });
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(JSON.stringify({ message: "Blog is Deleted" }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error deleting Blog..." + error.message, { status: 500 });
  }
};
