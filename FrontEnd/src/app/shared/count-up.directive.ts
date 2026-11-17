import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

@Directive({ selector: '[appCountUp]' })
export class CountUpDirective implements OnInit {
  readonly target = input(0, { alias: 'appCountUp' });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnInit(): void {
    const target = this.target();
    const node = this.element.nativeElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target === 0) {
      node.textContent = String(target);
      return;
    }

    const duration = 900;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
