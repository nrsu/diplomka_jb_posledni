"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import ProtectedRoute from "@/components/protected-route"
import { ordersAPI } from "@/services/api"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  shippingAddress: string
  paymentMethod: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll()
        setOrders(data)
      } catch (err) {
        setError("Failed to load orders. Please try again later.")
        console.error("Error fetching orders:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {isLoading ? (
          <OrdersLoading />
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4 text-red-500">{error}</h2>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              {/* <TabsTrigger value="pending">Pending</TabsTrigger> */}
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <OrderList orders={orders} />
            </TabsContent>

            <TabsContent value="processing">
              <OrderList orders={orders.filter((order) => order.status === "Processing")} />
            </TabsContent>

            <TabsContent value="shipped">
              <OrderList orders={orders.filter((order) => order.status === "Shipped")} />
            </TabsContent>

            <TabsContent value="delivered">
              <OrderList orders={orders.filter((order) => order.status === "Delivered")} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ProtectedRoute>
  )
}

function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">No orders found</h2>
        <p className="text-muted-foreground mb-8">You don't have any orders in this category yet.</p>
        <Button asChild>
          <Link href="/product-list">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <CardTitle className="text-lg">Order #{order.id}</CardTitle>
              <div className="flex items-center mt-2 sm:mt-0">
                <Badge
                  className={`
                    ${order.status === "Processing" ? "bg-yellow-500" : ""}
                    ${order.status === "Shipped" ? "bg-blue-500" : ""}
                    ${order.status === "Delivered" ? "bg-green-500" : ""}
                  `}
                >
                  {order.status}
                </Badge>
                <span className="text-sm text-muted-foreground ml-4">{order.date}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Order Total</div>
                  <div className="font-medium">${order.total.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Items</div>
                  <div className="font-medium">{order.items.length} items</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Shipping Address</div>
                  <div className="font-medium line-clamp-1">{order.shippingAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="font-medium">{order.paymentMethod}</div>
                </div>
              </div>

              <div className="border rounded-lg p-4 mt-4">
                <div className="text-sm font-medium mb-2">Items in this order</div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="h-12 w-12 rounded-md overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium line-clamp-1">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-medium">${(item.quantity * item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Order Details
                  </Link>
                </Button>
              </div> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function OrdersLoading() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center mt-2 sm:mt-0">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32 ml-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4 mt-4">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="ml-4 flex-1">
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-9 w-36" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

