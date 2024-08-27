/// <reference types="vite/client" />

// TODO: Zodに統一する(暫定として追加するプロパティは全てoptionalにしておく)
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
