'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminNewBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const [slugPreview, setSlugPreview] = useState('');

  useEffect(() => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlugPreview(slug);
  }, [formData.title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    try {
      const response = await fetch('/api/v1/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, slug: slugPreview, status }),
      });

      if (!response.ok) throw new Error(`Failed to save blog as ${status}`);
      toast.success(`Blog saved as ${status}`);
      router.push('/admin/blogs');
    } catch (error: any) {
      toast.error(error.message || 'Error saving blog');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Blog</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Blog Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
            <input
              type="text"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Write your blog content here..."
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Panel</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto-generated Slug Preview</label>
            <div className="p-2 bg-gray-100 rounded text-sm text-gray-600 font-mono">
              {slugPreview || 'your-slug-will-appear-here'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="SEO Meta Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="SEO Meta Description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="comma, separated, keywords"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleSave('Draft')}
          className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSave('Published')}
          className="px-6 py-2 bg-rose-600 text-white font-medium rounded-md hover:bg-rose-700 transition"
        >
          Publish Now
        </button>
      </div>
    </div>
  );
}
