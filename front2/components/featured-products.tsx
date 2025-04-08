"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/contexts/store-context"
import { toast } from "@/hooks/use-toast"

export default function FeaturedProducts() {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden group">
          <div className="relative">
            <Link href={`/product-details/${product.id}`}>
              <div className="overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full ${
                isInWishlist(product.id) ? "text-red-500" : ""
              }`}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product)}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </Button>
            {product.discount && <Badge className="absolute top-2 left-2">{product.discount}% OFF</Badge>}
          </div>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
            <Link href={`/product-details/${product.id}`} className="hover:underline">
              <h3 className="font-medium line-clamp-1">{product.name}</h3>
            </Link>
            <div className="flex items-center mt-1">
              <div className="font-bold">${product.price.toFixed(2)}</div>
              {product.originalPrice && (
                <div className="ml-2 text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full" size="sm" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Premium Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    category: "Electronics",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Kitchen Knife Set",
    category: "Home & Kitchen",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=300",
  },
]

