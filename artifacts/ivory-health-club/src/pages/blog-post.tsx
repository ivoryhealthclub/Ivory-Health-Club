import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { getGetBlogPostQueryKey, useGetBlogPost } from "@workspace/api-client-react";
import { ArrowLeft, User, Calendar, Tag } from "lucide-react";
import NotFound from "./not-found";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: post, isLoading, isError } = useGetBlogPost(id, {
    query: {
      queryKey: getGetBlogPostQueryKey(id),
      enabled: !!id
    }
  });

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
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />
        
        {/* Footer Share/Tags could go here */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link href="/blog" className="inline-block bg-gray-100 hover:bg-primary hover:text-secondary text-secondary font-bold uppercase tracking-wider text-sm px-8 py-4 transition-colors">
            Read More Articles
          </Link>
        </div>
      </div>
    </article>
  );
}
