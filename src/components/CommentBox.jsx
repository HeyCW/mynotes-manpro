import ProfilePicture from './ProfilePicture';

export default function CommentBox({owner, date, content}) {

    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return(
        <div className='w-[97%] bg-gray-300 mx-auto rounded-xl mb-10'>
            <div className='flex'>
                <div className='p-2'>
                    <ProfilePicture width='w-7' height='h-7'/>
                </div>

                <div className='flex p-2'>
                    <div className='mr-5 font-bold'>
                        {owner}
                    </div>
                    <div className='text-gray-500 font-bold'>
                        {formattedDate}
                    </div>
                </div>
            </div>

            <div className='pl-12 pb-3'>
                {content}
            </div>

        </div>
    );
}