import { existsSync, mkdirpSync, readFileSync, writeFileSync } from 'fs-extra';
import { resolve } from 'path';

/**
 * Encapsulate all of our un-mockable file system functions here,
 * so we can dependency inject them wherever we need them.
 */

export interface IStaticFunctionWrapper {
  existsSync: typeof existsSync;
  mkdirpSync: typeof mkdirpSync;
  process: typeof process;
  readFileSync: typeof readFileSync;
  resolve: typeof resolve;
  writeFileSync: typeof writeFileSync;
}

export const staticFunctionWrapper: IStaticFunctionWrapper = {
  existsSync,
  mkdirpSync,
  process,
  readFileSync,
  resolve,
  writeFileSync,
};
