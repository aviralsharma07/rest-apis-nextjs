import connect from "@/app/lib/db";
import User from "@/app/lib/models/user";
import Category from "@/app/lib/models/category";
import Blog from "@/app/lib/models/blogs";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = searchParams.get("page" || "1");
    const limit = searchParams.get("limit" || "10");

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

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse("Category not found", { status: 400 });
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if (searchKeywords) {
      filter.$or = [
        { title: { $regex: searchKeywords, $options: "i" } },
        {
          description: { $regex: searchKeywords, $options: "i" },
        },
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const blogs = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(parseInt(limit as string));

    return new NextResponse(JSON.stringify({ message: "Blogs...", blogs }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error getting Blogs..." + error.message, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or Missing userId", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or Missing categoryId", { status: 400 });
    }

    const { title, description } = await request.json();

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse("Category not found", { status: 400 });
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(JSON.stringify({ message: "Blog is Created", blog: newBlog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error creating Blog..." + error.message, { status: 500 });
  }
};
