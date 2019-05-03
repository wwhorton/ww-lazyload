function lazyLoad( params ) {
    const callback = (params.callback) ? params.callback : null;
    const next = (params.nextLinkSelector) ? params.nextLinkSelector : null;
    const dataContainerSelector = (params.dataContainer) ? params.dataContainer : null;

    const loadingIcon = document.createElement("div");
    loadingIcon.classList.add("small-2", "small-offset-5", "text-center", "columns");
    loadingIcon.innerHTML = '<i class="loading-spinner fa fa-spinner fa-spin fa-5x" aria-hidden="true" />';
    loadingIcon.id = "loading-icon";

    function _loadNext() {
        const nextLink = document.querySelector(next);

        window.removeEventListener('scroll', _throttledLoadOnScroll);
        if (nextLink && nextLink.hasAttribute("href")) {
            const containers = Array.from(document.querySelectorAll(dataContainerSelector));
            const request = new Request(document.querySelector(next).getAttribute("href") + ' ' + dataContainerSelector);

            containers[containers.length - 1].parentNode.appendChild(loadingIcon);
            fetch(request).then( (response) => {
                response.text().then( (text) => {
                    const newContainer = document.querySelector(dataContainerSelector).cloneNode(true);

                    newContainer.innerHTML = text;
                    nextLink.parentNode.removeChild(nextLink);
                    document.querySelector("#loading-icon").parentNode.removeChild(document.querySelector("#loading-icon"));
                    containers[containers.length - 1].parentNode.appendChild(newContainer.querySelector(dataContainerSelector));
                    if (callback) {
                        callback();
                    }
                    window.addEventListener('scroll', _throttledLoadOnScroll);
                } );
            });
        }
    }
    function _loadOnScroll() {
        const dataContainers = document.querySelectorAll(dataContainerSelector);
        const dataContainerLength = Array.from(dataContainers).reduce( (acc, el) => {
            return acc + el.getBoundingClientRect().height;
        }, 0);
        const scrollTop = ( document.scrollingElement ) ? document.scrollingElement.scrollTop : document.body.scrollTop;

        if ( scrollTop + window.innerHeight >= dataContainerLength ) {
            _loadNext();
        }
    }
    function _throttledLoadOnScroll() {
        let wait = false;
        if( !wait ){
            _loadOnScroll();
            wait = true;
            setTimeout( () => wait = false, 200 );
        }
    }
    window.addEventListener('scroll', _throttledLoadOnScroll);
}

export { lazyLoad };