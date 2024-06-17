<template>
  <body>
    <v-container>
      <div v-if="items2.length > 0">
        <div class="text">
          <h1>FAVORITOS</h1>
        </div>
        <v-row justify="center">
          <v-col
            v-for="(dado, i) in items2"
            :key="i"
            cols="12"
            md="2"
          >
            <v-card class="mx-auto" max-width="344">
              <v-card-title class="text-center">
                {{ dado.nome }}
              </v-card-title>
              <v-card-subtitle class="text-center">
                R$ {{ dado.preco }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn
                  color="#636260"
                  block
                  border
                  class="text-none"
                  @click="removeFromFavorites(dado.id)"
                >
                  Remover
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div class="text">
        <h1>PRODUTOS</h1>
      </div>
      <v-row justify="center">
        <v-col
          v-for="(dado, i) in items"
          :key="i"
          cols="12"
          md="2"
        >
          <v-card class="mx-auto" max-width="344">
            <v-card-title class="text-center">
              {{ dado.nome }}
            </v-card-title>
            <v-card-subtitle class="text-center">
              R$ {{ dado.preco }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                color="#636260"
                block
                border
                class="text-none"
                @click="addFav(dado)"
              >
                Favoritar
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </body>
</template>

<script>
export default {
  data: () => {
    return {
      items: [],
      items2: [],
      show: false,
      idUsuario: null,
    }
  },

  async created() {
    await this.getUser();
    await this.getProdutos();
    await this.getFavoritos();
  },

  methods: {
    async getProdutos() {
      const response = await this.$api.get(`/produto`);
      this.items = response.data;
    },
    async getFavoritos() {
      if (!this.idUsuario) {
        console.error('Usuário não está logado');
        return;
      }

      const response = await this.$api.get(`/favoritos?userId=${this.idUsuario}`);
      const favoritos = response.data;

      this.items2 = favoritos.map(favorito => {
        const produto = this.items.find(p => p.id === favorito.idProduto);
        return {
          ...favorito,
          nome: produto ? produto.nome : 'Desconhecido',
          preco: produto ? produto.preco : 'Desconhecido'
        };
      });
    },
    async getUser() {
      const response = await this.$api.get('/usuario/get-info-by-token');
      this.idUsuario = response.data.id;
    },
    async addFav(item) {
      if (!this.idUsuario) {
        console.error('Usuário não está logado');
        return;
      }

      const data = {
        idUsuario: this.idUsuario,
        idProduto: item.id
      };

      try {
        await this.$api.post('/favoritos', data);
        await this.getFavoritos(); // Atualiza a lista de favoritos
      } catch (error) {
        console.error('Erro ao adicionar aos favoritos:', error);
      }
    },
    async removeFromFavorites(favoritoId) {
      try {
        await this.$api.delete(`/favoritos/${favoritoId}`);
        await this.getFavoritos(); // Atualiza a lista de favoritos
      } catch (error) {
        console.error('Erro ao remover dos favoritos:', error);
      }
    }
  }
}
</script>

<style>
p {
  font-size: 16px;
  color: #636260;
}

.text {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 5%;
  margin: auto;
  right: 5%;
  text-align: center;
  top: 0;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
