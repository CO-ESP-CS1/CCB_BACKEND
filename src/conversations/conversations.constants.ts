import { interaction_type_enum } from '@prisma/client';

/** Messages privés — réutilise la table interaction sans migration. */
export const DM_RESSOURCE_TYPE = 'membre_dm';
export const DM_GROUP_RESOURCE_TYPE = 'membre_dm_group';
export const DM_READ_RESOURCE_TYPE = 'membre_dm_read';
export const DM_DELIVERED_RESOURCE_TYPE = 'membre_dm_delivered';
/** Conversation masquée pour un membre (ressourceid = id du contact) */
export const DM_HIDE_RESOURCE_TYPE = 'membre_dm_hide';
export const DM_INTERACTION_TYPE = interaction_type_enum.commentaire;
export const DM_RECEIPT_TYPE = interaction_type_enum.vue;
export const DM_MAX_CONTENT_LENGTH = 2000;
/** Contenu marqueur : __ccb_deleted__:Prénom Nom */
export const DM_DELETED_PREFIX = '__ccb_deleted__:';
/** Message image : __ccb_image__:https://... (ligne 2 optionnelle = légende) */
export const DM_IMAGE_PREFIX = '__ccb_image__:';
export const DM_IMAGE_MAX_BYTES = 8 * 1024 * 1024;
