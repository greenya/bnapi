// deno-lint-ignore-file camelcase

import { get } from './core.ts'

// Common

export interface IdName {
    id: number,
    name: string
}

export interface IdNameOpt {
    id: number,
    name?: string
}

export interface IdNameSlug {
    id: number,
    name: string,
    slug: string
}

export interface IdSlug {
    id: number,
    slug: string
}

export interface IdType {
    id: number,
    type: string
}

export interface IdTypeName {
    id: number,
    type: string,
    name: string
}

export interface IdMediaId {
    id: number,
    media: { id: number }
}

export interface IdRgba {
    id: number,
    rgba: RGBA
}

export interface TypeName {
    type: string,
    name: string
}

export interface GenderName {
    male: string,
    female: string
}

export interface Character {
    id: number,
    name: string,
    realm: IdSlug
}

export interface SpellTooltip {
    description: string,
    cast_time: string,
    range?: string,
    power_cost?: string,
    cooldown?: string
}

export interface SpellTooltipSpell extends SpellTooltip {
    spell: IdName
}

export interface SellPrice {
    value: number,
    display_strings: {
        header: string,
        gold: string,
        silver: string,
        copper: string
    }
}

export interface DisplayStringValue {
    display_string: string,
    value: number
}

export interface DisplayStringColor {
    display_string: string,
    color: RGBA
}

export interface DisplayValue {
    display: DisplayStringColor,
    value: number
}

export interface Media {
    id: number,
    assets: {
        key: string,
        value: string,
        file_data_id: number
    }[]
}

export interface RGBA {
    r: number,
    g: number,
    b: number,
    a: number
}

// ===============
// Achievement API
// ===============

export interface AchievementCategoryIndex {
    categories: IdName[],
    root_categories: IdName[],
    guild_categories: IdName[]
}

export interface AchievementCategory extends IdName {
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

export interface AchievementCriteria {
    id: number,
    description: string,
    amount: number,
    achievement?: IdName,
    child_criteria?: AchievementCriteria[],
    operator?: TypeName
}

export interface Achievement extends IdName {
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

// =================
// Auction House API
// =================

export interface AuctionItem {
    id: number,
    context?: number,
    bonus_lists?: number[],
    modifiers?: { type: number, value: number }[],
    pet_breed_id?: number,
    pet_level?: number,
    pet_quality_id?: number,
    pet_species_id?: number
}

export interface Auction {
    id: number,
    item: AuctionItem,
    bid?: number,
    buyout?: number,
    quantity: number,
    unit_price: number,
    time_left: string
}

export async function auctions(connectedRealmId: number): Promise<Auction[]> {
    const { auctions } = await get(`data/wow/connected-realm/${connectedRealmId}/auctions`, { namespace: 'dynamic' })
    return auctions
}

// ==========================
// Character Achievements API
// ==========================

export interface CharacterAchievementCriteria {
    id: number,
    amount?: number,
    is_completed: boolean,
    child_criteria?: CharacterAchievementCriteria[]
}

export interface CharacterAchievements {
    total_quantity: number,
    total_points: number,
    achievements: {
        id: number,
        achievement: IdName,
        criteria?: CharacterAchievementCriteria,
        completed_timestamp: number
    }[],
    category_progress: {
        category: IdName,
        quantity: number,
        points: number
    }[],
    recent_events: {
        achievement: IdName,
        timestamp: number
    }[]
}

export interface CharacterAchievementStatisticCategoryStat extends IdName {
    last_updated_timestamp: number,
    description?: string,
    quantity: number
}

export interface CharacterAchievementStatisticCategory extends IdName {
    sub_categories?: CharacterAchievementStatisticCategory[],
    statistics: CharacterAchievementStatisticCategoryStat[]
}

export async function characterAchievements(realmSlug: string, characterName: string): Promise<CharacterAchievements> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/achievements`, { namespace: 'profile' })
}

export async function characterAchievementStatistics(realmSlug: string, characterName: string): Promise<CharacterAchievementStatisticCategory[]> {
    const { categories } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/achievements/statistics`, { namespace: 'profile' })
    return categories
}

// ========================
// Character Appearance API
// ========================

export interface CharacterAppearance {
    playable_race: IdName,
    playable_class: IdName,
    active_spec: IdName,
    gender: TypeName,
    faction: TypeName,
    guild_crest: GuildCrest,
    items: {
        id: number,
        slot: TypeName,
        enchant: number,
        item_appearance_modifier_id: number,
        internal_slot_id: number,
        subclass: number
    }[],
    customizations: {
        option: IdName,
        choice: { id: number, name?: string, display_order: number }
    }[]
}

export async function characterAppearance(realmSlug: string, characterName: string): Promise<CharacterAppearance> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/appearance`, { namespace: 'profile' })
}

// =========================
// Character Collections API
// =========================

export interface CharacterCollectionMount {
    mount: IdName,
    is_useable: boolean,
    is_favorite?: boolean
}

export interface CharacterCollectionPet {
    species: IdName,
    level: number,
    quality: TypeName,
    stats: {
        breed_id: number,
        health: number,
        power: number,
        speed: number
    },
    creature_display?: { id: number },
    id: number
}

export async function characterMounts(realmSlug: string, characterName: string): Promise<CharacterCollectionMount[]> {
    const { mounts } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/collections/mounts`, { namespace: 'profile' })
    return mounts
}

