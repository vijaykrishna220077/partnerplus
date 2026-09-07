import { ServiceItem, LanguageCode } from '../types';

export function getLocalizedServiceName(
  service: ServiceItem | null | undefined,
  lang: LanguageCode,
  t: (key: string, params?: Record<string, any>) => string
): string {
  if (!service) return '';
  const jobKeyMap: Record<string, string> = {
    electrical: 'jobs.electricianJob',
    plumbing: 'jobs.plumbingJob',
    carpentry: 'jobs.carpentryJob',
    cleaning: 'jobs.cleaningJob',
    hvac: 'jobs.hvacJob',
    masonry: 'jobs.masonryJob',
    welding: 'jobs.weldingJob',
    painting: 'jobs.paintingJob',
    gardening: 'jobs.gardeningJob',
    driving: 'jobs.drivingJob',
    caregiving: 'jobs.caregivingJob',
  };

  const key = jobKeyMap[service.category] || jobKeyMap[service.id];
  if (key) {
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }

  if (lang === 'ta' && service.nameTa) return service.nameTa;
  if (lang === 'hi' && service.nameHi) return service.nameHi;

  return service.name || '';
}

export function getLocalizedServiceDesc(
  service: ServiceItem | null | undefined,
  lang: LanguageCode,
  _t: (key: string, params?: Record<string, any>) => string
): string {
  if (!service) return '';
  if (lang === 'ta' && service.descriptionTa) return service.descriptionTa;
  if (lang === 'hi' && service.descriptionHi) return service.descriptionHi;
  return service.description || '';
}
