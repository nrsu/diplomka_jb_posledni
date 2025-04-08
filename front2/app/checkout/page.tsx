"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/contexts/store-context"
import { toast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"));
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Kazakhstan",
  })

  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const shipping = 5.99
  //const tax = cartTotal * 0.07
  const total = cartTotal + shipping //+ tax

  const submitOrder = async () => {
    try {
      const orderData = {
        total_price: total.toFixed(2),
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          selected_color: item.selectedColor || null,
          selected_size: item.selectedSize || null,
        })),
        shipping: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip_code: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
      };
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const response = await fetch("http://127.0.0.1:8000/api/order/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error("Ошибка при оформлении заказа");
      }
      const data = await response.json(); 
      const orderId = data.id;
      toast({
        title: "Заказ оформлен!",
        description: "Ваш заказ успешно создан.",
      });
  
      clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (error) {
      toast({
        title: "Ошибка",
        //description: error.message || "Не удалось оформить заказ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    
    setIsSubmitting(true)

    // Simulate API call to process order
    await submitOrder();
    /*setTimeout(() => {
      clearCart()
      setIsSubmitting(false)
      router.push("/checkout/success")
    }, 1500)*/
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="flex items-center text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmitOrder}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" name="state" value={shippingInfo.state} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="apple-pay">Apple Pay</TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit-card" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" placeholder="John Doe" required />
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                      <Button type="button" className="w-full">
                        Continue with PayPal
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="apple-pay" className="mt-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You will be prompted to confirm your payment with Apple Pay.
                      </p>
                      <Button type="button" className="w-full bg-black hover:bg-black/90">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.0425 10.4717C17.0142 8.25204 18.8442 7.12954 18.9317 7.07704C17.8617 5.50204 16.1642 5.25204 15.5692 5.23704C14.1142 5.08704 12.7142 6.10204 12.0142 6.10204C11.2992 6.10204 10.1592 5.25204 8.93917 5.27704C7.36417 5.30204 5.90917 6.19704 5.10917 7.59704C3.45917 10.4467 4.69417 14.6967 6.27917 16.8967C7.07917 17.9667 8.01917 19.1717 9.25417 19.1217C10.4592 19.0717 10.9142 18.3467 12.3692 18.3467C13.8092 18.3467 14.2342 19.1217 15.4842 19.0967C16.7642 19.0717 17.5642 18.0217 18.3392 16.9467C19.2592 15.7217 19.6392 14.5217 19.6592 14.4467C19.6292 14.4367 17.0742 13.5217 17.0425 10.4717Z" />
                          <path d="M15.0142 3.35204C15.6642 2.55204 16.0892 1.45204 15.9642 0.352051C15.0142 0.392051 13.8142 1.00205 13.1342 1.78205C12.5342 2.47205 12.0142 3.60205 12.1642 4.67205C13.2142 4.75205 14.3392 4.15204 15.0142 3.35204Z" />
                        </svg>
                        Pay with Apple Pay
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="same" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="same" value="same" />
                    <Label htmlFor="same">Same as shipping address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="different" value="different" />
                    <Label htmlFor="different">Use a different billing address</Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                    className="flex items-center"
                  >
                    <div className="h-16 w-16 rounded-md overflow-hidden">
                      <img
                        src={`http://127.0.0.1:8000${item.image}` || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium line-clamp-1">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity || 1} × ${item.price.toFixed(2)}
                      </div>
                      {/* Display selected options */}
                      {(item.selectedColor || (item.selectedSize && item.selectedSize !== "One Size")) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedColor && (
                            <Badge variant="outline" className="text-xs">
                              {item.selectedColor}
                            </Badge>
                          )}
                          {item.selectedSize && item.selectedSize !== "One Size" && (
                            <Badge variant="outline" className="text-xs">
                              {item.selectedSize}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                {/*<div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>*/}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

