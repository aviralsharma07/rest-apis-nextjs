import connect from "@/app/lib/db";
import User from "@/app/lib/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error getting users..." + error.message, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(JSON.stringify({ message: "User is Created", user: newUser }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error creating user..." + error.message, { status: 500 });
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    await connect();

    if (!userId || !newUsername) {
      return new NextResponse("Please provide userId and newUsername", { status: 400 });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        username: newUsername,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not Found in the Database" }), { status: 400 });
    }

    return new NextResponse(JSON.stringify({ message: "User is Updated", user: updatedUser }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error updating user..." + error.message, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Please provide userId", { status: 400 });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", { status: 400 });
    }

    await connect();

    const deletedUser = await User.findOneAndDelete({ _id: new ObjectId(userId) });

    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User not Found in the Database" }), { status: 400 });
    }

    return new NextResponse(JSON.stringify({ message: "User is Deleted", user: deletedUser }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error deleting user..." + error.message, { status: 500 });
  }
};
// 24TMEHLIpCQAP7Xg
