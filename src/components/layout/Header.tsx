'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clinicConfig } from '@/config/clinic.config';
import { siteContent } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { Menu, X, Phone, ArrowUpRight, MessageCircle, Calendar, ChevronDown } from 'lucide-react';
import { TreatmentsMegaMenu, TREATMENTS_NAV_DATA } from './TreatmentsMegaMenu';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [treatmentsDropdownOpen, setTreatmentsDropdownOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);
  const pathname = usePathname();

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Monitorización de scroll con debounce suave
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { href: '/invisalign', label: 'Invisalign®' },
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
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
            <span className="text-[10px] tracking-clinical uppercase text-ink-muted hidden sm:inline-block">
              Odontología de Precisión · Madrid
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
                      className={`text-xs uppercase tracking-clinical transition-colors duration-200 inline-flex items-center space-x-1 py-1 focus-visible:outline-accent cursor-pointer ${
                        isActive || treatmentsDropdownOpen
                          ? 'text-accent font-medium'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          treatmentsDropdownOpen ? 'rotate-180 text-accent' : 'text-ink-muted'
                        }`}
                      />
                    </button>
                    {isActive && !treatmentsDropdownOpen && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-clinical transition-colors duration-200 relative py-1 focus-visible:outline-accent ${
                    isActive ? 'text-accent font-medium' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
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
              className="touch-target inline-flex items-center space-x-2 text-xs tracking-clinical uppercase text-ink-secondary hover:text-accent transition-colors duration-200"
              aria-label={`Llamar a ${siteContent.brand.name} al ${siteContent.contact.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>{siteContent.contact.phone}</span>
            </a>

            <Link
              href="/contacto"
              onClick={handleCtaClick}
              className="touch-target px-5 py-2.5 rounded-btn transition-all duration-200 flex items-center space-x-2 text-xs uppercase tracking-clinical shadow-subtle group bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover"
            >
              <span>{siteContent.ctas.primary}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-btn-primary-text/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Botón Disparador Menú Móvil */}
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden touch-target p-2 text-ink hover:text-accent focus-visible:outline-accent min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            <span className="text-[11px] tracking-clinical uppercase text-ink-muted">
              Navegación Institucional
            </span>
            <nav className="flex flex-col space-y-4" aria-label="Enlaces del menú móvil">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.hasDropdown) {
                  return (
                    <div key={link.href} className="flex flex-col">
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
                    className={`min-h-[44px] flex items-center text-2xl sm:text-3xl font-serif tracking-tight transition-colors ${
                      isActive ? 'text-accent italic' : 'text-ink hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-line-subtle pt-6 flex flex-col space-y-4">
            <span className="text-[11px] tracking-clinical uppercase text-ink-muted">
              Contacto Directo y Cita
            </span>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${siteContent.contact.phoneRaw}`}
                onClick={handlePhoneClick}
                className="min-h-[44px] px-3 py-2.5 bg-surface border border-line-subtle rounded-xs flex items-center justify-center space-x-2 text-xs text-ink hover:text-accent tracking-clinical uppercase"
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>{siteContent.contact.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="min-h-[44px] px-3 py-2.5 bg-surface border border-line-subtle rounded-xs flex items-center justify-center space-x-2 text-xs text-ink hover:text-accent tracking-clinical uppercase"
              >
                <MessageCircle className="w-3.5 h-3.5 text-accent" />
                <span>{siteContent.ctas.secondary}</span>
              </a>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              {siteContent.contact.address.street} · {siteContent.contact.address.city}
            </p>

            <Link
              href="/contacto"
              onClick={() => {
                setMobileMenuOpen(false);
                handleCtaClick();
              }}
              className="touch-target min-h-[48px] w-full flex items-center justify-center bg-btn-primary text-btn-primary-text text-xs uppercase tracking-clinical py-3 rounded-btn font-medium hover:bg-btn-primary-hover transition-colors shadow-subtle"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>{siteContent.ctas.primary}</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
