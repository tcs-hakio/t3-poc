from fastapi import FastAPI, Depends, Request
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
from functools import wraps
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set the appropriate origins or use a list of specific domains
    allow_credentials=True,
    allow_methods=["*"],  # Set the appropriate HTTP methods
    allow_headers=["*"],  # Set the appropriate HTTP headers
)
security = HTTPBearer()

# Load environment variables from .env file
load_dotenv()

# Auth0 configuration
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')

API_IDENTIFIER = os.getenv('API_IDENTIFIER')
PUB_KEY = os.getenv('PUB_KEY')
ALGORITHMS = ['RS256']
TOKEN_EXPIRATION = int(os.getenv('TOKEN_EXPIRATION', 3600))  # Default expiration time of 1 hour

# Auth0 decorator
def auth0_secured():
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            authorization: str = request.headers.get("Authorization")
            if not authorization or not authorization.startswith("Bearer "):
                return {"message": "Invalid authorization header"}, 401

            token = authorization.split(" ")[1]
            try:
                payload = jwt.decode(
                    token,
                    PUB_KEY,
                    algorithms=ALGORITHMS,
                    audience=API_IDENTIFIER,
                    issuer=f'https://{AUTH0_DOMAIN}/',
                )

                print(payload)
                # Perform additional checks or extract information from the payload if needed
                # ...
            except Exception as e:
                return {"message": f"Authentication failed {e}"}, 401

            return await func(request, *args, **kwargs)
        return wrapper
    return decorator


# Protected route
@app.get("/protected")
@auth0_secured()
async def protected_route(request: Request):
    return {"message": "This route is protected"}


@app.get("/secret")
@auth0_secured()
async def protected_route(request: Request):
    return {"message": "This route is protected"}


# Public route
@app.get("/public")
async def public_route():
    return {"secret": "Mega secret message"}


# Token validation endpoint
@app.get("/validate_token")
async def validate_token(access_token: str):
    try:
        payload = jwt.decode(
            access_token,
            PUB_KEY,
            algorithms=ALGORITHMS,
            audience=API_IDENTIFIER,
            issuer=f'https://{AUTH0_DOMAIN}/',
        )
        # Perform additional checks or extract information from the payload if needed
        # ...

        return {"message": "Token validation successful"}
    except Exception as e:
        return {"message": "Token validation failed"}


# Token refresh endpoint
@app.get("/refresh_token")
async def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(
            refresh_token,
            PUB_KEY,
            algorithms=ALGORITHMS,
            audience=AUTH0_CLIENT_ID,
            issuer=f'https://{AUTH0_DOMAIN}/',
        )
        # Perform additional checks or extract information from the payload if needed
        # ...

        # Generate new access token with an updated expiration time
        new_payload = {
            "sub": payload["sub"],
            "exp": datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION),
            "aud": payload["aud"],
            "iss": payload["iss"],
            # Add additional claims as needed
            # ...
        }
        new_access_token = jwt.encode(new_payload, PRIVATE_KEY, algorithm=ALGORITHMS[0])

        return {"access_token": new_access_token}
    except Exception as e:
        return {"message": "Token refresh failed"}


# Token refresh endpoint
@app.get("/get_jwt")
async def get_jwt(access_token: str):
    try:
        import requests
        import json

        # Define the request payload
        payload = {
            "access_token": access_token,
            "client_id": "ARWY5KrA22904NEPtrz9xyEU5h5xx6zs",
            "client_secret": "aavSGUgWPq-_Y3Rq1xI59Vx6zjB-VsgTo5J7pugPfEGjDkp9WBJB1UmerU1av3am",
            "audience": "http://localhost:8000/",
            "grant_type": "client_credentials"
        }

        # Set the headers
        headers = {
            "Content-Type": "application/json"
        }

        # Send the POST request
        response = requests.post("https://dev-po2xt7vso71m0yqb.eu.auth0.com/oauth/token", json=payload, headers=headers)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Extract the access token from the response
            bearer_token = response.json()["access_token"]
            print("Access Token:", access_token)
        else:
            print("Request failed with status code:", response.status_code)
    
        return {"bearer_token": bearer_token}
    except Exception as e:
        return {"message": f"Token refresh failed {e}"}


@app.get("/get_auth0_token")
async def get_auth0_token():
    from auth0.authentication import GetToken

    try:

        domain = 'dev-po2xt7vso71m0yqb.eu.auth0.com'
        non_interactive_client_id = 'xxn934YhU4OR6ji76regOns75JMrzxIZ'
        non_interactive_client_secret = 'GgMxErM0LbpH31NLNCkZfy5Wa7ylcHSpaBShcxi5_HYkEcQjZRKNHPQMjnJkVfCT'

        get_token = GetToken(domain, non_interactive_client_id, client_secret=non_interactive_client_secret)
        token = get_token.client_credentials(f'https://{domain}/oauth/token/')
        mgmt_api_token = token['access_token']

        print(mgmt_api_token)
        
    except Exception as e:
        print(e)