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
  { id: 'home', name: 'Homepage (previews)' },
  { id: 'about', name: 'About' },
  { id: 'amenities', name: 'Amenities' },
] as const;

const AdminPages = () => {
  const { getPageContent, updatePageContent } = useAuth();
  const [selectedPage, setSelectedPage] = useState<(typeof PAGES)[number]['id']>('home');

  const page = useMemo(() => getPageContent(selectedPage), [getPageContent, selectedPage]);

  const [images, setImages] = useState<Record<string, string>>({});
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    setImages(page.images || {});
    setContent(page.content || {});
  }, [page.id, page.images, page.content]);

  const handleSave = () => {
    updatePageContent(selectedPage, { images, content });
    toast({
      title: 'Page updated',
      description: 'Changes saved successfully.',
    });
  };

  const imageKeys = Object.keys(images);
  const contentKeys = Object.keys(content);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-[#0b1f3a]">Pages</h1>
      </div>

      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#0b1f3a]">Edit Page Content</CardTitle>
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
            <Card className="bg-white border-[#e6dccb] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0b1f3a]">Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imageKeys.length === 0 ? (
                  <p className="text-sm text-[#6b7280]">No image fields defined for this page.</p>
                ) : (
                  imageKeys.map((key) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-[#111827]">{key}</Label>
                      <Input
                        value={images[key] || ''}
                        onChange={(e) => setImages({ ...images, [key]: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-[#e6dccb] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0b1f3a]">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentKeys.length === 0 ? (
                  <p className="text-sm text-[#6b7280]">No content fields defined for this page.</p>
                ) : (
                  contentKeys.map((key) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-[#111827]">{key}</Label>
                      <Textarea
                        value={content[key] || ''}
                        onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                        rows={key.toLowerCase().includes('p') || key.toLowerCase().includes('body') ? 4 : 2}
                        className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleSave} className="btn-primary">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPages;
