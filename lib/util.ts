// deno-lint-ignore no-explicit-any
export function trace(message: string, ...args: any[]) {
    console.log(message, ...args)
}

// deno-lint-ignore no-explicit-any
export function error(message: string, ...args: any[]) {
    console.error(message, ...args)
}
