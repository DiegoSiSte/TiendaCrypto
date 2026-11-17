import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, signal } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  host: { '[class.is-visible]': 'visible()' }
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  readonly visible = signal(false);

  ngAfterViewInit(): void {
    const node = this.element.nativeElement;
    if (!('IntersectionObserver' in window)) {
      this.visible.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
