import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss']
})
export class VirtualKeyboardComponent {
  @Output() keyPress = new EventEmitter<string>();
  keys: string[] = ['4', '3', '1', '8', '5', '7', '0', '6', '2', '9'];
  dots: boolean[] = Array(8).fill(false);
  keyPressCount: number = 0;

  onKeyPress(key: string) {
    if (this.keyPressCount < this.dots.length) {
      this.keyPress.emit(key);
      this.keyPressCount++;
      this.updateDots();
    }
  }
  onClearAll() {
    this.keyPress.emit('ClearAll');
    this.keyPressCount = 0;
    this.updateDots();
  }

  onClear() {
    if (this.keyPressCount > 0) {
      this.keyPress.emit('Backspace');
      this.keyPressCount--;
      this.updateDots();
    }
  }

  private updateDots() {
    this.dots = this.dots.map((_, index) => index < this.keyPressCount);
  }
}