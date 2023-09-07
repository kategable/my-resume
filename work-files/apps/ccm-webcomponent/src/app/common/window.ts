import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const WINDOW = new InjectionToken<Window>('An abstraction over global window object', {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  factory: () => inject(DOCUMENT).defaultView!,
});
