# Indium

Indium is a library of classes to easily manage the creation and use of Pop-up window, Dialogues, Hover labels, Dropdowns and a Gallery.

The individual classes will not generate any content for you, and will only allow you to easily open or close them or other specific features for each class.

## How to use

### CSS required 

Firstly, you must create the correct CSS styles for the dynamic elements to work correctly.

#### PopWindow and Dialogue

```css
*.window {
    display: none;
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
}

*.window.active {
    display: block;
}
```

#### Labels and Dropdowns

```css
*.label, *.dropdown {
    display: none;
    position: absolute;
}

*.label.active, *.dropdown.active {
    display: inline-block;
}
```

### Javascript

Example on how to use a `Dialogue`

```javascript
// Create an instance of the class when the page is fully loaded, declaring the variable before the onload handler is important here.

let choice_dialogue;
window.onload = (event) => {
    choice_dialogue = new Dialogue(document.getElementById('choice_dialogue_el'), document.getElementById('choice_dialogue_origin'));
};
```

### HTML

```html
<!-- The `window` class is important here otherwise the div won't hide by default and won't toggle properly. -->
<div id='choice_dialogue_el' class='window'>
    <h2>Pick from either of these choices:</h2>
    <ul>
        <li><a href='/home'>Home</a></li>
        <li><a href='/about'>About</a></li>
    </ul>
</div>

<!-- Easily reference the Dialogue by just using the class instance variable. -->
<button onclick='choice_dialogue.open();' id='choice_dialogue_origin'>Click here for a dialogue</button>
```