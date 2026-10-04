'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2, Check } from 'lucide-react';
import { isMotionDisabled } from '@/config/motion';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'phone';
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  showArrow?: boolean;
  rollText?: boolean;
  magnetic?: boolean;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  isLoading = false,
  isSuccess = false,
  showArrow = false,
  size = 'md',
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const buttonRef = useRef<HTMLElement | null>(null);

  // Onda (ripple) háptica al toque o clic
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }

    if (!isMotionDisabled() && buttonRef.current) {
      const el = buttonRef.current;
      const rect = el.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      const circle = document.createElement('span');
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.className = 'ripple-wave';

      const existingRipple = el.querySelector('.ripple-wave');
      if (existingRipple) existingRipple.remove();

      el.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  // Estilos según tamaño
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs rounded-btn min-h-[38px]',
    md: 'px-5 py-2.5 text-xs sm:text-sm rounded-btn min-h-[44px]',
    lg: 'px-7 py-3.5 text-xs sm:text-sm uppercase tracking-clinical rounded-btn min-h-[48px]',
  }[size];

  // Estilos según variante (con elevación limpia en hover y presión en active)
  const variantStyles = {
    primary:
      'bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover shadow-subtle hover:shadow-card border border-transparent',
    secondary:
      'bg-surface hover:bg-surface-elevated border border-line-strong text-ink hover:border-accent hover:text-accent shadow-subtle hover:shadow-card',
    outline:
      'bg-transparent border border-btn-secondary-border text-ink hover:border-accent hover:text-accent hover:bg-accent/5',
    whatsapp:
      'bg-surface hover:bg-surface-elevated border border-line-subtle hover:border-accent text-ink hover:shadow-subtle',
    phone:
      'bg-surface hover:bg-surface-elevated border border-line-subtle text-ink hover:border-accent hover:text-accent hover:shadow-subtle',
  }[variant];

  // Estilo base interactivo: elevación suave GPU (-translate-y-0.5), presión en clic (scale 0.98), sin saltos
  const baseClasses = `
    group relative overflow-hidden inline-flex items-center justify-center font-medium
    select-none touch-target focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2
    transition-all duration-200 ease-out
    hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
    disabled:opacity-50 disabled:pointer-events-none cursor-pointer
    ${sizeStyles}
    ${variantStyles}
    ${className}
  `.trim();

  // Contenido interno limpio, sin bugs de corte de texto ni temblores
  const renderContent = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center space-x-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Procesando...</span>
        </span>
      );
    }

    if (isSuccess) {
      return (
        <span className="inline-flex items-center space-x-1.5 text-emerald-400">
          <Check className="w-4 h-4 animate-in zoom-in-50 duration-200" />
          <span>{children}</span>
        </span>
      );
    }

    return (
      <span className="relative z-10 inline-flex items-center">
        <span className="transition-colors duration-200">{children}</span>

        {showArrow && (
          <ArrowUpRight
            className="w-3.5 h-3.5 ml-1.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        )}
      </span>
    );
  };

  const sheenOverlay = (
    <span
      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full duration-700 ease-in-out"
      aria-hidden="true"
    />
  );

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');

    if (isExternal) {
      return (
        <a
          ref={(el) => {
            buttonRef.current = el;
          }}
          href={href}
          onClick={handleClick}
          className={baseClasses}
          aria-label={ariaLabel}
          target={target}
          rel={rel}
        >
          {renderContent()}
          {sheenOverlay}
        </a>
      );
    }

    return (
      <Link
        ref={(el) => {
          buttonRef.current = el;
        }}
        href={href}
        onClick={handleClick}
        className={baseClasses}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
      >
        {renderContent()}
        {sheenOverlay}
      </Link>
    );
  }

  return (
    <button
      ref={(el) => {
        buttonRef.current = el;
      }}
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={baseClasses}
      aria-label={ariaLabel}
    >
      {renderContent()}
      {sheenOverlay}
    </button>
  );
}
