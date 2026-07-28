import { supabase } from '@/lib/supabase';

const AVATAR_BUCKET = 'avatars';

export interface PickedImage {
  uri: string;
  mimeType?: string | null;
}

function extensionFromMime(mimeType?: string | null): string {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

/**
 * Uploads a picked image into `avatars/<userId>/...` and returns its public URL.
 * Does not touch the `profiles` table — call this, then update `avatar_url` yourself.
 */
export async function uploadAvatar(userId: string, asset: PickedImage): Promise<string> {
  const ext = extensionFromMime(asset.mimeType);
  const path = `${userId}/${Date.now()}.${ext}`;

  const arraybuffer = await fetch(asset.uri).then((res) => res.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, arraybuffer, {
      contentType: asset.mimeType ?? 'image/jpeg',
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Best-effort delete of a previously uploaded avatar, given its public URL.
 * Safe no-op if the URL isn't one of ours.
 */
export async function deleteAvatarByUrl(publicUrl: string): Promise<void> {
  const marker = `/object/public/${AVATAR_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;

  const path = publicUrl.slice(idx + marker.length);
  await supabase.storage.from(AVATAR_BUCKET).remove([path]);
}