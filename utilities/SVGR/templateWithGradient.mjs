function templateWithGradient(
  { template },
  opts,
  { imports, interfaces, componentName, props, jsx, exports }
) {
  const plugins = ["svgo", "jsx", "prettier"];

  if (opts.typescript) {
    plugins.push("typescript");
  }

  const typeScriptTpl = template.smart({ plugins });

  let allowAdditionalChildren;
  try {
    allowAdditionalChildren = {
      type: "JSXExpressionContainer",
      expression: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "props",
        },
        property: {
          type: "Identifier",
          name: "children",
        },
        computed: false,
      },
    };
    jsx.children.unshift(allowAdditionalChildren);
  } catch (error) {
    console.error(error);
  }

  let output;

  try {
    output = typeScriptTpl.ast`${imports}

    ${interfaces}

    function ${componentName}(${props}) {
      return ${jsx};
    }
    ${exports}
      `;
  } catch (error) {
    console.error(error);
    output = `// ERROR: ${error}`;
  }

  return output;
}

export default templateWithGradient;
