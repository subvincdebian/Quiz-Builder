/// <reference types="@vitest/browser-playwright" />

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
import 'vitest';
import { AxeMatchers } from 'vitest-axe';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
