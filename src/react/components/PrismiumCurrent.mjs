import React from 'react';

export const PrismiumCurrent = ({ selector = 'div', attributes = {}, children }) => {
  return React.createElement(
    selector,
    { 'data-prismium-current': '', ...attributes },
    children
  );
};

export default PrismiumCurrent;
