<template>
  <v-container class="justify-center mt-5">
    <TabelaDados  @editItem="editItem" @abrirDialog="() => ativo = true" titulo="Produtos" :loading="loading" @deleteItem="deleteItem" :headers="headers" :items="items"></TabelaDados>
  </v-container>
  <v-dialog
      v-model="ativo"
      max-width="500"
  >
    <v-card
        height="400"
        width="700"
    >
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <h1>
              {{ tituloDialog }} um Produto
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
                placeholder="Identificador"
                readonly
                v-model="produto.id"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                variant="outlined"
                label="Nome"
                placeholder="Nome"
                v-model="produto.nome"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
        <v-col>
          <v-text-field
              variant="outlined"
              label="Descricao"
              placeholder="Descricao"
              v-model="produto.descricao"
          >
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
              variant="outlined"
              label="Preco"
              placeholder="Preco"
              v-model="produto.preco"
          >
          </v-text-field>
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
      produto: {
        id: null,
        nome: null,
        descricao: null,
        preco: null,
        usuarioCriador: null,
      },
      headers: [
        {
          title: 'Identificador',
          key: 'id'
        },
        {
          title: 'Nome',
          key: 'nome'
        },
        {
          title: 'Descricao',
          key: 'descricao'
        },
        {
          title: 'Preco',
          key: 'preco'
        },
        {
          title: 'Usuário Criador',
          key: 'usuarioCriador'
        },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false
        },
      ],
      items: [],
    }
  },

  async created(){
    await this.getItems();
  },

  computed: {
    tituloDialog: function() {
      return this.produto.id ? 'Editar': 'Criar';
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
      this.produto = {
        id: null,
        nome: null,
        dataInicio: null,
        dataFim: null,
        local: null,
        idEvento: null
      }
      this.ativo = false;
    },

    async persist() {
      try {
        this.loadingSave = true;
        if (this.produto.id) {
          const response = await this.$api.patch(`/produto/${this.produto.id}`, this.produto);
        } else {
          const response = await this.$api.post('/produto/', this.produto);
        }
        this.$toast.success(`Produto ${this.produto.id ? 'editado' : 'criado'} com sucesso!`);
      } catch (e) {
        this.$toast.error(`Erro ao ${this.produto.id ? 'editar' : 'criar'} produto!`);
      }
      this.resetAtividade()
      await this.getItems();
      this.loadingSave = false;
    },

    editItem(item) {
      this.produto = {
        ...item
      };
      this.ativo = true;
    },

    async deleteItem(item) {
      try {
        if (confirm(`Deseja deletar o registro com id ${item.id}`)) {
          const response = await this.$api.delete(`/produto/${item.id}`  );
          this.$toast.success('Excluido com sucesso')
        }
      } catch (e) {
        this.$toast.error('Erro ao excluir um produto!')
      }
      await this.getItems();
    },

    async getItems() {
      const response = await this.$api.get('/produto');
      this.items = response.data;
      this.loading = false;
    }
  }
}
</script>
