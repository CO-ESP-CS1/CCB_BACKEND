import { DM_IMAGE_PREFIX } from './conversations.constants';

export type ParsedDmImage = { imageUrl: string; caption: string };

export function buildImageContenu(imageUrl: string, caption?: string): string {
  const url = imageUrl.trim();
  const cap = caption?.trim() ?? '';
  if (!cap) return `${DM_IMAGE_PREFIX}${url}`;
  return `${DM_IMAGE_PREFIX}${url}\n${cap}`;
}

export function parseImageContenu(raw: string): ParsedDmImage | null {
  if (!raw.startsWith(DM_IMAGE_PREFIX)) return null;
  const rest = raw.slice(DM_IMAGE_PREFIX.length);
  const nl = rest.indexOf('\n');
  if (nl === -1) {
    return { imageUrl: rest.trim(), caption: '' };
  }
  return {
    imageUrl: rest.slice(0, nl).trim(),
    caption: rest.slice(nl + 1).trim(),
  };
}

export function isImageContenu(raw: string): boolean {
  return (raw ?? '').startsWith(DM_IMAGE_PREFIX);
}

export function threadPreviewFromContenu(
  contenu: string,
  isMine: boolean,
): string {
  if (isImageContenu(contenu)) {
    const parsed = parseImageContenu(contenu);
    if (parsed?.caption) {
      return isMine ? `Vous : ${parsed.caption}` : parsed.caption;
    }
    return isMine ? 'Vous : Photo' : 'Photo';
  }
  if (contenu.startsWith('__ccb_deleted__:')) {
    const who = contenu.slice('__ccb_deleted__:'.length).trim() || 'Un membre';
    return isMine ? 'Vous avez supprimé un message' : `${who} a supprimé un message`;
  }
  return contenu;
}
