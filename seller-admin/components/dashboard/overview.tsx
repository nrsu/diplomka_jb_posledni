"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 4000,
    orders: 2400,
  },
  {
    name: "Feb",
    revenue: 3000,
    orders: 1398,
  },
  {
    name: "Mar",
    revenue: 2000,
    orders: 9800,
  },
  {
    name: "Apr",
    revenue: 2780,
    orders: 3908,
  },
  {
    name: "May",
    revenue: 1890,
    orders: 4800,
  },
  {
    name: "Jun",
    revenue: 2390,
    orders: 3800,
  },
  {
    name: "Jul",
    revenue: 3490,
    orders: 4300,
  },
  {
    name: "Aug",
    revenue: 4000,
    orders: 2400,
  },
  {
    name: "Sep",
    revenue: 3000,
    orders: 1398,
  },
  {
    name: "Oct",
    revenue: 2000,
    orders: 9800,
  },
  {
    name: "Nov",
    revenue: 2780,
    orders: 3908,
  },
  {
    name: "Dec",
    revenue: 3890,
    orders: 4800,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="orders" name="Orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
