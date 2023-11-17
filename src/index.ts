import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { stringLiteral } from "@babel/types";
import { Options } from "./types/options";

let defaultConfig = [
  { label: "Beautify", style: "background:#409EFF; border-radius: 3px 0 0 3px;" },
  { label: "Log", style: "background:#35495E; border-radius: 0 3px 3px 0;" },
];

export function BeautifyConsole(options?: Options) {
  transferOptions(options);

  const configList = [
    defaultConfig.reduce((pre, cur) => {
      pre += `%c ${ cur.label } `;
      return pre;
    }, ""),
    ...defaultConfig.map(item => item.style),
  ].reverse();
  return {
    name: "beautify-console",
    enforce: "post",
    transform(code: string, id: string) {
      const regExp = /(\.tsx?)|(\.jsx?)|(\.vue)/;
      if (!regExp.test(id)) {
        return null;
      }
      const ast = parse(code, {
        sourceType: "unambiguous",
      });

      traverse(ast, {
        CallExpression(path) {
          const targetCalleeName = ["log", "info", "error", "debug"].map(item => `console.${ item }`);
          const calleeName = path.get("callee").toString();
          if (targetCalleeName.includes(calleeName)) {
            configList.forEach(item => {
              path.node.arguments.unshift(stringLiteral(item));
            });
          }
        },
      });
      const { code: resultCode, map } = generate(ast, { sourceMaps: true }, code);
      return {
        code: resultCode,
        map,
      };
    },
  };
}

function transferOptions(options?: Options) {
  if (options) {
    if ("title" in options) {
      if (options.title) {
        defaultConfig[0].label = options.title;
      }
      if (options.info) {
        defaultConfig[1].label = options.info;
      }
    }

    if ("config" in options) {
      defaultConfig = options.config;
      if (options.globalStyle) {
        defaultConfig.forEach(item => {
          item.style += `;${ options.globalStyle }`;
        });
      }
    }

  }
}
