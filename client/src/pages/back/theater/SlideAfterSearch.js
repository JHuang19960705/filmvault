import React from "react";
import { Link } from "react-router-dom";
const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function SlideAfterSearch({ data, handleNewSlide }) {
  return (
    <tbody className="text-gray-600 dark:text-gray-100">
      <tr className="hidden md:table-row">
        <td className="sm:p-3 py-2 px-1 w-1/4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center"><p className="w-[140px] truncate">{data.original_name || data.title}</p></div>
        </td>
        <td className="sm:p-3 py-2 px-1 w-1/4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <a className="imageContainer">
              <Link to={`/movie/${data.id}`} className="imageContainer" target="_blank">
                <img className="w-20" src={tmdbBaseURL + data.poster_path} />
              </Link>
            </a>
          </div>
        </td>
        <td className="sm:p-3 py-2 px-1 w-1/4 border-b border-gray-200 dark:border-gray-600">
          {data.first_air_date && data.first_air_date || data.release_date}
        </td>
        <td className="sm:p-3 py-2 px-1 w-1/4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <button onClick={() => { handleNewSlide(data.backdrop_path, data.poster_path) }} className="rounded-ln bg-blue-50 w-[100px] py-2 dark:text-blue-900">選取slide</button>
          </div>
        </td>
      </tr>
      <div className="mb-5 flex justify-center md:justify-around items-center border-b border-grey-dark pb-5 md:hidden">
        <div className="w-1/3">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <Link to={`/movie/${data.id}`} className="imageContainer" target="_blank">
              <img className="w-20" src={tmdbBaseURL + data.poster_path} />
            </Link>
          </div>
        </div>
        <div className="pl-4">
          <div className="w-[150px] mt-2 text-base font-bold text-secondary truncate ">{data.original_name || data.title}</div>
          <div className="block font-hk text-secondary">{data.first_air_date && data.first_air_date || data.release_date}</div>
          <div>
            <button onClick={() => { handleNewSlide(data.backdrop_path, data.poster_path) }} className="rounded-ln bg-blue-50 w-[100px] py-2 text-blue-500 dark:text-blue-900">選取slide</button>
          </div>
        </div>
      </div>
    </tbody>
  );
}