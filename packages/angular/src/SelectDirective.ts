/**
 * Wrapper Angular untuk <wec-select>.
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
import type { WecSelect } from 'wec-ui/dist/components/atoms/wec-select/wec-select.js';

@Directive({
  selector: 'wec-select',
  standalone: true,
})
export class SelectDirective implements OnInit, OnDestroy {
  private readonly _element: WecSelect = inject<ElementRef<WecSelect>>(ElementRef).nativeElement;
  private readonly _teardowns: Array<() => void> = [];

  @Input() set value(value: WecSelect['value']) {
    this._element.value = value;
  }

  @Input() set placeholder(value: WecSelect['placeholder']) {
    this._element.placeholder = value;
  }

  @Input() set disabled(value: WecSelect['disabled']) {
    this._element.disabled = value;
  }

  @Input() set required(value: WecSelect['required']) {
    this._element.required = value;
  }

  @Input() set invalid(value: WecSelect['invalid']) {
    this._element.invalid = value;
  }

  @Input() set accessibleName(value: WecSelect['accessibleName']) {
    this._element.accessibleName = value;
  }

  @Input() set labelledBy(value: WecSelect['labelledBy']) {
    this._element.labelledBy = value;
  }

  @Input() set describedBy(value: WecSelect['describedBy']) {
    this._element.describedBy = value;
  }

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
