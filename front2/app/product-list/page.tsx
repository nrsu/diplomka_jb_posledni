"use client"
import { Suspense } from "react"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchBar } from "@/components/search-bar"
import ProductGrid from "./product-grid"
import { productsAPI } from "@/services/api";
//import { useState, useEffect } from "react";
import Link from "next/link"
export default function ProductListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  //const [categories, setCategories] = useState([]);
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "trending", label: "Trending" },
    { value: "latest", label: "Latest Arrivals" },
    { value: "priceLowHigh", label: "Price: Low to High" },
    { value: "priceHighLow", label: "Price: High to Low" },
  ];
  
  const [sortBy, setSortBy] = useState("relevance");
  
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };
  
  const togglePriceRange = (id: string) => {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };
  
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          {category && <p className="text-muted-foreground mt-1">Category: {category}</p>}
          {/* <Link href="/product-list">
    <Button className="ml-4">Go to Product List</Button>
  </Link> */}

        </div>
        <div className="mt-2">
  <label htmlFor="sort" className="block text-sm font-medium text-muted-foreground mb-1">
    Sort by
  </label>
  <select
    id="sort"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border rounded-md px-3 py-1 text-sm"
  >
    {sortOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile filter */}
        <div className="md:hidden w-full mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="py-4">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox id={`category-mobile-${category.id}`} />
                      <label
                        htmlFor={`category-mobile-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2">
                      <Checkbox id={`price-mobile-${range.id}`} />
                      <label
                        htmlFor={`price-mobile-${range.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop filter */}
        <div className="hidden md:block w-1/4 max-w-[250px]">
          <Card>
            <CardContent className="p-6">
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox id={`category-${category.id}`} 
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() => toggleCategory(category.name)}/>
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2">
                      <Checkbox id={`price-${range.id}`} 
                        checked={selectedPrices.includes(String(range.id))}
                        onCheckedChange={() => togglePriceRange(String(range.id))}/>
                      <label
                        htmlFor={`price-${range.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid search={search} category={category} sortBy={sortBy} selectedCategories={selectedCategories} selectedPrices = {selectedPrices} />
          </Suspense>
        </div>
      </div>
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
          </Card>
        ))}
    </div>
  )
}

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Home & Kitchen" },
  { id: 4, name: "Beauty" },
]
//const categories = await productsAPI.getCategories();

const priceRanges = [
  { id: 1, label: "Under $25" },
  { id: 2, label: "$25 to $50" },
  { id: 3, label: "$50 to $100" },
  { id: 4, label: "$100 to $200" },
  { id: 5, label: "Over $200" },
]

