// deno-lint-ignore no-explicit-any
export function log(message: string, ...args: any[]) {
    console.log('[bnapi]', message, ...args)
}

// deno-lint-ignore no-explicit-any
export function error(message: string, ...args: any[]) {
    console.error('[bnapi]', message, ...args)
}
