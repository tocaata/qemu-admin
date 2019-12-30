
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    handleCurrentChange(value) {
      this.pageIndex = value;
      this.search();
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.search();
    },
  }
}
