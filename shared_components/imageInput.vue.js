import ipfsUpload from '/src/api/ipfsUpload.js';

export default {
    template: `
        <div>
            <img v-if='preview' :src='preview' />
            <label>{{ title || "Select Image" }}:
                <input name='image-upload' id='upload' type='file' ref='fileUpload' accept="image/*,.gif">
            </label>
        </div>
    `,
    props: ['title'],
    data() {
        return {
            preview: null,
            fileData: null,
            file: null,
        }
    },
    methods: {
        updatePreview: function() {
            const file = this.$refs.fileUpload.files[0];
            const self = this;

            if(file) {
                const fileReader = new window.FileReader();
                fileReader.readAsDataURL(file);
                fileReader.addEventListener('load', function() {
                    self.preview = this.result;
                    self.fileData = { file, buffer: this.result };
                    self.file = file;

                    self.$emit('file', file);
                    self.$emit('result', file);
                });
            }
        },
    },
    mounted() {
        const self = this;
        this.$refs.fileUpload.addEventListener('change', function() {
            return self.updatePreview()
        });
    }
}
