import { InjectionKey } from '@vue/runtime-core';

export const dateKey: InjectionKey<Date | undefined> = Symbol('Date');
export const activeItemKey: InjectionKey<number> = Symbol('ActiveItem');
