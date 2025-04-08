"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ProductVariant {
  color?: string
  size?: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  quantity?: number
  colors?: string[]
  sizes?: string[]
  selectedColor?: string
  selectedSize?: string
}

interface StoreContextType {
  cart: Product[]
  wishlist: Product[]
  addToCart: (product: Product, quantity?: number, options?: ProductVariant) => void
  removeFromCart: (productId: number, options?: ProductVariant) => void
  updateCartItemQuantity: (productId: number, quantity: number, options?: ProductVariant) => void
  clearCart: () => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  isInCart: (productId: number, options?: ProductVariant) => boolean
  cartTotal: number
  cartItemsCount: number
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [cartItemsCount, setCartItemsCount] = useState(0)

  // Load cart and wishlist from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedWishlist = localStorage.getItem("wishlist")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))

    // Calculate cart total and item count
    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

    setCartTotal(total)
    setCartItemsCount(count)
  }, [cart])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  // Helper function to check if two items are the same (same ID and options)
  const isSameItem = (item1: Product, item2: Product) => {
    return (
      item1.id === item2.id && item1.selectedColor === item2.selectedColor && item1.selectedSize === item2.selectedSize
    )
  }

  const addToCart = (product: Product, quantity = 1, options?: ProductVariant) => {
    const productToAdd = {
      ...product,
      selectedColor: options?.color || product.colors?.[0] || undefined,
      selectedSize: options?.size || product.sizes?.[0] || undefined,
      quantity,
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => isSameItem(item, productToAdd))

      if (existingItemIndex >= 0) {
        // If item already exists in cart, update quantity
        const updatedCart = [...prevCart]
        const existingItem = updatedCart[existingItemIndex]
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + quantity,
        }
        return updatedCart
      } else {
        // Otherwise add new item to cart
        return [...prevCart, productToAdd]
      }
    })
  }

  const removeFromCart = (productId: number, options?: ProductVariant) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === productId &&
            (!options || (item.selectedColor === options.color && item.selectedSize === options.size))
          ),
      ),
    )
  }

  const updateCartItemQuantity = (productId: number, quantity: number, options?: ProductVariant) => {
    if (quantity < 1) return

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.id === productId &&
          (!options || (item.selectedColor === options.color && item.selectedSize === options.size))
        ) {
          return { ...item, quantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prevWishlist) => [...prevWishlist, product])
    }
  }

  const removeFromWishlist = (productId: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId)
  }

  const isInCart = (productId: number, options?: ProductVariant) => {
    return cart.some(
      (item) =>
        item.id === productId &&
        (!options || (item.selectedColor === options.color && item.selectedSize === options.size)),
    )
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isInCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

