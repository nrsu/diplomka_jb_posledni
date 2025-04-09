from django.core.mail import send_mail
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, parser_classes
import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # ✅ Доступ только авторизованным
def get_user_details(request):
    print("Получен запрос от:", request.user)  # 🔥 Логируем юзера
    if not request.user.is_authenticated:
        return Response({"error": "Пользователь не авторизован"}, status=401)

    return Response({
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        "username": request.user.username
    })


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_details(request, username):  # Используем username вместо id
    try:
        user = User.objects.get(username=username)  # Получаем пользователя по username
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method in ["PUT", "PATCH"]:
        data = request.data
        print("Полученные данные:", request.data)
        user.first_name = data.get("firstName", user.first_name)
        user.last_name = data.get("lastName", user.last_name)
        user.email = data.get("email", user.email)

        user.save()

        return Response({
            "message": "User details updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)

    


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            user = User.objects.filter(email=email).first()
            if user is None:
                return JsonResponse({"error": "User not found"}, status=404)

            auth_user = authenticate(username=user.username, password=password)
            if auth_user is None:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

            tokens = get_tokens_for_user(auth_user)  # ✅ Только токены, без login()
            
            print("Отправляем токены:", tokens) 

            return JsonResponse({
                "message": "Login successful",
                "user": {
                    "id": auth_user.id,
                    "username": auth_user.username,
                    "email": auth_user.email,
                    "first_name": auth_user.first_name,
                    "last_name": auth_user.last_name,
                },
                "tokens": tokens
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)



@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            username = data.get("username") or f"user_{User.objects.count() + 1}"

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "User already exists"}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", "")
            )

            # ✅ Логиним пользователя в сессии Django
            login(request, user)

            # ✅ Генерируем JWT токены
            tokens = get_tokens_for_user(user)

            # ✅ Возвращаем всю инфу о пользователе
            return JsonResponse({
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "tokens": tokens
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)

def get_products(request):
    products = Product.objects.all()

    # Создаем список продуктов с первой картинкой
    product_data = []
    for product in products:
        # Получаем первое изображение для каждого продукта
        first_image = product.images.first()  # Берем первое изображение, если оно существует
        image_url = first_image.image.url if first_image else None  # Получаем URL изображения или None

        # Добавляем информацию о продукте с изображением
        product_data.append({
            "id": product.id,
            "name": product.name,
            "category": product.category.name,
            "price": float(product.price) if product.price is not None else None,
            "image": image_url,
            "colors": product.colors,
            "sizes": product.sizes,
            "description": product.description,
            "dimensions": product.dimensions,
            "materials": product.materials,
            "in_the_box": product.in_the_box,
            "quantity": product.quantity,
            "created_at": product.created_at,
            "sold": product.sold,
            "weekly_sold": product.weekly_sold,
        })

    return JsonResponse(product_data, safe=False)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_seller_products(request):
    products = Product.objects.filter(user=request.user)
    return JsonResponse([product.to_dict() for product in products], safe=False)

def get_categories(request):
    categories = Category.objects.all()
    return JsonResponse([category.to_dict() for category in categories], safe=False)

@csrf_exempt
def get_product_details(request, product_id):
    # Получаем продукт
    product = get_object_or_404(Product, id=product_id)
    
    # Получаем все изображения, связанные с этим продуктом
    product_images = ProductImage.objects.filter(product=product)
    image_urls = [image.image.url for image in product_images]
    first_image_url = product_images.first().image.url if product_images.exists() else None
    
    # Формируем данные о продукте
    product_data = product.to_dict()
    product_data['image']=first_image_url
    product_data['images'] = image_urls  # Добавляем список изображений

    return JsonResponse(product_data, safe=False)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_order(request):
    print(f"📩 Новый заказ от: {request.user}")  # Логирование юзера

    data = request.data  # Получаем JSON из запроса

    if not data.get("items"):
        return Response({"error": "Корзина пуста"}, status=400)

    try:
        with transaction.atomic():  # ✅ Транзакция для целостности
            # Создание заказа
            order = Order.objects.create(
                user=request.user,
                total_price=data.get("total_price", 0.0),
                payment_method=data.get("payment_method", "credit-card"),
            )

            # Добавление товаров в заказ
            order_items = []
            for item in data["items"]:
                product = Product.objects.select_for_update().get(id=item["product_id"])  # 🔒 Блокируем на время транзакции
                ordered_quantity = item["quantity"]
                if product.quantity < ordered_quantity:
                    raise ValueError(f"Недостаточно товара '{product.name}' в наличии (доступно: {product.quantity})")
                product.quantity -= ordered_quantity
                product.sold += ordered_quantity
                product.save()
                order_item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=ordered_quantity,
                    selected_color=item.get("selected_color"),
                    selected_size=item.get("selected_size"),
                )
                order_items.append(order_item)

            # Создание информации о доставке
            shipping = data.get("shipping", {})
            shipping_info = ShippingInfo.objects.create(
                order=order,
                first_name=shipping.get("first_name", ""),
                last_name=shipping.get("last_name", ""),
                email=shipping.get("email", ""),
                phone=shipping.get("phone", ""),
                address=shipping.get("address", ""),
                city=shipping.get("city", ""),
                state=shipping.get("state", ""),
                zip_code=shipping.get("zip_code", ""),
                country=shipping.get("country", "Kazakhstan"),
            )
        # ✉️ Отправка письма клиенту
        print("rabotaet")
        print("Отправка email на:", shipping_info.email)
        subject = "Ваш заказ принят!"
        message = f"""
Здравствуйте, {shipping_info.first_name}!

Спасибо за покупку! Вот детали вашего заказа:

Номер заказа: {order.id}
Сумма: {order.total_price} ₸
Способ оплаты: {order.payment_method}
Дата заказа: {order.created_at.strftime('%d.%m.%Y %H:%M')}

Товары:
"""
        for item in order_items:
            message += f"- {item.product.name} x{item.quantity}\n"

        message += f"""

Информация о доставке:
{shipping_info.address}, {shipping_info.city}, {shipping_info.country}
Телефон: {shipping_info.phone}

Мы свяжемся с вами в ближайшее время!
С уважением, команда Zhibek Zholy.
"""
        
        send_mail(
            subject,
            message,
            None,  # Использует DEFAULT_FROM_EMAIL
            [shipping_info.email],
            fail_silently=True,
        )
        # Готовим JSON-ответ
        response_data = {
            "id": order.id,
            "user": order.user.id,
            "payment_method": order.payment_method,
            "total_price": float(order.total_price),
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product.id,
                    "quantity": item.quantity,
                    "selected_color": item.selected_color,
                    "selected_size": item.selected_size,
                }
                for item in order_items
            ],
            "shipping_info": {
                "id": shipping_info.id,
                "first_name": shipping_info.first_name,
                "last_name": shipping_info.last_name,
                "email": shipping_info.email,
                "phone": shipping_info.phone,
                "address": shipping_info.address,
                "city": shipping_info.city,
                "state": shipping_info.state,
                "zip_code": shipping_info.zip_code,
                "country": shipping_info.country,
            },
        }

        return Response(response_data, status=201)

    except Product.DoesNotExist:
        return Response({"error": "Один из продуктов не найден"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order(request):
    print("Получен запрос от:", request.user)

    orders = Order.objects.filter(user=request.user).prefetch_related("items__product", "shipping_info")

    order_data = []
    for order in orders:
        shipping_info = order.shipping_info.first()  # ✅ Берем первый объект, если есть

        order_data.append({
            "id": order.id,
            "date": order.created_at.strftime("%B %d, %Y"),
            "status": order.status,
            "total": float(order.total_price),
            "paymentMethod": order.payment_method,
            "shippingInfo": {
                "first_name": shipping_info.first_name,
                "last_name": shipping_info.last_name,
                "email": shipping_info.email,
                "phone": shipping_info.phone,
                "address": shipping_info.address,
                "city": shipping_info.city,
                "state": shipping_info.state,
                "zip_code": shipping_info.zip_code,
                "country": shipping_info.country,
            } if shipping_info else None,  # ✅ Проверка, если доставки нет
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product.id,
                    "name": item.product.name,
                    "price": float(item.product.price),
                    "quantity": item.quantity,
                    "selected_color": item.selected_color,
                    "selected_size": item.selected_size,
                    "image": item.product.images.first().image.url if item.product.images.exists() else "/placeholder.svg?height=50&width=50",  # ✅ Безопасная проверка
                }
                for item in order.items.all()
            ],
        })

    return Response(order_data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_review(request, product_id):
    current_user = request.user #if request.user.is_authenticated else None
    print(f"Current User: {current_user}")
    reviews = Review.objects.filter(product_id=product_id)
    reviews_data = [review.to_dict(current_user=current_user) for review in reviews]
    return JsonResponse(reviews_data, safe=False)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_review(request, product_id):

    data = json.loads(request.body)
    rating = data.get("rating")
    text = data.get("text")

    user = request.user

    # Проверяем, существует ли продукт
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    # Проверяем, оставлял ли пользователь уже отзыв на этот товар
    if Review.objects.filter(product=product, user=user).exists():
        return JsonResponse({"error": "You have already submitted a review for this product."}, status=403)

    # Создаём новый отзыв
    review = Review.objects.create(
        product=product,
        user=user,
        rating=rating,
        text=text
    )

    return JsonResponse({
        "message": "Review submitted successfully",
        "review": {
            "id": review.id,
            "user": user.username,
            "rating": review.rating,
            "text": review.text,
            "helpful_count": review.helpful_count,
            "created_at": review.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
    }, status=201)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    data = request.data
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not current_password or not new_password:
        return Response({'error': 'Текущий и новый пароли обязательны'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({'error': 'Неверный текущий пароль'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Пароль успешно обновлен'}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def get_profile_picture(request):
    default_image_url = '/media/profile_pics/default.jpg'
    try:
        profile = request.user.profile  # thanks to related_name='profile'
        image_url = profile.image.url if profile.image else default_image_url
    except ProfilePicture.DoesNotExist:
        image_url = default_image_url

    return JsonResponse({
            "user_id": request.user.id,
            "image": image_url
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_picture(request):
    user = request.user
    image_file = request.FILES.get("image")

    if not image_file:
        return JsonResponse({"error": "Изображение не отправлено"}, status=400)

    profile, created = ProfilePicture.objects.get_or_create(user=user)
    profile.image = image_file
    profile.save()

    return JsonResponse({
        "message": "Аватар успешно загружен",
        "user_id": user.id,
        "image": profile.image.url
    }, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_product(request):
    data = request.data
    user = request.user

    try:
        product = Product.objects.create(
            name=data.get("name"),
            category_id=data.get("category_id"),
            user=user,
            original_price=Decimal(data.get("original_price")),
            discount=int(data.get("discount", 0)),
            quantity=int(data.get("quantity", 0)),
            image=data.get("image"),  # если передаешь файл через multipart/form-data
            colors=data.get("colors", []),
            sizes=data.get("sizes", []),
            description=data.get("description", "test"),
            dimensions=data.get("dimensions", "test"),
            materials=data.get("materials", "test"),
            in_the_box=data.get("in_the_box", "test")
        )

        return Response(product.to_dict(), status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id, user=request.user)
    except Product.DoesNotExist:
        return Response({"error": "Товар не найден или доступ запрещён"}, status=404)

    data = request.data

    product.name = data.get("name", product.name)
    product.category_id = data.get("category_id", product.category_id)
    product.original_price = data.get("original_price", product.original_price)
    product.discount = data.get("discount", product.discount)
    product.quantity = data.get("quantity", product.quantity)
    product.colors = data.get("colors", product.colors)
    product.sizes = data.get("sizes", product.sizes)
    product.description = data.get("description", product.description)
    product.dimensions = data.get("dimensions", product.dimensions)
    product.materials = data.get("materials", product.materials)
    product.in_the_box = data.get("in_the_box", product.in_the_box)

    if "image" in request.FILES:
        product.image = request.FILES["image"]

    product.save()
    return Response(product.to_dict(), status=200)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id, user=request.user)
    except Product.DoesNotExist:
        return Response({"error": "Товар не найден или доступ запрещён"}, status=404)

    product.delete()
    return Response({"message": "Товар успешно удалён"}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_seller_orders(request):
    seller = request.user

    # Получаем все order items, где продукт принадлежит текущему продавцу
    order_items = OrderItem.objects.select_related("order", "product").filter(product__user=seller)

    # Собираем заказы
    orders_data = {}
    for item in order_items:
        order_id = item.order.id
        if order_id not in orders_data:
            orders_data[order_id] = {
                "id": item.order.id,
                "buyer_id": item.order.user.id,
                "payment_method": item.order.payment_method,
                "total_price": float(item.order.total_price),
                "status": item.order.status,
                "created_at": item.order.created_at.isoformat(),
                "items": []
            }

        orders_data[order_id]["items"].append({
            "product_id": item.product.id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "selected_color": item.selected_color,
            "selected_size": item.selected_size,
        })

    return Response(list(orders_data.values()), status=200)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get("status")

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Недопустимый статус"}, status=400)

        # Проверка: есть ли товары в заказе, принадлежащие текущему пользователю
        seller_items = order.items.filter(product__user=request.user)
        if not seller_items.exists():
            return Response({"error": "Вы не можете изменить статус этого заказа"}, status=403)

        order.status = new_status
        order.save()

        # Отправка письма клиенту
        try:
            shipping_info = ShippingInfo.objects.get(order=order)
            subject = f"Обновление статуса заказа #{order.id}"
            message = f"""
Здравствуйте, {shipping_info.first_name}!

Статус вашего заказа №{order.id} был обновлён.

Текущий статус: {order.status.upper()}

Спасибо, что выбираете Zhibek Zholy!
"""
            send_mail(
                subject,
                message,
                None,
                [shipping_info.email],
                fail_silently=True,
            )
        except ShippingInfo.DoesNotExist:
            pass

        return Response({
            "message": "Статус заказа обновлён",
            "order_id": order.id,
            "new_status": order.status
        })

    except Order.DoesNotExist:
        return Response({"error": "Заказ не найден"}, status=404)

@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def update_or_delete_review(request, pk):
    try:
        review = Review.objects.get(pk=pk)
    except Review.DoesNotExist:
        return Response({"message": "Review not found"}, status=404)

    if review.user != request.user:
        return Response({"message": "Permission denied"}, status=403)

    if request.method == "PUT":
        data = request.data
        review.text = data.get("text", review.text)
        review.rating = data.get("rating", review.rating)
        review.save()
        return Response({"message": "Review updated successfully"})

    elif request.method == "DELETE":
        review.delete()
        return Response({"message": "Review deleted successfully"})
    
