import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../../../config/database";
import { User } from "../../user/module/user.model";

export class Meeting extends Model<
  InferAttributes<Meeting>,
  InferCreationAttributes<Meeting>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare startTime: Date;
  declare endTime: Date;
}

Meeting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },

    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_time",
    },

    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_time",
    },
  },
  {
    sequelize,
    tableName: "meetings",
    timestamps: true,
    underscored: true,
  },
);
