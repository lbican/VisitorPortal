import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../database';
import Profile from '../../components/profile/profile';

type User = {
    id: number;
    email: string;
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
        <Profile
            email={user.email}
            avatar_url={user.avatar_url}
            full_name={user.full_name}
            job_title="Woodoworker"
            location="Talahasee"
        />
    );
};

export default UserProfile;
