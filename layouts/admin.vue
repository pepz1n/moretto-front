<template>
    <v-card v-if="logado">
      <v-layout>
        <v-navigation-drawer
            expand-on-hover
            rail
            theme="dark"
        >
          <v-list>
            <v-list-item
                prepend-avatar="https://randomuser.me/api/portraits/lego/4.jpg"
                :subtitle="userData.email"
                :title="userData.nomeCompleto"
            ></v-list-item>
            <v-list-item>
              <v-btn elevation="0" icon="mdi-logout" @click="logout()">
              </v-btn>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item v-for="(item, i) in dados" :key="i" :prepend-icon="item.icon" :to="item.to" :title="item.nome" :value="item.nome"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 100vh; background-color: black;" theme="dark">

          <slot/>

        </v-main>
      </v-layout>
    </v-card>
</template>

<script>
export default {
  name: 'default',
  data () {
    return {
      logado: false,
      userData: {
        nomeCompleto: 'nao encontrado',
        email: 'nao encontrado',
      },
      dados: [
        {
          nome: 'Home',
          icon: 'mdi-home',
          to: '/public/'
        },
        {
          nome: 'Admin | Favoritos',
          icon: 'mdi-star',
          to: '/admin/favoritos'
        },
        {
          nome: 'Admin | Produtos',
          icon: 'mdi-cart',
          to: '/admin/produto'
        },
        {
          nome: 'Admin | Perfis',
          icon: 'mdi-account-box-multiple',
          to: '/admin/perfil'
        },
        {
          nome: 'Admin | Usuarios',
          icon: 'mdi-account',
          to: '/admin/usuarios'
        },
        {
          nome: 'Admin | Promocoes',
          icon: 'mdi-sale',
          to: '/admin/promocoes'
        },
      ]
    }
  },

  async created() {
    await this.getInfoUser();
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/')
    },
    async getInfoUser() {
      try {
        const data = await this.$api.get('/usuario/get-info-by-token');
        this.userData = data.data;
        if (!(data.data.cargo == 'Admin')) {
          this.$toast.error('Acesso nao Permitido!')
          return this.$router.push('/')
        }
        this.logado = true
      } catch (e) {
        this.$toast.error('Acesso nao Permitido!')
        this.$router.push('/')
      }
    }
  }
}
</script>
