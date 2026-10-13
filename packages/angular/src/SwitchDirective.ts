/**
 * Wrapper Angular untuk <wec-switch>.
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
import type { WecSwitch } from 'wec-ui/dist/components/atoms/wec-switch/wec-switch.js';

@Directive({
  selector: 'wec-switch',
  standalone: true,
})
export class SwitchDirective implements OnInit, OnDestroy {
  private readonly _element: WecSwitch = inject<ElementRef<WecSwitch>>(ElementRef).nativeElement;
  private readonly _teardowns: Array<() => void> = [];

  @Input() set checked(value: WecSwitch['checked']) {
    this._element.checked = value;
  }

  @Input() set disabled(value: WecSwitch['disabled']) {
    this._element.disabled = value;
  }

  @Input() set invalid(value: WecSwitch['invalid']) {
    this._element.invalid = value;
  }

  @Input() set accessibleName(value: WecSwitch['accessibleName']) {
    this._element.accessibleName = value;
  }

  @Input() set labelledBy(value: WecSwitch['labelledBy']) {
    this._element.labelledBy = value;
  }

  @Input() set describedBy(value: WecSwitch['describedBy']) {
    this._element.describedBy = value;
  }

  /** Diteruskan dari event `wec-change`. */
  @Output() wecChange = new EventEmitter<CustomEvent<{ checked: boolean }>>();
  ngOnInit(): void {
    const on = (type: string, handler: (event: Event) => void): void => {
      this._element.addEventListener(type, handler);
      this._teardowns.push(() => this._element.removeEventListener(type, handler));
    };
    on('wec-change', (event) => this.wecChange.emit(event as CustomEvent<{ checked: boolean }>));
  }

  ngOnDestroy(): void {
    for (const teardown of this._teardowns) {
      teardown();
    }
  }
}
