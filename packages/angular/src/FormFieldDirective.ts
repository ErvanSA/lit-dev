/**
 * Wrapper Angular untuk <wec-form-field>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers:angular
 */
import { Directive, ElementRef, Input, inject } from '@angular/core';
import type { WecFormField } from 'wec-ui/dist/components/molecules/wec-form-field/wec-form-field.js';

@Directive({
  selector: 'wec-form-field',
  standalone: true,
})
export class FormFieldDirective {
  private readonly _element: WecFormField =
    inject<ElementRef<WecFormField>>(ElementRef).nativeElement;

  @Input() set label(value: WecFormField['label']) {
    this._element.label = value;
  }

  @Input() set hint(value: WecFormField['hint']) {
    this._element.hint = value;
  }

  @Input() set error(value: WecFormField['error']) {
    this._element.error = value;
  }

  @Input() set required(value: WecFormField['required']) {
    this._element.required = value;
  }
}
