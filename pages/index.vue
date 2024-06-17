<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col
            cols="5"
        >
          <h1 style="font-size: 50px;margin-top: 45%; margin-left: 20%;">
            <p style="font-family:'Gugi', cursive; font-size: 25px;">
              <v-icon style="color:red  ; font-size: 105%;">
                mdi-star-box
              </v-icon>
              Venha para Seus Favoritos!
            </p>
            <strong>
              Seja bem vindo à algo
            </strong>
          </h1>
        </v-col>
        <v-col>
          <v-container style="border: 2px solid grey  ; background-color: #413E4F;border-radius: 1%;width: 70%; margin-top: 13%; margin-left: 7%;" >
            <v-container style="padding: 10%; background-color: #413E4F">
              <v-row>
                <v-col>
                  <v-text-field
                      class=""
                      label="Email"
                      v-model="login.email"
                      variant="outlined"
                      required
                      placeholder="Email"
                      color="red"
                      prepend-inner-icon="mdi-email"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                      class=""
                      label="Senha"
                      v-model="login.senha"
                      style="margin-top: -8%"
                      variant="outlined"
                      placeholder="Senha"
                      color="red"
                      :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="show = !show"
                      :type="show ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col style="margin-top:-10% ;">
                  <a href="#" class="" style="margin-top: -10%;color: red;">Esqueci minha senha</a>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    x-large
                    block
                    color="red"
                    :loading="loading"
                    outlined
                    @click="loginFunc"
                  >Entrar</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p style="margin-top: -5%;color: white; text-align: center; font-size: 90%; margin: auto;">Não tem uma conta? <strong> <a style="color:red" href="/register">Registre-se</a> </strong></p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <hr>
                </v-col>
                <v-col>
                  <hr>
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
    layout: "vazio",
  })
export default {
  data: () => {
    return {
      valid: false,
      show: false,
      loading: false,
      login: {
        email: null,
        senha: null
      },
    }
  },

  methods: {
    async loginFunc(){
      this.loading = true;
      let forget ={
        email: this.login.email,
        senha: this.login.senha
      }
      try {
        let response = await this.$api.post('/usuario/login', forget)
        console.log(response)
        if(response.data.length){
          localStorage.setItem("token-key", response.data)
          this.$toast.success("Você esta logado")
          this.loading = false;
          this.$router.push("/public/")
        }else{
          this.$toast.error(response.message)
          this.loading = false;
        }
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao realizar o login!');
        this.loading = false;
      }
    },
  }
}
</script>
