import React from 'react';

export const PrismiumCurrent = ({
  selector = 'div',
  attributes = {},
  children,
  ...restProps
}) => {
  return React.createElement(
    selector,
    {
      'data-prismium-current': '',
      ...restProps,
      ...attributes,
    },
    children
  );
};

export default PrismiumCurrent;
