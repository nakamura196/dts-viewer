// Next 16 で `next lint` が廃止されたため、ESLint を直接実行する (flat config)。
// 旧 .eslintrc.json の next/core-web-vitals + next/typescript と同じ内容。
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // eslint-config-next 16 で加わった React Compiler 系の規則。既存コード
      // (url-form / page/index / Resource) が該当するが、直すのは別作業にして警告に留める。
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'vercel-static/**', 'next-env.d.ts'],
  },
];

export default config;
