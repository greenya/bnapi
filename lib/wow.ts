// deno-lint-ignore-file camelcase

import { get } from './core.ts'

// Playable Race API

export interface PlayableRaceIndex {
    id: number,
    name: string
}

export type PlayableRace = {
    id: number,
    name: string,
    gender_name: { male: string, female: string },
    faction: { type: string, name: string },
    is_selectable: boolean,
    is_allied_Race: boolean
}

export async function playableRaces(): Promise<PlayableRaceIndex[]> {
    const { races } = await get('data/wow/playable-race/index', { namespace: 'static' })
    return races
}

export async function playableRace(id: number): Promise<PlayableRace> {
    return await get(`data/wow/playable-race/${id}`, { namespace: 'static' })
}
