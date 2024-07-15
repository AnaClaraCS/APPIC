class Local {
  constructor( { descricao, x, y, idArea}, idLocal = '') {
    this.idLocal = idLocal;
    this.descricao = descricao;
    this.x = x;
    this.y = y;
    this.idArea = idArea;
  }
}
  
export default Local;
  