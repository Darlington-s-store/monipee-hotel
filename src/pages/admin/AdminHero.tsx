import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const PAGES = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'rooms', name: 'Rooms' },
  { id: 'amenities', name: 'Amenities' },
  { id: 'gallery', name: 'Gallery' },
  { id: 'reviews', name: 'Reviews' },
  { id: 'location', name: 'Location' },
  { id: 'contact', name: 'Contact' },
  { id: 'booking', name: 'Booking' },
  { id: 'faq', name: 'FAQ' },
] as const;

const AdminHero = () => {
  const { getHeroSection, updateHeroSection } = useAuth();
  const [selectedPage, setSelectedPage] = useState<(typeof PAGES)[number]['id']>('home');

  const hero = useMemo(() => getHeroSection(selectedPage), [getHeroSection, selectedPage]);

  const [form, setForm] = useState({
    backgroundImage: '',
    label: '',
    title: '',
    subtitle: '',
  });

  useEffect(() => {
    setForm({
      backgroundImage: hero.backgroundImage,
      label: hero.label,
      title: hero.title,
      subtitle: hero.subtitle,
    });
  }, [hero.backgroundImage, hero.label, hero.subtitle, hero.title]);

  const handleSave = () => {
    updateHeroSection(selectedPage, {
      backgroundImage: form.backgroundImage,
      label: form.label,
      title: form.title,
      subtitle: form.subtitle,
    });

    toast({
      title: 'Hero updated',
      description: 'Changes saved successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0b1f3a]">Hero Sections</h1>
      </div>

      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#0b1f3a]">Edit Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="max-w-sm space-y-2">
            <Label className="text-[#111827]">Page</Label>
            <Select value={selectedPage} onValueChange={(v) => setSelectedPage(v as typeof selectedPage)}>
              <SelectTrigger className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]">
                <SelectValue placeholder="Select page" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#e6dccb] text-[#111827]">
                {PAGES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundImage" className="text-[#111827]">Background Image URL</Label>
                <Input
                  id="backgroundImage"
                  value={form.backgroundImage}
                  onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })}
                  placeholder="/src/assets/hero-hotel.jpg or https://..."
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="label" className="text-[#111827]">Label (small text)</Label>
                <Input
                  id="label"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#111827]">Title</Label>
                <Textarea
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  rows={3}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle" className="text-[#111827]">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  rows={3}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>

              <Button onClick={handleSave} className="btn-primary">
                Save Changes
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-[#111827]">Preview</Label>
              <div className="rounded-lg overflow-hidden border border-[#efe6d7] bg-[#fbf8f2]">
                <div
                  className="relative h-56 bg-cover bg-center"
                  style={{ backgroundImage: form.backgroundImage ? `url(${form.backgroundImage})` : 'none' }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 h-full flex items-center justify-center text-center p-6">
                    <div className="text-white">
                      <div className="text-xs tracking-[0.3em] uppercase text-primary mb-3">{form.label}</div>
                      <div className="text-2xl font-serif font-bold whitespace-pre-line">{form.title}</div>
                      <div className="text-sm text-white/80 mt-2 max-w-md whitespace-pre-line">{form.subtitle}</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#6b7280]">
                Note: some pages use custom hero styling; this preview is an approximation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHero;
