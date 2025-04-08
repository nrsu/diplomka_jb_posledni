import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from "@/components/nav-bar"
import { StoreProvider } from "@/contexts/store-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zhibek Zholy",
  description: "Shop the latest products with amazing deals",
    //  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <StoreProvider>
              <NavBar />
              <main>{children}</main>
              <footer className="border-t py-8 mt-12">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="font-bold text-lg mb-4">Shop</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            All Products
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            New Arrivals
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Featured
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Sale
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-4">About</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Our Story
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Careers
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Press
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-4">Support</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Contact Us
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            FAQs
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Shipping
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground">
                            Returns
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-4">Newsletter</h3>
                      <p className="text-muted-foreground mb-4">
                        Subscribe to get special offers, free giveaways, and more.
                      </p>
                      <div className="flex">
                        <input
                          type="email"
                          placeholder="Your email"
                          className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                        <button className="h-10 rounded-r-md bg-primary px-4 text-primary-foreground">Subscribe</button>
                      </div>
                    </div>
                  </div>
                  <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                    <p>© 2025 Store. All rights reserved.</p>
                  </div>
                </div>
              </footer>
              <Toaster />
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'