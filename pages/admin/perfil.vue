<template>
  <v-container class="justify-center mt-5">
    <TabelaDados  @editItem="editItem" @abrirDialog="() => ativo = true" titulo="Perfis" :loading="loading" @deleteItem="deleteItem" :headers="headers" :items="items"></TabelaDados>
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
              {{ tituloDialog }} um Perfil
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
                v-model="perfil.id"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                variant="outlined"
                label="Nome"
                placeholder="Nome"
                v-model="perfil.nomePerfil"
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
definePageMeta({
  layout: "admin"
})
export default {
  data: () => {
    return {
      dialog: false,
      valor: 0,
      ativo: false,
      loading: true,
      textoUsuario: null,
      loadingSave: false,
      perfil: {
        id: null,
        nomePerfil: null,
      },
      headers: [
        {
          title: 'Identificador',
          key: 'id'
        },
        {
          title: 'Nome',
          key: 'nomePerfil'
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
      return this.perfil.id ? 'Editar': 'Criar';
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
      this.perfil = {
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
        if (this.perfil.id) {
          const response = await this.$api.patch(`/perfil/${this.perfil.id}`, this.perfil);
        } else {
          const response = await this.$api.post('/perfil/', this.perfil);
        }
        this.$toast.success(`Perfil ${this.perfil.id ? 'editado' : 'criado'} com sucesso!`);
      } catch (e) {
        this.$toast.error(`Erro ao ${this.perfil.id ? 'editar' : 'criar'} perfil!`);
      }
      this.resetAtividade()
      await this.getItems();
      this.loadingSave = false;
    },

    editItem(item) {
      this.perfil = {
        ...item
      };
      this.ativo = true;
    },

    async deleteItem(item) {
      try {
        if (confirm(`Deseja deletar o registro com id ${item.id}`)) {
          const response = await this.$api.delete(`/perfil/${item.id}`  );
          this.$toast.success('Excluido com sucesso')
        }
      } catch (e) {
        this.$toast.error('Erro ao excluir um perfil!')
      }
      await this.getItems();
    },

    async getItems() {
      const response = await this.$api.get('/perfil');
      this.items = response.data;
      this.loading = false;
    }
  }
}
</script>
