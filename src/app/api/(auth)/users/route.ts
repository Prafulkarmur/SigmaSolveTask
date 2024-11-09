import connect from "@/lib/db"
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const user = await User.find();
        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (err: any) {
        return new NextResponse("Error in fetching user" + err?.message, { status: 500 });
    }
}

export const POST = async (request: Request, res: Response) => {
    try {
        await connect();
        const { email, username, password } = await request.json()
        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

       
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role:"user"
    })

    await newUser.save()

    return NextResponse.json({ message: "User created successfully" }, { status: 201 }) 
    } catch (err: any) {
        return new NextResponse("Error in creating user" + err?.message, { status: 500 });
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "ID or new username not found" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
                status: 400,
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is updated", user: updatedUser }),
            { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error in updating user" + error.message, {
            status: 500,
        });
    }
};

export const DELETE = async (request: Request) => {
    // console.log("🚀 ~ DELETE ~ request:", request)
    try {
        await connect()
        console.log("🚀 ~ DELETE ~ body:")

        // const body = await request.json();
        // console.log("🚀 ~ DELETE ~ body:", body)
        const { searchParams } = new URL(request.url);
        console.log("🚀 ~ DELETE ~ searchParams:", searchParams)
        const userId = searchParams.get('userId');
        console.log("🚀 ~ DELETE ~ userId:", userId)

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "User ID not found" }),
                { status: 400 }
            );
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
                status: 400,
            });
        }

        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

        if (deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User is deleted", user: deletedUser }),
                { status: 200 }
            );
        } else {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }
    } catch (error: any) {
        return new NextResponse("Error in deleting user" + error.message, {
            status: 500,
        });
    }
}