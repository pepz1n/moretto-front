<template>
  <v-container class="justify-center mt-5">
    <TabelaDados  :editBool="false" :deleteBool="false" :criarBool="false" :viewBool="true" @viewItem="viewItem"  titulo="Usuarios" :loading="loading" :headers="headers" :items="items"></TabelaDados>
  </v-container>
  <v-dialog
      v-model="ativo"
      max-width="750"
      class="d-flex justify-center"
  >
    <v-card width="700" height="500">
      <v-tabs
          v-model="tab"
          align-tabs="center"
          color="deep-purple-accent-4"
      >
        <v-tab :value="0">Usuario</v-tab>
        <v-tab :value="1">Perfil</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          :value="0"
        >
          <v-card-title>
            <v-row>
              <v-col cols="10">
                <h2>
                  Visualizar um Usuarios
                </h2>
              </v-col>
              <v-col class="d-flex justify-end" >
                <v-icon color="red" @click="ativo = false" class="mt-1" size="x-large">
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
        </v-tabs-window-item>
        <v-tabs-window-item
          :value="1"
        >
          <v-card-title>
            <v-row>
              <v-col cols="10">
                <h2>
                  Gerenciar Perfil
                </h2>
              </v-col>
              <v-col class="d-flex justify-end" >
                <v-icon color="red" @click="ativo = false" class="mt-1" size="x-large">
                  mdi-close
                </v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="">
            <v-row>
              <v-col>
                <h5>
                  Perfis Ativos:
                </h5>
              </v-col>
              <v-col>
                <h5>
                  Perfis inativos:
                </h5>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-chip closable @click:close="excluirPerfilUser(ativo.idUsuarioPerfil)" class="ma-1" variant="flat" color="green" v-for="(ativo) in perfis.perfisUsuarioContem" :key="ativo.idUsuarioPerfil">
                  {{ ativo.nomePerfil }}
                </v-chip>
              </v-col>
              <v-col>
                <v-chip closable close-icon="mdi-plus" @click:close="adicionarPerfilUser(ativo.id)" class="ma-1" variant="flat" color="red" v-for="(ativo) in perfis.perfisUsuarioNaoContem" :key="ativo.id">
                  {{ ativo.nomePerfil }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-tabs-window-item>
      </v-tabs-window>
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
      tab: 0,
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
      perfis: {
        perfisUsuarioNaoContem: [],
        perfisUsuarioContem: [],
      }
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
        nomeCompleto: null,
        email: null,
        cpfCnpj: null,
      }
      this.ativo = false;
    },

    async viewItem(item) {
      this.atividade = {
        ...item
      };
      await this.getPerfisUser();
      this.ativo = true;
    },


    async getItems() {
      const response = await this.$api.get('/usuario');
      this.items = response.data;
      this.loading = false;
    },

    async excluirPerfilUser(idPerfilUsuario) {
      try {
        await this.$api.delete(`/usuario-perfil/${idPerfilUsuario}`);
        await this.getPerfisUser();
        return this.$toast.success('Perfil removido do Usuario!')
      } catch (e) {
        return this.$toast.error('Erro ao excluir perfil')
      }
    },

    async adicionarPerfilUser(idPerfil) {
      try {
        await this.$api.post(`/usuario-perfil/`, {
          idPerfil,
          idUsuario: this.atividade.id,
        });
        await this.getPerfisUser();
        return this.$toast.success('Perfil adicionado ao Usuario!')
      } catch (e) {
        return this.$toast.error('Erro ao adicionar perfil')
      }
    },

    async getPerfisUser() {
      const perfis = await this.$api.get(`/usuario-perfil/perfis-by-user/${this.atividade.id}`);
      this.perfis = perfis.data;
    }
  }
}
</script>
