import Markdownit from "markdown-it";
import { languages, highlight } from "prismjs";
//BUG: Error with PrismJS:  Error: The language "go" has no grammar. ??

const mdParser = new Markdownit("commonmark", {
  linkify: true,
  typographer: true,
  langPrefix: "language-",
  highlight: (str, lang): string => {
    console.log(lang);
    console.log(languages[lang]);
    if (languages[lang]) {
      try {
        return (
          `<pre class="language-${lang}"><code class="language-${lang}">` +
          highlight(str, languages[lang], lang) +
          "</code></pre>"
        );
      } catch (error) {
        console.warn("Error with PrismJS: ", error);
      }
    }
    return (
      `<pre class="language-${lang}"><code class="language-${lang}">` +
      mdParser.utils.escapeHtml(str) +
      "</code></pre>"
    );
  },
}) as Markdownit;

export default mdParser;
