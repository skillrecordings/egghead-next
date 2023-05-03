/*
  Usage:

  const withMDX = require("@next/mdx")({
    options: {
      remarkPlugins: [
        withProse,
      ],
    },
  });
*/

const proseComponents = ['Heading']

const isJsNode = (node) => {
  return (
    ['jsx', 'import', 'export'].includes(node.type) &&
    !/^<[a-z]+(>|\s)/.test(node.value) &&
    !new RegExp(`^<(${proseComponents.join('|')})(>|\\s)`).test(node.value)
  )
}

module.exports.withProse = () => {
  return (tree) => {
    let insideProse = false
    tree.children = tree.children.flatMap((node, i) => {
      if (insideProse && isJsNode(node)) {
        insideProse = false
        return [{type: 'jsx', value: '</div>'}, node]
      }
      if (!insideProse && !isJsNode(node)) {
        insideProse = true
        return [
          {
            type: 'jsx',
            value:
              '<div className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500">',
          },
          node,
          ...(i === tree.children.length - 1
            ? [{type: 'jsx', value: '</div>'}]
            : []),
        ]
      }
      if (i === tree.children.length - 1 && insideProse) {
        return [node, {type: 'jsx', value: '</div>'}]
      }
      return [node]
    })
  }
}
