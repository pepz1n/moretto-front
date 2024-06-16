<template>
  <v-container class="justify-center mt-5">
    <TabelaDados  @editItem="editItem" @abrirDialog="() => ativo = true" titulo="Favoritos" :loading="loading" @deleteItem="deleteItem" :headers="headers" :items="items"></TabelaDados>
  </v-container>
  <v-dialog
      v-model="ativo"
      max-width="500"
  >
    <v-card
        height="250"
        width="700"
    >
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <h1>
              {{ tituloDialog }} um Favorito
            </h1>
          </v-col>
          <v-col class="d-flex justify-end" >
            <v-icon color="red" @click="ativo = false" class="mt-4" size="x-large">
              mdi-close
            </v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
                variant="outlined"
                label="Id"
                readonly
                v-model="favoritos.id"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete
              :items="items2"
              placeholder="Produto"
              item-title="nome"
              item-value="id"
              v-model="favoritos.idProduto"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="green"
            variant="outlined"
            @click="persist"
            :loading="loadingSave"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => {
    return {
      dialog: false,
      valor: 0,
      ativo: false,
      loading: true,
      textoUsuario: null,
      loadingSave: false,
      favoritos: {
        id: null,
        idUsuario: null,
        idProduto: null,
      },
      headers: [
        {
          title: 'Identificador',
          key: 'id'
        },
        {
          title: 'Produto',
          key: 'produtoNome'
        },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false
        },
      ],
      items: [],
      items2: [],
    }
  },

  async created(){
    await this.getProdutos();
    await this.getItems();
  },

  computed: {
    tituloDialog: function() {
      return this.favoritos.id ? 'Editar': 'Criar';
    }
  },

  watch: {
    ativo(valor) {
      if (valor == false) {
        this.resetAtividade()
      }
    }
  },

  methods: {
    resetAtividade() {
      this.favoritos = {
        id: null,
        idUsuario: null,
        idProduto: null,
      }
      this.ativo = false;
    },

    async persist() {
      try {
        this.loadingSave = true;
        if (this.favoritos.id) {
          const response = await this.$api.patch(`/favoritos/${this.favoritos.id}`, this.favoritos);
        } else {
          const response = await this.$api.post('/favoritos/', this.favoritos);
        }
        this.$toast.success(`favorito ${this.favoritos.id ? 'editado' : 'criado'} com sucesso!`);
      } catch (e) {
        this.$toast.error(`Erro ao ${this.favoritos.id ? 'editar' : 'criar'} favorito!`);
      }
      this.resetAtividade()
      await this.getItems();
      this.loadingSave = false;
    },

    editItem(item) {
      this.favoritos = {
        ...item
      };
      this.ativo = true;
    },

    async deleteItem(item) {
      try {
        if (confirm(`Deseja deletar o registro com id ${item.id}?`)) {
          const response = await this.$api.delete(`/favoritos/${item.id}`  );
          this.$toast.success('Excluido com sucesso')
        }
      } catch (e) {
        this.$toast.error('Erro ao excluir um favorito!')
      }
      await this.getItems();
    },

    async getItems() {
      const response = await this.$api.get('/favoritos');
      let favoritos = response.data;
      
      favoritos = favoritos.filter(favorito => {
        const produto = this.items2.find(p => p.id === favorito.idProduto);
        return produto && produto.nome && produto.nome.trim() !== '';
      });

      this.items = favoritos.map(favorito => {
        const produto = this.items2.find(p => p.id === favorito.idProduto);
        return {
          ...favorito,
          produtoNome: produto ? produto.nome : 'Desconhecido'
        };
      });

      this.loading = false;
    },
    
    async getProdutos() {
      const response = await this.$api.get('/produto');
      this.items2 = response.data;
    },
  }
}
</script>
