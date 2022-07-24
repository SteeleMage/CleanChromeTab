/**
 * Through a chain of research, a modified version of the following
 * solution is what I chose to base my implementation on:
 *
 * https://stackoverflow.com/a/55212378
 *
 **/
function applyCircularArrangement(circleContainerSelector, circleItemSelector, itemOffset, alignItemsStraightUp) {
    document.querySelectorAll(circleContainerSelector || '.ciclegraph').forEach((ciclegraph) => {
        let circles = ciclegraph.querySelectorAll(circleItemSelector||'.circle')
        let dangle = 180 / (circles.length + 1)
        let angle = 180 + 0; // TODO: Consider if this start angle needs to be done here
        for (let i = 0; i < circles.length; ++i) {
            let circle = circles[i]
            angle -= dangle
            circle.style.transform = ` rotate(${angle}deg) translate(${(ciclegraph.clientWidth + (itemOffset||0)) / 2}px) `
                + ((alignItemsStraightUp === 'undefined' || alignItemsStraightUp === true) ? ` rotate(-${angle}deg) ` : ' rotate(270deg)');
        }
    });
}