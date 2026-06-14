import { useTheme } from './ThemeContext';

type ColorKey = 'keyword' | 'string' | 'number' | 'function' | 'variable' | 'comment' | 'plain';

interface Token {
  text: string;
  colorKey: ColorKey;
}

const KEYWORDS = new Set([
  'function', 'return', 'if', 'else', 'for', 'while', 'let', 'const', 'var',
  'true', 'false', 'null', 'undefined', 'new', 'this', 'of', 'in', 'typeof',
]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < code.length) {
    const ch = code[pos];

    if (code.startsWith('//', pos)) {
      const end = code.indexOf('\n', pos);
      const text = end === -1 ? code.slice(pos) : code.slice(pos, end);
      tokens.push({ text, colorKey: 'comment' });
      pos += text.length;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      let j = pos + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === ch) { j++; break; }
        j++;
      }
      tokens.push({ text: code.slice(pos, j), colorKey: 'string' });
      pos = j;
      continue;
    }

    if (/\d/.test(ch)) {
      let j = pos;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push({ text: code.slice(pos, j), colorKey: 'number' });
      pos = j;
      continue;
    }

    const op3 = code.slice(pos, pos + 3);
    if (op3 === '===' || op3 === '!==') {
      tokens.push({ text: op3, colorKey: 'plain' });
      pos += 3;
      continue;
    }

    const op2 = code.slice(pos, pos + 2);
    if (['>=', '<=', '==', '!=', '&&', '||', '++', '--', '=>'].includes(op2)) {
      tokens.push({ text: op2, colorKey: 'plain' });
      pos += 2;
      continue;
    }

    if (/[a-zA-Z_$]/.test(ch)) {
      let j = pos;
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(pos, j);
      let k = j;
      while (k < code.length && code[k] === ' ') k++;
      const isCall = k < code.length && code[k] === '(';
      let colorKey: ColorKey = 'variable';
      if (KEYWORDS.has(word)) colorKey = 'keyword';
      else if (isCall) colorKey = 'function';
      tokens.push({ text: word, colorKey });
      pos = j;
      continue;
    }

    tokens.push({ text: ch, colorKey: 'plain' });
    pos++;
  }

  return tokens;
}

export function SyntaxText({ code }: { code: string }) {
  const { theme } = useTheme();
  const colorMap: Record<ColorKey, string> = {
    keyword: theme.codeKeyword,
    string: theme.codeString,
    number: theme.codeNumber,
    function: theme.codeFunction,
    variable: theme.codeVariable,
    comment: theme.codeComment,
    plain: theme.codePlain,
  };
  return (
    <>
      {tokenize(code).map((t, i) => (
        <span key={i} style={{ color: colorMap[t.colorKey] }}>{t.text}</span>
      ))}
    </>
  );
}
