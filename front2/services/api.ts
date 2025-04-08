// Base API URL - in a real app, this would be your backend API endpoint
const API_URL = "https://api.example.com" // Replace with your actual API URL

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Helper function for API requests
/*async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "API request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}*/

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
    const accessToken = tokens.access;
  
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), // ✅ Добавляем токен
    };
    console.log(headers)
    const res = await fetch(url, { ...options, headers });
    return res.json();
  };


  interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    colors: string[];
    sizes: string[];
    created_at: string;
    weekly_sold: number;
    image_directory: string;
  }

  interface Review{
    id: number;
    productId: number;
    userName: string;
    userAvatar: string;
    rating: number;
    date: string;
    text: string;
    helpfulCount: number;
    can_edit: boolean;
  }
// Products API
export const productsAPI = {
  getAll: async (category?: string, search?: string): Promise<Product[]> => {
    
    const response = await fetch("http://127.0.0.1:8000/api/products/");
    if (!response.ok) {
      throw new Error("Ошибка при загрузке продуктов");
    }

    // Парсим JSON-ответ
    const products: Product[] = await response.json();

    // Фильтрация по категории
    let filteredProducts = products;
    if (category) {
      filteredProducts = filteredProducts.filter((product) =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Фильтрация по поисковому запросу
    if (search) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filteredProducts;
  },
  
  getCategories: async (): Promise<string[]> => {
    const response = await fetch("http://127.0.0.1:8000/api/categories/");
    if (!response.ok) {
      throw new Error("Ошибка при загрузке категорий");
    }
    
    return await response.json(); // Предполагаем, что сервер вернет массив строк ["Electronics", "Clothing", ...]
  },
  getReviews: async (id: number) =>{
    
    const tokens = JSON.parse(localStorage.getItem("tokens") || "{}")
    console.log(tokens)
    let response;
    if(Object.keys(tokens).length === 0){
      response = await fetch(`http://127.0.0.1:8000/api/review/${id}`);
    } else{

    response = await fetch(`http://127.0.0.1:8000/api/review/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.access}`,
      }
    })}



    //const response = await fetch(`http://127.0.0.1:8000/api/review/${id}`);
    if (!response.ok) {
      throw new Error("Ошибка при загрузке продукта");
    }

    // Парсим JSON-ответ
    const reviews: Review[] = await response.json();
    //console.log(reviews[10].can_edit)
    return reviews;
  }, 

  getById: async (id: number) => {
    // In a real app, this would be an API call
    // return fetchAPI(`/products/${id}`)

    // For demo purposes, we'll use mock data with a delay to simulate API call
    //await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock products data
    /*const products = [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Black", "White", "Blue"],
        sizes: ["One Size"],
        description:
          "Experience premium sound quality with these wireless Bluetooth headphones. Featuring noise cancellation technology and long battery life, these headphones are perfect for music lovers on the go.",
      },
      {
        id: 2,
        name: "Premium Cotton T-Shirt",
        category: "Clothing",
        price: 24.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["White", "Black", "Gray", "Navy"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        description:
          "Made from 100% organic cotton, this premium t-shirt offers both comfort and style. The breathable fabric makes it perfect for everyday wear in any season.",
      },
      {
        id: 3,
        name: "Smart Watch Series 5",
        category: "Electronics",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Black", "Silver", "Gold"],
        sizes: ["40mm", "44mm"],
        description:
          "Stay connected and track your fitness with this advanced smartwatch. Features include heart rate monitoring, GPS, water resistance, and compatibility with all your favorite apps.",
      },
      {
        id: 4,
        name: "Kitchen Knife Set",
        category: "Home & Kitchen",
        price: 49.99,
        image: "/placeholder.svg?height=400&width=400",
        colors: ["Silver", "Black"],
        sizes: ["One Size"],
        description:
          "This professional-grade kitchen knife set includes chef's knife, bread knife, utility knife, and paring knife. Made from high-quality stainless steel with ergonomic handles for precision cutting.",
      },
    ]*/

    //const product = products.find((p) => p.id === id)
    const response = await fetch(`http://127.0.0.1:8000/api/product_details/${id}`);
    if (!response.ok) {
      throw new Error("Ошибка при загрузке продукта");
    }

    // Парсим JSON-ответ
    const product: Product = await response.json();
    if (!product) {
      throw new Error("Product not found")
    }

    return product
  },
}

