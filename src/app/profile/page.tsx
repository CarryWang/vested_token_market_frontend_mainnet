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
    return get(item, "data.objectId");
  });

  useEffect(() => {
    setIsLoading(true);
    const _vescaList = [];

    (async () => {
      if (vescaObjIds?.length) {
        for (const item of vescaObjIds!) {
          const result = await client.getDynamicFieldObject({
            parentId:
              "0x0a0b7f749baeb61e3dfee2b42245e32d0e6b484063f0a536b33e771d573d7246",
            name: {
              type: "0x2::object::ID",
              value: item,
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
          let locked_sca = locked_sca_amount / Math.pow(10, decimal);

          const current_vesca = calculateVeSCA(locked_sca, unlock_at);

          const remaining_lock_period = unixToHumanReadable(unlock_at);

          //======================================================================================

          const obj = {
            vesca_id: item,
            current_vesca,
            locked_sca,
            remaining_lock_period,
          };

          _vescaList.push(obj);
        }
      }
      setVescaList(_vescaList);
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
        <span className="text-pink-800 text-xl mr-2">{`${vescaObjs?.data.length}`}</span>
        items
      </h1>

      <div className="flex flex-row flex-wrap gap-4">
        {vescaList.map((obj) => (
          <Card key={obj.vesca_id} className="max-w-[320px]">
            <CardHeader>
              <CardTitle className="flex items-center text-fuchsia-900">
                <Gem size={24} />
                <span className="ml-1">veSCA</span>
              </CardTitle>
              <div className="space-y-3">
                <div className="truncate" title={obj.vesca_id}>
                  {obj.vesca_id}
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
                  pathname: `/profile/listDetail/${obj.vesca_id}`,
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
