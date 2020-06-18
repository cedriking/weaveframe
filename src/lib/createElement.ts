/**
 * WeaveFrame - Tiny Framework similar to React
 * @author Cedrik Boudreau
 * @version 1.0.0
 */

export const createElement = (type: string, props: any = {}, ...children: any[]) => {
  if (!props) props = {};
  return { type, props, children };
};
