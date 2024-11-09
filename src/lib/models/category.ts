import {Schema ,model , models} from "mongoose"

const CategoryShema=new Schema(
    {
        title:{type:"string", required:true},
        description:{type:"string"},
        user: { type: Schema.Types.ObjectId, ref: "User" },
    }
)

const Category=models.Category || model("Category", CategoryShema);

export default Category;