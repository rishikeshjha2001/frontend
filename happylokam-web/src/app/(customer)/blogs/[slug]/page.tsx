import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, User, Calendar } from 'lucide-react';

interface Props {
  params: { slug: string };
}

async function getBlog(slug: string) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://happylokam.com';
    const res = await fetch(`${apiBase}/api/v1/blogs/${slug}`, { next: { revalidate: 60 } });
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getBlog(resolvedParams.slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found - happylokam',
    };
  }
  
  return {
    title: blog.metaTitle || `${blog.title} - happylokam`,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const blog = await getBlog(resolvedParams.slug);

  if (!blog) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog not found</h1>
        <Link href="/blogs" className="text-rose-600 font-bold hover:underline">
          &larr; Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/blogs" className="inline-flex items-center text-slate-500 hover:text-rose-600 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-playfair mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-rose-500" />
              <span>{blog.author || 'happylokam Team'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>
      </div>

      {blog.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 mb-12">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <img 
              src={blog.featuredImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        <div 
          className="prose prose-lg prose-rose max-w-none prose-headings:font-playfair prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </article>
  );
}
