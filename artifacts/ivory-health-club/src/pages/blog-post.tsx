import { useState, type FormEvent } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import {
  getGetBlogPostQueryKey,
  getListBlogCommentsQueryKey,
  useCreateBlogComment,
  useGetBlogPost,
  useListBlogComments,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Calendar, Tag, Facebook, Instagram, MessageCircle, Music2, Send, Link2, MessageSquare } from "lucide-react";
import NotFound from "./not-found";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";
import { markdownToHtml } from "@/lib/markdown";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const shareButtonStyles = {
  facebook: "border-[#dbe5ff] bg-[#f4f7ff] text-[#1877f2] hover:bg-[#e9efff]",
  telegram: "border-[#d8efff] bg-[#f2fbff] text-[#229ed9] hover:bg-[#e6f7ff]",
  whatsapp: "border-[#d9f4e5] bg-[#f2fcf6] text-[#25d366] hover:bg-[#e6f8ed]",
  tiktok: "border-[#e5e5e5] bg-[#fafafa] text-[#111111] hover:bg-[#f0f0f0]",
  instagram: "border-[#f4dcea] bg-[#fff7fc] text-[#c13584] hover:bg-[#fff0f8]",
} as const;

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: post, isLoading, isError } = useGetBlogPost(id, {
    query: {
      queryKey: getGetBlogPostQueryKey(id),
      enabled: !!id
    }
  });
  const { data: comments = [], isLoading: commentsLoading } = useListBlogComments(id, {
    query: {
      queryKey: getListBlogCommentsQueryKey(id),
      enabled: !!id && !!post,
    },
  });
  const queryClient = useQueryClient();
  const createComment = useCreateBlogComment();
  const [commenterName, setCommenterName] = useState("");
  const [commenterEmail, setCommenterEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const { toast } = useToast();

  const copyPostLink = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "The article link is ready to share.",
      });
    } catch {
      toast({
        title: "Copy unavailable",
        description: "Copy the article URL from your browser address bar.",
      });
    }
  };

  const shareWithDevice = async () => {
    const shareUrl = window.location.href;
    const shareText = post ? `${post.title}${post.excerpt ? ` — ${post.excerpt}` : ""}` : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copyPostLink();
  };

  const openSocialShare = (platform: "facebook" | "telegram" | "whatsapp") => {
    const shareUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title ?? "");
    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      telegram: `https://t.me/share/url?url=${shareUrl}&text=${title}`,
      whatsapp: `https://api.whatsapp.com/send?text=${title}%20${shareUrl}`,
    };

    window.open(
      shareLinks[platform],
      "_blank",
      "noopener,noreferrer,width=640,height=620",
    );
  };

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createComment.mutate(
      {
        id,
        data: {
          name: commenterName.trim(),
          email: commenterEmail.trim() || undefined,
          content: commentContent.trim(),
        },
      },
      {
        onSuccess: () => {
          setCommenterName("");
          setCommenterEmail("");
          setCommentContent("");
          queryClient.invalidateQueries({ queryKey: getListBlogCommentsQueryKey(id) });
          toast({
            title: "Comment posted",
            description: "Thank you for joining the conversation.",
          });
        },
        onError: () => {
          toast({
            title: "Comment could not be posted",
            description: "Please check your details and try again.",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-white container mx-auto px-6 max-w-4xl">
        <div className="h-8 w-32 bg-gray-200 animate-pulse mb-8"></div>
        <div className="h-16 w-3/4 bg-gray-200 animate-pulse mb-6"></div>
        <div className="h-96 w-full bg-gray-200 animate-pulse mb-10"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 animate-pulse w-full"></div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return <NotFound />;
  }

  return (
    <article className="pt-24 pb-20 bg-white min-h-screen">
      <AnimatedPageHero
        eyebrow="The Ivory Journal"
        title="Stories for a healthier life"
        description="Ideas and inspiration from the Ivory Health Club community."
        compact
        className="mb-12"
      />
      
      {/* Header */}
      <header className="container mx-auto px-6 max-w-4xl text-center mb-12">
        <div className="mb-8 flex justify-center">
          <Link href="/blog" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider">
            <ArrowLeft size={16} className="mr-2" /> Back to Journal
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-6">
          <Tag size={14} /> {post.category}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary font-bold mb-8 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
          </div>
          {post.author && (
            <div className="flex items-center gap-2">
              <User size={16} />
              {post.author}
            </div>
          )}
        </div>
      </header>
      
      {/* Featured Image */}
      {post.imageUrl && (
        <div className="container mx-auto px-6 max-w-5xl mb-16">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-[400px] md:h-[600px] object-cover rounded-sm shadow-xl"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="container mx-auto px-6 max-w-3xl">
        {post.excerpt && (
          <p className="text-xl md:text-2xl text-secondary font-serif italic mb-10 leading-relaxed text-center border-l-4 border-r-4 border-primary px-8 py-4">
            "{post.excerpt}"
          </p>
        )}
        
        <div 
          className="prose prose-lg prose-headings:font-serif prose-headings:text-secondary prose-a:text-primary hover:prose-a:text-secondary prose-p:text-gray-600 prose-li:text-gray-600 max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />

        <section className="mt-16 border-t border-gray-200 pt-10" aria-labelledby="comments-heading">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Join the conversation</p>
            <h2 id="comments-heading" className="font-serif text-3xl font-bold text-secondary">
              {comments.length === 1 ? "1 comment" : `${comments.length} comments`}
            </h2>
          </div>

          <div className="mb-12 rounded-sm bg-[#f8f7f3] p-6 md:p-8">
            <h3 className="mb-2 flex items-center gap-2 font-serif text-2xl font-bold text-secondary">
              <MessageSquare size={20} className="text-primary" />
              Leave a comment
            </h3>
            <p className="mb-6 text-sm leading-6 text-gray-500">
              Share your thoughts or ask a question about this article.
            </p>
            <form onSubmit={submitComment} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-secondary">
                  <span>Name</span>
                  <Input
                    value={commenterName}
                    onChange={(event) => setCommenterName(event.target.value)}
                    placeholder="Your name"
                    minLength={2}
                    maxLength={80}
                    required
                    disabled={createComment.isPending}
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-secondary">
                  <span>Email <span className="font-normal text-gray-400">(optional)</span></span>
                  <Input
                    type="email"
                    value={commenterEmail}
                    onChange={(event) => setCommenterEmail(event.target.value)}
                    placeholder="you@example.com"
                    maxLength={254}
                    disabled={createComment.isPending}
                  />
                </label>
              </div>
              <label className="block space-y-2 text-sm font-semibold text-secondary">
                <span>Comment</span>
                <Textarea
                  value={commentContent}
                  onChange={(event) => setCommentContent(event.target.value)}
                  placeholder="What did you think?"
                  maxLength={2000}
                  required
                  rows={5}
                  disabled={createComment.isPending}
                />
                <span className="block text-right text-xs font-normal text-gray-400">
                  {commentContent.length}/2000
                </span>
              </label>
              <Button type="submit" disabled={createComment.isPending}>
                {createComment.isPending ? "Posting..." : "Post comment"}
              </Button>
            </form>
          </div>

          {commentsLoading ? (
            <div className="space-y-5" aria-label="Loading comments">
              <div className="h-24 animate-pulse rounded-sm bg-gray-100" />
              <div className="h-24 animate-pulse rounded-sm bg-gray-100" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <article key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-secondary">{comment.name}</h3>
                    <time dateTime={comment.createdAt} className="text-xs text-gray-400">
                      {format(new Date(comment.createdAt), "MMMM d, yyyy")}
                    </time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">{comment.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="border border-dashed border-gray-200 px-6 py-8 text-center text-sm text-gray-500">
              Be the first to share your thoughts.
            </p>
          )}
        </section>
        
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Share this article</p>
            <h2 className="mb-6 font-serif text-2xl font-bold text-secondary">Pass it on</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => openSocialShare("facebook")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${shareButtonStyles.facebook}`}
                aria-label="Share on Facebook"
              >
                <Facebook size={16} /> Facebook
              </button>
              <button
                type="button"
                onClick={() => openSocialShare("telegram")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${shareButtonStyles.telegram}`}
                aria-label="Share on Telegram"
              >
                <Send size={16} /> Telegram
              </button>
              <button
                type="button"
                onClick={() => openSocialShare("whatsapp")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${shareButtonStyles.whatsapp}`}
                aria-label="Share on WhatsApp"
              >
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button
                type="button"
                onClick={shareWithDevice}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${shareButtonStyles.tiktok}`}
                aria-label="Share on TikTok"
              >
                <Music2 size={16} /> TikTok
              </button>
              <button
                type="button"
                onClick={shareWithDevice}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${shareButtonStyles.instagram}`}
                aria-label="Share on Instagram"
              >
                <Instagram size={16} /> Instagram
              </button>
              <button
                type="button"
                onClick={copyPostLink}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                aria-label="Copy article link"
              >
                <Link2 size={16} /> Copy link
              </button>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-gray-400">
              TikTok and Instagram use your device share menu when supported. Otherwise, the article link is copied for you to paste into the app.
            </p>
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog" className="inline-block bg-gray-100 px-8 py-4 text-sm font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-primary hover:text-secondary">
            Read More Articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
