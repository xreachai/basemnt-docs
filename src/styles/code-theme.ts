import type { ThemeRegistrationRaw } from 'shiki';

/** Shiki theme mirroring the landing API-block palette in theme.css:
    keywords and functions bright green, strings green, numbers yellow,
    comments dim, punctuation muted — on the docs black/green base. */
export const codeTheme: ThemeRegistrationRaw = {
  name: 'basemnt',
  type: 'dark',
  settings: [
    { settings: { background: '#070a08', foreground: '#e9edea' } },
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: '#4e5651', fontStyle: 'italic' },
    },
    {
      scope: ['string', 'string.regexp', 'constant.other.symbol', 'constant.other.color', 'meta.embedded', 'punctuation.definition.string'],
      settings: { foreground: '#34d399' },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character', 'constant.other', 'variable.other.constant', 'support.constant'],
      settings: { foreground: '#f59e0b' },
    },
    {
      scope: ['keyword', 'storage', 'keyword.operator.word', 'punctuation.definition.keyword', 'entity.name.tag'],
      settings: { foreground: '#8df5c6' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'variable.function'],
      settings: { foreground: '#8df5c6' },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'entity.name.interface', 'entity.name.namespace', 'entity.name.module', 'support.type', 'support.class'],
      settings: { foreground: '#8df5c6' },
    },
    {
      scope: ['punctuation', 'meta.brace', 'meta.separator', 'keyword.operator'],
      settings: { foreground: '#8b948e' },
    },
    { scope: ['invalid'], settings: { foreground: '#ef4444' } },
  ],
};
