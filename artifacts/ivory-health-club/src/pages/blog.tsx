import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useListBlogPosts } from "@workspace/api-client-react";
import { ChevronRight } from "lucide-react";

export default function BlogList() {
  const { data: posts, isLoading } = useListBlogPosts();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(posts?.map(p => p.category) || []))];

  const filteredPosts = posts?.filter(post => 
    (activeCategory === "all" || post.category === activeCategory) && post.published
  );

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl pb-20">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold tracking-widest uppercase mb-4"
          >
            Insights & Lifestyle
          </motion.h4>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif text-secondary font-bold mb-6"
          >
            The Ivory Journal
          </motion.h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 uppercase tracking-wider font-bold text-sm transition-colors rounded-full ${
                activeCategory === cat 
                  ? "bg-secondary text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-white animate-pulse rounded-sm shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts?.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.id}`}
                className="group flex flex-col bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-sm overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
                  {post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-white font-serif text-2xl opacity-80">
                      IVORY
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-primary text-secondary text-xs font-bold uppercase tracking-wider px-3 py-1">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-3 font-medium">
                    {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                  </p>
                  <h3 className="text-2xl font-serif font-bold text-secondary mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider mt-auto">
                    Read Article <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
            
            {filteredPosts?.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                No articles found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
