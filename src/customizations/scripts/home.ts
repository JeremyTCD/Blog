import Page from './page';

class Home extends Page {
    logoElement: HTMLElement;

    // Logo morph animation variables
    growSpeed = 0.006; // units per ms
    totalDurationUnits = 9; // units
    totalDuration: number = this.totalDurationUnits / this.growSpeed;// + this.heartMorphDuration;
    turnDurationUnits = 1; // ms
    logoMorphSubAnimations: Animation[] = [];
    baseColor = '#FE3D00';
    shadowDark = '#B32B00';
    shadowLight = '#e23600';
    easing = 'ease-in-out';
    timingOptions: AnimationEffectTiming = {
        duration: this.totalDuration,
        easing: this.easing,
        fill: 'both'
    };

    protected canInitialize(): boolean {
        return document.getElementById('home') ? true : false;
    }

    protected registerListeners(): void {
    }

    private enterListener = (event: Event) => {
        let firstAnimation = this.logoMorphSubAnimations[0];
        let reverse = firstAnimation.playbackRate > -1;

        if (reverse) {
            let currentTime = firstAnimation.currentTime === this.totalDuration ? firstAnimation.currentTime - 1 : firstAnimation.currentTime;

            for (let i = 0; i < this.logoMorphSubAnimations.length; i++) {
                let animation = this.logoMorphSubAnimations[i];

                animation.currentTime = currentTime;
                animation.reverse();
            }
        }

        // If event is a touch event, prevents subsequent mouse events from firing
        event.preventDefault();
    }

    private leaveListener = (event: Event) => {
        let reverse = this.logoMorphSubAnimations[0].playbackRate < 1;

        if (reverse) {
            for (let i = 0; i < this.logoMorphSubAnimations.length; i++) {
                this.logoMorphSubAnimations[i].reverse();
            }
        }

        // If event is a touch event, prevents subsequent mouse events from firing
        event.preventDefault();
    }

    protected setup(): void {
        this.logoElement = document.querySelector('.logo-animatable') as HTMLElement;

        if (this.logoElement.animate) {
            // Display the first frame (heart)
            this.createAndStartLogoMorphAnimation();

            // Pause
            for (let i = 0; i < this.logoMorphSubAnimations.length; i++) {
                this.logoMorphSubAnimations[i].pause();
            }

            this.logoElement.addEventListener('transitionend', this.waapiHeartFadeInTransitionEndListener);
        } else {
            this.logoElement.addEventListener('transitionend', this.startTextFadeIn);
        }

        // The load event fires after images and other resources have loaded and an initial render has occurred.
        // This guarantees that the fade in tranistion occurs. If transitioned-in is added after DOMContentLoaded but
        // before the first layout, chrome does not render the full transition.
        window.addEventListener('load', () => {
            // J should fade in smoothly even for browsers that do not support waapi
            this.logoElement.classList.add('transitioned-in');
        });
    }

    private startTextFadeIn = () => {
        document.querySelector('.heading-1').classList.add('transitioned-in');
        document.querySelector('p').classList.add('transitioned-in');
    }

    private waapiHeartFadeInTransitionEndListener = () => {
        this.logoElement.removeEventListener('transitionend', this.waapiHeartFadeInTransitionEndListener);

        for (let i = 0; i < this.logoMorphSubAnimations.length; i++) {
            this.logoMorphSubAnimations[i].play();
        }

        // All sub animations end at the same time
        this.logoMorphSubAnimations[0].onfinish = this.initialMorphOnFinishListener;
    }

    private initialMorphOnFinishListener = () => {
        this.logoMorphSubAnimations[0].onfinish = null;

        this.startTextFadeIn();

        this.logoElement.addEventListener('touchstart', this.enterListener);
        this.logoElement.addEventListener('touchend', this.leaveListener);
        this.logoElement.addEventListener('mouseenter', this.enterListener);
        this.logoElement.addEventListener('mouseleave', this.leaveListener);
    }

