import stripTypeScriptTypes from "ts-blank-space";

export function removeTypescriptFromTsFile(content) {
  return stripTypeScriptTypes(content);
}

export function removeTypescriptFromSvelteFile(content) {
  content = removeScriptAttribute(content, 'lang');
  content = removeScriptAttribute(content, 'generics');
  content = processScriptContents(content);
  content = processSvelteMarkup(content);

  return content;
}

/**
 * Removes specified attributes from script tags
 * @param {string} html - HTML/Svelte content
 * @param {string} attrName - Attribute name to remove
 * @returns {string} - HTML with the attribute removed
 */
function removeScriptAttribute(content, attrName) {
  // Handle double-quoted attributes
  let result = content.replace(
    new RegExp(`(<script[^>]*?)\\s+${attrName}="[^"]*"([^>]*>)`, 'g'),
    "$1$2"
  );

  // Handle single-quoted attributes
  result = result.replace(
    new RegExp(`(<script[^>]*?)\\s+${attrName}='[^']*'([^>]*>)`, 'g'),
    "$1$2"
  );

  // Handle unquoted attributes
  result = result.replace(
    new RegExp(`(<script[^>]*?)\\s+${attrName}=[^\\s>"']+([^>]*>)`, 'g'),
    "$1$2"
  );

  return result;
}

const processScriptContents = (html) => html.replace(
  /(<script[^>]*>)([\s\S]*?)(<\/script>)/g,
  (_, openTag, content, closeTag) => openTag + stripTypeScriptTypes(content) + closeTag,
);

/**
 * Removes TypeScript syntax from Svelte markup (outside script and style tags)
 * @param {string} content - The Svelte file content
 * @returns {string} - Processed content with TypeScript removed from markup
 */
function processSvelteMarkup(content) {
  // Helper to extract tag segments
  function extractTags(content, tagPattern) {
    const segments = [];
    let lastIndex = 0;

    // Find all instances of the tag
    const matches = Array.from(content.matchAll(tagPattern));

    for (const match of matches) {
      // Add content before the tag
      if (match.index > lastIndex) {
        segments.push({
          type: 'content',
          content: content.substring(lastIndex, match.index)
        });
      }

      // Add the tag itself
      segments.push({
        type: 'tag',
        content: match[0]
      });

      lastIndex = match.index + match[0].length;
    }

    // Add final content after the last tag
    if (lastIndex < content.length) {
      segments.push({
        type: 'content',
        content: content.substring(lastIndex)
      });
    }

    return segments;
  }

  // Extract script and style tags to exclude them from processing
  const scriptStylePattern = /<(script|style)[\s\S]*?<\/\1>/gi;
  const segments = extractTags(content, scriptStylePattern);

  // Process only content segments (outside script/style tags)
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].type === 'content') {
      let processed = segments[i].content;

      // Process #snippet with type annotations
      processed = processed.replace(
        /{#snippet\s+([^(}]+)\(([^)]+?)(?::\s*[^,)]+)?(?:,\s*([^):]+)(?::\s*[^,)]+)?)*\)}/g,
        (match) => {
          // Remove all type annotations from parameters
          return match.replace(/:\s*[^,)]+/g, '');
        }
      );

      // Process @const with type annotations
      processed = processed.replace(
        /{@const\s+([^:=]+)\s*:\s*[^=]+\s*=\s*([^}]+)}/g,
        (match, varName, expression) => {
          // Remove any 'as Type' assertions in the expression
          const cleanedExpression = expression.replace(/\s+as\s+[A-Za-z0-9_<>|&[\]]+/g, '');
          return `{@const ${varName} = ${cleanedExpression}}`;
        }
      );

      // Process event handlers with TypeScript annotations
      processed = processed.replace(
        /on(\w+)={\(([^)]*?):[^)]*\)(?::\s*[^=]*?)?\s*=>\s*([^}]*)}/g,
        (match, eventName, params, body) => {
          // Remove any remaining type assertions from the body
          body = body.replace(/\s+as\s+[A-Za-z0-9_<>|&[\]]+/g, '');
          return `on${eventName}={(${params.trim()}) => ${body}}`;
        }
      );

      // Process curly braces with type assertions (but preserve #each)
      processed = processed.replace(
        /{([^{}#@]*)\s+as\s+[A-Za-z0-9_<>|&[\]]+\s*}/g,
        '{$1}'
      );

      segments[i].content = processed;
    }
  }

  // Reassemble the file
  return segments.map(segment => segment.content).join('');
}
