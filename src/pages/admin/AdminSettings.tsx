import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Hotel, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSettings = () => {
  const { toast } = useToast();
  const { settings: storedSettings, updateSettings } = useAuth();
  const [settings, setSettings] = useState({
    hotelName: 'Monipee Hotel',
    email: 'info@monipeehotel.com',
    phone: '032 249 5451',
    address: 'Takoradi, Western Region, Ghana',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    currency: 'GH₵',
    taxRate: 15,
    enableBookings: true,
    enableReviews: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    updateSettings(settings);
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  useEffect(() => {
    setSettings(storedSettings);
  }, [storedSettings]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Settings</h1>
        <p className="text-[#6b7280] mt-1">Manage hotel configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0b1f3a] flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              General Information
            </CardTitle>
            <CardDescription className="text-[#6b7280]">
              Basic hotel details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#111827]">Hotel Name</Label>
              <Input
                value={settings.hotelName}
                onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#111827]">Email Address</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#111827]">Phone Number</Label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#111827]">Address</Label>
              <Textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0b1f3a]">Booking Settings</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Configure booking parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#111827]">Check-in Time</Label>
                <Input
                  type="time"
                  value={settings.checkInTime}
                  onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#111827]">Check-out Time</Label>
                <Input
                  type="time"
                  value={settings.checkOutTime}
                  onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#111827]">Currency</Label>
                <Input
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#111827]">Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: parseInt(e.target.value) })}
                  className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0b1f3a]">Feature Toggles</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Enable or disable features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#111827]">Online Bookings</p>
                <p className="text-sm text-[#6b7280]">Allow customers to book online</p>
              </div>
              <Switch
                checked={settings.enableBookings}
                onCheckedChange={(checked) => setSettings({ ...settings, enableBookings: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#111827]">Guest Reviews</p>
                <p className="text-sm text-[#6b7280]">Allow customers to leave reviews</p>
              </div>
              <Switch
                checked={settings.enableReviews}
                onCheckedChange={(checked) => setSettings({ ...settings, enableReviews: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#111827]">Maintenance Mode</p>
                <p className="text-sm text-[#6b7280]">Show maintenance page to visitors</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin Credentials Info */}
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0b1f3a]">Admin Access</CardTitle>
            <CardDescription className="text-[#6b7280]">
              Administrator login information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#fbf8f2] border border-[#efe6d7] rounded-lg space-y-2">
              <p className="text-sm text-[#6b7280]">Default Admin Credentials:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-[#6b7280]">Email:</p>
                  <p className="text-[#111827] font-mono">admin@monipee.com</p>
                </div>
                <div>
                  <p className="text-[#6b7280]">Password:</p>
                  <p className="text-[#111827] font-mono">admin123</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-yellow-400">
              ⚠️ For security, change these credentials in a production environment.
            </p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
        <Save className="w-4 h-4 mr-2" />
        Save All Settings
      </Button>
    </div>
  );
};

export default AdminSettings;
