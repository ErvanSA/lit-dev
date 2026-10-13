/**
 * Wrapper Angular untuk <wec-button>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers:angular
 */
import { Directive, ElementRef, Input, inject } from '@angular/core';
import type { WecButton } from 'wec-ui/dist/components/atoms/wec-button/wec-button.js';

@Directive({
  selector: 'wec-button',
  standalone: true,
})
export class ButtonDirective {
  private readonly _element: WecButton = inject<ElementRef<WecButton>>(ElementRef).nativeElement;

  @Input() set variant(value: WecButton['variant']) {
    this._element.variant = value;
  }

  @Input() set size(value: WecButton['size']) {
    this._element.size = value;
  }

  @Input() set disabled(value: WecButton['disabled']) {
    this._element.disabled = value;
  }

  @Input() set loading(value: WecButton['loading']) {
    this._element.loading = value;
  }
}
