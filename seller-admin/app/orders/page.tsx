"use client";
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {useState} from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Download, Edit, Eye, Filter, MoreHorizontal, Trash } from "lucide-react"
import Image from "next/image"
import { AddProductForm } from "@/components/products/add-product-form"




export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones XL",
      category: "Electronics",
      price: 299,
      stock: 432,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Smart Watch Series 7",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 3,
      name: "33333",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 4,
      name: "44444444",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 5,
      name: "55555",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 6,
      name: "666666",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 7,
      name: "77777777",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 8,
      name: "8888888",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 9,
      name: "99999",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 10,
      name: "10101010",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 11,
      name: "11111111",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 12,
      name: "12121212",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 13,
      name: "141414141",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 14,
      name: "Smart Watch Series 7",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 15,
      name: "Smart Watch Series 7",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 16,
      name: "Smart Watch Series 7",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
  
      id: 17,
      name: "Smart Watch Series 7",
      category: "Electronics",
      price: 199,
      stock: 356,
      status: "in-stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    // Add more items if you like
  ]
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Calculate pagination data
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const currentProducts = getCurrentProducts();

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  // Generate page numbers to show (with ellipsis for many pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      pages.push(1);
      if (startPage > 2) pages.push('...');
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };
  return (
    
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader title="Products" description="Manage your product inventory" />

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input placeholder="Search products..." className="max-w-sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8 flex gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Category</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Price Range</DropdownMenuItem>
              <DropdownMenuItem>Stock</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-2 h-3.5 w-3.5" />
            Export
          </Button>
          <AddProductForm />
        </div>
      </div>

      <Card>
      <CardHeader className="p-4">
  <CardTitle>Product Inventory</CardTitle>
  <CardDescription>Manage and organize your product catalog</CardDescription>
</CardHeader>
<CardContent className="p-0">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[80px]">Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {currentProducts.map((product) => (
        <TableRow key={product.id}>
          <TableCell>
            <Image
              src={ "/placeholder.svg?height=40&width=40"}
              width={40}
              height={40}
              alt={product.name}
              className="rounded-md object-cover"
            />
          </TableCell>
          <TableCell className="font-medium">{product.name}</TableCell>
          <TableCell>{product.category}</TableCell>
          <TableCell>${product.price.toFixed(2)}</TableCell>
          <TableCell>{product.stock}</TableCell>
          <TableCell>
            <Badge 
              variant="outline" 
              className={
                product.stock === 0 
                  ? "bg-red-50 text-red-700 border-red-200"
                  : product.stock < 50 
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-green-50 text-green-700 border-green-200"
              }
            >
              {product.stock === 0 ? "Out of Stock" : product.stock < 50 ? "Low Stock" : "In Stock"}
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</CardContent>
        {/* <CardHeader className="p-4">
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Manage and organize your product catalog</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Product"
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">Wireless Headphones XL</TableCell>
                <TableCell>Electronics</TableCell>
                <TableCell>$299.00</TableCell>
                <TableCell>432</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    In Stock
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Product"
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">Smart Watch Series 7</TableCell>
                <TableCell>Electronics</TableCell>
                <TableCell>$199.00</TableCell>
                <TableCell>356</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    In Stock
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Product"
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">Laptop Pro 16"</TableCell>
                <TableCell>Electronics</TableCell>
                <TableCell>$1299.00</TableCell>
                <TableCell>294</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    In Stock
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Product"
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">Smartphone Ultra</TableCell>
                <TableCell>Electronics</TableCell>
                <TableCell>$899.00</TableCell>
                <TableCell>245</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Low Stock
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Product"
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">Gaming Console X</TableCell>
                <TableCell>Gaming</TableCell>
                <TableCell>$499.00</TableCell>
                <TableCell>0</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Out of Stock
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent> */}
        




        {/* <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
              Showing {Math.min(products.length, 5)} of {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              3
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div> */}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} product{totalProducts !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <Button key={index} variant="outline" size="sm" className="h-8 w-8" disabled>
                  ...
                </Button>
              ) : (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8"
                  onClick={() => goToPage(Number(page))}
                >
                  {page}
                </Button>
              )
            ))}
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}



