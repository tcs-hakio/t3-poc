
import os
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer
import jwt
from functools import wraps

token_auth_scheme = HTTPBearer()


def set_up_auth0():
    """Sets up configuration for the app"""
    config = {
        "DOMAIN": os.getenv("AUTH0_DOMAIN", "your.domain.com"),
        "API_AUDIENCE": os.getenv("AUTH0_API_AUDIENCE", "your.audience.com"),
        "ISSUER": os.getenv("AUTH0_ISSUER", "https://your.domain.com/"),
        "ALGORITHMS": os.getenv("AUTH0_ALGORITHMS", "RS256"),
    }
    return config


class VerifyToken():
    """Does all the token verification using PyJWT"""

    def __init__(self, token):
        self.token = token
        self.config = set_up_auth0()

        # This gets the JWKS from a given URL and does processing so you can
        # use any of the keys available
        jwks_url = f'https://{self.config["DOMAIN"]}/.well-known/jwks.json'
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    def verify(self):
        # This gets the 'kid' from the passed token
        try:
            self.signing_key = self.jwks_client.get_signing_key_from_jwt(
                self.token
            ).key
        except jwt.exceptions.PyJWKClientError as error:
            return {"status": "error", "msg": error.__str__()}
        except jwt.exceptions.DecodeError as error:
            return {"status": "error", "msg": error.__str__()}

        try:
            payload = jwt.decode(
                self.token,
                self.signing_key,
                algorithms=self.config["ALGORITHMS"],
                audience=self.config["API_AUDIENCE"],
                issuer=self.config["ISSUER"],
            )
        except Exception as e:
            return {"status": "error", "message": str(e)}

        return payload


# Auth0 decorator
def jwt_secured(func):
    @wraps(func)
    async def wrapper(request: Request, token: str = Depends(token_auth_scheme), *args, **kwargs):
        try:
            result = VerifyToken(token.credentials).verify()
            if 'status' in result:
                result['aud'] + '' # Just doing this to trigger the exception
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Authentication failed: {result['msg']}")

        return await func(request, token, *args, **kwargs)

    return wrapper
