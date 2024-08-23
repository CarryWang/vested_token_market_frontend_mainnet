import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { PRICES_TABLE, targetNetwork, VESTED_TOKENS_TABLE } from "./const";
import { get } from "lodash";
import { calculateVeSCA, unixToHumanReadable } from "@/lib/utils";

export const client = new SuiClient({ url: getFullnodeUrl(targetNetwork) });

export const getMarketList = async () => {
  const pricesTable = await client.getDynamicFields({
    parentId: PRICES_TABLE,
  });

  const vestedTokensTable = await client.getDynamicFields({
    parentId: VESTED_TOKENS_TABLE,
  });

  const pricesTableList = pricesTable?.data;
  const vestedTokensTableList = vestedTokensTable?.data;

  // console.log(pricesTableList, "pricesTableList");
  // console.log(vestedTokensTableList, "vestedTokensTableList");

  if (!pricesTableList || !vestedTokensTableList) {
    return;
  }

  const priceMap = new Map();
  const veTokensMap = new Map();

  for (let i = 0; i < pricesTableList.length; i++) {
    const orderNftId = pricesTableList[i].name.value as string;
    const priceValueObjId = pricesTableList[i].objectId;
    const priceValueObj = await client.getObject({
      id: priceValueObjId,
      options: { showContent: true },
    });
    const price = get(priceValueObj, "data.content.fields.value") as string;

    priceMap.set(orderNftId, price);

    // const orderNftId = get(
    //   priceValueObj,
    //   "data.content.fields.name"
    // ) as string;

    // same as orderNftId
    const _orderNftId = vestedTokensTableList[i].name.value as string;
    const veTokenId = vestedTokensTableList[i].objectId;
    veTokensMap.set(_orderNftId, veTokenId);

    // 暂时不请求，目前只需要拿到 veTokenId
    // const vestedTokensValueObj = await client.getObject({
    //   id: veTokenId,
    //   options: { showContent: true },
    // });
  }

  // 将两个map的数据组合成obj

  const result = [];

  for (const [orderNftId, price] of priceMap) {
    const veTokenId = veTokensMap.get(orderNftId);
    result.push({ orderNftId, price, veTokenId });
  }

  return result;
};

export const getVeSCAInfoList = async (list: any) => {
  const renderList = [];

  if (list?.length) {
    for (const item of list) {
      const result = await client.getDynamicFieldObject({
        parentId:
          "0x0a0b7f749baeb61e3dfee2b42245e32d0e6b484063f0a536b33e771d573d7246",
        name: {
          type: "0x2::object::ID",
          value: item.veTokenId,
        },
      });

      //======================================================================================

      const unlock_at = Number(
        get(result, "data.content.fields.value.fields.unlock_at")
      );
      const locked_sca_amount = Number(
        get(result, "data.content.fields.value.fields.locked_sca_amount")
      );
      // the decimal of SCA is 9
      const decimal = 9;
      const _locked_sca = locked_sca_amount / Math.pow(10, decimal);

      const locked_sca = _locked_sca.toFixed(2);

      const current_vesca = calculateVeSCA(_locked_sca, unlock_at);

      const remaining_lock_period = unixToHumanReadable(unlock_at);

      //======================================================================================

      const obj = {
        ...item,
        current_vesca,
        locked_sca,
        remaining_lock_period,
      };

      renderList.push(obj);
    }
  }

  return renderList;
};
