'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/auth-fetch';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await authFetch('/api/v1/blogs/all');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePublish = async (id: string) => {
    try {
      const response = await authFetch(`/api/v1/blogs/${id}/publish`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to publish blog');
      toast.success('Blog published successfully');
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Error publishing blog');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const response = await authFetch(`/api/v1/blogs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog');
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting blog');
    }
  };

  if (loading) return <div className="flex justify-center p-8 text-rose-600">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
        >
          <Plus size={18} /> New Blog
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No blogs found</td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id || blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {blog.status !== 'Published' && (
                        <button onClick={() => handlePublish(blog._id || blog.id)} className="text-green-600 hover:text-green-900" title="Publish">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(blog._id || blog.id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
