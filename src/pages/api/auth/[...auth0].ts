// pages/api/auth/[...auth0].js
// pages/api/auth/[auth0].js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
    login: handleLogin({
        authorizationParams: {
            audience: 'http://localhost:8000/', // or AUTH0_AUDIENCE
            // Add the `offline_access` scope to also get a Refresh Token
            scope: 'openid read:forecast' // or AUTH0_SCOPE
        }
    })
});

// This creates the following routes:

// /api/auth/login: The route used to perform login with Auth0.
// /api/auth/logout: The route used to log the user out.
// /api/auth/callback: The route Auth0 will redirect the user to after a successful login.
// /api/auth/me: The route to fetch the user profile from.

