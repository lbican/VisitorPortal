import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../../components/profile/profile';
import { UserService } from '../../services/user-service';
import { UserProfile } from '../../context/auth-context';

const ProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        UserService.getUserProfile(username)
            .then((user) => setUser(user))
            .catch((error) => console.error(error));
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return <Profile {...user} />;
};

export default ProfilePage;
