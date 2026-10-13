/**
 * NgModule untuk konsumen non-standalone.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 */
import { NgModule } from '@angular/core';
import { BadgeDirective } from './BadgeDirective.js';
import { ButtonDirective } from './ButtonDirective.js';
import { CardDirective } from './CardDirective.js';
import { CheckboxDirective } from './CheckboxDirective.js';
import { FormFieldDirective } from './FormFieldDirective.js';
import { IconDirective } from './IconDirective.js';
import { InputDirective } from './InputDirective.js';
import { RadioGroupDirective } from './RadioGroupDirective.js';
import { SelectDirective } from './SelectDirective.js';
import { SwitchDirective } from './SwitchDirective.js';
import { TextareaDirective } from './TextareaDirective.js';

@NgModule({
  imports: [
    BadgeDirective,
    ButtonDirective,
    CardDirective,
    CheckboxDirective,
    FormFieldDirective,
    IconDirective,
    InputDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextareaDirective,
  ],
  exports: [
    BadgeDirective,
    ButtonDirective,
    CardDirective,
    CheckboxDirective,
    FormFieldDirective,
    IconDirective,
    InputDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextareaDirective,
  ],
})
export class WecUiModule {}
