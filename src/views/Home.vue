<template>
<v-container fluid grid-list-xl>
  <v-layout justify-center row fill-height>
    <v-flex xs12 md10>
      <v-card flat class="pa-5 card">

        <v-card-title >
          <v-layout row wrap>
            <v-flex xs12 class="title py-0">Folha de Ponto</v-flex>
            <v-flex xs12 sm12 md4>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Pesquisa"
                single-line
                hide-details
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="records"
          :search="search"
          :loading="loading"
          no-data-text="Sem pontos para mostrar" 
          no-results-text="Nenhum resultado encontrado"
          rows-per-page-text="Linhas por página"
        >
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
          <template v-slot:items="props">
            <td>{{ props.item.day}}</td>
            <td>{{ props.item.name }}</td>
            <td >
              <div v-for="hour in props.item.punchIn " :key="hour.time">
                {{ hour | showHours }}
              </div>
            </td>
            <td>
              <div v-for="hour in props.item.pauseStart" :key="hour.time">
                {{ hour | showHours }}
              </div>
            </td>
            <td>
              <div v-for="hour in props.item.pauseEnd" :key="hour.time">
                {{ hour | showHours }}
              </div>
            </td>
            <td>
              <div v-for="hour in props.item.punchOut" :key="hour.time">
                {{ hour | showHours }}
              </div>
            </td>
          </template>
          <template v-slot:pageText="props">
            {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
          </template>
        </v-data-table>

      </v-card>

    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { folha_de_ponto } from '../api';
import moment from "moment";
import 'moment/locale/pt-br' 

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
      records: [],
      loading: true,
    }
  },
  mounted() {
    folha_de_ponto
      .list()
      .then(ret => {
        const employees = ret.data.employees;
        const days = ret.data.days;

        this.records = days.map( d => {
          const { punchIn, pauseStart, pauseEnd, punchOut } = d.pontos.reduce( (acc, p) => {
            switch(p.kind) {
              case "entrada": acc.punchIn.push(p); break;
              case "saída": acc.punchOut.push(p); break;
              case "início da pausa": acc.pauseStart.push(p); break;
              case "retorno da pausa": acc.pauseEnd.push(p); break;
            }
            return acc;
          }, { punchIn: [], pauseStart: [], pauseEnd: [], punchOut: [], });

          return {
            day: moment(d.day).format("DD/MM/YYYY - dddd"),
            name: employees.find(e => e.id === d.employee).name,
            punchIn: punchIn,
            pauseStart: pauseStart,
            pauseEnd: pauseEnd,
            punchOut: punchOut,
          }
        });
      })
      .catch(err => {
        // eslint-disable-next-line 
        console.error(err);
        alert("Não foi possível carregar os dados!");
      })
      .then(() => {
        this.loading = false;
      });
  },
  filters: {
    showHours(h) {
      if(h) {
        return moment(h.time).format("HH:mm");
      } else return "-";
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}
.title {
  font-size: 40px !important;
  border-left: 5px solid #00bcd4;
  padding-left: 5px;
}
</style>
