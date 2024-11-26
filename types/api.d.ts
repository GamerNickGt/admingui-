type VerifiedFields =
  | 'ExperienceWeaponQuarterstaff'
  | 'ExperienceWeaponGreatsword'
  | 'ExperienceWeaponKatars'
  | 'ExperienceVanguard'
  | 'ExperienceWeaponDaneAxe'
  | 'ExperienceWeaponSpear'
  | 'ExperienceWeaponWarBow'
  | 'ExperienceWeaponHatchet'
  | 'GlobalXp'
  | 'ExperienceWeaponWarClub'
  | 'ExperienceWeaponFalchion'
  | 'ExperienceWeaponThrowingKnife'
  | 'ExperienceWeaponThrowingMallet'
  | 'ExperienceWeaponWarHammer'
  | 'ExperienceWeaponBow'
  | 'ExperienceWeaponPickAxe'
  | 'ExperienceWeaponHeavyCavalrySword'
  | 'ExperienceWeaponMediumShield'
  | 'ExperienceWeaponGoedendag'
  | 'ExperienceWeaponJavelin'
  | 'ExperienceWeaponKnife'
  | 'ExperienceWeaponMorningStar'
  | 'ExperienceWeaponShovel'
  | 'ExperienceWeaponDagger'
  | 'ExperienceWeaponMesser'
  | 'ExperienceWeaponMace'
  | 'ExperienceWeaponLance'
  | 'ExperienceWeaponGlaive'
  | 'ExperienceWeaponShortSword'
  | 'ExperienceWeaponThrowingAxe'
  | 'ExperienceWeaponWarAxe'
  | 'ExperienceArcher'
  | 'ExperienceWeaponCudgel'
  | 'ExperienceWeaponSledgeHammer'
  | 'ExperienceWeaponHeavyShield'
  | 'ExperienceWeaponHighlandSword'
  | 'ExperienceWeaponPoleHammer'
  | 'ExperienceWeaponRapier'
  | 'ExperienceKnight'
  | 'ExperienceWeaponAxe'
  | 'ExperienceWeaponHeavyCrossbow'
  | 'ExperienceWeaponCrossbow'
  | 'ExperienceFootman'
  | 'ExperienceWeaponSword'
  | 'ExperienceWeaponBastardSword'
  | 'ExperienceWeaponHalberd'
  | 'ExperienceWeaponTwoHandedHammer'
  | 'ExperienceWeaponExecutionersAxe'
  | 'ExperienceWeaponPoleAxe'

type LeaderboardStats = {
  id: number
  playfabId: string
  globalXp: number
  fetchTimestamp: string
} & Record<Lowercase<VerifiedFields>, number> &
  Record<`${Lowercase<VerifiedFields>}Position`, number>

interface PlayerDetails {
  verifiedFields: VerifiedFields[]
  leaderboardStats: LeaderboardStats
}

interface PlayFabDetails {
  playfabId: string
  aliasHistory: string
  lookupCount: number
  lastLookup: string
  previousLookup: string
}

interface NameLookup {
  players: PlayFabDetails[]
  totalRecords: number
  totalPages: number
}

type APIEndpoint =
  | 'fetch_player_data'
  | 'fetch_playfab_data'
  | 'name_lookup'
  | 'fetch_punishments'
  | 'update_punishments'

interface APIResponse<T> {
  ok: boolean
  data: T
  status: number
}
