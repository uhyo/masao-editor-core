// my lib. to handle Reflux
import * as React from 'react';
import * as Reflux from 'reflux';

// ========== Actions ==========
export type Action<T> = undefined extends T
  ? (arg?: T) => void
  : (arg: T) => void;

export interface ActionDefinition<T> {
  preEmit?(obj: T): T | undefined;
  shouldEmit?(obj: T): boolean;
}

export function createAction<T>(definition?: ActionDefinition<T>): Action<T> {
  return Reflux.createAction(definition);
}

export function createActions<D>(
  definitions: { [K in keyof D]: ActionDefinition<D[K]> },
): { [K in keyof D]: Action<D[K]> } {
  return (Reflux.createActions as any)(definitions);
}

// ========== Stores ==========
export interface StoreObject<T> {
  state: T;
  trigger(state: T): void;
  listenables: any;
  listenTo<U>(action: Action<U>, callback: (act: U) => void): void;
  listenToMany(actions: any): void;

  listen(callback: (state: T) => void): () => void;
}
export interface StoreClass {
  new <T>(): StoreObject<T>;
}
export const RefluxStore = (Reflux as any).Store as StoreClass;
export class Store<T> extends RefluxStore<T> {
  // stateを更新してpublish
  protected setState(obj: Partial<T>) {
    this.state = {
      ...(this.state as any),
      ...(obj as any),
    };
    this.trigger(this.state);
  }
}

export interface StoreDefinition {
  init?(): void;
}
export function createStore<T>(definition: StoreDefinition): StoreObject<T> {
  return (Reflux as any).createStore(definition);
}

// ========= Components ==========
/*
export interface RefluxComponentClass{
    new<P, S>(props: P): IRefluxComponent<P, S>
}
export interface IRefluxComponent<P, S> extends React.Component<P, S>{
}
export const _RefluxComponent = (Reflux as any).Component as RefluxComponentClass;
*/

export class RefluxComponent<D, P, S> extends React.Component<P, S & D> {
  protected unlistens: Array<() => void> = [];
  constructor(
    props: P,
    protected definition: { [K in keyof D]: Store<D[K]> },
    initialState: S,
  ) {
    super(props);

    this.state = {
      ...(initialState as any),
      ...(this.loadCurrentStore() as any),
    };
  }
  protected loadCurrentStore(): D {
    const initialState: any = {};
    for (const key in this.definition) {
      const store = this.definition[key];
      initialState[key] = store.state;
    }

    return initialState;
  }
  componentDidMount() {
    // listen to stores
    for (const key in this.definition) {
      const store = this.definition[key];
      const unlisten = store.listen(state => {
        this.setState({
          [key]: state,
        } as any);
      });
      this.unlistens.push(unlisten);
    }
    // Re-install current state
    this.setState(this.loadCurrentStore());
  }
  componentWillUnmount() {
    // unlisten
    for (const unlisten of this.unlistens) {
      unlisten();
    }
    this.unlistens = [];
  }
}
