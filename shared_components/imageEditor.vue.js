export default {
    template: ` <div class='image-editor'>
        <div class='image-editor__dashboard-group'>
            <button class='button' @click='addTextElement'>Add Text</button>
            <button class='button'>Upload background Image</button>
            <button class='button'>Set background color</button>
        </div>

        <div ref='canvas' class='image-editor__canvas'>
        </div>
    </div>
    `,

    data() {
        return {
            textEls: 0,
        }
    },
    methods: {
        addTextElement() {
            const canvas = this.$refs.canvas;

            const el = document.createElement('p')
            console.log('el:', el);
            el.setAttribute('contenteditable', true);
            canvas.append(el);
        }
    }
}
