import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


const ObjectId = require("mongoose").Types.ObjectId;
export const GET = async (req: NextRequest, res: Response) => {
    const token =await getToken({ req })
    console.log("🚀 ~ GET ~ token:", token)
    try {
        await connect();
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Invalid user ID'
                }),
                { status: 400 }
            )
        }

        const user = await User.findById(new ObjectId(userId));

        if (!user) {
            return new NextResponse(
                JSON.stringify({
                    message: 'User not found'
                }),
                { status: 404 }
            )
        }

        const categoies = await Category.find({ user: new Types.ObjectId(userId) })

        return new NextResponse(JSON.stringify(categoies), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error:Error when get Category " + error.message, { status: 500 });
    }
}

export const POST = async (req: Request, res: Response) => {
    try {
        await connect();
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Invalid user ID'
                }),
                { status: 400 }
            )
        }

        const user = await User.findById(new ObjectId(userId));
        if (!user) {
            return new NextResponse(
                JSON.stringify({
                    message: 'User not found'
                }),
                { status: 404 }
            )
        }

        if(user.role!=="admin"){
            return new NextResponse(
                JSON.stringify({
                    message: 'You are not authorised to create category'
                }),
                { status: 404 }
            )
        }
        const body = await req.json();
        const { title, discription } = body

        const category = new Category({
            user: new ObjectId(userId),
            title,
            discription
        });
        const savedCategory = await category.save();

        if (savedCategory) {
            return new NextResponse(JSON.stringify(savedCategory), { status: 201 });
        } else {
            return new NextResponse(
                JSON.stringify({
                    message: 'Failed to save category'
                }),
                { status: 500 }
            )
        }
    } catch (err: any) {
        return new NextResponse("Error: Error when creating Category " + err.message, { status: 500 });
    }
}