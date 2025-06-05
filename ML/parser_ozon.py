from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium_stealth import stealth  
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import re

driver = webdriver.Chrome()
stealth(driver,
        languages=["en-US", "en"],
        vendor="Google Inc.",
        platform="Win64",
        webgl_vendor="Intel Inc.",
        renderer="Intel Iris OpenGL Engine",
        fix_hairline=True)

driver.maximize_window()
#query = input()
url = "https://ozon.by/search/?from_global=true&text=iphone"

#url = "https://www.wildberries.ru/catalog/0/search.aspx?search=iphone"
driver.get(url)

try:
    WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "tile-root")))
except Exception as e:
    print("Элемент не найден:", e)
    driver.quit()
    exit()

body = driver.find_element(By.TAG_NAME, "body")
for _ in range(3):
    body.send_keys(Keys.PAGE_DOWN)
    time.sleep(2)

items = driver.find_elements(By.CLASS_NAME, "tile-root")
products = []
prices = []   
ratings = []
for item in items:
    try:
        name = item.find_element(By.CLASS_NAME, "tsBody500Medium").text
    except:
        name = "Название не найдено"
    
    try:
        price = item.find_element(By.CLASS_NAME, "tsHeadline500Medium").text
    except:
        price = "Цена не найдена"
    
    try:
        link = item.find_element(By.TAG_NAME, "a").get_attribute("href")
    except:
        link = "Ссылка не найдена"
    
    try:
        rating = item.find_element(By.CSS_SELECTOR, ".tsBodyMBold .p6b20-a4 span").text
    except:
        rating = "Рейтинг не найден"
    
    
    product = {
        "name": name,
        "price": price,
        "link": link,
        "rating": rating
    }
    products.append(product)
    
    numeric_price = None
    match = re.search(r'[\d\.,]+', price)
    if match:
        numeric_price = match.group(0)
        numeric_price = numeric_price.replace(',', '').replace(' ', '')
        try:
            numeric_price = float(numeric_price)
        except ValueError:
            numeric_price = None
    if numeric_price is not None:
        prices.append(numeric_price)
    
    numeric_rating = None
    match = re.search(r'[\d\.,]+', rating)
    if match:
        numeric_rating = match.group(0)
        numeric_rating = numeric_rating.replace(',', '.')
        try:
            numeric_rating = float(numeric_rating)
        except ValueError:
            numeric_rating = None
    if numeric_rating is not None:
        ratings.append(numeric_rating)
        
average_price = sum(prices) / len(prices) if prices else None
average_rating = sum(ratings) / len(ratings) if ratings else None

formatted_avg_price = f"{average_price:.3f}".replace(".", " ") if average_price is not None else "Нет данных"
formatted_avg_rating = f"{average_rating:.3f}".replace(".", ".") if average_rating is not None else "Нет данных"

result = {
    "products": products,
    "average_price": formatted_avg_price,
    "average_rating": formatted_avg_rating
}

with open("ozon_iphones.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=4)


driver.quit()

    #print(f"Название: {name}")
   # print(f"Цена: {price}")
   # print(f"Ссылка: {link}")
  #  print(f"Рейтинг: {rating}")
 #   print("-" * 40)

#driver.quit()