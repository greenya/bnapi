// deno-lint-ignore-file camelcase

import { get } from './core.ts'

// Playable Class API

interface PlayableClassIndex {
    id: number,
    name: string
}

interface PlayableClass {
    id: number,
    name: string,
    gender_name: { male: string, female: string },
    power_type: { id: number, name: string },
    specializations: { id: number, name: string }[],
    media: { id: number }
}

interface PlayableClassMedia {
    id: number,
    assets: { key: string, value: string, file_data_id: number }[]
}

interface PlayableClassPvpTalentSlot {
    slot_number: number,
    unlock_player_level: number
}

export async function playableClasses(): Promise<PlayableClassIndex[]> {
    const { classes } = await get('data/wow/playable-class/index', { namespace: 'static' })
    return classes
}

export async function playableClass(id: number): Promise<PlayableClass> {
    return await get(`data/wow/playable-class/${id}`, { namespace: 'static' })
}

export async function playableClassMedia(id: number): Promise<PlayableClassMedia> {
    return await get(`data/wow/media/playable-class/${id}`, { namespace: 'static' })
}

export async function playableClassPvpTalentSlots(id: number): Promise<PlayableClassPvpTalentSlot[]> {
    const { talent_slots } = await get(`data/wow/playable-class/${id}/pvp-talent-slots`, { namespace: 'static' })
    return talent_slots
}

// Playable Race API

interface PlayableRaceIndex {
    id: number,
    name: string
}

interface PlayableRace {
    id: number,
    name: string,
    gender_name: { male: string, female: string },
    faction: { type: string, name: string },
    is_selectable: boolean,
    is_allied_race: boolean
}

export async function playableRaces(): Promise<PlayableRaceIndex[]> {
    const { races } = await get('data/wow/playable-race/index', { namespace: 'static' })
    return races
}

export async function playableRace(id: number): Promise<PlayableRace> {
    return await get(`data/wow/playable-race/${id}`, { namespace: 'static' })
}
