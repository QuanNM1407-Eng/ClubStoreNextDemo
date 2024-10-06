export const removeNullOrUndefinedElements = <T>(data: (T | undefined)[]) => {
  return data.filter((item) => item != null) as T[];
};

export function groupBy<T>(xs: T[], key: string) {
  return xs.reduce(function (rv: any, x: any) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
