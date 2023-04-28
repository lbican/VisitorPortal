import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../database';

type User = {
    id: number;
    full_name: string;
    avatar_url: string;
};

const UserProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const fetchUser = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        console.log(data);
        if (error) {
            throw error;
        }
        setUser(data as User);
    };
    useEffect(() => {
        fetchUser().catch((error) => {
            console.error(error);
        });
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <p>ID: {user.id}</p>
            <p>Name: {user.full_name}</p>
            <p>Avatar: {user.avatar_url}</p>
        </div>
    );
};

export default UserProfile;
