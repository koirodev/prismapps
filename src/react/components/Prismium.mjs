import React, { useRef, useEffect } from 'react';
import { deepMerge } from '../../utils/deepMerge.mjs';
import PrismiumCore from '../../core/core.mjs';

export const Prismium = ({
  options = {},
  modules = [],
  children,
  ...extraProps
}) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  if (modules.length) {
    PrismiumCore.use(modules);
  }

  const mergedOptions = deepMerge({}, options);

  const eventNames = [
    'beforeInit',
    'init',
    'afterInit',
    'beforeOpen',
    'open',
    'afterOpen',
    'beforeClose',
    'close',
    'afterClose',
    'beforeDestroy',
    'destroy',
    'afterDestroy',
    'effectStart',
    'effectEnd',
  ];

  // Извлекаем события из отдельных пропсов
  const eventOverrides = eventNames.reduce((acc, eventName) => {
    if (extraProps[eventName]) acc[eventName] = extraProps[eventName];
    return acc;
  }, {});

  const defaultEvents = {
    beforeInit: () =>
      mergedOptions.emit &&
      mergedOptions.emit('beforeInit', instanceRef.current),
    init: () =>
      mergedOptions.emit && mergedOptions.emit('init', instanceRef.current),
    afterInit: () =>
      mergedOptions.emit &&
      mergedOptions.emit('afterInit', instanceRef.current),
    beforeOpen: () =>
      mergedOptions.emit &&
      mergedOptions.emit('beforeOpen', instanceRef.current),
    open: () =>
      mergedOptions.emit && mergedOptions.emit('open', instanceRef.current),
    afterOpen: () =>
      mergedOptions.emit &&
      mergedOptions.emit('afterOpen', instanceRef.current),
    beforeClose: () =>
      mergedOptions.emit &&
      mergedOptions.emit('beforeClose', instanceRef.current),
    close: () =>
      mergedOptions.emit && mergedOptions.emit('close', instanceRef.current),
    afterClose: () =>
      mergedOptions.emit &&
      mergedOptions.emit('afterClose', instanceRef.current),
    beforeDestroy: () =>
      mergedOptions.emit &&
      mergedOptions.emit('beforeDestroy', instanceRef.current),
    destroy: () =>
      mergedOptions.emit && mergedOptions.emit('destroy', instanceRef.current),
    afterDestroy: () =>
      mergedOptions.emit &&
      mergedOptions.emit('afterDestroy', instanceRef.current),
    effectStart: () =>
      mergedOptions.emit &&
      mergedOptions.emit('effectStart', instanceRef.current),
    effectEnd: () =>
      mergedOptions.emit &&
      mergedOptions.emit('effectEnd', instanceRef.current),
  };

  const providedEvents = {
    ...(mergedOptions.on || {}),
    ...(mergedOptions.events || {}),
    ...eventOverrides,
  };

  const combinedEvents = { ...defaultEvents, ...providedEvents };
  const finalOptions = { ...mergedOptions, on: combinedEvents };

  useEffect(() => {
    if (containerRef.current) {
      try {
        instanceRef.current = new PrismiumCore(
          containerRef.current,
          finalOptions
        );
      } catch (error) {
        console.error('Failed to initialize Prismium:', error);
      }
    }
    return () => {
      try {
        if (instanceRef.current && instanceRef.current.destroy) {
          instanceRef.current.destroy();
        }
      } catch (error) {
        console.error('Error during destroy:', error);
      }
    };
  }, []);

  return React.createElement(
    'div',
    {
      ref: containerRef,
      'data-prismium': '',
      ...extraProps,
    },
    children
  );
};

export default Prismium;
