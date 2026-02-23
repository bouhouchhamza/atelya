import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminSettings, updateAdminSettings, uploadAdminFile } from '../../lib/api';
import type { Settings } from '../../lib/types/settings';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../components/ui/use-toast';

const schema = z.object({
  store_name: z.string().min(1),
  store_logo_url: z.string().url().nullable().or(z.literal('')),
  favicon_url: z.string().url().nullable().or(z.literal('')),
  primary_color: z.string().min(1),
  secondary_color: z.string().nullable().optional(),
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  hero_cta_primary_text: z.string().min(1),
  hero_cta_primary_url: z.string().min(1),
  hero_cta_secondary_text: z.string().min(1),
  hero_cta_secondary_url: z.string().min(1),
  contact_email: z.string().email(),
  contact_phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  shipping_enabled: z.boolean(),
  shipping_flat_rate: z.preprocess((v) => (v === '' ? null : Number(v)), z.number().nullable()),
  tax_rate: z.preprocess((v) => (v === '' ? null : Number(v)), z.number().nullable()),
  currency: z.string().min(1),
  maintenance_mode: z.boolean(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getAdminSettings,
  });

  const form = useForm<Settings>({
    resolver: zodResolver(schema),
    values: useMemo(() => data, [data]),
  });

  const mutation = useMutation({
    mutationFn: updateAdminSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(['admin-settings'], settings);
      toast({ title: 'Saved', description: 'Settings updated successfully.' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' }),
  });

  const handleUpload = async (field: 'store_logo_url' | 'favicon_url', files: FileList | null) => {
    if (!files?.length) return;
    const { url } = await uploadAdminFile(files[0]);
    form.setValue(field, url);
  };

  const onSubmit = (values: Settings) => mutation.mutate(values);

  if (isLoading) return <div className="p-3 text-sm text-primary-500">Loading settings...</div>;

  if (isError || !data) {
    return (
      <div className="p-3 text-sm text-red-500 space-y-2">
        <div>Unable to load settings.</div>
        <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input {...form.register('store_name')} placeholder="Store name" />
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-1">Logo</p>
              <input type="file" accept="image/*" onChange={(e) => handleUpload('store_logo_url', e.target.files)} />
              {form.getValues('store_logo_url') ? (
                <img src={form.getValues('store_logo_url') || ''} alt="logo" className="mt-2 h-12 object-contain" />
              ) : null}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Favicon</p>
              <input type="file" accept="image/*" onChange={(e) => handleUpload('favicon_url', e.target.files)} />
              {form.getValues('favicon_url') ? (
                <img src={form.getValues('favicon_url') || ''} alt="favicon" className="mt-2 h-10 w-10 object-contain" />
              ) : null}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input type="color" {...form.register('primary_color')} />
            <Input type="color" {...form.register('secondary_color')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Hero Content</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input {...form.register('hero_title')} placeholder="Hero title" />
          <Textarea {...form.register('hero_subtitle')} placeholder="Hero subtitle" />
          <div className="grid gap-3 md:grid-cols-2">
            <Input {...form.register('hero_cta_primary_text')} placeholder="Primary CTA text" />
            <Input {...form.register('hero_cta_primary_url')} placeholder="Primary CTA URL" />
            <Input {...form.register('hero_cta_secondary_text')} placeholder="Secondary CTA text" />
            <Input {...form.register('hero_cta_secondary_url')} placeholder="Secondary CTA URL" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact & Social</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input {...form.register('contact_email')} placeholder="Email" />
            <Input {...form.register('contact_phone')} placeholder="Phone" />
          </div>
          <Textarea {...form.register('address')} placeholder="Address" />
          <div className="grid gap-3 md:grid-cols-3">
            <Input {...form.register('instagram')} placeholder="Instagram" />
            <Input {...form.register('facebook')} placeholder="Facebook" />
            <Input {...form.register('tiktok')} placeholder="TikTok" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Store Options</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input {...form.register('currency')} placeholder="Currency" />
          <div className="flex items-center justify-between rounded-xl border px-3 py-2">
            <span className="text-sm font-medium">Shipping enabled</span>
            <Switch
              checked={form.watch('shipping_enabled')}
              onCheckedChange={(v: boolean) => form.setValue('shipping_enabled', v)}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input type="number" step="0.01" {...form.register('shipping_flat_rate')} placeholder="Shipping flat rate" />
            <Input type="number" step="0.01" {...form.register('tax_rate')} placeholder="Tax rate %" />
          </div>
          <div className="flex items-center justify-between rounded-xl border px-3 py-2">
            <span className="text-sm font-medium">Maintenance mode</span>
            <Switch
              checked={form.watch('maintenance_mode')}
              onCheckedChange={(v: boolean) => form.setValue('maintenance_mode', v)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input {...form.register('seo_title')} placeholder="SEO title" />
          <Textarea {...form.register('seo_description')} placeholder="SEO description" />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={mutation.isPending} onClick={form.handleSubmit(onSubmit)}>
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