// "use client"

// import { useEffect, useState } from "react"
// import { AdminHeader } from "@/components/admin-header"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { ChevronLeft, ChevronRight, Download, Edit, Eye, Filter, MoreHorizontal, Trash } from "lucide-react"
// import Image from "next/image"
// import { AddProductForm } from "@/components/products/add-product-form"

// export default function ProductsPage() {
//   //const [products, setProducts] = useState([])

//   // useEffect(() => {
//   //   async function fetchProducts() {
//   //     try {
//   //       const res = await fetch("http://127.0.0.1/api/products/")
//   //       const data = await res.json()
//   //       setProducts(data)
//   //     } catch (error) {
//   //       console.error("Failed to fetch products:", error)
//   //     }
//   //   }

//   //   fetchProducts()
//   // }, [])
//   // const products = [
//   //   {
//   //     id: 1,
//   //     name: "Wireless Bluetooth Earbuds",
//   //     category: "Electronics",
//   //     price: 59.99,
//   //     originalPrice: 79.99,
//   //     discount: 25,
//   //     image: "https://example.com/images/earbuds.jpg",
//   //     color: "Black",
//   //     size: "One Size",
//   //     description: "High-quality wireless earbuds with noise cancellation and 12-hour battery life.",
//   //     dimensions: "2.5 x 1.8 x 1.2 inches",
//   //     materials: ["Plastic", "Silicone", "Metal"],
//   //     inBox: [
//   //       "Wireless Earbuds (Left & Right)",
//   //       "Charging Case",
//   //       "USB-C Cable",
//   //       "Extra Ear Tips (S/M/L)",
//   //       "User Manual"
//   //     ]
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Organic Cotton T-Shirt",
//   //     category: "Clothing",
//   //     price: 24.99,
//   //     originalPrice: 29.99,
//   //     discount: 17,
//   //     image: "https://example.com/images/tshirt.jpg",
//   //     color: "White",
//   //     size: "Medium",
//   //     description: "Soft organic cotton t-shirt with a relaxed fit and breathable fabric.",
//   //     dimensions: "28 x 20 inches (laid flat)",
//   //     materials: ["100% Organic Cotton"],
//   //     inBox: [
//   //       "T-Shirt",
//   //       "Recycled Packaging"
//   //     ]
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Stainless Steel Water Bottle",
//   //     category: "Home & Kitchen",
//   //     price: 22.50,
//   //     originalPrice: 30.00,
//   //     discount: 25,
//   //     image: "https://example.com/images/waterbottle.jpg",
//   //     color: "Silver",
//   //     size: "24 oz",
//   //     description: "Durable stainless steel water bottle that keeps drinks cold for 24 hours and hot for 12 hours.",
//   //     dimensions: "10.5 x 3 inches",
//   //     materials: ["18/8 Stainless Steel", "Silicone"],
//   //     inBox: [
//   //       "Water Bottle",
//   //       "Flip Lid",
//   //       "Cleaning Brush",
//   //       "User Guide"
//   //     ]
//   //   },
//   //   {
//   //     id: 4,
//   //     name: "Ultra HD Smart TV",
//   //     category: "Electronics",
//   //     price: 699.99,
//   //     originalPrice: 899.99,
//   //     discount: 22,
//   //     image: "https://example.com/images/smarttv.jpg",
//   //     color: "Black",
//   //     size: "55-inch",
//   //     description: "4K Ultra HD Smart TV with HDR and built-in streaming apps.",
//   //     dimensions: "48.4 x 27.9 x 3.5 inches",
//   //     materials: ["Metal", "Plastic"],
//   //     inBox: [
//   //       "TV Unit",
//   //       "Stand (attached)",
//   //       "Remote Control",
//   //       "2 AAA Batteries",
//   //       "Power Cable",
//   //       "User Manual",
//   //       "Quick Start Guide"
//   //     ]
//   //   },
//   //   {
//   //     id: 5,
//   //     name: "Memory Foam Pillow",
//   //     category: "Home & Kitchen",
//   //     price: 39.99,
//   //     originalPrice: 49.99,
//   //     discount: 20,
//   //     image: "https://example.com/images/pillow.jpg",
//   //     color: "White",
//   //     size: "Standard",
//   //     description: "Premium memory foam pillow that adapts to your head and neck for optimal comfort.",
//   //     dimensions: "26 x 20 x 5 inches",
//   //     materials: ["Memory Foam", "Polyester Cover"],
//   //     inBox: [
//   //       "Memory Foam Pillow",
//   //       "Removable Cover"
//   //     ]
//   //   },
//   //   {
//   //     id: 6,
//   //     name: "Running Shoes",
//   //     category: "Footwear",
//   //     price: 89.99,
//   //     originalPrice: 119.99,
//   //     discount: 25,
//   //     image: "https://example.com/images/shoes.jpg",
//   //     color: "Blue/Black",
//   //     size: "US 10",
//   //     description: "Lightweight running shoes with responsive cushioning for maximum comfort.",
//   //     dimensions: "12 x 8 x 5 inches (per shoe)",
//   //     materials: ["Mesh", "Synthetic Leather", "Rubber Sole"],
//   //     inBox: [
//   //       "Running Shoes (Pair)",
//   //       "Extra Laces",
//   //       "Shoe Bag"
//   //     ]
//   //   },
//   //   {
//   //     id: 7,
//   //     name: "Wireless Charging Pad",
//   //     category: "Electronics",
//   //     price: 19.99,
//   //     originalPrice: 29.99,
//   //     discount: 33,
//   //     image: "https://example.com/images/charger.jpg",
//   //     color: "White",
//   //     size: "4-inch diameter",
//   //     description: "Qi-certified wireless charging pad compatible with most smartphones.",
//   //     dimensions: "4 x 4 x 0.3 inches",
//   //     materials: ["Plastic", "Rubber Base"],
//   //     inBox: [
//   //       "Wireless Charger",
//   //       "USB Cable",
//   //       "Quick Start Guide"
//   //     ]
//   //   },
//   //   {
//   //     id: 8,
//   //     name: "Yoga Mat",
//   //     category: "Sports & Fitness",
//   //     price: 34.99,
//   //     originalPrice: 44.99,
//   //     discount: 22,
//   //     image: "https://example.com/images/yogamat.jpg",
//   //     color: "Purple",
//   //     size: "72-inch",
//   //     description: "Eco-friendly yoga mat with superior grip and cushioning for all types of yoga.",
//   //     dimensions: "72 x 24 x 0.25 inches",
//   //     materials: ["Eco-friendly TPE"],
//   //     inBox: [
//   //       "Yoga Mat",
//   //       "Carry Strap"
//   //     ]
//   //   }
//   // ];
  
