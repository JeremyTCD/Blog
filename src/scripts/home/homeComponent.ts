import RootComponent from 'scripts/shared/rootComponent';

export default class HomeComponent extends RootComponent {
    private _homeElement: HTMLElement;

    public setupImmediate(): void {
        this._homeElement = document.getElementById('home');

        if (this.enabled()) {
            let core = document.getElementById('core');
            // Update on resize
            //core.style.minHeight = `${window.innerHeight - 95}px`;
            // https://developers.google.com/web/updates/2016/12/url-bar-resizing
            // why not just use 100%?
            // - body 100%
            // - html 100%
            // - core calc(100% - 95px)
        }
    }

    public setupOnDomContentLoaded(): void {
    }

    public setupOnLoad(): void {
        let contentElement = document.querySelector('.jtcd-article .content');

        contentElement.querySelector('.logo').classList.add('transitioned-in');
        contentElement.querySelector('.header-1').classList.add('transitioned-in');
        contentElement.querySelector('p').classList.add('transitioned-in');

        //this.generateSpringKeyframes();
    }

    public enabled(): boolean {
        return this._homeElement ? true : false;
    }

    private generateSpringKeyframes() {
        let result: string = '';

        result += "@keyframes spring {";

        for (let i = 0; i <= 30; i++) {
            result += `${i/30 * 100}% {\n`;
            result += `transform: scale(${this.springDisplacement(i/30)});\n`;
            result += `}\n`;
        }

        result += '}';

        console.log(result);
    }

    // https://medium.com/@dtinth/spring-animation-in-css-2039de6e1a03
    private springDisplacement(time: number) {
        return -0.5 * Math.exp(-6 * time) * (-2 * Math.exp(6 * time) + Math.sin(12 * time) + 2 * Math.cos(12 * time));
    }
}