import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import {
  useListGalleryImages,
  useDeleteGalleryImage,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  type GalleryImage,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListGalleryImagesQueryKey } from "@workspace/api-client-react";
import { Trash2, Plus, Upload, Pencil } from "lucide-react";
import { uploadImage } from "@/lib/media-upload";

export default function AdminGallery() {
  const { data: images, isLoading } = useListGalleryImages({ includeUnpublished: true });
  const deleteImage = useDeleteGalleryImage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImage.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Image deleted" });
          queryClient.invalidateQueries({ queryKey: getListGalleryImagesQueryKey() });
        },
        onError: () => {
          toast({ title: "Error deleting image", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-secondary">Gallery Management</h1>
        <ImageDialog />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((img) => (
            <div key={img.id} className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <ImageDialog image={img} />
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id)} aria-label={`Delete ${img.title}`}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-sm truncate">{img.title}</h4>
                  <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-primary uppercase font-bold">{img.category}</span>
                   <span className={`text-[10px] font-bold uppercase ${img.published ? "text-green-600" : "text-gray-400"}`}>
                     {img.published ? "Published" : "Hidden"}
                   </span>
                </div>
                 <span className="mt-1 block text-xs text-gray-400">{format(new Date(img.createdAt), 'MMM d, yy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageDialog({ image }: { image?: GalleryImage }) {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createImg = useCreateGalleryImage();
  const updateImg = useUpdateGalleryImage();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const emptyForm = {
    title: "",
    url: "",
    category: "gym",
    description: "",
    published: true,
  };
  const [formData, setFormData] = useState(emptyForm);
  const isEditing = Boolean(image);
  const isPending = createImg.isPending || updateImg.isPending || isUploadingImage;

  const updateForm = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setFormData(image ? {
      title: image.title,
      url: image.url,
      category: image.category,
      description: image.description ?? "",
      published: image.published,
    } : emptyForm);
    setIsDragging(false);
  };

  const readImageFile = async (file: File) => {
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
        description: "Gallery images must be 5 MB or smaller.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      updateForm("url", await uploadImage(file));
    } catch (error) {
      toast({
        title: "Could not upload image",
        description: error instanceof Error ? error.message : "Try selecting the image again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void readImageFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void readImageFile(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const options = {
      onSuccess: () => {
        toast({ title: isEditing ? "Gallery image updated" : "Image added to gallery" });
        queryClient.invalidateQueries({ queryKey: getListGalleryImagesQueryKey() });
        setOpen(false);
        resetForm();
      },
      onError: () => {
        toast({ title: isEditing ? "Error updating image" : "Error adding image", variant: "destructive" });
      }
    };
    if (image) {
      updateImg.mutate({ id: image.id, data: formData }, options);
    } else {
      createImg.mutate({ data: formData }, options);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (nextOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button
          size={isEditing ? "icon" : "default"}
          variant={isEditing ? "ghost" : "default"}
          className={isEditing ? "text-secondary hover:bg-primary/10" : "bg-secondary text-white hover:bg-primary"}
          aria-label={isEditing ? `Edit ${image?.title ?? "image"}` : undefined}
        >
          {isEditing ? <Pencil size={16} /> : <><Plus size={16} className="mr-2" /> Add Image</>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Gallery Image" : "Add to Gallery"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input required value={formData.title} onChange={e => updateForm("title", e.target.value)} />
          </div>
          <div>
            <label htmlFor="gallery-image-url" className="text-sm font-medium mb-1 block">Image URL or upload</label>
            <Input
              id="gallery-image-url"
              required
              type="text"
              value={formData.url}
              onChange={e => updateForm("url", e.target.value)}
              placeholder="https://... or choose an image below"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select 
              required
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm"
              value={formData.category} 
              onChange={e => updateForm("category", e.target.value)}
            >
              <option value="gym">Gym</option>
              <option value="spa">Spa</option>
              <option value="restaurant">Restaurant</option>
              <option value="events">Events</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
            <Input value={formData.description} onChange={e => updateForm("description", e.target.value)} />
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-secondary">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(event) => updateForm("published", event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Visible on the public website
          </label>
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
            aria-label={formData.url ? "Replace gallery image" : "Upload gallery image"}
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
            className={`flex min-h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed p-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5"
            }`}
          >
            {formData.url ? (
              <div className="relative w-full">
                <img src={formData.url} alt="Gallery preview" className="max-h-36 w-full rounded-lg object-cover" />
                <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white">
                  Click or drag to replace
                </span>
              </div>
            ) : (
              <div className="space-y-1 text-gray-400">
                <Upload className="mx-auto text-gray-300" size={24} />
                <p className="text-xs font-medium">Click or drag image here</p>
                <p className="text-[11px]">PNG, JPG, WebP up to 5 MB</p>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full bg-secondary text-white hover:bg-primary" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Image"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
