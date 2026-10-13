/**
 * Wrapper Angular untuk <wec-radio-group>.
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
import type { WecRadioGroup } from 'wec-ui/dist/components/atoms/wec-radio-group/wec-radio-group.js';

@Directive({
  selector: 'wec-radio-group',
  standalone: true,
})
export class RadioGroupDirective implements OnInit, OnDestroy {
  private readonly _element: WecRadioGroup =
    inject<ElementRef<WecRadioGroup>>(ElementRef).nativeElement;
  private readonly _teardowns: Array<() => void> = [];

  @Input() set value(value: WecRadioGroup['value']) {
    this._element.value = value;
  }

  @Input() set disabled(value: WecRadioGroup['disabled']) {
    this._element.disabled = value;
  }

  @Input() set labelledBy(value: WecRadioGroup['labelledBy']) {
    this._element.labelledBy = value;
  }

  @Input() set describedBy(value: WecRadioGroup['describedBy']) {
    this._element.describedBy = value;
  }

  /** Diteruskan dari event `wec-change`. */
  @Output() wecChange = new EventEmitter<CustomEvent<{ value: string }>>();
  ngOnInit(): void {
    const on = (type: string, handler: (event: Event) => void): void => {
      this._element.addEventListener(type, handler);
      this._teardowns.push(() => this._element.removeEventListener(type, handler));
    };
    on('wec-change', (event) => this.wecChange.emit(event as CustomEvent<{ value: string }>));
  }

  ngOnDestroy(): void {
    for (const teardown of this._teardowns) {
      teardown();
    }
  }
}
