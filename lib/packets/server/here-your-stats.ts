import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

type Stat = {
  current: number;
  base: number;
};

export type Data = {
  attributes: {
    physique: Stat;
    coordination: Stat;
    reasoning: Stat;
    will: Stat;
    instinct: Stat;
    vitality: Stat;
  };
  nexus: {
    human: Stat;
    animal: Stat;
    vegetal: Stat;
    inorganic: Stat;
    artificial: Stat;
    magic: Stat;
  };
  skills: {
    attack: Stat;
    defense: Stat;
    harvesting: Stat;
    alchemy: Stat;
    magic: Stat;
    potion: Stat;
    summoning: Stat;
    manufacturing: Stat;
    crafting: Stat;
    engineering: Stat;
    tailoring: Stat;
    ranging: Stat;
    overall: Stat;
  };
  carryCapacity: Stat;
  materialPoints: Stat;
  etherealPoints: Stat;
  actionPoints: Stat;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);

    return {
      attributes: {
        physique: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        coordination: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        reasoning: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        will: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        instinct: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        vitality: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
      },
      nexus: {
        human: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        animal: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        vegetal: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        inorganic: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        artificial: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        magic: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
      },
      skills: {
        attack: {
          current: reader.offset(16).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        defense: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        harvesting: {
          current: reader.offset(-20).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        alchemy: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        magic: {
          current: reader.offset(12).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        potion: {
          current: reader.read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        summoning: {
          current: reader.offset(86).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        manufacturing: {
          current: reader.offset(-122).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        crafting: {
          current: reader.offset(126).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        engineering: {
          current: reader.offset(8).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        tailoring: {
          current: reader.offset(8).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        ranging: {
          current: reader.offset(8).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
        overall: {
          current: reader.offset(-158).read({ type: 'UInt16LE' }),
          base: reader.read({ type: 'UInt16LE' }),
        },
      },
      carryCapacity: {
        current: reader.offset(16).read({ type: 'UInt16LE' }),
        base: reader.read({ type: 'UInt16LE' }),
      },
      materialPoints: {
        current: reader.read({ type: 'UInt16LE' }),
        base: reader.read({ type: 'UInt16LE' }),
      },
      etherealPoints: {
        current: reader.read({ type: 'UInt16LE' }),
        base: reader.read({ type: 'UInt16LE' }),
      },
      actionPoints: {
        current: reader.offset(134).read({ type: 'UInt16LE' }),
        base: reader.read({ type: 'UInt16LE' }),
      },
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.attributes.physique.current })
      .write({ type: 'UInt16LE', value: data.attributes.physique.base })
      .write({ type: 'UInt16LE', value: data.attributes.coordination.current })
      .write({ type: 'UInt16LE', value: data.attributes.coordination.base })
      .write({ type: 'UInt16LE', value: data.attributes.reasoning.current })
      .write({ type: 'UInt16LE', value: data.attributes.reasoning.base })
      .write({ type: 'UInt16LE', value: data.attributes.will.current })
      .write({ type: 'UInt16LE', value: data.attributes.will.base })
      .write({ type: 'UInt16LE', value: data.attributes.instinct.current })
      .write({ type: 'UInt16LE', value: data.attributes.instinct.base })
      .write({ type: 'UInt16LE', value: data.attributes.vitality.current })
      .write({ type: 'UInt16LE', value: data.attributes.vitality.base })
      .write({ type: 'UInt16LE', value: data.nexus.human.current })
      .write({ type: 'UInt16LE', value: data.nexus.human.base })
      .write({ type: 'UInt16LE', value: data.nexus.animal.current })
      .write({ type: 'UInt16LE', value: data.nexus.animal.base })
      .write({ type: 'UInt16LE', value: data.nexus.vegetal.current })
      .write({ type: 'UInt16LE', value: data.nexus.vegetal.base })
      .write({ type: 'UInt16LE', value: data.nexus.inorganic.current })
      .write({ type: 'UInt16LE', value: data.nexus.inorganic.base })
      .write({ type: 'UInt16LE', value: data.nexus.artificial.current })
      .write({ type: 'UInt16LE', value: data.nexus.artificial.base })
      .write({ type: 'UInt16LE', value: data.nexus.magic.current })
      .write({ type: 'UInt16LE', value: data.nexus.magic.base })
      .write({ type: 'UInt16LE', value: data.skills.manufacturing.current })
      .write({ type: 'UInt16LE', value: data.skills.manufacturing.base })
      .write({ type: 'UInt16LE', value: data.skills.harvesting.current })
      .write({ type: 'UInt16LE', value: data.skills.harvesting.base })
      .write({ type: 'UInt16LE', value: data.skills.alchemy.current })
      .write({ type: 'UInt16LE', value: data.skills.alchemy.base })
      .write({ type: 'UInt16LE', value: data.skills.overall.current })
      .write({ type: 'UInt16LE', value: data.skills.overall.base })
      .write({ type: 'UInt16LE', value: data.skills.attack.current })
      .write({ type: 'UInt16LE', value: data.skills.attack.base })
      .write({ type: 'UInt16LE', value: data.skills.defense.current })
      .write({ type: 'UInt16LE', value: data.skills.defense.base })
      .write({ type: 'UInt16LE', value: data.skills.magic.current })
      .write({ type: 'UInt16LE', value: data.skills.magic.base })
      .write({ type: 'UInt16LE', value: data.skills.potion.current })
      .write({ type: 'UInt16LE', value: data.skills.potion.base })
      .write({ type: 'UInt16LE', value: data.carryCapacity.current })
      .write({ type: 'UInt16LE', value: data.carryCapacity.base })
      .write({ type: 'UInt16LE', value: data.materialPoints.current })
      .write({ type: 'UInt16LE', value: data.materialPoints.base })
      .write({ type: 'UInt16LE', value: data.etherealPoints.current })
      .write({ type: 'UInt16LE', value: data.etherealPoints.base })
      .offset(74)
      .write({ type: 'UInt16LE', value: data.skills.summoning.current })
      .write({ type: 'UInt16LE', value: data.skills.summoning.base })
      .offset(8)
      .write({ type: 'UInt16LE', value: data.skills.crafting.current })
      .write({ type: 'UInt16LE', value: data.skills.crafting.base })
      .offset(8)
      .write({ type: 'UInt16LE', value: data.skills.engineering.current })
      .write({ type: 'UInt16LE', value: data.skills.engineering.base })
      .offset(8)
      .write({ type: 'UInt16LE', value: data.skills.tailoring.current })
      .write({ type: 'UInt16LE', value: data.skills.tailoring.base })
      .offset(8)
      .write({ type: 'UInt16LE', value: data.skills.ranging.current })
      .write({ type: 'UInt16LE', value: data.skills.ranging.base })
      .offset(8)
      .write({ type: 'UInt16LE', value: data.actionPoints.current })
      .write({ type: 'UInt16LE', value: data.actionPoints.base })
      .buffer();
  },
};
