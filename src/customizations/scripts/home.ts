import Page from './page';

class Home extends Page {
    growSpeed = 0.006; // units per ms
    totalDurationUnits = 9; // units
    totalDuration: number = this.totalDurationUnits / this.growSpeed;// + this.heartMorphDuration;
    turnDurationUnits = 1; // ms

    animations: Animation[] = [];
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
        let svgElement = document.getElementById('logo');
        svgElement.addEventListener('touchstart', this.enterListener);
        svgElement.addEventListener('touchend', this.enterListener);
        svgElement.addEventListener('mouseenter', this.enterListener);
        svgElement.addEventListener('mouseleave', this.leaveListener);
    }

    private enterListener = (event: Event) => {
        this.animations.forEach((animation: Animation) => {
            animation.currentTime = animation.currentTime - 1; // Firefox has a bug where at max time, styles from time = 0 are displayed for 1 frame
            animation.reverse();
        });

        // If event is a touch event, prevents subsequent mouse events from firing
        event.preventDefault();
    }

    private leaveListener = (event: Event) => {
        this.animations.forEach((animation: Animation) => {
            animation.reverse();
        });

        // If event is a touch event, prevents subsequent mouse events from firing
        event.preventDefault();
    }

    protected setup(): void {
        // Heart
        let logoTranslationAnimation = document.
            getElementById('wrapper').
            animate([
                { transform: 'rotate(45deg) translate(80px, 126px)' },
                { transform: 'rotate(45deg) translate(80px, 126px)', offset: 1 / this.totalDurationUnits },
                { transform: 'rotate(0deg) translate(0px, 126px)', offset: 3 / this.totalDurationUnits },
                { transform: 'rotate(0deg) translate(0px, 0px)' }
            ], this.timingOptions);
        this.animations.push(logoTranslationAnimation);
        this.animations.push(this.createRotateAnimation('heart-left', '0,1,0,180deg', 0));
        this.animations.push(this.createRotateAnimation('heart-right', '1,0,0,180deg', 0));

        this.animations.push(this.createGrowAnimation('top-quad', 1, 1, 'X', 1));
        this.animations.push(this.createGrowAnimation('top-tri', 1, 2, 'X'));
        this.animations.push(this.createGrowAnimation('right-top-tri', 1, 2, 'Y'));
        this.animations.push(this.createGrowAnimation('right-quad', 2, 3, 'Y'));
        this.animations.push(this.createRotateAnimation('segment-one', '1,1,0,-180deg', 3));
        this.animations.push(this.createGrowAnimation('right-bottom-tri', 1, 5, 'Y'));
        this.animations.
            push(this.
                createFillAnimation(
                'right',
                [
                    { unitsFromStart: 2, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 3.5, fill: this.shadowDark, gradual: false },
                    { unitsFromStart: 4, fill: this.shadowLight, gradual: true }
                ]
                ));
        this.animations.push(this.createGrowAnimation('bottom-right-tri', 1, 5, 'X'));
        this.animations.push(this.createGrowAnimation('bottom-quad', 1, 6, 'X'));
        this.animations.push(this.createRotateAnimation('segment-two', '1,-1,0,180deg', 6));
        this.animations.push(this.createGrowAnimation('bottom-left-tri', 1, 7, 'X'));
        this.animations.
            push(this.
                createFillAnimation(
                'bottom',
                [
                    { unitsFromStart: 4, fill: this.shadowLight, gradual: false },
                    { unitsFromStart: 5.5, fill: this.shadowLight, gradual: false },
                    { unitsFromStart: 6, fill: this.baseColor, gradual: true }
                ]
                ));
        this.animations.push(this.createGrowAnimation('left-tri', 1, 7, 'Y'));
        this.animations.push(this.createRotateAnimation('left', '1,1,0,180deg', 8));
        this.animations.push(this.createGrowAnimation('left-quad', 1, 8, 'Y'));
        this.animations.
            push(this.
                createFillAnimation(
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
        let rightGradientShrinkAnimation = document.
            getElementById('right-gradient').
            animate([
                { transform: `scaleY(0)`, easing: 'step-end' },
                { transform: `scaleY(${(rightGradientLength + rightGradientShrinkLength) / rightGradientLength})`, offset: rightGradientShrinkStartOffset },
                { transform: 'scaleY(1)', offset: rightGradientShrinkEndOffset },
                { transform: 'scaleY(1)' }
            ], this.timingOptions);
        this.animations.push(rightGradientShrinkAnimation);
    }

    private createFillAnimation(elementID: string, fillChangePoints: FillChangePoint[]): Animation {
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

        return document.
            getElementById(elementID).
            animate(keyframes, this.timingOptions);
    }

    private createRotateAnimation(elementID: string, axisAndAngle: string, unitsFromStart: number): Animation {
        let startOffset = unitsFromStart / this.totalDurationUnits;
        let endOffset = startOffset + this.turnDurationUnits / this.totalDurationUnits;

        return document.
            getElementById(elementID).
            animate([
                { transform: `rotate3d(${axisAndAngle})` },
                { transform: `rotate3d(${axisAndAngle})`, offset: startOffset },
                { transform: 'rotate3d(1,1,0, 0deg)', offset: endOffset },
                { transform: 'rotate3d(1,1,0, 0deg)' }
            ], this.timingOptions);
    }

    private createGrowAnimation(elementID: string, growUnits: number, unitsFromStart: number, growAxis: string, initialLength: number = 0): Animation {
        let startOffset = unitsFromStart / this.totalDurationUnits;
        let endOffset = (unitsFromStart + growUnits) / this.totalDurationUnits;
        let startScale = initialLength / (initialLength + growUnits);

        return document.
            getElementById(elementID).
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