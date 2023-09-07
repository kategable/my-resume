import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize',
})
export class FilesizePipe implements PipeTransform {
  transform(size: number, ...args: unknown[]): string {
    return this.formatFileSize(size);
  }

  formatFileSize(iSize: number): string {
    if (iSize < 1000) return '' + iSize + 'B';
    else if (iSize < 1000 * 1000) return (iSize / 1000).toPrecision(3) + 'kB';
    else if (iSize < 1000 * 1000 * 1000) return (iSize / 1000000).toPrecision(3) + 'mB';
    else return (iSize / 1000000000).toPrecision(3) + 'gB';
  }
}
