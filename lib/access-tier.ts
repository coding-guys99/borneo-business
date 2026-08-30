export type AccessTier='public'|'free'|'subscribed'

const TEST_SUBSCRIBER_EMAILS=new Set([
  'andywcy8@gmail.com',
])

export function accessTierForUser(email?:string|null):AccessTier{
  if(!email)return 'public'
  return TEST_SUBSCRIBER_EMAILS.has(email.trim().toLowerCase())?'subscribed':'free'
}

export function hasSubscribedAccess(tier:AccessTier){
  return tier==='subscribed'
}
