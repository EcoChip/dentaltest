'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2, Check } from 'lucide-react';
import { isMotionDisabled, isHoverCapable } from '@/config/motion';

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
  rollText = true,
  magnetic = true,
  size = 'md',
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const buttonRef = useRef<HTMLElement | null>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Efecto magnético suave hacia el cursor (solo en escritorio con ratón preciso)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!magnetic || isMotionDisabled() || !isHoverCapable() || disabled || isLoading) return;

    const el = buttonRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.18; // Factor de atracción sutil
    const deltaY = (e.clientY - centerY) * 0.18;

    // Limitar recorrido a ±5px para elegancia quirúrgica sin sacudidas
    const clampedX = Math.max(-5, Math.min(5, deltaX));
    const clampedY = Math.max(-5, Math.min(5, deltaY));

    setMagneticOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMagneticOffset({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Onda (ripple) al toque o clic
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
    sm: 'px-3.5 py-1.5 text-xs rounded-btn min-h-[38px]',
    md: 'px-5 py-2.5 text-xs sm:text-sm rounded-btn min-h-[44px]',
    lg: 'px-7 py-3.5 text-xs sm:text-sm uppercase tracking-clinical rounded-btn min-h-[48px]',
  }[size];

  // Estilos según variante
  const variantStyles = {
    primary:
      'bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover shadow-subtle border border-transparent',
    secondary:
      'bg-surface hover:bg-surface-elevated border border-line-strong text-ink hover:border-accent hover:text-accent shadow-subtle',
    outline:
      'bg-transparent border border-btn-secondary-border text-ink hover:border-accent hover:text-accent',
    whatsapp:
      'bg-surface hover:bg-surface-elevated border border-line-subtle hover:border-accent text-ink',
    phone:
      'bg-surface hover:bg-surface-elevated border border-line-subtle text-ink hover:border-accent hover:text-accent',
  }[variant];

  // Estilo base interactivo con GPU transform para magnetismo y active scale
  const baseClasses = `
    group relative overflow-hidden inline-flex items-center justify-center font-medium
    select-none touch-target focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2
    active:scale-[0.97] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
    disabled:opacity-50 disabled:pointer-events-none cursor-pointer
    ${sizeStyles}
    ${variantStyles}
    ${className}
  `.trim();

  const magneticTransform =
    magneticOffset.x !== 0 || magneticOffset.y !== 0
      ? `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`
      : undefined;

  // Contenido interno con Roll Text opcional
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
      <span className="inline-flex items-center">
        {rollText && typeof children === 'string' ? (
          <span className="relative overflow-hidden inline-flex flex-col h-[1.25em] leading-[1.25em]">
            <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
              {children}
            </span>
            <span
              className="absolute top-full left-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full select-none"
              aria-hidden="true"
            >
              {children}
            </span>
          </span>
        ) : (
          <span>{children}</span>
        )}

        {showArrow && (
          <span className="relative overflow-hidden inline-flex w-3.5 h-3.5 ml-2 shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full group-hover:-translate-y-full" />
            <ArrowUpRight
              className="w-3.5 h-3.5 absolute -bottom-full -left-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full group-hover:-translate-y-full"
              aria-hidden="true"
            />
          </span>
        )}
      </span>
    );
  };

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
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={baseClasses}
          style={{ transform: magneticTransform }}
          aria-label={ariaLabel}
          target={target}
          rel={rel}
        >
          {renderContent()}
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
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        style={{ transform: magneticTransform }}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
      >
        {renderContent()}
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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={baseClasses}
      style={{ transform: magneticTransform }}
      aria-label={ariaLabel}
    >
      {renderContent()}
    </button>
  );
}
