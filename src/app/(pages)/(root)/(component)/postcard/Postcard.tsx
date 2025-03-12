 'use client'
import Profile from '../../../../../../public/assets/defaultpostBackgrounf.jpeg';
import Edit from '../../../../../../public/assets/icons/edit.svg';
import Link from 'next/link';
import Image from 'next/image';
import {  GetAllPost, GetAuthUser, useDeletePost } from '@/app/lib/query';
import Loader from '../loader/page';
import Delete from '../../../../../../public/assets/icons/delete.svg'
import PostStats from './component/PostStats';
import Comment from './component/comment'
import { getRelativeTime } from '@/app/lib/date';
import cloudinaryLoader from '@/app/lib/cloudinary'
import { IoSadOutline } from 'react-icons/io5';
import Search from '../../../../../../public/assets/icons/search.svg'
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Commentt {
  _id: string;
  text: string;
  user: {
    _id: string;
    fullname: string;
    profileImg: string;
  };
}

interface PostCardProps {
  caption:string,
  fullname:string,
  likes: number[],
 comments: Commentt[],
  allcomments: number[],
  img:string,
  tags: string[],
  _id:string,
  createdAt: string,
  user: {
    _id: string;
    fullname: string;
    username: string;
    profileImg: string;
  }

}


const PostCard = ({ type, isComment, setIsComment }: { type: string, isComment?: boolean, setIsComment: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  
  function debounce(func: (arg: string) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (arg: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(arg), wait);
    };
  }

  
  // Debounced function to handle redirection
  const debouncedRedirect = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        router.push(`/Search?query=${encodeURIComponent(query)}`);
      } else {
        router.push("/Search"); // Redirect to base search page
      }
    }, 500),
    [router]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    debouncedRedirect(value);
  };


  const {data:posts, isError, error, isLoading} = GetAllPost(type)
  const {data:authUser, isLoading:isloadingAuth, isError:isErrorauth, error:errorauth} = GetAuthUser()
  const { mutate: deletePosts, isPending: isDeleting } = useDeletePost();
  console.log('hrr', posts);
  console.log('hg', isComment);
  
  
  if(isLoading || isloadingAuth) {
    return <Loader />
  }
  if(isError) {
    return <p>Error: {error.message}</p>
  }
  if(isErrorauth) {
    return <p>Error: {errorauth.message}</p>
  }
 


  const handleDelete = (pid: string) => {
      deletePosts(pid);
  };

      
      

  // if(isDeleting) {
  //   return <div className="flex items-center gap-2 h-screen justify-center">
  //   <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
  // </div>
  // }

 
  return (
    
    <section>  
<div className={`flex max-sm:flex-col gap-4 mb-4 max-sm:mx-4 ${type === 'following' ? 'mt-4' : ''}`}>
  {type === 'all' && 'following' && (
 <>
 <div className="flex items-center gap-4">
    <Link href={'/'}>
        <button
          className={`px-4 py-[10px] rounded-lg text-sm font-medium transition-all ${
            'bg-dark-4  text-gray-300'
          }`}
        >
          For You
        </button>
        </Link>
        <Link href={'/postcard/following'}>
        <button
          className={`px-4 py-[10px] rounded-lg text-sm font-medium transition-all ${
             'bg-dark-4  text-gray-300'
          }`}
        
        >
          Following
        </button>
          </Link>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()}>
       <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 items-center">
            <Image src={Search} alt="search" width={18} height={18} />
            <input type='text' placeholder='Search' value={search} className='explore-search ring-offset-0 outline-none' onChange={handleInputChange}/>
          </div>
          </form>
         
 </>
  ) }
        </div>
    <div className="post-car w-[50vw] max-sm:w-full max-sm:px-3 max-h-[600px]  overflow-y-auto ">
       <style jsx>{`
        .post-car::-webkit-scrollbar {
          display: none;
        }
        .post-car {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      {posts && posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-screen">
          <IoSadOutline className="text-gray-300 text-6xl mb-2" />
          <h1 className="text-2xl font-semibold text-gray-300">No Posts Yet</h1>
          <p className="text-gray-400">Be the first to post something!</p>
        </div>
      )}

      {posts?.map((post:PostCardProps) => {
      const isLiked = post.likes.includes(authUser._id);
      const isMyPost = authUser._id === post?.user?._id; 
 
      
        return (
          <div key={post._id} className='border-dark-4 bg-dark-2 overflow-y-auto p-5 lg:p-7 border  rounded-3xl mb-6 '>  
          {/* Header Section */}
          <div className="flex-between w-full mb-4">
            <div className="flex items-center gap-3">
            <Link href={`profile/${post?.user?.username}`} className="flex gap-3 items-center">
  {post?.user?.profileImg ? (
    <Image 
      loader={cloudinaryLoader} 
      src={post.user.profileImg} 
      alt="creator" 
      className="h-12 w-12 rounded-full" 
      width={48} 
      height={48} 
    />
  ) : (
    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-semibold">
      {post?.user?.fullname
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase() || "U"}
    </div>
  )}


    
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">{post?.user?.fullname}</p>
                <div className="flex gap-2 items-center text-light-3">
                  <p className="small-regular max-sm:subtle-semibold">
                    {getRelativeTime(post.createdAt)}
                  </p>
                  <span>-</span>
                  <p className="max-sm:subtle-semibold small-regular">Benin</p>
                </div>
              </div>
              </Link>
            </div>
    
    <div className='flex gap-3'>
       {isMyPost && (
        <Link href={`/profile/editpostprofile/${post._id}`}>
          <Image src={Edit} alt="Edit post" width={20} height={20} />
        </Link>
        )}

        {!isMyPost && (
          <p>😉</p>
        )}
            {isMyPost && (
                    <button onClick={() => handleDelete(post._id)} disabled={isDeleting}>
                    {isDeleting ? (
                     <div className="flex items-center gap-2">
                     <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
                   </div>
                    ) : (
                      <Image src={Delete} alt="Delete post" width={20} height={20} />
                    )}
                  </button>
            )}
    
            </div>
          </div>
    
          {/* Post Content Section */}
          <Link href={`/`}>
            <div className="max-sm:text-[15px] font-medium leading-[140%] lg:base-medium py-5 mb-4 border-b border-gray-200">
              <p>{post?.caption}</p>

              {post?.tags?.map((tag: string, index: number) => (
                <div key={index}>
                  <ul className="flex gap-1 mt-2">
                  <li className="text-light-3">#{tag}</li>
                </ul>
       </div>
      ))}
            </div>

        
    
            <Image loader={cloudinaryLoader} src={post?.img || Profile} alt="post" className="post-card_img mb-4" width={100} height={100}/>
          </Link>
          <PostStats postId={post._id} postLike={post?.likes?.length} isLiked={isLiked} allcomment={post?.comments?.length}  setIsComment={setIsComment} />
          {isComment ? (
           <Comment postId={post._id} post={post} />
          ):(
            <div>
              <p></p>
            </div>
          )}
         
        </div>
        )})}
      
        {/* Comment Section */}
 
    </div>
    </section>
  );
};

export default PostCard;
