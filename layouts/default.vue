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
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            subtitle="sandra_a88@gmailcom"
            title="Sandra Adams"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home" to="/" title="Home" value="starred"></v-list-item>
          <v-list-item prepend-icon="mdi-account" to="/usuarios" title="Usuarios" value="shared"></v-list-item>
          <v-list-item prepend-icon="mdi-account-box-multiple" to="/perfil" title="Perfis" value="starred"></v-list-item>
          <v-list-item prepend-icon="mdi-cart" to="/produto" title="Produtos" value="starred"></v-list-item>
          <v-list-item prepend-icon="mdi-star" to="/favoritos" title="Favoritos" value="starred"></v-list-item>
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
  name: 'default'
}
</script>
