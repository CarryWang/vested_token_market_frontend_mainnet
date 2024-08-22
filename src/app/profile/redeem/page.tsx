"use client";

import Image from "next/image";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { getMarketList } from "@/utils/suiClient";
import {
  COIN_RESERVE_TABLE,
  LIST_MARKET,
  NFT_TYPE,
  PACKAGE_OBJECT_ID,
  PRICES_TABLE,
  RESERVE_OBJECT,
  VE_TOKEN_RESERVE_TABLE,
  VE_TOKEN_TYPE,
  VESTED_TOKENS_TABLE,
} from "@/utils/const";
import { get } from "lodash";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SkeletonComponent } from "../../skeleton";
import { ConnectTips } from "../../connectTips";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BadgeDollarSign } from "lucide-react";

export default function Page() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [redeemList, setRedeemList] = useState<any[]>([]);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          showEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  const { data: nftObjs } = useSuiClientQuery("getOwnedObjects", {
    owner: account?.address!,
    options: {
      showContent: true,
    },
    filter: {
      StructType: NFT_TYPE,
    },
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await getMarketList();

      const nftIdSet = new Set(res?.map((item) => item?.orderNftId));

      const _redeemList = nftObjs?.data.filter(
        (item) => !nftIdSet.has(item.data?.objectId)
      );

      const renderList = [] as any;

      if (_redeemList) {
        for (const item of _redeemList) {
          const res = await client.getDynamicFieldObject({
            parentId: COIN_RESERVE_TABLE,
            name: {
              type: "address",
              value: item?.data?.objectId,
            },
          });
          const obj = {
            nftId: item?.data?.objectId,
            balance: get(res, "data.content.fields.balance"),
          };
          renderList.push(obj);
        }
      }

      setRedeemList(renderList);
      setIsLoading(false);
    })();
  }, [nftObjs]);

  async function handleRedeem(obj: any) {
    if (!account) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
      });
      return;
    }

    const tx = new Transaction();

    const id = obj.nftId;

    tx.moveCall({
      arguments: [tx.object(RESERVE_OBJECT), tx.object(id)],
      typeArguments: [VE_TOKEN_TYPE],
      target: `${PACKAGE_OBJECT_ID}::user::redeem_coins`,
    });

    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log("executed transaction", result);
          toast({
            title: "Congratulations, Successful Operation",
            description:
              "You have successfully withdrawn your tokens, view them in your wallet.",
          });
          router.push("/profile");
        },
      }
    );
  }

  return isLoading ? (
    <div>
      <div className="text-lg mb-6">
        <Skeleton className="h-[28px] w-[120px]" />
      </div>
      <SkeletonComponent />
    </div>
  ) : (
    <div className="">
      <h1 className="text-base mb-6 text-slate-500 font-bold">
        <span className="text-indigo-800 text-xl mr-2">{`${redeemList.length}`}</span>
        items
      </h1>

      <div className="flex flex-row flex-wrap gap-4">
        {redeemList?.map((item) => (
          <Card key={item.nftId} className="max-w-[320px]">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-900">
                <BadgeDollarSign size={24} />
                <span className="ml-1">Withdrawable Coin</span>
              </CardTitle>
              <CardDescription className="truncate">
                {item.nftId}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <Image
                priority={true}
                src="/sui_icon.png"
                alt="logo"
                height={96}
                width={96}
              />
              <div className="ml-6 text-lg ">
                <p className="pr-2 text-sm text-slate-400">Withdrawable:</p>
                <span className="font-bold text-4xl text-indigo-500">
                  {Number(item.balance) / 10 ** 9}
                </span>
                <span className="pl-2">SUI</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
                onClick={() => handleRedeem(item)}
              >
                Withdraw
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
