/**
 * Wrapper Angular untuk <wec-textarea>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers:angular
 */
import {
  Directive,
  ElementRef,
  Input,
  inject,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import type { WecTextarea } from 'wec-ui/dist/components/atoms/wec-textarea/wec-textarea.js';

@Directive({
  selector: 'wec-textarea',
  standalone: true,
})
export class TextareaDirective implements OnInit, OnDestroy {
  private readonly _element: WecTextarea =
    inject<ElementRef<WecTextarea>>(ElementRef).nativeElement;
  private readonly _teardowns: Array<() => void> = [];

  @Input() set value(value: WecTextarea['value']) {
    this._element.value = value;
  }

  @Input() set placeholder(value: WecTextarea['placeholder']) {
    this._element.placeholder = value;
  }

  @Input() set rows(value: WecTextarea['rows']) {
    this._element.rows = value;
  }

  @Input() set disabled(value: WecTextarea['disabled']) {
    this._element.disabled = value;
  }

  @Input() set readonly(value: WecTextarea['readonly']) {
    this._element.readonly = value;
  }

  @Input() set required(value: WecTextarea['required']) {
    this._element.required = value;
  }

  @Input() set invalid(value: WecTextarea['invalid']) {
    this._element.invalid = value;
  }

  @Input() set accessibleName(value: WecTextarea['accessibleName']) {
    this._element.accessibleName = value;
  }

  @Input() set labelledBy(value: WecTextarea['labelledBy']) {
    this._element.labelledBy = value;
  }

  @Input() set describedBy(value: WecTextarea['describedBy']) {
    this._element.describedBy = value;
  }

  /** Diteruskan dari event `wec-input`. */
  @Output() wecInput = new EventEmitter<CustomEvent<{ value: string }>>();

  /** Diteruskan dari event `wec-change`. */
  @Output() wecChange = new EventEmitter<CustomEvent<{ value: string }>>();

  /** Diteruskan dari event `wec-focus`. */
  @Output() wecFocus = new EventEmitter<CustomEvent<Record<string, unknown>>>();

  /** Diteruskan dari event `wec-blur`. */
  @Output() wecBlur = new EventEmitter<CustomEvent<Record<string, unknown>>>();
  ngOnInit(): void {
    const on = (type: string, handler: (event: Event) => void): void => {
      this._element.addEventListener(type, handler);
      this._teardowns.push(() => this._element.removeEventListener(type, handler));
    };
    on('wec-input', (event) => this.wecInput.emit(event as CustomEvent<{ value: string }>));
    on('wec-change', (event) => this.wecChange.emit(event as CustomEvent<{ value: string }>));
    on('wec-focus', (event) => this.wecFocus.emit(event as CustomEvent<Record<string, unknown>>));
    on('wec-blur', (event) => this.wecBlur.emit(event as CustomEvent<Record<string, unknown>>));
  }

  ngOnDestroy(): void {
    for (const teardown of this._teardowns) {
      teardown();
    }
  }
}
