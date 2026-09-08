import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { useListGalleryImages, useDeleteGalleryImage, useCreateGalleryImage } from "@workspace/api-client-react";
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
import { Trash2, Plus, Upload } from "lucide-react";

export default function AdminGallery() {
  const { data: images, isLoading } = useListGalleryImages();
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
        <AddImageDialog />
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
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-sm truncate">{img.title}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-primary uppercase font-bold">{img.category}</span>
                  <span className="text-xs text-gray-400">{format(new Date(img.createdAt), 'MMM d, yy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddImageDialog() {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createImg = useCreateGalleryImage();
  
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "gym",
    description: ""
  });

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
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
        description: "Gallery images must be 5 MB or smaller.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updateForm("url", reader.result);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createImg.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Image added to gallery" });
        queryClient.invalidateQueries({ queryKey: getListGalleryImagesQueryKey() });
        setOpen(false);
        setFormData({ title: "", url: "", category: "gym", description: "" });
      },
      onError: () => {
        toast({ title: "Error adding image", variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary text-white hover:bg-primary"><Plus size={16} className="mr-2" /> Add Image</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Gallery</DialogTitle>
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
          <Button type="submit" className="w-full bg-secondary text-white hover:bg-primary" disabled={createImg.isPending}>
            {createImg.isPending ? "Adding..." : "Add Image"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
