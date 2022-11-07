export type Options = BeautifyConsoleOptions | BeautifyConsoleOptionsPlus

export interface BeautifyConsoleOptions {
  title?: string;
  info?: string;
}

export interface BeautifyConsoleOptionsPlus {
  config: ConfigItem[];
  // 全局样式
  globalStyle?: string;
}

export interface ConfigItem {
  // 内容
  label: string;
  // 样式
  style: string;
}