export async function characterPets(realmSlug: string, characterName: string): Promise<CharacterCollectionPet[]> {
    const { pets } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/collections/pets`, { namespace: 'profile' })
    return pets
}

// ========================
// Character Encounters API
// ========================

export interface CharacterEncounterExpansion {
    expansion: IdName,
    instances: {
        instance: IdName,
        modes: {
            difficulty: TypeName,
            status: TypeName,
            progress: {
                completed_count: number,
                total_count: number,
                encounters: {
                    encounter: IdName,
                    completed_count: number,
                    last_kill_timestamp: number
                }[]
            }
        }[]
    }[]
}

export async function characterDungeons(realmSlug: string, characterName: string): Promise<CharacterEncounterExpansion[]> {
    const { expansions } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/encounters/dungeons`, { namespace: 'profile' })
    return expansions
}

export async function characterRaids(realmSlug: string, characterName: string): Promise<CharacterEncounterExpansion[]> {
    const { expansions } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/encounters/raids`, { namespace: 'profile' })
    return expansions
}

// =======================
// Character Equipment API
// =======================

export interface CharacterEquippedItem {
    item: { id: number },
    enchantments?: {
        display_string: string,
        source_item: IdName,
        enchantment_id: number,
        enchantment_slot: IdType
    }[],
    sockets?: {
        socket_type: TypeName,
        item: IdName,
        display_string: string,
        media: { id: number }
    }[],
    slot: TypeName,
    quantity: number,
    context: number,
    bonus_list?: number[],
    timewalker_level?: number,
    quality: TypeName,
    name: string,
    modified_appearance_id?: number,
    media: { id: number },
    item_class: IdName,
    item_subclass: IdName,
    inventory_type: TypeName,
    binding: TypeName,
    unique_equipped?: string,
    limit_category?: string,
    weapon?: {
        damage: {
            min_value: number,
            max_value: number,
            display_string: string,
            damage_class: TypeName
        },
        attack_speed: DisplayStringValue,
        dps: DisplayStringValue
    },
    armor?: DisplayValue,
    shield_block?: DisplayValue,
    stats?: {
        type: TypeName,
        value: number,
        is_negated?: boolean,
        is_equip_bonus?: boolean,
        display: DisplayStringColor
    }[],
    spells?: {
        spell: IdName,
        description: string
    }[],
    upgrades?: {
        value: number,
        max_value: number,
        display_string: string
    },
    sell_price?: SellPrice,
    requirements: {
        level?: { display_string: string },
        playable_races?: { display_string: string, links: IdName[] },
        faction?: { display_string: string, value: TypeName }
    },
    description?: string,
    level: DisplayStringValue,
    transmog?: {
        item: IdName,
        display_string: string,
        item_modified_appearance_id: number
    },
    is_subclass_hidden?: boolean,
    durability?: DisplayStringValue,
    name_description?: DisplayStringColor
}

export async function characterEquipment(realmSlug: string, characterName: string): Promise<CharacterEquippedItem[]> {
    const { equipped_items } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/equipment`, { namespace: 'profile' })
    return equipped_items
}

// =========================
// Character Hunter Pets API
// =========================

export interface CharacterHunterPet {
    name: string,
    level: number,
    slot: number,
    creature: IdName,
    creature_display: { id: number },
    is_active?: boolean
}

/**
 * If the character is a hunter, returns a summary of the character's hunter pets. Otherwise, returns an HTTP 404 Not Found error.
 */
export async function characterHunterPets(realmSlug: string, characterName: string): Promise<CharacterHunterPet[]> {
    const { hunter_pets } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/hunter-pets`, { namespace: 'profile' })
    return hunter_pets
}

// ===================
// Character Media API
// ===================

export interface CharacterMediaAsset {
    key: string,
    value: string
}

export async function characterMediaAssets(realmSlug: string, characterName: string): Promise<CharacterMediaAsset[]> {
    const { assets } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/character-media`, { namespace: 'profile' })
    return assets
}

// =====================================
// Character Mythic Keystone Profile API
// =====================================

export interface CharacterMythicKeystoneProfile {
    current_period: {
        period: { id: number }
    },
    seasons: {
        id: number
    }[]
}

export interface CharacterMythicKeystoneRun {
    completed_timestamp: number,
    duration: number,
    keystone_level: number,
    keystone_affixes: IdName[],
    members: {
        character: Character,
        specialization: IdName,
        race: IdName,
        equipped_item_level: number
    }[],
    dungeon: IdName,
    is_completed_within_time: boolean
}

export async function characterMythicKeystoneProfile(realmSlug: string, characterName: string): Promise<CharacterMythicKeystoneProfile> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/mythic-keystone-profile`, { namespace: 'profile' })
}

/**
 * Returns the Mythic Keystone season details for a character.
 *
 * Returns a 404 Not Found for characters that have not yet completed a Mythic Keystone dungeon for the specified season.
 */
export async function characterMythicKeystoneSeasonBestRuns(realmSlug: string, characterName: string, season: number): Promise<CharacterMythicKeystoneRun[]> {
    const { best_runs } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/mythic-keystone-profile/season/${season}`, { namespace: 'profile' })
    return best_runs
}

