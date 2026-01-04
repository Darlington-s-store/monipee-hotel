import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const DRAFT_KEY = 'admin_room_draft';
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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const AddRoom = () => {
  const navigate = useNavigate();
  const { addRoom } = useAuth();
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

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      setForm(parsed.form || form);
      setImages(parsed.images || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, images }));
  }, [form, images]);

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

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
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

    const primaryImage = images.find(i => i.dataUrl)?.dataUrl || '/11.jpeg';
    const id = form.type ? slugify(form.type) : slugify(form.name);

    const payload: Room = {
      id,
      name: form.name,
      type: id,
      price: form.price,
      capacity: form.capacity,
      amenities,
      description: form.description,
      image: primaryImage,
      available: form.available,
      size: '25m²',
      images: images
        .filter(i => i.dataUrl)
        .map(i => ({
          name: i.name,
          size: i.size,
          type: i.type,
          dataUrl: i.dataUrl,
        })),
    };

    addRoom(payload);
    toast({ title: 'Room Added', description: 'The room and images are ready for backend submission.' });
    clearDraft();
    setIsSubmitting(false);
    navigate('/admin/rooms');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Add Room</h1>
          <p className="text-[#6b7280] mt-1">Create a new room type and attach images</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/rooms')} className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Button>
      </div>

      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#0b1f3a]">Room Details</CardTitle>
          <CardDescription className="text-[#6b7280]">Enter basic information</CardDescription>
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
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
                placeholder="e.g. ocean-suite"
              />
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
          <CardDescription className="text-[#6b7280]">Upload and preview images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDropping(true);
            }}
            onDragLeave={() => setIsDropping(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDropping ? 'border-primary bg-primary/10' : 'border-[#efe6d7] bg-[#fbf8f2]'
              }`}
          >
            <div className="flex flex-col items-center gap-2 text-[#374151]">
              <UploadCloud className="w-6 h-6 text-primary" />
              <p className="text-sm">Drag and drop multiple images here, or click to select</p>
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
              <p>No images selected yet</p>
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
                    <Badge className="bg-black/50 text-white">{(img.size / 1024).toFixed(0)} KB</Badge>
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
          onClick={() => {
            clearDraft();
            setForm({ name: '', type: '', price: 0, capacity: 2, amenitiesInput: '', description: '', available: true });
            setImages([]);
          }}
          className="border-[#e6dccb] text-[#0b1f3a] hover:bg-[#f1eadf]"
        >
          Reset
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
          <Check className="w-4 h-4 mr-2" />
          Save Room
        </Button>
      </div>
    </div>
  );
};

export default AddRoom;
