// constants

import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { Factory as FactoryContract } from "../generated/Factory/Factory";

import { Deforex as DeforexContract } from "../generated/Deforex/Deforex";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0xF299d6F8d597C8E0a4110181755F168cDd2F6961";
export const DEFOREX_ADDRESS = "0xFdf38d316D34a9B0e0420C20d3826DFC29B9745c";

export let factoryContract: FactoryContract = FactoryContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export let deforexContract: DeforexContract = DeforexContract.bind(
  Address.fromString(DEFOREX_ADDRESS)
);