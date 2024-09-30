// export function debounce<T extends (...args: any[]) => void>(
//     func: T,
//     wait: number
//   ): (...args: Parameters<T>) => void {
//     let timeoutId: NodeJS.Timeout | null;
  
//     return function (...args: Parameters<T>) {
//        // @ts-ignore
//       const context = this;
      
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
  
//       timeoutId = setTimeout(() => {
//         func.apply(context, args);
//       }, wait);
//     };
//   }

export function debounce(func: { (): void; (): void; apply?: any; }, timeout = 300){
  let timer: string | number | NodeJS.Timeout | undefined;
  return (...args: any) => {
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}