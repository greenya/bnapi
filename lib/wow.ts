// deno-lint-ignore-file camelcase

import { get } from './core.ts'

// Common

interface IdName {
    id: number,
    name: string
}

interface IdNameOpt {
    id: number,
    name?: string
}

interface IdNameSlug {
    id: number,
    name: string,
    slug: string
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

interface RGBA {
    r: number,
    g: number,
    b: number,
    a: number
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

// =================
// Auction House API
// =================

interface AuctionItem {
    id: number,
    context?: number,
    bonus_lists?: number[],
    modifiers?: { type: number, value: number }[],
    pet_breed_id?: number,
    pet_level?: number,
    pet_quality_id?: number,
    pet_species_id?: number
}

interface Auction {
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

// =====================
// Character Profile API
// =====================

interface CharacterProfile extends IdName {
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
    active_title: {
        id: number,
        name: string,
        display_string: string
    },
    covenant_progress: {
        chosen_covenant: IdName,
        renown_level: number
    }
}

interface CharacterProfileStatus {
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

// =========================
// Character Reputations API
// =========================

interface CharacterReputation {
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

interface ConnectedRealmRef {
    id: number
}

interface Realm extends IdNameSlug {
    region: IdName,
    connected_realm: ConnectedRealmRef,
    category: string,
    locale: string,
    timezone: string,
    type: TypeName,
    is_tournament: boolean
}

interface ConnectedRealm {
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

interface GuildCrest {
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

interface Guild extends IdName {
    faction: TypeName,
    created_timestamp: number,
    achievement_points: number,
    member_count: number,
    realm: IdNameSlug,
    crest: GuildCrest
}

interface GuildActivity {
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

interface GuildAchievementCriteria {
    id: number,
    amount?: number,
    is_completed: boolean,
    child_criteria?: GuildAchievementCriteria[]
}

interface GuildAchievements {
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

interface GuildMember {
    character: {
        id: number,
        name: string,
        realm: { id: number, slug: string },
        level: number,
        playable_class: { id: number },
        playable_race: { id: number }
    },
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
    color: RGBA
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

// =========================
// Mythic Keystone Affix API
// =========================

interface MythicKeystoneAffix extends IdName {
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

interface MythicKeystoneDungeon extends IdName {
    map: IdName,
    zone: { slug: string },
    dungeon: IdName,
    keystone_upgrades: {
        upgrade_level: number,
        qualifying_duration: number
    }[]
}

interface MythicKeystonePeriodIndex {
    periods: { id: number }[],
    current_period: { id: number }
}

interface MythicKeystonePeriod {
    id: number,
    start_timestamp: number,
    end_timestamp: number
}

interface MythicKeystoneSeasonIndex {
    seasons: { id: number }[],
    current_season: { id: number }
}

interface MythicKeystoneSeason {
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

interface MythicKeystoneLeaderboardRef extends IdName {
    period: number
}

interface MythicKeystoneLeaderboard {
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
            profile: {
                id: number,
                name: string,
                realm: { id: number, slug: string }
            },
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

interface RegionRef {
    id: number
}

interface Region extends IdName {
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

interface ReputationFactionIndex {
    factions: IdName[],
    root_factions: IdName[]
}

interface ReputationFaction extends IdName {
    reputation_tiers: { id: number },
    description?: string,
    can_paragon?: boolean,
    factions?: IdName[],
    is_header?: boolean
}

interface ReputationTier extends IdName {
    min_value: number,
    max_value: number
}

interface ReputationTiers {
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
