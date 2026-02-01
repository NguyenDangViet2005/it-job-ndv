class ProvinceResponse {
  constructor(province) {
    this.id = province.id;
    this.name = province.name;
  }
}

class WardResponse {
  constructor(ward) {
    this.id = ward.id;
    this.provinceid = ward.provinceid;
    this.name = ward.name;
  }
}

module.exports = { ProvinceResponse, WardResponse };
