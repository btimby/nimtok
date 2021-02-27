import Vue from 'vue';
import Login from '../../src/components/user/Login.vue';


describe('Login.vue', () => {
  it ('should show a button', () => {
    const Constructor = Vue.extend(Login);

    const comp = new Constructor({
    }).$mount();

    expect(comp.$el)
      .to.be('button');
  });
});