/**
 * Wrapper Angular untuk <wec-checkbox>.
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
import type { WecCheckbox } from 'wec-ui/dist/components/atoms/wec-checkbox/wec-checkbox.js';

@Directive({
  selector: 'wec-checkbox',
  standalone: true,
})
export class CheckboxDirective implements OnInit, OnDestroy {
  private readonly _element: WecCheckbox =
    inject<ElementRef<WecCheckbox>>(ElementRef).nativeElement;
  private readonly _teardowns: Array<() => void> = [];

  @Input() set checked(value: WecCheckbox['checked']) {
    this._element.checked = value;
  }

  @Input() set disabled(value: WecCheckbox['disabled']) {
    this._element.disabled = value;
  }

  @Input() set invalid(value: WecCheckbox['invalid']) {
    this._element.invalid = value;
  }

  @Input() set value(value: WecCheckbox['value']) {
    this._element.value = value;
  }

  @Input() set accessibleName(value: WecCheckbox['accessibleName']) {
    this._element.accessibleName = value;
  }

  @Input() set labelledBy(value: WecCheckbox['labelledBy']) {
    this._element.labelledBy = value;
  }

  @Input() set describedBy(value: WecCheckbox['describedBy']) {
    this._element.describedBy = value;
  }

  /** Diteruskan dari event `wec-change`. */
  @Output() wecChange = new EventEmitter<CustomEvent<{ checked: boolean; value: string }>>();
  ngOnInit(): void {
    const on = (type: string, handler: (event: Event) => void): void => {
      this._element.addEventListener(type, handler);
      this._teardowns.push(() => this._element.removeEventListener(type, handler));
    };
    on('wec-change', (event) =>
      this.wecChange.emit(event as CustomEvent<{ checked: boolean; value: string }>),
    );
  }

  ngOnDestroy(): void {
    for (const teardown of this._teardowns) {
      teardown();
    }
  }
}
