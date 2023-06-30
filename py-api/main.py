from fastapi import FastAPI, Depends, Request, Response, status
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
from functools import wraps
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from .utils import VerifyToken, jwt_secured
import requests
import json


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set the appropriate origins or use a list of specific domains
    allow_credentials=True,
    allow_methods=["*"],  # Set the appropriate HTTP methods
    allow_headers=["*"],  # Set the appropriate HTTP headers
)
token_auth_scheme = HTTPBearer()


# Load environment variables from .env file
load_dotenv()
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_API_AUDIENCE = os.getenv('AUTH0_API_AUDIENCE')
AUTH0_ALGORITHMS = os.getenv('AUTH0_ALGORITHMS')
AUTH0_ISSUER = os.getenv('AUTH0_ISSUER')



# Public route
@app.get("/public")
async def public_route():
    return {"message": "Mega public message"}


# Protected route
@app.get("/more-secrets")
@jwt_secured()
async def deco_protected_route(request: Request, token: str = Depends(token_auth_scheme)):
    return {"message": "This route is decorator protected"}


# Token refresh endpoint
@app.post("/get_jwt")
async def get_jwt(request: Request):
    post_data = await request.json()
    try:
        # Define the request payload
        payload = {
            "client_id": post_data['client_id'],
            "client_secret": post_data['client_secret'],
            "audience": post_data['audience'],
            "grant_type": post_data['grant_type']
        }

        # Set the headers
        headers = {
            "Content-Type": "application/json"
        }

        # Send the POST request
        response = requests.post(f"https://{AUTH0_DOMAIN}/oauth/token", json=payload, headers=headers)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Extract the access token from the response
            bearer_token = response.json()["access_token"]
            #print("Access Token:", access_token)
        else:
            print("Request failed with status code:", response.status_code)
    
        return {"bearer_token": bearer_token}
    except Exception as e:
        return {"message": f"Token refresh failed {e}"}
