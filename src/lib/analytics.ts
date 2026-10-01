'use client';

import { brandConfig } from '@/config/brand';

/**
 * Capa de analítica desacoplada y ética para Clínica Dental Cala.
 * Cumplimiento riguroso de RGPD (UE 2016/679), LOPDGDD y LSSI-CE (Art. 22.2).
 * Integración con Google Analytics 4 Consent Mode v2 (estado 'denied' por defecto).
 */

export type AnalyticsEventName =
  | 'cta_primary_click'
  | 'whatsapp_click'
  | 'phone_click'
  | 'form_submit_attempt'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'map_interactive_load';

export interface AnalyticsEventPayload {
  event: AnalyticsEventName;
  location?: string;
  treatment?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface CookieConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_STORAGE_KEY = brandConfig.cookieConsentKey;
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 meses de validez máxima según AEPD

/**
 * Obtiene el estado actual del consentimiento de cookies.
 * Devuelve null si no existe o si ha caducado (> 12 meses).
 */
export function getCookieConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY) || localStorage.getItem('volta_cookie_consent_v1');
    if (!raw) return null;
    const consent: CookieConsentState = JSON.parse(raw);
    const age = Date.now() - new Date(consent.timestamp).getTime();
    if (age > CONSENT_MAX_AGE_MS) {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      localStorage.removeItem('volta_cookie_consent_v1');
      return null;
    }
    return consent;
  } catch (e) {
    return null;
  }
}

/**
 * Actualiza Google Consent Mode v2 en el objeto gtag.
 */
export function updateGoogleConsentMode(analyticsGranted: boolean, marketingGranted: boolean = false) {
  if (typeof window === 'undefined') return;

  const analyticsStatus = analyticsGranted ? 'granted' : 'denied';
  const marketingStatus = marketingGranted ? 'granted' : 'denied';

  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('consent', 'update', {
      analytics_storage: analyticsStatus,
      ad_storage: marketingStatus,
      ad_user_data: marketingStatus,
      ad_personalization: marketingStatus,
    });
  }
}

/**
 * Guarda las preferencias de consentimiento y actualiza Consent Mode v2.
 */
export function saveCookieConsent(preferences: { analytics: boolean; marketing: boolean }) {
  if (typeof window === 'undefined') return;

  const state: CookieConsentState = {
    necessary: true,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  updateGoogleConsentMode(state.analytics, state.marketing);

  // Notificar a la aplicación para sincronizar componentes reactivos
  window.dispatchEvent(new CustomEvent('cala_consent_updated', { detail: state }));
}

/**
 * Disparador para abrir el modal de configuración de cookies desde cualquier punto (ej. footer).
 */
export function openCookieSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cala_open_cookie_modal'));
  }
}

/**
 * Despacha un evento de analítica respetando el consentimiento del usuario.
 */
export function trackEvent(
  name: AnalyticsEventName,
  payload?: Omit<AnalyticsEventPayload, 'event' | 'timestamp'>
) {
  if (typeof window === 'undefined') return;

  const consent = getCookieConsent();
  // Sin consentimiento expreso, no se registra ningún evento analítico
  if (!consent || !consent.analytics) {
    return;
  }

  const eventData: AnalyticsEventPayload = {
    event: name,
    location: payload?.location || window.location.pathname,
    treatment: payload?.treatment,
    metadata: payload?.metadata,
    timestamp: new Date().toISOString(),
  };

  // 1. Envío a Google Analytics 4 vía gtag si está disponible
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', name, {
      page_path: eventData.location,
      treatment_type: eventData.treatment,
      ...eventData.metadata,
    });
  }

  // 2. Despacho a dataLayer general
  if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
    (window as any).dataLayer.push(eventData);
  }

  // 3. Despacho desacoplado de CustomEvent
  window.dispatchEvent(new CustomEvent('cala_analytics_event', { detail: eventData }));

  if (process.env.NODE_ENV === 'development') {
    console.debug('[Analytics Event Dispatched]', eventData);
  }
}
