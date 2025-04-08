import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedProducts from "@/components/featured-products"
import { SearchBar } from "@/components/search-bar"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="relative rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero banner"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Summer Collection</h1>
            <p className="text-xl text-white/90 mb-6 max-w-md">
              Discover our latest products with amazing deals and discounts.
            </p>
            <div>
              <Button size="lg" asChild>
                <Link href="/product-list">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <SearchBar className="w-full md:w-auto mt-4 md:mt-0" />
        </div>
        <FeaturedProducts />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/product-list?category=${category.slug}`}>
              <Card className="overflow-hidden h-[200px] transition-all hover:shadow-lg">
                <div className="relative h-full">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on all orders over $50</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">30 days return policy for all products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">Multiple secure payment options</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "Electronics",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Clothing",
    slug: "Clothing",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    slug: "Home-Kitchen",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Beauty",
    slug: "Beauty",
    image: "/placeholder.svg?height=200&width=300",
  },
]

