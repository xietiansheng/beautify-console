import { BeautifyConsoleOptions, BeautifyConsoleOptionsPlus, Options } from "../types/options";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";

const defaultOptions: BeautifyConsoleOptionsPlus = {
  config: [
    { label: 'Beautify', style: 'background:#409EFF; border-radius: 3px 0 0 3px;' },
    { label: 'Log', style: "background:#35495E; border-radius: 0 3px 3px 0;" }
  ],
  globalStyle: "padding: 1px;color: #fff;"
}

export const transferCode = (code: string, options?: Options) => {
  const codeAst = parse(code, { sourceType: "module" });
  traverse(codeAst, {
    CallExpression({ node }: { node: any }) {
      const { callee } = node;
      const { object, property } = callee
      if (callee.type !== 'MemberExpression' || object.name !== 'console' || property.name !== 'log') {
        return null;
      }
      const rawArgs = [...node.arguments]
      let newArgs: string[] = [];
      if (!options) {
        options = defaultOptions;
        newArgs = transferArrOptions(options)
      } else if (isOptionPlus(options)) {
        newArgs = transferArrOptions(options)
      } else {
        newArgs = transferObjectOptions(options)
      }
      node.arguments =
        [...newArgs, 'background:transparent'].map(value => ({
          type: 'StringLiteral',
          extra: { rawValue: `${ value }`, raw: `'${ value }'` },
          value: value,
        }));
      node.arguments.push(...rawArgs)
    }
  })
  return generator(codeAst) || code;
}

const transferObjectOptions = (options: BeautifyConsoleOptions): string[] => {
  return [
    `%c ${ options.title } %c ${ options.info } %c`,
    ...defaultOptions.config.map(item => item.style + `;${ defaultOptions.globalStyle }`)
  ];
}

const transferArrOptions = (options: BeautifyConsoleOptionsPlus): string[] => {
  let content = options.config.reduce((pre, cur) => {
    pre += `%c ${ cur.label }`;
    return pre;
  }, '')
  content += ' %c';
  return [
    content,
    ...options.config.map(item => item.style + `;${ options.globalStyle || '' }`)
  ];
}

export function isOptionPlus(option: BeautifyConsoleOptionsPlus | BeautifyConsoleOptions): option is BeautifyConsoleOptionsPlus {
  return !!Reflect.get(option, 'config')
}
