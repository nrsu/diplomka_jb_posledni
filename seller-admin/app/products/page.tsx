
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
