import axios, { AxiosRequestConfig } from "axios";
import { getOpenApi, OpenApi } from './openapi';
import generateService, { ServiceGeneratorOptions } from './serviceGenerator';

export interface Options {
  data: string;
  url: string;
  requestConfig: AxiosRequestConfig
}

export type Plugin = (openApiTool: typeof OpenApiTool, options: any) => void;

type Plugins = {
  plugin: Plugin;
  options: any;
}[];

const plugins: Plugins = [];

export default class OpenApiTool {
  public static use(plugin: Plugin, options: any) {
    plugins.push({ plugin, options });
  }

  private options: Options;

  public constructor(options: Options) {
    const { data, url } = options;
    if (!data && !url) {
      throw new Error('please input either data or url!');
    }

    this.options = options;
    this.registerPlugins(plugins);
  }

  /** 获取OpenApi */
  public async getOpenApi(): Promise<OpenApi> {
    const { data, url, requestConfig } = this.options;

    let jsonData = data;
    if (url) {
      const res = await axios.get(url, requestConfig);
      jsonData = res.data;
    }

    return getOpenApi(jsonData);
  }

  /** 生成Service文件 */
  public async generateService(options: ServiceGeneratorOptions) {
    const openapi = await this.getOpenApi();
    await generateService(openapi, options);
  }

  /** 注册插件 */
  private registerPlugins(plugins: Plugins) {
    plugins.forEach((pluginObj) => pluginObj.plugin(OpenApiTool, pluginObj.options));
  }
}
// # sourceMappingURL=main.js.map
