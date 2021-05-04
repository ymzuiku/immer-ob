import immer, { Draft } from "immer";

export type IListen<T> = <M extends DynList>(
  memo: (state: T) => M,
  fn: (...nowMemo: M) => any
) => any;

interface ObItem<S> {
  getMemo: (state: S) => any;
  memo: any;
  fn: (...values: any[]) => any;
}

export interface ObEvent<S extends object, V> extends Set<ObItem<S>> {
  state: S;
  onUpdate: IListen<S>;
  onUpdateLazy: IListen<S>;
  update: (fn: (draft: Draft<S>) => any) => void;
}

export const Ob = <S extends object, V>(state: S): ObEvent<S, V> => {
  const ob = new Set() as ObEvent<S, V>;
  ob.state = immer(state, (v) => {});
  ob.onUpdate = (getMemo, fn) => {
    const item = { getMemo, memo: getMemo(ob.state), fn };
    if (item.memo) {
      fn(...item.memo);
    } else {
      (fn as any)();
    }

    ob.add(item);
    return () => ob.delete(item);
  };
  ob.onUpdateLazy = (getMemo, fn) => {
    const item = { getMemo, memo: getMemo(ob.state), fn };
    ob.add(item);
    return () => ob.delete(item);
  };
  ob.update = (fn: (draft: Draft<S>) => any) => {
    ob.forEach((item) => {
      ob.state = immer(ob.state, (draft) => {
        fn(draft);
      });

      if (item.memo) {
        if (!item.memo.length) {
          return;
        }

        const nextMemo = item.getMemo(ob.state);

        let isNeedUpdate = false;
        for (let i = 0; i < nextMemo.length; i++) {
          if (nextMemo[i] !== item.memo[i]) {
            isNeedUpdate = true;
            break;
          }
        }
        if (!isNeedUpdate) {
          return;
        }
        item.memo = nextMemo;
        item.fn(...item.memo);
      } else {
        item.fn();
      }
    });
  };
  return ob;
};

export type DynList =
  | []
  | [any]
  | [any, any]
  | [any, any, any]
  | [any, any, any, any]
  | [any, any, any, any, any]
  | [any, any, any, any, any, any]
  | [any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any, any, any, any, any, any, any]
  | [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any];
