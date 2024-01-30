// plugins
const config = require("../configs/app");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorUnauthorized,
} = require("../configs/errorMethods");
//model
const Monster = require("../models/Monster");
const LandClass = require("../models/LandClass");
const LandCode = require("../models/LandCode");
const landClassService = require("./landClass.service");
const Asset = require("../models/Asset");
const methods = {
  getMonster(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const no = "Mon" + ("00000000" + id).slice(-3);
        const obj = await Monster.findOne({ no })
          .populate("SK1")
          .populate("SK2")
          .populate("SK3")
          .populate("SK4");
        if (obj) {
          let metadata = {
            no: obj.no,
            name: obj.name,
            image:
              process.env.BASEURL + "/images/monsters/" + obj.monUI + ".png",
            card: process.env.BASEURL + "/images/card/" + obj.monUI + ".jpg",
            class: obj.class,
            type: obj.type,
            rank: obj.rank,
            power: obj.power,
            description: "Monster in BitmonsterNFT",
            attributes: {
              height: obj.height,
              weight: obj.weight,
            },
            stat: {
              hp: obj.hp,
              POW: obj.POW,
              DEF: obj.DEF,
              ACC: obj.ACC,
              SPD: obj.SPD,
              CRI: obj.CRI,
            },
            perLv: {
              hp: obj.HPxLv,
              POW: obj.POWxLv,
              DEF: obj.DEFxLv,
              ACC: obj.ACCxLv,
              SPD: obj.SPDxLv,
              CRI: obj.CRIxLv,
            },
            skill: [],
            status: {
              life: obj.life,
              food: obj.food,
              breed: obj.breed,
              habit: obj.habit,
            },
          };

          metadata.skill[0] =
            obj.SK1 != null
              ? {
                  name: obj.SK1.name,
                  type: obj.SK1.type,
                  element: obj.SK1.element,
                  energy: obj.SK1.energy,
                  target: obj.SK1.target,
                  POW: obj.SK1.POW,
                  ACC: obj.SK1.ACC,
                  CRI: obj.SK1.CRI,
                  effect: obj.SK1.effect,
                }
              : null;
          metadata.skill[1] =
            obj.SK2 != null
              ? {
                  name: obj.SK2.name,
                  type: obj.SK2.type,
                  element: obj.SK2.element,
                  energy: obj.SK2.energy,
                  target: obj.SK2.target,
                  POW: obj.SK2.POW,
                  ACC: obj.SK2.ACC,
                  CRI: obj.SK2.CRI,
                  effect: obj.SK2.effect,
                }
              : null;
          metadata.skill[2] =
            obj.SK3 != null
              ? {
                  name: obj.SK3.name,
                  type: obj.SK3.type,
                  element: obj.SK3.element,
                  energy: obj.SK3.energy,
                  target: obj.SK3.target,
                  POW: obj.SK3.POW,
                  ACC: obj.SK3.ACC,
                  CRI: obj.SK3.CRI,
                  effect: obj.SK3.effect,
                }
              : null;
          metadata.skill[3] =
            obj.SK4 != null
              ? {
                  name: obj.SK4.name,
                  type: obj.SK4.type,
                  element: obj.SK4.element,
                  energy: obj.SK4.energy,
                  target: obj.SK4.target,
                  POW: obj.SK4.POW,
                  ACC: obj.SK4.ACC,
                  CRI: obj.SK4.CRI,
                  effect: obj.SK4.effect,
                }
              : null;
          resolve(metadata);
        } else {
          reject(ErrorNotFound("Monster not found"));
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  getLand(zone, code, index) {
    return new Promise(async (resolve, reject) => {
      try {
        const objLandCode = await LandCode.findOne({ _id: "L" + code });
        const landClass = landClassService.getClassWithCodeAndIndex(
          code,
          index
        );
        const objLandClass = await LandClass.findOne({ _id: landClass });
        if (zone > 0 && objLandCode && objLandClass) {
          let metadata = {
            name: objLandCode.land,
            description: "Land in BitmonsterNFT",
            image:
              process.env.BASEURL + "/images/lands/" + objLandCode._id + ".png",
            zone: zone,
            code: objLandCode.indexChar + code,
            category: objLandCode._id,
            class: objLandClass._id,
            maxItem: objLandClass.maxItem,
          };
          resolve(metadata);
        } else {
          reject(ErrorNotFound("Land not found"));
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  getTypeItem() {
    return {
      T1: "Food",
      T2: "Resource",
      T3: "Energy",
      T4: "Token",
      T5: "Status",
    };
  },
  getItem(id) {
    const reward = methods.getTypeItem();
    return new Promise(async (resolve, reject) => {
      try {
        const no = "I" + ("00000000" + id).slice(-4);
        const obj = await Asset.findOne({ no });
        if (obj) {
          let metadata = {
            no: obj.no,
            name: obj.name,
            description: "Item in BitmonsterNFT",
            image: process.env.BASEURL + "/images/items/" + obj.no + ".png",
            class: obj.class,
            category: obj.category,
            attributes: {},
          };
          if (obj.category == "BUILD") {
            metadata.attributes = {
              type: obj.type,
              landCategory: obj.landCode != null ? obj.landCode : ["All"],
              size: obj.size,
              benefit: reward[obj.type],
            };
            if (obj.type == "T5") {
              metadata.attributes.status = obj.status;
            } else if (
              obj.type == "T1" ||
              obj.type == "T2" ||
              obj.type == "T3" ||
              obj.type == "T4"
            ) {
              metadata.attributes.time = obj.time;
              metadata.attributes.incrementPerTime = obj.num;
            }
          }
          resolve(metadata);
        } else {
          reject(ErrorNotFound("Item not found"));
        }
      } catch (e) {
        reject(e);
      }
    });
  },
};

module.exports = { ...methods };
