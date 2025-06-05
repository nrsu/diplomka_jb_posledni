# main.py
from fastapi import FastAPI, HTTPException
from typing import List
import torch
import pandas as pd
import numpy as np
from model import MatrixFactorization

app = FastAPI()

# Load model
checkpoint = torch.load("model.pth")
num_users = checkpoint["num_users"]
num_items = checkpoint["num_items"]
k = checkpoint["k"]

model = MatrixFactorization(num_users, num_items, k)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

# Sample mapping
user_mapping = {f"User{i+1}": i for i in range(num_users)}
item_mapping = {i: f"Item{i+1}" for i in range(num_items)}

@app.get("/recommend/{user_id}", response_model=List[str])
def recommend(user_id: str, top_k: int = 3):
    if user_id not in user_mapping:
        raise HTTPException(status_code=404, detail="User not found")

    user_idx = user_mapping[user_id]
    with torch.no_grad():
        predictions = model()  # Full rating matrix
        user_ratings = predictions[user_idx]  # Ratings for this user
        top_indices = torch.topk(user_ratings, top_k).indices.numpy()
        return [item_mapping[i] for i in top_indices]