// =========================
// Character Professions API
// =========================

export interface CharacterProfessionTier {
    tier: IdName,
    skill_points: number,
    max_skill_points: number,
    known_recipes?: IdName[]
}

export interface CharacterProfession {
    profession: IdName,
    tiers?: CharacterProfessionTier[],
    skill_points?: number,
    max_skill_points?: number
}

export interface CharacterProfessionsIndex {
    primaries?: CharacterProfession[],
    secondaries?: CharacterProfession[]
}

export async function characterProfessions(realmSlug: string, characterName: string): Promise<CharacterProfessionsIndex> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/professions`, { namespace: 'profile' })
}

// =====================
// Character Profile API
// =====================

export interface CharacterProfile extends IdName {
    gender: TypeName,
    faction: TypeName,
    race: IdName,
    character_class: IdName,
    active_spec: IdName,
    realm: IdNameSlug,
    guild: {
        id: number,
        name: string,
        faction: TypeName,
        realm: IdNameSlug
    },
    level: number,
    experience: number,
    achievement_points: number,
    last_login_timestamp: number,
    average_item_level: number,
    equipped_item_level: number,
    active_title?: {
        id: number,
        name: string,
        display_string: string
    },
    covenant_progress?: {
        chosen_covenant: IdName,
        renown_level: number
    }
}

export interface CharacterProfileStatus {
    id: number,
    is_valid: boolean
}

export async function characterProfile(realmSlug: string, characterName: string): Promise<CharacterProfile> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}`, { namespace: 'profile' })
}

/**
 * Returns the status and a unique ID for a character.
 *
 * A client should delete information about a character from their application if any of the following conditions occur:
 * - an HTTP 404 Not Found error is returned
 * - the is_valid value is false
 * - the returned character ID doesn't match the previously recorded value for the character
 *
 * The following example illustrates how to use this endpoint:
 * 1. A client requests and stores information about a character, including its unique character ID and the timestamp of the request.
 * 2. After 30 days, the client makes a request to the status endpoint to verify if the character information is still valid.
 * 3. If character cannot be found, is not valid, or the characters IDs do not match, the client removes the information from their application.
 * 4. If the character is valid and the character IDs match, the client retains the data for another 30 days.
 */
export async function characterProfileStatus(realmSlug: string, characterName: string): Promise<CharacterProfileStatus> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/status`, { namespace: 'profile' })
}

// =================
// Character PvP API
// =================

export interface PlayedWonLost {
    played: number,
    won: number,
    lost: number
}

export interface CharacterPvpSummary {
    honor_level: number,
    pvp_map_statistics: {
        world_map: IdName,
        match_statistics: PlayedWonLost
    }[],
    honorable_kills: number
}

export interface CharacterPvpBracket {
    faction: TypeName,
    bracket: IdName,
    rating: number,
    season: { id: number },
    tier: { id: number },
    season_match_statistics: PlayedWonLost,
    weekly_match_statistics: PlayedWonLost
}

export async function characterPvpSummary(realmSlug: string, characterName: string): Promise<CharacterPvpSummary> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-summary`, { namespace: 'profile' })
}

export async function characterPvpBracket(realmSlug: string, characterName: string, bracket: string): Promise<CharacterPvpBracket> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-bracket/${bracket}`, { namespace: 'profile' })
}

// ====================
// Character Quests API
// ====================

export async function characterQuestsInProgress(realmSlug: string, characterName: string): Promise<IdName[]> {
    const { in_progress } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/quests`, { namespace: 'profile' })
    return in_progress
}

export async function characterQuestsCompleted(realmSlug: string, characterName: string): Promise<IdName[]> {
    const { quests } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/quests/completed`, { namespace: 'profile' })
    return quests
}

// =========================
// Character Reputations API
// =========================

export interface CharacterReputation {
    faction: IdName,
    standing: {
        raw: number,
        value: number,
        max: number,
        tier: number,
        name: string
    },
    paragon?: {
        raw: number,
        value: number,
        max: number
    }
}

export async function characterReputations(realmSlug: string, characterName: string): Promise<CharacterReputation[]> {
    const { reputations } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/reputations`, { namespace: 'profile' })
    return reputations
}

// =======================
// Character Soulbinds API
// =======================

export interface CharacterSoulbind {
    soulbind: IdName,
    traits?: {
        trait?: IdName,
        conduit_socket?: {
            type: TypeName,
            socket: {
                conduit: IdName,
                rank: number
            }
        },
        tier: number,
        display_order: number
    }[],
    is_active?: boolean
}

