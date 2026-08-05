export type ListingType = 'twin' | 'model' | 'dataset' | 'service' | 'playbook' | 'license';

export type ListingStatus = 'draft' | 'published' | 'pending' | 'licensed' | 'retired';

export type LicenseModel = 'free' | 'one-time' | 'subscription' | 'usage-based';

export type PriceModel = {
  model: LicenseModel;
  amountUsd?: number;
  period?: 'monthly' | 'yearly';
  perUnitUsd?: number;
};

export type MarketplaceListing = {
  id: string;
  slug: string;
  type: ListingType;
  title: string;
  description: string;
  provider: string;
  publisher: string;
  status: ListingStatus;
  price: PriceModel;
  rating: number;
  ratingCount: number;
  downloads: number;
  tags: string[];
  compatibleDomains: string[];
  createdAt: string;
  updatedAt: string;
};

export type Subscription = {
  id: string;
  listingId: string;
  licensee: string;
  licensedAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'revoked';
  usageCount: number;
};

export type LicenseCheckResult = {
  allowed: boolean;
  reason: string;
  subscriptionId?: string;
  remaining?: number;
};
