"use client";

import Image from "next/image";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { getMarketList, getVeSCAInfoList } from "@/utils/suiClient";
import {
  LIST_MARKET,
  NFT_TYPE,
  PACKAGE_OBJECT_ID,
  PRICES_TABLE,
  RESERVE_OBJECT,
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
import { Gem } from "lucide-react";
import { calculateVeSCA, unixToHumanReadable } from "@/lib/utils";

export default function Page() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const router = useRouter();
  const [listedList, setListedList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

      const nftIdSet = nftObjs?.data.map((item) => item?.data?.objectId);

      const _listedList = res!.filter((item) =>
        nftIdSet?.includes(item.orderNftId)
      );

      const renderList = await getVeSCAInfoList(res);

      setListedList(renderList);
      setIsLoading(false);
    })();
  }, [nftObjs]);

  async function handleUnlist(obj: any) {
    if (!account) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
      });
      return;
    }

    const tx = new Transaction();

    const id = obj.orderNftId;

    tx.moveCall({
      arguments: [
        tx.object(LIST_MARKET),
        tx.object(RESERVE_OBJECT),
        tx.object(id),
      ],
      typeArguments: [VE_TOKEN_TYPE],
      target: `${PACKAGE_OBJECT_ID}::user::unlist_vetoken`,
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
            description: "You have successfully unlisted the veSCA.",
          });

          //延迟跳转
          setTimeout(() => {
            router.push("/profile");
          }, 1000);
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
        <span className="text-pink-800 text-xl mr-2">{`${listedList.length}`}</span>
        items
      </h1>

      <div className="flex flex-row flex-wrap gap-4">
        {listedList.map((item) => (
          <Card key={item.orderNftId} className="max-w-[320px]">
            <CardHeader>
              <CardTitle className="flex items-center text-fuchsia-900">
                <Gem size={24} />
                <span className="ml-1">veSCA</span>
              </CardTitle>
              <div className="space-y-3">
                <div className="truncate" title={item.veTokenId}>
                  {item.veTokenId}
                </div>
                <div>
                  <h1 className="text-xs text-fuchsia-900">CURRENT VESCA:</h1>
                  <p className="text-lg font-semibold text-fuchsia-900">
                    {item.current_vesca}
                  </p>
                </div>
                <div>
                  <h1 className="text-xs text-fuchsia-900">LOCKED SCA:</h1>
                  <p className="text-lg font-semibold text-fuchsia-900">
                    {item.locked_sca}
                  </p>
                </div>
                <div>
                  <h1 className="text-xs text-fuchsia-900">
                    REMAINING LOCK PERIOD:
                  </h1>
                  <p className="text-lg font-semibold text-fuchsia-900">
                    {item.remaining_lock_period}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center">
              <Image
                priority={true}
                src="/VeSCA.png"
                alt="logo"
                height={96}
                width={96}
              />
              <div className="ml-6 text-lg ">
                <p className="pr-2 text-sm text-slate-400">Price:</p>
                <span className="font-bold text-4xl text-fuchsia-500">
                  {Number(item.price) / 10 ** 9}
                </span>
                <span className="pl-2">SUI</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link
                href={{
                  pathname: `/profile/listUpdate/${item.veTokenId}`,
                  query: item,
                }}
              >
                <Button className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white hover:opacity-80">
                  Change price
                </Button>
              </Link>
              <Button onClick={() => handleUnlist(item)}>Cancel listing</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
