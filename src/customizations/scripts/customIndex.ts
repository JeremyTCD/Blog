import home from './home';

if (document.readyState === "interactive" || document.readyState === "loaded") {
    home.onDomContentLoaded();
} else {
    document.addEventListener('DomContentLoaded', home.onDomContentLoaded);
}

if (document.readyState === "complete") {
    home.onLoad();
} else {
    window.addEventListener('load', home.onLoad);
}
