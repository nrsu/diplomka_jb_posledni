"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/contexts/store-context"
import { toast } from "@/hooks/use-toast"

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal } = useStore()
  const [promoCode, setPromoCode] = useState("")

  const handleRemoveItem = (id: number, name: string, color?: string, size?: string) => {
    removeFromCart(id, { color, size })
    toast({
      title: "Removed from cart",
      description: `${name} has been removed from your cart.`,
    })
  }

  const router = useRouter()

  const handleCheckout = () => {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "{}")
  
    if (!tokens.access) {
      toast({
        title: "Вы не авторизованы",
        description: "Войдите в аккаунт, чтобы оформить заказ.",
        variant: "destructive",
      })
      router.push("/login")
    } else {
      router.push("/checkout")
    }
  }

  const shipping = 5.99
  //const tax = cartTotal * 0.07
  const total = cartTotal + shipping //+ tax

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <Card key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="h-24 w-24 rounded-md overflow-hidden">
                        <img
                          src={`http://127.0.0.1:8000${item.image}` || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <Link href={`/product-details/${item.id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1">{item.category}</div>
                        <div className="mt-1 font-medium">${item.price.toFixed(2)}</div>

                        {/* Display selected options */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedColor && (
                              <Badge variant="outline" className="text-xs">
                                Color: {item.selectedColor}
                              </Badge>
                            )}
                            {item.selectedSize && item.selectedSize !== "One Size" && (
                              <Badge variant="outline" className="text-xs">
                                Size: {item.selectedSize}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateCartItemQuantity(item.id, (item.quantity || 1) - 1, {
                              color: item.selectedColor,
                              size: item.selectedSize,
                            })
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateCartItemQuantity(item.id, (item.quantity || 1) + 1, {
                              color: item.selectedColor,
                              size: item.selectedSize,
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="ml-6 font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-4"
                        onClick={() => handleRemoveItem(item.id, item.name, item.selectedColor, item.selectedSize)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex items-center">
              <Input
                placeholder="Promo code"
                className="w-60"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button
                className="ml-2"
                onClick={() => {
                  toast({
                    title: "Promo code applied",
                    description: "Your discount has been applied to the order.",
                  })
                  setPromoCode("firstorder")
                }}
                disabled={!promoCode.trim()}
              >
                Apply
              </Button>
              <div className="ml-auto">
                <Button variant="ghost" asChild>
                  <Link href="/product-list">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div> */}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  <Link href="/checkout">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/product-list">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

