"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/contexts/store-context"
import { toast } from "@/hooks/use-toast"
import { productsAPI } from "@/services/api"

interface ProductGridProps {
  search?: string
  category?: string
  sortBy?: string
  selectedCategories?: string[]
  selectedPrices?: string[]
}

export default function ProductGrid({ search, category, sortBy, selectedCategories =[], selectedPrices=[]}: ProductGridProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await productsAPI.getAll(category, search)
        if (sortBy === "priceLowHigh") {
          data.sort((a, b) => a.price - b.price)
        } else if (sortBy === "priceHighLow") {
          data.sort((a, b) => b.price - a.price)
        } else if (sortBy === "latest") {
           data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
         } else if (sortBy === "trending") {
           data.sort((a, b) => b.weekly_sold - a.weekly_sold) // если есть поле popularity
         }
        let filtered = data
        if(selectedCategories.length>0){
          filtered = filtered.filter((p) =>
            selectedCategories.includes(p.category)
          )
        }

        if(selectedPrices.length>0){
          filtered = filtered.filter((p) => {
            return selectedPrices.some((rangeId) => {
              const price = p.price
              switch (rangeId) {
                case "1":
                  return price < 25
                case "2":
                  return price >= 25 && price <= 50
                case "3":
                  return price > 50 && price <= 100
                case "4":
                  return price > 100 && price <= 200
                case "5":
                  return price > 200
                default:
                  return true
              }
            })
          })
        }
        setProducts(filtered)
      } catch (err) {
        setError("Failed to load products. Please try again.")
        console.error("Error fetching products:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [category, search, sortBy, selectedCategories, selectedPrices])

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

  if (isLoading) {
    return <ProductGridSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-500">{error}</h3>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="opacity-0 animate-fade-in">
        <Card key={product.id} className="overflow-hidden group transition-all duration-300">
          <div className="relative">
            <Link href={`/product-details/${product.id}`}>
              <div className="overflow-hidden">
                <img
                  src={`http://127.0.0.1:8000${product.image}` || "/placeholder.svg"}
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
        </div>
      ))}
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-[200px] w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}

