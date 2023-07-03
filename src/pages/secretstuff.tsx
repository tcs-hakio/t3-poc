import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import useSWR from 'swr';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Secret } from '../models/Secret'

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

export default function SecretStuff() {
    const { data, error } = useSWR<Secret, Error>('/api/secret', fetcher);
    if (error) {
        return <div>Failed to fetch secret stuff</div>;
    }
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div> {JSON.stringify(data)}</div>
    );
}


interface Token {
    access_token: string;
    token_type: string;
}