export async function characterSoulbinds(realmSlug: string, characterName: string): Promise<CharacterSoulbind[]> {
    const { soulbinds } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/soulbinds`, { namespace: 'profile' })
    return soulbinds
}

// =============================
// Character Specializations API
// =============================

export interface CharacterSpecialization {
    specialization: IdName,
    talents?: {
        talent: IdName,
        spell_tooltip: SpellTooltipSpell,
        tier_index: number,
        column_index: number
    }[],
    pvp_talent_slots?: {
        selected: {
            talent: IdName,
            spell_tooltip: SpellTooltipSpell
        },
        slot_number: number
    }[]
}

export async function characterSpecializations(realmSlug: string, characterName: string): Promise<CharacterSpecialization[]> {
    const { specializations } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/specializations`, { namespace: 'profile' })
    return specializations
}

// ========================
// Character Statistics API
// ========================

export interface CharacterStatistics {
    health: number,
    power: number,
    power_type: IdName,
    speed: { rating: number, rating_bonus: number },
    strength: { base: number, effective: number },
    agility: { base: number, effective: number },
    intellect: { base: number, effective: number },
    stamina: { base: number, effective: number },
    melee_crit: { rating: number, rating_bonus: number, value: number },
    melee_haste: { rating: number, rating_bonus: number, value: number },
    mastery: { rating: number, rating_bonus: number, value: number },
    bonus_armor: number,
    lifesteal: { rating: number, rating_bonus: number, value: number },
    versatility: number,
    versatility_damage_done_bonus: number,
    versatility_healing_done_bonus: number,
    versatility_damage_taken_bonus: number,
    avoidance: { rating: number, rating_bonus: number },
    attack_power: number,
    main_hand_damage_min: number,
    main_hand_damage_max: number,
    main_hand_speed: number,
    main_hand_dps: number,
    off_hand_damage_min: number,
    off_hand_damage_max: number,
    off_hand_speed: number,
    off_hand_dps: number,
    spell_power: number,
    spell_penetration: number,
    spell_crit: { rating: number, rating_bonus: number, value: number },
    mana_regen: number,
    mana_regen_combat: number,
    armor: { base: number, effective: number },
    dodge: { rating: number, rating_bonus: number, value: number },
    parry: { rating: number, rating_bonus: number, value: number },
    block: { rating: number, rating_bonus: number, value: number },
    ranged_crit: { rating: number, rating_bonus: number, value: number },
    ranged_haste: { rating: number, rating_bonus: number, value: number },
    spell_haste: { rating: number, rating_bonus: number, value: number },
}

export async function characterStatistics(realmSlug: string, characterName: string): Promise<CharacterStatistics> {
    return await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/statistics`, { namespace: 'profile' })
}

// ====================
// Character Titles API
// ====================

export async function characterTitles(realmSlug: string, characterName: string): Promise<IdName[]> {
    const { titles } = await get(`profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/titles`, { namespace: 'profile' })
    return titles
}

// ===================
// Connected Realm API
// ===================

export interface ConnectedRealmRef {
    id: number
}

export interface Realm extends IdNameSlug {
    region: IdName,
    connected_realm: ConnectedRealmRef,
    category: string,
    locale: string,
    timezone: string,
    type: TypeName,
    is_tournament: boolean
}

export interface ConnectedRealm {
    id: number,
    has_queue: boolean,
    status: TypeName,
    population: TypeName,
    realms: Realm[]
}

// Blizzard returns only "href" prop for "connected realm" object, but expect an id when we request specific connected realm,
// so we parse id and return object which has parsed "id" and original "href"
// Note: "id" gets -1 in case of parsing failure

// deno-lint-ignore no-explicit-any
function connectedRealmRefFromRef(ref: any): ConnectedRealmRef {
    ref.id = parseInt((ref.href.match(/connected-realm\/(\d+)/) || { 1: '-1' })[1])
    return ref
}

export async function connectedRealms(): Promise<ConnectedRealmRef[]> {
    const { connected_realms } = await get('data/wow/connected-realm/index', { namespace: 'dynamic' })
    // deno-lint-ignore no-explicit-any
    return connected_realms.map((e: any) => connectedRealmRefFromRef(e))
}

export async function connectedRealm(id: number): Promise<ConnectedRealm> {
    const result: ConnectedRealm = await get(`data/wow/connected-realm/${id}`, { namespace: 'dynamic' })
    result.realms.forEach(e => connectedRealmRefFromRef(e.connected_realm))
    return result
}

// =========
// Guild API
// =========

export interface GuildCrest {
    emblem: {
        id: number,
        media: { id: number },
        color: { id: number, rgba: RGBA }
    },
    border: {
        id: number,
        media: { id: number },
        color: { id: number, rgba: RGBA }
    },
    background: { id: number, rgba: RGBA }
}

export interface Guild extends IdName {
    faction: TypeName,
    created_timestamp: number,
    achievement_points: number,
    member_count: number,
    realm: IdNameSlug,
    crest: GuildCrest
}

export interface GuildActivity {
    timestamp: number,
    activity: { type: string },
    character_achievement?: {
        character: { id: number, name: string, realm: IdNameSlug },
        achievement: IdName
    },
    encounter_completed?: {
        encounter: IdName,
        mode: TypeName
    }
}

export interface GuildAchievementCriteria {
    id: number,
    amount?: number,
    is_completed: boolean,
    child_criteria?: GuildAchievementCriteria[]
}

export interface GuildAchievements {
    total_quantity: number,
    total_points: number,
    achievements: {
        id: number,
        achievement: IdName,
        criteria: GuildAchievementCriteria,
        completed_timestamp: number
    }[],
    category_progress: {
        category: IdName,
        quantity: number,
        points: number
    }[],
    recent_events: {
        timestamp: number,
        achievement: IdName
    }[]
}

export interface GuildMemberCharacter extends Character {
    level: number,
    playable_class: { id: number },
    playable_race: { id: number }
}

export interface GuildMember {
    character: GuildMemberCharacter,
    rank: number
}

export async function guild(realmSlug: string, nameSlug: string): Promise<Guild> {
    return await get(`data/wow/guild/${realmSlug}/${nameSlug}`, { namespace: 'profile' })
}

export async function guildActivity(realmSlug: string, nameSlug: string): Promise<GuildActivity[]> {
    const { activities } = await get(`data/wow/guild/${realmSlug}/${nameSlug}/activity`, { namespace: 'profile' })
    return activities
}

export async function guildAchievements(realmSlug: string, nameSlug: string): Promise<GuildAchievements> {
    return await get(`data/wow/guild/${realmSlug}/${nameSlug}/achievements`, { namespace: 'profile' })
}

export async function guildRoster(realmSlug: string, nameSlug: string): Promise<GuildMember[]> {
    const { members } = await get(`data/wow/guild/${realmSlug}/${nameSlug}/roster`, { namespace: 'profile' })
    return members
}

// ===============
// Guild Crest API
// ===============

export interface GuildCrestComponents {
    emblems: IdMediaId[],
    borders: IdMediaId[],
    colors: {
        emblems: IdRgba[],
        borders: IdRgba[],
        backgrounds: IdRgba[]
    }
}

export async function guildCrestComponents(): Promise<GuildCrestComponents> {
    return await get(`data/wow/guild-crest/index`, { namespace: 'static' })
}

export async function guildCrestBorderMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/guild-crest/border/${id}`, { namespace: 'static' })
}

