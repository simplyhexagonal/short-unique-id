import type {
  DEFAULT_OPTIONS,
  DEFAULT_UUID_LENGTH,
  default as ShortUniqueIdCore,
  ShortUniqueIdDefaultDictionaries,
  ShortUniqueIdOptions,
  ShortUniqueIdRanges,
  ShortUniqueIdRangesMap,
} from './short-unique-id-core.d.ts';
declare namespace ShortUniqueId {
  export type {
    ShortUniqueIdRanges,
    ShortUniqueIdRangesMap,
    ShortUniqueIdDefaultDictionaries,
    ShortUniqueIdOptions,
    DEFAULT_UUID_LENGTH,
    DEFAULT_OPTIONS,
  };

  export * from './short-unique-id-core.d.ts';
}
declare class ShortUniqueId extends ShortUniqueIdCore {}
export = ShortUniqueId;