// Orders API
/*export const ordersAPI = {
  getAll: async () => {
    // Check if user is authenticated
    const token = getAuthToken()
    /*if (!token) {
      throw new Error("Authentication required")
    }*/

    // In a real app, this would be an API call
    // return fetchAPI('/orders')

    // For demo purposes, we'll use mock data with a delay to simulate API call
    //await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock orders data
    /*return [
      {
        id: "ORD-12345",
        date: "March 8, 2025",
        status: "Processing",
        total: 329.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "Credit Card (ending in 4242)",
        items: [
          {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 79.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 3,
            name: "Smart Watch Series 5",
            price: 199.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 4,
            name: "Kitchen Knife Set",
            price: 49.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
      {
        id: "ORD-12344",
        date: "March 1, 2025",
        status: "Shipped",
        total: 114.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "PayPal",
        items: [
          {
            id: 2,
            name: "Premium Cotton T-Shirt",
            price: 24.99,
            quantity: 2,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 5,
            name: "Organic Face Cream",
            price: 34.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 7,
            name: "Stainless Steel Water Bottle",
            price: 19.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
      {
        id: "ORD-12343",
        date: "February 15, 2025",
        status: "Delivered",
        total: 249.97,
        shippingAddress: "123 Main St, Anytown, CA 12345",
        paymentMethod: "Credit Card (ending in 4242)",
        items: [
          {
            id: 8,
            name: "Wireless Earbuds",
            price: 89.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: 3,
            name: "Smart Watch Series 5",
            price: 199.99,
            quantity: 1,
            image: "/placeholder.svg?height=50&width=50",
          },
        ],
      },
    ]*/
  //},

  // getById: async (id: string) => {
  //   // Check if user is authenticated
  //   const token = getAuthToken()
  //   if (!token) {
  //     throw new Error("Authentication required")
  //   }

  //   // In a real app, this would be an API call
  //   // return fetchAPI(`/orders/${id}`)

  //   // For demo purposes, we'll use mock data with a delay to simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 800))

  //   // Mock orders data
  //   const orders = [
  //     {
  //       id: "ORD-12345",
  //       date: "March 8, 2025",
  //       status: "Processing",
  //       total: 329.97,
  //       shippingAddress: "123 Main St, Anytown, CA 12345",
  //       paymentMethod: "Credit Card (ending in 4242)",
  //       items: [
  //         {
  //           id: 1,
  //           name: "Wireless Bluetooth Headphones",
  //           price: 79.99,
  //           quantity: 1,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //         {
  //           id: 3,
  //           name: "Smart Watch Series 5",
  //           price: 199.99,
  //           quantity: 1,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //         {
  //           id: 4,
  //           name: "Kitchen Knife Set",
  //           price: 49.99,
  //           quantity: 1,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //       ],
  //     },
  //     {
  //       id: "ORD-12344",
  //       date: "March 1, 2025",
  //       status: "Shipped",
  //       total: 114.97,
  //       shippingAddress: "123 Main St, Anytown, CA 12345",
  //       paymentMethod: "PayPal",
  //       items: [
  //         {
  //           id: 2,
  //           name: "Premium Cotton T-Shirt",
  //           price: 24.99,
  //           quantity: 2,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //         {
  //           id: 5,
  //           name: "Organic Face Cream",
  //           price: 34.99,
  //           quantity: 1,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //         {
  //           id: 7,
  //           name: "Stainless Steel Water Bottle",
  //           price: 19.99,
  //           quantity: 1,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //       ],
  //     },
  //     {
  //       id: "ORD-12343",
  //       date: "February 15, 2025",
  //       status: "Delivered",
  //       total: 249.97,
  //       shippingAddress: "123 Main St, Anytown, CA 12345",
  //       paymentMethod: "Credit Card (ending in 4242)",
  //       items: [
  //         {
  //           id: 8,
  //           name: "Wireless Earbuds",
  //           price: 89.99,
  //           quantity: 1,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //         {
  //           id: 3,
  //           name: "Smart Watch Series 5",
  //           price: 199.99,
  //           quantity: 1,
  //           image: "/placeholder.svg?height=50&width=50",
  //         },
  //       ],
  //     },
  //   ]

  //   const order = orders.find((o) => o.id === id)

  //   if (!order) {
  //     throw new Error("Order not found")
  //   }

  //   return order
  // },
//}
export const ordersAPI = {
  getAll: async () => {
    /*const token = getAuthToken(); // Получаем токен авторизации
    if (!token) {
      throw new Error("Authentication required");
    }*/

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const response = await fetch("http://127.0.0.1:8000/api/order/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`, // Передаем токен в заголовке
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const orders = await response.json();
      console.log(orders[0])
      // Форматируем данные под формат мок-даты
      return orders.map((order) => ({
        id: `ORD-${order.id}`, // Префикс ORD-
        date: order.date, // Дата как строка
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize статус
        total: parseFloat(order.total), // Преобразуем цену в float
        shippingAddress: order.shippingInfo.address, // Адрес доставки
        paymentMethod: order.paymentMethod.includes("Credit Card")
          ? `Credit Card (ending in ****)` // Форматируем кредитную карту
          : order.paymentMethod,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price), // Преобразуем цену в float
          quantity: item.quantity,
          image: `http://127.0.0.1:8000${item.image}` || "/placeholder.svg?height=50&width=50", // Дефолтное изображение
        })),
      }));
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
      throw error;
    }
  },
};

