"use client";
import Image from "next/image";
import {
  useCurrentAccount,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
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
import { SkeletonComponent } from "../skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { get, result, upperCase } from "lodash";
import { VE_TOKEN_TYPE } from "@/utils/const";
import { Gem } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateVeSCA, unixToHumanReadable } from "@/lib/utils";
import { getVeSCAInfoList } from "@/utils/suiClient";

export default function Page() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [vescaList, setVescaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: vescaObjs,
    isPending,
    error,
    refetch,
  } = useSuiClientQuery("getOwnedObjects", {
    owner: account?.address!,
    options: {
      showContent: true,
    },
    filter: {
      StructType: VE_TOKEN_TYPE,
    },
  });

  const vescaObjIds = vescaObjs?.data.map((item) => {
    return {
      veTokenId: get(item, "data.objectId"),
    };
  });

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      const renderList = await getVeSCAInfoList(vescaObjIds);

      setVescaList(renderList);
      setIsLoading(false);
    })();
  }, [vescaObjs]);

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
        <span className="text-pink-800 text-xl mr-2">{`${vescaList.length}`}</span>
        items
      </h1>

      <div className="flex flex-row flex-wrap gap-4">
        {vescaList.map((obj) => (
          <Card key={obj.veTokenId} className="max-w-[320px]">
            <CardHeader>
              <CardTitle className="flex items-center text-fuchsia-900">
                <Gem size={24} />
                <span className="ml-1">veSCA</span>
              </CardTitle>
              <div className="space-y-3">
                <div className="truncate" title={obj.veTokenId}>
                  {obj.veTokenId}
                </div>
                <div>
                  <h1 className="text-xs text-fuchsia-900">CURRENT VESCA:</h1>
                  <p className="text-lg font-semibold text-fuchsia-900">
                    {obj.current_vesca}
                  </p>
                </div>
                <div>
                  <h1 className="text-xs text-fuchsia-900">LOCKED SCA:</h1>
                  <p className="text-lg font-semibold text-fuchsia-900">
                    {obj.locked_sca}
                  </p>
                </div>
                <div>
                  <h1 className="text-xs text-fuchsia-900">
                    REMAINING LOCK PERIOD:
                  </h1>
                  <p className="text-lg font-semibold text-fuchsia-900">
                    {obj.remaining_lock_period}
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
                <p className="pr-2 text-sm text-slate-400">
                  Waiting for listing
                </p>
                <span className="font-bold text-4xl text-fuchsia-500">-</span>
                <span className="pl-2">SUI</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={{
                  pathname: `/profile/listDetail/${obj.veTokenId}`,
                  query: obj,
                }}
              >
                <Button className=" bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white hover:opacity-80">
                  List for sale
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
