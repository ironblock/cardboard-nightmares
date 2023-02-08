function templateWithGradient(
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl }
) {
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
    output = tpl`${imports}

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
