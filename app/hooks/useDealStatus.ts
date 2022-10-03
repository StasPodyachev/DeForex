import { useActiveWeb3React } from 'hooks/web3'

const useDealStatus = (deal: any) => {
  const { account } = useActiveWeb3React()

  const timestamp = Math.floor(Date.now() / 1000)
  const fromTaking = deal.status >= 1
  const toWaitingPayout = deal.status <= 3

  const isMaker = deal.makerAddress?.toLowerCase() === account?.toLowerCase()
  const isTaker = deal.takerAddress?.toLowerCase() === account?.toLowerCase()
  const isSeller = deal.sellerAddress?.toLowerCase() === account?.toLowerCase()
  const isBuyer = deal.buyerAddress?.toLowerCase() === account?.toLowerCase()

  const isCreated = deal.status === 0 && Number(deal.dateOrderExpiration) >= timestamp
  const isTaked = deal.status === 1 && Number(deal.dateOrderExpiration) >= timestamp
  const isExpired = deal.status === 0 && Number(deal.dateOrderExpiration) <= timestamp
  const isExpiriedDeliverySideS =
    fromTaking && toWaitingPayout && Number(deal?.dateDeliveryExpirationSideS) <= timestamp
  const isExpiriedDeliverySideL =
    fromTaking && toWaitingPayout && Number(deal?.dateDeliveryExpirationSideL) <= timestamp
  const isCompleted = deal.status === 4
  const isCanceled = deal.status === 5

  const isTaking = isCreated && !isMaker
  const isCanceling = deal.status === 0 && isMaker

  const isDeposit =
    isSeller &&
    fromTaking &&
    toWaitingPayout &&
    Number(deal?.oracleAmount) > 0 &&
    Number(deal.dateStart) <= timestamp &&
    Number(deal.dateDeliveryExpirationSideS) >= timestamp

  const isOracle =
    fromTaking &&
    toWaitingPayout &&
    Number(deal?.dateExpiration) <= timestamp &&
    Number(deal?.oracleAmount) === 0 && Number(deal.dateDeliveryExpirationSideS) >= timestamp
    

  const isWorking =
    (deal.status === 1 || deal.status === 2) &&
    Number(deal.dateStart) <= timestamp &&
    Number(deal.dateExpiration) >= timestamp

  const isWorkStopped =
    deal?.status === 1 &&
    Number(deal?.dateExpiration) <= timestamp &&
    Number(deal.dateDeliveryExpirationSideS) >= timestamp

  const isProcessing = fromTaking && toWaitingPayout && Number(deal.dateExpiration) <= timestamp

  const isWaitingPayout =
    deal?.status === 3 && Number(deal?.dateDeliveryExpirationSideS) >= timestamp && Number(deal?.oracleAmount) > 0

  const isProcessingWaitingPayout =
    deal?.status === 2 && Number(deal?.dateDeliveryExpirationSideS) >= timestamp && Number(deal?.oracleAmount) === 0

  let status

  if (isCreated) {
    status = 'Created'
  }

  if (isTaked) {
    status = 'Accepted'
  }

  if (isCompleted) {
    status = 'Completed'
  }

  if (isCanceled) {
    status = 'Canceled'
  }

  if (isExpired) {
    status = 'Expired'
  }

  if (isWorking) {
    status = 'Working'
  }

  if (isWaitingPayout) {
    status = 'Waiting Payout'
  }

  if (isWorkStopped) {
    status = 'Work Stopped'
  }

  if (isOracle || isExpiriedDeliverySideS) {
    status = 'Oracle'
  }

  return {
    status,
    isMaker,
    isTaker,
    isSeller,
    isBuyer,
    isCreated,
    isTaked,
    isCompleted,
    isCanceled,
    isExpired,
    isExpiriedDeliverySideS,
    isExpiriedDeliverySideL,
    isTaking,
    isCanceling,
    isDeposit,
    isOracle,
    isWorking,
    isWorkStopped,
    isWaitingPayout,
    isProcessingWaitingPayout,
    isProcessing,
  }
}

export default useDealStatus
