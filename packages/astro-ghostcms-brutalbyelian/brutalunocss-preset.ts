import { definePreset, presetIcons, 
    presetWind, presetTypography } from 'unocss';

export default definePreset(() => {
    return {
        name: 'brutalTheme',
        presets: [
            presetWind(),
            presetIcons({
              collections: {
                //@ts-expect-error
                logos: () =>
                  import('@iconify-json/logos/icons.json').then((i) => i.default),
                uil: () =>
                  import('@iconify-json/uil/icons.json').then((l) => l.default),
              },
            }),
            presetTypography(),
        ]
    }
})