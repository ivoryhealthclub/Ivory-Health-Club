import { useState } from "react";
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
import { Trash2, Plus } from "lucide-react";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createImg = useCreateGalleryImage();
  
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "gym",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
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
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Image URL</label>
            <Input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select 
              required
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm"
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="gym">Gym</option>
              <option value="spa">Spa</option>
              <option value="restaurant">Restaurant</option>
              <option value="events">Events</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
            <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <Button type="submit" className="w-full bg-secondary text-white hover:bg-primary" disabled={createImg.isPending}>
            {createImg.isPending ? "Adding..." : "Add Image"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