export async function guildCrestEmblemMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/guild-crest/emblem/${id}`, { namespace: 'static' })
}

// ========
// Item API
// ========

export interface ItemClass {
    class_id: number,
    name: string,
    item_subclasses: IdName[]
}

export interface ItemSubclass {
    class_id: number,
    subclass_id: number,
    display_name: string,
    verbose_name: string
}

export interface ItemSetEffect {
    display_string: string,
    required_count: number
}

export interface ItemSet extends IdName {
    items: IdName[],
    effects: ItemSetEffect[],
    is_effect_active?: boolean
}

export interface PreviewItem {
    context?: number,
    item: { id: number },
    quality: TypeName,
    name: string,
    media: { id: number },
    item_class: IdName,
    item_subclass: IdName,
    inventory_type: TypeName,
    binding?: TypeName,
    armor?: DisplayValue
    bonus_list?: number[],
    stats?: {
        type: TypeName,
        value: number,
        is_negated?: boolean,
        is_equip_bonus?: boolean,
        display: DisplayStringColor
    }[],
    spells?: {
        spell: IdName,
        description: string
    }[],
    requirements?: {
        level: DisplayStringValue,
        playable_classes: { display_string: string },
        faction?: { display_string: string, value: TypeName }
    },
    set?: {
        item_set: IdName,
        items: IdName[],
        effects: ItemSetEffect[],
        legacy: string,
        display_string: string
    },
    level?: DisplayStringValue,
    sell_price?: SellPrice,
    unique_equipped?: string,
    description?: string,
    is_subclass_hidden: boolean,
    crafting_reagent?: string
}

export interface Item extends IdName {
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

export interface JournalExpansion extends IdName {
    dungeons: IdName[],
    raids: IdName[]
}

export interface JournalEncounterSection {
    id: number,
    title: string,
    body_text?: string,
    creature_display?: { id: number },
    sections?: JournalEncounterSection[],
    spell?: IdName
}

export interface JournalEncounter extends IdName {
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

export interface JournalInstance extends IdName {
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

// =========
// Mount API
// =========

export interface Mount extends IdName {
    creature_displays: { id: number }[],
    description: string,
    source: TypeName,
    faction?: TypeName,
    requirements?: { faction: TypeName },
    should_exclude_if_uncollected?: boolean
}

export async function mounts(): Promise<IdName[]> {
    const { mounts } = await get('data/wow/mount/index', { namespace: 'static' })
    return mounts
}

export async function mount(id: number): Promise<Mount> {
    return await get(`data/wow/mount/${id}`, { namespace: 'static' })
}

// =========================
// Mythic Keystone Affix API
// =========================

export interface MythicKeystoneAffix extends IdName {
    description: string,
    media: { id: number }
}

export async function mythicKeystoneAffixes(): Promise<IdName[]> {
    const { affixes } = await get('data/wow/keystone-affix/index', { namespace: 'static' })
    return affixes
}

export async function mythicKeystoneAffix(id: number): Promise<MythicKeystoneAffix> {
    return await get(`data/wow/keystone-affix/${id}`, { namespace: 'static' })
}

export async function mythicKeystoneAffixMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/keystone-affix/${id}`, { namespace: 'static' })
}

