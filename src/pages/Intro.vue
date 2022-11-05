<template>
  <div>
    <header class="navbar navbar-dark bg-dark shadow-sm">
      <span class="title">
        {{ editMode ? 'Setting' : 'Napatsorn' }}
        <b-form-input v-model="currentName"></b-form-input>
      </span>
      <div class="ml-auto">
        <button class="btn btn-secondary mr-2" @click="onSave" v-if="!editMode">
          Save
        </button>
        <button class="btn btn-secondary mr-2" @click="$bvModal.show('list-modal')" v-if="!editMode">
          List
        </button>
        <button class="btn btn-secondary" @click="onEdit">
          {{ editMode ? 'Finish' : 'Setting' }}
        </button>
      </div>
    </header>
    <main>
      <div class="m-4">
        <div class="row">
          <div class="column col-3" v-for="(label, i) in labels" :key="i">
            <div class="check-card p-1 p-md-3 card mb-4 shadow-sm" @click="cardClick(i)" :style="`background-color: ${colors[i]}`">
              <div class="count-mode" v-if="!editMode">
                <div class="label-view">
                  {{ labels[i] }}
                </div>
                <div class="counter">
                  {{ point[i] }}
                </div>
              </div>
              <div class="edit-mode" v-if="editMode">
                <b-form-input v-model="labels[i]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <b-modal id="list-modal" title="List" hide-footer>
      <b-list-group>
        <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="row in pointData" :key="row.id">
          {{ row.name }}
          <span>
            <button class="btn btn-sm btn-primary mr-2" @click="onShowItem(row)">Show</button>
            <button class="btn btn-sm btn-danger" @click="onDelete(row.id)">Delete</button>
          </span>
        </b-list-group-item>
      </b-list-group>
      <div class="text-center mt-3">
        <button class="btn btn-secondary" @click="onDownload">
          Download as Excel
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ExcelJS from 'exceljs';
export default {
  name: 'Intro',
  components: {
  },
  data() {
    return {
      currentName: '',
      pointData: [],
      labels: [],
      point: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0
      },
      colors: [
        '#6C464F',
        '#6A994E',
        '#9FA4C4',
        '#9E768F',
        '#BC4749',
        '#264653',
        '#2A9D8F',
        '#E9C46A',
        '#F4A261',
        '#E76F51',
        '#EF476F',
        '#118AB2',
        '#472D30',
        '#353535',
        '#284B63',
        '#6D6875'
      ],
      editMode: false
    };
  },
  created() {
    let labels = localStorage.getItem('labels');
    labels = labels ? JSON.parse(labels) : Array.from(Array(16).keys()).map(i => `Category ${i + 1}`);
    this.labels = labels;

    let data = localStorage.getItem('pointData');
    data = data ? JSON.parse(data) : [];
    this.pointData = data;
  },
  methods: {
    onDownload() {
      new ExcelJS.Workbook();
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('sheet1');

      const newArr = this.pointData.map((row) => {
        const newRow = {};
        Array.from(Array(16).keys()).map((i) => {
          newRow[`c-${i}`] = row.point[i];
        });
        newRow.date = new Date(row.id).toLocaleString('en-gb');
        newRow.name = row.name;

        return newRow;
      });

      const cols = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Date', key: 'date', width: 20 }
      ];
      cols.push(...Array.from(Array(16).keys()).map((i) => {
        const header = this.labels[i];
        const key = `c-${i}`;
        return {header, key}
      }));
      
      console.log(cols);
      sheet.columns = cols;

      console.log(newArr);
      newArr.map((item) => {
        console.log(item);
        sheet.addRow(item);
      });

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        // 파일명
        anchor.download = `data_${new Date().getTime()}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    },
    cardClick(i) {
      if (this.editMode) return;

      this.point[i] = this.point[i] + 1;
    },
    onEdit(e) {
      e.target.blur();
      if (this.editMode) {
        this.editMode = false;
        localStorage.setItem('labels', JSON.stringify(this.labels));
      } else {
        this.editMode = true;
      }
    },
    onDelete(id) {
      const index = this.pointData.findIndex(o => o.id === id);
      console.log('삭제', id, index);
      this.pointData.splice(index, 1);
      localStorage.setItem('pointData', JSON.stringify(this.pointData));
    },
    onShowItem(row) {
      const points = Object.values(row.point).join(', ');
      const msg = `Name : ${row.name}\nPoint : ${points}\nSave Date : ${new Date(row.id).toLocaleString('en-gb')}`;
      alert(msg);
    },
    onSave() {
      if (!this.currentName) alert('Set session name please.');

      const row = {
        id: new Date().getTime(),
        name: this.currentName,
        point: this.point
      }
      this.pointData.push(row);
      localStorage.setItem('pointData', JSON.stringify(this.pointData));
    }
  }
}
</script>

<style lang="scss">
header {
  .title {
    color: white;
    font-size: 24px;
    font-weight: 400;
  }
  .profile {
    font-size: 16px;
  }
}
.column {
  @media (max-width: 767px) {
    padding-left: 5px!important;
    padding-right: 5px!important;
  }
  .check-card {
    text-align: center;
    color: white;
    .label-view  {
      @media (max-width: 767px) {
        font-size: 10px;
      }
    }
    .counter {
      padding: 20px 0;
      font-size: 32px;
      @media (max-width: 767px) {
        padding: 10px 0;
        font-size: 20px;
      }
    }
    .edit-mode {
      padding: 30px 0;
    }
  }
}
</style>