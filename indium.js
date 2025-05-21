/*
* CSS must include a `.active` class for the pop-up and dropdown which has `display` to anything other than `none`.
* Can reference the various elements in html pages with needing to use `document.getElementById` etc
* instead use the class variable referencing the element.
*
*/

class PopWindow {
    constructor(window, window_close=null, keybinds=true, drag_bar=null) {
        this.window = window;
        this.window_close = window_close;
        this.keybinds = keybinds;
        this.drag_bar = drag_bar;
        this._auto_run();
        if(this.keybinds) {
            this.enable_keybinds();
        }
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
        if(this.window_close) {
            this.window_close.addEventListener('click', event => {
                this.close();
            });
        }

        if(this.drag_bar) {
            let mouse_down;
            this.drag_bar.addEventListener('mousedown', (event) => {
                mouse_down = true;
            });

            window.addEventListener('mouseup', (event) => {
                mouse_down = false;
            });

            window.addEventListener('mousemove', (event) => {
                if(mouse_down) {
                    let window_pos = this.window.getBoundingClientRect();
                    this.window.style.top = (event.movementY + window_pos.y) + 'px';
                    this.window.style.left = (event.movementX + window_pos.x) + 'px';
                    this.window.style.transform = 'none';
                }
            });
        }
    }

    enable_keybinds() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case "Escape":
                    this.close();
                    break;
            }
        })
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
    constructor(origin, dropdown, offset_x, offset_y, hover=false) {
        this.origin = origin;
        this.dropdown = dropdown;
        this.offset_x = offset_x;
        this.offset_y = offset_y;
        this.hover = hover;
        this._auto_run();
    }

    open() {
        this.dropdown.style.left = this.origin.getBoundingClientRect().x +
            this.offset_x + 'px';
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

        if(this.hover) {
            this.origin.addEventListener('mouseenter', event => {
                this.open();
            });

            document.addEventListener('mousemove', event => {
                let dx = this.dropdown.getBoundingClientRect().x, dw = this.dropdown.offsetWidth;
                let dy = this.dropdown.getBoundingClientRect().y, dh = this.dropdown.offsetHeight;
                let ox = this.origin.getBoundingClientRect().x, ow = this.origin.offsetWidth;
                let oy = this.origin.getBoundingClientRect().y, oh = this.origin.offsetHeight;

                if ( (event.clientX >= dx || event.clientX >= ox) && (event.clientY >= dy || event.clientY >= oy )) {
                    if (
                        (event.clientX <= dx + dw || event.clientX <= ox + ow)
                            &&
                        (event.clientY <= dy + dh || event.clientY <= oy + oh )
                    ) {

                    }  else {
                        this.close();
                    }
                }  else {
                    this.close();
                }
            });
        }
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
    * @param {Element} footnote_container - Allows a footnote for images if you want to have them, works by using the "title" attribute on an image.
    *
    */

    constructor(container, item_view, sub_view=null, footnote_container=null, direct_children=true, keybinds=true) {
        this.container = container;
        this.item_view = item_view;
        this.sub_view = sub_view;
        this.current_item = null;
        this.direct = direct_children;
        this.keybinds = keybinds;
        if(this.keybinds) {
            this.enable_keybinds();
        }
        this.footnote = footnote_container;
    }

    get has_item_open() {
        return !!this.current_item;
    }

    get get_current_item() {
        return this.container.children[this.current_item];
    }

    get is_first_item() {
        if(this.current_item == 0) {
            return true;
        } else {
            return false;
        }
    }

    get is_last_item() {
        if(this.current_item >= this.container.children.length - 1) {
            return true;
        } else {
            return false;
        }
    }

    enable_keybinds() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.previous_item();
                    break;
                case "ArrowRight":
                    this.next_item();
                    break;
                case "Escape":
                    this.close_gallery();
                    break;
            }
        })
    }

    next_item() {
        if(this.current_item < 0) {
            this.current_item = 0;
        } else if(this.current_item >= this.container.children.length - 1) {
            this.current_item = this.container.children.length - 1;
        } else {
            this.current_item += 1;
        }

        this.open_item();
    }

    previous_item() {
        if(this.current_item <= 0) {
            this.current_item = 0;
        } else if(this.current_item > this.container.children.length) {
            this.current_item = this.container.children.length;
        } else {
            this.current_item -= 1;
        }

        this.open_item();
    }

    open_item(item_number=null) {
        this.open_gallery();
        let new_item = document.createElement('img');

        if(item_number) { item_number = parseInt(item_number); this.current_item = item_number; }

        if(this.direct) { new_item.src = this.container.children[item_number ?? this.current_item].src.split('?')[0]; }
        else { new_item.src = this.container.getElementsByTagName('img')[item_number ?? this.current_item].src.split('?')[0]; }

        new_item.id = 'indium_gallery_expanded_image';

        this.remove_item();
        this.remove_footnote();

        if(this.sub_view) {
            this.sub_view.appendChild(new_item);
        } else {
            this.item_view.appendChild(new_item);
        }
        this.add_footnote();
    }

    add_footnote() {
        let footnote_text;
        if(this.direct) { footnote_text = this.container.children[this.current_item].title; }
        else { footnote_text = this.container.getElementsByTagName('img')[this.current_item].title; }

        if(footnote_text) {
            this.footnote.innerText = footnote_text;
        }
    }

    remove_footnote() {
        if(this.footnote) {
            this.footnote.innerText = '';
        }
    }

    remove_item() {
        if(document.getElementById('indium_gallery_expanded_image')) {
            this.item_view.removeChild(document.getElementById('indium_gallery_expanded_image'));
        }
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


class UploadPreview {

    constructor(input, preview_container) {
        this.input = input;
        this.container = preview_container;
        this.files = [];
        this._auto_run();
        this.image_extensions = ['png', 'jpg', 'bmp', 'gif', 'jpeg', 'svg', 'tiff'];
        this.video_extensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm', 'avchd', 'mpeg', 'mpg'];
        this.re = /(?:\.([^.]+))?$/;
        this.multiple = this.input.multiple;
    }

    add_preview() {
        for(let j=0; j<this.input.files.length; j++) {

            if(this.multiple) {
                this.files.push(this.input.files[j]);
            } else {
                if(this.files.length == 0) {
                    this.files.push(this.input.files[j]);
                } else {
                    this.files = [this.input.files[j]];
                }
            }
            let file_preview;
            const file_reader = new FileReader();
            if(this.image_extensions.includes(this.re.exec(this.input.files[j].name)[1])) {
                file_preview = document.createElement('img');
            } else if(this.video_extensions.includes(this.re.exec(this.input.files[j].name)[1])) {
                file_preview = document.createElement('video');
                file_preview.controls = true;
            }

            file_reader.addEventListener('load', event => {
                file_preview.setAttribute('src', event.target.result);
            });

            file_reader.readAsDataURL(this.input.files[j]);
            if(this.multiple) {
                this.container.appendChild(file_preview);
            } else {
                if(this.container.getElementsByTagName(file_preview.tagName).length > 0) {
                    this.container.replaceChild(file_preview, this.container.getElementsByTagName('img')[0]);
                } else {
                    this.container.appendChild(file_preview);
                }
            }
        }
    }

    _auto_run() {
        this.input.addEventListener('change', event => {
            this.add_preview();
        });
    }
}


class SlideShow {

    constructor(controls, items_container, timer) {
        // controls = the container of the slideshow item navigation
        // items_container = the container of the specific items you want to scroll through
        // timer = the amount of time for the slideshow to automatically progress, units are in seconds, 1 = 1 second
        this.controls = controls;
        this.items_container = items_container;
        this.current_position = 0;
        this.timer = timer * 1000;

        this.slideshow_timer = null;

        this.items_container.children[0].classList.add('active');
        this.controls.children[0].classList.add('active');

        this._auto_run();
    }

    get get_position() {
        return this.current_position;
    }

    _set_position(position) {
        if(position > this.items_container.children.length) {
            this.current_position = this.items_container.children.length - 1;
        } else if(position < 0) {
            this.current_position = 0;
        } else {
            this.current_position = position;
        }
    }

    _next_position() {
        if(this.current_position == this.items_container.children.length - 1) {
            this.current_position = 0;
        } else {
            this.current_position += 1;
        }
    }

    _previous_position() {
        if(this.current_position == 0) {
            this.current_position = this.items_container.children.length - 1;
        } else {
            this.current_position -= 1;
        }
    }

    next_item() {
        let existing_item = this.items_container.children[this.current_position];

        this._next_position();
        existing_item.classList.remove('active');

        this._change_item();
    }

    previous_item() {
        let existing_item = this.items_container.children[this.current_position];

        this._previous_position();
        existing_item.classList.remove('active');

        this._change_item();
    }

    set_item(position) {
        let existing_item = this.items_container.children[this.current_position];

        this._set_position(position);

        let new_item = this.items_container.children[this.current_position];

        if(existing_item !== new_item) {
            existing_item.classList.remove('active');

            new_item.classList.add('active');
        }

        this._set_controls();

        clearInterval(this.slideshow_timer);
        this._start_timer();
    }

    _set_controls() {
        let active_control = this.controls.getElementsByClassName('active');
        while(active_control[0]) {
            active_control[0].classList.remove('active');
        }
        this.controls.children[this.current_position].classList.add('active');
    }

    _change_item() {
        let new_item = this.items_container.children[this.current_position];

        new_item.classList.add('active');

        this._set_controls();

        clearInterval(this.slideshow_timer);
        this._start_timer();
    }

    _start_timer() {
        if(this.timer) {
            this.slideshow_timer = setInterval(this.next_item.bind(this), this.timer);
        }
    }

    _auto_run() {
        this._start_timer();
    }

}


class ContextMenu {
    // for classname, if you include '*', it will act as a document wide right click, not requiring you to hover over
    // any element in specific, like the standard context menu
    constructor(context_menu, classname) {
        this.context_menu = context_menu;
        this.associated_class = [];
        this.associated_class.push(classname);
        this._auto_run();
    }

    add_associated_class(classname) {
        this.associated_class.push(classname);
    }

    open(x, y) {
        this.context_menu.classList.add('active');

        this.context_menu.style.left = `${x}px`;
        this.context_menu.style.top = `${y}px`;
    }

    close() {
        this.context_menu.classList.remove('active');
    }

    get is_open() {
        return this.context_menu.classList.contains('active');
    }

    _auto_run() {
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if(this.associated_class.contains('*')) {
                this.open(event.clientX, event.clientY);
            }
            for(let i=0; i<this.associated_class.length; i++) {
                if(this.associated_class[i].matches(':hover')) {
                    this.open(event.clientX, event.clientY);
                }
            }
        });

        document.addEventListener('mousedown', (event) => {
            if(this.is_open) {
                if(!this.context_menu.matches(':hover')) {
                    this.close();
                }
            }
        });
    }
}