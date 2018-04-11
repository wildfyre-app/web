import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'marked'
})
export class MarkedPipe implements PipeTransform {
  constructor() {
    const renderer = new marked.Renderer();

    renderer.link = function( href, title, text ) {
      return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>';
    };

    marked.setOptions({
      renderer: renderer,
      sanitize: true
    });
  }

  transform(value: string): string {
    return '<span class="markdown">' + marked(value || '') + '</span>';
  }
}
