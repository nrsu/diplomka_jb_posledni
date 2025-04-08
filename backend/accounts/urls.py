from django.urls import path
from .views import *

urlpatterns = [
    path("login/", login_view, name="login"),
    path("signup/", signup_view, name="signup"),
    path("user-details/", get_user_details, name="user-details"),
    path("user-details/<str:username>/", update_user_details, name="user-details"),
    path("products/", get_products, name="get-products"),
    path("categories/", get_categories, name="get-categories"),
    path("product_details/<str:product_id>/", get_product_details, name="product-details"),
    path("order/create/", post_order, name="post-order"),
    path("order/", get_order, name="get-order"),
    path("review/<str:product_id>/", get_review, name="get-review"),
    path("post-review/<str:product_id>/", post_review, name="post-review"),
    path("user/password/", update_password, name="update-password"),
    path("profile-picture/", get_profile_picture, name="get-profile-picture"),
    path('upload-profile-picture/', upload_profile_picture, name='upload_profile_picture'),
    path('get-seller-products/', get_seller_products, name='get-seller-products'),
    path('create-product/', create_product, name='create-product'),
    path('products/<int:product_id>/update/', update_product, name='update-product'),
    path('products/<int:product_id>/delete/', delete_product, name='delete-product'),
    path("orders/seller/", get_seller_orders, name="get_seller_orders"),
    path("orders/<int:order_id>/update-status/", update_order_status),
    path("update_or_delete_review/<int:pk>/", update_or_delete_review, name="update_or_delete_review"),
]
