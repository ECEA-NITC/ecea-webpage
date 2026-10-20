// Dot-matrix "ECEA" wordmark. Each string is one row; "x" = a dot.
// Dots use currentColor, so the wordmark inverts with the theme automatically.
const LETTERS = [
  [ // E
    "xxxxxxxxx",
    "xxxxxxxxx",
    "xxxxxxxxx",
    "xxx......",
    "xxxxxxxx.",
    "xxxxxxxx.",
    "xxxxxxxx.",
    "xxx......",
    "xxxxxxxxx",
    "xxxxxxxxx",
    "xxxxxxxxx",
  ],
  [ // C
    "..xxxxxx...",
    ".xxxxxxxxx.",
    "xxxxxxxxxxx",
    "xxx.....xxx",
    "xx.........",
    "xx.........",
    "xx.........",
    "xxx....xxxx",
    ".xxxxxxxxx.",
    "..xxxxxxxx.",
    "...xxxxx...",
  ],
  [ // E
    "xxxxxxxxx",
    "xxxxxxxxx",
    "xxxxxxxxx",
    "xxx......",
    "xxxxxxxx.",
    "xxxxxxxx.",
    "xxxxxxxx.",
    "xxx......",
    "xxxxxxxxx",
    "xxxxxxxxx",
    "xxxxxxxxx",
  ],
  [ // A
    ".....xxxx....",
    "....xxxxxx...",
    "...xxxxxxxx..",
    "..xxxx..xxxx.",
    "..xxx....xxx.",
    ".xxxx....xxxx",
    ".xxxxxxxxxxxx",
    ".xxxxxxxxxxxx",
    "xxxx......xxx",
    "xxx.......xxx",
    "xxx.......xxx",
  ],
];

const GAP = 2; // empty columns between letters
const ROWS = 11;
const CELL = 10;

function buildDots() {
  const dots = [];
  let offset = 0;
  LETTERS.forEach((rows) => {
    rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch === "x") dots.push({ cx: (offset + x + 0.5) * CELL, cy: (y + 0.5) * CELL });
      })
    );
    offset += rows[0].length + GAP;
  });
  return { dots, cols: offset - GAP };
}

const { dots, cols } = buildDots();

export default function DotWordmark({ className = "" }) {
  return (
    <svg
      viewBox={`0 0 ${cols * CELL} ${ROWS * CELL}`}
      className={className}
      role="img"
      aria-label="ECEA"
      fill="currentColor"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={CELL * 0.44} />
      ))}
    </svg>
  );
}