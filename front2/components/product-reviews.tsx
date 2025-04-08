"use client"

import type React from "react"
import { productsAPI } from "@/services/api"
import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Modal from "./modal"
import { User } from "@/contexts/auth-context"
import { Edit, Trash } from "lucide-react"

interface ProductReviewsProps {
  productId: number
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
  user: User
  canEdit: boolean
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
  const [editedText, setEditedText] = useState("")
  const [editedRating, setEditedRating] = useState(0)
  //const can_edit=true 
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const response = await fetch(`http://127.0.0.1:8000/api/post-review/${productId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          rating,
          text: reviewText
        })
      })

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Если статус 401 (Unauthorized), показываем другое сообщение
          setErrorMessage("You need to be logged in to submit a review.");
        } else {
          // Для других ошибок показываем стандартное сообщение
          setErrorMessage(errorData.message || "You have already submitted a review for this product.");
        }


        
        //setErrorMessage(errorData.message || "You have already submitted a review for this product.");
        setIsErrorModalOpen(true);
        throw new Error("Failed to submit review");
      }
      
      setReviewText("");
      setRating(0)
      fetchReviews()

    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const handleEditReview = (review: Review) => {
    setIsEditing(true)
    setEditingReviewId(review.id)
    setEditedText(review.text)
    setEditedRating(review.rating)
  }

  const handleSaveEditReview = async () => {
    if (!editedText.trim() || !editedRating) return

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}")
      const response = await fetch(`http://127.0.0.1:8000/api/update_or_delete_review/${editingReviewId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          rating: editedRating,
          text: editedText,
        })
      })

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to edit review.");
        setIsErrorModalOpen(true);
        return
      }

      setIsEditing(false)
      setEditingReviewId(null)
      fetchReviews()

    } catch (error) {
      console.error("Error editing review:", error)
    }
  }

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}")
      const response = await fetch(`http://127.0.0.1:8000/api/update_or_delete_review/${reviewId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        }
      })

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to delete review.");
        setIsErrorModalOpen(true);
        return
      }

      fetchReviews()

    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }  


  const averageRating =
  reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Customer Reviews</h3>
        <div className="flex items-center">
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
          <span className="ml-2 text-sm text-muted-foreground">Based on {reviews.length} reviews</span>
        </div>
      </div>

      <form onSubmit={handleSubmitReview} className="mb-8">
        <h4 className="font-medium mb-2">Write a Review</h4>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="mr-2">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button type="submit" disabled={!rating || !reviewText.trim()}>
          Submit Review
        </Button>
      </form>

      <Separator className="my-6" />

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) =>{ 
            console.log("can_edit for review:", review.user_name); 
            return(
            <div key={review.id} className="space-y-2">
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={`http://127.0.0.1:8000${review.user_avatar}`} alt={review.user_name} />
                  {/* <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback> */}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{review.user_name}</h4>
                    <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                  </div>
                  <div className="flex my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                  <div className="flex items-center mt-2">
                    <button className="flex items-center text-xs text-muted-foreground hover:text-foreground mr-4">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful_count})
                    </button>
                    <button className="flex items-center text-xs text-muted-foreground hover:text-foreground">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Not helpful
                    </button>
                    
                     {review.can_edit===true && ( 
                      <div className="ml-4 flex">
                        <button onClick={() => handleEditReview(review)}
                          className="flex items-center text-xs text-muted-foreground hover:text-foreground mr-4">
                          <Edit className="mr-2 h-4 w-4" /> 
                        </button>
                        <button onClick={() => handleDeleteReview(review.id)}
                          className="flex items-center text-xs text-muted-foreground hover:text-foreground mr-4">
                          <Trash className="mr-2 h-4 w-4" /> 
                        </button>
                      </div>
                     )} 
                  </div>
                </div>
              </div>
            </div>
          )})
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Review">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-2">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditedRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${star <= editedRating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Update your thoughts about this product..."
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleSaveEditReview}>Save Changes</Button>
        </Modal>
      )}

      <Modal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} title="Error">
        <p>{errorMessage}</p>
      </Modal>
    </div>
  )
}


// const mockReviews = [
//   {
//     id: 1,
//     productId: 1,
//     userName: "John Doe",
//     userAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 5,
//     date: "2 months ago",
//     text: " headphones are amazing! The sound quality is excellent and they're very comfortable to wear for long periods. Battery life is impressive too.",
//     helpfulCount: 12,
//   },
//   {
//     id: 2,
//     productId: 1,
//     userName: "Jane Smith",
//     userAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4,
//     date: "1 month ago",
//     text: "Great headphones overall. The noise cancellation works well, but I wish the ear cups were a bit larger. Still, I'm very happy with my purchase.",
//     helpfulCount: 8,
//   },
//   {
//     id: 3,
//     productId: 2,
//     userName: "Mike Johnson",
//     userAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 5,
//     date: "3 weeks ago",
//     text: "This t-shirt is so comfortable! The fabric is soft and breathable, and it fits perfectly. I've already ordered two more in different colors.",
//     helpfulCount: 5,
//   },
//   {
//     id: 4,
//     productId: 3,
//     userName: "Sarah Williams",
//     userAvatar: "/placeholder.svg?height=40&width=40",
//     rating: 4,
//     date: "2 weeks ago",
//     text: "The smart watch has a lot of great features and the battery lasts longer than I expected. The only downside is that the screen is a bit small for my liking.",
//     helpfulCount: 3,
//   },
// ]

