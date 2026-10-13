/**
 * Wrapper Angular untuk <wec-icon>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers:angular
 */
import { Directive, ElementRef, Input, inject } from '@angular/core';
import type { WecIcon } from 'wec-ui/dist/components/atoms/wec-icon/wec-icon.js';

@Directive({
  selector: 'wec-icon',
  standalone: true,
})
export class IconDirective {
  private readonly _element: WecIcon = inject<ElementRef<WecIcon>>(ElementRef).nativeElement;

  @Input() set name(value: WecIcon['name']) {
    this._element.name = value;
  }

  @Input() set size(value: WecIcon['size']) {
    this._element.size = value;
  }

  @Input() set label(value: WecIcon['label']) {
    this._element.label = value;
  }
}
