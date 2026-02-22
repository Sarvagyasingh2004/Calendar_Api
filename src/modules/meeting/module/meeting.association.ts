import { Meeting } from "./meeting.model";
import { User } from "../../user/module/user.model";

User.hasMany(Meeting, {
  foreignKey: "userId",
  as: "meetings",
});

Meeting.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
