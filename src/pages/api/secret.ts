// pages/api/products.js
import { Secret } from '../../models/Secret'
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';

const apiBaseUrl = process.env.DS_API_BASE_URL || "";
export default withApiAuthRequired(async function secret(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res, {
            scopes: ['read:forecast']
        });
        // This is a contrived example, normally your external API would exist on another domain.

        const response = await fetch(`${apiBaseUrl}/secrets`, {
            headers: {
                Authorization: `Bearer ${accessToken || ""}`
            }
        });

        const secret = await response.json() as Secret;
        res.status(response.status || 200).json(secret);
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: "Internal server error - in API"
        })
    }
});