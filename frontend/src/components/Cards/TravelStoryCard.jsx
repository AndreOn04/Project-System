/* eslint-disable no-unused-vars */
import { data } from "autoprefixer";
import moment from "moment/moment";
import React from "react";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onclick,
}) => {
  return (
    <div className=" border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-56 object-cover rounded-lg"
        onclick={onclick}
      />

      <div className="p-4" onclick={onclick}>
         <div className="flex items-center gap-3">
            <div className="flex-1">
                <h6 className="text-sm font-medium"> { title } </h6>
                <span className=" text-xs text-slade-500 ">
                   { data ? moment(data).format(" DD/MMM/YYYY ") : "-" }
                </span>
            </div>
         </div>

        <p className="text-xs text-slate-600 mt-2 "> { story?.slice(0, 60) } </p>

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1 ">
            <GrMapLocation className="text-sm" />
            { visitedLocation.map((item, index) =>
                visitedLocation.length == index + 1 ? ` ${item} ` : `${item}, `
            )}
        </div>       

      </div>
    </div>
  );
};

export default TravelStoryCard;
{/* { date ? moment(date).format(" Do/MMM/YYYY ") : "-" } */}
