const PROTECTED_WORDS = new Map([
  ['ai', 'AI'],
  ['api', 'API'],
  ['css', 'CSS'],
  ['html', 'HTML'],
  ['js', 'JS'],
  ['ui', 'UI'],
  ['ux', 'UX'],
  ['pdf', 'PDF'],
  ['pdfs', 'PDFs'],
  ['rest', 'REST'],
  ['mern', 'MERN'],
  ['mongodb', 'MongoDB'],
  ['node.js', 'Node.js'],
  ['express.js', 'Express.js'],
  ['react.js', 'React.js'],
]);

const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);

const cleanSpaces = (value = '') =>
  String(value)
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,.;:!?])(?=\S)/g, '$1 ')
    .trim();

const capitalizeWord = (word) => {
  if (!word) return word;
  const lower = word.toLowerCase();
  if (PROTECTED_WORDS.has(lower)) return PROTECTED_WORDS.get(lower);
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const formatProjectTitle = (title = '') => {
  const cleaned = cleanSpaces(title);
  if (!cleaned) return cleaned;

  return cleaned
    .split(' ')
    .map((word, index, words) => {
      const lower = word.toLowerCase();
      if (PROTECTED_WORDS.has(lower)) return PROTECTED_WORDS.get(lower);
      if (index > 0 && index < words.length - 1 && SMALL_WORDS.has(lower)) return lower;
      return capitalizeWord(word);
    })
    .join(' ');
};

const capitalizeSentence = (sentence = '') =>
  sentence.replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);

export const formatProjectDescription = (description = '') => {
  const lines = String(description)
    .split(/\r?\n/)
    .map((line) => {
      const bullet = line.trim().match(/^[-*•]\s*(.+)$/);
      const text = cleanSpaces(bullet ? bullet[1] : line);
      if (!text) return '';

      const formatted = capitalizeSentence(text)
        .replace(/\bai\b/gi, 'AI')
        .replace(/\bapi\b/gi, 'API')
        .replace(/\bpdfs\b/gi, 'PDFs')
        .replace(/\bpdf\b/gi, 'PDF')
        .replace(/\brest\b/gi, 'REST')
        .replace(/\bmongodb\b/gi, 'MongoDB')
        .replace(/\bexpress\.js\b/gi, 'Express.js')
        .replace(/\bnode\.js\b/gi, 'Node.js')
        .replace(/\breact\.js\b/gi, 'React.js');

      const withPeriod = /[.!?]$/.test(formatted) ? formatted : `${formatted}.`;
      return bullet ? `- ${withPeriod}` : withPeriod;
    })
    .filter(Boolean);

  return lines.join('\n');
};

export const normalizeProject = (project = {}) => ({
  ...project,
  title: formatProjectTitle(project.title),
  description: formatProjectDescription(project.description),
});

export const normalizeProjects = (projects = []) =>
  Array.isArray(projects) ? projects.map(normalizeProject) : [];
