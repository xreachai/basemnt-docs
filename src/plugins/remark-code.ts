import { visit } from 'unist-util-visit';
import type { Element, ElementContent, Text } from 'hast';
import type { Node, Parent } from 'unist';

/**
 * Custom remark plugin: render fenced code blocks with the docs terminal
 * chrome (header bar with traffic-light dots, method/path chips, and a copy
 * button) as plain hast. Markdown compiles to static HTML, so the component
 * approach used by MDX does not apply here; emitting hast directly works for
 * the markdown pipeline and keeps the copy interaction in the global script
 * in DocLayout.
 *
 * Fence info string grammar:
 *   ```ts title=foo.ts                 → header title
 *   ```bash method=POST path=/v1/x     → method + path chips
 * Raw fences with no meta render as plain code blocks.
 */

interface CodeNode extends Node {
  lang?: string;
  meta?: string;
  value: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
    hChildren?: ElementContent[];
  };
}

interface HastElement extends Node {
  type: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: ElementContent[];
}

function el(tagName: string, properties: Record<string, unknown>, children: ElementContent[]): Element {
  return { type: 'element', tagName, properties, children } as Element;
}

function text(value: string): Text {
  return { type: 'text', value } as Text;
}

/** Build the hast chrome for one code block. */
function buildChrome(node: CodeNode, meta: Record<string, string>): ElementContent[] {
  const hasHeader = Boolean(meta['title'] || meta['method'] || meta['path']);
  const inner: ElementContent[] = [];

  if (hasHeader) {
    const headerChildren: ElementContent[] = [
      el('span', { className: ['dots'], ariaHidden: 'true' }, [
        el('i', {}, []),
        el('i', {}, []),
        el('i', {}, []),
      ]),
    ];
    if (meta['method']) {
      headerChildren.push(el('span', { className: ['method'] }, [text(meta['method'])]));
    }
    if (meta['path']) {
      headerChildren.push(el('span', { className: ['path'] }, [text(meta['path'])]));
    }
    if (meta['title']) {
      headerChildren.push(el('span', { className: ['title'] }, [text(meta['title'])]));
    }
    inner.push(el('div', { className: ['code-header'] }, headerChildren));
  }

  inner.push(
    el('button', { className: ['copy-btn'], type: 'button', ariaLabel: 'Copy code' }, [
      text('copy'),
    ]),
  );
  inner.push(
    el(
      'pre',
      node.lang ? { className: [`language-${node.lang}`] } : {},
      [el('code', {}, [text(node.value ? node.value + '\n' : '')])],
    ),
  );

  return inner;
}

/**
 * remark-rehype's code handler wraps the renamed element in a <pre>. We
 * unwrap after the fact: replace the <pre> in the hast parent with the
 * doc-code div it contains. This runs as a rehype plugin after remark-rehype.
 */
export function rehypeUnwrapCode() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Node, _index: number, parent: (Parent & { children: Node[] }) | undefined) => {
      const elem = node as unknown as HastElement;
      if (elem.tagName !== 'pre' || !parent) return;
      const first = elem.children?.[0] as HastElement | undefined;
      if (!first || first.type !== 'element' || first.tagName !== 'div' || !String((first.properties?.className ?? '')).includes('doc-code')) {
        return;
      }
      const idx = parent.children.indexOf(node);
      if (idx === -1) return;
      parent.children[idx] = first as unknown as Node;
    });
  };
}

export function remarkCode() {
  return (tree: Node) => {
    visit(tree, 'code', (node: Node) => {
      const code = node as unknown as CodeNode;
      const meta: Record<string, string> = {};
      if (code.meta) {
        for (const m of code.meta.matchAll(/(\w+)=([^\s]+)/g)) {
          meta[m[1] ?? ''] = m[2] ?? '';
        }
      }

      const hasHeader = Boolean(meta['title'] || meta['method'] || meta['path']);

      code.data = code.data ?? {};
      code.data.hName = 'div';
      code.data.hProperties = {
        className: hasHeader ? ['doc-code', 'with-header'] : ['doc-code'],
      };
      code.data.hChildren = buildChrome(code, meta);
    });
  };
}
