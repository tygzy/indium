class PopWindow {
    /*
    * CSS must include a `.active` class for the pop-up window which has `display` to anything other than `none`.
    * Can reference the pop-up in html pages with needing to use `document.getElementById` etc
    * instead use the `window` variable in the class.
    *
    */
    constructor(window, window_close) {
        this.window = window;
        this.window_close = window_close;
        this._auto_run();
    }

    open() {
        this.window.classList.add('active');
    }

    close() {
        this.window.classList.remove('active');
    }

    _auto_run() {
        this.window_close.addEventListener('click', event => {
            this.window.classList.remove('active');
        });
    }
}