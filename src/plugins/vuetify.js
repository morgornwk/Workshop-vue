import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customerProperties: true
        },
        themes: {
            light: {
                primary: '#141414',
                paper: '#CFCABD',
            }
        }
    }
});
