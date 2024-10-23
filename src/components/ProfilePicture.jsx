import React from 'react';

const ProfilePicture = ({ user, url = "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png", width = "w-12", height = "h-12" }) => {
    
    const profileUrl = user ? user.picture : url;
    
    return (
        <div className={`${width} ${height} bg-gray-200 rounded-full overflow-hidden`}>
            <img src={profileUrl} alt="Profile" className="w-full h-full" />
        </div>
    );
};

export default ProfilePicture;
