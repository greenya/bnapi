# bnapi

Blizzard Battle.net API wrapper for Deno -- [bnapi](https://deno.land/x/bnapi).

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

## World of Warcraft

All the API for World of Warcraft is located in `wow` object. Every call returns result object (or array of objects) on success and `false` in case of failure. Some fails are not considered an API failure, for example, if you try to get list of hunter pets for a character that is not a hunter, you get `false` (not an empty array). These rare cases described in the Blizzard API (see links below).

- Game Data APIs [link](https://develop.battle.net/documentation/world-of-warcraft/game-data-apis)

    - [x] Achievement API
    - [x] Auction House API
    - [ ] Azerite Essence API
    - [x] Connected Realm API
    - [ ] Covenant API
    - [ ] Creature API
    - [x] Guild Crest API
    - [x] Item API
    - [x] Journal API
    - [ ] Media Search API
    - [ ] Modified Crafting API
    - [x] Mount API
    - [x] Mythic Keystone Affix API
    - [x] Mythic Keystone Dungeon API
    - [x] Mythic Keystone Leaderboard API
    - [x] Mythic Raid Leaderboard API
    - [x] Pet API
    - [x] Playable Class API
    - [x] Playable Race API
    - [x] Playable Specialization API
    - [x] Power Type API
    - [x] Profession API
    - [ ] PvP Season API
    - [ ] PvP Tier API
    - [x] Quest API
    - [x] Realm API
    - [x] Region API
    - [x] Reputations API
    - [x] Spell API
    - [x] Talent API
    - [x] Tech Talent API
    - [x] Title API
    - [x] WoW Token API

- Profile APIs [link](https://develop.battle.net/documentation/world-of-warcraft/profile-apis)

    - [ ] Account Profile API
    - [x] Character Achievements API
    - [x] Character Appearance API
    - [x] Character Collections API
    - [x] Character Encounters API
    - [x] Character Equipment API
    - [x] Character Hunter Pets API
    - [x] Character Media API
    - [x] Character Mythic Keystone Profile API
    - [x] Character Professions API
    - [x] Character Profile API
    - [x] Character PvP API
    - [x] Character Quests API
    - [x] Character Reputations API
    - [x] Character Soulbinds API
    - [x] Character Specializations API
    - [x] Character Statistics API
    - [x] Character Titles API
    - [x] Guild API
