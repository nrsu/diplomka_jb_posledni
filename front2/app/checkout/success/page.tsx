"use client"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation";
export default function OrderSuccessPage() {
  // Generate a random order number
  // const orderNumber = `ORD-${Math.floor(Math.random() * 10000)
  //   .toString()
  //   .padStart(5, "0")}`
  //const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Check className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Order Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been received and is now being processed.
            </p>
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Order Number</div>
              <div className="font-medium text-lg">#ORD-{orderId}</div>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address with all the details of your order.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/orders">
              View Order Status
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

