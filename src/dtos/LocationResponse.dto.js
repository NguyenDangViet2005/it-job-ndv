class ProvinceResponse {
  constructor(province) {
    this.id = province.id;
    this.name = province.name;
  }
}

class WardResponse {
  constructor(ward) {
    this.id = ward.id;
    this.provinceId = ward.provinceId;
    this.name = ward.name;
  }
}

module.exports = { ProvinceResponse, WardResponse };
