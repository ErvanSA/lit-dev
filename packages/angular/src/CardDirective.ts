/**
 * Wrapper Angular untuk <wec-card>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers:angular
 */
import { Directive, ElementRef, Input, inject } from '@angular/core';
import type { WecCard } from 'wec-ui/dist/components/molecules/wec-card/wec-card.js';

@Directive({
  selector: 'wec-card',
  standalone: true,
})
export class CardDirective {
  private readonly _element: WecCard = inject<ElementRef<WecCard>>(ElementRef).nativeElement;

  @Input() set interactive(value: WecCard['interactive']) {
    this._element.interactive = value;
  }
}
