'use client'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import { GetAuthUser, useDeletePost, useSearchPosts } from '@/app/lib/query';
import Loader from '../loader/page';
import cloudinaryLoader from '@/app/lib/cloudinary';
import Link from 'next/link';
import Profile from '../../../../../../public/assets/defaultpostBackgrounf.jpeg'
import { getRelativeTime } from '@/app/lib/date';
import Edit from '../../../../../../public/assets/icons/edit.svg'
import Delete from '../../../../../../public/assets/icons/delete.svg'

interface PostCardProps {
  caption: string,
  fullname: string,
  likes: number[],
  allcomments: number[],
  img: string,
  tags: string[],
  _id: string,
  createdAt: string,
  user: {
    _id: string;
    fullname: string;
    username: string;
    profileImg: string;
  }
}

const Searchbar = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { data: posts, isLoading, isError, error } = useSearchPosts(query);
  const { data: authUser, isLoading: isloadingAuth, isError: isErrorauth } = GetAuthUser();
  const { mutate: deletePosts, isPending: isDeleting } = useDeletePost();

  if (isLoading || isloadingAuth) {
    return <Loader />;
  }
  if (isError || isErrorauth) {
    return <p>Error: {error.message}</p>;
  }

  const handleDelete = (pid: string) => {
    deletePosts(pid);
  };

  return (
    <div className='post-car w-[50vw] max-sm:w-full max-sm:px-3 max-h-[600px] overflow-y-auto mt-6'>
      <style jsx>{`
        .post-car::-webkit-scrollbar {
          display: none;
        }
        .post-car {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {posts?.length === 0 ? (
        <p>No Posts Relating to your Search 🤔</p>
      ) : (
        <div>
          {posts?.data?.map((post: PostCardProps) => {
            const isMyPost = authUser._id === post?.user?._id;
            return (
              <div key={post._id} className='border-dark-4 bg-dark-2 overflow-y-auto p-5 lg:p-7 border rounded-3xl mb-6'>
                <div className="flex-between w-full mb-4">
                  <div className="flex items-center gap-3">
                    <Link href={`profile/`} className="flex gap-3 items-center">
                      <Image loader={cloudinaryLoader} src={post?.user?.profileImg || Profile} alt="creator" className="h-12 w-12 rounded-full" width={12} height={12} />
                    </Link>
                    <div className="flex flex-col">
                      <p className="base-medium lg:body-bold text-light-1">{post?.user?.fullname}</p>
                      <div className="flex gap-2 items-center text-light-3">
                        <p className="small-regular max-sm:subtle-semibold">{getRelativeTime(post.createdAt)}</p>
                        <span>-</span>
                        <p className="max-sm:subtle-semibold small-regular">Benin</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    {isMyPost && (
                      <Link href={`/profile/editpostprofile/${post._id}`}>
                        <Image src={Edit} alt="Edit post" width={20} height={20} />
                      </Link>
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
                  <Image loader={cloudinaryLoader} src={post?.img || Profile} alt="post" className="post-card_img mb-4" width={100} height={100} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SearchbarWrapper = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Searchbar />
    </Suspense>
  );
};

export default SearchbarWrapper;