//   //module.exports = products;
//   const products = [
//     {
      
//     }
//   ]
//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <AdminHeader title="Products" description="Manage your product inventory" />

//       <div className="flex items-center justify-between">
//         <div className="flex flex-1 items-center gap-2">
//           <Input placeholder="Search products..." className="max-w-sm" />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="ml-auto h-8 flex gap-1">
//                 <Filter className="h-3.5 w-3.5" />
//                 <span>Filter</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Filter by</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Category</DropdownMenuItem>
//               <DropdownMenuItem>Status</DropdownMenuItem>
//               <DropdownMenuItem>Price Range</DropdownMenuItem>
//               <DropdownMenuItem>Stock</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" className="h-8">
//             <Download className="mr-2 h-3.5 w-3.5" />
//             Export
//           </Button>
//           <AddProductForm />
//         </div>
//       </div>

//       <Card>
//         <CardHeader className="p-4">
//           <CardTitle>Product Inventory</CardTitle>
//           <CardDescription>Manage and organize your product catalog</CardDescription>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[80px]">Image</TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Stock</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {products.map((product: any) => (
//                 <TableRow key={product.id}>
//                   <TableCell>
//                     <Image
//                       src={product.image || "/placeholder.svg?height=40&width=40"}
//                       width={40}
//                       height={40}
//                       alt={product.name}
//                       className="rounded-md object-cover"
//                     />
//                   </TableCell>
//                   <TableCell className="font-medium">{product.name}</TableCell>
//                   <TableCell>{product.category}</TableCell>
//                   <TableCell>${product.price}</TableCell>
//                   <TableCell>{product.stock}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant="outline"
//                       className={
//                         product.status === "in-stock"
//                           ? "bg-green-50 text-green-700 border-green-200"
//                           : "bg-yellow-50 text-yellow-700 border-yellow-200"
//                       }
//                     >
//                       {/* {product.status.replace("-", " ")} */}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="h-4 w-4" />
//                           <span className="sr-only">Actions</span>
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem>
//                           <Eye className="mr-2 h-4 w-4" />
//                           View
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Edit className="mr-2 h-4 w-4" />
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem className="text-destructive">
//                           <Trash className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }





