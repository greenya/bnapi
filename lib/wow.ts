// deno-lint-ignore-file camelcase

import { get } from './core.ts'

// Common

interface IdName {
    id: number,
    name: string
}

interface TypeName {
    type: string,
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

// ===============
// Achievement API
// ===============

interface AchievementCategoryIndex {
    categories: IdName[],
    root_categories: IdName[],
    guild_categories: IdName[]
}

interface AchievementCategory extends IdName {
    achievements: IdName[],
    subcategories: IdName[],
    parent_category?: IdName,
    aggregates_by_faction: {
        alliance: { quantity: number, points: number },
        horde: { quantity: number, points: number }
    },
    is_guild_category: boolean,
    display_order: number
}

interface AchievementCriteria {
    id: number,
    description: string,
    amount: number,
    achievement?: IdName,
    child_criteria?: AchievementCriteria[],
    operator?: TypeName
}

interface Achievement extends IdName {
    category: IdName,
    description: string,
    points: number,
    is_account_wide: boolean,
    criteria: AchievementCriteria,
    media: { id: number }
    display_order: number
}

export async function achievementCategories(): Promise<AchievementCategoryIndex> {
    return await get('data/wow/achievement-category/index', { namespace: 'static' })
}

export async function achievementCategory(id: number): Promise<AchievementCategory> {
    return await get(`data/wow/achievement-category/${id}`, { namespace: 'static' })
}

export async function achievements(): Promise<IdName[]> {
    const { achievements } = await get('data/wow/achievement/index', { namespace: 'static' })
    return achievements
}

export async function achievement(id: number): Promise<Achievement> {
    return await get(`data/wow/achievement/${id}`, { namespace: 'static' })
}

export async function achievementMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/achievement/${id}`, { namespace: 'static' })
}

// ========
// Item API
// ========

interface ItemClass {
    class_id: number,
    name: string,
    item_subclasses: IdName[]
}

interface ItemSubclass {
    class_id: number,
    subclass_id: number,
    display_name: string,
    verbose_name: string
}

interface ItemSetEffect {
    display_string: string,
    required_count: number
}

interface ItemSet extends IdName {
    items: IdName[],
    effects: ItemSetEffect[],
    is_effect_active?: boolean
}

interface Display {
    display_string: string,
    color: { r: number, g: number, b: number, a: number }
}

interface PreviewItem {
    context?: number,
    item: { id: number },
    quality: TypeName,
    name: string,
    media: { id: number },
    item_class: IdName,
    item_subclass: IdName,
    inventory_type: TypeName,
    binding?: TypeName,
    armor?: { value: number, display: Display }
    bonus_list?: number[],
    stats?: {
        type: TypeName,
        value: number,
        is_negated?: boolean,
        is_equip_bonus?: boolean,
        display: Display
    }[],
    spells?: {
        spell: IdName,
        description: string
    }[],
    requirements?: {
        playable_classes: { display_string: string },
        level: { value: number, display_string: string }
    },
    set?: {
        item_set: IdName,
        items: IdName[],
        effects: ItemSetEffect[],
        legacy: string,
        display_string: string
    },
    level?: { value: number, display_string: string },
    sell_price?: {
        value: number,
        display_strings: {
            header: string,
            gold: string,
            silver: string,
            copper: string
        }
    },
    unique_equipped?: string,
    description?: string,
    is_subclass_hidden: boolean,
    crafting_reagent?: string
}

interface Item extends IdName {
    quality: TypeName,
    level: number,
    required_level: number,
    media: { id: number },
    item_class: IdName,
    item_subclass: IdName,
    inventory_type: TypeName,
    purchase_price: number,
    sell_price: number,
    max_count: number,
    is_equippable: boolean,
    is_stackable: boolean,
    description?: string,
    preview_item: PreviewItem,
    purchase_quantity: number
}

export async function itemClasses(): Promise<IdName[]> {
    const { item_classes } = await get('data/wow/item-class/index', { namespace: 'static' })
    return item_classes
}

export async function itemClass(id: number): Promise<ItemClass> {
    return await get(`data/wow/item-class/${id}`, { namespace: 'static' })
}

export async function itemSubclass(classId: number, subclassId: number): Promise<ItemSubclass> {
    return await get(`data/wow/item-class/${classId}/item-subclass/${subclassId}`, { namespace: 'static' })
}

export async function itemSets(): Promise<IdName[]> {
    const { item_sets } = await get('data/wow/item-set/index', { namespace: 'static' })
    return item_sets
}

export async function itemSet(id: number): Promise<ItemSet> {
    return await get(`data/wow/item-set/${id}`, { namespace: 'static' })
}

export async function item(id: number): Promise<Item> {
    return await get(`data/wow/item/${id}`, { namespace: 'static' })
}

export async function itemMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/item/${id}`, { namespace: 'static' })
}

// ===========
// Journal API
// ===========

interface JournalExpansion extends IdName {
    dungeons: IdName[],
    raids: IdName[]
}

interface JournalEncounterSection {
    id: number,
    title: string,
    body_text?: string,
    creature_display?: { id: number },
    sections?: JournalEncounterSection[],
    spell?: IdName
}

interface JournalEncounter extends IdName {
    description: string,
    creatures: {
        id: number,
        name: string,
        creature_display: { id: number }
    }[],
    items: {
        id: number,
        item: IdName
    }[],
    sections: JournalEncounterSection[],
    instance: IdName,
    category: { type: string },
    modes?: TypeName[]
}

