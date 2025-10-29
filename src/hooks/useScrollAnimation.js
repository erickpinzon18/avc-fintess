'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollAnimation(options = {}) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const {
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = false,
      markers = false,
      y = 30,
      opacity = 0,
      duration = 0.6,
      stagger = 0,
    } = options;

    const elements = elementRef.current.querySelectorAll('[data-animate]');
    
    if (elements.length > 0) {
      gsap.fromTo(
        elements,
        {
          opacity: opacity,
          y: y,
        },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          stagger: stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elementRef.current,
            start: start,
            end: end,
            scrub: scrub,
            markers: markers,
          },
        }
      );
    } else {
      gsap.fromTo(
        elementRef.current,
        {
          opacity: opacity,
          y: y,
        },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elementRef.current,
            start: start,
            end: end,
            scrub: scrub,
            markers: markers,
          },
        }
      );
    }
  }, [options]);

  return elementRef;
}
