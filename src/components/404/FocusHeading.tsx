'use client';

import React, { useEffect, useRef } from 'react';

export function FocusHeading({ children }: { children: React.ReactNode }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Foco accesible inicial en el titular al cargar la página 404
    headingRef.current?.focus();
  }, []);

  return (
    <h1
      ref={headingRef}
      tabIndex={-1}
      className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight outline-none focus:outline-none"
    >
      {children}
    </h1>
  );
}
