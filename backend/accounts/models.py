from django.db import models
from decimal import Decimal
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import os

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
        }

def product_image_upload_to(instance, filename):
    # Если это Product — instance.id
    if isinstance(instance, Product):
        if instance.id:
            return os.path.join('product_images', str(instance.id), filename)
        else:
            return os.path.join('product_images', 'temporary', filename)

    # Если это ProductImage — instance.product.id
    elif isinstance(instance, ProductImage):
        if instance.product and instance.product.id:
            return os.path.join('product_images', str(instance.product.id), filename)
        else:
            return os.path.join('product_images', 'temporary', filename)

    return os.path.join('product_images', 'unknown', filename)
    
class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    sold = models.PositiveIntegerField(default=0)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="test", null=True, blank=True)  # Используем ImageField
    colors = models.JSONField()
    sizes = models.JSONField()
    description = models.TextField(default="test")
    dimensions = models.TextField(default="test")
    materials = models.TextField(default="test")
    in_the_box = models.TextField(default="test")

    def __str__(self):
        return self.name


    

    def get_first_image(self):
        """Возвращает первое изображение из связанных с продуктом ProductImage объектов."""
        first_image = self.images.first()  # Получаем первое изображение, если оно существует
        if first_image:
            return first_image.image.url  # Возвращаем URL изображения
        return None 

    # @property
    # def image(self):
    #     """Псевдоним для метода get_first_image."""
    #     return self.get_first_image()

    def save(self, *args, **kwargs):
        # if not self.image:
        #     self.image = self.get_first_image()

        if self.discount:  # Проверяем, есть ли скидка
            self.price = self.original_price * (Decimal(1) - Decimal(self.discount) / Decimal(100))
        else:
            self.price = self.original_price  # Если скидки нет, цена остается оригинальной
        super().save(*args, **kwargs)
        if not self.image:
            first_image = self.get_first_image()
            if first_image:
                self.image = first_image
            # Save again if we updated the image
                super().save(*args, **kwargs)


    @property
    def weekly_sold(self):
        one_week_ago = timezone.now() - timedelta(days=7)
        order_items = OrderItem.objects.filter(
            product=self,
            order__created_at__gte=one_week_ago,
            order__status__in=['processing', 'shipped', 'delivered']  # можно ограничить только успешными заказами
        )
        return sum(item.quantity for item in order_items)

    @property
    def image_directory(self):
        """Возвращает директорию, в которой хранится изображение продукта."""
        if self.image:
            return os.path.dirname(self.image.name)  # Путь к директории
        return None

    def to_dict(self):
        """Возвращает данные о продукте с учетом скидки."""
        product_data = {
            "id": self.id,
            "name": self.name,
            "category": self.category.name,
            "price": float(self.price) if self.price is not None else None,
            #"isDiscount": self.discount > 0,
            "image": self.image.url if self.image else None,
            "colors": self.colors,
            "sizes": self.sizes,
            "description": self.description,
            "dimensions": self.dimensions,
            "materials": self.materials,
            "in_the_box": self.in_the_box,
            "quantity": self.quantity,
            "created_at": self.created_at,
            "sold": self.sold,
            "weekly_sold": self.weekly_sold,
            "image_directory": self.image_directory
        }

        if self.discount > 0:
            product_data["originalPrice"] = float(self.original_price)
            product_data["discount"] = self.discount

        return product_data

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=product_image_upload_to, null=True, blank=True)

    def clean(self):
        # Проверяем количество изображений, связанных с продуктом
        if self.product.images.count() >= 4:
            raise ValidationError("A product can have a maximum of 4 images.")

    def save(self, *args, **kwargs):
        self.clean()  # Вызовем чистку перед сохранением
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - Image {self.id}"


class Order(models.Model):
    STATUS_CHOICES = [
        # ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "#ORD-"+str(self.id)

    def to_dict(self):
        return {
            "user": self.user,
            "payment_method": self.payment_method,
            "total_price": self.total_price,
            "status": self.status,
            "created_at": self.created_at
        }

class ShippingInfo(models.Model):
    order = models.ForeignKey(Order, related_name='shipping_info', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='Kazakhstan')

    def __str__(self):
        return "#ORD-"+str(self.order.id)

    def to_dict(self):
        return{
            "order": self.order,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "country": self.country
        }

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    selected_color = models.CharField(max_length=50, blank=True, null=True)
    selected_size = models.CharField(max_length=50, blank=True, null=True)
    #image = models.ImageField(upload_to=product_image_upload_to, null=True, blank=True)
    def to_dict(self):
        product = self.product
        first_image = product.images.first()
        #print(product)
        return{
            "order": self.order,
            "product": self.product,
            "quantity": self.quantity,
            "selected_color": self.selected_color,
            "selected_size": self.selected_size,
            "image": "zalupa"
        }

class Review(models.Model):
    product = models.ForeignKey('Product', related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    text = models.TextField()
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.product.name+" "+self.user.first_name

    def to_dict(self, current_user=None):
        can_edit = current_user and current_user.id == self.user.id
        profile = getattr(self.user, "profile", None)
        avatar_url = profile.image.url if profile and profile.image else "/placeholder.svg"
        return {
            "id": self.id,
            "product_id": self.product.id,
            "user_name": self.user.first_name + " " + self.user.last_name,
            "user_avatar": avatar_url,  # Можно заменить на реальный URL
            "rating": self.rating,
            "date": self.created_at.strftime("%Y-%m-%d"),
            "text": self.text,
            "helpful_count": self.helpful_count,
            "can_edit": can_edit
        }

class ProfilePicture(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')  # Связь с пользователем
    image = models.ImageField(upload_to='profile_pics/', default='profile_pics/default.jpg')  # Путь для хранения изображения
    def __str__(self):
        return self.user.first_name
    def to_dict(self):
        return{
            "user_id": user.id,
            "image": self.image
        }
    

