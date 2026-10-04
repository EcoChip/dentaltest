'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clinicConfig } from '@/config/clinic.config';
import { siteContent } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { Menu, X, Phone, ArrowUpRight, MessageCircle, Calendar, ChevronDown } from 'lucide-react';
import { TreatmentsMegaMenu, TREATMENTS_NAV_DATA } from './TreatmentsMegaMenu';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [treatmentsDropdownOpen, setTreatmentsDropdownOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);
  const pathname = usePathname();

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);

  // Hover con delay de gracia (150 ms) para apertura y cierre del mega menú
  const handleTreatmentsMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setTreatmentsDropdownOpen(true);
  };

  const handleTreatmentsMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setTreatmentsDropdownOpen(false);
    }, 150); // 150 ms grace delay
  };

  // Cierre al hacer click fuera del encabezado
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setTreatmentsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Monitorización de scroll con detección de dirección (Headroom)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= 60) {
        setHeaderVisible(true);
      } else if (diff > 8 && currentScrollY > 120 && !mobileMenuOpen && !treatmentsDropdownOpen) {
        // Ocultar cabecera al bajar de forma continua
        setHeaderVisible(false);
      } else if (diff < -8) {
        // Reaparecer inmediatamente al subir
        setHeaderVisible(true);
      }

      setScrolled(currentScrollY > 40);
      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, treatmentsDropdownOpen]);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    setTreatmentsDropdownOpen(false);
  }, [pathname]);

  // Limpiar timers pendientes al desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Gestión de accesibilidad: Focus trap, bloqueo de scroll y tecla Escape
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    // Bloquear scroll de fondo
    document.body.style.overflow = 'hidden';

    const menuEl = menuContainerRef.current;
    if (!menuEl) return;

    // Obtener elementos interactivos dentro del diálogo
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      menuEl.querySelectorAll<HTMLElement>(focusableSelector)
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Foco inicial
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (focusableElements.length === 0) return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/invisalign', label: 'Invisalign' },
    { href: '/tratamientos', label: 'Tratamientos', hasDropdown: true },
    { href: '/equipo', label: 'Equipo Médico' },
    { href: '/contacto', label: 'Contacto' },
  ];

  const handleCtaClick = () => {
    trackEvent('cta_primary_click', { location: 'header_desktop' });
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', { location: 'header_phone' });
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { location: 'header_mobile_menu' });
  };

  const whatsappUrl = `https://wa.me/${siteContent.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    siteContent.contact.whatsappMessage
  )}`;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'bg-canvas/95 backdrop-blur-md border-b border-line-subtle py-3.5 shadow-subtle'
            : 'bg-canvas/95 backdrop-blur-md py-4 lg:py-6 border-b border-line-subtle/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logotipo / Tipografía Editorial de Marca */}
          <Link
            href="/"
            className="group flex flex-col focus-visible:outline-accent"
            aria-label={`${siteContent.brand.name} - Ir a la página de inicio`}
          >
            <span className="font-serif text-xl sm:text-2xl tracking-tight text-ink font-normal group-hover:text-accent transition-colors duration-200">
              {clinicConfig.shortName}
            </span>
            <span className="text-xs text-ink-muted hidden sm:inline-block">
              {clinicConfig.tagline}
            </span>
          </Link>

          {/* Navegación Escritorio */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Navegación principal">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.hasDropdown && pathname.startsWith('/tratamientos'));

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative py-1 flex items-center"
                    onMouseEnter={handleTreatmentsMouseEnter}
                    onMouseLeave={handleTreatmentsMouseLeave}
                  >
                    <button
                      ref={dropdownTriggerRef}
                      type="button"
                      onClick={() => setTreatmentsDropdownOpen(!treatmentsDropdownOpen)}
                      aria-expanded={treatmentsDropdownOpen}
                      aria-haspopup="true"
                      aria-controls="treatments-mega-menu"
                      className={`text-sm transition-colors duration-200 inline-flex flex-row items-center gap-1.5 py-1 focus-visible:outline-accent cursor-pointer whitespace-nowrap select-none group ${
                        isActive || treatmentsDropdownOpen
                          ? 'text-accent font-medium'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      <span className="animated-underline">{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                          treatmentsDropdownOpen ? 'rotate-180 text-accent' : 'text-ink-muted group-hover:text-ink'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isActive && !treatmentsDropdownOpen && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent" />
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors duration-200 relative py-1 focus-visible:outline-accent animated-underline whitespace-nowrap ${
                    isActive ? 'text-accent font-medium' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Acciones Rápidas (Teléfono + CTA Primario Unificado) */}
          <div className="hidden sm:flex items-center space-x-6">
            <a
              href={`tel:${siteContent.contact.phoneRaw}`}
              onClick={handlePhoneClick}
              className="touch-target inline-flex items-center space-x-2 text-sm text-ink-secondary hover:text-accent transition-colors duration-200 group/phone"
              aria-label={`Llamar a ${siteContent.brand.name} al ${siteContent.contact.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-accent group-hover/phone:scale-110 transition-transform duration-200" />
              <span>{siteContent.contact.phone}</span>
            </a>

            <Button
              href="/contacto"
              variant="primary"
              onClick={handleCtaClick}
              showArrow
              size="md"
            >
              {siteContent.ctas.primary}
            </Button>
          </div>

          {/* Botón Disparador Menú Móvil con transformación geométrica a cruz */}
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden touch-target p-2 text-ink hover:text-accent focus-visible:outline-accent min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
          >
            <div className="relative w-6 h-4 flex flex-col justify-between items-center" aria-hidden="true">
              <span
                className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  mobileMenuOpen ? 'translate-y-[7px] rotate-45 bg-accent' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current rounded-full transition-all duration-200 ease-out ${
                  mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  mobileMenuOpen ? '-translate-y-[7px] -rotate-45 bg-accent' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mega Menú Desplegable Desktop */}
        <TreatmentsMegaMenu
          isOpen={treatmentsDropdownOpen}
          onClose={() => setTreatmentsDropdownOpen(false)}
          triggerRef={dropdownTriggerRef}
          onMouseEnter={handleTreatmentsMouseEnter}
          onMouseLeave={handleTreatmentsMouseLeave}
        />
      </header>

      {/* Overlay Menú Móvil a Pantalla Completa con Focus Trap y Cierre con Esc */}
      {mobileMenuOpen && (
        <div
          ref={menuContainerRef}
          id="mobile-nav-menu"
          className="fixed inset-0 z-50 bg-canvas lg:hidden flex flex-col justify-between pt-24 pb-10 px-8 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal de navegación"
        >
          {/* Botón cerrar flotante dentro del diálogo accesible */}
          <div className="absolute top-6 right-6">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                toggleBtnRef.current?.focus();
              }}
              className="touch-target min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-ink hover:text-accent focus-visible:outline-accent"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            <span className="text-[11px] tracking-clinical uppercase text-ink-muted animate-in fade-in slide-in-from-top-1 duration-200">
              Navegación Institucional
            </span>
            <nav className="flex flex-col space-y-4" aria-label="Enlaces del menú móvil">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.href}
                      className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                      style={{ animationDelay: `${80 + idx * 45}ms` }}
                    >
                      <div className="flex items-center justify-between min-h-[44px]">
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`text-2xl sm:text-3xl font-serif tracking-tight transition-colors ${
                            isActive ? 'text-accent italic' : 'text-ink hover:text-accent'
                          }`}
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
                          aria-expanded={mobileAccordionOpen}
                          aria-controls="mobile-treatments-accordion"
                          className="p-2 text-ink hover:text-accent focus-visible:outline-accent min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label={
                            mobileAccordionOpen
                              ? 'Colapsar submenú de tratamientos'
                              : 'Expandir submenú de tratamientos'
                          }
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-accent transition-transform duration-200 ${
                              mobileAccordionOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {mobileAccordionOpen && (
                        <div
                          id="mobile-treatments-accordion"
                          className="pl-3.5 mt-2 mb-2 border-l-2 border-accent/30 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                          {TREATMENTS_NAV_DATA.map((cat) => (
                            <div key={cat.id} className="flex flex-col space-y-1.5">
                              <span className="text-[10px] font-mono tracking-clinical uppercase text-accent font-semibold">
                                {cat.title}
                              </span>
                              <div className="flex flex-col space-y-2 pl-1">
                                {cat.items.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xs text-ink-secondary hover:text-accent py-1 flex items-center justify-between group"
                                  >
                                    <span className="font-medium group-hover:text-accent">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-ink-muted">
                                      {item.timeEstimate}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Link
                            href="/tratamientos"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-[11px] uppercase tracking-clinical text-accent font-medium pt-1 flex items-center space-x-1"
                          >
                            <span>Ver todos los tratamientos →</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${80 + idx * 45}ms` }}
                    className={`min-h-[44px] flex items-center text-2xl sm:text-3xl font-serif tracking-tight transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both ${
                      isActive ? 'text-accent italic' : 'text-ink hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div
            className="border-t border-line-subtle pt-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
            style={{ animationDelay: '320ms' }}
          >
            <span className="text-[11px] tracking-clinical uppercase text-ink-muted">
              Contacto Directo y Cita
            </span>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${siteContent.contact.phoneRaw}`}
                onClick={handlePhoneClick}
                className="min-h-[44px] px-3 py-2.5 bg-surface border border-line-subtle rounded-xs flex items-center justify-center space-x-2 text-xs text-ink hover:text-accent tracking-clinical uppercase active:scale-[0.97] transition-transform duration-150"
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>{siteContent.contact.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="min-h-[44px] px-3 py-2.5 bg-surface border border-line-subtle rounded-xs flex items-center justify-center space-x-2 text-xs text-ink hover:text-accent tracking-clinical uppercase active:scale-[0.97] transition-transform duration-150"
              >
                <MessageCircle className="w-3.5 h-3.5 text-accent" />
                <span>{siteContent.ctas.secondary}</span>
              </a>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              {siteContent.contact.address.street} · {siteContent.contact.address.city}
            </p>

            <Button
              href="/contacto"
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                handleCtaClick();
              }}
              showArrow
              rollText
              size="lg"
              className="w-full"
            >
              {siteContent.ctas.primary}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
