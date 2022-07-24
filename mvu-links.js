
function showMVUTitle(anchorBoxElem) {
    let mvuTitleElem = document.getElementById('mvu-active-title');
    let mvuUrlElem = document.getElementById('mvu-active-url');

    let titleHTML = anchorBoxElem.firstChild.firstChild.title
    let urlHTML = anchorBoxElem.parentElement.href;
    let nonAlphaSegments = /([^a-zA-Z0-9]+)/g;
    let insecureSegments = /(^http[:][/]{2})/g;
    let secureSegments = /(^https[:][/]{2})/g;
    titleHTML = titleHTML.replace(nonAlphaSegments, '<span class="faded">$1</span>');
    urlHTML = urlHTML.replace(insecureSegments, '<span class="caution">$1</span>');
    urlHTML = urlHTML.replace(secureSegments, '<span class="satisfied">$1</span>');

    // .anchorBox > .icon-container > IMG
    mvuTitleElem.innerHTML = titleHTML;
    // .anchorBox < A
    mvuUrlElem.innerHTML = urlHTML;
    mvuUrlElem.className = 'zap-in';
}

function clearMVUTitle() {
    let mvuTitleElem = document.getElementById('mvu-active-title');
    let mvuUrlElem = document.getElementById('mvu-active-url');

    mvuTitleElem.innerText = '';
    mvuUrlElem.innerText = '';
    mvuUrlElem.className = '';
}

function replaceWithDefaultIcon(imgElem) {
    imgElem.src = 'bookmark-ribbon-7791.svg';
}


chrome.topSites.get(function (mostVisitedUrl) {
    let linksContainer = document.getElementById('mvu-links');
    linksContainer.innerHTML = '';

    let linksHtml = '';
    let pass = 0;
    for (let currIdx in mostVisitedUrl) {
        let favIcon;
        let matches = mostVisitedUrl[currIdx].url.match(new RegExp('^(https?[:]\/\/[^\/]+)'));
        if (matches === null) {
            // TODO: Address this scenario better
            favIcon = '<div class="icon-container">'
                + '<img src="bookmark-ribbon-7791.svg" title="' + mostVisitedUrl[currIdx].title + '" />'
                + '</div>'
        } else {
            favIcon =
                '<div class="icon-container">'
                + '<img src="' + matches[1] + '/favicon.ico' + '" title="' + mostVisitedUrl[currIdx].title + '" />'
                + '</div>'
                ;
        }

        linksHtml +=
            '<div class="mvu-item">'
            + '<a href="' + mostVisitedUrl[currIdx].url + '" title="' + mostVisitedUrl[currIdx].title + '">'
            + '<div class="anchorbox">' + favIcon + '</div>'
            + '</a>'
            + '</div>';


        // Limit the number of items to show
        if (++pass >= 9) {
            break;
        }
    }

    linksContainer.innerHTML = linksHtml;


    let imgElems = document.getElementsByTagName('IMG');
    for (let idx=0; idx<imgElems.length; idx++) {
        imgElems[idx].addEventListener('error', function (e) {
            replaceWithDefaultIcon(e.target);
        });
    }

    let anchorBoxElems = document.getElementsByClassName('anchorbox');
    for (let idx=0; idx<anchorBoxElems.length; idx++) {
        anchorBoxElems[idx].addEventListener('mouseenter', function (e) {
            showMVUTitle(e.target);
        });

        anchorBoxElems[idx].addEventListener('mouseleave', function (e) {
            clearMVUTitle();
        });
    }


    applyCircularArrangement(
        '#mvu-links',
        '.mvu-item',
        -25,
        false
    );

    window.addEventListener('resize', function (e) {
        applyCircularArrangement(
            '#mvu-links',
            '.mvu-item',
            -25,
            false
        );
    });
});