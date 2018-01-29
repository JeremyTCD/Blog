import Page from './page';

class Home extends Page {
    logoElement: HTMLElement;

    protected canInitialize(): boolean {
        return document.getElementById('home') ? true : false;
    }

    protected registerListeners(): void {
    }

    protected setup(): void {
        this.logoElement = document.getElementById('content-logo');

        // The load event fires after images and other resources have loaded and an initial render has occurred.
        // This guarantees that the fade in tranistion occurs. If transitioned-in is added after DOMContentLoaded but
        // before the first layout, the browser may not render the full transition.
        window.addEventListener('load', () => {
            this.logoElement.classList.add('transitioned-in');
            let titleElement = document.getElementById('hello-welcome-to-my-blog');
            titleElement.classList.add('transitioned-in');
            titleElement.parentElement.querySelector('h1 + p').classList.add('transitioned-in');
        });
    }
}

export default new Home();