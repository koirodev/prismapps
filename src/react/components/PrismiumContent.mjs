import React from 'react';

export const PrismiumContent = ({
  selector = 'div',
  attributes = {},
  children,
  ...restProps
}) => {
  return React.createElement(
    selector,
    {
      'data-prismium-content': '',
      ...restProps,
      ...attributes,
    },
    children
  );
};

export default PrismiumContent;
