// Custom element #2: logs a greeting when placed on the page. It never changes the DOM.
class HelloWorld extends HTMLElement {
  connectedCallback() {
    console.log('Hello World!');
  }
}

customElements.define('hello-world', HelloWorld);
