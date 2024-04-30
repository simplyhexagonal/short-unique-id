import type {
    default as ShortUniqueIdCore,
    ShortUniqueIdRanges,
    ShortUniqueIdRangesMap,
    ShortUniqueIdDefaultDictionaries,
    ShortUniqueIdOptions,
    DEFAULT_UUID_LENGTH,
    DEFAULT_OPTIONS
} from './short-unique-id-core.d.ts';
declare namespace ShortUniqueId {
    export {
        ShortUniqueIdRanges,
        ShortUniqueIdRangesMap,
        ShortUniqueIdDefaultDictionaries,
        ShortUniqueIdOptions,
        DEFAULT_UUID_LENGTH,
        DEFAULT_OPTIONS
    }
}
declare class ShortUniqueId extends ShortUniqueIdCore {}
export = ShortUniqueId;
