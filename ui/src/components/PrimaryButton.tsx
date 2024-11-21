
import React from "react";
import { FC } from "react";



type PrimaryButtonProps =  {
  text : string,
  onClick : () => void;
}


export const PrimaryButton : FC<PrimaryButtonProps> = ({text, onClick}) => {

  return (
    <div className="w-fit h-fit p-4 bg-secondaryBG rounded-md" onClick={onClick}>
      <h1 className="text-primaryBG">{text}</h1>
    </div>
  )
}