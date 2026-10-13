/**
 * Wrapper Angular untuk <wec-input>.
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
import type { WecInput } from 'wec-ui/dist/components/atoms/wec-input/wec-input.js';

@Directive({
  selector: 'wec-input',
  standalone: true,
})
export class InputDirective implements OnInit, OnDestroy {
  private readonly _element: WecInput = inject<ElementRef<WecInput>>(ElementRef).nativeElement;
  private readonly _teardowns: Array<() => void> = [];

  @Input() set type(value: WecInput['type']) {
    this._element.type = value;
  }

  @Input() set value(value: WecInput['value']) {
    this._element.value = value;
  }

  @Input() set placeholder(value: WecInput['placeholder']) {
    this._element.placeholder = value;
  }

  @Input() set disabled(value: WecInput['disabled']) {
    this._element.disabled = value;
  }

  @Input() set readonly(value: WecInput['readonly']) {
    this._element.readonly = value;
  }

  @Input() set required(value: WecInput['required']) {
    this._element.required = value;
  }

  @Input() set invalid(value: WecInput['invalid']) {
    this._element.invalid = value;
  }

  @Input() set accessibleName(value: WecInput['accessibleName']) {
    this._element.accessibleName = value;
  }

  @Input() set labelledBy(value: WecInput['labelledBy']) {
    this._element.labelledBy = value;
  }

  @Input() set describedBy(value: WecInput['describedBy']) {
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
