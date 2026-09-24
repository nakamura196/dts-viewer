/**
 * トップの「例」とフッターの「例」で共有する DTS エンドポイント。
 *
 * 校異源氏物語は dts.ldas.jp の最終エンドポイント (/api/v2/dts) を直接指す。
 * /api/dts は /api/v2/dts への 302 なので、転送を 1 回省ける。
 */
export type DtsExample = {
  label: string;
  url: string;
  description?: string;
};

export const DTS_EXAMPLES: DtsExample[] = [
  {
    label: '校異源氏物語',
    url: 'https://dts.ldas.jp/api/v2/dts',
  },
  {
    label: 'Dracor',
    url: 'https://dev.dracor.org/api/v1/dts',
  },
  {
    label: 'Alpheios',
    url: 'https://texts.alpheios.net/api/dts',
    description:
      'A small collection of Latin and Greek texts that have been aligned with linguistic annotations for learning ancient languages. Uses the MyCapytain/Nautilus libraries.',
  },
  {
    label: 'Perseids',
    url: 'https://dts.perseids.org/',
    description:
      'Serves all textual resources available from Perseus within the Ancient Greek and Latin corpora as well as some resources in Hebrew and Farsi.',
  },
  {
    label: 'Epigraphische Datenbank Heidelberg',
    url: 'https://edh.ub.uni-heidelberg.de/api/dts/',
    description: 'A corpus of 80,000 short texts from the Latin epigraphic databases.',
  },
];
