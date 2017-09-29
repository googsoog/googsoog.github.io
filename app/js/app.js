//import red from './modules/author'

//paralax-welcome

var layer = document.querySelector("#layerParalax");

var moveLayers = function(e) {
    var initialX = (window.innerWidth / 2) - e.pageX;
    var initialY = (window.innerHeight / 2) - e.pageY;

    function transformLayer() {
        var
            divider = 1 / 100,
            positionX = initialX * divider,
            positionY = initialY * divider,
            transformString = 'translate(' + positionX + 'px,' + positionY + 'px)';
        this.style.transform = transformString;
    }
    transformLayer.call(layer);
};

window.addEventListener('mousemove', moveLayers);


//Кнопка Авторизация




var rotateHeader = function(e) {

    var button = document.querySelector("#button"),
        buttonContainer = button.parentElement,
        helloContainer = buttonContainer.nextElementSibling,
        rotateBlock = helloContainer.firstElementChild,
        header = rotateBlock.firstElementChild,
        author = rotateBlock.lastElementChild;
    e.preventDefault();
    rotateBlock.style.transform = 'rotateY(180deg)';

    setTimeout(function() {
        author.style.display = 'block';
    }, 300);
};

window.addEventListener('click', rotateHeader);