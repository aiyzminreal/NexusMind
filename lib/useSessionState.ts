"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * 基于 sessionStorage 的状态持久化 hook
 * - 刷新页面：状态保留
 * - 关闭/重新打开标签页：状态清空
 */
export function useSessionState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValueAndStore = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        try {
          sessionStorage.setItem(key, JSON.stringify(next));
        } catch {
          // sessionStorage 满了或不可用时静默失败
        }
        return next;
      });
    },
    [key]
  );

  // 组件挂载后同步一次（处理 SSR hydration）
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // ignore
    }
  }, [key]);

  return [value, setValueAndStore] as const;
}
