import "https://cdn.tiny.cloud/1/uri86mpxwbkhji9wlc407u0eel7n3l3n71lazd3yffb1hc7c/tinymce/6/tinymce.min.js";
// <script src="https://cdn.tiny.cloud/1/uri86mpxwbkhji9wlc407u0eel7n3l3n71lazd3yffb1hc7c/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
export default {
    template: `

        <textarea :placeholder='initText || "Start typing..."'  class='word-processor' v-model='content_'>
        </textarea>
    `,
    props: [ 'initText' ],
    emits: ['content'],
    data() {
        return {
            content_: null,
        }
    },
    methods: {
        updateContent() {
            const myContent = tinymce.activeEditor.getContent();

            this.$emit('content', myContent);
        }
    },
    mounted() {
        const self = this;
        tinymce.init({
            selector: '.word-processor',
            menubar: false,
            plugins: 'a11ychecker advcode casechange export formatpainter image editimage linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tableofcontents tinymcespellchecker',
            toolbar: 'undo redo | bold italic underline | styles | alignleft aligncenter alignright alignjustify | outdent indent',
            toolbar_mode: 'floating',
            setup: (editor) => {
                editor.on('ExecCommand', e => {
                    // console.log(e.command + ' was executed.');
                    self.updateContent(e);
                });
                editor.on('input', e => {
                    self.updateContent(e);
                });
                editor.on('keyup', e => {
                    self.updateContent(e);
                });
                editor.on('click', e => {
                    self.updateContent(e);
                });
            }
        });

        this.content = this.initText;
    }
}
