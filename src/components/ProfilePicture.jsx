import React from 'react';

const ProfilePicture = ({ user, url }) => {
    
    let profileUrl = url;

    if (user){
        profileUrl = user.picture;
    }
    
    return (
        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
            <img src={profileUrl} alt="Profile" className="w-full h-full" />
        </div>
    );
};

export default ProfilePicture;
