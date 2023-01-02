import type { Metadata } from './types.ts'

export const METADATA_DEFAULTS: Partial<Metadata> = {
    background: false,
    closeOnSuccess: true,
    timeout: 1000 * 60 * 10 // 10min
}