// ===========================
// Mythic Keystone Dungeon API
// ===========================

export interface MythicKeystoneDungeon extends IdName {
    map: IdName,
    zone: { slug: string },
    dungeon: IdName,
    keystone_upgrades: {
        upgrade_level: number,
        qualifying_duration: number
    }[]
}

export interface MythicKeystonePeriodIndex {
    periods: { id: number }[],
    current_period: { id: number }
}

export interface MythicKeystonePeriod {
    id: number,
    start_timestamp: number,
    end_timestamp: number
}

export interface MythicKeystoneSeasonIndex {
    seasons: { id: number }[],
    current_season: { id: number }
}

export interface MythicKeystoneSeason {
    id: number,
    start_timestamp: number,
    end_timestamp?: number,
    periods: { id: number }[]
}

export async function mythicKeystoneDungeons(): Promise<IdName[]> {
    const { dungeons } = await get('data/wow/mythic-keystone/dungeon/index', { namespace: 'dynamic' })
    return dungeons
}

export async function mythicKeystoneDungeon(id: number): Promise<MythicKeystoneDungeon> {
    return await get(`data/wow/mythic-keystone/dungeon/${id}`, { namespace: 'dynamic' })
}

export async function mythicKeystonePeriods(): Promise<MythicKeystonePeriodIndex> {
    return await get('data/wow/mythic-keystone/period/index', { namespace: 'dynamic' })
}

export async function mythicKeystonePeriod(id: number): Promise<MythicKeystonePeriod> {
    return await get(`data/wow/mythic-keystone/period/${id}`, { namespace: 'dynamic' })
}

export async function mythicKeystoneSeasons(): Promise<MythicKeystoneSeasonIndex> {
    return await get('data/wow/mythic-keystone/season/index', { namespace: 'dynamic' })
}

export async function mythicKeystoneSeason(id: number): Promise<MythicKeystoneSeason> {
    return await get(`data/wow/mythic-keystone/season/${id}`, { namespace: 'dynamic' })
}

// ===============================
// Mythic Keystone Leaderboard API
// ===============================

export interface MythicKeystoneLeaderboardRef extends IdName {
    period: number
}

export interface MythicKeystoneLeaderboard {
    map_challenge_mode_id: number,
    map: IdName,
    name: string,
    period: number,
    period_start_timestamp: number,
    period_end_timestamp: number,
    connected_realm: ConnectedRealmRef,
    keystone_affixes: {
        keystone_affix: IdName,
        starting_level: number
    }[],
    leading_groups: {
        ranking: number,
        duration: number,
        completed_timestamp: number,
        keystone_level: number,
        members: {
            profile: Character,
            faction: { type: string },
            specialization: { id: number }
        }[]
    }[]
}

// Blizzard returns "key" with "href" prop (which has "period" if parsed, which is what we do below)
// Note: "period" gets -1 in case of parsing failure

// deno-lint-ignore no-explicit-any
function mythicKeystoneLeaderboardRefFromRef(ref: any): MythicKeystoneLeaderboardRef {
    ref.period = parseInt((ref.key.href.match(/period\/(\d+)/) || { 1: '-1' })[1])
    return ref
}

export async function mythicKeystoneLeaderboards(connectedRealmId: number): Promise<MythicKeystoneLeaderboardRef[]> {
    const { current_leaderboards } = await get(`data/wow/connected-realm/${connectedRealmId}/mythic-leaderboard/index`, { namespace: 'dynamic' })
    // deno-lint-ignore no-explicit-any
    return current_leaderboards.map((e: any) => mythicKeystoneLeaderboardRefFromRef(e))
}

export async function mythicKeystoneLeaderboard(connectedRealmId: number, dungeonId: number, period: number): Promise<MythicKeystoneLeaderboard> {
    const result = await get(`data/wow/connected-realm/${connectedRealmId}/mythic-leaderboard/${dungeonId}/period/${period}`, { namespace: 'dynamic' })
    connectedRealmRefFromRef(result.connected_realm)
    return result
}

// ===========================
// Mythic Raid Leaderboard API
// ===========================

export interface MythicRaidLeaderboardEntry {
    guild: {
        id: number,
        name: string,
        realm: IdSlug
    },
    faction: { type: string },
    timestamp: number,
    region: string,
    rank: number
}

export async function mythicRaidLeaderboard(raid: string, faction: string): Promise<MythicRaidLeaderboardEntry[]> {
    const { entries } = await get(`data/wow/leaderboard/hall-of-fame/${raid}/${faction}`, { namespace: 'dynamic' })
    return entries
}

// =======
// Pet API
// =======

export interface Pet extends IdName {
    battle_pet_type: IdTypeName,
    description: string,
    is_capturable: boolean,
    is_tradable: boolean,
    is_battlepet: boolean,
    is_alliance_only: boolean,
    is_horde_only: boolean,
    abilities: {
        ability: IdName,
        slot: number,
        required_level: number
    }[],
    source: TypeName,
    icon: string,
    creature: IdName,
    is_random_creature_display: boolean,
    media: { id: number }
}

