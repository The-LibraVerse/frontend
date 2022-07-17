import ipfsUpload from '/src/api/ipfsUpload.js';

export default {
    template: `
        <div class='image-upload input-group'>
            <div class='image-preview image-upload__preview' v-if='showPreview'>
                <img class='image image-preview image-upload__preview-image' v-if='preview' :src='preview' />
            </div>

            <label>
                <span class='input-group__label' >
                {{ title || "Select Image" }}:
                </span>

                <input class='input-group__control' name='image-upload' id='upload' type='file' ref='fileUpload' accept="image/*,.gif">
            </label>
        </div>
    `,
    props: {
        title: String,
        showPreview: {
            type: Boolean,
            default: true
        }
    },
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
                    self.$emit('dataURL', this.result);
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
