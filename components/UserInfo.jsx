"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  // Dummy initial data
  const initialData = [
    {
      _id: "1",
      productName: "Product A",
      quantity: "10",
      favoriteFlavor: "Vanilla",
      feedback: "Great!",
      rating: 4,
      status: 1,
    },
    {
      _id: "2",
      productName: "Product B",
      quantity: "5",
      favoriteFlavor: "Chocolate",
      feedback: "Good",
      rating: 3,
      status: 0,
    },
    {
      _id: "3",
      productName: "Product C",
      quantity: "8",
      favoriteFlavor: "Strawberry",
      feedback: "Excellent",
      rating: 5,
      status: 1,
    },
    {
      _id: "4",
      productName: "Product D",
      quantity: "6",
      favoriteFlavor: "Vanilla",
      feedback: "Okay",
      rating: 2,
      status: 0,
    },
  ];

  const [reviews, setReviews] = useState(initialData);
  const [stats, setStats] = useState({
    total: initialData.length,
    averageRating:
      (initialData.reduce((a, b) => a + b.rating, 0) / initialData.length).toFixed(2),
    active: initialData.filter((r) => r.status === 1).length,
    inactive: initialData.filter((r) => r.status !== 1).length,
  });

  useEffect(() => {
    // Fetch real data if needed
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setReviews(data);
          calculateStats(data);
        }
      });
  }, []);

  const calculateStats = (data) => {
    const total = data.length;
    const averageRating =
      total > 0
        ? (data.reduce((a, b) => a + b.rating, 0) / total).toFixed(2)
        : 0;
    const active = data.filter((r) => r.status === 1).length;
    const inactive = data.filter((r) => r.status !== 1).length;

    setStats({ total, averageRating, active, inactive });
  };

  // Pie chart data
  const pieData = [
    { name: "Active", value: stats.active },
    { name: "Inactive", value: stats.inactive },
  ];
  const PIE_COLORS = ["#00C49F", "#FF8042"];

  // Bar chart data: rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));
  const BAR_COLOR = "#8884d8";

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded shadow flex flex-col items-center">
          <h2>Total Reviews</h2>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow flex flex-col items-center">
          <h2>Average Rating</h2>
          <p className="text-xl font-bold">{stats.averageRating}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow flex flex-col items-center">
          <h2>Active Reviews</h2>
          <p className="text-xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow flex flex-col items-center">
          <h2>Inactive Reviews</h2>
          <p className="text-xl font-bold">{stats.inactive}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 h-80">
        {/* Pie Chart */}
        <div className="w-full h-full bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2 text-center">Active vs Inactive</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-full bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2 text-center">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingDistribution} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={BAR_COLOR} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Favorite Flavor</th>
              <th className="border p-2">Feedback</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id} className="hover:bg-gray-100">
                <td className="border p-2">{r.productName}</td>
                <td className="border p-2">{r.quantity}</td>
                <td className="border p-2">{r.favoriteFlavor}</td>
                <td className="border p-2">{r.feedback}</td>
                <td className="border p-2">{r.rating}</td>
                <td className="border p-2">{r.status === 1 ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
