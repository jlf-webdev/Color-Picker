class Picker {
    constructor (target, width, height) {
        this.target = target;
        this.width = width;
        this.height = height;
        this.target.width = width;
        this.target.height = height;
        // Get context
        this.context = this.target.getContext("2d");
        // Circle
        this.pickerCircle = { x:10, y:10, width:7, insigth:7};
        // Start event listeners
        this.listenForEvents();
    }

    draw() {
        this.build();
    }

    build() {
        //Build Gradient Colors on the 2d Canvas
        let gradient = this.context.createLinearGradient(0,0,this.width,0);
        //Color stops
        gradient.addColorStop(0,"rgb(255,0,0)");
        gradient.addColorStop(0.15,"rgb(255,0,255)");
        gradient.addColorStop(0.33,"rgb(0,0,255)");
        gradient.addColorStop(0.49,"rgb(0,255,255)");
        gradient.addColorStop(0.67,"rgb(0,255,0)");
        gradient.addColorStop(0.84,"rgb(255,255,0)");
        gradient.addColorStop(1,"rgb(255,0,0)");
        // Fill it
        this.context.fillStyle = gradient;
        this.context.fillRect(0,0,this.width,this.height);

        //Add black&white color
        gradient = this.context.createLinearGradient(0,0,0,this.height);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0)");
        gradient.addColorStop(0.5, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");
        this.context.fillStyle = gradient;
        this.context.fillRect(0,0,this.width,this.height);  
        
        //Circle Selector
        this.context.beginPath();
        this.context.arc(this.pickerCircle.x, this.pickerCircle.y, this.pickerCircle.width, 0, Math.PI * 2);
        this.context.strokeStyle = "black";
        this.context.stroke();
        this.context.closePath();
    }

    listenForEvents() {
        let isMouseDown = false;
        const onMouseDown = (e) => {
            let currentX = e.clientX - this.target.offsetLeft;
            let currentY = e.clientY - this.target.offsetTop;
            this.pickerCircle.x = currentX >= pickerWidth ? pickerWidth-1 : currentX;
            this.pickerCircle.y = currentY >= pickerHeight ? pickerHeight-1 : currentY;  
            isMouseDown = true;
        }

        const onMouseMove = (e) => {
            if (isMouseDown) {
                let currentX = e.clientX - this.target.offsetLeft;
                let currentY = e.clientY - this.target.offsetTop;
                this.pickerCircle.x = currentX >= pickerWidth ? pickerWidth-1 : currentX;
                this.pickerCircle.y = currentY >= pickerHeight ? pickerHeight-1 : currentY;
            }
        }

        const onMouseUp = () => {
            isMouseDown = false;
        }

        // Register
        this.target.addEventListener("mousedown", onMouseDown);
        this.target.addEventListener("mousemove", onMouseMove);
        this.target.addEventListener("mousemove", () => this.onChangeCallback(this.getPickedColor()));
        document.addEventListener("mouseup", onMouseUp);
    }

    getPickedColor() {
        let imageData = this.context.getImageData(this.pickerCircle.x, this.pickerCircle.y, 1, 1);
        return { 
            r: imageData.data[0], 
            g: imageData.data[1],
            b: imageData.data[2]
        }
    }

    onChange(callback) {
        this.onChangeCallback = callback;
    }
}

let pickerWidth = 250;
let pickerHeight = 220;
let picker = new Picker(document.getElementById("color-picker"), pickerWidth, pickerHeight);

//Draw
setInterval(() => picker.draw(), 1);

picker.onChange((color) => {
    let selected = document.getElementsByClassName("selected")[0];
    selected.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
});
