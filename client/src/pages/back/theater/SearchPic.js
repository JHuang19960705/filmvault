import React, { useState } from "react";
import axios from "axios";
import Search2 from "../../../../components/Search2";
import SlideAfterSearch from "./SlideAfterSearch";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function SearchPic({ newOnTime, setNewOnTime }) {
  let [input, setInput] = useState("");
  let [data, setData] = useState(null);
  const searchURL = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${input}&page=1&include_adult=false`;

  const search = async (URL) => {
    let result = await axios.get(URL);
    setData(result.data.results);
  };

  return (
    <div>
      <div className="relative mt-2" >
        <Search2 search={() => { search(searchURL); }} setInput={setInput} />
      </div>
      <button className="p-3 w-full flex flex-col rounded-md dark:bg-gray-800 relative focus:outline-none">
        <div className="flex w-full items-center mb-7">
          <button className="inline-flex mr-3 items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0">
            <svg viewBox="0 0 24 24" className="w-4 mr-2 text-gray-400 dark:text-gray-600" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Last 30 days
            <svg viewBox="0 0 24 24" className="w-4 ml-1.5 text-gray-400 dark:text-gray-600" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <button className="inline-flex items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0">
            Filter by
            <svg viewBox="0 0 24 24" className="w-4 ml-1.5 text-gray-400 dark:text-gray-600" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className="ml-auto text-gray-500 text-xs sm:inline-flex hidden items-center">
            <span className="mr-3">Page 2 of 4</span>
            <button className="inline-flex mr-2 items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">
              <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">
              <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">片名</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">海報</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">國家</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">類型</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 sm:text-gray-400">時間</th>
            </tr>
          </thead>
          {
            data && data.map((d) => {
              if (d.poster_path && d.original_name) {
                return (
                  <SlideAfterSearch data={d} newOnTime={newOnTime} setNewOnTime={setNewOnTime} />
                )
              }
            })
          }
        </table>
        <div className="flex w-full mt-5 space-x-2 justify-end">
          <button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">
            <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">1</button>
          <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-white leading-none">2</button>
          <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">3</button>
          <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">4</button>
          <button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">
            <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </button>
    </div>
  );
}
