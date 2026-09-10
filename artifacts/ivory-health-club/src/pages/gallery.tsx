import { useState } from "react";
import { motion } from "framer-motion";
import { useListGalleryImages } from "@workspace/api-client-react";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(new Set());
  const { data: images, isLoading, isError, refetch } = useListGalleryImages();

  const categories = ["all", "gym", "spa", "restaurant", "events"];

  const filteredImages = images?.filter(img => 
    activeCategory === "all" ? true : img.category === activeCategory
  );

  return (
    <div className="pt-24 bg-white min-h-screen">
      <AnimatedPageHero
        eyebrow="Visual Journey"
        title="The Gallery"
        description="Step inside the spaces, rituals, and moments that make Ivory Health Club feel like home."
        compact
      />

      <div className="container mx-auto px-6 max-w-7xl pb-20 pt-16">

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 uppercase tracking-wider font-bold text-sm transition-colors border-b-2 ${
                activeCategory === cat 
                  ? "border-primary text-secondary" 
                  : "border-transparent text-gray-400 hover:text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="col-span-full rounded-sm border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
            <p className="text-lg font-serif font-bold text-secondary">The gallery is temporarily unavailable.</p>
            <p className="mt-2 text-sm text-gray-500">Please try again in a moment.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 bg-secondary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary hover:text-secondary"
            >
              Try again
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredImages?.length ? (
              filteredImages.map((img) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={img.id}
                  className="group relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                >
                  {failedImageIds.has(img.id) ? (
                    <div className="flex h-full w-full items-center justify-center bg-secondary px-8 text-center text-white">
                      <div>
                        <p className="font-serif text-xl font-bold">{img.title}</p>
                        <p className="mt-2 text-sm text-white/70">Image unavailable</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={img.url}
                      alt={img.title}
                      onError={() => {
                        setFailedImageIds((current) => {
                          const next = new Set(current);
                          next.add(img.id);
                          return next;
                        });
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <h3 className="text-white font-serif font-bold text-xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h3>
                    {img.description && (
                      <p className="text-white/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.description}</p>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500">
                No images found for this category.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
