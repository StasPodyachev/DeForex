import {
  AlpCreated as AlpCreatedEvent,
} from "../generated/Factory/Factory"
import { Alp as AlpEntity } from "../generated/schema"
import {ALP as AlpTemplates} from "../generated/templates"

export function handleAlpCreated(event: AlpCreatedEvent): void {
  let entity = new AlpEntity(
      event.params.alp.toHex()
  )

  entity.token0 = event.params.token
  entity.timestamp = event.block.timestamp
  entity.save()

  AlpTemplates.create(event.params.alp)
}
