export type CurrencyCode = 'USD' | 'EUR' | 'MXN'; // extensible

export type LicenseModel =
  | 'free'
  | 'one-time'
  | 'subscription'
  | 'usage-based';

export type BillingPeriod = 'monthly' | 'yearly';

export type PriceModelBase = {
  model: LicenseModel;
  currency?: CurrencyCode;      // por defecto 'USD' si lo normalizas
};

export type OneTimePriceModel = PriceModelBase & {
  model: 'one-time';
  amountUsd: number;
};

export type SubscriptionPriceModel = PriceModelBase & {
  model: 'subscription';
  amountUsd: number;
  period: BillingPeriod;
};

export type UsageBasedPriceModel = PriceModelBase & {
  model: 'usage-based';
  perUnitUsd: number;
  unitLabel?: string;           // p.ej. "api_call", "gb", "seat"
};

export type FreePriceModel = PriceModelBase & {
  model: 'free';
};

export type PriceModel =
  | FreePriceModel
  | OneTimePriceModel
  | SubscriptionPriceModel
  | UsageBasedPriceModel;
