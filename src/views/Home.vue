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
      :loading="loading"
      no-data-text="Sem pontos para mostrar" 
      no-results-text="Nenhum resultado encontrado"
      rows-per-page-text="Linhas por página"
    >
      <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
      <template v-slot:items="props">
        <td>{{ props.item.day}}</td>
        <td>{{ props.item.name }}</td>
        <td>
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
</template>

<script>
import { folha_de_ponto } from '../api';
import moment from "moment";
import 'moment/locale/pt-br' 

const convertArrayToObject = (array, index) => 
  array.reduce( (obj, item) => {
    obj[item[index]] = item;
    return obj;
  }, {});


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
        console.log(err);
        alert("Não foi possível carregar os dados!");
      })
      .then(_ => {
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
</style>
