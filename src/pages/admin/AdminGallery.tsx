import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Upload } from 'lucide-react';

const AdminGallery = () => {
  const { galleryImages, addGalleryImage, deleteGalleryImage } = useAuth();
  const [newImage, setNewImage] = useState({
    src: '',
    alt: '',
    category: 'Rooms'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.src || !newImage.alt) return;
    
    addGalleryImage(newImage);
    setNewImage({
      src: '',
      alt: '',
      category: 'Rooms'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(prev => ({ ...prev, src: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['Rooms', 'Exterior', 'Amenities', 'Dining'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0b1f3a]">Gallery Management</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add New Image Form */}
        <Card className="lg:col-span-1 h-fit bg-white border-[#e6dccb] shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#0b1f3a]">Add New Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-[#111827]">Upload Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827] cursor-pointer file:text-white file:bg-[#0b1f3a] file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md hover:file:bg-[#143a63]"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#efe6d7]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#6b7280]">Or use URL</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="src" className="text-[#111827]">Image URL</Label>
                <Input
                  id="src"
                  placeholder="https://..."
                  value={newImage.src}
                  onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>

              {newImage.src && (
                <div className="aspect-video w-full rounded-md overflow-hidden border border-[#efe6d7] bg-[#fbf8f2]">
                  <img src={newImage.src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="alt" className="text-[#111827]">Description (Alt Text)</Label>
                <Input
                  id="alt"
                  placeholder="e.g., Luxury Suite View"
                  value={newImage.alt}
                  onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#111827]">Category</Label>
                <Select
                  value={newImage.category}
                  onValueChange={(value) => setNewImage({ ...newImage, category: value })}
                >
                  <SelectTrigger className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#e6dccb] text-[#111827]">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full btn-primary" disabled={!newImage.src || !newImage.alt}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Image List */}
        <div className="lg:col-span-2 space-y-6">
          {categories.map((category) => {
            const categoryImages = galleryImages.filter(img => img.category === category);
            
            return (
              <Card key={category} className="bg-white border-[#e6dccb] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0b1f3a] flex items-center justify-between">
                    {category}
                    <span className="text-sm font-normal text-[#6b7280]">{categoryImages.length} images</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categoryImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categoryImages.map((image) => (
                        <div key={image.id} className="group relative aspect-video rounded-lg overflow-hidden bg-[#fbf8f2] border border-[#efe6d7]">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => deleteGalleryImage(image.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-xs text-white truncate">
                            {image.alt}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#6b7280] text-sm text-center py-8">No images in this category</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
