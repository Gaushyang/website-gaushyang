"""Build one local SVG sprite from the 40 approved preview icons."""

from pathlib import Path
import re

root = Path(__file__).parent
html = (root / "icon-motion.html").read_text(encoding="utf-8")
js = (root / "icon-motion.js").read_text(encoding="utf-8")

first = re.findall(
    r'<button class="icon-tile[^>]*>\s*<svg viewBox="0 0 64 64" aria-hidden="true">(.*?)</svg>',
    html,
    re.DOTALL,
)
remaining = re.findall(r"\['[^']+','[^']+','(.*?)'\]", js)
icons = first + remaining
if len(icons) != 40:
    raise SystemExit(f"Expected 40 icons, found {len(icons)}")

symbols = "\n".join(
    f'<symbol id="icon-{i:02}" viewBox="0 0 64 64">{shape}</symbol>'
    for i, shape in enumerate(icons, 1)
)
(root / "icons-sprite.svg").write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg"><defs>\n{symbols}\n</defs></svg>\n',
    encoding="utf-8",
)
