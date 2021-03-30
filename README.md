# bnapi

Blizzard Battle.net API wrapper for Deno.

## Usage

Setup a client at https://develop.battle.net/access/, get API Key and API Secret. Use those like so:

```ts
// main.ts
import * as bnapi from 'https://deno.land/x/bnapi/mod.ts'

const ok = await bnapi.auth(
    'YOUR_API_KEY_HERE'
    'YOUR_API_SECRET_HERE'
    'eu', // region
    'en_GB' // locale
)

if (ok) {
    const races = await bnapi.wow.playableRaces()
    console.log('All playable races', races)

    const race = await bnapi.wow.playableRace(races[0].id)
    console.log('Details on the very first race', race)
} else {
    console.error('Failed to auth')
}
```

Run your code like so:

```
deno run --allow-net main.ts
```
