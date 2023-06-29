// pages/api/products.js
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function secret(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res, {
            scopes: ['read:forecast']
        });
        console.log(accessToken)

        // This is a contrived example, normally your external API would exist on another domain.
        const response = await fetch('http://127.0.0.1:8000/secret', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response)

        const secret = await response.json();
        res.status(response.status || 200).json(secret);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            error: "Internal server error - in API"
        })
    }
});