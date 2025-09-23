import Review from "@/models/review";
import { connectMongoDB } from "@/lib/mongodb";


export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();

    const { customerId, customerName, productName, quantity, favoriteFlavor, feedback, rating, userId } = body;
    console.log(body)
    if (!customerId || !productName || !quantity || !favoriteFlavor || !feedback || !rating) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
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

    return new Response(JSON.stringify({ message: "Review created", review }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
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
    }));
    
    return new Response(JSON.stringify({ data: formattedReviews }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
