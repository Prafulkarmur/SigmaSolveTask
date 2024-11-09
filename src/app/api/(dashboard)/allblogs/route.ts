import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";
export const GET = async (request: Request) => {
    try {
      await connect();
      const blogs = await Blog.find();  
      return new NextResponse(JSON.stringify({ blogs }), {
        status: 200,
      });
    } catch (error: any) {
      return new NextResponse("Error in fetching blogs" + error.message, {
        status: 500,
      });
    }
  };