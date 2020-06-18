/**
 * WeaveFrame - Tiny Framework similar to React
 * @author Cedrik Boudreau
 * @version 1.0.0
 */

export const setAttribute = (dom: any, key: string, value: any) => {
  if (typeof value === 'function' && key.startsWith('on')) {
    const evType = key.slice(2).toLowerCase();

    dom.__weaveframeHandles = dom.__weaveframeHandles || {};
    dom.removeEventListener(evType, dom.__weaveframeHandles[evType]);
    dom.__weaveframeHandles[evType] = value;
    dom.addEventListener(evType, dom.__weaveframeHandles[evType]);

  } else if (key === 'checked' || key === 'value' || key === 'className') {
    // @ts-ignore
    dom[key] = value;

  } else if (key === 'style' && typeof value === 'object') {
    Object.assign(dom.style, value);

  } else if (key === 'ref' && typeof value === 'function') {
    value(dom);

  } else if (key === 'key') {
    dom.__weaveframeKey = value;

  } else if ((typeof value !== 'object' && typeof value !== 'function') && dom.setAttribute) {
    dom.setAttribute(key, value);
  }
};
