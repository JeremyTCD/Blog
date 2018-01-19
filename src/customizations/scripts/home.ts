import Page from './page';

class Home extends Page {
    growSpeed = 0.004375; // units per ms
    totalLength = 8; // units
    heartMorphDuration = 300; //ms
    totalDuration: number = this.totalLength / this.growSpeed;// + this.heartMorphDuration;
    turnDurationUnits = 1; // ms

    animations: Animation[] = [];
    baseColor = '#FE3D00';
    shadowDark = '#B32B00';
    shadowLight = '#e23600';
    bright = '#FE501A';
    easing = 'ease-in-out';
    timingOptions: AnimationEffectTiming = {
        duration: this.totalDuration,
        easing: this.easing,
        fill: 'both'
    };

    protected canInitialize(): boolean {
        return document.getElementById('home') ? true : false;
    }

    protected setup(): void {
        // Listener
        let svgElement = document.getElementById('logo');
        svgElement.addEventListener('mouseenter', (event: MouseEvent) => {
            if (event.target === event.currentTarget) {
                this.animations.forEach((animation: Animation) => {
                    animation.currentTime = Math.floor(animation.currentTime); // Firefox has a bug where if currentTime is not rounded down, the animation end flashes

                    animation.reverse();
                });
            }
        });
        svgElement.addEventListener('mouseleave', (event: MouseEvent) => {
            if (event.target === event.currentTarget) {
                this.animations.forEach((animation: Animation) => {
                    animation.reverse();
                });
            }
        });

        this.animations.push(this.createGrowAnimation('top-quad', 1, 0, 'X', 1));
        this.animations.push(this.createGrowAnimation('top-tri', 1, 1, 'X'));
        this.animations.push(this.createGrowAnimation('right-top-tri', 1, 1, 'Y'));
        this.animations.push(this.createGrowAnimation('right-quad', 2, 2, 'Y'));
        this.animations.push(this.createRotateAnimation('segment-one', '1,1,0,-180deg', 2));
        this.animations.push(this.createGrowAnimation('right-bottom-tri', 1, 4, 'Y'));
        this.animations.
            push(this.
                createFillAnimation(
                'right',
                [
                    { unitsFromStart: 1, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 2.5, fill: this.shadowDark, gradual: false },
                    { unitsFromStart: 3, fill: this.shadowLight, gradual: true }
                ]
                ));
        this.animations.push(this.createGrowAnimation('bottom-right-tri', 1, 4, 'X'));
        this.animations.push(this.createGrowAnimation('bottom-quad', 1, 5, 'X'));
        this.animations.push(this.createRotateAnimation('segment-two', '1,-1,0,180deg', 5));
        this.animations.push(this.createGrowAnimation('bottom-left-tri', 1, 6, 'X'));
        this.animations.
            push(this.
                createFillAnimation(
                'bottom',
                [
                    { unitsFromStart: 4, fill: this.shadowLight, gradual: false },
                    { unitsFromStart: 5.5, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 6, fill: this.baseColor, gradual: true }
                ]
                ));
        this.animations.push(this.createGrowAnimation('left-tri', 1, 6, 'Y'));
        this.animations.push(this.createRotateAnimation('left', '1,1,0,180deg', 7));
        this.animations.push(this.createGrowAnimation('left-quad', 1, 7, 'Y'));
        this.animations.
            push(this.
                createFillAnimation(
                'left',
                [
                    { unitsFromStart: 6, fill: this.baseColor, gradual: false },
                    { unitsFromStart: 7.5, fill: this.shadowDark, gradual: false },
                    { unitsFromStart: 8, fill: this.shadowLight, gradual: true }
                ]
                ));

         // Heart
        //let logoTranslationAnimation = document.
        //    getElementById('logo-animatable').
        //    animate([
        //        { transform: 'translate(80px, 120px)' },
        //        { transform: 'translate(0px, 120px)', offset: 2 / this.totalLength},
        //        { transform: 'translate(0px, 0px)' }
        //    ], this.timingOptions);
        //this.animations.push(logoTranslationAnimation);

        // Right gradient
        let rightGradientLength = 0.25;
        let rightGradientShrinkLength = 0.25;
        let rightGradientShrinkStartOffset = (2 + this.turnDurationUnits / 2) / this.totalLength;
        let rightGradientShrinkEndOffset = rightGradientShrinkStartOffset + rightGradientShrinkLength / this.totalLength;
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

                let startOffset = fillChangePoint.unitsFromStart / this.totalLength;

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
        let startOffset = unitsFromStart / this.totalLength;
        let endOffset = startOffset + this.turnDurationUnits / this.totalLength;

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
        let startOffset = unitsFromStart / this.totalLength;
        let endOffset = (unitsFromStart + growUnits) / this.totalLength;
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

    protected registerListeners(): void {
    }
}

interface FillChangePoint {
    unitsFromStart: number;
    fill: string;
    gradual: boolean;
}

export default new Home();