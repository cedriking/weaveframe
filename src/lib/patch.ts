/**
 * WeaveFrame - Tiny Framework similar to React
 * @author Cedrik Boudreau
 * @version 1.0.0
 */

import { Component } from './component';
import { render } from './render';
import { setAttribute } from './setAttribute';

export const patch = (dom: any, vdom: any, parent = dom.parentNode) => {
  const replace = parent ? (el: any) => parent.replaceChild(el, dom) && el : (el: any) => el;
  if (typeof vdom === 'object' && typeof vdom.type === 'function') {
    return Component.patch(dom, vdom, parent);
  }

  if (typeof vdom !== 'object' && dom instanceof Text) {
    return dom.textContent !== vdom ? replace(render(vdom, parent)) : dom;
  }

  if (typeof vdom === 'object' && dom instanceof Text) {
    return replace(render(vdom, parent));
  }

  if (typeof vdom === 'object' && dom.nodeName !== vdom.type.toUpperCase()) {
    return replace(render(vdom, parent));
  }

  if (typeof vdom === 'object' && dom.nodeName === vdom.type.toUpperCase()) {
    const pool: any = {};
    const active: any = document.activeElement;
    [].concat(...dom.childNodes).map((child: any, index) => {
      const key = child.__weaveframeKey || `__index_${index}`;
      pool[key] = child;
    });
    [].concat(...vdom.children).map((child: any, index) => {
      const key = (child.props && child.props.key) || `__index_${index}`;
      dom.appendChild(pool[key] ? patch(pool[key], child) : render(child, dom));
      delete pool[key];
    });

    for (const key of Object.keys(pool)) {
      const instance = pool[key].__weaveframeInstance;
      if (instance) instance.componentWillUnmount();
      pool[key].remove();
    }

    for (const attr of dom.attributes) dom.removeAttribute(attr.name);
    for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);

    if (active) active.focus();
    return dom;
  }
};
