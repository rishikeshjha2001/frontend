"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CustomerBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/v1/blogs');
        const data = await res.json();
        if (data.success) {
          // Only show published blogs
          setBlogs(data.data.filter((b: any) => b.isPublished));
        } else {
          toast.error(data.message || 'Failed to fetch blogs');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('An error occurred while fetching blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">happylokam Blog</h1>
        <p className="text-xl text-gray-600">Discover tips, venues, and inspiration for your next celebration.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="h-48 w-full bg-gray-200" 
                style={{ 
                  backgroundImage: `url(${blog.featuredImage || 'https://images.unsplash.com/photo-1530103862676-de3c9de59f9e?auto=format&fit=crop&w=600&q=80'})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }} 
              />
              <div className="p-6">
                <p className="text-sm font-medium text-rose-600 mb-2">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{blog.title}</h2>
                <p className="text-gray-600 mb-6 text-sm line-clamp-3">{blog.excerpt || 'Read more about this topic in our detailed blog post.'}</p>
                <Link href={`/blogs/${blog.slug}`} className="text-rose-600 font-semibold hover:text-rose-700 transition">
                  Read full article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
