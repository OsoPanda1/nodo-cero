import { describe, it, expect, afterEach } from 'vitest';
import {
  validateHostHeader,
  selfOriginFromHost,
  trustedHosts,
  allowedOrigins,
  normalizeOrigin,
} from '@/lib/security/trust';

const ORIGINAL = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe('frontera · normalización y validación de Host', () => {
  it('normaliza hosts simples y con puerto', () => {
    expect(validateHostHeader('tamv.online')).toEqual({ hostname: 'tamv.online', port: '' });
    expect(validateHostHeader('TAMV.Online')).toEqual({ hostname: 'tamv.online', port: '' });
    expect(validateHostHeader('api.tamv.online:8443')).toEqual({ hostname: 'api.tamv.online', port: '8443' });
  });

  it('rechaza hosts malformados (fail-closed)', () => {
    expect(validateHostHeader(null)).toBeNull();
    expect(validateHostHeader('')).toBeNull();
    expect(validateHostHeader('https://tamv.online')).toBeNull();
    expect(validateHostHeader('tamv.online/path')).toBeNull();
    expect(validateHostHeader('tamv.online?x=1')).toBeNull();
    expect(validateHostHeader('user@tamv.online')).toBeNull();
    expect(validateHostHeader('evil.com:99999')).toBeNull();
    expect(validateHostHeader('a b.com')).toBeNull();
    expect(validateHostHeader('tamv.online:abc')).toBeNull();
  });
});

describe('frontera · self-origin SOLO contra trusted hosts', () => {
  it('deriva self-origin únicamente si el host está en la política', () => {
    process.env.TRUSTED_HOSTS = 'tamv.online,www.tamv.online';
    process.env.APP_URL = '';
    process.env.NEXT_PUBLIC_SITE_URL = '';
    process.env.VERCEL_URL = '';
    process.env.CANONICAL_ORIGINS = '';

    expect(selfOriginFromHost('tamv.online')).toBe('https://tamv.online');
    expect(selfOriginFromHost('www.tamv.online')).toBe('https://www.tamv.online');
  });

  it('NUNCA deriva self-origin de un host desconocido', () => {
    process.env.TRUSTED_HOSTS = 'tamv.online';
    process.env.APP_URL = '';
    process.env.NEXT_PUBLIC_SITE_URL = '';
    process.env.VERCEL_URL = '';
    process.env.CANONICAL_ORIGINS = '';

    expect(selfOriginFromHost('evil.com')).toBeNull();
    expect(selfOriginFromHost('sub.tamv.online')).toBeNull();
  });

  it('deriva self-origin de un host malformado', () => {
    process.env.TRUSTED_HOSTS = 'tamv.online';
    expect(selfOriginFromHost('https://evil.com')).toBeNull();
    expect(selfOriginFromHost('tamv.online/path')).toBeNull();
  });
});

describe('frontera · allowlist canónica', () => {
  it('construye la allowlist desde APP_URL, site y CANONICAL_ORIGINS', () => {
    process.env.APP_URL = 'https://tamv.online';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.tamv.online';
    process.env.CANONICAL_ORIGINS = 'https://api.tamv.online,https://portal.tamv.online';
    process.env.VERCEL_URL = '';
    const origins = allowedOrigins();
    expect(origins).toContain('https://tamv.online');
    expect(origins).toContain('https://www.tamv.online');
    expect(origins).toContain('https://api.tamv.online');
    expect(origins).toContain('https://portal.tamv.online');
    expect(origins).not.toContain('https://evil.com');
  });

  it('trustedHosts agrega hosts de orígenes canónicos y de TRUSTED_HOSTS', () => {
    process.env.APP_URL = 'https://tamv.online';
    process.env.TRUSTED_HOSTS = 'www.tamv.online,api.tamv.online';
    const hosts = trustedHosts();
    expect(hosts).toContain('tamv.online');
    expect(hosts).toContain('www.tamv.online');
    expect(hosts).toContain('api.tamv.online');
  });
});

describe('frontera · normalizeOrigin', () => {
  it('normaliza a origen sin path', () => {
    expect(normalizeOrigin('https://tamv.online/pagina')).toBe('https://tamv.online');
    expect(normalizeOrigin('https://tamv.online:8443/ruta')).toBe('https://tamv.online:8443');
    expect(normalizeOrigin('no-url')).toBeNull();
  });
});
