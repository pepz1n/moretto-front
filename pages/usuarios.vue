<template>
  <v-container class="justify-center mt-5">
    <TabelaDados  :editBool="false" :deleteBool="false" :criarBool="false" :viewBool="true" @viewItem="viewItem"  titulo="Usuarios" :loading="loading" :headers="headers" :items="items"></TabelaDados>
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
              Visualizar um Usuarios
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
              v-model="atividade.id"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              label="Nome"
              placeholder="Nome"
              readonly
              v-model="atividade.nomeCompleto"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              variant="outlined"
              readonly
              label="Email"
              placeholder="email"
              v-model="atividade.email"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              label="CPF/CNPJ"
              readonly
              placeholder="CPF/CNPJ"
              v-model="atividade.cpfCnpj"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
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
      atividade: {
        id: null,
        nome: null,
        nomeCompleto: null,
        email: null,
        cpfCnpj: null,
      },
      headers: [
        {
          title: 'Identificador',
          key: 'id'
        },
        {
          title: 'Nome',
          key: 'nomeCompleto'
        },
        {
          title: 'Email',
          key: 'email'
        },
        {
          title: 'CPF/CNPJ',
          key: 'cpfCnpj'
        },
        {
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

  watch: {
    ativo(valor) {
      if (valor == false) {
        this.resetAtividade()
      }
    }
  },

  methods: {
    resetAtividade() {
      this.atividade = {
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
      if (this.atividade.id) {
        const response = await this.$api.post(`/atividade/persist/${this.atividade.id}`, this.atividade);
      } else {
        const response = await this.$api.post('/atividade/persist', this.atividade);
      }
      this.resetAtividade()
      await this.getItems();
    },

    viewItem(item) {
      this.atividade = {
        ...item
      };
      this.ativo = true;
    },

    async deleteItem(item) {
      if (confirm(`Deseja deletar o registro com id ${item.id}`)) {
        const response = await this.$api.post('/atividade/destroy'  );
        if (response.type == 'error') {
          this.$toast.error('Erro ao excluir')
        } else {
          this.$toast.success('Excluido com sucesso')
        }
      }
      await this.getItems();
    },

    async getItems() {
/**
*
*/
      const response = await this.$api.get('/usuario');
      this.items = response.data;
      this.loading = false;
    }
  }
}
</script>
