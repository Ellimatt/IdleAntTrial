import { TogableProduction } from '../units/togableProductions';
import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { World } from '../world';

export class Science implements WorldInterface {

  student: Unit
  scientist: Unit
  university: Unit
  depEdu: Unit

  listScience = Array<Unit>()

  studentProduction: Production
  scientistProduction: Production
  science1Production: Production
  science2Production: Production

  uniProduction: Production

  constructor(public game: GameModel) { }

  public declareStuff() {
    this.student = new Unit(this.game, "scn", "Student",
      "Student yield science.")
    // this.student.types = [Type.Ant, Type.Scientist]

    this.scientist = new Unit(this.game, "scie2", "Scientist Ant",
      "Transform crystal into science.")

    this.university = new Unit(this.game, "univ", "University",
      "University yield science.")

    this.depEdu = new Unit(this.game, "depEdu", "Department of Education",
      "Department of Education yield universities.")

    this.listScience = [this.student, this.scientist, this.university, this.depEdu]
    this.game.lists.push(new TypeList("Science", this.listScience))

    this.studentProduction = new Production(this.university, new Decimal(200), false)
    this.scientistProduction = new Production(this.university, new Decimal(100), false)
    this.science1Production = new Production(this.university, new Decimal(45000))
    this.science2Production = new Production(this.university, new Decimal(100000), false)
    this.uniProduction = new Production(this.university, new Decimal(1000), false)
  }

  public initStuff() {

    this.game.baseWorld.science.addProductor(new Production(this.student))
    this.game.baseWorld.crystal.addProductor(new Production(this.student, new Decimal(-0.01)))

    this.university.addProductor(new Production(this.depEdu, new Decimal(0.1)))
    this.game.baseWorld.science.addProductor(new Production(this.depEdu, new Decimal(-1E5)))

    const specialProduction = new Decimal(15)
    const specialCost = new Decimal(-4)
    const specialFood = new Decimal(1E7)
    const specialRes2 = new Decimal(1E4)

    //    Student
    this.student.actions.push(new BuyAndUnlockAction(this.game,
      this.student,
      [
        new Cost(this.game.baseWorld.food, new Decimal(1000), new Decimal(this.game.buyExp)),
        new Cost(this.game.baseWorld.crystal, new Decimal(100), new Decimal(this.game.buyExp)),
        new Cost(this.game.baseWorld.littleAnt, new Decimal(1), new Decimal(this.game.buyExpUnit))
      ],
      [this.game.baseWorld.science]
    ))

    this.student.actions.push(new UpAction(this.game, this.student,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceExp)]))
    this.student.actions.push(new UpHire(this.game, this.student,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost2, this.game.upgradeScienceHireExp)]))

    //  Scientist
    // this.scientist.types = [Type.Ant]
    this.scientist.actions.push(new BuyAction(this.game,
      this.scientist,
      [
        new Cost(this.game.baseWorld.food, specialFood.div(5), this.game.buyExp),
        new Cost(this.game.baseWorld.crystal, specialRes2.div(5), this.game.buyExp),
        new Cost(this.game.baseWorld.littleAnt, new Decimal(1), this.game.buyExpUnit)
      ]
    ))
    this.game.baseWorld.science.addProductor(new Production(this.scientist, specialProduction.times(2)))
    this.game.baseWorld.crystal.addProductor(new Production(this.scientist, specialCost))

    this.scientist.actions.push(new UpAction(this.game, this.scientist,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceExp)]))
    this.scientist.actions.push(new UpHire(this.game, this.scientist,
      [new Cost(this.game.baseWorld.science, this.game.scienceCost3, this.game.upgradeScienceHireExp)]))

    //  University
    this.university.actions.push(new BuyAction(this.game,
      this.university,
      [
        new Cost(this.game.baseWorld.wood, this.game.machines.price1.times(2), this.game.buyExp),
        new Cost(this.game.baseWorld.crystal, this.game.machines.price2.times(2), this.game.buyExp)
      ]
    ))

    this.game.baseWorld.science.addProductor(this.science1Production)
    this.game.baseWorld.crystal.addProductor(new Production(this.university, specialCost.times(10)))

    this.student.addProductor(this.studentProduction)
    this.scientist.addProductor(this.scientistProduction)

    this.university.togableProductions = [
      new TogableProduction("Generate Students", [this.studentProduction]),
      new TogableProduction("Generate Scientist", [this.scientistProduction])
    ]

    //  Dep
    this.depEdu.actions.push(new BuyAction(this.game,
      this.depEdu,
      [
        new Cost(this.university, new Decimal(2), this.game.buyExpUnit),
        new Cost(this.game.baseWorld.wood, this.game.machines.price1.times(2), this.game.buyExp),
        new Cost(this.game.baseWorld.crystal, this.game.machines.price2.times(2), this.game.buyExp),
        new Cost(this.game.baseWorld.science, this.game.machines.price1.times(2), this.game.buyExp),
      ]
    ))

  }

  public addWorld() {
  }
}
