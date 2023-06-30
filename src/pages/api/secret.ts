// pages/api/products.js
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function secret(req, res) {
    try {
        console.log("secret")
        const { accessToken } = await getAccessToken(req, res, {
            scopes: ['read:forecast']
        });
        console.log(accessToken)

        // This is a contrived example, normally your external API would exist on another domain.
        // http://0.0.0.0:5555/metadata?offset=0&limit=10

        const response = await fetch('http://127.0.0.1:8000/more-secrets', {
            headers: {
                Authorization: `Bearer ${accessToken || ""}`
            }
        });

        const secret = await response.json();
        console.log(secret)
        res.status(response.status || 200).json(secret);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            error: "Internal server error - in API"
        })
    }
});