interface JournalInstance extends IdName {
    description: string,
    encounters: IdName[],
    expansion: IdName,
    location?: IdName,
    map?: IdName,
    category: { type: string },
    minimum_level?: number,
    modes?: {
        mode: TypeName,
        players: number,
        is_tracked: boolean
    }[],
    media: { id: number }
}

export async function journalExpansions(): Promise<IdName[]> {
    const { tiers } = await get('data/wow/journal-expansion/index', { namespace: 'static' })
    return tiers
}

export async function journalExpansion(id: number): Promise<JournalExpansion> {
    return await get(`data/wow/journal-expansion/${id}`, { namespace: 'static' })
}

export async function journalEncounters(): Promise<IdName[]> {
    const { encounters } = await get('data/wow/journal-encounter/index', { namespace: 'static' })
    return encounters
}

export async function journalEncounter(id: number): Promise<JournalEncounter> {
    return await get(`data/wow/journal-encounter/${id}`, { namespace: 'static' })
}

export async function journalInstances(): Promise<IdName[]> {
    const { instances } = await get('data/wow/journal-instance/index', { namespace: 'static' })
    return instances
}

export async function journalInstance(id: number): Promise<JournalInstance> {
    return await get(`data/wow/journal-instance/${id}`, { namespace: 'static' })
}

export async function journalInstanceMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/journal-instance/${id}`, { namespace: 'static' })
}

// ==================
// Playable Class API
// ==================

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

// =================
// Playable Race API
// =================

interface PlayableRace extends IdName {
    gender_name: GenderName,
    faction: TypeName,
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

// ===========================
// Playable Specialization API
// ===========================

interface IdNameOpt {
    id: number,
    name?: string
}

interface SpellTooltip {
    description: string,
    cast_time: string,
    power_cost?: string,
    cooldown?: string
}

interface PlayableSpecializationIndex {
    character_specializations: IdName[],
    pet_specializations: IdName[]
}

interface PlayableSpecialization extends IdName {
    role: TypeName,
    playable_class: IdNameOpt,
    gender_description: GenderName,
    talent_tiers?: {
        level: number,
        talents: {
            talent: IdName,
            spell_tooltip: SpellTooltip,
            column_index: number
        }[],
        tier_index: number
    }[],
    pvp_talents?: {
        talent: IdName,
        spell_tooltip: SpellTooltip
    }[],
    media: { id: number }
}

export async function playableSpecializations(): Promise<PlayableSpecializationIndex> {
    return await get('data/wow/playable-specialization/index', { namespace: 'static' })
}

export async function playableSpecialization(id: number): Promise<PlayableSpecialization> {
    return await get(`data/wow/playable-specialization/${id}`, { namespace: 'static' })
}

export async function playableSpecializationMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/playable-specialization/${id}`, { namespace: 'static' })
}

// ==============
// Power Type API
// ==============

export async function powerTypes(): Promise<IdName[]> {
    const { power_types } = await get('data/wow/power-type/index', { namespace: 'static' })
    return power_types
}

export async function powerType(id: number): Promise<IdName> {
    return await get(`data/wow/power-type/${id}`, { namespace: 'static' })
}

// ==============
// Profession API
// ==============

interface Profession extends IdName {
    description: string,
    type: TypeName,
    skill_tiers: IdName[],
    media: { id: number }
}

interface ProfessionSkillTier extends IdName {
    minimum_skill_level: number,
    maximum_skill_level: number,
    categories: {
        name: string,
        recipes: IdName[]
    }[]
}

interface Recipe extends IdName {
    crafted_item: IdName,
    crafted_quantity: number,
    reagents: {
        reagent: IdName,
        quantity: number
    }[],
    modified_crafting_slots: {
        slot_type: IdName,
        display_order: number
    }[],
    media: { id: number }
}

export async function professions(): Promise<IdName[]> {
    const { professions } = await get('data/wow/profession/index', { namespace: 'static' })
    return professions
}

export async function profession(id: number): Promise<Profession> {
    return await get(`data/wow/profession/${id}`, { namespace: 'static' });
}

export async function professionMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/profession/${id}`, { namespace: 'static' })
}

export async function professionSkillTier(id: number, skillTierId: number): Promise<ProfessionSkillTier> {
    return await get(`data/wow/profession/${id}/skill-tier/${skillTierId}`, { namespace: 'static' })
}

export async function recipe(id: number): Promise<Recipe> {
    return await get(`data/wow/recipe/${id}`, { namespace: 'static' });
}

export async function recipeMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/recipe/${id}`, { namespace: 'static' })
}

// =========
// Title API
// =========

interface Title extends IdName {
    gender_name: GenderName,
    source: {
        type: TypeName,
        achievements: IdName[]
    }
}

export async function titles(): Promise<IdName> {
    const { titles } = await get('data/wow/title/index', { namespace: 'static' })
    return titles
}

export async function title(id: number): Promise<Title> {
    return await get(`data/wow/title/${id}`, { namespace: 'static' })
}

// =============
// WoW Token API
// =============

interface WowToken {
    price: number,
    last_updated_timestamp: number
}

export async function wowToken(): Promise<WowToken> {
    return await get('data/wow/token/index', { namespace: 'dynamic' })
}
