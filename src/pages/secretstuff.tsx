import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import useSWR from 'swr';
import { useUser } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Secret } from '../models/Secret'

const API_URL = "http://localhost:3000/api";
const fetcher = async (uri: string) => {
    const response = await fetch(uri);
    return response.json();
};

interface ProductProps {
    productName: string;
    id: string;
    img: string;
}

export function Product({ productName, id, img }: ProductProps) {
    return (
        <div>
            <div> {productName} </div>
            <div> {id} </div>
            <img className="max-w-xs" src={img} alt="Ditur product picture"></img>
        </div>
    )
}

interface ResponseAPI {
    id: [string]
    name: [string]
    image: [string]
}

export default function SecretStuff() {
    const { data, error } = useSWR<Secret, Error>('/api/secret', fetcher);
    if (error) {
        return <div>Failed to fetch secret stuff</div>;
    }
    if (!data) {
        return <div>Loading...</div>;
    }
    // const api_data = data as ResponseAPI;
    // console.log("hello")
    // console.log(api_data);
    return (
        <div> {JSON.stringify(data)}</div>
        // <div>{api_data.id.map((id, index) => (
        //     <div>
        //         <Product
        //             key={id}
        //             productName={api_data.name[index] ?? "No name"}
        //             id={id}
        //             img={api_data.image[index] ?? "No image"}
        //         />
        //     </div>
        // ))}
        // </div>
    );
}


interface Token {
    access_token: string;
    token_type: string;
}

export const getServerSideProps = withPageAuthRequired()
// {
//     async getServerSideProps(context) {
//         try {
//             const { req, res } = context;
//             const session = await getSession(req, res);

//             if (!session) {
//                 throw new Error('Session not found');
//             }

//             const accessToken = session?.accessToken

//             if (!accessToken) {
//                 throw new Error('Access token not found');
//             }
//             console.log(accessToken);
//             const response = await fetch(`${API_URL}/secret`, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             });
//             console.log(response);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch secret data');
//             }

//             const data = await response.json();

//             console.log(data)
//             return {
//                 props: {
//                     secret: JSON.stringify(data),
//                 },
//             };
//         } catch (error) {
//             console.error(error);
//             // Handle error appropriately
//             return {
//                 props: {
//                     secret: '',
//                 },
//             };
//         }
//     },
// })
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