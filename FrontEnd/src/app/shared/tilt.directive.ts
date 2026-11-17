import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = this.element.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.element.nativeElement.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
    this.element.nativeElement.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`);
  }

  @HostListener('mouseleave')
  reset(): void {
    this.element.nativeElement.style.setProperty('--tilt-x', '0deg');
    this.element.nativeElement.style.setProperty('--tilt-y', '0deg');
  }
}