export interface PetAbility extends IdName {
    battle_pet_type: IdTypeName,
    cooldown?: number,
    rounds: number,
    media: { id: number }
}

export async function pets(): Promise<IdName[]> {
    const { pets } = await get('data/wow/pet/index', { namespace: 'static' })
    return pets
}

export async function pet(id: number): Promise<Pet> {
    return await get(`data/wow/pet/${id}`, { namespace: 'static' })
}

export async function petMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/pet/${id}`, { namespace: 'static' })
}

export async function petAbilities(): Promise<IdName[]> {
    const { abilities } = await get('data/wow/pet-ability/index', { namespace: 'static' })
    return abilities
}

export async function petAbility(id: number): Promise<PetAbility> {
    return await get(`data/wow/pet-ability/${id}`, { namespace: 'static' })
}

export async function petAbilityMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/pet-ability/${id}`, { namespace: 'static' })
}

// ==================
// Playable Class API
// ==================

export interface PlayableClass extends IdName {
    gender_name: GenderName,
    power_type: IdName,
    specializations: IdName[],
    media: { id: number }
}

export interface PlayableClassPvpTalentSlot {
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

export interface PlayableRace extends IdName {
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

export interface PlayableSpecializationIndex {
    character_specializations: IdName[],
    pet_specializations: IdName[]
}

export interface PlayableSpecialization extends IdName {
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

export interface Profession extends IdName {
    description: string,
    type: TypeName,
    skill_tiers?: IdName[],
    media: { id: number }
}

export interface ProfessionSkillTier extends IdName {
    minimum_skill_level: number,
    maximum_skill_level: number,
    categories?: {
        name: string,
        recipes: IdName[]
    }[]
}

export interface Recipe extends IdName {
    description?: string,
    alliance_crafted_item?: IdName,
    horde_crafted_item?: IdName,
    crafted_item?: IdName,
    crafted_quantity: {
        value?: number
        minimum?: number,
        maximum?: number
    },
    reagents: {
        reagent: IdName,
        quantity: number
    }[],
    modified_crafting_slots: {
        slot_type: IdName,
        display_order: number
    }[],
    rank?: number,
    media: { id: number }
}

export async function professions(): Promise<IdName[]> {
    const { professions } = await get('data/wow/profession/index', { namespace: 'static' })
    return professions
}

export async function profession(id: number): Promise<Profession> {
    return await get(`data/wow/profession/${id}`, { namespace: 'static' })
}

export async function professionMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/profession/${id}`, { namespace: 'static' })
}

export async function professionSkillTier(id: number, skillTierId: number): Promise<ProfessionSkillTier> {
    return await get(`data/wow/profession/${id}/skill-tier/${skillTierId}`, { namespace: 'static' })
}

export async function recipe(id: number): Promise<Recipe> {
    return await get(`data/wow/recipe/${id}`, { namespace: 'static' })
}

export async function recipeMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/recipe/${id}`, { namespace: 'static' })
}

// =========
// Quest API
// =========

export interface QuestRequirementQuestCondition {
    target?: IdName,
    operator?: TypeName,
    conditions?: QuestRequirementQuestCondition[]
}

export interface Quest {
    id: number,
    title: string,
    description: string,
    area: IdName,
    category?: IdName,
    requirements: {
        min_character_level: number,
        max_character_level: number,
        classes?: IdName[],
        faction?: TypeName,
        quests?: QuestRequirementQuestCondition
    },
    rewards: {
        experience?: number,
        reputations?: {
            reward: IdName,
            value: number
        }[],
        items?: {
            items: { item: IdName }[]
        },
        money?: {
            value: number,
            units: { gold: number, silver: number, copper: number }
        },
        spell?: IdName
    }
}

export interface QuestCategory {
    id: number,
    category: string,
    quests: IdName[]
}

export interface QuestArea {
    id: number,
    area: string,
    quests: IdName[]
}

export interface QuestType {
    id: number,
    type: string,
    quests: IdName[]
}

export async function quest(id: number): Promise<Quest> {
    return await get(`data/wow/quest/${id}`, { namespace: 'static' })
}

export async function questCategories(): Promise<IdName[]> {
    const { categories } = await get('data/wow/quest/category/index', { namespace: 'static' })
    return categories
}

export async function questCategory(id: number): Promise<QuestCategory> {
    return await get(`data/wow/quest/category/${id}`, { namespace: 'static' })
}

export async function questAreas(): Promise<IdName[]> {
    const { areas } = await get('data/wow/quest/area/index', { namespace: 'static' })
    return areas
}

export async function questArea(id: number): Promise<QuestArea> {
    return await get(`data/wow/quest/area/${id}`, { namespace: 'static' })
}

export async function questTypes(): Promise<IdName[]> {
    const { types } = await get('data/wow/quest/type/index', { namespace: 'static' })
    return types
}

export async function questType(id: number): Promise<QuestType> {
    return await get(`data/wow/quest/type/${id}`, { namespace: 'static' })
}

// =========
// Realm API
// =========

export async function realms(): Promise<IdNameSlug[]> {
    const { realms } = await get('data/wow/realm/index', { namespace: 'dynamic' })
    return realms
}

export async function realm(slug: string): Promise<Realm> {
    const result: Realm = await get(`data/wow/realm/${slug}`, { namespace: 'dynamic' })
    result.connected_realm = connectedRealmRefFromRef(result.connected_realm)
    return result
}

// ==========
// Region API
// ==========

export interface RegionRef {
    id: number
}

export interface Region extends IdName {
    tag: string
}

// deno-lint-ignore no-explicit-any
function regionRefFromRef(ref: any): RegionRef {
    ref.id = parseInt((ref.href.match(/region\/(\d+)/) || { 1: '-1' })[1])
    return ref
}

export async function regions(): Promise<RegionRef[]> {
    const { regions } = await get('data/wow/region/index', { namespace: 'dynamic' })
    // deno-lint-ignore no-explicit-any
    regions.forEach((e: any) => regionRefFromRef(e))
    return regions
}

export async function region(id: number): Promise<Region> {
    return await get(`data/wow/region/${id}`, { namespace: 'dynamic' })
}

// ===============
// Reputations API
// ===============

export interface ReputationFactionIndex {
    factions: IdName[],
    root_factions: IdName[]
}

export interface ReputationFaction extends IdName {
    reputation_tiers: { id: number },
    description?: string,
    can_paragon?: boolean,
    factions?: IdName[],
    is_header?: boolean
}

export interface ReputationTier extends IdName {
    min_value: number,
    max_value: number
}

export interface ReputationTiers {
    id: number,
    tiers: ReputationTier[],
    faction?: IdName
}

export async function reputationFactions(): Promise<ReputationFactionIndex> {
    return await get('data/wow/reputation-faction/index', { namespace: 'static' })
}

export async function reputationFaction(id: number): Promise<ReputationFaction> {
    return await get(`data/wow/reputation-faction/${id}`, { namespace: 'static' })
}

export async function reputationTiersList(): Promise<IdNameOpt[]> {
    const { reputation_tiers } = await get('data/wow/reputation-tiers/index', { namespace: 'static' })
    return reputation_tiers
}

export async function reputationTiers(id: number): Promise<ReputationTiers> {
    return await get(`data/wow/reputation-tiers/${id}`, { namespace: 'static' })
}

// =========
// Spell API
// =========

export interface Spell extends IdName {
    description: string,
    media: { id: number }
}

export async function spell(id: number): Promise<Spell> {
    return await get(`data/wow/spell/${id}`, { namespace: 'static' })
}

export async function spellMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/spell/${id}`, { namespace: 'static' })
}

// ==========
// Talent API
// ==========

export interface Talent {
    id: number,
    tier_index: number,
    column_index: number,
    level: number,
    description: string,
    spell: IdName,
    playable_class: IdName
}

export interface PvpTalent {
    id: number,
    spell: IdName,
    playable_specialization: IdName,
    description: string,
    unlock_player_level: number,
    compatible_slots: number[]
}

export async function talents(): Promise<IdName[]> {
    const { talents } = await get('data/wow/talent/index', { namespace: 'static' })
    return talents
}

export async function talent(id: number): Promise<Talent> {
    return await get(`data/wow/talent/${id}`, { namespace: 'static' })
}

export async function pvpTalents(): Promise<IdName[]> {
    const { pvp_talents } = await get('data/wow/pvp-talent/index', { namespace: 'static' })
    return pvp_talents
}

export async function pvpTalent(id: number): Promise<PvpTalent> {
    return await get(`data/wow/pvp-talent/${id}`, { namespace: 'static' })
}

// ===============
// Tech Talent API
// ===============

export interface TechTalentTree {
    id: number,
    max_tiers: number,
    talents: { id: number }[]
}

export interface TechTalent extends IdName {
    talent_tree: IdName,
    description: string,
    spell_tooltip: SpellTooltipSpell,
    tier: number,
    display_order: number,
    media: { id: number }
}

export async function techTalentTrees(): Promise<IdName[]> {
    const { talent_trees } = await get('data/wow/tech-talent-tree/index', { namespace: 'static' })
    return talent_trees
}

export async function techTalentTree(id: number): Promise<TechTalentTree> {
    return await get(`data/wow/tech-talent-tree/${id}`, { namespace: 'static' })
}

export async function techTalents(): Promise<IdName[]> {
    const { talents } = await get('data/wow/tech-talent/index', { namespace: 'static' })
    return talents
}

export async function techTalent(id: number): Promise<TechTalent> {
    return await get(`data/wow/tech-talent/${id}`, { namespace: 'static' })
}

export async function techTalentMedia(id: number): Promise<Media> {
    return await get(`data/wow/media/tech-talent/${id}`, { namespace: 'static' })
}

// =========
// Title API
// =========

export interface Title extends IdName {
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

export interface WowToken {
    price: number,
    last_updated_timestamp: number
}

export async function wowToken(): Promise<WowToken> {
    return await get('data/wow/token/index', { namespace: 'dynamic' })
}
