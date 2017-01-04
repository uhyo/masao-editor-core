// どれかが変わっていたらtrue
export default function propChanged<T>(prevProps: T, newProps: T, keys: Array<keyof T>): boolean{
    return keys.some(k=> prevProps[k] !== newProps[k]);
}
