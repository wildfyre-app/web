import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Link } from '../_models/link';
import { NavBarService } from '../_services/navBar.service';

@Component({
  template: `
  <h1 md-dialog-title>Grow the fyre!</h1>
  <share-container
		direction="horizontal"
		[expandable]="false"
		[textEnabled]="false"
    [properties]='{title:getPostDescription(), url: link.url, via:"WildFyreApp", hashtags:"WildFyre"}'
		[platforms]="['reddit','twitter','facebook','stumbleUpon']">
	</share-container>
  <button md-menu-item type="button" ngxClipboard [cbContent]="getPostLink()"
    (cbOnSuccess)="isCopied = true"><md-icon>link</md-icon>Clipboard</button>
  `
})
export class ShareDialogComponent implements OnInit, OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  link = new Link('', '', '');
  shoe = 2;

  constructor(
    public dialogRef: MdDialogRef<ShareDialogComponent>,
    private navBarService: NavBarService
    ) { }

    private removeMarkdown(input: string) {
      input = input
        // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
        .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '[Horizontal-Rule]')
        // Remove images
        .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
        // Remove horizontal rules
        .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '')
        // Header
        .replace(/\n={2,}/g, '\n')
        // Strikethrough
        .replace(/~~/g, '')
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, '')
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove setext-style headers
        .replace(/^[=\-]{2,}\s*$/g, '')
        // Remove footnotes?
        .replace(/\[\^.+?\](\: .*?$)?/g, '')
        .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
        // Remove images
        .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
        // Remove inline links
        .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
        // Remove blockquotes
        .replace(/^\s{0,3}>\s?/g, '')
        // Remove reference-style links?
        .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
        // Remove atx-style headers
        .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, '$1$2$3')
        // Remove emphasis (repeat the line to remove double emphasis)
        .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
        .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
        // Remove code blocks
        .replace(/(`{3,})(.*?)\1/gm, '$2')
        // Remove inline code
        .replace(/`(.+?)`/g, '$1')
        // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
        .replace(/\n{2,}/g, '\n\n');
        return input;
    }

    ngOnInit() {
      this.navBarService.link
        .takeUntil(this.componentDestroyed)
        .subscribe((link: Link) => {
          this.link = link;
        });
    }

    ngOnDestroy() {
      this.componentDestroyed.next(true);
      this.componentDestroyed.complete();
    }

    getPostDescription() {
      return this.removeMarkdown(this.link.discription) + '\n' + '-' + this.link.author;
    }

    getPostLink() {
      return this.link.url;
    }

    returnInformation(bool: boolean) {
      const message = {
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
