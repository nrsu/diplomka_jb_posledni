"use client"

import Link from "next/link"
import { ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useStore } from "@/contexts/store-context"
import { toast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore()

  const handleRemoveFromWishlist = (id: number, name: string) => {
    removeFromWishlist(id)
    toast({
      title: "Removed from wishlist",
      description: `${name} has been removed from your wishlist.`,
    })
  }

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative">
                <Link href={`/product-details/${item.id}`}>
                  <div className="overflow-hidden">
                    <img
                      src={`http://127.0.0.1:8000${item.image}` || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>
              </div>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground mb-1">{item.category}</div>
                <Link href={`/product-details/${item.id}`} className="hover:underline">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                </Link>
                <div className="flex items-center mt-1">
                  <div className="font-bold">${item.price.toFixed(2)}</div>
                  {item.originalPrice && (
                    <div className="ml-2 text-sm text-muted-foreground line-through">
                      ${item.originalPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                <Button className="flex-1" size="sm" onClick={() => handleAddToCart(item)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2"
                  onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save items you like to your wishlist and they'll appear here.</p>
          <Button asChild>
            <Link href="/product-list">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

