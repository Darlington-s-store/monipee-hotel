import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, Room } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, Image as ImageIcon, X, Check, ArrowLeft } from 'lucide-react';

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type SelectedImage = {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  progress: number;
  error?: string;
};

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, updateRoom } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    type: '',
    price: 0,
    capacity: 2,
    amenitiesInput: '',
    description: '',
    available: true,
  });

  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isDropping, setIsDropping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load room data
  useEffect(() => {
    if (id) {
      const room = rooms.find(r => r.id === id);
      if (room) {
        setForm({
          name: room.name,
          type: room.type,
          price: room.price,
          capacity: room.capacity,
          amenitiesInput: room.amenities.join(', '),
          description: room.description,
          available: room.available,
        });

        // Populate images from room data
        if (room.images && room.images.length > 0) {
          const loadedImages: SelectedImage[] = room.images.map((img, index) => ({
            id: `existing-${index}-${Date.now()}`,
            name: img.name,
            size: img.size,
            type: img.type,
            dataUrl: img.dataUrl,
            progress: 100,
          }));
          setImages(loadedImages);
        } else if (room.image) {
          // Fallback if only single image exists and it's a data URL or path
          // If it's a path, we might not have size/type/name
          setImages([{
            id: 'legacy-image',
            name: 'Main Image',
            size: 0,
            type: 'image/jpeg',
            dataUrl: room.image,
            progress: 100,
          }]);
        }
        setIsLoading(false);
      } else {
        toast({ title: 'Error', description: 'Room not found', variant: 'destructive' });
        navigate('/admin/rooms');
      }
    }
  }, [id, rooms, navigate, toast]);

  const amenities = useMemo(
    () => form.amenitiesInput.split(',').map(a => a.trim()).filter(Boolean),
    [form.amenitiesInput]
  );

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    const next: SelectedImage[] = [];

    for (const file of list) {
      const validType = ACCEPTED_TYPES.includes(file.type);
      const validSize = file.size <= MAX_SIZE_MB * 1024 * 1024;
      const id = `${file.name}-${file.size}-${Date.now()}`;

      if (!validType || !validSize) {
        next.push({
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: '',
          progress: 0,
          error: !validType ? 'Unsupported file type' : `File too large (max ${MAX_SIZE_MB}MB)`,
        });
        continue;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev =>
          prev.map(img => (img.id === id ? { ...img, dataUrl: String(reader.result), progress: 100 } : img))
        );
      };

      const placeholder: SelectedImage = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: '',
        progress: 0,
      };
      next.push(placeholder);

      reader.readAsDataURL(file);

      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + 20, 95);
        setImages(prev => prev.map(img => (img.id === id ? { ...img, progress } : img)));
        if (progress >= 95) clearInterval(interval);
      }, 120);
    }

    setImages(prev => [...prev, ...next]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropping(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = () => {
    if (!form.name || (!form.type && !form.name)) {
      toast({ title: 'Missing Information', description: 'Please provide a room name and type.', variant: 'destructive' });
      return;
    }
    if (images.some(i => i.error)) {
      toast({ title: 'Invalid Images', description: 'Please remove invalid images before submitting.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    const primaryImage = images.find(i => i.dataUrl)?.dataUrl || '/src/assets/room-standard.jpg';
    
    const payload: Partial<Room> = {
      name: form.name,
      // type: form.type, // Usually we don't change type ID as it might break bookings, but let's allow it if user really wants, or maybe keep it readonly
      price: form.price,
      capacity: form.capacity,
      amenities,
      description: form.description,
      image: primaryImage,
      available: form.available,
      images: images
        .filter(i => i.dataUrl)
        .map(i => ({
          name: i.name,
          size: i.size,
          type: i.type,
          dataUrl: i.dataUrl,
        })),
    };

    if (id) {
      updateRoom(id, payload);
      toast({ title: 'Room Updated', description: 'Room details have been successfully updated.' });
      navigate('/admin/rooms');
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="p-10 text-center text-[#6b7280]">Loading room details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Edit Room</h1>
          <p className="text-[#6b7280] mt-1">Update room details and images</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/rooms')} className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Button>
      </div>

      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#0b1f3a]">Room Details</CardTitle>
          <CardDescription className="text-[#6b7280]">Update basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#111827]">Room Name</Label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
                placeholder="e.g. Ocean View Suite"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#111827]">Room Type ID</Label>
              <Input
                value={form.type}
                disabled
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#6b7280] cursor-not-allowed"
              />
              <p className="text-xs text-[#6b7280]">Room Type ID cannot be changed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#111827]">Price (GH₵)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#111827]">Capacity</Label>
              <Input
                type="number"
                value={form.capacity}
                onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#111827]">Description</Label>
            <Textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#111827]">Amenities (comma-separated)</Label>
            <Input
              value={form.amenitiesInput}
              onChange={e => setForm({ ...form, amenitiesInput: e.target.value })}
              className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
              placeholder="WiFi, TV, AC, ..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={form.available} onCheckedChange={checked => setForm({ ...form, available: checked })} />
            <span className="text-sm text-[#6b7280]">Active</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#0b1f3a]">Room Images</CardTitle>
          <CardDescription className="text-[#6b7280]">Manage room images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDropping(true);
            }}
            onDragLeave={() => setIsDropping(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDropping ? 'border-primary bg-primary/10' : 'border-[#efe6d7] bg-[#fbf8f2]'
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-[#374151]">
              <UploadCloud className="w-6 h-6 text-primary" />
              <p className="text-sm">Drag and drop images here, or click to select</p>
              <p className="text-xs text-[#6b7280]">JPG, PNG, WEBP up to {MAX_SIZE_MB}MB each</p>
              <div className="relative mt-2">
                <Input
                  type="file"
                  accept={ACCEPTED_TYPES.join(',')}
                  multiple
                  onChange={e => e.target.files && handleFiles(e.target.files)}
                  className="opacity-0 absolute inset-0 cursor-pointer"
                />
                <Button variant="secondary" className="bg-[#0b1f3a] hover:bg-[#143a63] text-white">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Images
                </Button>
              </div>
            </div>
          </div>

          {!images.length ? (
            <div className="text-center py-10 text-[#6b7280]">
              <p>No images available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative rounded-lg overflow-hidden bg-[#fbf8f2] border border-[#efe6d7]">
                  {img.dataUrl ? (
                    <img src={img.dataUrl} alt={img.name} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center text-[#6b7280]">Preview</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {img.size > 0 && <Badge className="bg-black/50 text-white">{(img.size / 1024).toFixed(0)} KB</Badge>}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-black/40 hover:bg-black/60 text-white"
                      onClick={() => removeImage(img.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {!img.error && img.progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                      <div className="h-1 bg-primary" style={{ width: `${img.progress}%` }} />
                    </div>
                  )}
                  {img.error && (
                    <div className="absolute bottom-0 left-0 right-0 text-xs text-center text-red-400 bg-black/40 py-1">{img.error}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/rooms')}
          className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
          <Check className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditRoom;
