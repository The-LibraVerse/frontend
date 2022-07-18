import ImageInput from '/shared/imageInput.vue.js';
import ColorPicker from '/shared/color-picker.vue.js';
import fontList from '/src/fontList.js';

export default {
    components: {'image-input': ImageInput, "color-picker": ColorPicker },
    template: `
        <div class='image-editor'>
            <div class='image-editor__dashboard-group'>
                <p class='image-editor__section-title'>Choose a background image</p>
                <image-input title='You can upload an image' :showPreview='false' @dataURL='(a) => imageUrl = a' >
                </image-input>
                <div>
                    <div class='input-group'>
                        <p>Or set a background color</p>
                        <color-picker @color='(e) => setBackgroundColor(e)'>
                        </color-picker>
                    </div>
                </div>
            </div>

            <div class='image-editor__dashboard-group'>
                <p class='image-editor__section-title'>Time to add some text</p>

                <color-picker @color='(e) => {text1Color = e; updateNew()}'>
                </color-picker>

                <button class='button' @click='newText.font.weight = "bold"; updateNew()'>B</button>
                <button class='button' @click='newText.font.weight = "italics"; updateNew()'><em>I</em></button>
                <button class='button' @click='newText.font.weight = "underline"; updateNew()'><u>U</u></button>

                <button class='button' @click='newText.font.size = parseInt(newText.font.size) + 5; redraw(); updateNew()'>+</button>
                <button class='button' @click='newText.font.size = parseInt(newText.font.size) - 5; redraw(); updateNew()'>-</button>

                <button class='button button_primary' @click='addText(newText.value)'>Add text</button>

                <select v-model='newText.font.name'>
                    <option v-for='fontName in fontList' :value='fontName'>{{ fontName }}</option>
                </select>

                <div class='list'>
                    <template v-for='el in elements.text'>
                        <div v-if='el.type == "text"'>
                            <p>{{ el.value }}<button @click='elements.text.splice(i, i+1)'>Delete</button>
                            </p>
                        </div>
                    </template>
                </div>
            </div>

            <label>
            <div ref='editorCanvas' class='image-editor__canvas' tabindex=1
            >

                <input type='text' v-model='text1' class='image-editor__control image-editor__text-control' placeholder='Type something...'
                    :style='"color:" + text1Color'
                    @keydown.left='moveNew(-2, 0)'
                    @keydown.up='moveNew(0, -2)'
                    @keydown.down='moveNew(0, 2)'
                    @keydown.right='moveNew(2, 0)'
                    @keyup.enter='addText(newText.value)'
                />

                <canvas ref='background_layer' class='image-editor__layer image-editor__background-layer'>
                    Preview of your cover image.
                    If you are seeing this message, your browser might not support this feature.
                </canvas>
                <canvas ref='layer0' class='image-editor__layer image-editor__layer0'>
                    Preview of your cover image.
                    If you are seeing this message, your browser might not support this feature.
                </canvas>
            </div>
            </label>

            <div class='flex image-editor__submit-group'>
                <button @click='save' class='button'>Save Image</button>
                <a v-if='downloadUrl' class='button' :href='downloadUrl' download='book-cover'>Download Image</a>
            </div>
        </div>
    `,
    data() {
        return {
            fontList,
            _mouseDown: 0,
            imageUrl: null,
            text1Color: 'black',
            text1: null,
            newText: {
                value: null,
                font: {
                    weight: 'bold',
                    size: '32',
                    name: 'Arial',
                },
                position: ['150', '150'],
            },

            canvasWidth: 300,
            canvasHeight: 400,
            elements: {
                text: [],
                image: [],
                bgImage: {},
                bgColor: {
                    type: 'color',
                    value: 'black',
                }
            },

            bgLayer: null,
            mainLayer: null,

            downloadUrl: null,
            file: null,
        }
    },
    watch: {
        imageUrl(val) {
            this.setBackgroundImage(val);
        },
        text1(val) {
            this.newText.value = val
            this.updateNew();
        }
    },
    methods: {
        updateNew() {
            this.redraw();
            this.drawText(this.newText.value, this.newText);
        },
        getCanvasContext() {
            const canvas = this.$refs.layer0;

            if(canvas.getContext)
                return canvas.getContext('2d');
            else
                alert('Please use a valid browser to use this feature, or upload an image');
        },
        getBackgroundLayer() {
            const canvas = this.$refs.background_layer;

            if(canvas.getContext)
                return canvas.getContext('2d');
            else
                alert('Please use a valid browser to use this feature, or upload an image');
        },
        save() {
            const name = 'book-cover';
            const ctx = this.getBackgroundLayer();
            const canvas0 = this.$refs.layer0;
            ctx.drawImage(canvas0, 0, 0, this.canvasWidth, this.canvasHeight);

            const canvas = this.$refs.background_layer;
            const self = this;

            self.$emit('image', canvas.toDataURL());
            const blob = canvas.toBlob(function(blob) {
                self.downloadUrl = URL.createObjectURL(blob); 

                const file = new File([blob], name + '.png', {type: 'image/png'})
                self.file = file;
                self.$emit('file', file);
            }, 'image/png');
        },
        download() {
        },

        wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            x = parseInt(x); y = parseInt(y);

            // First, start by splitting all of our text into words, but splitting it into an array split by spaces
            let words = text.split(' ');
            let line = ''; // This will store the text of the current line
            let testLine = ''; // This will store the text when we add a word, to test if it's too long
            let lineArray = []; // This is an array of lines, which the function will return

            // Lets iterate over each word
            for(var n = 0; n < words.length; n++) {
                // Create a test line, and measure it..
                testLine += `${words[n]} `;
                let metrics = ctx.measureText(testLine);
                console.log('metrics:', metrics);
                let testWidth = metrics.width;
                // If the width of this test line is more than the max width
                if (testWidth > maxWidth && n > 0) {
                    // Then the line is finished, push the current line into "lineArray"
                    lineArray.push([line, x, y]);
                    // Increase the line height, so a new line is started
                    y += parseInt(lineHeight);
                    // Update line and test line to use this word as the first word on the next line
                    line = `${words[n]} `;
                    testLine = `${words[n]} `;
                }
                else {
                    // If the test line is still less than the max width, then add the word to the current line
                    line += `${words[n]} `;
                }
                // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
                if(n === words.length - 1) {
                    lineArray.push([line, x, y]);
                }
            }
            // Return the line array
            return lineArray;
        },

        clearCanvas() {
            const ctx = this.getCanvasContext();
            const width = this.canvasWidth;
            const height = this.canvasHeight;

            ctx.clearRect(0, 0, width, height);
        },

        drawText(text, options) {
            if(!options)
                throw new Error('NO options!');

            const {size='32', weight='bold', name='Arial'} = options.font;

            const ctx = this.getCanvasContext();
            const font = {
                weight,
                size,
                name,
            };

            const textAlign = options.textAlign || 'center',
                pos = options.position || ['150', '150'],
                color = options.color || this.text1Color;

            const lineHeight = parseInt(size) + 10;
            const lines = this.wrapText(ctx, text, pos[0], pos[1], this.canvasWidth, lineHeight); 

            lines.forEach(item => {
                ctx.font= font.weight + " " + font.size + "px " + font.name;
                ctx.textAlign = textAlign;
                ctx.fillStyle = color;
                console.log('line item:', item);
                ctx.fillText(item[0],item[1], item[2]);
            });
        },

        addText(text) {
            const font = {...this.newText.font};

            const textAlign = 'center',
                pos = this.newText.position,
                color = this.text1Color;

            const options = {
                value: text,
                font,
                color, textAlign, position: pos
            };

            this.drawText(text, options);

            this.elements.text.push({
                ...options,
                type: 'text',
            });

            this.newText.value = '';
            this.text1 = "";
            const center = [this.canvasWidth / 2,
                this.canvasHeight / 2];

            this.newText.position = center;

            const canvas = this.$refs.editorCanvas;

            canvas.focus();
        },

        drawImage(src) {
            const ctx = this.getBackgroundLayer();

            const image = new window.Image();
            image.src = src;

            image.onload = function() {
                ctx.drawImage(image, 0, 0);
            }
        },

        addImage() {
            const src = this.imageUrl;

            this.drawImage(src);

            this.elements.image.push({
                type: 'image',
                value: this.imageUrl,
            });
        },


        setBackgroundColor(color) {
            const ctx = this.getBackgroundLayer();
            this.elements.bgColor.value = color ;
            ctx.fillStyle = color;
            const width = this.canvasWidth,
                height = this.canvasHeight;

            ctx.fillRect(0, 0, width, height);
        },
        setBackgroundImage() {
            const ctx = this.getBackgroundLayer();
            const src = this.imageUrl;

            // ctx.globalCompositeOperation = 'source-over';
            this.drawImage(src);
            // ctx.globalCompositeOperation = 'destination-over';
            this.elements.bgImage = {type: 'image', value: src};
        },

        redraw() {
            this.clearCanvas();
            const text = this.elements.text;

            const els = [
                ...text,
            ];

            els.forEach(el => {
                const options = el;

                switch(el.type) {
                    case 'text':
                        console.log('drawing text:', el.value);
                        this.drawText(el.value, options);
                        break;
                    case 'image':
                        console.log('drawing image:', el.value);
                        this.drawImage(el.value, options);
                        break;
                }
            });
        },

        moveNew(dy, dx) {
            this.moveEl(this.newText, dy, dx);
            this.drawText(this.newText.value, this.newText);
        },
        moveEl(el, dx, dy) {
            console.log('we are moivng', dx, dy);
            const x = parseInt(el.position[0]),
                y = parseInt(el.position[1]);

            dx = parseInt(dx);
            dy = parseInt(dy);

            const position = [
                x + dx,
                y + dy
            ];

            el.position = position;
            this.redraw();
        },
    },
    mounted() {
        const heightRatio = 1.5;
        const canvas = this.$refs.editorCanvas;

        const width = canvas.clientWidth;
        const height = width * heightRatio;

        const layer0 = this.$refs.layer0;
        const bg = this.$refs.background_layer;

        layer0.height = height;
        bg.height = height;
        layer0.width = width;
        bg.width = width;

        this.canvasWidth = width;
        this.canvasHeight = height;

        this.setBackgroundColor('white');
    }
}
