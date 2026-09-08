import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import {
  useListBlogPosts,
  useDeleteBlogPost,
  useCreateBlogPost,
  useUpdateBlogPost,
  useListGalleryImages,
  type BlogPost,
} from "@workspace/api-client-react";
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
  Search,
  Tag,
  Trash2,
  Upload,
  Pencil,
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
                        <AddPostDialog post={post} />
                        <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(post.id)} aria-label={`Delete ${post.title}`}>
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

function AddPostDialog({ post }: { post?: BlogPost }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const { data: galleryImages } = useListGalleryImages();

  const emptyForm = {
    title: "",
    excerpt: "",
    content:
      "# Introduction\n\nWrite your content here using Markdown...\n\n## Subheading\n\nParagraph text with **bold** and *italic*.\n\n- List item\n- Another item",
    category: "Wellness",
    imageUrl: "",
    focusKeyword: "",
    metaDescription: "",
    tags: "",
    ogTitle: "",
    ogDescription: "",
    author: "Ivory Editorial",
    published: true,
  };

  const [formData, setFormData] = useState(emptyForm);
  const isEditing = Boolean(post);
  const isPending = createPost.isPending || updatePost.isPending;

  const updateForm = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setFormData(
      post
        ? {
            title: post.title,
            excerpt: post.excerpt ?? "",
            content: post.content,
            category: post.category,
            imageUrl: post.imageUrl ?? "",
            focusKeyword: post.focusKeyword ?? "",
            metaDescription: post.metaDescription ?? "",
            tags: post.tags?.join(", ") ?? "",
            ogTitle: post.ogTitle ?? "",
            ogDescription: post.ogDescription ?? "",
            author: post.author ?? "Ivory Editorial",
            published: post.published,
          }
        : emptyForm,
    );
    setActiveTab("content");
    setLibraryOpen(false);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const readImageFile = (file: File) => {
    const acceptedTypes = ["image/png", "image/jpeg", "image/webp"];
    const maxFileSize = 5 * 1024 * 1024;

    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Unsupported image type",
        description: "Choose a PNG, JPG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "Image is too large",
        description: "Cover images must be 5 MB or smaller.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateForm("imageUrl", reader.result);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Could not read image",
        description: "Try selecting the image again.",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) readImageFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) readImageFile(file);
  };

  const submitPost = (published: boolean) => {
    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const data = { ...formData, tags, published };
    const options = {
      onSuccess: () => {
        toast({
          title: isEditing
            ? published
              ? "Post updated and published"
              : "Post updated as a draft"
            : published
              ? "Post published successfully"
              : "Draft saved",
        });
        queryClient.invalidateQueries({
          queryKey: getListBlogPostsQueryKey(),
        });
        setOpen(false);
        resetForm();
      },
      onError: () => {
        toast({
          title: isEditing ? "Error updating post" : "Error creating post",
          variant: "destructive",
        });
      },
    };

    if (post) {
      updatePost.mutate({ id: post.id, data }, options);
    } else {
      createPost.mutate({ data }, options);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitPost(formData.published);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) resetForm();
        else setIsDragging(false);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={isEditing ? "icon" : "default"}
          variant={isEditing ? "ghost" : "default"}
          aria-label={isEditing ? `Edit ${post?.title ?? "post"}` : undefined}
          className={isEditing ? "text-secondary hover:bg-primary/10" : "bg-secondary text-white hover:bg-primary"}
        >
          {isEditing ? <Pencil size={16} /> : <><Plus size={16} className="mr-2" /> New Post</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden rounded-[18px] border-0 bg-white p-0 shadow-2xl">
        <DialogHeader className="px-6 pb-3 pt-5">
          <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-[#111827]">
            <BookOpen size={19} className="text-[#2f6fc7]" />
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="px-6 pt-1">
              <TabsList className="grid h-[38px] w-full grid-cols-2 gap-1 rounded-full bg-[#e5e5e6] p-1 sm:grid-cols-4">
                <TabsTrigger
                  value="content"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs font-medium text-[#141414] data-[state=active]:bg-white data-[state=active]:text-[#141414] data-[state=active]:shadow-sm"
                >
                  <FileText size={14} />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="cover"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs font-medium text-[#141414] data-[state=active]:bg-white data-[state=active]:text-[#141414] data-[state=active]:shadow-sm data-[state=active]:ring-2 data-[state=active]:ring-[#27a1e8]"
                >
                  <ImageIcon size={14} />
                  Cover Image
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs font-medium text-[#141414] data-[state=active]:bg-white data-[state=active]:text-[#141414] data-[state=active]:shadow-sm data-[state=active]:ring-2 data-[state=active]:ring-[#27a1e8]"
                >
                  <Globe2 size={14} />
                  SEO
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="gap-1.5 rounded-full px-2 py-2 text-xs font-medium text-[#141414] data-[state=active]:bg-white data-[state=active]:text-[#141414] data-[state=active]:shadow-sm data-[state=active]:ring-2 data-[state=active]:ring-[#27a1e8]"
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

                <div className="grid gap-4 sm:grid-cols-2">
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
              </TabsContent>

              <TabsContent value="cover" className="space-y-5 pt-5">
                <p className="text-[13px] leading-5 text-[#718096]">
                  Upload or link a cover image for this blog post. This image appears in post listings, social shares, and at the top of the post.
                </p>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-[#20252d]">Cover Image</label>
                  <button
                    type="button"
                    onClick={() => setLibraryOpen((current) => !current)}
                    className="flex items-center gap-2 text-[12px] font-medium text-[#2e69c5] hover:underline"
                  >
                    <ImageIcon size={15} />
                    Pick from image library ({galleryImages?.length ?? 0} images)
                  </button>

                  {libraryOpen && (
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#d8e3f0] bg-[#f8fbff] p-3 sm:grid-cols-5">
                      {galleryImages?.length ? galleryImages.map((image) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => {
                            updateForm("imageUrl", image.url);
                            setLibraryOpen(false);
                          }}
                          className="group overflow-hidden rounded-lg border border-transparent bg-white text-left hover:border-[#2e69c5]"
                        >
                          <img src={image.url} alt={image.title} className="aspect-square w-full object-cover" />
                          <span className="block truncate px-2 py-1 text-[10px] text-gray-600">{image.title}</span>
                        </button>
                      )) : (
                        <p className="col-span-full py-4 text-center text-xs text-gray-500">No gallery images available yet.</p>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-[#20252d]">Or paste an image URL <span className="text-[12px] text-[#208b59]">(external links always work)</span></p>
                  <Input
                    id="blog-image-url"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(event) => updateForm("imageUrl", event.target.value)}
                    placeholder="https://images.unsplash.com/photo-... or any public image URL"
                    className="h-11 rounded-full border-gray-100 bg-white px-4 shadow-sm"
                  />
                  <p className="text-[11px] text-[#9aa3af]">Unsplash, imgur, or any CDN URL — persists through every deploy.</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                  tabIndex={-1}
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={formData.imageUrl ? "Replace cover image" : "Upload cover image"}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex min-h-24 cursor-pointer items-center justify-center rounded-2xl border border-dashed p-5 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#299fe5] ${
                    isDragging
                      ? "border-[#299fe5] bg-[#eff8ff]"
                      : "border-[#d7dbe1] bg-white hover:border-[#299fe5] hover:bg-[#f8fbff]"
                  }`}
                >
                  {formData.imageUrl ? (
                    <div className="relative w-full">
                      <img
                        src={formData.imageUrl}
                        alt="Cover preview"
                        className="max-h-32 w-full rounded-xl object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white">
                        Click or drag to replace
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-[#a0a9b6]">
                      <Upload className="mx-auto text-[#c5ccd6]" size={24} />
                      <p className="text-[12px] font-medium">Click or drag image here</p>
                      <p className="text-[11px]">PNG, JPG, WebP up to 5 MB — saved with the post</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-5 pt-5">
                <div className="rounded-2xl border border-[#c7d9ec] bg-[#eff6ff] px-4 py-3 text-[13px] leading-5 text-[#315a8e]">
                  <strong>SEO Tips:</strong> Meta description should be 120–160 characters. Use your focus keyword in the title, first paragraph, and headings.
                </div>

                <div className="space-y-2">
                  <label htmlFor="blog-focus-keyword" className="flex items-center gap-2 text-sm font-medium text-[#20252d]">
                    <Search size={15} className="text-[#8a96a5]" />
                    Focus Keyword
                  </label>
                  <Input
                    id="blog-focus-keyword"
                    value={formData.focusKeyword}
                    onChange={(event) => updateForm("focusKeyword", event.target.value)}
                    placeholder="e.g. customs clearance Nigeria"
                    className="h-11 rounded-full border-gray-100 bg-white px-4 shadow-sm"
                  />
                  <p className="text-[11px] text-[#7d8794]">The main search term you want the post to rank for</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="blog-meta-description" className="text-sm font-medium text-[#20252d]">Meta Description</label>
                  <Textarea
                    id="blog-meta-description"
                    maxLength={160}
                    value={formData.metaDescription}
                    onChange={(event) => updateForm("metaDescription", event.target.value)}
                    placeholder="Brief summary for search engines (120–160 characters recommended)"
                    className="min-h-24 resize-y rounded-2xl border-gray-100 bg-white px-4 py-3 shadow-sm"
                  />
                  <p className="text-[11px] font-medium text-[#e4a927]">{formData.metaDescription.length}/160</p>
                </div>

                <div className="rounded-2xl border border-[#dfe3e8] bg-[#f8fafc] p-4">
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-[#7d8794]">Google Search Preview</p>
                  <p className="truncate text-sm font-medium text-[#2f6fc7]">{formData.title || "Post Title"}</p>
                  <p className="text-[11px] text-[#429b68]">easyblogspot.com/blog/...</p>
                  <p className="mt-1 truncate text-[12px] text-[#687384]">
                    {formData.metaDescription || "Meta description will appear here..."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-5 pt-5">
                <div className="rounded-2xl border border-[#dfe3e8] bg-[#f8fafc] px-4 py-3 text-[13px] leading-5 text-[#566171]">
                  <strong className="text-[#2b3441]">Open Graph</strong> controls how this post looks when shared on WhatsApp, Facebook, LinkedIn, Twitter.
                </div>

                <div className="space-y-2">
                  <label htmlFor="blog-tags" className="flex items-center gap-2 text-sm font-medium text-[#20252d]">
                    <Tag size={15} />
                    Tags (comma-separated)
                  </label>
                  <Input
                    id="blog-tags"
                    value={formData.tags}
                    onChange={(event) => updateForm("tags", event.target.value)}
                    placeholder="e.g. customs, Nigeria, freight, import"
                    className="h-11 rounded-full border-gray-100 bg-white px-4 shadow-sm"
                  />
                  <p className="text-[11px] text-[#7d8794]">Separate multiple tags with commas</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="blog-og-title" className="text-sm font-medium text-[#20252d]">OG Title</label>
                  <Input
                    id="blog-og-title"
                    maxLength={60}
                    value={formData.ogTitle}
                    onChange={(event) => updateForm("ogTitle", event.target.value)}
                    placeholder="Social share title (leave blank to use post title)"
                    className="h-11 rounded-full border-gray-100 bg-white px-4 shadow-sm"
                  />
                  <p className="text-[11px] text-[#7d8794]">{formData.ogTitle.length}/60</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="blog-og-description" className="text-sm font-medium text-[#20252d]">OG Description</label>
                  <Textarea
                    id="blog-og-description"
                    maxLength={160}
                    value={formData.ogDescription}
                    onChange={(event) => updateForm("ogDescription", event.target.value)}
                    placeholder="Social share description (leave blank to use meta description)"
                    className="min-h-20 resize-y rounded-2xl border-gray-100 bg-white px-4 py-3 shadow-sm"
                  />
                  <p className="text-[11px] text-[#7d8794]">{formData.ogDescription.length}/160</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex gap-3 border-t border-[#eef0f2] bg-white px-6 py-3">
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1 rounded-full border-gray-100 bg-white text-[#20252d] shadow-sm hover:bg-gray-50"
                 disabled={isPending}
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 flex-1 rounded-full bg-[#299fe5] text-white shadow-sm hover:bg-[#168ed7]"
                 disabled={isPending}
              >
                 {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Post"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
