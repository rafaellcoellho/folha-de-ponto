<template>
  <v-card>

    <v-card-title>
      <h1>Folha de Pontos</h1>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Pesquisa"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="records"
      :search="search"
      no-data-text="Sem pontos para mostrar" 
    >
      <template v-slot:items="props">
        <td>{{ props.item.day }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.punchIn }}</td>
        <td>{{ props.item.pauseStart }}</td>
        <td>{{ props.item.pauseEnd }}</td>
        <td>{{ props.item.punchOut }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      headers: [
        { text: 'Dia', align: 'left', value: 'day' },
        { text: 'Funcionário', value: 'name'},
        { text: 'Entrada', value: 'punchIn', sortable: false },
        { text: 'Inicio da Pausa', value: 'pauseStart', sortable: false },
        { text: 'Retorno da Pausa', value: 'pauseEnd', sortable: false },
        { text: 'Saída', value: 'punchOut', sortable: false }
      ],
      records: []
    }
  },
}
</script>
