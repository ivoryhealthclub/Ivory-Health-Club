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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListBlogPostsQueryKey } from "@workspace/api-client-react";
import {
  BookOpen,
  Check,
  FileText,
  Globe2,
  Image as ImageIcon,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("content");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPost = useCreateBlogPost();

  const emptyForm = {
    title: "",
    excerpt: "",
    content:
      "# Introduction\n\nWrite your content here using Markdown...\n\n## Subheading\n\nParagraph text with **bold** and *italic*.\n\n- List item\n- Another item",
    category: "Wellness",
    imageUrl: "",
    author: "Ivory Editorial",
    published: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  const updateForm = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setActiveTab("content");
  };

  const submitPost = (published: boolean) => {
    createPost.mutate(
      { data: { ...formData, published } },
      {
        onSuccess: () => {
          toast({
            title: published ? "Post published successfully" : "Draft saved",
          });
          queryClient.invalidateQueries({
            queryKey: getListBlogPostsQueryKey(),
          });
          setOpen(false);
          resetForm();
        },
        onError: () => {
          toast({
            title: "Error creating post",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitPost(formData.published);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-secondary text-white hover:bg-primary">
          <Plus size={16} className="mr-2" /> New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b border-border/70 px-6 pb-4 pt-6">
          <DialogTitle className="flex items-center gap-2 text-xl text-secondary">
            <BookOpen size={19} className="text-secondary" />
            Create New Blog Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="px-6 pt-5">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-full bg-muted p-1 sm:grid-cols-4">
                <TabsTrigger
                  value="content"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-secondary data-[state=active]:shadow-sm"
                >
                  <FileText size={14} />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="cover"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-secondary data-[state=active]:shadow-sm"
                >
                  <ImageIcon size={14} />
                  Cover Image
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-secondary data-[state=active]:shadow-sm"
                >
                  <Globe2 size={14} />
                  SEO
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-secondary data-[state=active]:shadow-sm"
                >
                  <Tag size={14} />
                  Social & Tags
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-0 overflow-y-auto px-6 pb-5">
              <TabsContent value="content" className="space-y-5 pt-5">
                <div className="space-y-2">
                  <label htmlFor="blog-title" className="text-sm font-semibold text-secondary">
                    Title <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="blog-title"
                    required
                    value={formData.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                    placeholder="Enter blog post title"
                    className="h-11 rounded-xl border-border/80 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="blog-excerpt" className="text-sm font-semibold text-secondary">
                    Excerpt <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    id="blog-excerpt"
                    required
                    value={formData.excerpt}
                    onChange={(event) => updateForm("excerpt", event.target.value)}
                    placeholder="Brief summary shown in listings and previews"
                    className="min-h-24 resize-y rounded-xl border-border/80 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-4">
                    <label htmlFor="blog-content" className="text-sm font-semibold text-secondary">
                      Content (Markdown) <span className="text-primary">*</span>
                    </label>
                    <span className="text-right text-[11px] text-muted-foreground">
                      Supports Markdown: **bold**, *italic*, # Heading, ## Subheading, - list, `code`, [link](url), ![img](url)
                    </span>
                  </div>
                  <Textarea
                    id="blog-content"
                    required
                    value={formData.content}
                    onChange={(event) => updateForm("content", event.target.value)}
                    className="min-h-64 resize-y rounded-xl border-border/80 bg-white font-mono text-sm leading-6"
                  />
                </div>
              </TabsContent>

              <TabsContent value="cover" className="space-y-5 pt-5">
                <div className="space-y-2">
                  <label htmlFor="blog-image-url" className="text-sm font-semibold text-secondary">
                    Cover image URL
                  </label>
                  <Input
                    id="blog-image-url"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(event) => updateForm("imageUrl", event.target.value)}
                    placeholder="https://images.example.com/wellness.jpg"
                    className="h-11 rounded-xl border-border/80 bg-white"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a wide image with a clear subject for the blog listing preview.
                  </p>
                </div>
                <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Cover preview"
                      className="max-h-64 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="space-y-2 text-muted-foreground">
                      <ImageIcon className="mx-auto" size={28} />
                      <p className="text-sm">Your cover image preview will appear here.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-5 pt-5">
                <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Globe2 size={16} />
                    Search preview
                  </div>
                  <div className="space-y-1 rounded-xl bg-white p-4 shadow-sm">
                    <p className="truncate text-base text-[#1a0dab]">
                      {formData.title || "Your blog post title"}
                    </p>
                    <p className="text-xs text-green-700">ivoryhealthclub.com/blog</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {formData.excerpt || "Your excerpt will appear as the search description."}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Search metadata is generated from the title, excerpt, and cover image when the post is published.
                </p>
              </TabsContent>

              <TabsContent value="social" className="space-y-5 pt-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="blog-category" className="text-sm font-semibold text-secondary">
                      Category <span className="text-primary">*</span>
                    </label>
                    <Input
                      id="blog-category"
                      required
                      value={formData.category}
                      onChange={(event) => updateForm("category", event.target.value)}
                      placeholder="Wellness"
                      className="h-11 rounded-xl border-border/80 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="blog-author" className="text-sm font-semibold text-secondary">
                      Author <span className="text-primary">*</span>
                    </label>
                    <Input
                      id="blog-author"
                      required
                      value={formData.author}
                      onChange={(event) => updateForm("author", event.target.value)}
                      placeholder="Ivory Editorial"
                      className="h-11 rounded-xl border-border/80 bg-white"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(event) => updateForm("published", event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#29166F]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-secondary">
                        Publish immediately
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Turn this off to save the post as a draft.
                      </span>
                    </span>
                  </label>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex flex-col-reverse gap-3 border-t border-border/70 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">*</span> Required fields
            </p>
            <div className="flex gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={createPost.isPending}
                onClick={() => submitPost(false)}
              >
                Save draft
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-secondary text-white hover:bg-primary"
                disabled={createPost.isPending}
              >
                <Check size={16} className="mr-2" />
                {createPost.isPending ? "Saving..." : "Publish post"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
