import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { useUser } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getAccessToken } from '@auth0/nextjs-auth0';

const API_URL = "http://localhost:3000/api";
interface SecretStuffProps {
    secret: string;
}

export default function SecretStuff({ secret }: SecretStuffProps) {
    const { user, error, isLoading } = useUser();
    return (
        <div>
            <p>Secret Stuff: {secret}</p>
        </div>
    );
}

interface Token {
    access_token: string;
    token_type: string;
}

export const getServerSideProps: GetServerSideProps<SecretStuffProps> = withPageAuthRequired({
    async getServerSideProps(context) {

        try {
            const response = await fetch(`${API_URL}/secret`);
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch secret data');
            }

            const data = await response.json();

            return {
                props: {
                    secret: data.secret,
                },
            };
        } catch (error) {
            console.error(error);
            // Handle error appropriately
            return {
                props: {
                    secret: '',
                },
            };
        }
    },
})
// try {
//     const { user, error, isLoading } = useUser();
//     const url = process.env.AUTH0_ISSUER_BASE_URL;

//     if (!url) {
//         throw new Error('No url');
//     }

//     const token = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: '{}',
//     }).then((response) => response.json() as Promise<Token>);

//     if (!token) {
//         throw new Error('No token');
//     }

//     const apiUrl = process.env.API_URL;

//     const secretRequest = await fetch(apiUrl!, {
//         method: 'GET',
//         headers: { authorization: `${token.access_token}` },
//     }).then((response) => response.json() as Promise<SecretStuffProps>);

//     if (!secretRequest) {
//         return { notFound: true } as GetServerSidePropsResult<SecretStuffProps>;
//     }

//     return {
//         props: {
//             secret: secretRequest.secret,
//         },
//     };
// } catch (error) {
//     console.log(error);
//     return { notFound: true } as GetServerSidePropsResult<SecretStuffProps>;
// }