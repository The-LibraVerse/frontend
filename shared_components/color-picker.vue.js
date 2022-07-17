export default {
    template: `
        <div class='color-picker'>
            <label v-for='color in colors'>
                <input type='radio' :value='color' v-model='selectedColor' class='radio__control color-picker__radio'>
                <span class='color-picker__color' :style='"background:" + color'></span>
            </label>
        </div>
            
    `,
    data() {
        return {
            selectedColor: null,
            colors: {
                white: 'white',
                black: 'black',
                red: "#DB2828",
                orange: "#F2711C",
                yellow: "#FBBD08",
                olive: "#B5CC18",
                green: "#21BA45",
                teal: "#00B5AD",
                blue: "#2185D0",
                violet: "#6435C9",
                purple: "#A333C8",
                pink: "#E03997",
            }
        }
    },
    watch: {
        selectedColor(val) {
            console.log('color:', val);
            this.$emit('color', val);
        }
    }
}
