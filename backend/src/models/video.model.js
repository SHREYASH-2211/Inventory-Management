import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
videoFile: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
   
  },
  description: {
    type: String,
    required: true,
   
  },
  thumbnail: {
    type: String,//cloudinary url
    required: true, 
    
  },
  views:{
    type:Number,
   
    dafault:0,
  },
  isPublished:{
    type:Boolean,
    default:false,
  },
  duration:
    {
      type:Number,
      required:true,
    }
  ,
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
},{
    timestamps: true,
  });

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);