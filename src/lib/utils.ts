import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unixToHumanReadable(unixTimestamp: number): string {
  // 创建一个新的 Date 对象，使用 Unix 时间戳
  const date = new Date(unixTimestamp * 1000);

  // 获取年、月、日
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" }); // 获取完整月份名称
  const day = date.getDate();

  // 返回格式化的日期字符串
  return `${month} ${day}, ${year}`;
}

export function calculateVeSCA(scaAmount: any, unlockTime: any) {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const fourYearsInSeconds = 4 * 365 * 24 * 60 * 60; // 4 years in seconds

  // Calculate the remaining lock period in seconds
  const remainLockPeriod = Math.max(0, unlockTime - currentTime);

  // Calculate veSCA using the provided formula
  const veSCA = scaAmount * (remainLockPeriod / fourYearsInSeconds);

  return Number(veSCA.toFixed(2));
}
