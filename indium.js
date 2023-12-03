/*
* CSS must include a `.active` class for the pop-up window which has `display` to anything other than `none`.
* Can reference the various elements in html pages with needing to use `document.getElementById` etc
* instead use the class variable referencing the element.
*
*/

class PopWindow {
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

    get is_open() {
        return this.window.classList.contains('active');
    }

    _auto_run() {
        this.window_close.addEventListener('click', event => {
            this.close();
        });
    }
}


class Dropdown {
    constructor(origin, dropdown, offset_x, offset_y) {
        this.origin = origin;
        this.dropdown = dropdown;
        this.offset_x = offset_x;
        this.offset_y = offset_y;
        this._auto_run();
    }

    open() {
        this.dropdown.style.left = this.origin.getBoundingClientRect().x +
            this.offset_x + this.origin.offsetWidth + 'px';
        this.dropdown.style.top = this.origin.getBoundingClientRect().y +
            this.offset_y + this.origin.offsetHeight + 'px';

        if(origin.getBoundingClientRect().x + this.dropdown.offsetWidth > screen.width) {
            this.dropdown.style.left = ((this.origin.getBoundingClientRect().x - this.offset_x)
                + this.origin.offsetWidth) + 'px';
        }
        if(origin.getBoundingClientRect().y + this.dropdown.offsetHeight > screen.height) {
            this.dropdown.style.top = ((this.origin.getBoundingClientRect().y - this.offset_y)
                + this.origin.offsetHeight) + 'px';
        }

        this.dropdown.classList.add('active');
    }

    close() {
        this.dropdown.classList.remove('active');
    }

    get is_open() {
        return this.dropdown.classList.contains('active');
    }

    _auto_run() {

        this.origin.addEventListener('click', event => {
            this.open();
        });

        document.addEventListener('click', event => {
            const on_dropdown = this.dropdown.contains(event.target);
            const on_origin = this.origin.contains(event.target);

            if(!on_dropdown && !on_origin) {
                this.close();
            }
        });
    }
}