// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VirtualKeyboardComponent } from './virtual-keyboard/virtual-keyboard.component';

@NgModule({
  declarations: [VirtualKeyboardComponent],
  imports: [CommonModule, FormsModule],
  exports: [VirtualKeyboardComponent]
})
export class SharedModule {}
