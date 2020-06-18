/**
 * WeaveFrame - Tiny Framework similar to React
 * @author Cedrik Boudreau
 * @version 1.0.0
 */

import { render } from './render';
import { patch } from './patch';

export class Component {
  public props: any;
  public state: any = null;
  private base: any;

  constructor(props: any = {}) {
    this.props = props || {};
  }

  public static render(vdom: any, parent: any = null): any {
    const props = Object.assign({}, vdom.props, { children: vdom.children });

    if (Component.isPrototypeOf(vdom.type)) {
      const instance = new vdom.type(props);
      instance.componentWillUnmount();
      instance.base = render(instance.render(), parent);
      instance.base.__weaveframeInstance = instance;
      instance.base.__weaveframeKey = vdom.props.key;
      instance.componentDidMount();
      return instance.base;
    }

    return render(vdom.type(props), parent);
  }

  public static patch(dom: any, vdom: any, parent: any = dom.parentNode): any {
    const props = Object.assign({}, vdom.props, { children: vdom.children });

    if (dom.__weaveframeInstance && dom.__weaveframeInstance.constructor === vdom.type) {
      dom.__weaveframeInstance.componentWillReceiveProps(props);
      dom.__weaveframeInstance.props = props;
      return patch(dom, dom.__weaveframeInstance.render(), parent);
    }

    if (Component.isPrototypeOf(vdom.type)) {
      const ndom = Component.render(vdom, parent);
      return parent ? parent.replaceChild(ndom, dom) && ndom : ndom;
    }

    return patch(dom, vdom.type(props), parent);
  }

  public setState(next: any) {
    const compat = (a: any) => typeof this.state === 'object' && typeof a === 'object';
    if (this.base && this.shouldComponentUpdate(this.props, next)) {
      const prevState = this.state;
      this.componentWillUpdate(this.props, next);
      this.state = compat(next) ? Object.assign({}, this.state, next) : next;
      // @ts-ignore
      patch(this.base, this.render());
      this.componentDidUpdate(this.props, prevState);
    } else {
      this.state = compat(next) ? Object.assign({}, this.state, next) : next;
    }
  }

  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    return nextProps !== this.props || nextState !== this.state;
  }

  public componentWillReceiveProps(nextProps: any) {
    return;
  }

  public componentWillUpdate(nextProps: any, nextState: any) {
    return;
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    return;
  }

  public componentWillMount() {
    return;
  }

  public componentDidMount() {
    return;
  }

  public componentWillUnmount() {
    return;
  }
}
