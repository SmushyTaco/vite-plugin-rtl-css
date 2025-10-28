import { Plugin } from 'vite';
import postcss from 'postcss';
import rtlcss, { ConfigOptions } from 'rtlcss';

type RtlCssPluginOptions = {
  fileNameMap?: Record<string, string>;
  sourceMap?: boolean | 'inline' | 'hidden';
  rtlcssConfig?: ConfigOptions;
};

function viteRtlCssPlugin(options: RtlCssPluginOptions = {}): Plugin {
  let sourcemapOption: boolean | 'inline' | 'hidden' = false;
  const fileNameMap = options.fileNameMap || {
    '.css': '[name].rtl.css',
    '.min.css': '[name].rtl.min.css'
  };

  const getOutputFileName = (
    inputFileName: string,
    extension: string
  ): string => {
    const baseName = inputFileName.slice(0, -extension.length);
    const template = fileNameMap[extension] || `${baseName}.rtl${extension}`;
    return template.replace('[name]', baseName);
  };

  // noinspection JSUnusedGlobalSymbols
  return {
    name: 'vite-rtlcss-plugin',
    enforce: 'post',

    configResolved(config) {
      sourcemapOption = options.sourceMap ?? config.build.sourcemap;
    },

    async generateBundle(_, bundle) {
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type !== 'asset') continue;
        const sortedFileNameMapKeys = Object.keys(fileNameMap).toSorted(
          (a, b) => {
            const dotCountA = (a.match(/\./g) || []).length;
            const dotCountB = (b.match(/\./g) || []).length;

            // Sort by dot count (descending)
            if (dotCountA !== dotCountB) {
              return dotCountB - dotCountA;
            }

            // If dot counts are equal, sort by length (descending)
            return b.length - a.length;
          }
        );

        const extension = sortedFileNameMapKeys.find((key) =>
          fileName.endsWith(key)
        );
        if (!extension) continue;
        const cssContent = asset.source?.toString();
        if (!cssContent) continue;
        const rtlFileName = getOutputFileName(fileName, extension);
        const result = await postcss([rtlcss(options.rtlcssConfig)]).process(
          cssContent,
          {
            from: fileName,
            to: rtlFileName,
            map: {
              inline: sourcemapOption === 'inline',
              annotation: sourcemapOption !== 'hidden'
            }
          }
        );
        this.emitFile({
          type: 'asset',
          fileName: rtlFileName,
          source: result.css
        });
        if (
          result.map &&
          (sourcemapOption === true || sourcemapOption === 'hidden')
        ) {
          this.emitFile({
            type: 'asset',
            fileName: `${rtlFileName}.map`,
            source: result.map.toString()
          });
        }
      }
    }
  };
}

// noinspection JSUnusedGlobalSymbols
export default viteRtlCssPlugin;
