from django.contrib import admin
from .models import *
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(OrderItem)
admin.site.register(ShippingInfo)
admin.site.register(Order)
admin.site.register(Review)
admin.site.register(ProfilePicture)
admin.site.register(ProductImage)