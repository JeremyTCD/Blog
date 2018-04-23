import { RootComponent } from 'mimo-website/components'

export default class HomeComponent extends RootComponent {
    private _coreElement: HTMLElement;
    private _homeElement: HTMLElement;
    private _mainElement: HTMLElement;
    private _logoElement: HTMLElement;
    private _contentElement: HTMLElement;
    private _header1Element: HTMLElement;
    private _pElement: HTMLElement;

    private _lastWindowInnerWidth: number;
    private _lastWindowInnerHeight: number;

    private WINDOW_LOGO_HEIGHT_RATIO = 2.4;
    private BOTTOM_TOP_GAP_HEIGHT_RATIO = 1.08;
    private MIN_TOP_GAP = 95;
    private MIN_BOTTOM_GAP = 59;
    private MIN_LOGO_HEIGHT = 200;
    // Text naturally have to and bottom gaps due to acenders/decenders
    private P_BOTTOM_GAP = 6;

    public setupImmediate(): void {
        this._homeElement = document.getElementById('home');

        if (this.enabled()) {
            this._coreElement = document.getElementById('core');
            this._contentElement = document.querySelector('.jtcd-article .content');
            this._mainElement = document.querySelector('main') as HTMLElement;
            this._logoElement = this._contentElement.querySelector('.logo') as HTMLElement;
            this._header1Element = this._contentElement.querySelector('.header-1');
            this._pElement = this._contentElement.querySelector('p');
        }
    }

    public setupOnDomContentLoaded(): void {
    }

    public setupOnLoad(): void {
        this.updateContent();

        window.addEventListener('resize', this.updateContent);

        this._logoElement.classList.add('transitioned-in');
        this._header1Element.classList.add('transitioned-in');
        this._pElement.classList.add('transitioned-in');
    }

    private updateContent = () => {
        // Don't update if only height of window changes (avoids updating of the layout when url bar scrolls out on mobiles)
        // Don't update if width changes but height does not change (nothing to update)
        let windowInnerWidth = window.innerWidth;
        let windowInnerHeight = window.innerHeight;
        if (windowInnerWidth === this._lastWindowInnerWidth || windowInnerHeight === this._lastWindowInnerHeight) {
            return;
        }
        this._lastWindowInnerWidth = windowInnerWidth;
        this._lastWindowInnerHeight = windowInnerHeight;

        // Setup gaps, in order of preference:
        // - Make logo 1/2.4 of window.innerHeight, split spare height between top and bottom gaps, with bottom gap = 1.15 * top gap and top gap is no less than 95px
        // - If 1/2.15 of the spare height is less than 95px, fix top gap to 95 px. If the remaining spare height is less than 59px, reduce logo height so that bottom gap is at least 59px. If logo height is 
        //   reduced to less than 200px, fix it at 200px and add a margin bottom to main so that there is at least 59px between text and next section.
        let pStyle = getComputedStyle(this._pElement);
        let header1Style = getComputedStyle(this._header1Element);
        let textHeight = parseFloat(pStyle.height) + parseFloat(pStyle.marginTop) + parseFloat(header1Style.height) + parseFloat(header1Style.marginTop) - this.P_BOTTOM_GAP;
        // Divisible by 4 since width = 3/4 * height
        let idealLogoHeight = Math.floor((windowInnerHeight / this.WINDOW_LOGO_HEIGHT_RATIO) / 4) * 4;
        let spareHeight = windowInnerHeight - idealLogoHeight - textHeight;

        // Bottom gap = top gap * BOTTOM_TOP_GAP_HEIGHT_RATIO
        let idealTopGap = spareHeight / (1 + this.BOTTOM_TOP_GAP_HEIGHT_RATIO);
        let idealBottomGap = 0;
        // Min top gap
        if (idealTopGap < this.MIN_TOP_GAP) {
            idealTopGap = this.MIN_TOP_GAP;

            // Min bottom gap
            let bottomGap = spareHeight - idealTopGap;
            if (bottomGap < this.MIN_BOTTOM_GAP) {
                idealLogoHeight = idealLogoHeight - (this.MIN_BOTTOM_GAP - bottomGap);

                if (idealLogoHeight < this.MIN_LOGO_HEIGHT) {
                    idealLogoHeight = this.MIN_LOGO_HEIGHT;
                    // Push footer down
                    idealBottomGap = this.MIN_BOTTOM_GAP;
                }
            }
        }

        this._mainElement.style.marginBottom = `${idealBottomGap}px`;
        this._mainElement.style.marginTop = `${idealTopGap - this.MIN_TOP_GAP}px`;
        this._logoElement.style.height = `${idealLogoHeight}px`;
        this._logoElement.style.width = `${0.75 * idealLogoHeight}px`;

        // By default core element's minHeight is calc(100vh - this.MIN_TOP_GAP), since 100vh can include the url bar on mobiles, windowInnerHeight - this.MIN_TOP_GAP is used to gaurantee that the landing page appears as expected by default
        this._coreElement.style.minHeight = `${windowInnerHeight - this.MIN_TOP_GAP}px`;
    }

    public enabled(): boolean {
        return this._homeElement ? true : false;
    }
}