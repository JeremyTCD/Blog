import Page from './page';

class Home extends Page {
    protected canInitialize(): boolean {
        return document.getElementById('home') ? true : false;
    }

    protected setup(): void {
        let growSpeed = 0.7; // pixels per second
        let squareWidth = 80; // pixels
        let turnDuration = 150; // ms

        // Top quad
        let topQuadTotalLength = 240;
        let topQuadInitialLength = 80;
        let topQuadGrowLength = topQuadTotalLength - topQuadInitialLength;
        let topQuadGrowDuration = topQuadGrowLength / growSpeed;
        let topQuadFrames = [
            { transform: `scaleX(${topQuadInitialLength / topQuadTotalLength})` },
            { transform: 'scaleX(1)' },
        ];
        let topQuadTiming = {
            duration: topQuadGrowDuration
        };
        document.
            getElementById('top-quad').
            animate(topQuadFrames, topQuadTiming);

        // Right translate
        let rightTranslateDistance = topQuadGrowLength;
        let rightTranslateDuration = rightTranslateDistance / growSpeed;
        let rightTranslateFrames = [
            { transform: `translateY(-${rightTranslateDistance}px)` },
            { transform: `translateY(0px)` },
        ]
        let rightTranslateTiming = {
            duration: rightTranslateDuration,
        };
        let right = document.
            getElementById('right');
        right.animate(rightTranslateFrames, rightTranslateTiming);

        // Right quad
        let rightQuadGrowLength = 240;
        let rightQuadGrowDuration = rightTranslateDuration + rightQuadGrowLength / growSpeed;
        let rightQuadFrames = [
            { transform: `scaleY(0)` },
            { transform: `scaleY(0)`, offset: rightTranslateDuration / rightQuadGrowDuration },
            { transform: 'scaleY(1)' },
        ];
        let rightQuadTiming = {
            duration: rightQuadGrowDuration
        };
        document.
            getElementById('right-quad').
            animate(rightQuadFrames, rightQuadTiming);

        // Segment one
        let segmentOneTurnStartTime = topQuadGrowDuration;
        let segmentOneDuration = segmentOneTurnStartTime + turnDuration;
        let segmentOneTurnOffset = segmentOneTurnStartTime / segmentOneDuration;
        let segmentOneFrames = [
            { transform: 'rotate3d(1,1,0,180deg)' },
            { transform: 'rotate3d(1,1,0,180deg)', offset: segmentOneTurnOffset },
            { transform: 'rotate3d(1,1,0,0deg)' }
        ];
        let segmentOneTiming = {
            duration: segmentOneDuration,
            easing: 'linear'
        }
        document.
            getElementById('segment-one').
            animate(segmentOneFrames, segmentOneTiming);

        // Right fill
        let rightFillDuration = segmentOneDuration;
        let rightFillStartTime = segmentOneTurnStartTime + turnDuration / 2;
        let rightFillFrames = [
            { fill: '#FE3D00', easing: 'step-end' },
            { fill: '#cb3100', offset: rightFillStartTime / rightFillDuration },
            { fill: '#e23600' }
        ]
        let rightFillTiming = {
            duration: rightFillDuration,
        }
        right.animate(rightFillFrames, rightFillTiming);

        // Bottom translate
        let bottomTranslateDistance = topQuadGrowLength + rightQuadGrowLength;
        let bottomTranslateDuration = bottomTranslateDistance / growSpeed;
        let bottomTranslateFrames = [
            { transform: `translateX(${bottomTranslateDistance}px)` },
            { transform: `translateX(0px)` },
        ]
        let bottomTranslateTiming = {
            duration: bottomTranslateDuration,
        };
        let bottom = document.
            getElementById('bottom');
        bottom.animate(bottomTranslateFrames, bottomTranslateTiming);

        // Bottom quad
        let bottomQuadGrowLength = 160;
        let bottomQuadGrowDuration = bottomTranslateDuration + bottomQuadGrowLength / growSpeed;
        let bottomQuadFrames = [
            { transform: `scaleX(0)` },
            { transform: `scaleX(0)`, offset: bottomTranslateDuration / bottomQuadGrowDuration },
            { transform: 'scaleX(1)' },
        ];
        let bottomQuadTiming = {
            duration: bottomQuadGrowDuration
        };
        document.
            getElementById('bottom-quad').
            animate(bottomQuadFrames, bottomQuadTiming);

        // Segment two
        let segmentTwoTurnStartTime = rightQuadGrowDuration;
        let segmentTwoDuration = segmentTwoTurnStartTime + turnDuration;
        let segmentTwoTurnOffset = segmentTwoTurnStartTime / segmentTwoDuration;
        let segmentTwoFrames = [
            { transform: 'rotate3d(1,-1,0,-180deg)' },
            { transform: 'rotate3d(1,-1,0,-180deg)', offset: segmentTwoTurnOffset },
            { transform: 'rotate3d(1,-1,0,0deg)' }
        ];
        let segmentTwoTiming = {
            duration: segmentTwoDuration,
        }
        document.
            getElementById('segment-two').
            animate(segmentTwoFrames, segmentTwoTiming);

        // Bottom fill
        let bottomFillDuration = segmentTwoDuration;
        let bottomFillStartTime = segmentTwoTurnStartTime + turnDuration / 2;
        let bottomFillFrames = [
            { fill: '#FE3D00', easing: 'step-end' },
            { fill: '#cb3100', offset: rightFillStartTime / bottomFillDuration },
            { fill: '#e23600', offset: rightFillDuration / bottomFillDuration },
            { fill: '#e23600', easing: 'step-start', offset: bottomFillStartTime / bottomFillDuration },
            { fill: '#FE3D00' }
        ]
        let bottomFillTiming = {
            duration: bottomFillDuration,
        }
        bottom.animate(bottomFillFrames, bottomFillTiming);

        // Left translate
        let leftTranslateDistance = topQuadGrowLength + rightQuadGrowLength + bottomQuadGrowLength;
        let leftTranslateDuration = leftTranslateDistance / growSpeed;
        let leftTranslateFrames = [
            { transform: `translateY(${leftTranslateDistance}px)` },
            { transform: `translateY(0px)` },
        ]
        let leftTranslateTiming = {
            duration: leftTranslateDuration,
        };
        let left = document.
            getElementById('left');
        left.animate(leftTranslateFrames, leftTranslateTiming);

        // Left quad
        let leftQuadGrowLength = 80;
        let leftQuadGrowDuration = leftTranslateDuration + leftQuadGrowLength / growSpeed;
        let leftQuadFrames = [
            { transform: `scaleY(0)` },
            { transform: `scaleY(0)`, offset: leftTranslateDuration / leftQuadGrowDuration },
            { transform: 'scaleY(1)' },
        ];
        let leftQuadTiming = {
            duration: leftQuadGrowDuration
        };
        document.
            getElementById('left-quad').
            animate(leftQuadFrames, leftQuadTiming);

        // Segment three
        let segmentThreeTurnStartTime = bottomQuadGrowDuration;
        let segmentThreeDuration = segmentThreeTurnStartTime + turnDuration;
        let segmentThreeTurnOffset = segmentThreeTurnStartTime / segmentThreeDuration;
        let segmentThreeFrames = [
            { transform: 'rotate3d(1,1,0,180deg)' },
            { transform: 'rotate3d(1,1,0,180deg)', offset: segmentThreeTurnOffset },
            { transform: 'rotate3d(1,1,0,0deg)' }
        ];
        let segmentThreeTiming = {
            duration: segmentThreeDuration,
        }
        document.
            getElementById('segment-three').
            animate(segmentThreeFrames, segmentThreeTiming);

        // Left fill
        let leftFillDuration = segmentThreeDuration;
        let leftFillStartTime = segmentThreeTurnStartTime + turnDuration / 2;
        let leftFillFrames = [
            { fill: '#FE3D00', easing: 'step-end' },
            { fill: '#cb3100', offset: rightFillStartTime / leftFillDuration },
            { fill: '#e23600', easing: 'step-end', offset: rightFillDuration / leftFillDuration },
            { fill: '#FE3D00', easing: 'step-end', offset: bottomFillStartTime / leftFillDuration },
            { fill: '#cb3100', offset: leftFillStartTime / leftFillDuration },
            { fill: '#e23600' }
        ]
        let leftFillTiming = {
            duration: leftFillDuration,
        }
        left.animate(leftFillFrames, leftFillTiming);
    }

    protected registerListeners(): void {
    }
}

export default new Home();