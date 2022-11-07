import { Deposit, Sync, Withdraw } from "../generated/templates/ALP/ALP"
import { Balance as BalanceEntity, Alp as AlpEntity } from "../generated/schema"


export function handleDeposit(event: Deposit): void {
  // updateBalance(event)

  let id: string = event.address.toHex() + event.params.sender.toHex()

  let entity: BalanceEntity | null = BalanceEntity.load(id)

  if (!entity) {
    entity = new BalanceEntity(id)
    entity.alp = event.address.toHex()
    entity.owner = event.params.sender
  }

  // entity.balance0 = event.params.balance0
  // entity.balance1 = event.params.balance1
  entity.timestampUp = event.block.timestamp
  entity.save()
}

export function handleWithdraw(event: Withdraw): void {
  // updateBalance(event)

  let sender: string = event.params.sender.toHex()

  let entity: BalanceEntity | null = BalanceEntity.load(sender)

  if (!entity) {
    entity = new BalanceEntity(sender)
    entity.alp = event.address.toHex()
    entity.owner = event.params.sender
  }

  // entity.balance0 = event.params.balance0
  // entity.balance1 = event.params.balance1
  entity.timestampUp = event.block.timestamp
  entity.save()
}

export function handleSync(event: Sync): void {
  let entity = AlpEntity.load(event.address.toHex())

  if(!entity) return

  entity.reserve = event.params.reserve
  entity.reserveUpTimestamp = event.block.timestamp
  entity.save()
}

// function updateBalance(event: Ev): void{
//   let sender: string = event.params.sender.toHex()

//   let entity: BalanceEntity | null = BalanceEntity.load(sender)

//   if (!entity) {
//     entity = new BalanceEntity(sender)
//     entity.alp = event.address.toHex()
//     entity.owner = event.params.sender
//   }

//   entity.balance0 = event.params.balance0
//   entity.balance1 = event.params.balance1
//   entity.timestampUp = event.block.timestamp
//   entity.save()
// }
