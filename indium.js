/*
* CSS must include a `.active` class for the pop-up and dropdown which has `display` to anything other than `none`.
* Can reference the various elements in html pages with needing to use `document.getElementById` etc
* instead use the class variable referencing the element.
*
*/

let all_dropdowns = [], all_labels = [];

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
    *
    */

    constructor(container, item_view, direct_children=true) {
        this.container = container;
        this.item_view = item_view;
        this.current_item = null;
        this.direct = direct_children;
    }

    get has_item_open() {
        return !!this.current_item;
    }

    get get_current_item() {
        return this.container.children[this.current_item];
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

        if(item_number) { item_number = parseInt(item_number); }

        if(this.direct) { new_item.src = this.container.children[item_number ?? this.current_item].src; }
        else { new_item.src = this.container.getElementsByTagName('img')[item_number ?? this.current_item].src; }

        new_item.id = 'indium_gallery_expanded_image';
        if(item_number) {
            this.current_item = item_number;
        }

        this.remove_item();
        this.item_view.appendChild(new_item);
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
    }

    add_preview() {
        for(let j=0; j<this.input.files.length; j++) {
            this.files.push(this.input.files[j]);
            let file_preview;
            const file_reader = new FileReader();
            console.log(this.image_extensions.includes(this.re.exec(this.input.files[j].name)[1]));
            if(this.image_extensions.includes(this.re.exec(this.input.files[j].name)[1])) {
                file_preview = document.createElement('img');
            } else if(this.video_extensions.includes(this.re.exec(this.input.files[j].name)[1])) {
                file_preview = document.createElement('video');
                file_preview.controls = true;
            }

            file_reader.onload = function (event) {
                file_preview.setAttribute('src', event.target.result);
            }
            file_reader.readAsDataURL(this.input.files[j]);
            this.container.appendChild(file_preview);
        }
    }

    _auto_run() {
        this.input.addEventListener('change', event => {
            this.add_preview();
        });
    }
}