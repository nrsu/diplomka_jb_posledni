"use client"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {useState} from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Download, Eye, Filter, Mail, MoreHorizontal, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Customer {
  name: string;
  email: string;
  orders: string;
  spent: string;
  status: string;
  location: string;
  avatar: string;
}

export default function CustomersPage() {
  const customers: Customer[] = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      orders: "24",
      spent: "2890.00",
      status: "Active",
      location: "New York, USA", 
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      orders: "12",
      spent: "1250.00",
      status: "Active",
      location: "London, UK", 
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Robert Davis",
      email: "robert.davis@example.com",
      orders: "36",
      spent: "4320.00",
      status: "Active",
      location: "Sydney, Australia", 
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Emily Miller",
      email: "emily.miller@example.com",
      orders: "8",
      spent: "780.00",
      status: "Inactive",
      location: "Toronto, Canada", 
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "William Smith",
      email: "william.smith@example.com",
      orders: "16",
      spent: "1890.00",
      status: "Active",
      location: "Berlin, Germany", 
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty",
      avatar: "", 
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
    {
      name: "Yo",
      email: "Yo@mail.com",
      orders: "15",
      spent: "15000",
      status: "Active",
      location: "Almaty", 
      avatar: "",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Calculate pagination data
  const totalCustomers = customers.length;
  const totalPages = Math.ceil(totalCustomers / customersPerPage);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  const getCurrentCustomers = () => {
    const startIndex = (currentPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    return customers.slice(startIndex, endIndex);
  };

  const currentCustomers = getCurrentCustomers();

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

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {status}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          {status}
        </Badge>
      );
    }
  };

  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader title="Customers" description="Manage your customer base" />

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input placeholder="Search customers..." className="max-w-sm" />
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
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Location</DropdownMenuItem>
              <DropdownMenuItem>Signup Date</DropdownMenuItem>
              <DropdownMenuItem>Spending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-2 h-3.5 w-3.5" />
            Export
          </Button>
          {/* <Button size="sm" className="h-8">
            <UserPlus className="mr-2 h-3.5 w-3.5" />
            Add Customer
          </Button> */}
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>View and manage your customer information</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[80px]">Image</TableHead> */}
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.avatar || "/placeholder-user.jpg"} alt={customer.name} />
                        <AvatarFallback>{getAvatarFallback(customer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">Customer since {new Date().toLocaleString('default', { month: 'short' })} {new Date().getFullYear() - Math.floor(Math.random() * 3)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.spent}</TableCell>
                  <TableCell>
                    {getStatusBadge(customer.status)}
                  </TableCell>
                  <TableCell>{customer.location}</TableCell>
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
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem>Edit Customer</DropdownMenuItem> */}
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
            Showing {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, totalCustomers)} of {totalCustomers} customer{totalCustomers !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevPage} disabled={currentPage === 1}>
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
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}