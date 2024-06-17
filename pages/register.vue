<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
            cols="5"
        >
          <h1 style="font-size: 40px;margin-top: 45%; margin-left: 20%;">
            <p style="font-family:'Gugi', cursive; font-size: 30px;">
              <v-icon style="color:red  ; font-size: 105%;">
                mdi-star-box
              </v-icon>
              Cadastro Favoritosss
            </p>
            <strong>
              Informe seus dados nos campos
            </strong>
          </h1>
        </v-col>
        <v-col
            cols="max"

        >
          <v-container style="border: 2px solid grey  ;  background-color: #413E4F; border-radius: 1%;width:100%; margin-top: 13%; margin-left: 7%;" >
            <v-container style="padding: 7%; background-color: #413E4F; border-radius: 1%;">
              <v-row>
                <v-col>
                  <v-text-field
                    class=""
                    variant="outlined"
                    v-model="user.nomeCompleto"
                    label="Nome Completo"
                    style="margin-top: -8%"
                    placeholder="Nome Completo"
                    color="red"
                    prepend-inner-icon="mdi-email"
                    required
                    :rules="[rule.senha]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    class=""
                    v-model="user.senha"
                    variant="outlined"
                    label="Senha"
                    style="margin-top: -8%"
                    placeholder="Senha"
                    color="red"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                    required
                    @click:append-inner="show = !show"
                    :type="show ? 'text' : 'password'"
                    :rules="[rule.senha]"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                      class=""
                      v-model="user.senha2"
                      variant="outlined"
                      style="margin-top: -8%"
                      label="Confirme sua senha"
                      placeholder="Confirme sua senha"
                      color="red"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
                      required
                      @click:append-inner="show2 = !show2"
                      :type="show2 ? 'text' : 'password'"
                      :rules="[rule.senha, rule.equalPassword]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                      class=""
                      v-model="user.cpfCnpj"
                      variant="outlined"
                      label="CPF/CNPJ"
                      v-mask="['###.###.###-##', '##.###.###/####-##']"
                      style="margin-top: -8%"
                      placeholder="CPF/CNPJ"
                      color="red"
                      prepend-inner-icon="mdi-lock"
                      required
                      :rules="[rule.senha]"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                      class=""
                      variant="outlined"
                      v-model="user.email"
                      label="Email"
                      style="margin-top: -8%"
                      placeholder="Email"
                      color="red"
                      prepend-inner-icon="mdi-cellphone"
                      required
                      :rules="[rule.senha]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    x-large
                    block
                    color="red"
                    @click="register"
                    :loading="loading"
                  >Cadastrar</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  definePageMeta({
    layout: "vazio"
  });
export default {
  name: 'LoginsPage',

  data(){
    return{
      valid: false,
      show: false,
      loading: false,
      show2:false,
      user:{
        nomeCompleto: null,
        email: null,
        senha: null,
        cpfCnpj:null,
        senha2:null
      },
      rule:{
        senha: v => !!v || 'Esse campo é obrigatorio',
        equalPassword: v => v === this.user.senha || 'Senha diferente!'
      },
      roles: [{"name": "Cliente", "value": "customer"}, {"name": "Entregador", "value": "deliver"}]
    }
  },

  methods: {
    async register (){
      this.loading = true;
      try {
        if(!this.valid){
          return this.$toast.warning("Infome todas as opções!")
        }
        let user ={
          nomeCompleto: this.user.nomeCompleto,
          senha: this.user.senha,
          cpfCnpj: this.user.cpfCnpj,
          email: this.user.email
        }
        let response = await this.$api.post('/usuario/register', user)
        if(response.message === "Conta Criada!"){
          this.$toast.success(response.message)
          return this.$router.push({ name: 'index' });
        }
        this.loading = false
        return this.$toast.error(response.message)
      } catch (error) {
        this.$toast.error(error.message)
        this.loading = false
      }
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');
a {
  color: red;
  text-decoration: none;
}
</style>