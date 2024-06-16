<template>
  <v-card>
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
      userData: {
        nomeCompleto: 'nao encontrado',
        email: 'nao encontrado',
      },
      dados: [
        {
          nome: 'Home',
          icon: 'mdi-home',
          to: '/public/ '
        },
        {
          nome: 'Favoritos',
          icon: 'mdi-star',
          to: '/favoritos'
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
        if (data.data.cargo == 'Admin') {
          this.dados.push(
            {
              nome: 'Admin | Usuarios',
              icon: 'mdi-account',
              to: '/admin/usuarios'
            },
          );
          this.dados.push(
            {
              nome: 'Admin | Perfis',
              icon: 'mdi-account-box-multiple',
              to: '/admin/perfil'
            },
          )
        }

        this.dados.push(
          {
            nome: 'Admin | Produtos',
            icon: 'mdi-cart',
            to: '/admin/produto'
          },
        )
      } catch (e) {
        this.$toast.error('Acesso nao Permitido!')
        this.$router.push('/')
      }
    }
  }
}
</script>
