import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

export class StorageService {
  /**
   * Faz upload de arquivo para os buckets do Supabase Storage:
   * 'products' | 'avatars' | 'chat-attachments'
   */
  static async uploadFile(
    bucket: 'products' | 'avatars' | 'chat-attachments',
    file: File,
    userId?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!isSupabaseConfigured()) {
      // Fallback para preview local caso Supabase não esteja conectado
      const objectUrl = URL.createObjectURL(file);
      return { success: true, url: objectUrl };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const folder = userId ? `${userId}/` : '';
      const filePath = `${folder}${fileName}`;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error || !data) {
        return { success: false, error: error?.message || 'Falha ao subir arquivo no Supabase Storage.' };
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrlData.publicUrl,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Exceção no upload.' };
    }
  }
}
