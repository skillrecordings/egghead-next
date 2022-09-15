type MixpanelData = {
  mixpanel: any
  distinct_id: string
  subscriptionType: string
  subscriptionInterval: string
  currentPeriodStart: string
  currentPeriodEnd: string
}

/*
When a user subscribes to pro en egghead, with any interval 

It captures when someone subscribes and pay a pro membership for the first time
*/
export const purchaseSubscriptionCreated = ({
  mixpanel,
  distinct_id,
  subscriptionType,
  subscriptionInterval,
  currentPeriodStart,
  currentPeriodEnd,
}: MixpanelData) =>
  mixpanel.track('Subscription Created', {
    distinct_id,
    subscriptionType,
    subscriptionInterval,
    currentPeriodStart,
    currentPeriodEnd,
  })

/*
Recieve stripe event that the subscription has been canceled 

The user no longer finds our service of value at the current time
*/
export const purchaseSubscriptionCanceled = (
  mixpanel: any,
  distinct_id: string,
) =>
  mixpanel.track('Subscription Canceled', {
    distinct_id,
  })

/*
Recieve stripe event and plan amount is more than before

When people change their plans. There are three possible downgrades: 
- from yearly to quarter
- from yearly to monthly 
- from quarter to monthly 
*/
export const purchaseSubscriptionDowngraded = ({
  mixpanel,
  distinct_id,
  subscriptionType,
  subscriptionInterval,
  currentPeriodStart,
  currentPeriodEnd,
}: MixpanelData) =>
  mixpanel.track('Subscription Downgrade', {
    distinct_id,
    subscriptionType,
    subscriptionInterval,
    currentPeriodStart,
    currentPeriodEnd,
  })

/*
Recieve stripe event and plan amount is more than before

"When people change their plans. There are three possible upgrades: 
- from montly to quarter 
- from month to year 
- from quarter to year "
*/
export const purchaseSubscriptionUpgraded = ({
  mixpanel,
  distinct_id,
  subscriptionType,
  subscriptionInterval,
  currentPeriodStart,
  currentPeriodEnd,
}: any) =>
  mixpanel.track('Subscription Upgrade', {
    distinct_id,
    subscriptionType,
    subscriptionInterval,
    currentPeriodStart,
    currentPeriodEnd,
  })

/*
Set's a property on the mixpanel user that reflects their current subscription status
*/
export const purchaseSetSubscriptionStatus = (
  mixpanel: any,
  distinct_id: string,
  subscriptionStatus: string,
) =>
  mixpanel.people.set(distinct_id, {
    subscriptionStatus,
  })
