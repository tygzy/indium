/*
* CSS must include a `.active` class for the pop-up and dropdown which has `display` to anything other than `none`.
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


class Dialogue {

    constructor(dialogue, origin) {
        this.dialogue = dialogue;
        this.origin = origin;
        this._auto_run();
    }

    open() {
        this.dialogue.classList.add('active');
    }

    close() {
        this.dialogue.classList.remove('active');
    }

    _auto_run() {
        document.addEventListener('click', event => {
            const on_dialogue = this.dialogue.contains(event.target);
            const on_origin = this.origin.contains(event.target);

            if(!on_dialogue && !on_origin) {
                this.close();
            }
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

        if(this.origin.getBoundingClientRect().x + this.dropdown.offsetWidth > screen.width) {
            this.dropdown.style.left = ((this.origin.getBoundingClientRect().x - this.offset_x)
                + this.origin.offsetWidth) + 'px';
        }
        if(this.origin.getBoundingClientRect().y + this.dropdown.offsetHeight > screen.height) {
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


class Gallery {
    /*
    *
    * @param {Element} container - The container of all the items that can be opened in the gallery.
    * @param {Element} item_view - The container element which will be used to show a specific item onto the screen.
    *
    */

    constructor(container, item_view) {
        this.container = container;
        this.item_view = item_view;
        this.current_item = null;
    }

    get has_item_open() {
        return !!this.current_item;
    }

    get get_current_item() {
        return this.container.children[this.current_item];
    }

    next_item() {
        if(this.current_item <= 1) {
            this.current_item = 1;
        } else if(this.current_item > this.container.children.length) {
            this.current_item = this.container.children.length;
        } else {
            this.current_item += 1;
        }
    }

    previous_item() {
        if(this.current_item <= 1) {
            this.current_item = 1;
        } else if(this.current_item > this.container.children.length) {
            this.current_item = this.container.children.length;
        } else {
            this.current_item -= 1;
        }
    }

    open_item(item_number) {
        this.open_gallery();
        let new_item = document.createElement('img');
        new_item.src = this.container.children[item_number].src;
        this.current_item = item_number;

        this.item_view.replaceChildren();
        this.item_view.appendChild(new_item);
    }

    remove_item() {
        this.item_view.replaceChildren();
    }

    close_gallery() {
        this.item_view.classList.remove('active');
    }

    open_gallery() {
        this.item_view.classList.add('active');
    }
}


class Label {

    constructor(hover_element, label) {
        this.element = hover_element;
        this.label = label;
        this._auto_run();
    }

    open() {
        this.label.classList.add('active');
        this.label.style.left = 'calc(' + (this.element.getBoundingClientRect().x + (this.element.offsetWidth / 2) - (this.label.offsetWidth / 2)) + 'px)';
        this.label.style.top = 'calc(' + (this.element.getBoundingClientRect().y - this.label.offsetHeight) + 'px - 1rem)';
    }

    close() {
        this.label.classList.remove('active');
    }

    _auto_run() {
        this.element.addEventListener('mouseover', event => {
            this.open();
        });
        this.element.addEventListener('mouseout', event => {
            this.close();
        });
    }
}