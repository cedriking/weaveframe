/**
 * WeaveFrame - Tiny Framework similar to React
 * @author Cedrik Boudreau
 * @version 1.0.0
 */

import { Component } from './component';
import { setAttribute } from './setAttribute';

export const render = (vdom: any, parent?: any) => {
  const mount = parent ? (el: Text | Element) => parent.appendChild(el) : (el: Text | Element) => el;

  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return mount(document.createTextNode(vdom.toString()));
  }

  if (typeof vdom === 'boolean' || typeof vdom === null) {
    return mount(document.createTextNode(''));
  }

  if (typeof vdom === 'object' && typeof vdom.type === 'function') {
    return Component.render(vdom, parent);
  }

  if (typeof vdom === 'object' && typeof vdom.type === 'string') {
    const dom = mount(document.createElement(vdom.type));
    for (const child of [].concat(...vdom.children)) render(child, dom);
    for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
    return dom;
  }

  throw new Error(`Invalid VDOM: ${vdom}`);
};