    private createAndStartLogoMorphAnimation() {
        // Heart
        let logoTranslationAnimation = this.logoElement.
            querySelector('.logo-wrapper').
            animate([
                { transform: 'rotate(45deg) translate(80px, 126px)' },
                { transform: 'rotate(45deg) translate(80px, 126px)', offset: 1 / this.totalDurationUnits },
                { transform: 'rotate(0deg) translate(0px, 126px)', offset: 3 / this.totalDurationUnits },
                { transform: 'rotate(0deg) translate(0px, 0px)' }
            ], this.timingOptions);
        this.logoMorphSubAnimations.push(logoTranslationAnimation);
        this.logoMorphSubAnimations.push(this.createLogoMorphRotateAnimation('heart-left', '0,1,0,-180deg', 0));
        this.logoMorphSubAnimations.
            push(this.
                createLogoMorphFillAnimation(
                'heart-left',
                [
                    { unitsFromStart: 0, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 1, fill: this.shadowLight, gradual: true }
                ]
                ));
        this.logoMorphSubAnimations.push(this.createLogoMorphRotateAnimation('heart-right', '1,0,0,180deg', 0));
        this.logoMorphSubAnimations.
            push(this.
                createLogoMorphFillAnimation(
                'heart-right',
                [
                    { unitsFromStart: 0, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 1, fill: this.shadowLight, gradual: true }
                ]
                ));

        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('top-quad', 1, 1, 'X', 1));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('top-tri', 1, 2, 'X'));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('right-top-tri', 1, 2, 'Y'));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('right-quad', 2, 3, 'Y'));
        this.logoMorphSubAnimations.push(this.createLogoMorphRotateAnimation('segment-one', '1,1,0,-180deg', 3));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('right-bottom-tri', 1, 5, 'Y'));
        this.logoMorphSubAnimations.
            push(this.
                createLogoMorphFillAnimation(
                'right',
                [
                    { unitsFromStart: 2, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 3.5, fill: this.shadowDark, gradual: false },
                    { unitsFromStart: 4, fill: this.shadowLight, gradual: true }
                ]
                ));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('bottom-right-tri', 1, 5, 'X'));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('bottom-quad', 1, 6, 'X'));
        this.logoMorphSubAnimations.push(this.createLogoMorphRotateAnimation('segment-two', '1,-1,0,180deg', 6));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('bottom-left-tri', 1, 7, 'X'));
        this.logoMorphSubAnimations.
            push(this.
                createLogoMorphFillAnimation(
                'bottom',
                [
                    { unitsFromStart: 5, fill: this.shadowLight, gradual: false },
                    { unitsFromStart: 6.5, fill: this.shadowLight, gradual: false },
                    { unitsFromStart: 7, fill: this.baseColor, gradual: true }
                ]
                ));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('left-tri', 1, 7, 'Y'));
        this.logoMorphSubAnimations.push(this.createLogoMorphRotateAnimation('left', '1,1,0,180deg', 8));
        this.logoMorphSubAnimations.push(this.createLogoMorphGrowAnimation('left-quad', 1, 8, 'Y'));
        this.logoMorphSubAnimations.
            push(this.
                createLogoMorphFillAnimation(
                'left',
                [
                    { unitsFromStart: 7, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 8.5, fill: this.shadowDark, gradual: false },
                    { unitsFromStart: 9, fill: this.shadowLight, gradual: true }
                ]
                ));

        // Right gradient
        let rightGradientLength = 0.0625;
        let rightGradientShrinkLength = 0.0625;
        let rightGradientShrinkStartOffset = (3 + this.turnDurationUnits / 2) / this.totalDurationUnits;
        let rightGradientShrinkEndOffset = rightGradientShrinkStartOffset + rightGradientShrinkLength / this.totalDurationUnits;
        let rightGradientShrinkAnimation = this.logoElement.
            querySelector('.right-gradient').
            animate([
                { transform: `scaleY(0)`, easing: 'step-end' },
                { transform: `scaleY(${(rightGradientLength + rightGradientShrinkLength) / rightGradientLength})`, offset: rightGradientShrinkStartOffset },
                { transform: 'scaleY(1)', offset: rightGradientShrinkEndOffset },
                { transform: 'scaleY(1)' }
            ], this.timingOptions);
        this.logoMorphSubAnimations.push(rightGradientShrinkAnimation);
    }

    private createLogoMorphFillAnimation(elementClass: string, fillChangePoints: FillChangePoint[]): Animation {
        let keyframes = [];

        fillChangePoints.
            forEach((fillChangePoint: FillChangePoint, index: number) => {
                if (index === 0) {
                    keyframes.push({ fill: fillChangePoint.fill });
                    return;
                }

                let startOffset = fillChangePoint.unitsFromStart / this.totalDurationUnits;

                if (!fillChangePoint.gradual) {
                    let previousKeyFrame = keyframes[index - 1];
                    previousKeyFrame.easing = 'step-end';
                }

                keyframes.push({ offset: startOffset, fill: fillChangePoint.fill });

                if (index == fillChangePoints.length - 1) {
                    keyframes.push({ fill: fillChangePoint.fill })
                }
            });

        return this.logoElement.
            querySelector(`.${elementClass}`).
            animate(keyframes, this.timingOptions);
    }

    private createLogoMorphRotateAnimation(elementClass: string, axisAndAngle: string, unitsFromStart: number): Animation {
        let startOffset = unitsFromStart / this.totalDurationUnits;
        let endOffset = startOffset + this.turnDurationUnits / this.totalDurationUnits;

        return this.logoElement.
            querySelector(`.${elementClass}`).
            animate([
                { transform: `rotate3d(${axisAndAngle})` },
                { transform: `rotate3d(${axisAndAngle})`, offset: startOffset },
                { transform: 'rotate3d(1,1,0, 0deg)', offset: endOffset },
                { transform: 'rotate3d(1,1,0, 0deg)' }
            ], this.timingOptions);
    }

    private createLogoMorphGrowAnimation(elementClass: string, growUnits: number, unitsFromStart: number, growAxis: string, initialLength: number = 0): Animation {
        let startOffset = unitsFromStart / this.totalDurationUnits;
        let endOffset = (unitsFromStart + growUnits) / this.totalDurationUnits;
        let startScale = initialLength / (initialLength + growUnits);

        return this.logoElement.
            querySelector(`.${elementClass}`).
            animate([
                { transform: `scale${growAxis}(${startScale})` },
                { transform: `scale${growAxis}(${startScale})`, offset: startOffset },
                { transform: `scale${growAxis}(1)`, offset: endOffset },
                { transform: `scale${growAxis}(1)` }
            ], this.timingOptions);
    }
}

interface FillChangePoint {
    unitsFromStart: number;
    fill: string;
    gradual: boolean;
}

export default new Home();