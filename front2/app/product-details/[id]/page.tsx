"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Truck, ShieldCheck, ArrowLeft, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import ProductReviews from "@/components/product-reviews"
import { useStore, type ProductVariant } from "@/contexts/store-context"
import { toast } from "@/hooks/use-toast"
import { productsAPI } from "@/services/api"

interface ProductDetailsPageProps {
  params: {
    id: string
  }
}

interface Review {
  id: number
  productId: number
  userName: string
  userAvatar: string
  rating: number
  date: string
  text: string
  helpfulCount: number
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const productId = Number.parseInt(params.id)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()

  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

    useEffect(() => {
      fetchReviews()
    }, [productId])
  
  
    const fetchReviews = async () => {
      try {
        const response = await productsAPI.getReviews(productId);
        setReviews(response);
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await productsAPI.getById(productId)
        setProduct(data)

        // Initialize selected options
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
      } catch (err) {
        setError("Failed to load product details. Please try again.")
        console.error("Error fetching product:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (isLoading) {
    return <ProductDetailsSkeleton />
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">{error || "Product Not Found"}</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn't find the product you're looking for. It may have been removed or doesn't exist.
        </p>
        <Button asChild>
          <Link href="/product-list" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
    )
  }

  const hasMultipleSizes = product.sizes && product.sizes.length > 1

  const averageRating =
  reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    const options: ProductVariant = {}

    if (product.colors && product.colors.length > 0) {
      options.color = selectedColor
    }

    if (hasMultipleSizes) {
      options.size = selectedSize
    }

    addToCart(product, quantity, options)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleWishlist = () => {
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

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/product-list" className="flex items-center text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={selectedImage || (product.image ? `http://127.0.0.1:8000${product.image}` : "/placeholder.svg?height=400&width=400")}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => {
                const imageUrl = `http://127.0.0.1:8000${image}`;
                return (
                  <button
                    key={index}
                    className="border rounded-lg overflow-hidden"
                    onClick={() => setSelectedImage(imageUrl)} // Устанавливаем выбранное изображение
                  >
                    <img
                      src={imageUrl || "/placeholder.svg?height=100&width=100"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                );
              })
            ) : (
              <p>No additional images available.</p>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center mt-2">
        <div className="flex">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      className={`h-5 w-5 ${
        star <= Math.round(averageRating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
      }`}
    />
  ))}
</div>
              <span className="ml-2 text-sm text-muted-foreground">{averageRating} ({reviews.length} reviews)</span>
            </div>

            <div className="mt-4 flex items-center">
              <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
              {product.originalPrice && (
                <>
                  <div className="ml-3 text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </div>
                  <Badge className="ml-3">{product.discount}% OFF</Badge>
                </>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Color</h3>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-3">
                  {product.colors.map((color: string) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                      <Label
                        htmlFor={`color-${color}`}
                        className="flex items-center justify-center rounded-full p-1 border-2 cursor-pointer peer-data-[state=checked]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color.toLowerCase() }} />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Size Options - Only show if there are multiple sizes */}
            {hasMultipleSizes && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Size</h3>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Size Guide
                  </Button>
                </div>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                  {product.sizes?.map((size: string) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={decrementQuantity}>
                  -
                </Button>
                <span className="mx-4">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={toggleWishlist}>
                <Heart className={`mr-2 h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">Free shipping</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">2 year warranty</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="text-sm">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4">
            <h3 className="text-lg font-medium mb-2">Product Description</h3>
            <p className="text-muted-foreground mb-4">
              {product.description ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
            </p>
            <p className="text-muted-foreground">
            </p>
          </TabsContent>
          <TabsContent value="specifications" className="p-4">
            <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Dimensions</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {/* <li>Height: 10 cm</li>
                  <li>Width: 15 cm</li>
                  <li>Depth: 5 cm</li>
                  <li>Weight: 300g</li> */}
                  {product.dimensions}
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Materials</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {/* <li>Aluminum</li>
                  <li>Plastic</li>
                  <li>Silicone</li> */}
                  {product.materials}
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">In the Box</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {/* <li>Main product</li>
                  <li>USB cable</li>
                  <li>User manual</li> */}
                  {product.in_the_box}
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Warranty</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>2 year limited warranty</li>
                  <li>30-day money back guarantee</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-6 w-32 mb-6">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full h-[400px] rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div>
          <div className="mb-6">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-10 w-3/4 mb-2" />

            <div className="flex items-center mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="h-5 w-5" />
                ))}
              </div>
              <Skeleton className="h-4 w-32 ml-2" />
            </div>

            <div className="mt-4 flex items-center">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <div className="h-1 w-full my-6 bg-gray-200" />

          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <div className="flex items-center">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-8 mx-4" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}

