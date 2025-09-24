import Review from "@/models/review";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();

    const { customerId, customerName, productName, quantity, favoriteFlavor, feedback, rating, userId } = body;

    if (!customerId || !productName || !quantity || !favoriteFlavor || !feedback || !rating) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const review = await Review.create({
      customerId,
      customerName,
      productName,
      quantity,
      favoriteFlavor,
      feedback,
      rating,
      userId,
    });

    return NextResponse.json({ message: "Review created", review }, { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return  NextResponse.json({ message: error.message }, { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "customerId", 
        select: "name",
      });

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      customerId: review.customerId?._id,
      customerName: review.customerId?.name || review.name, 
      productName: review.productName,
      quantity: review.quantity,
      favoriteFlavor: review.favoriteFlavor,
      feedback: review.feedback,
      rating: review.rating,
      userId: review.userId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      status:review.status
    }));
    
    return  NextResponse.json({ data: formattedReviews }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return  NextResponse.json({ message: error.message }, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
