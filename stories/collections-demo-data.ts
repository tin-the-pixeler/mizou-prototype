import type { CollectionFormat, CollectionLevel, CollectionStatus } from '../components/collectionsFilterBar';
import type { SimulationType, SimulationCardStatus, SimulationCardOptions } from '../components/simulationCard';

export type CollectionItem = {
  id: string;
  title: string;
  format: CollectionFormat;
  categoryId: 'recruitment' | 'customer-service' | 'commercial' | 'management';
  categoryLabel: string;
  level: CollectionLevel;
  status: CollectionStatus;
};

const THUMBNAIL = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80';

export const COLLECTION_ITEMS: CollectionItem[] = [
  { id: 'c1', title: 'Planning for brief', format: 'voice-role-play', categoryId: 'commercial', categoryLabel: 'Commercial', level: 'intermediate', status: 'draft' },
  { id: 'c2', title: 'Customer Support For Training Effective Communication And Problem Resolution', format: 'chatbot', categoryId: 'customer-service', categoryLabel: 'Customer Service', level: 'easy', status: 'draft' },
  { id: 'c3', title: 'Disciplinary Talk with a GO Over Inappropriate Remarks at the Marrakech Village', format: 'voice-role-play', categoryId: 'management', categoryLabel: 'Management', level: 'advanced', status: 'draft' },
  { id: 'c4', title: 'Addressing Tax Concerns to Close a Real Estate Deal', format: 'voice-role-play', categoryId: 'commercial', categoryLabel: 'Commercial', level: 'easy', status: 'published' },
  { id: 'c5', title: 'Managing Guest Tensions Over Shared Amenities at the Hotel', format: 'voice-role-play', categoryId: 'customer-service', categoryLabel: 'Customer Service', level: 'easy', status: 'published' },
  { id: 'c6', title: 'Final interview for culture fit', format: 'chatbot', categoryId: 'recruitment', categoryLabel: 'Recruitment', level: 'intermediate', status: 'published' },
  { id: 'c7', title: 'Aiding And Explaining Airline Fare Rules To A Distraught Passenger', format: 'chatbot', categoryId: 'customer-service', categoryLabel: 'Customer Service', level: 'easy', status: 'published' },
  { id: 'c8', title: 'Customer Support For Service Skills Training', format: 'chatbot', categoryId: 'customer-service', categoryLabel: 'Customer Service', level: 'easy', status: 'published' },
];

const DIFFICULTY_BY_LEVEL: Record<CollectionLevel, 'easy' | 'medium' | 'hard'> = {
  easy: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
};

const SIMULATION_TYPE_BY_FORMAT: Partial<Record<CollectionFormat, SimulationType>> = {
  chatbot: 'chatbot',
  'voice-role-play': 'voice-role-play',
};

/** Maps a demo item to Simulation Card props — 'video-role-play' has no card
 *  variant yet, so it falls back to the voice-role-play badge. */
export function toSimulationCardOptions(item: CollectionItem): SimulationCardOptions {
  const cardStatus: SimulationCardStatus = item.status === 'draft' ? 'draft' : 'published';
  return {
    title: item.title,
    status: cardStatus,
    simulationType: SIMULATION_TYPE_BY_FORMAT[item.format] ?? 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: item.categoryLabel,
    difficulty: DIFFICULTY_BY_LEVEL[item.level],
    primaryActionLabel: cardStatus === 'draft' ? 'Continue editing' : 'Share',
    secondaryActionLabel: cardStatus === 'draft' ? undefined : 'View teams',
  };
}
