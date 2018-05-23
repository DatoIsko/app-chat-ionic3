import { Component, forwardRef } from '@angular/core';
import { EmojiProvider } from "../../providers/emoji";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const EMOJI_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EmojiPickerComponent),
  multi: true
};

@Component({
  selector: 'emoji-picker',
  providers: [EMOJI_PICKER_VALUE_ACCESSOR],
  templateUrl: './emoji-picker.html',
  styles: [
    `
    .emoji-picker {
      height: 195px;
      border-top: 1px solid #999;
       
      .emoji-items {
        padding: 10px;
        width: 100%;
        height: 100%; 
         
        .emoji-item {
          display: block;
          float: left;
          width: 12.5%;
          height: 42px;
          font-size: 1.2em;
          line-height: 42px;
          text-align: center;
          margin-bottom: 10px; 
        }
      }
     }`
  ]
})
export class EmojiPickerComponent implements ControlValueAccessor {

  emojiArr = [];

  _content: string;
  _onChanged: Function;
  _onTouched: Function;

  constructor(emojiProvider: EmojiProvider) {
    this.emojiArr = emojiProvider.getEmojis();
  }

  writeValue(obj: any): void {
    this._content = obj;
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
    this.setValue(this._content);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  private setValue(val: any): any {
    this._content += val;
    if (this._content) {
      this._onChanged(this._content)
    }
  }
}