// import { AdminHeader } from "@/components/admin-header"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { ChevronLeft, ChevronRight, Download, Eye, Filter, MoreHorizontal, Package, RefreshCw, X } from "lucide-react"

// export default function OrdersPage() {
//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <AdminHeader title="Orders" description="Manage customer orders" />

//       <div className="flex items-center justify-between">
//         <div className="flex flex-1 items-center gap-2">
//           <Input placeholder="Search orders..." className="max-w-sm" />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="ml-auto h-8 flex gap-1">
//                 <Filter className="h-3.5 w-3.5" />
//                 <span>Filter</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Filter by</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Status</DropdownMenuItem>
//               <DropdownMenuItem>Date Range</DropdownMenuItem>
//               <DropdownMenuItem>Payment Method</DropdownMenuItem>
//               <DropdownMenuItem>Amount</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" className="h-8">
//             <Download className="mr-2 h-3.5 w-3.5" />
//             Export
//           </Button>
//           <Button variant="outline" size="sm" className="h-8">
//             <RefreshCw className="mr-2 h-3.5 w-3.5" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader className="p-4">
//           <CardTitle>Recent Orders</CardTitle>
//           <CardDescription>Process and manage customer orders</CardDescription>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Order ID</TableHead>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Payment Status</TableHead>
//                 <TableHead>Fulfillment</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12345</TableCell>
//                 <TableCell>John Doe</TableCell>
//                 <TableCell>Apr 5, 2025</TableCell>
//                 <TableCell>$299.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Paid
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                     Shipped
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12344</TableCell>
//                 <TableCell>Jane Cooper</TableCell>
//                 <TableCell>Apr 4, 2025</TableCell>
//                 <TableCell>$199.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Paid
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
//                     Processing
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12343</TableCell>
//                 <TableCell>Robert Davis</TableCell>
//                 <TableCell>Apr 3, 2025</TableCell>
//                 <TableCell>$1299.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Paid
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                     Delivered
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12342</TableCell>
//                 <TableCell>Emily Miller</TableCell>
//                 <TableCell>Apr 2, 2025</TableCell>
//                 <TableCell>$899.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
//                     Pending
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
//                     Unfulfilled
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">#ORD-12341</TableCell>
//                 <TableCell>William Smith</TableCell>
//                 <TableCell>Apr 1, 2025</TableCell>
//                 <TableCell>$499.00</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
//                     Failed
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
//                     Unfulfilled
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Actions</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package className="mr-2 h-4 w-4" />
//                         Update Status
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <X className="mr-2 h-4 w-4" />
//                         Cancel Order
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </CardContent>
//         <div className="flex items-center justify-between px-4 py-4 border-t">
//           <div className="text-sm text-muted-foreground">Showing 5 of 50 orders</div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronLeft className="h-4 w-4" />
//               <span className="sr-only">Previous page</span>
//             </Button>
//             <Button variant="outline" size="sm" className="h-8 w-8">
//               1
//             </Button>
//             <Button variant="outline" size="sm" className="h-8 w-8">
//               2
//             </Button>
//             <Button variant="outline" size="sm" className="h-8 w-8">
//               3
//             </Button>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronRight className="h-4 w-4" />
//               <span className="sr-only">Next page</span>
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

