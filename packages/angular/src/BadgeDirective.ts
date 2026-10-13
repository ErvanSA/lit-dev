/**
 * Wrapper Angular untuk <wec-badge>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers:angular
 */
import { Directive, ElementRef, Input, inject } from '@angular/core';
import type { WecBadge } from 'wec-ui/dist/components/atoms/wec-badge/wec-badge.js';

@Directive({
  selector: 'wec-badge',
  standalone: true,
})
export class BadgeDirective {
  private readonly _element: WecBadge = inject<ElementRef<WecBadge>>(ElementRef).nativeElement;

  @Input() set variant(value: WecBadge['variant']) {
    this._element.variant = value;
  }
}
