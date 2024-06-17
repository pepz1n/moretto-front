<template>
  <v-container class="justify-center mt-5">
    <TabelaDados
        :loading="loading"
        titulo="Promoções"
        :headers="headers"
        :items="formattedItems"
        @edit-item="editItem"
        @abrir-dialog="() => ativo = true"
        @delete-item="deleteItem"
    />
  </v-container>
  <v-dialog v-model="ativo" max-width="700">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <h1>{{ tituloDialog }} uma Promoção</h1>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-icon color="red" class="mt-4" size="x-large" @click="ativo = false">mdi-close</v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="promocao.titulo" variant="outlined" label="Título" required/>
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="promocao.descricao" variant="outlined" label="Descrição"/>
          </v-col>
          <v-col cols="6">
            <v-autocomplete
                v-model="promocao.id_produto"
                :items="produtos"
                placeholder="Produto"
                item-title="nome"
                item-value="id"
                required
            />
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="promocao.percentual_desconto" variant="outlined" label="Desconto (%)" required type="number"/>
          </v-col>
          <v-col cols="6">
            <VueDatePicker v-model="promocao.data_inicio" :input-class="'date-picker'" :placeholder="'Data Início'" />
          </v-col>
          <v-col cols="6">
            <VueDatePicker v-model="promocao.data_fim" :input-class="'date-picker'" :placeholder="'Data Fim'" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="green" variant="outlined" :loading="loadingSave" @click="persist">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: {
    VueDatePicker,
  },
  data() {
    return {
      ativo: false,
      loading: false,
      loadingSave: false,
      promocao: {
        id: null,
        id_produto: null,
        titulo: '',
        descricao: '',
        percentual_desconto: null,
        data_inicio: '',
        data_fim: ''
      },
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Produto', key: 'produtoNome' },
        { title: 'Título', key: 'titulo' },
        { title: 'Desconto (%)', key: 'percentual_desconto' },
        { title: 'Data Início', key: 'data_inicio' },
        { title: 'Data Fim', key: 'data_fim' },
        { title: 'Ações', key: 'actions', sortable: false }
      ],
      items: [],
      produtos: []
    };
  },

  computed: {
    tituloDialog() {
      return this.promocao.id ? 'Editar' : 'Criar';
    },
    formattedItems() {
      return this.items.map(item => ({
        ...item,
        data_inicio: this.formatDate(item.data_inicio),
        data_fim: this.formatDate(item.data_fim),
      }));
    }
  },

  watch: {
    ativo(valor) {
      if (!valor) {
        this.resetPromocao();
      }
    }
  },

  async created() {
    await this.getProdutos();
    await this.getItems();
  },

  methods: {
    resetPromocao() {
      this.promocao = {
        id: null,
        id_produto: null,
        titulo: '',
        descricao: '',
        percentual_desconto: null,
        data_inicio: '',
        data_fim: ''
      };
      this.ativo = false;
    },

    async persist() {
      try {
        this.loadingSave = true;
        if (this.promocao.id) {
          await this.$api.patch(`/promocoes/${this.promocao.id}`, this.promocao);
        } else {
          await this.$api.post('/promocoes', this.promocao);
        }
        this.$toast.success(`Promoção ${this.promocao.id ? 'editada' : 'criada'} com sucesso!`);
        await this.getItems();
        this.resetPromocao();
      } catch (e) {
        this.$toast.error(`Erro ao ${this.promocao.id ? 'editar' : 'criar'} promoção!`);
      } finally {
        this.loadingSave = false;
      }
    },

    editItem(item) {
      this.promocao = {...item};
      this.ativo = true;
    },

    async deleteItem(item) {
      try {
        if (confirm(`Deseja deletar o registro com ID ${item.id}?`)) {
          await this.$api.delete(`/promocoes/${item.id}`);
          this.$toast.success('Promoção excluída com sucesso!');
          await this.getItems();
        }
      } catch (e) {
        this.$toast.error('Erro ao excluir promoção!');
      }
    },

    async getItems() {
      const response = await this.$api.get('/promocoes');
      const promocoes = response.data;

      this.items = promocoes.map(promocao => {
        const produto = this.produtos.find(p => p.id === promocao.id_produto);
        return {
          ...promocao,
          produtoNome: produto ? produto.nome : 'Desconhecido'
        };
      });

      this.loading = false;
    },

    async getProdutos() {
      const response = await this.$api.get('/produto');
      this.produtos = response.data;
    },

    formatDate(date) {
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return new Date(date).toLocaleDateString('pt-BR', options);
    }
  }
};
</script>

<style scoped>
.mt-5 {
  margin-top: 2rem;
}
</style>
