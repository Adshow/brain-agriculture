export class Propriedade {
  constructor(
    public readonly id: string,
    public nome: string,
    public cidade: string,
    public estado: string,
    public areaTotal: number,
    public areaAgricultavel: number,
    public areaVegetacao: number,
    public produtorId: string,
  ) {}
}
