import type { Options } from "./types/options";
import { transferCode } from "./utils/code-util";

export const BeautifyConsolePlugin = function (options?: Options) {
  return {
    name: 'beautify-console',
    enforce: 'post',
    transform(code: string, id: string) {
      const regExp = /(\.tsx?)|(\.jsx?)|(\.vue)/
      if (regExp.test(id)) {
        return transferCode(code, options)
      }
      return null;
    },
  }
}
