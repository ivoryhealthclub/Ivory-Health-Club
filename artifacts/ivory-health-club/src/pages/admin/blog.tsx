import { useState } from "react";
import { useListBlogPosts, useDeleteBlogPost, useCreateBlogPost } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListBlogPostsQueryKey } from "@workspace/api-client-react";
import { Trash2, Edit, Plus } from "lucide-react";

export default function AdminBlog() {
  const { data: posts, isLoading } = useListBlogPosts();
  const deletePost = useDeleteBlogPost();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Post deleted" });
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        },
        onError: () => {
          toast({ title: "Error deleting post", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-secondary">Blog Management</h1>
        <AddPostDialog />
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : posts?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No blog posts found.</td>
                </tr>
              ) : (
                posts?.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{post.title}</div>
                      <div className="text-gray-500 text-xs truncate max-w-xs">{post.excerpt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{post.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {post.published ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(post.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(post.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddPostDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPost = useCreateBlogPost();
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Wellness",
    imageUrl: "",
    author: "Ivory Editorial",
    published: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Post created successfully" });
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        setOpen(false);
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          category: "Wellness",
          imageUrl: "",
          author: "Ivory Editorial",
          published: true
        });
      },
      onError: () => {
        toast({ title: "Error creating post", variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary text-white hover:bg-primary"><Plus size={16} className="mr-2" /> New Post</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Blog Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Author</label>
              <Input required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Image URL</label>
            <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Excerpt</label>
            <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Content (HTML supported)</label>
            <Textarea required className="min-h-[200px] font-mono text-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="published" 
              checked={formData.published} 
              onChange={e => setFormData({...formData, published: e.target.checked})}
            />
            <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
          </div>
          <Button type="submit" className="w-full bg-secondary text-white hover:bg-primary" disabled={createPost.isPending}>
            {createPost.isPending ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
