import React from 'react';

export const PrismiumContent = ({
  selector = 'div',
  attributes = {},
  children,
}) => {
  return React.createElement(
    selector,
    { 'data-prismium-content': '', ...attributes },
    children
  );
};

export default PrismiumContent;
