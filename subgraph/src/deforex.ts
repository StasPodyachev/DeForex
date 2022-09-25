import {PositionCreated, PositionClose, PositionLiquidation, Deforex} from "../generated/Deforex/Deforex"
import { Position } from "../generated/schema"
import { deforexContract } from "./constants";

import {
  Address,
  ByteArray,
  log,
  crypto,
  Bytes,
} from "@graphprotocol/graph-ts";

export function handlePositionCreated(event: PositionCreated): void {
  let id: string = event.params.id.toString()
  let entity = Position.load(id)
  if (!entity) {
    entity = new Position(id);
  }

  log.info("positionId: {}, {}", [
    event.params.id.toString(), deforexContract._address.toHexString()
  ]);

  let positionRes = deforexContract.try__positions(event.params.id)

  if(positionRes.reverted) return

  let position = positionRes.value;

  entity.amount = position.getAmount()
  entity.amountOut = position.getAmountOut()
  entity.leverage = position.getLeverage()
  entity.tokenSell = position.getTokenSell()
  entity.tokenBuy = position.getTokenBuy()
  entity.status = 0
  entity.trader = position.getTrader()
  entity.timestamp = event.block.timestamp
  entity.save()
}


export function handlePositionClose(event: PositionClose): void {
  let id: string = event.params.id.toString()
  let entity = Position.load(id)

  if(!entity) return

  entity.status = 1
  entity.endTimestamp = event.block.timestamp
  entity.amountToAlp = event.params.amountToAlp
  entity.amountToTrader = event.params.amountToTrader
  entity.save()
}


export function handlePositionLiquidation(event: PositionLiquidation): void {
  let id: string = event.params.id.toString()
  let entity = Position.load(id)

  if(!entity) return

  entity.status = 2
  entity.endTimestamp = event.block.timestamp
  entity.amountToAlp = event.params.amountToAlp
  entity.save()
}