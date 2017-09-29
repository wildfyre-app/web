import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'marked'
})
export class MarkedPipe implements PipeTransform {
  constructor() {
    marked.setOptions({
      sanitize: true
    });
  }

  transform(value: string): string {
    return '<span class="markdown">' + marked(value || '') + '</span>';
  }
}
