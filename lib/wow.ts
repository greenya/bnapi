// deno-lint-ignore-file camelcase

import { get } from './core.ts'

// Common

interface IdName {
    id: number,
    name: string
}

interface GenderName {
    male: string,
    female: string
}

interface Media {
    id: number,
    assets: {
        key: string,
        value: string,
        file_data_id: number
    }[]
}

// Playable Class API

interface PlayableClass extends IdName {
    gender_name: GenderName,
    power_type: IdName,
    specializations: IdName[],
    media: { id: number }
}

interface PlayableClassPvpTalentSlot {
    slot_number: number,
    unlock_player_level: number
}

export async function playableClasses(): Promise<IdName[]> {
    const { classes } = await get('data/wow/playable-class/index', { namespace: 'static' })
    return classes
}

export async function playableClass(id: number): Promise<PlayableClass> {
    return await get(`data/wow/playable-class/${id}`, { namespace: 'static' })
}

export async function playableClassMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/playable-class/${id}`, { namespace: 'static' })
}

export async function playableClassPvpTalentSlots(id: number): Promise<PlayableClassPvpTalentSlot[]> {
    const { talent_slots } = await get(`data/wow/playable-class/${id}/pvp-talent-slots`, { namespace: 'static' })
    return talent_slots
}

// Playable Race API

interface PlayableRace extends IdName {
    gender_name: GenderName,
    faction: { type: string, name: string },
    is_selectable: boolean,
    is_allied_race: boolean
}

export async function playableRaces(): Promise<IdName[]> {
    const { races } = await get('data/wow/playable-race/index', { namespace: 'static' })
    return races
}

export async function playableRace(id: number): Promise<PlayableRace> {
    return await get(`data/wow/playable-race/${id}`, { namespace: 'static' })
}
