interface Token {
  text: string;
  color: string;
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

    // Comment
    if (code.startsWith('//', pos)) {
      const end = code.indexOf('\n', pos);
      const text = end === -1 ? code.slice(pos) : code.slice(pos, end);
      tokens.push({ text, color: '#6A9955' });
      pos += text.length;
      continue;
    }

    // String literal
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = pos + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === ch) { j++; break; }
        j++;
      }
      tokens.push({ text: code.slice(pos, j), color: '#CE9178' });
      pos = j;
      continue;
    }

    // Number
    if (/\d/.test(ch)) {
      let j = pos;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push({ text: code.slice(pos, j), color: '#B5CEA8' });
      pos = j;
      continue;
    }

    // Operator tokens (arrows, comparisons, etc.)
    const op2 = code.slice(pos, pos + 3);
    if (['===', '!==', '=>'].includes(op2)) {
      tokens.push({ text: op2, color: '#CCCCCC' });
      pos += 3;
      continue;
    }
    const op1 = code.slice(pos, pos + 2);
    if (['>=', '<=', '==', '!=', '&&', '||', '++', '--', '=>'].includes(op1)) {
      tokens.push({ text: op1, color: '#CCCCCC' });
      pos += 2;
      continue;
    }

    // Identifier / keyword
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = pos;
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(pos, j);
      // Look ahead past spaces for '('
      let k = j;
      while (k < code.length && code[k] === ' ') k++;
      const isCall = k < code.length && code[k] === '(';

      let color = '#CCCCCC';
      if (KEYWORDS.has(word)) color = '#569CD6';
      else if (isCall) color = '#DCDCAA';
      else color = '#9CDCFE';

      tokens.push({ text: word, color });
      pos = j;
      continue;
    }

    // Default single char
    tokens.push({ text: ch, color: '#CCCCCC' });
    pos++;
  }

  return tokens;
}

export function SyntaxText({ code }: { code: string }) {
  const tokens = tokenize(code);
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{ color: t.color }}>{t.text}</span>
      ))}
    </>
  );
}
